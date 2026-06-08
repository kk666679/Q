import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

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
} from 'lucide-react';

import type { NodeProps } from '@xyflow/react';

const MS_ACCENT = '#0ea5e9';
const IM_ACCENT = '#10b981';


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
  'ms-compliance-check': require('@/components/my-standards').MSComplianceCheckNode,
  'ms-audit': require('@/components/my-standards').MSAuditNode,
  'ms-certification': require('@/components/my-standards').MSCertificationNode,
  'ms-standards-browser': require('@/components/my-standards').MSStandardsBrowserNode,
};

export const islamicManufacturingNodeTypes: NodeTypeMap = {
  'halal-audit': require('@/components/islamic-manufacturing-process').HalalAuditNode,
  'jakim-certificate': require('@/components/islamic-manufacturing-process').JAKIMCertificateNode,
  'halal-risk': require('@/components/islamic-manufacturing-process').HalalRiskNode,
  'haram-ingredient-check': require('@/components/islamic-manufacturing-process').HaramIngredientCheckNode,
};

export const nodeTypeRegistry: NodeTypeMap = {
  ...workflowNodeTypes,
  ...automationNodeTypes,
  ...customNodeTypes,
  ...myStandardsNodeTypes,
  ...islamicManufacturingNodeTypes,
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
];

