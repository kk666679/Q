/**
 * CLI analysis tool for QMS generation logs.
 * Generates comprehensive analysis of AI pipeline runs with cost, performance, and usage insights.
 */

import { Command } from 'commander';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { loadGenerationLog, listLogFiles } from '../utils';
import { generateAnalysis } from './analysis';

async function main() {
  const program = new Command();
  program
    .name('devtools-analyze')
    .description('Analyze QMS generation logs')
    .option('-d, --directory <path>', 'Directory containing .devtools files', '.devtools')
    .option('-o, --output <file>', 'Output file path')
    .option('-f, --format <format>', 'Output format (json|console)', 'console')
    .option('--verbose', 'Enable verbose output', false)
    .option('--include <file>', 'Specific file to analyze (can repeat)', (v, prev) => [...(prev || []), v])

  program.parse();
  const options = program.opts();

  const directory = options.directory as string;
  const output = options.output as string | undefined;
  const format = options.format as 'json' | 'console';
  const verbose = options.verbose as boolean;
  const includeFiles = (options.include as string[] | undefined) || [];

  try {
    const files = includeFiles.length > 0
      ? includeFiles
      : await listLogFiles(directory);

    if (verbose) {
      console.log(`🔍 Analyzing ${files.length} file(s):`, files.join('\n  '));
    }

    const analyses = [];
    for (const file of files) {
      try {
        const log = await loadGenerationLog(file);
        const analysis = generateAnalysis(file, log);
        analyses.push(analysis);
      } catch (err) {
        console.error(`⚠️ Failed to analyze ${file}: ${(err as Error).message}`);
      }
    }

    if (analyses.length === 0) {
      console.error('❌ No analyses generated');
      process.exit(1);
    }

    if (format === 'json') {
      const outputPath = output || join(process.cwd(), 'analysis-results.json');
      await fs.writeFile(outputPath, JSON.stringify(analyses, null, 2), 'utf-8');
      console.log(`📄 JSON analysis written to: ${outputPath}`);
    } else {
      analyses.forEach((analysis, i) => {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`Analysis ${i + 1}: ${analysis.file}`);
        console.log(`${'='.repeat(60)}`);
        console.log(generateTextReport(analysis));
      });
    }

  } catch (err) {
    console.error('❌ Analysis failed:', (err as Error).message);
    process.exit(1);
  }
}

function generateTextReport(analysis: any): string {
  const { file, metadata, summary } = analysis;
  const lines = [
    `File: ${file}`,
    `System: ${metadata.system} v${metadata.version}`, 
    `Environment: ${metadata.environment}`,
    `Generated: ${metadata.generated_at}`, 
    ``,
    `Summary:`,
    `  Total Runs: ${summary.totalRuns}`,
    `  Total Cost: $${summary.totalCostUsd.toFixed(4)}`, 
    `  Average Cost per Run: $${summary.avgCostUsd.toFixed(4)}`,
    `  Total Duration: ${formatDuration(summary.totalDurationMs)}`,
    `  Average Duration per Run: ${formatDuration(summary.avgDurationMs)}`,
    ``,
    `Providers:`,
    ...Object.entries(summary.providers).map(([p, c]) => `  ${p}: ${c}`),
    ``,
    `Domains:`,
    ...Object.entries(summary.domains).map(([d, c]) => `  ${d}: ${c}`),
    ``,
    `Standards:`,
    ...Object.entries(summary.standards).map(([s, c]) => `  ${s}: ${c}`),
    ``,
    `User Roles:`,
    ...Object.entries(summary.roles).map(([r, c]) => `  ${r}: ${c}`),
    ``,
    `Cache Hit Rate: ${(summary.cacheHitRate * 100).toFixed(2)}%`,
    `Safety Pass Rate: ${(summary.safetyPassRate * 100).toFixed(2)}%`,
    ``,
    `Step Type Counts:`,
    ...Object.entries(summary.stepTypeCounts).map(([t, c]) => `  ${t}: ${c}`),
    ``,
    `Performance Breakdown (avg ms):`,
    ...Object.entries(summary.performanceBreakdown).map(([k, v]) => `  ${k}: ${v.toFixed(2)}`),
    ``,
    `Cost Breakdown (avg USD):`,
    ...Object.entries(summary.costBreakdown).map(([k, v]) => `  ${k}: $${v.toFixed(4)}`),
  ];
  return lines.join('\n');
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(2)}s`;
  const mins = Math.floor(ms / 60_000);
  const secs = ((ms % 60_000) / 1000).toFixed(1);
  return `${mins}m ${secs}s`;
}

main().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});