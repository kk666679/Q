/**
 * Core analysis functions for QMS generation logs.
 * Contains logic to generate analysis results from generation log data.
 */

import type { GenerationLog, AnalysisResult } from '../types';

/**
 * Generate comprehensive analysis from a generation log.
 */
export function generateAnalysis(file: string, log: GenerationLog): AnalysisResult {
  const { metadata, runs } = log;

  const runsBySystem = runs.reduce<Record<string, typeof runs>>((acc, run) => {
    const system = metadata.system;
    (acc[system] ??= []).push(run);
    return acc;
  }, {});

  const allSteps = runs.flatMap(r => r.steps);

  const stepTypeCounts = allSteps.reduce<Record<string, number>>((acc, step) => {
    const type = step.type;
    acc[type] = (acc[type] ??= 0) + 1;
    return acc;
  }, {});

  const performanceBreakdown = allSteps.reduce<Record<string, number>>((acc, step) => {
    const type = step.type;
    const duration = step.metrics?.duration_ms ?? 0;
    acc[type] = (acc[type] ??= 0) + duration;
    return acc;
  }, {});

  // Average performance by step type
  Object.keys(performanceBreakdown).forEach(key => {
    const steps = allSteps.filter(s => s.type === key);
    if (steps.length > 0) {
      performanceBreakdown[key] = performanceBreakdown[key] / steps.length;
    }
  });

  const costBreakdown = allSteps.reduce<Record<string, number>>((acc, step) => {
    const type = step.type;
    const input = step.metrics?.tokens_input ?? 0;
    const output = step.metrics?.tokens_output ?? 0;
    const tokens = input + output;
    const cost = tokens * 0.000001; // $0.000001 per token
    acc[type] = (acc[type] ??= 0) + cost;
    return acc;
  }, {});

  // Average cost by step type
  Object.keys(costBreakdown).forEach(key => {
    const steps = allSteps.filter(s => s.type === key);
    if (steps.length > 0) {
      costBreakdown[key] = costBreakdown[key] / steps.length;
    }
  });

  // Date range calculation
  let dateRange: { from: string; to: string } | null = null;
  if (runs.length > 0) {
    const dates = runs.map(r => new Date(r.request.query)).filter(d => !isNaN(d.getTime()));
    if (dates.length > 0) {
      dates.sort((a, b) => a.getTime() - b.getTime());
      dateRange = { from: dates[0].toISOString(), to: dates[dates.length - 1].toISOString() };
    }
  }

  const summary = {
    totalRuns: runs.length,
    totalCostUsd: runs.reduce((sum, r) => sum + (r.cost_estimate?.total_usd ?? 0), 0),
    totalDurationMs: runs.reduce((sum, r) => sum + (r.performance?.total_duration_ms ?? 0), 0),
    avgDurationMs: runs.length > 0 ? (runs.reduce((sum, r) => sum + (r.performance?.total_duration_ms ?? 0), 0) / runs.length) : 0,
    avgCostUsd: runs.length > 0 ? (runs.reduce((sum, r) => sum + (r.cost_estimate?.total_usd ?? 0), 0) / runs.length) : 0,
    providers: runs.reduce<Record<string, number>>((acc, run) => {
      run.metadata?.providers?.forEach(provider => {
        acc[provider] = (acc[provider] ??= 0) + 1;
      });
      return acc;
    }, {}),
    domains: runs.reduce<Record<string, number>>((acc, run) => {
      acc[run.request.domain] = (acc[run.request.domain] ??= 0) + 1;
      return acc;
    }, {}),
    standards: runs.reduce<Record<string, number>>((acc, run) => {
      run.request.standards?.forEach(standard => {
        acc[standard] = (acc[standard] ??= 0) + 1;
      });
      return acc;
    }, {}),
    roles: runs.reduce<Record<string, number>>((acc, run) => {
      acc[run.user.role] = (acc[run.user.role] ??= 0) + 1;
      return acc;
    }, {}),
    cacheHitRate: runs.length > 0 ? (runs.filter(r => r.cache?.hit).length / runs.length) : 0,
    safetyPassRate: runs.length > 0 ? (runs.filter(r => r.safety?.status === 'safe').length / runs.length) : 0,
    stepTypeCounts,
    dateRange,
    performanceBreakdown,
    costBreakdown,
  };

  return { file, metadata, runs, summary };
}