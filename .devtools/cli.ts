/**
 * QMS DevTools CLI entry point.
 * Provides a unified interface for all devtools operations.
 */

#!/usr/bin/env node

import { Command } from 'commander';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';

async function main() {
  const program = new Command();
  program
    .name('devtools')
    .description('QMS DevTools - AI generation log analysis and management suite')
    .version('1.0.0');

  // Analysis commands
  program
    .command('analyze')
    .description('Analyze generation logs for insights')
    .option('-d, --directory <path>', 'Directory containing .devtools files', '.devtools')
    .option('-o, --output <file>', 'Output file path')
    .option('-f, --format <format>', 'Output format (json|console)', 'console')
    .option('--verbose', 'Enable verbose output', false)
    .action(async (options) => {
      const { spawn } = await import('node:child_process');
      const result = spawn('tsx', ['tools/analyze.ts', '--directory', options.directory, '--output', options.output || '', '--format', options.format, '--verbose'], {
        cwd: __dirname,
        stdio: 'inherit',
      });
      await new Promise((resolve, reject) => {
        result.on('exit', (code) => {
          if (code === 0) resolve();
          else reject(new Error(`Process exited with code ${code}`));
        });
      });
    });

  // Validation commands
  program
    .command('validate')
    .description('Validate log integrity and schema conformance')
    .option('-d, --directory <path>', 'Directory containing .devtools files', '.devtools')
    .option('-o, --output <file>', 'Output file path')
    .option('-f, --format <format>', 'Output format (json|console)', 'console')
    .option('--fail-fast', 'Stop on first validation error', false)
    .option('--strict', 'Enable strict validation (treat warnings as errors)', false)
    .option('--include <file>', 'Specific file to validate (can repeat)', (v, prev) => [...(prev || []), v])
    .action(async (options) => {
      const { spawn } = await import('node:child_process');
      const result = spawn('tsx', ['tools/validate.ts', '--directory', options.directory, '--output', options.output || '', '--format', options.format, '--fail-fast', '--strict'].concat(options.include.map((f: string) => '--include', f)), {
        cwd: __dirname,
        stdio: 'inherit',
      });
      await new Promise((resolve, reject) => {
        result.on('exit', (code) => {
          if (code === 0) resolve();
          else reject(new Error(`Process exited with code ${code}`));
        });
      });
    });

  // Report commands
  program
    .command('report')
    .description('Generate HTML/JSON reports from generation logs')
    .option('-d, --directory <path>', 'Directory containing .devtools files', '.devtools')
    .option('-o, --output <file>', 'Output file path')
    .option('-f, --format <format>', 'Output format (html|json|both)', 'html')
    .option('--title <title>', 'Report title')
    .option('--include <file>', 'Specific file to process (can repeat)', (v, prev) => [...(prev || []), v])
    .action(async (options) => {
      const { spawn } = await import('node:child_process');
      const result = spawn('tsx', ['tools/report.ts', '--directory', options.directory, '--output', options.output || '', '--format', options.format, '--title', options.title || ''].concat(options.include.map((f: string) => '--include', f)), {
        cwd: __dirname,
        stdio: 'inherit',
      });
      await new Promise((resolve, reject) => {
        result.on('exit', (code) => {
          if (code === 0) resolve();
          else reject(new Error(`Process exited with code ${code}`));
        });
      });
    });

  // Maintenance commands
  program
    .command('maintain')
    .description('Maintain and cleanup generation logs')
    .option('-d, --directory <path>', 'Directory containing .devtools files', '.devtools')
    .option('--cleanup-days <days>', 'Delete logs older than X days', parseInt)
    .option('--rotate-days <days>', 'Rotate logs older than X days', parseInt)
    .option('--consolidate', 'Consolidate multiple logs into one', false)
    .option('--dry-run', 'Show what would be done without making changes', false)
    .option('--all', 'Run all maintenance operations', false)
    .action(async (options) => {
      const { spawn } = await import('node:child_process');
      const args = ['tools/maintain.ts', '--directory', options.directory];
      if (options.cleanupDays) args.push('--cleanup-days', options.cleanupDays.toString());
      if (options.rotateDays) args.push('--rotate-days', options.rotateDays.toString());
      if (options.consolidate) args.push('--consolidate');
      if (options.dryRun) args.push('--dry-run');
      if (options.all) args.push('--all');

      const result = spawn('tsx', args, {
        cwd: __dirname,
        stdio: 'inherit',
      });
      await new Promise((resolve, reject) => {
        result.on('exit', (code) => {
          if (code === 0) resolve();
          else reject(new Error(`Process exited with code ${code}`));
        });
      });
    });

  program.parse();
}

main().catch(err => {
  console.error('❌ DevTools CLI failed:', err);
  process.exit(1);
});