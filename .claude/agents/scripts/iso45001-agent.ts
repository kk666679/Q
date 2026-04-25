import { z } from 'zod';
import { AgentConfig, AgentRole } from '../types';

/**
 * ISO 45001:2018 Occupational Health and Safety Agent
 * Specialized agent for OHSMS implementation, risk assessment, and workplace safety compliance
 */
export const iso45001Agent: AgentConfig = {
  id: 'iso45001-agent',
  role: AgentRole.QUALITY_MANAGER,
  name: 'ISO 45001 Occupational Health & Safety Manager',
  capabilities: [
    'ISO 45001:2018 OHSMS Implementation',
    'Hazard Identification & Risk Assessment',
    'Occupational Health & Safety Planning',
    'Emergency Preparedness & Response',
    'Incident Investigation & Analysis',
    'Safety Performance Monitoring',
    'Worker Consultation & Participation',
    'Legal Compliance Evaluation',
    'Contractor Safety Management',
    'Business Continuity Planning',
  ],
  systemPrompt: `You are an ISO 45001:2018 Occupational Health and Safety Management System Expert specializing in workplace safety, risk assessment, and employee well-being.

Your expertise includes:
- ISO 45001:2018 requirements and Clauses 4-10
- Hazard identification and risk assessment methodologies
- Occupational health and safety planning
- Emergency preparedness and response planning
- Incident investigation and root cause analysis
- Legal compliance evaluation
- Worker consultation and participation
- Contractor and visitor safety management
- Mental health and psychosocial risk management
- ISO 45003:2021 Psychological health and safety at work

Key ISO 45001:2018 Clauses:
- Clause 4: Context of the Organization
- Clause 5: Leadership and Worker Participation
- Clause 6: Planning
- Clause 7: Support
- Clause 8: Operation
- Clause 9: Performance Evaluation
- Clause 10: Improvement

ISO 45003 Psychological Health and Safety:
- Organizational psychosocial hazards
- Management of psychosocial risks
- Protection of worker mental health

Provide expert guidance on OHSMS implementation, hazard management, and compliance.`,
  tools: [
    {
      name: 'assess_ohsms_compliance',
      description: 'Assess compliance against ISO 45001:2018 clauses',
      parameters: z.object({
        clauses: z.array(z.string()).optional(),
        includePsychosocial: z.boolean().default(true),
      }),
      execute: async (params) => {
        return {
          complianceScore: 74,
          clauseResults: [
            { clause: '4.1', status: 'compliant', score: 80 },
            { clause: '4.2', status: 'partial', score: 68 },
            { clause: '4.3', status: 'compliant', score: 82 },
            { clause: '4.4', status: 'compliant', score: 78 },
            { clause: '5.1', status: 'partial', score: 65 },
            { clause: '5.2', status: 'compliant', score: 75 },
            { clause: '5.3', status: 'partial', score: 70 },
            { clause: '5.4', status: 'partial', size: 72 },
            { clause: '6.1.1', status: 'compliant', score: 80 },
            { clause: '6.1.2', status: 'partial', score: 68 },
            { clause: '6.1.3', status: 'compliant', score: 82 },
            { clause: '6.2', status: 'compliant', score: 78 },
            { clause: '7.1', status: 'compliant', score: 85 },
            { clause: '7.2', status: 'compliant', score: 80 },
            { clause: '7.3', status: 'compliant', score: 78 },
            { clause: '7.4', status: 'partial', score: 65 },
            { clause: '7.5', status: 'compliant', score: 88 },
            { clause: '8.1', status: 'partial', score: 70 },
            { clause: '8.1.2', status: 'compliant', score: 82 },
            { clause: '8.2', status: 'compliant', score: 80 },
            { clause: '8.3', status: 'compliant', score: 78 },
            { clause: '8.4', status: 'partial', score: 68 },
            { clause: '8.5', status: 'compliant', score: 75 },
            { clause: '8.6', status: 'compliant', score: 82 },
            { clause: '9.1', status: 'compliant', score: 78 },
            { clause: '9.2', status: 'compliant', score: 80 },
            { clause: '9.3', status: 'compliant', score: 75 },
            { clause: '10.1', status: 'compliant', score: 82 },
            { clause: '10.2', status: 'compliant', score: 78 },
            { clause: '10.3', status: 'compliant', score: 80 },
          ],
          gaps: [
            'Worker consultation needs strengthening (5.3)',
            'Legal compliance monitoring incomplete (6.1.2)',
            'Operational planning lacks some controls (8.1)',
            'Contractor safety management needs improvement (8.4)',
            'Communication and awareness could be enhanced (7.4)',
          ],
          recommendations: [
            'Establish formal worker consultation committee',
            'Implement legal compliance monitoring system',
            'Review operational controls for adequacy',
            'Develop contractor safety management program',
            'Enhance safety communication channels',
          ],
        };
      },
    },
    {
      name: 'conduct_hazard_identification',
      description: 'Conduct systematic hazard identification',
      parameters: z.object({
        workplace: z.string(),
        includePsychosocial: z.boolean().default(true),
      }),
      execute: async (params) => {
        const physicalHazards = [
          { id: 'HZ-001', category: 'Physical', hazard: 'Moving machinery', description: 'Risk of struck-by or caught-in injuries from conveyor systems', likelihood: 'likely', severity: 'severe', riskLevel: 'high', controls: ['Guards', 'Interlocks', 'LOTO'] },
          { id: 'HZ-002', category: 'Physical', hazard: 'Electrical systems', description: 'Risk of electric shock from faulty wiring', likelihood: 'possible', severity: 'severe', riskLevel: 'high', controls: ['Insulation', 'Grounding', 'Inspection'] },
          { id: 'HZ-003', category: 'Physical', hazard: 'Slips, trips, falls', description: 'Wet floors, cluttered walkways, uneven surfaces', likelihood: 'likely', severity: 'moderate', riskLevel: 'medium', controls: ['Housekeeping', 'Signage', 'Non-slip surfaces'] },
          { id: 'HZ-004', category: 'Physical', hazard: 'Noise exposure', description: 'Prolonged exposure above 85dB', likelihood: 'likely', severity: 'moderate', riskLevel: 'medium', controls: ['PPE', 'Engineering controls', 'Monitoring'] },
          { id: 'HZ-005', category: 'Physical', hazard: 'Confined spaces', description: 'Entry into tanks, vessels, silos', likelihood: 'possible', severity: 'severe', riskLevel: 'high', controls: ['Permit system', 'Ventilation', 'Rescue plan'] },
        ];

        const chemicalHazards = [
          { id: 'HZ-006', category: 'Chemical', hazard: 'Solvents', description: 'Exposure to organic solvents in cleaning', likelihood: 'likely', severity: 'moderate', riskLevel: 'medium', controls: ['Ventilation', 'PPE', 'Substitution'] },
          { id: 'HZ-007', category: 'Chemical', hazard: 'Compressed gases', description: 'Cylinder handling and leak risks', likelihood: 'possible', severity: 'severe', riskLevel: 'high', controls: ['Secure storage', 'Training', 'Inspection'] },
        ];

        const ergonomicHazards = [
          { id: 'HZ-008', category: 'Ergonomic', hazard: 'Manual handling', description: 'Repetitive lifting of heavy loads', likelihood: 'likely', severity: 'moderate', riskLevel: 'medium', controls: ['Mechanical aids', 'Training', 'Job rotation'] },
          { id: 'HZ-009', category: 'Ergonomic', hazard: 'VDU work', description: 'Prolonged screen time causing musculoskeletal issues', likelihood: 'likely', severity: 'minor', riskLevel: 'low', controls: ['Ergonomic furniture', 'Breaks', 'Training'] },
        ];

        const psychosocialHazards = params.includePsychosocial ? [
          { id: 'HZ-010', category: 'Psychosocial', hazard: 'Workload', description: 'Excessive work demands and tight deadlines', likelihood: 'likely', severity: 'moderate', riskLevel: 'medium', controls: ['Resource allocation', 'Priority setting', 'Support'] },
          { id: 'HZ-011', category: 'Psychosocial', hazard: 'Job insecurity', description: 'Uncertainty about employment future', likelihood: 'possible', severity: 'moderate', riskLevel: 'medium', controls: ['Communication', 'Development opportunities'] },
          { id: 'HZ-012', category: 'Psychosocial', hazard: 'Bullying/harassment', description: 'Interpersonal conflicts and harassment', likelihood: 'possible', severity: 'severe', riskLevel: 'high', controls: ['Policy', 'Training', 'Reporting system'] },
        ] : [];

        const allHazards = [...physicalHazards, ...chemicalHazards, ...ergonomicHazards, ...psychosocialHazards];

        return {
          workplace: params.workplace,
          assessmentDate: new Date().toISOString(),
          totalHazards: allHazards.length,
          highRisk: allHazards.filter(h => h.riskLevel === 'high').length,
          mediumRisk: allHazards.filter(h => h.riskLevel === 'medium').length,
          lowRisk: allHazards.filter(h => h.riskLevel === 'low').length,
          byCategory: {
            physical: physicalHazards.length,
            chemical: chemicalHazards.length,
            ergonomic: ergonomicHazards.length,
            psychosocial: psychosocialHazards.length,
          },
          hazards: allHazards,
          riskMatrix: {
            severe: { likely: 4, possible: 3, unlikely: 2 },
            moderate: { likely: 3, possible: 2, unlikely: 1 },
            minor: { likely: 2, possible: 1, unlikely: 0 },
          },
          recommendations: [
            'Prioritize controls for high-risk hazards',
            'Implement hierarchy of controls (elimination > substitution > engineering > administrative > PPE)',
            'Review and update risk assessments regularly',
            'Involve workers in hazard identification',
            'Include psychosocial hazards in ongoing monitoring',
          ],
        };
      },
    },
    {
      name: 'investigate_incident',
      description: 'Investigate and analyze workplace incident',
      parameters: z.object({
        incidentId: z.string(),
        includeRootCause: z.boolean().default(true),
      }),
      execute: async (params) => {
        return {
          incidentId: params.incidentId,
          investigationDate: new Date().toISOString(),
          incidentDetails: {
            date: '2024-03-15',
            time: '14:30',
            location: 'Warehouse - Loading Dock',
            type: 'Injury',
            severity: 'Lost Time Injury',
            injuredParty: 'Forklift Operator',
            description: 'Employee suffered fractured wrist when forklift collided with pallet rack',
          },
          immediateCauses: [
            'Inadequate visibility at corner',
            'Speed of forklift too fast',
            'Pallet rack protruding into aisle',
          ],
          underlyingCauses: [
            'Traffic management plan not followed',
            'Mirror at corner was obstructed',
            'Insufficient training on forklift operation',
            'Pressure to meet delivery targets',
          ],
          rootCauses: params.includeRootCause ? [
            { category: 'Management', cause: 'Inadequate safety culture', evidence: 'Previous near-misses not addressed' },
            { category: 'Equipment', cause: 'Poor workplace design', evidence: 'Corner visibility issue known but not resolved' },
            { category: 'Training', cause: 'Insufficient competency verification', evidence: 'Training records incomplete' },
            { category: 'Procedures', cause: 'Traffic plan not enforced', evidence: 'No monitoring of forklift speeds' },
          ] : [],
          contributingFactors: [
            'Time pressure from management',
            'Inadequate maintenance of safety mirrors',
            'Worker unfamiliarity with area',
          ],
          correctiveActions: [
            { action: 'Install additional mirrors and warning signs', owner: 'Facilities', dueDate: '2024-04-15', status: 'completed' },
            { action: 'Implement speed monitoring system', owner: 'Operations', dueDate: '2024-05-01', status: 'in_progress' },
            { action: 'Retrain forklift operators on safety', owner: 'HR/Safety', dueDate: '2024-04-30', status: 'in_progress' },
            { action: 'Review and enforce traffic management plan', owner: 'Safety', dueDate: '2024-04-20', status: 'pending' },
            { action: 'Conduct root cause analysis on all near-misses', owner: 'Safety', dueDate: '2024-05-15', status: 'pending' },
          ],
          lessonsLearned: [
            'Visibility issues must be addressed immediately',
            'Near-miss reporting system needs improvement',
            'Training competency should be verified on-site',
            'Production pressure should not compromise safety',
          ],
          recommendations: [
            'Complete all corrective actions by deadlines',
            'Share lessons learned with all employees',
            'Implement behavioral-based safety observations',
            'Review KPIs to ensure safety is not compromised',
          ],
        };
      },
    },
    {
      name: 'evaluate_legal_compliance',
      description: 'Evaluate occupational health and safety legal compliance',
      parameters: z.object({
        jurisdiction: z.string().default('local'),
      }),
      execute: async (params) => {
        return {
          evaluationDate: new Date().toISOString(),
          jurisdiction: params.jurisdiction,
          overallStatus: 'compliant',
          complianceScore: 88,
          regulations: [
            {
              id: 'OSH-001',
              name: 'Occupational Safety and Health Act',
              applicability: 'General workplace safety',
              status: 'compliant',
              lastAudit: '2024-02-10',
              requirements: [
                'Safety policy statement', 'Risk assessments', 'Safety training', 'Incident reporting'
              ],
            },
            {
              id: 'OSH-002',
              name: 'Factory Act - Working Hours',
              applicability: 'Employee working hours and conditions',
              status: 'compliant',
              lastAudit: '2024-01-20',
              requirements: [
                'Maximum working hours', 'Rest periods', 'Overtime regulations'
              ],
            },
            {
              id: 'OSH-003',
              name: 'Personal Protective Equipment Regulations',
              mandatory: 'PPE provision and use',
              status: 'compliant',
              lastAudit: '2024-03-05',
              requirements: [
                'Risk-based PPE selection', 'Training on PPE use', 'PPE maintenance'
              ],
            },
            {
              id: 'OSH-004',
              name: 'Health and Safety (First Aid) Regulations',
              applicability: 'First aid provision',
              status: 'partial',
              lastAudit: '2024-02-28',
              requirements: [
                'First aid equipment', 'Trained first aiders', 'First aid room'
              ],
              gaps: ['First aid room not available in warehouse'],
            },
            {
              id: 'OSH-005',
              name: 'Manual Handling Operations Regulations',
              applicability: 'Manual handling activities',
              status: 'compliant',
              lastAudit: '2024-01-15',
              requirements: [
                'Risk assessment', 'Training', 'Mechanical aids provision'
              ],
            },
          ],
          pendingActions: [
            { regulation: 'Health and Safety (First Aid) Regulations', action: 'Establish first aid room in warehouse', dueDate: '2024-06-30', priority: 'high' },
          ],
          recommendations: [
            'Complete first aid room installation by deadline',
            'Maintain current compliance levels',
            'Monitor legislative changes',
            'Continue regular safety audits',
          ],
        };
      },
    },
    {
      name: 'assess_psychosocial_risks',
      description: 'Assess psychosocial hazards and psychological safety',
      parameters: z.object({
        includeISO45003: z.boolean().default(true),
      }),
      execute: async (params) => {
        return {
          assessmentDate: new Date().toISOString(),
          framework: params.includeISO45003 ? 'ISO 45003:2021' : 'Generic',
          overallRiskLevel: 'medium',
          psychosocialHazards: [
            {
              id: 'PSY-001',
              hazard: 'Excessive workload',
              category: 'Work demands',
              currentControls: ['Priority setting', 'Resource allocation'],
              riskLevel: 'medium',
              indicators: ['Overtime hours', 'Sick leave trends', 'Survey feedback'],
              recommendations: ['Review staffing levels', 'Implement workload management'],
            },
            {
              id: 'PSY-002',
              hazard: 'Low job control',
              category: 'Work organization',
              currentControls: ['Team meetings', 'Feedback sessions'],
              riskLevel: 'medium',
              indicators: ['Survey scores', 'Turnover rates'],
              recommendations: ['Increase autonomy', 'Involve workers in decisions'],
            },
            {
              id: 'PSY-003',
              hazard: 'Poor manager support',
              category: 'Work relationships',
              currentControls: ['Leadership training', 'Open door policy'],
              riskLevel: 'low',
              indicators: ['Exit interviews', 'Survey feedback'],
              recommendations: ['Continue leadership development'],
            },
            {
              id: 'PSY-004',
              hazard: 'Lack of role clarity',
              category: 'Work organization',
              currentControls: ['Job descriptions', 'Team briefings'],
              riskLevel: 'medium',
              indicators: ['Confusion reports', 'Conflict incidents'],
              recommendations: ['Review role definitions', 'Clear communication of expectations'],
            },
            {
              id: 'PSY-005',
              hazard: 'Inadequate change management',
              category: 'Organizational factors',
              currentControls: ['Communication emails', 'Town halls'],
              riskLevel: 'high',
              indicators: ['Anxiety surveys', 'Resistance to change'],
              recommendations: ['Implement structured change process', 'Worker involvement in planning'],
            },
            {
              id: 'PSY-006',
              hazard: 'Bullying and harassment',
              category: 'Work relationships',
              currentControls: ['Policy', 'Reporting system', 'Training'],
              riskLevel: 'medium',
              indicators: ['Complaint trends', 'Anonymous surveys'],
              recommendations: ['Reinforce zero-tolerance policy', 'Regular awareness training'],
            },
          ],
          psychologicalSafetyScore: 72,
          dimensions: {
            organizationalCulture: { score: 70, status: 'needs_improvement' },
            leadership: { score: 75, status: 'adequate' },
            workloadManagement: { score: 68, status: 'needs_improvement' },
            jobControl: { score: 72, status: 'adequate' },
            support: { score: 78, status: 'good' },
            changeManagement: { score: 65, status: 'needs_improvement' },
          },
          interventions: [
            { priority: 'high', intervention: 'Change management workshop', timeline: 'Q2 2024', owner: 'HR' },
            { priority: 'high', intervention: 'Workload assessment', timeline: 'Q2 2024', owner: 'Operations' },
            { priority: 'medium', intervention: 'Leadership coaching', timeline: 'Q3 2024', owner: 'HR' },
          ],
          recommendations: [
            'Prioritize change management improvements',
            'Address workload issues through resource planning',
            'Continue building psychological safety culture',
            'Monitor psychosocial indicators regularly',
            'Provide access to employee assistance program',
          ],
        };
      },
    },
    {
      name: 'prepare_emergency_response',
      description: 'Prepare and review emergency response plans',
      parameters: z.object({
        scenarios: z.array(z.string()).optional(),
      }),
      execute: async (params) => {
        const emergencyScenarios = params.scenarios || [
          'Fire', 'Medical emergency', 'Chemical spill', 'Natural disaster', 'Security threat'
        ];

        return {
          lastReview: new Date().toISOString(),
          nextReview: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          scenarios: emergencyScenarios.map(scenario => ({
            scenario,
            readiness: scenario === 'Fire' ? 'ready' : scenario === 'Medical emergency' ? 'ready' : 'partial',
            responseTime: scenario === 'Fire' ? '3 minutes' : scenario === 'Medical emergency' ? '2 minutes' : '5 minutes',
            resources: {
              personnel: scenario === 'Fire' ? 15 : scenario === 'Medical emergency' ? 10 : 8,
              equipment: ['First aid kit', 'Fire extinguisher', 'Communication device'],
              evacuationRoutes: 2,
              assemblyPoints: 2,
            },
            training: {
              lastTraining: '2024-02-15',
              nextTraining: '2024-08-15',
              status: 'current',
            },
            contacts: {
              emergencyServices: '999',
              internalEmergencyCoordinator: 'John Smith',
              safetyOfficer: 'Jane Doe',
            },
          })),
          drillSchedule: {
            fire: { frequency: 'quarterly', lastDrill: '2024-03-01', nextDrill: '2024-06-01', status: 'compliant' },
            medical: { frequency: 'semi-annual', lastDrill: '2024-01-20', nextDrill: '2024-07-20', status: 'compliant' },
            chemicalSpill: { frequency: 'annual', lastDrill: '2023-11-10', nextDrill: '2024-11-10', status: 'due_soon' },
            evacuation: { frequency: 'quarterly', lastDrill: '2024-03-01', nextDrill: '2024-06-01', status: 'compliant' },
          },
          recommendations: [
            'Schedule chemical spill drill before deadline',
            'Update contact information quarterly',
            'Review and practice evacuation routes',
            'Ensure all emergency equipment is inspected',
            'Maintain emergency lighting and signage',
          ],
        };
      },
    },
    {
      name: 'calculate_safety_metrics',
      description: 'Calculate occupational health and safety performance metrics',
      parameters: z.object({
        period: z.string().default('2024-Q1'),
        includeTrends: z.boolean().default(true),
      }),
      execute: async (params) => {
        return {
          period: params.period,
          laggingIndicators: {
            LTIFR: { value: 1.2, target: 1.0, trend: 'improving', benchmark: 1.5 },
            TRIR: { value: 2.8, target: 2.5, trend: 'stable', benchmark: 3.2 },
            SeverityRate: { value: 15, target: 12, trend: 'improving', benchmark: 18 },
            LostDays: { value: 45, target: 40, trend: 'improving', benchmark: 50 },
            Fatalities: { value: 0, target: 0, trend: 'stable', benchmark: 0 },
          },
          leadingIndicators: {
            safetyTrainingsCompleted: { value: 95, target: 100, unit: '%', trend: 'improving' },
            riskAssessmentsCompleted: { value: 88, target: 100, unit: '%', trend: 'improving' },
            nearMissReports: { value: 42, target: 50, unit: 'reports', trend: 'improving' },
            correctiveActionsOnTime: { value: 82, target: 90, unit: '%', trend: 'stable' },
            safetyInspectionsCompleted: { value: 92, target: 100, unit: '%', trend: 'stable' },
            toolboxTalksConducted: { value: 48, target: 52, unit: 'sessions', trend: 'stable' },
          },
          incidentSummary: {
            totalIncidents: 12,
            lostTimeInjuries: 2,
            medicalTreatment: 3,
            firstAid: 5,
            nearMisses: 42,
            propertyDamage: 1,
          },
          trends: params.includeTrends ? {
            LTIFR: 'decreasing over past 4 quarters',
            TRIR: 'stable with slight improvement',
            nearMisses: 'increasing - positive safety culture indicator',
            correctiveActions: 'improving closure rate',
          } : undefined,
          recommendations: [
            'Continue improving LTIFR toward target',
            'Encourage more near-miss reporting',
            'Focus on timely corrective action closure',
            'Maintain safety training completion rates',
            'Review high-severity incidents for lessons learned',
          ],
        };
      },
    },
  ],
};

