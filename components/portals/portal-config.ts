export type IndustryKey = 'electronics' | 'medical' | 'halal' | 'financial';

export interface PortalGrantInfo {
  name: string;
  url: string;
}

export interface PortalConfig {
  industry: IndustryKey;
  label: string;
  description: string;
  accent: string;
  standards: string[];
  primaryAgent: string;
  complianceStandard: 'ISO9001' | 'ISO14001' | 'ISO45001' | 'ISO17025' | 'ISO27001';
  documentCategories: string[];
  riskCategories: string[];
  climateHazards: string[];
  kpiLabels: { quality: string; performance: string; availability: string };
  grantInfo: PortalGrantInfo[];
  regulatoryBodies: string[];
}

export const PORTAL_CONFIGS: Record<IndustryKey, PortalConfig> = {
  electronics: {
    industry: 'electronics',
    label: 'Electronics & Semiconductor',
    description: 'IATF 16949 · SPC · OEE · PFMEA · Supplier PPAP — Penang/Selangor E&E',
    accent: 'from-blue-500/80 to-cyan-500/80',
    standards: ['ISO9001', 'ISO14001', 'ISO45001'],
    primaryAgent: 'manufacturing-expert',
    complianceStandard: 'ISO9001',
    documentCategories: ['PPAP', 'Control Plan', 'PFMEA', 'MSA', 'Process Flow', 'FMEA'],
    riskCategories: ['quality', 'environmental', 'operational'],
    climateHazards: ['extreme-heat', 'water-scarcity', 'flooding'],
    kpiLabels: { quality: 'First Pass Yield', performance: 'Cpk Index', availability: 'Equipment Uptime' },
    grantInfo: [
      { name: 'MIDA Pioneer Status / ITA', url: 'https://www.mida.gov.my' },
      { name: 'MDEC Smart Automation Grant', url: 'https://mdec.my' },
    ],
    regulatoryBodies: ['MIDA', 'MDEC', 'DOSH', 'DOE'],
  },
  medical: {
    industry: 'medical',
    label: 'Medical Devices & Healthcare',
    description: 'ISO 13485 · MDA · DHF/DMR · CAPA · ISO 14971 Risk — MDA-licensed manufacturers',
    accent: 'from-emerald-500/80 to-teal-500/80',
    standards: ['ISO9001', 'ISO27001', 'ISO45001'],
    primaryAgent: 'qa-expert',
    complianceStandard: 'ISO9001',
    documentCategories: ['DHF', 'DMR', 'Risk File', 'Clinical Evaluation', 'Post-Market Surveillance', 'SOP'],
    riskCategories: ['quality', 'safety', 'compliance'],
    climateHazards: ['extreme-heat', 'flooding', 'storms'],
    kpiLabels: { quality: 'Device Defect Rate', performance: 'Complaint Resolution Time', availability: 'Audit Readiness Score' },
    grantInfo: [
      { name: 'MDA Device Registration', url: 'https://www.mda.gov.my' },
      { name: 'MITI Medical Device Fund', url: 'https://www.miti.gov.my' },
    ],
    regulatoryBodies: ['MDA', 'MOH', 'NPRA', 'DOSH'],
  },
  halal: {
    industry: 'halal',
    label: 'Agro-processing & Halal',
    description: 'MS 1500:2019 · JAKIM · HACCP · GMP · ISO 22000 — Halal food & agro exporters',
    accent: 'from-green-500/80 to-lime-500/80',
    standards: ['ISO9001', 'ISO14001', 'ISO45001'],
    primaryAgent: 'iso14001-agent',
    complianceStandard: 'ISO14001',
    documentCategories: ['Halal SOP', 'HACCP Plan', 'GMP Record', 'Supplier Halal Cert', 'Environmental Aspect Register'],
    riskCategories: ['quality', 'environmental', 'safety'],
    climateHazards: ['flooding', 'drought', 'precipitation-changes', 'extreme-heat'],
    kpiLabels: { quality: 'Halal Compliance Score', performance: 'HACCP CCP Pass Rate', availability: 'Supplier Halal Validity' },
    grantInfo: [
      { name: 'HRD Corp Halal Training Grant', url: 'https://www.hrdcorp.gov.my' },
      { name: 'FAMA Agro Digitalisation Grant', url: 'https://www.fama.gov.my' },
      { name: 'JAKIM Halal Certification', url: 'https://www.jakim.gov.my' },
    ],
    regulatoryBodies: ['JAKIM', 'FAMA', 'DOA', 'DOE', 'DOSH'],
  },
  financial: {
    industry: 'financial',
    label: 'Financial & Professional Services',
    description: 'ISO 27001 · BNM RMiT · PDPA · ISMS · Operational Risk — BNM/SC-regulated entities',
    accent: 'from-violet-500/80 to-purple-500/80',
    standards: ['ISO9001', 'ISO27001', 'ISO45001'],
    primaryAgent: 'ims-integrator-agent',
    complianceStandard: 'ISO27001',
    documentCategories: ['ISMS Policy', 'BIA', 'Risk Register', 'BCP', 'Incident Report', 'RMiT Evidence'],
    riskCategories: ['security', 'compliance', 'operational', 'strategic'],
    climateHazards: ['flooding', 'extreme-heat', 'storms'],
    kpiLabels: { quality: 'ISMS Compliance Score', performance: 'Incident Response Time', availability: 'Control Effectiveness' },
    grantInfo: [
      { name: 'MDEC SME Digitalisation Grant', url: 'https://mdec.my' },
      { name: 'BNM URUS Programme', url: 'https://www.bnm.gov.my' },
    ],
    regulatoryBodies: ['BNM', 'SC', 'SSM', 'LHDN', 'PDPA'],
  },
};
