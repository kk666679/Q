/**
 * CLI maintenance/cleanup tool for QMS generation logs.
 * Removes old logs, rotates data, and maintains disk space.
 */

import { Command } from 'commander';
import { promises as fs } from 'node:fs';
import { join, basename } from 'node:path';
import { listLogFiles, loadGenerationLog, parseArgs } from '../utils';

async function cleanupOldLogs(directory: string, retentionDays: number, dryRun: boolean = false): Promise<{ deleted: string[]; errors: string[] }> {
  const results = { deleted: [], errors: [] };

  try {
    const files = await listLogFiles(directory);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    console.log(`🗑️ Cleanup: Examining ${files.length} file(s) for logs older than ${retentionDays} days`);

    for (const file of files) {
      try {
        const log = await loadGenerationLog(file);
        const lastRunDate = new Date(log.metadata.generated_at);

        if (lastRunDate < cutoffDate) {
          const size = (await fs.stat(file)).size;
          const ageDays = Math.floor((cutoffDate.getTime() - lastRunDate.getTime()) / (1000 * 60 * 60 * 24));

          if (dryRun) {
            console.log(`📋 Would delete: ${file} (size: ${size} bytes, age: ${ageDays} days)`);
          } else {
            await fs.unlink(file);
            console.log(`✅ Deleted: ${file} (age: ${ageDays} days)`);
          }
          results.deleted.push(file);
        }
      } catch (err) {
        results.errors.push(`Failed to process ${file}: ${(err as Error).message}`);
      }
    }

  } catch (err) {
    results.errors.push(`Cleanup failed: ${(err as Error).message}`);
  }

  return results;
}

async function rotateLogs(directory: string, maxAgeDays: number, dryRun: boolean = false): Promise<{ rotated: string[]; errors: string[] }> {
  const results = { rotated: [], errors: [] };

  try {
    const files = await listLogFiles(directory);

    for (const file of files) {
      try {
        const stat = await fs.stat(file);
        const ageDays = Math.floor((Date.now() - stat.mtime.getTime()) / (1000 * 60 * 60 * 24));

        if (ageDays > maxAgeDays) {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const rotatedPath = join(directory, `${basename(file, '.json')}_${timestamp}.json`);

          if (dryRun) {
            console.log(`📋 Would rotate: ${file} → ${rotatedPath}`);
          } else {
            await fs.rename(file, rotatedPath);
            console.log(`🔄 Rotated: ${file} → ${rotatedPath}`);
          }
          results.rotated.push(rotatedPath);
        }
      } catch (err) {
        results.errors.push(`Failed to rotate ${file}: ${(err as Error).message}`);
      }
    }

  } catch (err) {
    results.errors.push(`Rotation failed: ${(err as Error).message}`);
  }

  return results;
}

async function consolidateLogs(directory: string, dryRun: boolean = false): Promise<{ consolidated: string[]; errors: string[] }> {
  const results = { consolidated: [], errors: [] };
  const allLogs = [];

  try {
    const files = await listLogFiles(directory);

    for (const file of files) {
      try {
        const log = await loadGenerationLog(file);
        allLogs.push(log);
      } catch (err) {
        results.errors.push(`Failed to load ${file}: ${(err as Error).message}`);
      }
    }

    if (allLogs.length > 1) {
      const consolidated = {
        metadata: {
          system: 'consolidated-devtools-logs',
          environment: 'production',
          version: '1.0.0',
          framework: 'ai-sdk',
          generated_at: new Date().toISOString(),
          providers: [...new Set(allLogs.flatMap(l => l.metadata.providers))],
        },
        runs: allLogs.flatMap(l => l.runs),
      };

      const consolidatedPath = join(directory, `consolidated_${Date.now()}.json`);

      if (dryRun) {
        console.log(`📋 Would consolidate: ${files.length} files → ${consolidatedPath}`);
      } else {
        await fs.writeFile(consolidatedPath, JSON.stringify(consolidated, null, 2), 'utf-8');
        console.log(`🔗 Consolidated: ${files.length} files → ${consolidatedPath}`);
        results.consolidated.push(consolidatedPath);
      }
    }

  } catch (err) {
    results.errors.push(`Consolidation failed: ${(err as Error).message}`);
  }

  return results;
}

async function main() {
  const program = new Command();
  program
    .name('devtools-maintain')
    .description('Maintain and cleanup QMS generation logs')
    .option('-d, --directory <path>', 'Directory containing .devtools files', '.devtools')
    .option('--cleanup-days <days>', 'Delete logs older than X days', parseInt)
    .option('--rotate-days <days>', 'Rotate logs older than X days', parseInt)
    .option('--consolidate', 'Consolidate multiple logs into one', false)
    .option('--dry-run', 'Show what would be done without making changes', false)
    .option('--all', 'Run all maintenance operations', false);

  program.parse();
  const options = program.opts();

  const directory = options.directory as string;
  const cleanupDays = options.cleanupDays as number | undefined;
  const rotateDays = options.rotateDays as number | undefined;
  const consolidate = options.consolidate as boolean;
  const dryRun = options.dryRun as boolean;
  const all = options.all as boolean;

  try {
    console.log(`🔧 QMS DevTools Maintenance (${dryRun ? 'DRY RUN' : 'LIVE'})`);

    const operations = [];

    if (all || cleanupDays) {
      operations.push({
        name: 'cleanup',
        fn: () => cleanupOldLogs(directory, cleanupDays || 90, dryRun),
      });
    }

    if (all || rotateDays) {
      operations.push({
        name: 'rotate',
        fn: () => rotateLogs(directory, rotateDays || 180, dryRun),
      });
    }

    if (all || consolidate) {
      operations.push({
        name: 'consolidate',
        fn: () => consolidateLogs(directory, dryRun),
      });
    }

    if (operations.length === 0) {
      console.log('⚠️  No operations specified. Use --help for options.');
      return;
    }

    const results = [];
    for (const op of operations) {
      console.log(`\n🔄 Running ${op.name} operation...`);
      const result = await op.fn();
      results.push({ operation: op.name, ...result });
    }

    console.log('\n📊 Maintenance Summary:');
    for (const result of results) {
      console.log(`  ${result.operation}:
    Deleted: ${result.deleted.length}
    Errors: ${result.errors.length}
    Rotated: ${result.rotated?.length || 0}
    Consolidated: ${result.consolidated?.length || 0}`);
    }

    if (results.some(r => r.errors.length > 0)) {
      console.error('\n❌ Errors occurred during maintenance');
    } else {
      console.log('\n✅ Maintenance completed successfully');
    }

  } catch (err) {
    console.error('❌ Maintenance failed:', (err as Error).message);
    process.exit(1);
  }
}

async function mainWithArgs() {
  const argv = process.argv.slice(2);
  const options = parseArgs(argv);

  const directory = options.directory as string || '.devtools';
  const cleanupDays = options.cleanupDays ? parseInt(options.cleanupDays) : undefined;
  const rotateDays = options.rotateDays ? parseInt(options.rotateDays) : undefined;
  const consolidate = options.consolidate === true;
  const dryRun = options.dryRun === true;
  const all = options.all === true;

  // Convert string booleans to boolean
  const cleanup = cleanupDays ? true : false;
  const rotate = rotateDays ? true : false;

  process.env.directory = directory;
  process.env.cleanupDays = cleanupDays?.toString() || '90';
  process.env.rotateDays = rotateDays?.toString() || '180';
  process.env.consolidate = consolidate.toString();
  process.env.dryRun = dryRun.toString();
  process.env.all = all.toString();

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