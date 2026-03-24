import { z } from 'zod';
import { AgentConfig, AgentRole } from '../types';

/**
 * ISO 14001:2015 Environmental Management Agent
 * Specialized agent for EMS implementation, climate risk (AMD.1:2024), and environmental compliance
 */
export const iso14001Agent: AgentConfig = {
  id: 'iso14001-agent',
  role: AgentRole.QUALITY_MANAGER,
  name: 'ISO 14001 Environmental Manager',
  capabilities: [
    'ISO 14001:2015 EMS Implementation',
    'Environmental Aspects & Impacts',
    'AMD.1:2024 Climate Change Adaptation',
    'Environmental Legal Compliance',
    'Environmental Objectives & Targets',
    'Environmental Performance Monitoring',
    'Life Cycle Assessment',
    'Waste Management & Pollution Prevention',
    'Energy Management',
    'Carbon Footprint Analysis',
  ],
  systemPrompt: `You are an ISO 14001:2015 Environmental Management System Expert with specialized knowledge in AMD.1:2024 climate change adaptation requirements.

Your expertise includes:
- ISO 14001:2015 requirements and Clauses 4-10
- Environmental aspects and impacts identification (Clause 6.1.2)
- Environmental legal compliance (Clause 6.1.2)
- AMD.1:2024 Climate Change Adaptation requirements
- ISO 14004:2016 implementation guidance
- Environmental performance evaluation
- Life cycle assessment (ISO 14044)
- Carbon footprint and greenhouse gas accounting
- Energy management (ISO 50001)
- Waste management and pollution prevention

Key ISO 14001:2015 Clauses with AMD.1:2024 updates:
- Clause 4: Context of the Organization (climate change as relevant issue - AMD.1:2024)
- Clause 5: Leadership (environmental policy with climate commitments - AMD.1:2024)
- Clause 6: Planning (climate risks and opportunities - AMD.1:2024)
- Clause 7: Support (climate competency - AMD.1:2024)
- Clause 8: Operation (climate adaptation in operational control - AMD.1:2024)
- Clause 9: Performance Evaluation (climate metrics - AMD.1:2024)
- Clause 10: Improvement (climate performance improvement - AMD.1:2024)

Provide expert guidance on EMS implementation, climate risk assessment, and environmental compliance.`,
  tools: [
    {
      name: 'assess_ems_compliance',
      description: 'Assess compliance against ISO 14001:2015 clauses including AMD.1:2024',
      parameters: z.object({
        clauses: z.array(z.string()).optional(),
        includeClimateChange: z.boolean().default(true),
      }),
      execute: async (params) => {
        return {
          complianceScore: 76,
          clauseResults: [
            { clause: '4.1', status: 'partial', score: 70, note: 'Climate change not fully addressed' },
            { clause: '4.2', status: 'partial', score: 72, note: 'Climate expectations from interested parties not identified' },
            { clause: '4.3', status: 'compliant', score: 85 },
            { clause: '4.4', status: 'compliant', score: 82 },
            { clause: '5.1', status: 'partial', score: 68, note: 'Climate commitment missing from leadership' },
            { clause: '5.2', status: 'partial', score: 65, note: 'Environmental policy needs climate update' },
            { clause: '5.3', status: 'compliant', score: 80 },
            { clause: '6.1.1', status: 'partial', score: 65, note: 'Climate risks not included in planning' },
            { clause: '6.1.2', status: 'partial', score: 70, note: 'Legal compliance for climate not monitored' },
            { clause: '6.2', status: 'compliant', score: 78 },
            { clause: '7.1', status: 'compliant', score: 82 },
            { clause: '7.2', status: 'compliant', score: 80 },
            { clause: '7.3', status: 'compliant', score: 78 },
            { clause: '7.4', status: 'compliant', score: 85 },
            { clause: '7.5', status: 'compliant', score: 88 },
            { clause: '8.1', status: 'partial', score: 72, note: 'Climate adaptation not in operational control' },
            { clause: '8.2', status: 'compliant', score: 80 },
            { clause: '8.3', status: 'compliant', score: 82 },
            { clause: '9.1', status: 'partial', score: 68, note: 'Climate KPIs not monitored' },
            { clause: '9.2', status: 'compliant', score: 75 },
            { clause: '9.3', status: 'compliant', score: 78 },
            { clause: '10.1', status: 'compliant', score: 80 },
            { clause: '10.2', status: 'compliant', score: 82 },
            { clause: '10.3', status: 'compliant', score: 78 },
          ],
          amd12024Gaps: [
            'Climate change not identified as relevant external issue (4.1)',
            'Interested party requirements for climate change not determined (4.2)',
            'Leadership commitment for climate action not demonstrated (5.1)',
            'Environmental policy does not include climate commitment (5.2)',
            'Climate risks and opportunities not addressed in planning (6.1)',
            'Legal requirements for climate change not monitored (6.1.2)',
            'Climate adaptation not integrated in operational control (8.1)',
            'Climate performance metrics not established (9.1)',
          ],
          recommendations: [
            'Update environmental policy to include climate change commitment',
            'Conduct climate change risk assessment per AMD.1:2024',
            'Identify climate-related legal requirements and compliance obligations',
            'Integrate climate metrics into environmental performance monitoring',
            'Update operational controls to address climate adaptation',
            'Include climate competencies in training requirements',
            'Establish climate-related KPIs in management review',
          ],
        };
      },
    },
    {
      name: 'identify_aspects_impacts',
      description: 'Identify and evaluate environmental aspects and impacts',
      parameters: z.object({
        activities: z.array(z.string()),
        evaluationCriteria: z.array(z.string()).optional(),
      }),
      execute: async (params) => {
        const aspects = params.activities.flatMap(activity => [
          {
            id: `EA-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            activity,
            aspect: 'Energy consumption',
            impact: 'Resource depletion, GHG emissions',
            type: 'direct',
            significance: 'significant',
            legalRequirements: ['Energy Efficiency Act'],
            controlMeasures: ['Energy monitoring system', 'LED lighting upgrade'],
            owner: 'Facilities Manager',
          },
          {
            id: `EA-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            activity,
            aspect: 'Waste generation',
            impact: 'Landfill burden, potential pollution',
            type: 'direct',
            significance: 'significant',
            legalRequirements: ['Waste Management Regulations'],
            controlMeasures: ['Waste segregation', 'Recycling program'],
            owner: 'Operations Manager',
          },
          {
            id: `EA-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            activity,
            aspect: 'Water consumption',
            impact: 'Water resource depletion',
            type: 'direct',
            significance: 'moderate',
            legalRequirements: ['Water Conservation Act'],
            controlMeasures: ['Water metering', 'Rainwater harvesting'],
            owner: 'Facilities Manager',
          },
          {
            id: `EA-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            activity,
            aspect: 'Emissions to air',
            impact: 'Air pollution, climate change contribution',
            type: 'direct',
            significance: 'significant',
            legalRequirements: ['Air Pollution Control Act', 'GHG Reporting'],
            controlMeasures: ['Emission monitoring', 'Filter systems'],
            owner: 'EHS Manager',
          },
        ]);

        return {
          totalAspects: aspects.length,
          significantAspects: aspects.filter(a => a.significance === 'significant').length,
          aspects,
          matrix: {
            highSignificance: aspects.filter(a => a.significance === 'significant').length,
            moderateSignificance: aspects.filter(a => a.significance === 'moderate').length,
            lowSignificance: aspects.filter(a => a.significance === 'low').length,
          },
          recommendations: [
            'Focus resources on significant aspects',
            'Establish objectives and targets for significant aspects',
            'Implement operational controls for all significant aspects',
            'Monitor and measure performance of significant aspects regularly',
          ],
        };
      },
    },
    {
      name: 'assess_climate_risk',
      description: 'Conduct climate change risk assessment per AMD.1:2024',
      parameters: z.object({
        timeHorizon: z.enum(['short', 'medium', 'long']).default('medium'),
        scenarios: z.array(z.string()).optional(),
      }),
      execute: async (params) => {
        const climateRisks = [
          {
            id: 'CR-001',
            category: 'Physical Risk',
            hazard: 'Extreme heat events',
            description: 'Increased frequency and intensity of heat waves',
            likelihood: 'likely',
            severity: 'high',
            riskScore: 16,
            adaptiveCapacity: 'moderate',
            vulnerabilityRating: 'high',
            timeHorizon: '2030',
            adaptationOptions: [
              'Install cooling systems in critical areas',
              'Modify work schedules to avoid peak heat',
              'Provide heat stress training',
            ],
            priority: 'high',
          },
          {
            id: 'CR-002',
            category: 'Physical Risk',
            hazard: 'Flooding',
            description: 'Increased risk of flooding due to extreme precipitation',
            likelihood: 'possible',
            severity: 'very_high',
            riskScore: 20,
            adaptiveCapacity: 'low',
            vulnerabilityRating: 'very_high',
            timeHorizon: '2050',
            adaptationOptions: [
              'Implement flood barriers and drainage',
              'Elevate critical equipment',
              'Develop flood emergency response plan',
            ],
            priority: 'critical',
          },
          {
            id: 'CR-003',
            category: 'Physical Risk',
            hazard: 'Water scarcity',
            description: 'Reduced water availability due to changing precipitation patterns',
            likelihood: 'likely',
            severity: 'high',
            riskScore: 15,
            adaptiveCapacity: 'moderate',
            vulnerabilityRating: 'high',
            timeHorizon: '2040',
            adaptationOptions: [
              'Implement water recycling systems',
              'Increase water storage capacity',
              'Reduce water consumption',
            ],
            priority: 'high',
          },
          {
            id: 'CR-004',
            category: 'Transition Risk',
            hazard: 'Carbon pricing',
            description: 'Increased costs due to carbon pricing regulations',
            likelihood: 'very_likely',
            severity: 'moderate',
            riskScore: 12,
            adaptiveCapacity: 'high',
            vulnerabilityRating: 'moderate',
            timeHorizon: '2030',
            adaptationOptions: [
              'Implement energy efficiency measures',
              'Transition to renewable energy',
              'Monitor carbon pricing developments',
            ],
            priority: 'medium',
          },
          {
            id: 'CR-005',
            category: 'Transition Risk',
            hazard: 'Climate disclosure requirements',
            description: 'Mandatory climate-related financial disclosures',
            likelihood: 'very_likely',
            severity: 'moderate',
            riskScore: 10,
            adaptiveCapacity: 'high',
            vulnerabilityRating: 'low',
            timeHorizon: '2025',
            adaptationOptions: [
              'Establish climate data collection processes',
              'Develop climate risk reporting framework',
              'Train staff on disclosure requirements',
            ],
            priority: 'medium',
          },
        ];

        return {
          assessmentDate: new Date().toISOString(),
          timeHorizon: params.timeHorizon,
          totalRisks: climateRisks.length,
          criticalRisks: climateRisks.filter(r => r.priority === 'critical').length,
          highRisks: climateRisks.filter(r => r.priority === 'high').length,
          mediumRisks: climateRisks.filter(r => r.priority === 'medium').length,
          risks: climateRisks,
          physicalRisks: climateRisks.filter(r => r.category === 'Physical Risk').length,
          transitionRisks: climateRisks.filter(r => r.category === 'Transition Risk').length,
          recommendations: [
            'Prioritize critical and high-risk climate hazards',
            'Develop adaptation plan for flooding (CR-002)',
            'Implement heat management measures (CR-001)',
            'Prepare for carbon pricing (CR-004)',
            'Establish climate disclosure processes (CR-005)',
            'Integrate climate risks into enterprise risk management',
          ],
        };
      },
    },
    {
      name: 'evaluate_compliance_status',
      description: 'Evaluate environmental legal compliance status',
      parameters: z.object({
        jurisdiction: z.string().default('local'),
        includePermits: z.boolean().default(true),
      }),
      execute: async (params) => {
        return {
          evaluationDate: new Date().toISOString(),
          jurisdiction: params.jurisdiction,
          overallStatus: 'compliant',
          complianceScore: 92,
          regulations: [
            {
              id: 'REG-001',
              name: 'Air Pollution Control Act',
              applicability: 'Emissions from manufacturing',
              status: 'compliant',
              lastAudit: '2024-01-15',
              nextAudit: '2025-01-15',
              permits: [
                { number: 'APC-2023-001', type: 'Emission', expiry: '2025-12-31', status: 'valid' },
              ],
              requirements: [
                { requirement: 'Stack emissions testing', frequency: 'annual', status: 'compliant' },
                { requirement: 'Emission limits compliance', frequency: 'continuous', status: 'compliant' },
              ],
            },
            {
              id: 'REG-002',
              name: 'Water Pollution Control Act',
              applicability: 'Wastewater discharge',
              status: 'compliant',
              lastAudit: '2024-02-20',
              nextAudit: '2025-02-20',
              permits: [
                { number: 'WPC-2023-002', type: 'Discharge', expiry: '2025-06-30', status: 'valid' },
              ],
              requirements: [
                { requirement: 'Discharge monitoring', frequency: 'monthly', status: 'compliant' },
                { requirement: 'Treatment system maintenance', frequency: 'quarterly', status: 'compliant' },
              ],
            },
            {
              id: 'REG-003',
              name: 'Waste Management Regulations',
              applicability: 'Hazardous and non-hazardous waste',
              status: 'compliant',
              lastAudit: '2024-03-10',
              nextAudit: '2025-03-10',
              permits: [],
              requirements: [
                { requirement: 'Waste manifest system', frequency: 'per shipment', status: 'compliant' },
                { requirement: 'Waste characterization', frequency: 'annual', status: 'compliant' },
                { requirement: 'Licensed waste carrier verification', frequency: 'per shipment', status: 'compliant' },
              ],
            },
            {
              id: 'REG-004',
              name: 'Energy Efficiency Act',
              applicability: 'Energy consumption and reporting',
              status: 'partial',
              lastAudit: '2024-04-05',
              nextAudit: '2024-10-05',
              permits: [],
              requirements: [
                { requirement: 'Energy audit', frequency: 'every 3 years', status: 'compliant' },
                { requirement: 'Energy reporting', frequency: 'annual', status: 'compliant' },
                { requirement: 'Energy management plan', frequency: 'annual', status: 'overdue' },
              ],
            },
            {
              id: 'REG-005',
              name: 'GHG Reporting Regulation',
              applicability: 'Greenhouse gas emissions',
              status: 'compliant',
              lastAudit: '2024-01-30',
              nextAudit: '2025-01-30',
              permits: [],
              requirements: [
                { requirement: 'GHG inventory', frequency: 'annual', status: 'compliant' },
                { requirement: 'Third-party verification', frequency: 'annual', status: 'compliant' },
              ],
            },
          ],
          overdueActions: [
            {
              requirement: 'Energy management plan',
              dueDate: '2024-09-30',
              status: 'overdue',
              action: 'Complete and submit energy management plan',
            },
          ],
          recommendations: [
            'Submit overdue energy management plan immediately',
            'Renew water discharge permit before expiry',
            'Continue monitoring air emission compliance',
            'Prepare for upcoming climate disclosure requirements',
          ],
        };
      },
    },
    {
      name: 'calculate_carbon_footprint',
      description: 'Calculate organizational carbon footprint',
      parameters: z.object({
        scope: z.enum(['1', '2', '3', 'all']).default('all'),
        baselineYear: z.number().default(2020),
        reportingYear: z.number().default(2024),
      }),
      execute: async (params) => {
        return {
          reportingYear: params.reportingYear,
          baselineYear: params.baselineYear,
          baselineEmissions: {
            scope1: 1250,
            scope2: 2100,
            scope3: 4500,
            total: 7850,
            unit: 'tCO2e',
          },
          currentEmissions: {
            scope1: 1180,
            scope2: 1750,
            scope3: 4200,
            total: 7130,
            unit: 'tCO2e',
          },
          emissionsByCategory: {
            scope1: {
              stationaryCombustion: { value: 850, unit: 'tCO2e' },
              mobileCombustion: { value: 280, unit: 'tCO2e' },
              fugitiveEmissions: { value: 50, unit: 'tCO2e' },
            },
            scope2: {
              electricity: { value: 1600, unit: 'tCO2e', method: 'location-based' },
              heating: { value: 150, unit: 'tCO2e' },
            },
            scope3: {
              purchasedGoods: { value: 1800, unit: 'tCO2e' },
              transportation: { value: 1200, unit: 'tCO2e' },
              waste: { value: 450, unit: 'tCO2e' },
              businessTravel: { value: 350, unit: 'tCO2e' },
              commuting: { value: 400, unit: 'tCO2e' },
            },
          },
          intensityMetrics: {
            perRevenue: { value: 35.6, unit: 'tCO2e/M$', target: 30, trend: 'decreasing' },
            perEmployee: { value: 12.8, unit: 'tCO2e/FTE', target: 10, trend: 'decreasing' },
            perUnit: { value: 0.42, unit: 'tCO2e/unit', target: 0.35, trend: 'decreasing' },
          },
          reduction: {
            absolute: { value: 720, unit: 'tCO2e', percentage: 9.2 },
            intensity: { value: 11.4, percentage: 24.2 },
          },
          targets: [
            { year: 2025, target: 20, progress: 46 },
            { year: 2030, target: 50, progress: 18.4 },
            { year: 2050, target: 'Net Zero', progress: 9.2 },
          ],
          recommendations: [
            'Continue renewable energy transition to reduce Scope 2',
            'Engage suppliers on decarbonization for Scope 3',
            'Implement fleet electrification program',
            'Consider carbon offset for residual emissions',
          ],
        };
      },
    },
    {
      name: 'set_environmental_objectives',
      description: 'Set environmental objectives and targets',
      parameters: z.object({
        baselineYear: z.number().default(2024),
        targetYear: z.number().default(2025),
        focusAreas: z.array(z.string()).optional(),
      }),
      execute: async (params) => {
        const objectives = [
          {
            id: 'OBJ-001',
            title: 'Reduce energy consumption',
            focusArea: 'Energy',
            baseline: '2,100 MWh/year',
            current: '1,950 MWh/year',
            target: '1,850 MWh/year',
            reductionTarget: 12,
            progress: 38,
            deadline: '2025-12-31',
            status: 'on_track',
            owner: 'Facilities Manager',
            resources: ['Energy audit', 'LED retrofit', 'HVAC optimization'],
          },
          {
            id: 'OBJ-002',
            title: 'Reduce water consumption',
            focusArea: 'Water',
            baseline: '15,000 m³/year',
            current: '13,200 m³/year',
            target: '12,500 m³/year',
            reductionTarget: 17,
            progress: 48,
            deadline: '2025-12-31',
            status: 'on_track',
            owner: 'Operations Manager',
            resources: ['Water meters', 'Leak detection', 'Recycling system'],
          },
          {
            id: 'OBJ-003',
            title: 'Reduce waste to landfill',
            focusArea: 'Waste',
            baseline: '250 tonnes/year',
            current: '195 tonnes/year',
            target: '150 tonnes/year',
            reductionTarget: 40,
            progress: 55,
            deadline: '2025-12-31',
            status: 'on_track',
            owner: 'EHS Manager',
            resources: ['Recycling program', 'Composting', 'Waste audit'],
          },
          {
            id: 'OBJ-004',
            title: 'Reduce GHG emissions',
            focusArea: 'Emissions',
            baseline: '7,850 tCO2e/year',
            current: '7,130 tCO2e/year',
            target: '6,280 tCO2e/year',
            reductionTarget: 20,
            progress: 46,
            deadline: '2025-12-31',
            status: 'on_track',
            owner: 'Environmental Manager',
            resources: ['Renewable energy', 'Fleet electrification', 'Process optimization'],
          },
          {
            id: 'OBJ-005',
            title: 'Increase renewable energy',
            focusArea: 'Energy',
            baseline: '10%',
            current: '25%',
            target: '50%',
            increaseTarget: 40,
            progress: 37.5,
            deadline: '2025-12-31',
            status: 'on_track',
            owner: 'Facilities Manager',
            resources: ['Solar panels', 'Power purchase agreement', 'Green tariff'],
          },
        ];

        return {
          baselineYear: params.baselineYear,
          targetYear: params.targetYear,
          totalObjectives: objectives.length,
          onTrack: objectives.filter(o => o.status === 'on_track').length,
          atRisk: objectives.filter(o => o.status === 'at_risk').length,
          behind: objectives.filter(o => o.status === 'behind').length,
          objectives,
          summary: {
            energyReduction: { target: '12%', progress: '38%' },
            waterReduction: { target: '17%', progress: '48%' },
            wasteReduction: { target: '40%', progress: '55%' },
            emissionReduction: { target: '20%', progress: '46%' },
            renewableEnergy: { target: '50%', progress: '37.5%' },
          },
          recommendations: [
            'All objectives are on track - continue current efforts',
            'Consider accelerating renewable energy transition',
            'Share best practices across departments',
            'Report progress in management review',
          ],
        };
      },
    },
  ],
};

