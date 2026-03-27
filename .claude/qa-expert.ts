import { z } from 'zod';
import { AgentConfig, AgentRole } from '../types';

export const qaExpertAgent: AgentConfig = {
  id: 'qa-expert',
  role: AgentRole.QUALITY_MANAGER,
  name: 'QA Expert',
  capabilities: [
    'Test Strategy Development',
    'Quality Process Optimization',
    'Test Automation Framework',
    'Risk-Based Testing',
    'Defect Management',
    'Quality Metrics & KPIs',
    'Continuous Testing',
  ],
  systemPrompt: `You are a QA Expert specializing in test strategy development, quality process optimization, and comprehensive testing methodologies.

Your expertise includes:
- Test strategy and planning (risk-based, automation-first, shift-left)
- Quality frameworks (ISO 9001, ISTQB, TMMi, CMMI)
- Testing methodologies (manual, automated, continuous)
- Quality metrics and KPIs (coverage, defect density, escape rate)
- Test automation frameworks (Selenium, Cypress, Playwright)
- Process improvement (root cause analysis, retrospectives)

Provide expert guidance on testing strategies, quality processes, and test optimization.`,
  tools: [
    {
      name: 'analyze_test_coverage',
      description: 'Analyze test coverage and identify gaps',
      parameters: z.object({
        projectPath: z.string(),
        coverageType: z.enum(['code', 'requirements', 'risk']),
        threshold: z.number().optional(),
      }),
      execute: async (params) => {
        return {
          coverage: 85.5,
          gaps: ['API error handling', 'Edge cases in payment flow'],
          recommendations: ['Add integration tests', 'Increase unit test coverage'],
          metrics: {
            statement: 87,
            branch: 82,
            function: 90,
            line: 85,
          },
        };
      },
    },
    {
      name: 'generate_test_strategy',
      description: 'Generate comprehensive test strategy document',
      parameters: z.object({
        projectType: z.enum(['web', 'mobile', 'api', 'desktop']),
        riskLevel: z.enum(['high', 'medium', 'low']),
        timeline: z.string(),
        resources: z.number().optional(),
      }),
      execute: async (params) => {
        return {
          strategy: {
            approach: 'Risk-based testing with automation-first mindset',
            phases: ['Unit', 'Integration', 'System', 'UAT'],
            automation: 'Playwright for E2E, Jest for unit tests',
            coverage: 'Target 80% code coverage, 100% critical path',
          },
          timeline: params.timeline,
          resources: params.resources || 3,
        };
      },
    },
    {
      name: 'assess_quality_maturity',
      description: 'Assess QA process maturity level',
      parameters: z.object({
        areas: z.array(z.enum(['process', 'automation', 'metrics', 'culture'])),
      }),
      execute: async (params) => {
        return {
          maturityLevel: 3,
          score: 72,
          strengths: ['Good automation coverage', 'Clear metrics'],
          weaknesses: ['Manual regression', 'Limited shift-left'],
          recommendations: [
            'Implement TDD practices',
            'Add quality gates in CI/CD',
            'Establish test data management',
          ],
        };
      },
    },
    {
      name: 'calculate_quality_metrics',
      description: 'Calculate quality metrics and KPIs',
      parameters: z.object({
        metricType: z.enum(['defect_density', 'escape_rate', 'coverage', 'cycle_time']),
        period: z.string(),
        data: z.record(z.any()).optional(),
      }),
      execute: async (params) => {
        const metrics: Record<string, any> = {
          defect_density: { value: 2.3, unit: 'bugs/KLOC', trend: 'down', target: 3.0 },
          escape_rate: { value: 5.2, unit: '%', trend: 'down', target: 5.0 },
          coverage: { value: 85.5, unit: '%', trend: 'up', target: 80.0 },
          cycle_time: { value: 3.5, unit: 'days', trend: 'down', target: 5.0 },
        };
        return metrics[params.metricType];
      },
    },
    {
      name: 'design_automation_framework',
      description: 'Design test automation framework architecture',
      parameters: z.object({
        technology: z.enum(['playwright', 'cypress', 'selenium', 'appium']),
        pattern: z.enum(['page_object', 'screenplay', 'keyword_driven']),
        features: z.array(z.string()).optional(),
      }),
      execute: async (params) => {
        return {
          framework: params.technology,
          pattern: params.pattern,
          structure: {
            pages: 'Page objects for UI components',
            tests: 'Test specs organized by feature',
            utils: 'Helper functions and fixtures',
            config: 'Environment and test configuration',
          },
          features: params.features || ['parallel', 'reporting', 'ci-integration'],
          estimatedSetup: '2-3 weeks',
        };
      },
    },
    {
      name: 'perform_risk_assessment',
      description: 'Perform risk-based testing assessment',
      parameters: z.object({
        features: z.array(z.object({
          name: z.string(),
          complexity: z.enum(['high', 'medium', 'low']),
          businessImpact: z.enum(['critical', 'high', 'medium', 'low']),
        })),
      }),
      execute: async (params) => {
        const risks = params.features.map(f => ({
          feature: f.name,
          riskLevel: f.businessImpact === 'critical' || f.complexity === 'high' ? 'high' : 'medium',
          testPriority: f.businessImpact === 'critical' ? 1 : 2,
          coverage: f.businessImpact === 'critical' ? 100 : 80,
        }));
        return {
          risks,
          highRiskCount: risks.filter(r => r.riskLevel === 'high').length,
          recommendations: 'Focus 70% effort on high-risk features',
        };
      },
    },
    {
      name: 'analyze_defect_trends',
      description: 'Analyze defect trends and patterns',
      parameters: z.object({
        period: z.string(),
        groupBy: z.enum(['severity', 'component', 'type', 'root_cause']),
      }),
      execute: async (params) => {
        return {
          totalDefects: 47,
          trend: 'decreasing',
          distribution: {
            critical: 2,
            high: 8,
            medium: 22,
            low: 15,
          },
          topComponents: ['Payment', 'Authentication', 'Reporting'],
          rootCauses: ['Requirements gap', 'Edge case', 'Integration issue'],
          recommendations: [
            'Add integration tests for payment flow',
            'Improve requirements review process',
          ],
        };
      },
    },
  ],
};
