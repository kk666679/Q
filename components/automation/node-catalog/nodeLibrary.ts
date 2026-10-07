import type { LucideIcon } from 'lucide-react';

import { automationNodeTypes } from '@/components/automation/node/AutomationNodes';
import { customNodeTypes } from '@/components/automation/node/CustomNodes';
import {
  StartNode,
  EndNode,
  ActionNode,
  DecisionNode,
  ApprovalNode,
  WaitNode,
  NotificationNode,
  ParallelNode,
  ErrorNode,
} from '@/components/automation/node/WorkflowNodes';

import {
  MSComplianceCheckNode,
  MSAuditNode,
  MSCertificationNode,
  MSStandardsBrowserNode,
} from '@/components/my-standards/nodes';

import {
  HalalAuditNode,
  JAKIMCertificateNode,
  HalalRiskNode,
  HaramIngredientCheckNode,
} from '@/components/islamic-manufacturing-process/nodes';

import {
  GMPWorkflowNode,
  GMPDeviationNode,
  GMPCleanlinessNode,
} from './domain-nodes/gmp-nodes';

import {
  LSSWasteAnalyzerNode,
  LSSValueStreamNode,
  LSSControlChartNode,
} from './domain-nodes/lss-nodes';

import {
  HRApprovalNode,
  HRComplianceNode,
  HROnboardingNode,
} from './domain-nodes/hr-nodes';

import {
  DMAICPhaseNode,
  SixSigmaRiskNode,
  SixSigmaMeasurementNode,
} from './domain-nodes/six-sigma-nodes';

import {
  ISOAuditPlanNode,
  ISOCAPANode,
  ISOComplianceCheckNode,
} from './domain-nodes/iso-nodes';

import {
  QMSRiskAssessmentNode,
  QMSDocumentControlNode,
  QMSSPCChartNode,
} from './domain-nodes/qms-nodes';

import {
  SlackConnectorNode,
  TeamsConnectorNode,
  WebhookConnectorNode,
  EmailConnectorNode,
} from './domain-nodes/integration-connector-nodes';

import {
  Play,
  Square,
  Zap,
  GitBranch,
  CheckCircle2,
  Clock,
  Bell,
  SplitSquareHorizontal,
  AlertTriangle,
  ListTodo,
  HelpCircle,
  Rocket,
  Layers,
  Workflow,
  User,
  BarChart2,
  StickyNote,
  Award,
  Settings,
  Shield,
  FileText,
  XCircle,
  TrendingDown,
  Users,
  Gauge,
  MessageSquare,
  Mail,
  Webhook,
} from 'lucide-react';

const MS_ACCENT = '#0ea5e9';
const IM_ACCENT = '#10b981';
const GMP_ACCENT = '#dc2626';
const LSS_ACCENT = '#14b8a6';
const HR_ACCENT = '#8b5cf6';
const SS_ACCENT = '#ef4444';
const ISO_ACCENT = '#06b6d4';
const QMS_ACCENT = '#3b82f6';
const INT_ACCENT = '#6b7280';


import type { DomainConfig } from '@/components/domain-fullset/types';
import { makeDomainConfig } from '@/components/domain-fullset/mock-data';

export type CatalogCategory =
  | 'core-workflow'
  | 'my-standards'
  | 'islamic-manufacturing'
  | 'gmp'
  | 'lean-six-sigma'
  | 'human-resources'
  | 'six-sigma'
  | 'iso'
  | 'qms'
  | 'integrations';

export interface NodeDefinition {
  /** Unique catalog identifier — e.g. "wf-start" */
  id: string;

  /** XYFlow node type key; must exist in nodeTypeRegistry */
  type: string;

  /** Human-readable display name shown in the catalog panel */
  label: string;

  /** Category bucket for tab grouping */
  category: CatalogCategory;

  /** One-sentence description rendered in the node tile */
  description: string;

  /** Lucide icon component rendered as the tile's leading icon */
  icon: LucideIcon;

  /** CSS colour string for the colour swatch */
  color: string;

  /** Initial node data object placed on the canvas when dragged */
  defaultData: Record<string, unknown>;

  /** Domain key (only for domain nodes) */
  domain?: string;
}

type NodeTypeMap = Record<string, React.ComponentType<any>>;

const MS_DOMAIN_KEY = 'my_standards' as const;
const IM_DOMAIN_KEY = 'islamic_manufacturing_process' as const;

export type DomainConfigWithAccent = DomainConfig;

export const myStandardsDomainConfig: DomainConfigWithAccent = makeDomainConfig(
  MS_DOMAIN_KEY,
  'My Standards',
  MS_ACCENT
);

export const islamicManufacturingDomainConfig: DomainConfigWithAccent = makeDomainConfig(
  IM_DOMAIN_KEY,
  'Islamic Manufacturing',
  IM_ACCENT
);

export const workflowNodeTypes: NodeTypeMap = {
  start: StartNode,
  end: EndNode,
  action: ActionNode,
  decision: DecisionNode,
  approval: ApprovalNode,
  wait: WaitNode,
  notification: NotificationNode,
  parallel: ParallelNode,
  error: ErrorNode,
};

export const myStandardsNodeTypes: NodeTypeMap = {
  'ms-compliance-check': MSComplianceCheckNode,
  'ms-audit': MSAuditNode,
  'ms-certification': MSCertificationNode,
  'ms-standards-browser': MSStandardsBrowserNode,
};

export const islamicManufacturingNodeTypes: NodeTypeMap = {
  'halal-audit': HalalAuditNode,
  'jakim-certificate': JAKIMCertificateNode,
  'halal-risk': HalalRiskNode,
  'haram-ingredient-check': HaramIngredientCheckNode,
};

export const gmpNodeTypes: NodeTypeMap = {
  'gmp-workflow': GMPWorkflowNode,
  'gmp-deviation': GMPDeviationNode,
  'gmp-cleanliness': GMPCleanlinessNode,
};

export const lssNodeTypes: NodeTypeMap = {
  'lss-waste-analyzer': LSSWasteAnalyzerNode,
  'lss-value-stream': LSSValueStreamNode,
  'lss-control-chart': LSSControlChartNode,
};

export const hrNodeTypes: NodeTypeMap = {
  'hr-approval': HRApprovalNode,
  'hr-compliance': HRComplianceNode,
  'hr-onboarding': HROnboardingNode,
};

export const sixSigmaNodeTypes: NodeTypeMap = {
  'dmaic-phase': DMAICPhaseNode,
  'six-sigma-risk': SixSigmaRiskNode,
  'six-sigma-measurement': SixSigmaMeasurementNode,
};

export const isoNodeTypes: NodeTypeMap = {
  'iso-audit-plan': ISOAuditPlanNode,
  'iso-capa': ISOCAPANode,
  'iso-compliance-check': ISOComplianceCheckNode,
};

export const qmsNodeTypes: NodeTypeMap = {
  'qms-risk-assessment': QMSRiskAssessmentNode,
  'qms-document-control': QMSDocumentControlNode,
  'qms-spc-chart': QMSSPCChartNode,
};

export const integrationConnectorNodeTypes: NodeTypeMap = {
  'slack-connector': SlackConnectorNode,
  'teams-connector': TeamsConnectorNode,
  'webhook-connector': WebhookConnectorNode,
  'email-connector': EmailConnectorNode,
};

export const nodeTypeRegistry: NodeTypeMap = {
  ...workflowNodeTypes,
  ...automationNodeTypes,
  ...customNodeTypes,
  ...myStandardsNodeTypes,
  ...islamicManufacturingNodeTypes,
  ...gmpNodeTypes,
  ...lssNodeTypes,
  ...hrNodeTypes,
  ...sixSigmaNodeTypes,
  ...isoNodeTypes,
  ...qmsNodeTypes,
  ...integrationConnectorNodeTypes,
};



export const nodeCatalog: NodeDefinition[] = [

  // ─── Core Workflow (9) ────────────────────────────────────────────────
  {
    id: 'wf-start',
    type: 'start',
    label: 'Start',
    category: 'core-workflow',
    description: 'Entry point for your workflow.',
    icon: Play,
    color: '#10b981',
    defaultData: { label: 'Start' },
  },
  {
    id: 'wf-end',
    type: 'end',
    label: 'End',
    category: 'core-workflow',
    description: 'Workflow completion.',
    icon: Square,
    color: '#ef4444',
    defaultData: { label: 'End', type: 'success' },
  },
  {
    id: 'wf-action',
    type: 'action',
    label: 'Action',
    category: 'core-workflow',
    description: 'Perform an automated action step.',
    icon: Zap,
    color: '#3b82f6',
    defaultData: { label: 'Action', actionType: 'default' },
  },
  {
    id: 'wf-decision',
    type: 'decision',
    label: 'Decision',
    category: 'core-workflow',
    description: 'Route flow based on a decision.',
    icon: GitBranch,
    color: '#f59e0b',
    defaultData: { label: 'Decision' },
  },
  {
    id: 'wf-approval',
    type: 'approval',
    label: 'Approval',
    category: 'core-workflow',
    description: 'Require approval before proceeding.',
    icon: CheckCircle2,
    color: '#8b5cf6',
    defaultData: { label: 'Approval' },
  },
  {
    id: 'wf-wait',
    type: 'wait',
    label: 'Wait',
    category: 'core-workflow',
    description: 'Delay execution for a period.',
    icon: Clock,
    color: '#6b7280',
    defaultData: { duration: 1, unit: 'hours', label: 'Wait' },
  },
  {
    id: 'wf-notification',
    type: 'notification',
    label: 'Notification',
    category: 'core-workflow',
    description: 'Send a notification to stakeholders.',
    icon: Bell,
    color: '#6366f1',
    defaultData: { label: 'Notification' },
  },
  {
    id: 'wf-parallel',
    type: 'parallel',
    label: 'Parallel Gateway',
    category: 'core-workflow',
    description: 'Branch into multiple paths in parallel.',
    icon: SplitSquareHorizontal,
    color: '#14b8a6',
    defaultData: { label: 'Parallel' },
  },
  {
    id: 'wf-error',
    type: 'error',
    label: 'Error Handler',
    category: 'core-workflow',
    description: 'Handle unexpected errors safely.',
    icon: AlertTriangle,
    color: '#ef4444',
    defaultData: { label: 'Error' },
  },

  // ─── Automation Nodes (8) ─────────────────────────────────────────────
  {
    id: 'auto-task',
    type: 'task',
    label: 'Task',
    category: 'core-workflow',
    description: 'A unit of work with status and metadata.',
    icon: ListTodo,
    color: '#3b82f6',
    defaultData: { title: 'Task', status: 'pending', priority: 'medium', duration: 0 } as any,
  },
  {
    id: 'auto-condition',
    type: 'condition',
    label: 'Condition',
    category: 'core-workflow',
    description: 'Branch based on a condition.',
    icon: HelpCircle,
    color: '#f59e0b',
    defaultData: { condition: 'Condition', trueLabel: 'True', falseLabel: 'False' } as any,
  },
  {
    id: 'auto-action',
    type: 'action',
    label: 'Automation Action',
    category: 'core-workflow',
    description: 'Automated action with provider/result metadata.',
    icon: Zap,
    color: '#3b82f6',
    defaultData: { action: 'Action', provider: 'default', status: 'idle' } as any,
  },
  {
    id: 'auto-trigger',
    type: 'trigger',
    label: 'Trigger',
    category: 'core-workflow',
    description: 'Start automation based on an event.',
    icon: Rocket,
    color: '#ec4899',
    defaultData: { event: 'On Event', source: 'default' } as any,
  },
  {
    id: 'auto-end',
    type: 'end',
    label: 'Automation End',
    category: 'core-workflow',
    description: 'End node for automation flows.',
    icon: Square,
    color: '#ef4444',
    defaultData: { result: 'Done', summary: 'Automation complete' } as any,
  },
  {
    id: 'auto-group',
    type: 'group',
    label: 'Group',
    category: 'core-workflow',
    description: 'Container for multiple steps.',
    icon: Layers,
    color: '#a855f7',
    defaultData: { title: 'Group', description: 'Group container', color: '#a855f7' } as any,
  },
  {
    id: 'auto-wait',
    type: 'wait',
    label: 'Automation Wait',
    category: 'core-workflow',
    description: 'Wait node with duration/unit.',
    icon: Clock,
    color: '#6b7280',
    defaultData: { duration: 5, unit: 'minutes' } as any,
  },
  {
    id: 'auto-subworkflow',
    type: 'subWorkflow',
    label: 'Sub-Workflow',
    category: 'core-workflow',
    description: 'Invoke a nested workflow.',
    icon: Workflow,
    color: '#7c3aed',
    defaultData: { name: 'Sub workflow', description: 'Nested flow', inputCount: 1, outputCount: 1 } as any,
  },

  // ─── Custom nodes (for now, keep in core-workflow category) ────────
  {
    id: 'custom-employee',
    type: 'enhancedEmployee',
    label: 'Employee',
    category: 'core-workflow',
    description: 'Enhanced employee node.',
    icon: User,
    color: '#ec4899',
    defaultData: { name: 'Employee', position: 'Manager', department: 'HR' } as any,
  },
  {
    id: 'custom-metric',
    type: 'metricCard',
    label: 'Metric Card',
    category: 'core-workflow',
    description: 'A KPI card representation.',
    icon: BarChart2,
    color: '#3b82f6',
    defaultData: { label: 'KPI', value: '42', trend: 'neutral', change: '+0' } as any,
  },
  {
    id: 'custom-annotation',
    type: 'annotation',
    label: 'Annotation',
    category: 'core-workflow',
    description: 'A sticky note style annotation.',
    icon: StickyNote,
    color: '#eab308',
    defaultData: { content: 'Notes', author: 'System' } as any,
  },

  // ─── MS Domain Nodes (4) ─────────────────────────────────────────────
  {
    id: 'ms-compliance-check',
    type: 'ms-compliance-check',
    label: 'MS Compliance Check',
    category: 'my-standards',
    description: 'Check compliance against MS standards.',
    icon: CheckCircle2,
    color: myStandardsDomainConfig.accent,
    domain: MS_DOMAIN_KEY,
    defaultData: { label: 'MS Compliance', status: 'pending' },
  },
  {
    id: 'ms-audit',
    type: 'ms-audit',
    label: 'MS Audit',
    category: 'my-standards',
    description: 'Perform an MS audit step.',
    icon: FileText,
    color: myStandardsDomainConfig.accent,
    domain: MS_DOMAIN_KEY,
    defaultData: { label: 'MS Audit', auditType: 'Internal Audit' },
  },
  {
    id: 'ms-certification',
    type: 'ms-certification',
    label: 'MS Certification',
    category: 'my-standards',
    description: 'Certification lifecycle management.',
    icon: Award,
    color: myStandardsDomainConfig.accent,
    domain: MS_DOMAIN_KEY,
    defaultData: { label: 'Certification', certificateNumber: 'MS-0001' },
  },
  {
    id: 'ms-standards-browser',
    type: 'ms-standards-browser',
    label: 'MS Standards Browser',
    category: 'my-standards',
    description: 'Browse MS standards and scopes.',
    icon: Settings,
    color: myStandardsDomainConfig.accent,
    domain: MS_DOMAIN_KEY,
    defaultData: { label: 'Standards Browser', standardCode: 'MS-001' },
  },

  // ─── IM Domain Nodes (4) ─────────────────────────────────────────────
  {
    id: 'im-halal-audit',
    type: 'halal-audit',
    label: 'Halal Audit',
    category: 'islamic-manufacturing',
    description: 'Audit halal compliance.',
    icon: Shield,
    color: islamicManufacturingDomainConfig.accent,
    domain: IM_DOMAIN_KEY,
    defaultData: { label: 'Halal Audit', halalStatus: 'pending' },
  },
  {
    id: 'im-jakim-cert',
    type: 'jakim-certificate',
    label: 'JAKIM Certificate',
    category: 'islamic-manufacturing',
    description: 'Track JAKIM certificate validity.',
    icon: FileText,
    color: islamicManufacturingDomainConfig.accent,
    domain: IM_DOMAIN_KEY,
    defaultData: { label: 'JAKIM Certificate', certificateNumber: 'JAKIM-0001' },
  },
  {
    id: 'im-halal-risk',
    type: 'halal-risk',
    label: 'Halal Risk',
    category: 'islamic-manufacturing',
    description: 'Identify and mitigate halal risks.',
    icon: AlertTriangle,
    color: islamicManufacturingDomainConfig.accent,
    domain: IM_DOMAIN_KEY,
    defaultData: { label: 'Halal Risk', riskLevel: 'medium' },
  },
  {
    id: 'im-haram-check',
    type: 'haram-ingredient-check',
    label: 'Haram Ingredient Check',
    category: 'islamic-manufacturing',
    description: 'Check ingredients for haram risk.',
    icon: XCircle,
    color: islamicManufacturingDomainConfig.accent,
    domain: IM_DOMAIN_KEY,
    defaultData: { label: 'Haram Ingredient Check', result: 'pass' },
  },

  // ─── GMP Domain Nodes (3) ────────────────────────────────────────────
  {
    id: 'gmp-workflow',
    type: 'gmp-workflow',
    label: 'GMP Workflow',
    category: 'gmp',
    description: 'Manage GMP compliance workflow step.',
    icon: CheckCircle2,
    color: GMP_ACCENT,
    domain: 'gmp',
    defaultData: { label: 'GMP Workflow', complianceStatus: 'pending' },
  },
  {
    id: 'gmp-deviation',
    type: 'gmp-deviation',
    label: 'GMP Deviation',
    category: 'gmp',
    description: 'Track and manage GMP deviations.',
    icon: AlertTriangle,
    color: GMP_ACCENT,
    domain: 'gmp',
    defaultData: { label: 'GMP Deviation', deviationType: 'major' },
  },
  {
    id: 'gmp-cleanliness',
    type: 'gmp-cleanliness',
    label: 'Cleanliness Check',
    category: 'gmp',
    description: 'Perform GMP cleanliness verification.',
    icon: Shield,
    color: GMP_ACCENT,
    domain: 'gmp',
    defaultData: { label: 'Cleanliness Check', zoneStatus: 'clean' },
  },

  // ─── LSS Domain Nodes (3) ────────────────────────────────────────────
  {
    id: 'lss-waste-analyzer',
    type: 'lss-waste-analyzer',
    label: 'Waste Analyzer',
    category: 'lean-six-sigma',
    description: 'Analyze waste using DOWNTIME framework.',
    icon: TrendingDown,
    color: LSS_ACCENT,
    domain: 'lean_six_sigma',
    defaultData: { label: 'Waste Analyzer', wasteSeverity: 'medium' },
  },
  {
    id: 'lss-value-stream',
    type: 'lss-value-stream',
    label: 'Value Stream Map',
    category: 'lean-six-sigma',
    description: 'Create value stream mapping.',
    icon: Layers,
    color: LSS_ACCENT,
    domain: 'lean_six_sigma',
    defaultData: { label: 'Value Stream', leadTime: '0', cycleTime: '0' },
  },
  {
    id: 'lss-control-chart',
    type: 'lss-control-chart',
    label: 'Control Chart',
    category: 'lean-six-sigma',
    description: 'Track SPC control limits.',
    icon: BarChart2,
    color: LSS_ACCENT,
    domain: 'lean_six_sigma',
    defaultData: { label: 'Control Chart', controlLimitStatus: 'in-control' },
  },

  // ─── HR Domain Nodes (3) ──────────────────────────────────────────────
  {
    id: 'hr-approval',
    type: 'hr-approval',
    label: 'HR Approval',
    category: 'human-resources',
    description: 'Request HR approval.',
    icon: CheckCircle2,
    color: HR_ACCENT,
    domain: 'human_resources',
    defaultData: { label: 'HR Approval', approvalType: 'leave' },
  },
  {
    id: 'hr-compliance',
    type: 'hr-compliance',
    label: 'Statutory Compliance',
    category: 'human-resources',
    description: 'Check statutory body compliance.',
    icon: Shield,
    color: HR_ACCENT,
    domain: 'human_resources',
    defaultData: { label: 'Compliance', statutoryBody: 'SOCSO' },
  },
  {
    id: 'hr-onboarding',
    type: 'hr-onboarding',
    label: 'Onboarding',
    category: 'human-resources',
    description: 'Track employee onboarding progress.',
    icon: Users,
    color: HR_ACCENT,
    domain: 'human_resources',
    defaultData: { label: 'Onboarding', onboardingStage: 'documentation' },
  },

  // ─── Six Sigma Domain Nodes (3) ───────────────────────────────────────
  {
    id: 'dmaic-phase',
    type: 'dmaic-phase',
    label: 'DMAIC Phase',
    category: 'six-sigma',
    description: 'Track DMAIC project phases.',
    icon: Gauge,
    color: SS_ACCENT,
    domain: 'six_sigma',
    defaultData: { label: 'DMAIC Phase', dmaikPhase: 'Define' },
  },
  {
    id: 'six-sigma-risk',
    type: 'six-sigma-risk',
    label: 'Risk & Defect',
    category: 'six-sigma',
    description: 'Track defect and risk metrics.',
    icon: AlertTriangle,
    color: SS_ACCENT,
    domain: 'six_sigma',
    defaultData: { label: 'Risk Tracking', defectType: 'Process' },
  },
  {
    id: 'six-sigma-measurement',
    type: 'six-sigma-measurement',
    label: 'Measurement System',
    category: 'six-sigma',
    description: 'Validate measurement system.',
    icon: BarChart2,
    color: SS_ACCENT,
    domain: 'six_sigma',
    defaultData: { label: 'Measurement', acceptability: 'acceptable' },
  },

  // ─── ISO Domain Nodes (3) ─────────────────────────────────────────────
  {
    id: 'iso-audit-plan',
    type: 'iso-audit-plan',
    label: 'ISO Audit Plan',
    category: 'iso',
    description: 'Plan and schedule ISO audits.',
    icon: FileText,
    color: ISO_ACCENT,
    domain: 'iso',
    defaultData: { label: 'Audit Plan', auditDate: '2024-01-01' },
  },
  {
    id: 'iso-capa',
    type: 'iso-capa',
    label: 'ISO CAPA',
    category: 'iso',
    description: 'Manage corrective/preventive actions.',
    icon: CheckCircle2,
    color: ISO_ACCENT,
    domain: 'iso',
    defaultData: { label: 'CAPA', status: 'open' },
  },
  {
    id: 'iso-compliance-check',
    type: 'iso-compliance-check',
    label: 'ISO Compliance Check',
    category: 'iso',
    description: 'Verify ISO framework compliance.',
    icon: Shield,
    color: ISO_ACCENT,
    domain: 'iso',
    defaultData: { label: 'Compliance', frameworkVersion: 'ISO 9001:2015' },
  },

  // ─── QMS Domain Nodes (3) ─────────────────────────────────────────────
  {
    id: 'qms-risk-assessment',
    type: 'qms-risk-assessment',
    label: 'Risk Assessment',
    category: 'qms',
    description: 'Assess QMS-related risks.',
    icon: AlertTriangle,
    color: QMS_ACCENT,
    domain: 'qms',
    defaultData: { label: 'Risk Assessment', riskLevel: 'medium' },
  },
  {
    id: 'qms-document-control',
    type: 'qms-document-control',
    label: 'Document Control',
    category: 'qms',
    description: 'Manage QMS document control.',
    icon: FileText,
    color: QMS_ACCENT,
    domain: 'qms',
    defaultData: { label: 'Document', documentStatus: 'approved' },
  },
  {
    id: 'qms-spc-chart',
    type: 'qms-spc-chart',
    label: 'SPC Chart',
    category: 'qms',
    description: 'Track statistical process control.',
    icon: BarChart2,
    color: QMS_ACCENT,
    domain: 'qms',
    defaultData: { label: 'SPC Chart', controlLimitStatus: 'in-control' },
  },

  // ─── Integration Nodes (4) ────────────────────────────────────────────
  {
    id: 'slack-connector',
    type: 'slack-connector',
    label: 'Slack Connector',
    category: 'integrations',
    description: 'Send messages to Slack channels.',
    icon: MessageSquare,
    color: INT_ACCENT,
    defaultData: { label: 'Slack', connectionStatus: 'disconnected' },
  },
  {
    id: 'teams-connector',
    type: 'teams-connector',
    label: 'Teams Connector',
    category: 'integrations',
    description: 'Integrate with Microsoft Teams.',
    icon: Users,
    color: INT_ACCENT,
    defaultData: { label: 'Teams', connectionStatus: 'disconnected' },
  },
  {
    id: 'webhook-connector',
    type: 'webhook-connector',
    label: 'Webhook Connector',
    category: 'integrations',
    description: 'Send data via webhook.',
    icon: Webhook,
    color: INT_ACCENT,
    defaultData: { label: 'Webhook', connectionStatus: 'disconnected' },
  },
  {
    id: 'email-connector',
    type: 'email-connector',
    label: 'Email Connector',
    category: 'integrations',
    description: 'Send email notifications.',
    icon: Mail,
    color: INT_ACCENT,
    defaultData: { label: 'Email', connectionStatus: 'disconnected' },
  },
];

