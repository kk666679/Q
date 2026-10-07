/**
 * CLI validation tool for QMS generation logs.
 * Validates log integrity, schema conformance, and data consistency.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { ZodError } from 'zod';
import { loadGenerationLog, listLogFiles, parseArgs } from '../utils';
import { GenerationLogSchema } from '../types';
import type { ValidationResult } from '../types';

async function validateFile(filePath: string, verbose: boolean): Promise<ValidationResult> {
  const result: ValidationResult = {
    valid: false,
    file: filePath,
    errors: [],
    warnings: [],
    summary: {
      runCount: 0,
      systems: [],
      dateRange: null,
    },
  };

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);

    // Basic structure validation
    if (!data.metadata || !data.runs || !Array.isArray(data.runs)) {
      result.errors.push('Invalid structure: missing metadata or runs array');
      return result;
    }

    // Schema validation using Zod
    try {
      GenerationLogSchema.parse(data);
      result.valid = true;
    } catch (err) {
      if (err instanceof ZodError) {
        result.errors.push(...err.errors.map(e => `${e.path.join('.')}: ${e.message}`));
      } else {
        result.errors.push(`Schema validation error: ${(err as Error).message}`);
      }
    }

    if (result.valid) {
      result.summary.runCount = data.runs.length;
      result.summary.systems = [...new Set(data.runs.map((r: any) => r.metadata?.system).filter(Boolean))];

      // Date range calculation
      const dates = data.runs
        .map((r: any) => new Date(r.request?.query || ''))
        .filter(d => !isNaN(d.getTime()));
      if (dates.length > 0) {
        dates.sort((a: Date, b: Date) => a.getTime() - b.getTime());
        result.summary.dateRange = {
          from: dates[0].toISOString(),
          to: dates[dates.length - 1].toISOString(),
        };
      }

      // Additional validation checks
      for (const run of data.runs) {
        // Check required fields in each run
        if (!run.run_id) {
          result.warnings.push(`Run missing run_id: ${run.session_id || 'unknown session'}`);
        }

        if (!run.metadata?.system) {
          result.warnings.push(`Run missing system info: ${run.run_id}`);
        }

        if (!run.request?.query) {
          result.warnings.push(`Run missing query: ${run.run_id}`);
        }

        // Validate step relationships
        for (let i = 0; i < run.steps.length; i++) {
          const step = run.steps[i];
          if (step.step_id !== i + 1) {
            result.warnings.push(`Step ID mismatch: expected ${i + 1}, got ${step.step_id}`);
          }

          if (!step.type) {
            result.warnings.push(`Step ${i + 1} missing type`);
          }
        }

        // Cost sanity check
        const cost = run.cost_estimate?.total_usd || 0;
        if (cost < 0) {
          result.warnings.push(`Negative cost in run: ${run.run_id}`);
        } else if (cost > 1000) {
          result.warnings.push(`High cost in run: ${run.run_id} ($${cost.toFixed(2)})`);
        }
      }
    }

  } catch (err) {
    result.errors.push(`File read error: ${(err as Error).message}`);
  }

  return result;
}

async function main() {
  const program = new Command();
  program
    .name('devtools-validate')
    .description('Validate QMS generation logs')
    .option('-d, --directory <path>', 'Directory containing .devtools files', '.devtools')
    .option('-o, --output <file>', 'Output file path')
    .option('-f, --format <format>', 'Output format (json|console)', 'console')
    .option('--fail-fast', 'Stop on first validation error', false)
    .option('--strict', 'Enable strict validation (treat warnings as errors)', false)
    .option('--include <file>', 'Specific file to validate (can repeat)', (v, prev) => [...(prev || []), v]);

  program.parse();
  const options = program.opts();

  const directory = options.directory as string;
  const output = options.output as string | undefined;
  const format = options.format as 'json' | 'console';
  const failFast = options.failFast as boolean;
  const strict = options.strict as boolean;
  const includeFiles = (options.include as string[] | undefined) || [];

  try {
    const files = includeFiles.length > 0
      ? includeFiles
      : await listLogFiles(directory);

    console.log(`\n🔍 Validating ${files.length} file(s)...`);

    const results = [];
    for (const file of files) {
      const result = await validateFile(file, false);
      results.push(result);

      if (failFast && !result.valid) {
        console.error(`\n❌ Validation failed fast on: ${file}`);
        if (format === 'json') {
          await fs.writeFile(output || 'validation-results.json', JSON.stringify(results, null, 2), 'utf-8');
        }
        process.exit(1);
      }
    }

    // Summary statistics
    const validFiles = results.filter(r => r.valid);
    const invalidFiles = results.filter(r => !r.valid);

    console.log(`\n📊 Validation Summary:`);
    console.log(`  Files validated: ${results.length}`);
    console.log(`  Valid: ${validFiles.length}`);
    console.log(`  Invalid: ${invalidFiles.length}`);

    if (invalidFiles.length > 0) {
      console.log(`\n❌ Invalid files:`);
      invalidFiles.forEach(r => {
        console.log(`\n${r.file}:`);
        r.errors.forEach(err => console.log(`  ❌ ${err}`));
        if (r.warnings.length > 0) {
          console.log(`  ⚠️  Warnings:`);
          r.warnings.forEach(warn => console.log(`    - ${warn}`));
        }
      });

      if (strict) {
        console.error('\n❌ Strict mode: validation failed due to warnings');
        process.exit(1);
      }
    }

    // Output JSON results if requested
    if (format === 'json') {
      const outputPath = output || 'validation-results.json';
      await fs.writeFile(outputPath, JSON.stringify(results, null, 2), 'utf-8');
      console.log(`\n📄 JSON validation results written to: ${outputPath}`);
    }

  } catch (err) {
    console.error('❌ Validation failed:', (err as Error).message);
    process.exit(1);
  }
}

async function mainWithArgs() {
  const argv = process.argv.slice(2);
  const options = parseArgs(argv);

  const directory = options.directory as string || '.devtools';
  const output = options.output as string | undefined;
  const format = (options.format as 'json' | 'console') || 'console';
  const failFast = options.failFast === true;
  const strict = options.strict === true;
  const includeFiles = options.include as string[] | undefined || [];

  main()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('❌ Unexpected error:', err);
      process.exit(1);
    });
}

// Run with argv if arguments are provided (not in commander mode)
if (process.argv.length > 2 && !process.argv.includes('--help') && !process.argv.includes('--version')) {
  mainWithArgs();
} else {
  main();
}