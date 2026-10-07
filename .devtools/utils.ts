/**
 * Utility helpers for QMS DevTools.
 */

import { readFile, writeFile, readdir, stat, mkdir, unlink } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import type { GenerationLog, Run } from './types';

/**
 * Load and parse a generation log JSON file.
 */
export async function loadGenerationLog(filePath: string): Promise<GenerationLog> {
  const raw = await readFile(filePath, 'utf-8');
  return JSON.parse(raw) as GenerationLog;
}

/**
 * Write a generation log JSON file with 2-space indentation.
 */
export async function writeGenerationLog(filePath: string, log: GenerationLog): Promise<void> {
  const content = JSON.stringify(log, null, 2) + '\n';
  await writeFile(filePath, content, 'utf-8');
}

/**
 * List all `.json` generation log files in a directory.
 */
export async function listLogFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir);
  const files: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry);
    if (extname(entry) === '.json') {
      const s = await stat(full);
      if (s.isFile()) {
        files.push(full);
      }
    }
  }
  return files.sort();
}

/**
 * Format a number as USD with 4 decimal places.
 */
export function formatUsd(value: number): string {
  return `$${value.toFixed(4)}`;
}

/**
 * Format milliseconds as a human-readable duration.
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(2)}s`;
  const mins = Math.floor(ms / 60_000);
  const secs = ((ms % 60_000) / 1000).toFixed(1);
  return `${mins}m ${secs}s`;
}

/**
 * Escape HTML special characters.
 */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Get ISO date string for a Date.
 */
export function iso(d: Date): string {
  return d.toISOString();
}

/**
 * Compute average of an array of numbers.
 */
export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/**
 * Group an array by a key function.
 */
export function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
  const result: Record<string, T[]> = {};
  for (const item of arr) {
    const k = key(item);
    (result[k] ??= []).push(item);
  }
  return result;
}

/**
 * Count occurrences of each value in an array.
 */
export function countBy<T>(arr: T[], key: (item: T) => string): Record<string, number> {
  const result: Record<string, number> = {};
  for (const item of arr) {
    const k = key(item);
    result[k] = (result[k] ?? 0) + 1;
  }
  return result;
}

/**
 * Ensure a directory exists.
 */
export async function ensureDir(dir: string): Promise<void> {
  await mkdir(dir, { recursive: true });
}

/**
 * Remove a file if it exists.
 */
export async function removeFile(filePath: string): Promise<void> {
  try {
    await unlink(filePath);
  } catch {
    // ignore if missing
  }
}

/**
 * Get file modification time as ISO string.
 */
export async function fileMtime(filePath: string): Promise<string | null> {
  try {
    const s = await stat(filePath);
    return s.mtime.toISOString();
  } catch {
    return null;
  }
}

/**
 * Parse CLI arguments in the form `--key=value` or `--key value`.
 */
export function parseArgs(argv: string[]): Record<string, string | boolean> {
  const args: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const eq = key.indexOf('=');
      if (eq !== -1) {
        args[key.slice(0, eq)] = key.slice(eq + 1);
      } else if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) {
        args[key] = argv[++i];
      } else {
        args[key] = true;
      }
    }
  }
  return args;
}

/**
 * Get the directory containing this script file.
 */
export function getScriptDir(): string {
  return new URL('.', import.meta.url).pathname;
}