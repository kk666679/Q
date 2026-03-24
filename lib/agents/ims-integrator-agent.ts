import { z } from 'zod';
import { AgentConfig, AgentRole } from '../types';

/**
 * IMS (Integrated Management System) Integrator Agent
 * Specialized agent for integrating ISO 9001, ISO 14001, and ISO 45001 into a unified management system
 */
export const imsIntegratorAgent: AgentConfig = {
  id: 'ims-integrator-agent',
  role: AgentRole.QUALITY_MANAGER,
  name: 'IMS Integration Specialist',
  capabilities: [
    'Integrated Management System (IMS) Design',
    'Process Integration Across Standards',
    'Unified Documentation Framework',
    'Cross-Functional Risk Management',
    'Combined Audit Programs',
    'Integrated Performance Metrics',
    'Management System Harmonization',
    'Continual Improvement Coordination',
    'Multi-Standard Compliance Mapping',
    'Resource Optimization Across Systems',
  ],
  systemPrompt: `You are an Integrated Management System (IMS) Expert specializing in harmonizing ISO 9001 (Quality), ISO 14001 (Environment), and ISO 45001 (Occupational Health & Safety) into a single, efficient management system.

Your expertise includes:
- IMS architecture and framework design
- Commonalities and differences between ISO 9001, ISO 14001, and ISO 45001
- Process-based approach across multiple standards
- Integrated documentation and records management
- Cross-functional risk and opportunity assessment
- Combined internal audit programs
- Unified performance indicators and metrics
- Management system integration best practices
- Clause-by-clause alignment mapping
- Resource optimization and efficiency gains

Key Integration Areas:
- Context of Organization (ISO 9001 Cl.4, ISO 14001 Cl.4, ISO 45001 Cl.4)
- Leadership (ISO 9001 Cl.5, ISO 14001 Cl.5, ISO 45001 Cl.5)
- Planning (ISO 9001 Cl.6, ISO 14001 Cl.6, ISO 45001 Cl.6)
- Support (ISO 9001 Cl.7, ISO 14001 Cl.7, ISO 45001 Cl.7)
- Operation (ISO 9001 Cl.8, ISO 14001 Cl.8, ISO 45001 Cl.8)
- Performance Evaluation (ISO 9001 Cl.9, ISO 14001 Cl.9, ISO 45001 Cl.9)
- Improvement (ISO 9001 Cl.10, ISO 14001 Cl.10, ISO 45001 Cl.10)

Provide expert guidance on IMS implementation, integration challenges, and optimization strategies.`,
  tools: [
    {
      name: 'assess_ims_maturity',
      description: 'Assess Integrated Management System maturity level',
      parameters: z.object({
        standards: z.array(z.enum(['ISO9001', 'ISO14001', 'ISO45001'])).default(['ISO9001', 'ISO14001', 'ISO45001']),
      }),
      execute: async (params) => {
        return {
          assessmentDate: new Date().toISOString(),
          standards: params.standards,
          overallMaturityLevel: 3,
          overallMaturityScore: 68,
          maturityLevels: {
            initial: { description: 'Ad-hoc, informal processes', score: 1 },
            developing: { description: 'Basic processes documented', score: 2 },
            defined: { description: 'Standardized processes', score: 3 },
            managed: { description: 'Measured and controlled', score: 4 },
            optimizing: { description: 'Continuous improvement', score: 5 },
          },
          dimensionScores: {
            integrationStructure: { level: 3, score: 65, description: 'Basic integration structure in place' },
            documentation: { level: 3, score: 70, description: 'Common documentation framework' },
            processHarmonization: { level: 2, score: 58, description: 'Some processes aligned' },
            riskManagement: { level: 3, score: 72, description: 'Integrated risk approach' },
            auditIntegration: { level: 3, score: 65, description: 'Combined audit program' },
            metricsKPIs: { level: 2, score: 60, description: 'Separate metrics per standard' },
            managementReview: { level: 3, score: 68, description: 'Combined review meetings' },
            continualImprovement: { level: 3, score: 70, description: 'Coordinated improvement' },
            resourceOptimization: { level: 2, score: 55, description: 'Limited resource sharing' },
            competencyManagement: { level: 3, score: 72, description: 'Integrated competency framework' },
          },
          findings: [
            'Documentation is partially integrated - separate manuals for each standard',
            'Process mapping shows some duplication across systems',
            'Risk assessments are conducted separately per standard',
            'Audit schedule is partially combined',
            'KPIs are tracked separately for each standard',
          ],
          recommendations: [
            'Develop unified IMS manual',
            'Create integrated process maps',
            'Implement combined risk register',
            'Establish integrated audit schedule',
            'Develop unified dashboard with cross-standard metrics',
          ],
        };
      },
    },
    {
      name: 'map_clause_correspondence',
      description: 'Map correspondence between ISO 9001, ISO 14001, and ISO 45001 clauses',
      parameters: z.object({
        focusArea: z.string().optional(),
      }),
      execute: async (params) => {
        return {
          mappingType: 'Complete clause correspondence',
          lastUpdated: new Date().toISOString(),
          clauseMappings: [
            { iso9001: '4.1', iso14001: '4.1', iso45001: '4.1', common: 'Understanding the organization and its context', integration: 'Combined context analysis including Q, E, OH&S aspects' },
            { iso9001: '4.2', iso14001: '4.2', iso45001: '4.2', common: 'Interested parties and requirements', integration: 'Unified interested party register covering all standards' },
            { iso9001: '4.3', iso14001: '4.3', iso45001: '4.3', common: 'Scope of the management system', integration: 'Single IMS scope statement' },
            { iso9001: '4.4', iso14001: '4.4', iso45001: '4.4', common: 'Management system processes', integration: 'Integrated process approach' },
            { iso9001: '5.1', iso14001: '5.1', iso45001: '5.1', common: 'Leadership and commitment', integration: 'Unified leadership commitment for Q, E, OH&S' },
            { iso9001: '5.2', iso14001: '5.2', iso45001: '5.2', common: 'Quality/Environmental/OHS policy', integration: 'Integrated policy covering all aspects' },
            { iso9001: '5.3', iso14001: '5.3', iso45001: '5.3', common: 'Organizational roles and responsibilities', integration: 'Combined role matrix' },
            { iso9001: '5.4', iso14001: '', iso45001: '5.4', common: 'Consultation and participation (OH&S)', integration: 'Worker engagement for OH&S' },
            { iso9001: '6.1', iso14001: '6.1', iso45001: '6.1', common: 'Actions to address risks and opportunities', integration: 'Integrated risk assessment (quality, environmental, OH&S)' },
            { iso9001: '6.2', iso14001: '6.2', iso45001: '6.2', common: 'Objectives and planning', integration: 'Combined objectives with Q, E, OH&S targets' },
            { iso9001: '7.1', iso14001: '7.1', iso45001: '7.1', common: 'Resources', integration: 'Unified resource planning' },
            { iso9001: '7.2', iso14001: '7.2', iso45001: '7.2', common: 'Competence', integration: 'Integrated competency framework' },
            { iso9001: '7.3', iso14001: '7.3', iso45001: '7.3', common: 'Awareness', integration: 'Combined awareness training' },
            { iso9001: '7.4', iso14001: '7.4', iso45001: '7.4', common: 'Communication', integration: 'Unified communication matrix' },
            { iso9001: '7.5', iso14001: '7.5', iso45001: '7.5', common: 'Documented information', integration: 'Integrated document control' },
            { iso9001: '8.1', iso14001: '8.1', iso45001: '8.1', common: 'Operational planning and control', integration: 'Combined operational controls' },
            { iso9001: '8.2', iso14001: '', iso45001: '', common: 'Customer requirements (Q only)', integration: 'Quality-specific' },
            { iso9001: '8.3', iso14001: '', iso45001: '', common: 'Design and development (Q only)', integration: 'Quality-specific' },
            { iso9001: '', iso14001: '8.2', iso45001: '', common: 'Emergency preparedness (E only)', integration: 'Environment-specific' },
            { iso9001: '', iso14001: '', iso45001: '8.2', common: 'Emergency preparedness (OH&S only)', integration: 'OH&S-specific' },
            { iso9001: '9.1', iso14001: '9.1', iso45001: '9.1', common: 'Monitoring and measurement', integration: 'Combined monitoring program' },
            { iso9001: '9.2', iso14001: '9.2', iso45001: '9.2', common: 'Internal audit', integration: 'Integrated audit schedule and program' },
            { iso9001: '9.3', iso14001: '9.3', iso45001: '9.3', common: 'Management review', integration: 'Combined management review' },
            { iso9001: '10.1', iso14001: '10.1', iso45001: '10.1', common: 'Nonconformity and corrective action', integration: 'Unified CAPA process' },
            { iso9001: '10.2', iso14001: '10.2', iso45001: '10.2', common: 'Continual improvement', integration: 'Integrated improvement program' },
            { iso9001: '10.3', iso14001: '10.3', iso45001: '10.3', common: 'Continual improvement', integration: 'Coordinated improvement initiatives' },
          ],
          benefits: [
            'Reduces documentation duplication',
            'Streamlines audit processes',
            'Improves organizational efficiency',
            'Provides holistic view of management system',
            'Enables integrated risk management',
          ],
          recommendations: [
            'Use clause mapping to identify integration opportunities',
            'Develop unified procedures where clauses align',
            'Maintain standard-specific requirements where needed',
            'Document integration rationale for auditors',
          ],
        };
      },
    },
    {
      name: 'design_integrated_audit',
      description: 'Design integrated internal audit program',
      parameters: z.object({
        standards: z.array(z.string()).default(['ISO9001', 'ISO14001', 'ISO45001']),
        auditFrequency: z.string().default('annual'),
      }),
      execute: async (params) => {
        return {
          programName: 'IMS Internal Audit Program',
          standards: params.standards,
          annualCycles: params.auditFrequency === 'annual' ? 1 : params.auditFrequency === 'biannual' ? 2 : 4,
          auditSchedule: [
            {
              cycle: 1,
              focus: 'Core Processes',
              standards: ['ISO9001', 'ISO14001', 'ISO45001'],
              clauses: ['4.1-4.4', '5.1-5.3', '6.1-6.2', '7.1-7.5'],
              duration: '3 days',
              auditors: ['Lead Auditor + 2 auditors'],
              estimatedDays: 3,
            },
            {
              cycle: 2,
              focus: 'Operations',
              standards: ['ISO9001', 'ISO14001', 'ISO45001'],
              clauses: ['8.1-8.8'],
              duration: '2 days',
              auditors: ['Lead Auditor + 2 auditors'],
              estimatedDays: 2,
            },
            {
              cycle: 3,
              focus: 'Evaluation & Improvement',
              standards: ['ISO9001', 'ISO14001', 'ISO45001'],
              clauses: ['9.1-9.3', '10.1-10.3'],
              duration: '2 days',
              auditors: ['Lead Auditor + 2 auditors'],
              estimatedDays: 2,
            },
          ],
          combinedAudits: [
            {
              name: 'Full IMS Audit',
              frequency: 'Annual',
              duration: '5 days',
              coverage: 'All clauses across all standards',
              auditors: '3-4 qualified auditors',
            },
            {
              name: 'Process Audits',
              frequency: 'Quarterly',
              duration: '1-2 days per process',
              coverage: 'Key processes mapped to relevant standards',
              auditors: '2 auditors',
            },
          ],
          competencyRequirements: [
            'Lead Auditor qualification (ISO 19011)',
            'Knowledge of all three standards',
            'Understanding of integrated processes',
            'Audit team composition to cover all standards',
          ],
          resources: {
            totalAuditDays: 7,
            auditorDays: 21,
            costEstimate: '$8,500 per cycle',
          },
          recommendations: [
            'Conduct combined audits to maximize efficiency',
            'Use process-based audit approach for integration',
            'Ensure auditor competency in all applicable standards',
            'Develop audit checklist mapping to multiple clauses',
          ],
        };
      },
    },
    {
      name: 'create_integrated_process_map',
      description: 'Create integrated process map covering all standards',
      parameters: z.object({
        includeEnvironmental: z.boolean().default(true),
        includeOHS: z.boolean().default(true),
      }),
      execute: async (params) => {
        const processes = [
          {
            id: 'PROC-001',
            name: 'Strategic Planning',
            type: 'Management',
            categories: ['Quality', params.includeEnvironmental ? 'Environment' : '', params.includeOHS ? 'OHS' : ''].filter(Boolean),
            iso9001: ['5.1', '5.2', '5.3', '6.1', '6.2', '9.3', '10.1', '10.2', '10.3'],
            iso14001: ['5.1', '5.2', '5.3', '6.1', '6.2', '9.3', '10.1', '10.2', '10.3'],
            iso45001: ['5.1', '5.2', '5.3', '5.4', '6.1', '6.2', '9.3', '10.1', '10.2', '10.3'],
            owner: 'Top Management',
            kpis: ['Objective achievement rate', 'Management review effectiveness', 'Improvement initiatives'],
          },
          {
            id: 'PROC-002',
            name: 'Risk and Opportunity Management',
            type: 'Management',
            categories: ['Quality', 'Environment', 'OHS'],
            iso9001: ['6.1'],
            iso14001: ['6.1'],
            iso45001: ['6.1'],
            owner: 'Risk Manager',
            kpis: ['Risks identified', 'Risk treatment effectiveness', 'Opportunities realized'],
          },
          {
            id: 'PROC-003',
            name: 'Document Control',
            type: 'Support',
            categories: ['Quality', 'Environment', 'OHS'],
            iso9001: ['7.5'],
            iso14001: ['7.5'],
            iso45001: ['7.5'],
            owner: 'QMS Manager',
            kpis: ['Documents controlled', 'Review cycle compliance', 'Version accuracy'],
          },
          {
            id: 'PROC-004',
            name: 'Competency and Training',
            type: 'Support',
            categories: ['Quality', 'Environment', 'OHS'],
            iso9001: ['7.2', '7.3'],
            iso14001: ['7.2', '7.3'],
            iso45001: ['7.2', '7.3'],
            owner: 'HR Manager',
            kpis: ['Training completion rate', 'Competency assessments', 'Awareness levels'],
          },
          {
            id: 'PROC-005',
            name: 'Communication',
            type: 'Support',
            categories: ['Quality', 'Environment', 'OHS'],
            iso9001: ['7.4'],
            iso14001: ['7.4'],
            iso45001: ['7.4'],
            owner: 'Communications Manager',
            kpis: ['Communication effectiveness', 'Stakeholder satisfaction', 'Response time'],
          },
          {
            id: 'PROC-006',
            name: 'Product/Service Realization',
            type: 'Operation',
            categories: ['Quality'],
            iso9001: ['8.1', '8.2', '8.3', '8.4', '8.5', '8.6', '8.7'],
            iso14001: [],
            iso45001: [],
            owner: 'Operations Manager',
            kpis: ['Customer satisfaction', 'Delivery performance', 'Product quality'],
          },
          {
            id: 'PROC-007',
            name: 'Environmental Aspects Management',
            type: 'Operation',
            categories: ['Environment'],
            iso9001: [],
            iso14001: ['6.1.2', '8.1', '8.2'],
            iso45001: [],
            owner: 'Environmental Manager',
            kpis: ['Environmental performance', 'Compliance status', 'Impact reduction'],
          },
          {
            id: 'PROC-008',
            name: 'Hazard Identification and Risk Assessment',
            type: 'Operation',
            categories: ['OHS'],
            iso9001: [],
            iso14001: [],
            iso45001: ['6.1.1', '6.1.2', '8.1.2'],
            owner: 'Safety Manager',
            kpis: ['Hazards identified', 'Risk assessment currency', 'Control effectiveness'],
          },
          {
            id: 'PROC-009',
            name: 'Monitoring and Measurement',
            type: 'Evaluation',
            categories: ['Quality', 'Environment', 'OHS'],
            iso9001: ['9.1'],
            iso14001: ['9.1'],
            iso45001: ['9.1'],
            owner: 'Quality Manager',
            kpis: ['KPI achievement', 'Monitoring equipment calibration', 'Data analysis quality'],
          },
          {
            id: 'PROC-010',
            name: 'Internal Audit',
            type: 'Evaluation',
            categories: ['Quality', 'Environment', 'OHS'],
            iso9001: ['9.2'],
            iso14001: ['9.2'],
            iso45001: ['9.2'],
            owner: 'Internal Audit Manager',
            kpis: ['Audit findings', 'Corrective action closure', 'Audit schedule compliance'],
          },
          {
            id: 'PROC-011',
            name: 'Management Review',
            type: 'Evaluation',
            categories: ['Quality', 'Environment', 'OHS'],
            iso9001: ['9.3'],
            iso14001: ['9.3'],
            iso45001: ['9.3'],
            owner: 'Top Management',
            kpis: ['Review effectiveness', 'Decision implementation', 'Resource adequacy'],
          },
          {
            id: 'PROC-012',
            name: 'Corrective Action and Continual Improvement',
            type: 'Improvement',
            categories: ['Quality', 'Environment', 'OHS'],
            iso9001: ['10.1', '10.2', '10.3'],
            iso14001: ['10.1', '10.2', '10.3'],
            iso45001: ['10.1', '10.2', '10.3'],
            owner: 'Quality Manager',
            kpis: ['CAPA closure rate', 'Improvement initiatives', 'System effectiveness'],
          },
        ];

        return {
          totalProcesses: processes.length,
          managementProcesses: processes.filter(p => p.type === 'Management').length,
          supportProcesses: processes.filter(p => p.type === 'Support').length,
          operationalProcesses: processes.filter(p => p.type === 'Operation').length,
          evaluationProcesses: processes.filter(p => p.type === 'Evaluation').length,
          improvementProcesses: processes.filter(p => p.type === 'Improvement').length,
          processes,
          integrationMatrix: {
            qualityOnly: processes.filter(p => p.categories.length === 1 && p.categories[0] === 'Quality').length,
            environmentOnly: processes.filter(p => p.categories.length === 1 && p.categories[0] === 'Environment').length,
            ohsOnly: processes.filter(p => p.categories.length === 1 && p.categories[0] === 'OHS').length,
            twoStandards: processes.filter(p => p.categories.length === 2).length,
            threeStandards: processes.filter(p => p.categories.length === 3).length,
          },
          recommendations: [
            'Use process-based approach for IMS integration',
            'Map processes to relevant standard clauses',
            'Identify shared processes for efficiency',
            'Maintain process ownership clarity',
            'Review process interactions regularly',
          ],
        };
      },
    },
    {
      name: 'develop_integrated_objectives',
      description: 'Develop integrated objectives across all standards',
      parameters: z.object({
        baselineYear: z.number().default(2024),
      }),
      execute: async (params) => {
        return {
          baselineYear: params.baselineYear,
          integratedObjectives: [
            {
              id: 'OBJ-INT-001',
              title: 'Customer Satisfaction Excellence',
              category: 'Quality',
              description: 'Achieve and maintain customer satisfaction rating above 85%',
              baseline: '78%',
              current: '82%',
              target: '85%',
              deadline: '2025-12-31',
              progress: 57,
              status: 'on_track',
              linkedClauses: ['ISO9001:9.1.2', 'ISO9001:5.2'],
              owner: 'Quality Manager',
            },
            {
              id: 'OBJ-INT-002',
              title: 'Environmental Performance',
              category: 'Environment',
              description: 'Reduce carbon footprint by 15% from baseline',
              baseline: '7,850 tCO2e',
              current: '7,130 tCO2e',
              target: '6,672 tCO2e',
              deadline: '2025-12-31',
              progress: 61,
              status: 'on_track',
              linkedClauses: ['ISO14001:6.2', 'ISO14001:9.1.1'],
              owner: 'Environmental Manager',
            },
            {
              id: 'OBJ-INT-003',
              title: 'Occupational Health and Safety',
              category: 'OHS',
              description: 'Achieve LTIFR below 1.0',
              baseline: '1.5',
              current: '1.2',
              target: '1.0',
              deadline: '2025-12-31',
              progress: 60,
              status: 'on_track',
              linkedClauses: ['ISO45001:6.2', 'ISO45001:9.1.1'],
              owner: 'Safety Manager',
            },
            {
              id: 'OBJ-INT-004',
              title: 'Integrated Compliance',
              category: 'IMS',
              description: 'Maintain 95% compliance across all standards',
              baseline: '82%',
              current: '86%',
              target: '95%',
              deadline: '2025-12-31',
              progress: 31,
              status: 'at_risk',
              linkedClauses: ['ISO9001:6.1.2', 'ISO14001:6.1.2', 'ISO45001:6.1.2'],
              owner: 'IMS Manager',
            },
            {
              id: 'OBJ-INT-005',
              title: 'Process Efficiency',
              category: 'IMS',
              description: 'Reduce process duplication by 30%',
              baseline: '45 overlapping processes',
              current: '38 overlapping processes',
              target: '32 overlapping processes',
              deadline: '2025-12-31',
              progress: 54,
              status: 'on_track',
              linkedClauses: ['ISO9001:4.4', 'ISO14001:4.4', 'ISO45001:4.4'],
              owner: 'Process Owner',
            },
            {
              id: 'OBJ-INT-006',
              title: 'Audit Efficiency',
              category: 'IMS',
              description: 'Reduce audit days by 25% through integration',
              baseline: '12 audit days/year',
              current: '10 audit days/year',
              target: '9 audit days/year',
              deadline: '2025-12-31',
              progress: 67,
              status: 'on_track',
              linkedClauses: ['ISO9001:9.2', 'ISO14001:9.2', 'ISO45001:9.2'],
              owner: 'Internal Audit Manager',
            },
          ],
          summary: {
            totalObjectives: 6,
            qualityObjectives: 1,
            environmentObjectives: 1,
            ohsObjectives: 1,
            integratedObjectives: 3,
            onTrack: 5,
            atRisk: 1,
          },
          recommendations: [
            'Focus on at-risk compliance objective',
            'Continue integrated audit program development',
            'Share best practices across standard teams',
            'Report integrated KPIs in management review',
          ],
        };
      },
    },
    {
      name: 'calculate_ims_benefits',
      description: 'Calculate benefits and efficiency gains from IMS integration',
      parameters: z.object({
        includeCost: z.boolean().default(true),
      }),
      execute: async (params) => {
        return {
          analysisPeriod: 'Annual',
          efficiencyGains: {
            documentation: {
              baseline: '3 separate manuals',
              current: '1 integrated manual',
              reduction: '67%',
              timeSaved: '120 hours/year',
            },
            audits: {
              baseline: '3 separate audit programs (12 days)',
              current: '1 integrated program (7 days)',
              reduction: '42%',
              timeSaved: '75 auditor days/year',
            },
            training: {
              baseline: '3 separate training programs',
              current: '1 integrated program',
              reduction: '33%',
              timeSaved: '40 hours/year',
            },
            meetings: {
              baseline: '3 separate management reviews',
              current: '1 integrated review',
              reduction: '67%',
              timeSaved: '32 hours/year',
            },
            procedures: {
              baseline: '45 separate procedures',
              current: '25 integrated procedures',
              reduction: '44%',
              timeSaved: '200 hours/year',
            },
          },
          costSavings: params.includeCost ? {
            documentation: 15000,
            audits: 25000,
            training: 8000,
            meetings: 5000,
            procedures: 20000,
            total: 73000,
            currency: 'USD',
          } : undefined,
          operationalBenefits: [
            'Holistic view of organizational performance',
            'Reduced duplication of efforts',
            'Improved coordination between departments',
            'Streamlined compliance monitoring',
            'Enhanced decision-making through integrated data',
            'Better resource allocation',
          },
          challenges: [
            'Initial integration requires significant effort',
            'Cultural change needed across departments',
            'Training requirements for integrated approach',
            'Maintaining standard-specific compliance while integrating',
          ],
          recommendations: [
            'Continue investing in IMS integration',
            'Track benefits through defined KPIs',
            'Share success stories to build momentum',
            'Address challenges through change management',
          ],
        };
      },
    },
  ],
};

