/**
 * Enterprise agent definitions — all 14 IMS/QMS agents.
 * Call registerAllAgents() once at app bootstrap (tRPC handler init).
 */
import { agentRegistry } from '../core/registry';
import type { Agent } from '../types/index';

const AGENTS: Agent[] = [
  {
    id: 'iso9001-agent',
    name: 'ISO 9001 Quality Manager',
    type: 'quality-manager',
    description: 'ISO 9001:2015 QMS implementation, risk-based thinking, internal audit facilitation.',
    capabilities: ['qms-implementation', 'internal-audit', 'risk-based-thinking', 'gap-analysis', 'process-mapping'],
    tools: ['assess_qms_compliance', 'generate_audit_checklist', 'conduct_risk_assessment', 'gap_analysis'],
    status: 'active',
    metadata: { standard: 'ISO9001', version: '2015', domain: 'quality' },
  },
  {
    id: 'iso14001-agent',
    name: 'ISO 14001 Environmental Manager',
    type: 'quality-manager',
    description: 'ISO 14001:2015 + AMD.1:2024 EMS, climate change adaptation, environmental aspects.',
    capabilities: ['ems-implementation', 'climate-risk', 'environmental-aspects', 'legal-compliance'],
    tools: ['climate_risk_assessment', 'environmental_aspect_register', 'legal_compliance_check'],
    status: 'active',
    metadata: { standard: 'ISO14001', version: '2015+AMD1', domain: 'environmental' },
  },
  {
    id: 'iso45001-agent',
    name: 'ISO 45001 OH&S Manager',
    type: 'quality-manager',
    description: 'ISO 45001:2018 OH&S management, hazard identification, incident investigation.',
    capabilities: ['ohs-management', 'hazard-identification', 'incident-investigation', 'worker-participation'],
    tools: ['hazard_identification', 'risk_assessment_ohs', 'incident_investigation'],
    status: 'active',
    metadata: { standard: 'ISO45001', version: '2018', domain: 'safety' },
  },
  {
    id: 'iso17025-agent',
    name: 'ISO 17025 Laboratory Manager',
    type: 'qa-expert',
    description: 'ISO 17025:2017 testing/calibration lab management, measurement uncertainty.',
    capabilities: ['lab-management', 'calibration', 'measurement-uncertainty', 'method-validation'],
    tools: ['calibration_record', 'measurement_uncertainty_calc', 'method_validation'],
    status: 'active',
    metadata: { standard: 'ISO17025', version: '2017', domain: 'laboratory' },
  },
  {
    id: 'iso17020-agent',
    name: 'ISO 17020 Inspection Body Manager',
    type: 'qa-expert',
    description: 'ISO 17020:2012 inspection body requirements, impartiality, competence.',
    capabilities: ['inspection-management', 'impartiality-assessment', 'competence-evaluation'],
    tools: ['inspection_checklist', 'impartiality_review', 'competence_assessment'],
    status: 'active',
    metadata: { standard: 'ISO17020', version: '2012', domain: 'inspection' },
  },
  {
    id: 'iso27001-agent',
    name: 'ISO 27001 Information Security Manager',
    type: 'quality-manager',
    description: 'ISO 27001:2022 ISMS, security risk assessment, Annex A controls, SOA management.',
    capabilities: ['isms-implementation', 'security-risk-assessment', 'annex-a-controls', 'soa-management'],
    tools: ['security_risk_assessment', 'soa_generation', 'control_assessment'],
    status: 'active',
    metadata: { standard: 'ISO27001', version: '2022', domain: 'information-security' },
  },
  {
    id: 'ims-integrator',
    name: 'IMS Integrator & Orchestrator',
    type: 'quality-manager',
    description: 'Integrated Management System coordinator — routes to specialist agents and synthesises cross-standard recommendations.',
    capabilities: ['agent-routing', 'cross-standard-integration', 'ims-gap-analysis', 'consensus-building'],
    tools: ['route_to_agent', 'synthesise_recommendations', 'cross_standard_gap_analysis'],
    status: 'active',
    metadata: { role: 'orchestrator', standards: ['ISO9001', 'ISO14001', 'ISO45001', 'ISO27001'] },
  },
  {
    id: 'quality-manager',
    name: 'Quality Manager',
    type: 'quality-manager',
    description: 'General QMS quality policy, objectives, management review, customer satisfaction.',
    capabilities: ['quality-policy', 'quality-objectives', 'management-review', 'customer-satisfaction'],
    tools: ['quality_policy_review', 'objectives_tracking', 'management_review_agenda'],
    status: 'active',
    metadata: { domain: 'quality-management' },
  },
  {
    id: 'qa-expert',
    name: 'QA Expert',
    type: 'qa-expert',
    description: 'Test strategy, defect prevention, SPC, measurement system analysis, quality gates.',
    capabilities: ['test-strategy', 'defect-prevention', 'spc', 'msa', 'quality-gates'],
    tools: ['test_strategy_generate', 'spc_analysis', 'defect_pareto', 'msa_study'],
    status: 'active',
    metadata: { domain: 'quality-assurance' },
  },
  {
    id: 'manufacturing-expert',
    name: 'Manufacturing Expert',
    type: 'manufacturing-expert',
    description: 'Industry 4.0, OEE, lean manufacturing, predictive maintenance, digital twin.',
    capabilities: ['oee-analysis', 'lean-manufacturing', 'predictive-maintenance', 'production-scheduling'],
    tools: ['calculate_oee', 'predictive_maintenance', 'production_schedule', 'digital_twin_simulation'],
    status: 'active',
    metadata: { domain: 'manufacturing' },
  },
  {
    id: 'construction-expert',
    name: 'Construction Expert',
    type: 'construction-expert',
    description: 'Construction project management, site safety, inspection records, contractor evaluation.',
    capabilities: ['project-management', 'site-safety', 'inspection-management', 'contractor-evaluation'],
    tools: ['site_audit', 'safety_inspection', 'contractor_evaluation', 'project_risk_assessment'],
    status: 'active',
    metadata: { domain: 'construction' },
  },
  {
    id: 'insurance-expert',
    name: 'Insurance Expert',
    type: 'insurance-expert',
    description: 'Underwriting, claims management, actuarial risk reasoning, fraud indicators.',
    capabilities: ['underwriting', 'claims-management', 'risk-assessment', 'fraud-detection'],
    tools: ['generate_quote', 'claims_assessment', 'fraud_indicators', 'risk_scoring'],
    status: 'active',
    metadata: { domain: 'insurance' },
  },
  {
    id: 'documentation-manager',
    name: 'Documentation Manager',
    type: 'documentation-manager',
    description: 'ISO document control, version management, approval workflows, controlled templates.',
    capabilities: ['document-control', 'version-management', 'approval-workflow', 'template-generation'],
    tools: ['create_document', 'document_review', 'approve_document', 'generate_template'],
    status: 'active',
    metadata: { domain: 'document-control' },
  },
  {
    id: 'risk-manager',
    name: 'Risk Manager',
    type: 'quality-manager',
    description: 'Enterprise risk register, FMEA, risk treatment plans, residual risk monitoring.',
    capabilities: ['risk-identification', 'risk-assessment', 'fmea', 'risk-treatment', 'risk-reporting'],
    tools: ['risk_register', 'fmea_analysis', 'risk_treatment_plan', 'residual_risk_calc', 'risk_heat_map'],
    status: 'active',
    metadata: { domain: 'risk-management' },
  },
];

let _registered = false;

export function registerAllAgents(): void {
  if (_registered) return;
  AGENTS.forEach(a => agentRegistry.register(a));
  _registered = true;
}

export { AGENTS as agentDefinitions };
