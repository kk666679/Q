'use client';

/**
 * NodePropertiesPanel
 *
 * A right-side panel that shows editable properties for whatever node is
 * currently selected on the XYFlow canvas.  Each node type gets its own
 * dedicated form section so users can tweak data without touching the canvas
 * directly.
 *
 * Usage:
 *   <NodePropertiesPanel
 *     selectedNode={node}          // Node | null
 *     onUpdate={(id, data) => …}   // callback to push changes back to canvas
 *     onClose={() => …}            // optional close handler
 *   />
 */

import { useCallback } from 'react';
import type { Node } from '@xyflow/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  X,
  Settings2,
  Info,
  Layers,
  SlidersHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NodePropertiesPanelProps {
  selectedNode: Node | null;
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void;
  onClose?: () => void;
  className?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Accent colour per node category / type. */
const ACCENT_MAP: Record<string, string> = {
  // core workflow
  start: '#10b981',
  end: '#ef4444',
  action: '#3b82f6',
  decision: '#f59e0b',
  approval: '#8b5cf6',
  wait: '#6b7280',
  notification: '#6366f1',
  parallel: '#14b8a6',
  error: '#ef4444',
  // automation
  task: '#3b82f6',
  condition: '#f59e0b',
  trigger: '#ec4899',
  group: '#a855f7',
  subWorkflow: '#7c3aed',
  // custom
  enhancedEmployee: '#ec4899',
  metricCard: '#3b82f6',
  annotation: '#eab308',
  // my-standards
  'ms-compliance-check': '#0ea5e9',
  'ms-audit': '#0ea5e9',
  'ms-certification': '#0ea5e9',
  'ms-standards-browser': '#0ea5e9',
  // islamic-manufacturing
  'halal-audit': '#10b981',
  'jakim-certificate': '#10b981',
  'halal-risk': '#10b981',
  'haram-ingredient-check': '#10b981',
  // gmp
  'gmp-workflow': '#dc2626',
  'gmp-deviation': '#dc2626',
  'gmp-cleanliness': '#dc2626',
  // lss
  'lss-waste-analyzer': '#14b8a6',
  'lss-value-stream': '#14b8a6',
  'lss-control-chart': '#14b8a6',
  // hr
  'hr-approval': '#8b5cf6',
  'hr-compliance': '#8b5cf6',
  'hr-onboarding': '#8b5cf6',
  // six-sigma
  'dmaic-phase': '#ef4444',
  'six-sigma-risk': '#ef4444',
  'six-sigma-measurement': '#ef4444',
  // iso
  'iso-audit-plan': '#06b6d4',
  'iso-capa': '#06b6d4',
  'iso-compliance-check': '#06b6d4',
  // qms
  'qms-risk-assessment': '#3b82f6',
  'qms-document-control': '#3b82f6',
  'qms-spc-chart': '#3b82f6',
  // integrations
  'slack-connector': '#6b7280',
  'teams-connector': '#6b7280',
  'webhook-connector': '#6b7280',
  'email-connector': '#6b7280',
};

const accent = (type: string) => ACCENT_MAP[type] ?? '#6b7280';

// ─── Field primitives ─────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

function TextField({ label, value, onChange, placeholder, multiline }: FieldProps) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {multiline ? (
        <Textarea
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="text-sm resize-none h-20"
        />
      ) : (
        <Input
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="text-sm h-8"
        />
      )}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}

function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select value={value ?? ''} onValueChange={onChange}>
        <SelectTrigger className="h-8 text-sm">
          <SelectValue placeholder="Select…" />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value} className="text-sm">
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface NumberFieldProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
}

function NumberField({ label, value, min = 0, max = 100, onChange }: NumberFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <span className="text-xs font-medium tabular-nums">{value ?? 0}</span>
      </div>
      <Slider
        value={[value ?? 0]}
        min={min}
        max={max}
        step={1}
        onValueChange={([v]) => onChange(v)}
        className="h-4"
      />
    </div>
  );
}

interface SwitchFieldProps {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

function SwitchField({ label, value, onChange }: SwitchFieldProps) {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Switch checked={!!value} onCheckedChange={onChange} />
    </div>
  );
}

// ─── Node-type specific property forms ───────────────────────────────────────

/** Builds a patch object from a field change and forwards it to the parent. */
type Patcher = (field: string, value: unknown) => void;

// --- Core Workflow ---

function TaskProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Title" value={data.title} onChange={(v) => patch('title', v)} />
      <TextField label="Description" value={data.description} onChange={(v) => patch('description', v)} multiline />
      <TextField label="Assignee" value={data.assignee} onChange={(v) => patch('assignee', v)} placeholder="e.g. john@company.com" />
      <TextField label="Due Date" value={data.dueDate} onChange={(v) => patch('dueDate', v)} placeholder="YYYY-MM-DD" />
      <SelectField
        label="Priority"
        value={data.priority ?? 'medium'}
        onChange={(v) => patch('priority', v)}
        options={[
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' },
        ]}
      />
      <SelectField
        label="Status"
        value={data.status ?? 'pending'}
        onChange={(v) => patch('status', v)}
        options={[
          { value: 'pending', label: 'Pending' },
          { value: 'running', label: 'Running' },
          { value: 'completed', label: 'Completed' },
          { value: 'failed', label: 'Failed' },
        ]}
      />
    </>
  );
}

function ConditionProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Condition Expression" value={data.condition} onChange={(v) => patch('condition', v)} placeholder="e.g. status === 'approved'" multiline />
      <TextField label="True Branch Label" value={data.trueLabel} onChange={(v) => patch('trueLabel', v)} placeholder="Yes / True" />
      <TextField label="False Branch Label" value={data.falseLabel} onChange={(v) => patch('falseLabel', v)} placeholder="No / False" />
    </>
  );
}

function ActionProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <TextField label="Description" value={data.description} onChange={(v) => patch('description', v)} multiline />
      <TextField label="Provider" value={data.provider} onChange={(v) => patch('provider', v)} placeholder="e.g. SendGrid, AWS Lambda" />
      <TextField label="Duration" value={data.duration} onChange={(v) => patch('duration', v)} placeholder="e.g. 2 min" />
      <SelectField
        label="Action Type"
        value={data.actionType ?? 'default'}
        onChange={(v) => patch('actionType', v)}
        options={[
          { value: 'default', label: 'Generic' },
          { value: 'email', label: 'Email' },
          { value: 'notification', label: 'Notification' },
          { value: 'database', label: 'Database' },
          { value: 'api', label: 'API Call' },
          { value: 'document', label: 'Document' },
          { value: 'user', label: 'User Action' },
          { value: 'payment', label: 'Payment' },
        ]}
      />
    </>
  );
}

function ApprovalProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <TextField label="Approver" value={data.approver} onChange={(v) => patch('approver', v)} placeholder="Name or role" />
      <TextField label="SLA" value={data.sla} onChange={(v) => patch('sla', v)} placeholder="e.g. 48 hours" />
      <SelectField
        label="Priority"
        value={data.priority ?? 'medium'}
        onChange={(v) => patch('priority', v)}
        options={[
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' },
          { value: 'critical', label: 'Critical' },
        ]}
      />
    </>
  );
}

function WaitProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Duration" value={data.duration} onChange={(v) => patch('duration', v)} placeholder="e.g. 30" />
      <SelectField
        label="Unit"
        value={data.unit ?? 'minutes'}
        onChange={(v) => patch('unit', v)}
        options={[
          { value: 'seconds', label: 'Seconds' },
          { value: 'minutes', label: 'Minutes' },
          { value: 'hours', label: 'Hours' },
          { value: 'days', label: 'Days' },
        ]}
      />
      <TextField label="Description" value={data.description} onChange={(v) => patch('description', v)} multiline />
    </>
  );
}

function TriggerProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Event" value={data.event} onChange={(v) => patch('event', v)} placeholder="e.g. form.submitted" />
      <TextField label="Source" value={data.source} onChange={(v) => patch('source', v)} placeholder="e.g. Webhook, Schedule, Manual" />
    </>
  );
}

function NotificationProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <TextField label="Recipients" value={data.recipients} onChange={(v) => patch('recipients', v)} placeholder="emails or roles" />
      <SelectField
        label="Channel"
        value={data.channel ?? 'email'}
        onChange={(v) => patch('channel', v)}
        options={[
          { value: 'email', label: 'Email' },
          { value: 'notification', label: 'In-app Notification' },
          { value: 'sms', label: 'SMS' },
          { value: 'slack', label: 'Slack' },
          { value: 'teams', label: 'Teams' },
        ]}
      />
    </>
  );
}

function SubWorkflowProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Name" value={data.name} onChange={(v) => patch('name', v)} />
      <TextField label="Description" value={data.description} onChange={(v) => patch('description', v)} multiline />
      <NumberField label="Input Count" value={data.inputCount ?? 1} min={0} max={20} onChange={(v) => patch('inputCount', v)} />
      <NumberField label="Output Count" value={data.outputCount ?? 1} min={0} max={20} onChange={(v) => patch('outputCount', v)} />
    </>
  );
}

function LabelOnlyProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />;
}

// --- My Standards ---

function MSComplianceCheckProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <TextField label="Standard Code" value={data.standardCode} onChange={(v) => patch('standardCode', v)} placeholder="e.g. MS ISO 9001" />
      <SelectField
        label="Compliance Status"
        value={data.status ?? 'pending'}
        onChange={(v) => patch('status', v)}
        options={[
          { value: 'compliant', label: 'Compliant' },
          { value: 'non-compliant', label: 'Non-Compliant' },
          { value: 'pending', label: 'Pending' },
        ]}
      />
    </>
  );
}

function MSAuditProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <TextField label="Audit Type" value={data.auditType} onChange={(v) => patch('auditType', v)} placeholder="e.g. Internal, Surveillance" />
      <TextField label="Scheduled Date" value={data.scheduledDate} onChange={(v) => patch('scheduledDate', v)} placeholder="YYYY-MM-DD" />
    </>
  );
}

function MSCertificationProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <TextField label="Certificate Number" value={data.certificateNumber} onChange={(v) => patch('certificateNumber', v)} />
      <TextField label="Expiry Date" value={data.expiryDate} onChange={(v) => patch('expiryDate', v)} placeholder="YYYY-MM-DD" />
      <TextField label="Certification Body" value={data.certificationBody} onChange={(v) => patch('certificationBody', v)} placeholder="e.g. SIRIM QAS" />
    </>
  );
}

function MSStandardsBrowserProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <TextField label="Standard Code" value={data.standardCode} onChange={(v) => patch('standardCode', v)} placeholder="e.g. MS ISO 14001" />
      <TextField label="Scope Description" value={data.scopeDescription} onChange={(v) => patch('scopeDescription', v)} multiline />
    </>
  );
}

// --- Islamic Manufacturing ---

function HalalAuditProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <TextField label="Audit Scope" value={data.auditScope} onChange={(v) => patch('auditScope', v)} multiline />
      <TextField label="Auditor Name" value={data.auditorName} onChange={(v) => patch('auditorName', v)} />
      <SelectField
        label="Halal Status"
        value={data.halalStatus ?? 'pending'}
        onChange={(v) => patch('halalStatus', v)}
        options={[
          { value: 'certified', label: 'Certified' },
          { value: 'pending', label: 'Pending' },
          { value: 'rejected', label: 'Rejected' },
        ]}
      />
    </>
  );
}

function JAKIMCertificateProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <TextField label="Certificate Number" value={data.certificateNumber} onChange={(v) => patch('certificateNumber', v)} />
      <TextField label="Validity Period" value={data.validityPeriod} onChange={(v) => patch('validityPeriod', v)} placeholder="e.g. 2024-2026" />
      <TextField label="Product Category" value={data.productCategory} onChange={(v) => patch('productCategory', v)} />
    </>
  );
}

function HalalRiskProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <SelectField
        label="Risk Level"
        value={data.riskLevel ?? 'low'}
        onChange={(v) => patch('riskLevel', v)}
        options={[
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' },
          { value: 'critical', label: 'Critical' },
        ]}
      />
      <TextField label="Risk Description" value={data.riskDescription} onChange={(v) => patch('riskDescription', v)} multiline />
      <TextField label="Mitigation Action" value={data.mitigationAction} onChange={(v) => patch('mitigationAction', v)} multiline />
    </>
  );
}

function HaramIngredientCheckProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <TextField label="Ingredient Name" value={data.ingredientName} onChange={(v) => patch('ingredientName', v)} />
      <TextField label="Detection Method" value={data.detectionMethod} onChange={(v) => patch('detectionMethod', v)} placeholder="e.g. PCR, ELISA" />
      <SelectField
        label="Result"
        value={data.result ?? 'pass'}
        onChange={(v) => patch('result', v)}
        options={[
          { value: 'pass', label: 'Pass' },
          { value: 'fail', label: 'Fail' },
        ]}
      />
    </>
  );
}

// --- GMP ---

function GMPWorkflowProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <TextField label="KPI Summary" value={data.kpiSummary} onChange={(v) => patch('kpiSummary', v)} multiline />
      <SelectField
        label="Compliance Status"
        value={data.complianceStatus ?? 'pending'}
        onChange={(v) => patch('complianceStatus', v)}
        options={[
          { value: 'compliant', label: 'Compliant' },
          { value: 'non-compliant', label: 'Non-Compliant' },
          { value: 'pending', label: 'Pending' },
        ]}
      />
    </>
  );
}

function GMPDeviationProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <SelectField
        label="Deviation Type"
        value={data.deviationType ?? 'minor'}
        onChange={(v) => patch('deviationType', v)}
        options={[
          { value: 'critical', label: 'Critical' },
          { value: 'major', label: 'Major' },
          { value: 'minor', label: 'Minor' },
        ]}
      />
      <TextField label="Deviation Description" value={data.deviationDescription} onChange={(v) => patch('deviationDescription', v)} multiline />
      <TextField label="Corrective Action Status" value={data.correctiveActionStatus} onChange={(v) => patch('correctiveActionStatus', v)} />
    </>
  );
}

function GMPCleanlinessProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <TextField label="Cleanliness Zone" value={data.cleanlinessZone} onChange={(v) => patch('cleanlinessZone', v)} placeholder="e.g. Production, Packaging" />
      <SelectField
        label="Zone Status"
        value={data.zoneStatus ?? 'clean'}
        onChange={(v) => patch('zoneStatus', v)}
        options={[
          { value: 'clean', label: 'Clean' },
          { value: 'at-risk', label: 'At Risk' },
          { value: 'contaminated', label: 'Contaminated' },
        ]}
      />
      <TextField label="Last Inspection Date" value={data.lastInspectionDate} onChange={(v) => patch('lastInspectionDate', v)} placeholder="YYYY-MM-DD" />
    </>
  );
}

// --- Lean Six Sigma ---

function LSSWasteAnalyzerProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <SelectField
        label="Waste Category (DOWNTIME)"
        value={data.wasteCategory ?? 'Defects'}
        onChange={(v) => patch('wasteCategory', v)}
        options={[
          { value: 'Defects', label: 'Defects' },
          { value: 'Overproduction', label: 'Overproduction' },
          { value: 'Waiting', label: 'Waiting' },
          { value: 'Non-utilised talent', label: 'Non-utilised Talent' },
          { value: 'Transportation', label: 'Transportation' },
          { value: 'Inventory', label: 'Inventory' },
          { value: 'Motion', label: 'Motion' },
          { value: 'Extra-processing', label: 'Extra-processing' },
        ]}
      />
      <TextField label="Waste Severity" value={data.wasteSeverity} onChange={(v) => patch('wasteSeverity', v)} placeholder="e.g. High, 2.5%" />
    </>
  );
}

function LSSValueStreamProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <TextField label="Lead Time" value={data.leadTime} onChange={(v) => patch('leadTime', v)} placeholder="e.g. 5 days" />
      <TextField label="Cycle Time" value={data.cycleTime} onChange={(v) => patch('cycleTime', v)} placeholder="e.g. 45 min" />
      <TextField label="Takt Time" value={data.taktTime} onChange={(v) => patch('taktTime', v)} placeholder="e.g. 60 min" />
    </>
  );
}

function LSSControlChartProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <TextField label="Process Name" value={data.processName} onChange={(v) => patch('processName', v)} />
      <SelectField
        label="Control Limit Status"
        value={data.controlLimitStatus ?? 'in-control'}
        onChange={(v) => patch('controlLimitStatus', v)}
        options={[
          { value: 'in-control', label: 'In Control' },
          { value: 'out-of-control', label: 'Out of Control' },
          { value: 'warning', label: 'Warning' },
        ]}
      />
      <NumberField
        label="SPC Rule Violations"
        value={data.spcRuleViolationCount ?? 0}
        min={0}
        max={50}
        onChange={(v) => patch('spcRuleViolationCount', v)}
      />
    </>
  );
}

// --- Human Resources ---

function HRApprovalProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <SelectField
        label="Approval Type"
        value={data.approvalType ?? 'leave'}
        onChange={(v) => patch('approvalType', v)}
        options={[
          { value: 'leave', label: 'Leave' },
          { value: 'claim', label: 'Claim' },
          { value: 'promotion', label: 'Promotion' },
        ]}
      />
      <TextField label="Approver Name" value={data.approverName} onChange={(v) => patch('approverName', v)} />
      <SelectField
        label="Approval Status"
        value={data.approvalStatus ?? 'pending'}
        onChange={(v) => patch('approvalStatus', v)}
        options={[
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Approved' },
          { value: 'rejected', label: 'Rejected' },
        ]}
      />
    </>
  );
}

function HRComplianceProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <SelectField
        label="Statutory Body"
        value={data.statutoryBody ?? 'EPF'}
        onChange={(v) => patch('statutoryBody', v)}
        options={[
          { value: 'SOCSO', label: 'SOCSO' },
          { value: 'EPF', label: 'EPF' },
          { value: 'PCB', label: 'PCB' },
        ]}
      />
      <TextField label="Compliance Period" value={data.compliancePeriod} onChange={(v) => patch('compliancePeriod', v)} placeholder="e.g. Jan 2025" />
      <SelectField
        label="Compliance Status"
        value={data.complianceStatus ?? 'pending'}
        onChange={(v) => patch('complianceStatus', v)}
        options={[
          { value: 'compliant', label: 'Compliant' },
          { value: 'non-compliant', label: 'Non-Compliant' },
          { value: 'pending', label: 'Pending' },
        ]}
      />
    </>
  );
}

function HROnboardingProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <TextField label="Employee Name" value={data.employeeName} onChange={(v) => patch('employeeName', v)} />
      <SelectField
        label="Onboarding Stage"
        value={data.onboardingStage ?? 'documentation'}
        onChange={(v) => patch('onboardingStage', v)}
        options={[
          { value: 'documentation', label: 'Documentation' },
          { value: 'orientation', label: 'Orientation' },
          { value: 'training', label: 'Training' },
          { value: 'probation', label: 'Probation' },
          { value: 'confirmed', label: 'Confirmed' },
        ]}
      />
      <NumberField
        label="Completion %"
        value={data.completionPercentage ?? 0}
        min={0}
        max={100}
        onChange={(v) => patch('completionPercentage', v)}
      />
    </>
  );
}

// --- Six Sigma ---

function DMAICPhaseProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <SelectField
        label="DMAIC Phase"
        value={data.phase ?? 'Define'}
        onChange={(v) => patch('phase', v)}
        options={[
          { value: 'Define', label: 'Define' },
          { value: 'Measure', label: 'Measure' },
          { value: 'Analyze', label: 'Analyze' },
          { value: 'Improve', label: 'Improve' },
          { value: 'Control', label: 'Control' },
        ]}
      />
      <TextField label="Phase Owner" value={data.phaseOwner} onChange={(v) => patch('phaseOwner', v)} />
      <NumberField
        label="Completion %"
        value={data.phaseCompletionPercentage ?? 0}
        min={0}
        max={100}
        onChange={(v) => patch('phaseCompletionPercentage', v)}
      />
    </>
  );
}

function SixSigmaRiskProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <TextField label="Defect Type" value={data.defectType} onChange={(v) => patch('defectType', v)} />
      <NumberField
        label="RPN (Risk Priority Number)"
        value={data.rpn ?? 0}
        min={0}
        max={1000}
        onChange={(v) => patch('rpn', v)}
      />
      <NumberField
        label="Defect Rate (PPM)"
        value={data.defectRatePPM ?? 0}
        min={0}
        max={1000000}
        onChange={(v) => patch('defectRatePPM', v)}
      />
    </>
  );
}

function SixSigmaMeasurementProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <TextField label="Measurement System" value={data.measurementSystemName} onChange={(v) => patch('measurementSystemName', v)} />
      <NumberField
        label="Gauge R&R %"
        value={data.gaugeRRPercentage ?? 0}
        min={0}
        max={100}
        onChange={(v) => patch('gaugeRRPercentage', v)}
      />
      <SelectField
        label="Acceptability"
        value={data.acceptability ?? 'acceptable'}
        onChange={(v) => patch('acceptability', v)}
        options={[
          { value: 'acceptable', label: 'Acceptable (< 10%)' },
          { value: 'marginal', label: 'Marginal (10–30%)' },
          { value: 'unacceptable', label: 'Unacceptable (> 30%)' },
        ]}
      />
    </>
  );
}

// --- ISO ---

function ISOAuditPlanProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <TextField label="Audit Scope" value={data.auditScope} onChange={(v) => patch('auditScope', v)} multiline />
      <TextField label="Schedule Date" value={data.auditScheduleDate} onChange={(v) => patch('auditScheduleDate', v)} placeholder="YYYY-MM-DD" />
      <SelectField
        label="Audit Status"
        value={data.auditStatus ?? 'planned'}
        onChange={(v) => patch('auditStatus', v)}
        options={[
          { value: 'planned', label: 'Planned' },
          { value: 'in-progress', label: 'In Progress' },
          { value: 'completed', label: 'Completed' },
          { value: 'overdue', label: 'Overdue' },
        ]}
      />
    </>
  );
}

function ISOCAPAProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <SelectField
        label="CAPA Type"
        value={data.capaType ?? 'corrective'}
        onChange={(v) => patch('capaType', v)}
        options={[
          { value: 'corrective', label: 'Corrective' },
          { value: 'preventive', label: 'Preventive' },
        ]}
      />
      <TextField label="Root Cause" value={data.rootCauseDescription} onChange={(v) => patch('rootCauseDescription', v)} multiline />
      <SelectField
        label="Action Status"
        value={data.actionStatus ?? 'open'}
        onChange={(v) => patch('actionStatus', v)}
        options={[
          { value: 'open', label: 'Open' },
          { value: 'in-progress', label: 'In Progress' },
          { value: 'verified', label: 'Verified' },
          { value: 'closed', label: 'Closed' },
        ]}
      />
    </>
  );
}

function ISOComplianceCheckProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <TextField label="Standard Reference" value={data.standardReference} onChange={(v) => patch('standardReference', v)} placeholder="e.g. ISO 9001:2015" />
      <TextField label="Clause Number" value={data.clauseNumber} onChange={(v) => patch('clauseNumber', v)} placeholder="e.g. 8.4.1" />
      <SelectField
        label="Conformance Status"
        value={data.conformanceStatus ?? 'conforming'}
        onChange={(v) => patch('conformanceStatus', v)}
        options={[
          { value: 'conforming', label: 'Conforming' },
          { value: 'minor-NC', label: 'Minor NC' },
          { value: 'major-NC', label: 'Major NC' },
          { value: 'observation', label: 'Observation' },
        ]}
      />
    </>
  );
}

// --- QMS ---

function QMSRiskAssessmentProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  const rpn = (data.severityRating ?? 1) * (data.occurrenceRating ?? 1) * (data.detectionRating ?? 1);

  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <TextField label="Failure Mode" value={data.failureMode} onChange={(v) => patch('failureMode', v)} />
      <NumberField label="Severity (S)" value={data.severityRating ?? 1} min={1} max={10} onChange={(v) => patch('severityRating', v)} />
      <NumberField label="Occurrence (O)" value={data.occurrenceRating ?? 1} min={1} max={10} onChange={(v) => patch('occurrenceRating', v)} />
      <NumberField label="Detection (D)" value={data.detectionRating ?? 1} min={1} max={10} onChange={(v) => patch('detectionRating', v)} />
      <div className="flex items-center justify-between rounded-md border border-dashed p-3 bg-muted/30">
        <span className="text-xs text-muted-foreground">Computed RPN</span>
        <Badge variant={rpn > 200 ? 'destructive' : rpn > 100 ? 'secondary' : 'default'} className="font-mono">
          {rpn}
        </Badge>
      </div>
    </>
  );
}

function QMSDocumentControlProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <TextField label="Document Title" value={data.documentTitle} onChange={(v) => patch('documentTitle', v)} />
      <TextField label="Revision Number" value={data.revisionNumber} onChange={(v) => patch('revisionNumber', v)} placeholder="e.g. Rev 3" />
      <TextField label="Approver Name" value={data.approverName} onChange={(v) => patch('approverName', v)} />
      <SelectField
        label="Document Status"
        value={data.documentStatus ?? 'draft'}
        onChange={(v) => patch('documentStatus', v)}
        options={[
          { value: 'draft', label: 'Draft' },
          { value: 'under-review', label: 'Under Review' },
          { value: 'approved', label: 'Approved' },
          { value: 'obsolete', label: 'Obsolete' },
        ]}
      />
    </>
  );
}

function QMSSPCChartProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <TextField label="Process Parameter" value={data.processParameter} onChange={(v) => patch('processParameter', v)} />
      <SelectField
        label="Chart Type"
        value={data.controlChartType ?? 'X-bar R'}
        onChange={(v) => patch('controlChartType', v)}
        options={[
          { value: 'X-bar R', label: 'X-bar R' },
          { value: 'X-bar S', label: 'X-bar S' },
          { value: 'p-chart', label: 'p-chart' },
          { value: 'c-chart', label: 'c-chart' },
        ]}
      />
      <NumberField
        label="Cpk"
        value={Math.round((data.cpk ?? 1.33) * 100)}
        min={0}
        max={300}
        onChange={(v) => patch('cpk', v / 100)}
      />
    </>
  );
}

// --- Integration Connectors ---

function SlackConnectorProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <TextField label="Slack Channel" value={data.slackChannel} onChange={(v) => patch('slackChannel', v)} placeholder="#alerts" />
      <TextField label="Message Template" value={data.messageTemplate} onChange={(v) => patch('messageTemplate', v)} multiline placeholder="{{workflow.id}} completed" />
      <SelectField
        label="Delivery Status"
        value={data.deliveryStatus ?? 'pending'}
        onChange={(v) => patch('deliveryStatus', v)}
        options={[
          { value: 'pending', label: 'Pending' },
          { value: 'sent', label: 'Sent' },
          { value: 'failed', label: 'Failed' },
        ]}
      />
    </>
  );
}

function TeamsConnectorProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <TextField label="Channel / Chat" value={data.teamsChannelOrChat} onChange={(v) => patch('teamsChannelOrChat', v)} />
      <SelectField
        label="Message Type"
        value={data.messageType ?? 'notification'}
        onChange={(v) => patch('messageType', v)}
        options={[
          { value: 'notification', label: 'Notification' },
          { value: 'approval-request', label: 'Approval Request' },
        ]}
      />
      <SelectField
        label="Delivery Status"
        value={data.deliveryStatus ?? 'pending'}
        onChange={(v) => patch('deliveryStatus', v)}
        options={[
          { value: 'pending', label: 'Pending' },
          { value: 'sent', label: 'Sent' },
          { value: 'failed', label: 'Failed' },
        ]}
      />
    </>
  );
}

function WebhookConnectorProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <TextField label="Endpoint URL" value={data.endpointUrl} onChange={(v) => patch('endpointUrl', v)} placeholder="https://api.example.com/webhook" />
      <SelectField
        label="HTTP Method"
        value={data.httpMethod ?? 'POST'}
        onChange={(v) => patch('httpMethod', v)}
        options={[
          { value: 'GET', label: 'GET' },
          { value: 'POST', label: 'POST' },
          { value: 'PUT', label: 'PUT' },
          { value: 'PATCH', label: 'PATCH' },
          { value: 'DELETE', label: 'DELETE' },
        ]}
      />
      <TextField label="Last Response Status" value={String(data.lastResponseStatus ?? '')} onChange={(v) => patch('lastResponseStatus', Number(v))} placeholder="200" />
    </>
  );
}

function EmailConnectorProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <TextField label="Recipient Address" value={data.recipientAddress} onChange={(v) => patch('recipientAddress', v)} placeholder="recipient@example.com" />
      <TextField label="Subject Line" value={data.subjectLine} onChange={(v) => patch('subjectLine', v)} />
      <SelectField
        label="Delivery Status"
        value={data.deliveryStatus ?? 'pending'}
        onChange={(v) => patch('deliveryStatus', v)}
        options={[
          { value: 'pending', label: 'Pending' },
          { value: 'sent', label: 'Sent' },
          { value: 'failed', label: 'Failed' },
        ]}
      />
    </>
  );
}

// --- MetricCard / Annotation (custom nodes) ---

function MetricCardProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Label" value={data.label} onChange={(v) => patch('label', v)} />
      <TextField label="Value" value={data.value} onChange={(v) => patch('value', v)} placeholder="e.g. 98.5" />
      <TextField label="Change" value={data.change} onChange={(v) => patch('change', v)} placeholder="e.g. +2.1%" />
      <SelectField
        label="Trend"
        value={data.trend ?? 'neutral'}
        onChange={(v) => patch('trend', v)}
        options={[
          { value: 'up', label: '↑ Up' },
          { value: 'down', label: '↓ Down' },
          { value: 'neutral', label: '— Neutral' },
        ]}
      />
    </>
  );
}

function AnnotationProperties({ data, patch }: { data: Record<string, any>; patch: Patcher }) {
  return (
    <>
      <TextField label="Content" value={data.content} onChange={(v) => patch('content', v)} multiline />
      <TextField label="Author" value={data.author} onChange={(v) => patch('author', v)} />
    </>
  );
}

// ─── Property form router ─────────────────────────────────────────────────────

function PropertiesForm({
  nodeType,
  data,
  patch,
}: {
  nodeType: string;
  data: Record<string, any>;
  patch: Patcher;
}) {
  switch (nodeType) {
    // automation
    case 'task':         return <TaskProperties data={data} patch={patch} />;
    case 'condition':    return <ConditionProperties data={data} patch={patch} />;
    case 'action':       return <ActionProperties data={data} patch={patch} />;
    case 'approval':     return <ApprovalProperties data={data} patch={patch} />;
    case 'wait':         return <WaitProperties data={data} patch={patch} />;
    case 'trigger':      return <TriggerProperties data={data} patch={patch} />;
    case 'notification': return <NotificationProperties data={data} patch={patch} />;
    case 'subWorkflow':  return <SubWorkflowProperties data={data} patch={patch} />;
    // workflow nodes (label-only shapes that have toolbar inline editing)
    case 'start':
    case 'end':
    case 'decision':
    case 'parallel':
    case 'error':
    case 'group':        return <LabelOnlyProperties data={data} patch={patch} />;
    // my-standards
    case 'ms-compliance-check':  return <MSComplianceCheckProperties data={data} patch={patch} />;
    case 'ms-audit':             return <MSAuditProperties data={data} patch={patch} />;
    case 'ms-certification':     return <MSCertificationProperties data={data} patch={patch} />;
    case 'ms-standards-browser': return <MSStandardsBrowserProperties data={data} patch={patch} />;
    // islamic manufacturing
    case 'halal-audit':           return <HalalAuditProperties data={data} patch={patch} />;
    case 'jakim-certificate':     return <JAKIMCertificateProperties data={data} patch={patch} />;
    case 'halal-risk':            return <HalalRiskProperties data={data} patch={patch} />;
    case 'haram-ingredient-check':return <HaramIngredientCheckProperties data={data} patch={patch} />;
    // gmp
    case 'gmp-workflow':    return <GMPWorkflowProperties data={data} patch={patch} />;
    case 'gmp-deviation':   return <GMPDeviationProperties data={data} patch={patch} />;
    case 'gmp-cleanliness': return <GMPCleanlinessProperties data={data} patch={patch} />;
    // lss
    case 'lss-waste-analyzer': return <LSSWasteAnalyzerProperties data={data} patch={patch} />;
    case 'lss-value-stream':   return <LSSValueStreamProperties data={data} patch={patch} />;
    case 'lss-control-chart':  return <LSSControlChartProperties data={data} patch={patch} />;
    // hr
    case 'hr-approval':    return <HRApprovalProperties data={data} patch={patch} />;
    case 'hr-compliance':  return <HRComplianceProperties data={data} patch={patch} />;
    case 'hr-onboarding':  return <HROnboardingProperties data={data} patch={patch} />;
    // six sigma
    case 'dmaic-phase':            return <DMAICPhaseProperties data={data} patch={patch} />;
    case 'six-sigma-risk':         return <SixSigmaRiskProperties data={data} patch={patch} />;
    case 'six-sigma-measurement':  return <SixSigmaMeasurementProperties data={data} patch={patch} />;
    // iso
    case 'iso-audit-plan':       return <ISOAuditPlanProperties data={data} patch={patch} />;
    case 'iso-capa':             return <ISOCAPAProperties data={data} patch={patch} />;
    case 'iso-compliance-check': return <ISOComplianceCheckProperties data={data} patch={patch} />;
    // qms
    case 'qms-risk-assessment':  return <QMSRiskAssessmentProperties data={data} patch={patch} />;
    case 'qms-document-control': return <QMSDocumentControlProperties data={data} patch={patch} />;
    case 'qms-spc-chart':        return <QMSSPCChartProperties data={data} patch={patch} />;
    // integrations
    case 'slack-connector':   return <SlackConnectorProperties data={data} patch={patch} />;
    case 'teams-connector':   return <TeamsConnectorProperties data={data} patch={patch} />;
    case 'webhook-connector': return <WebhookConnectorProperties data={data} patch={patch} />;
    case 'email-connector':   return <EmailConnectorProperties data={data} patch={patch} />;
    // custom
    case 'metricCard':  return <MetricCardProperties data={data} patch={patch} />;
    case 'annotation':  return <AnnotationProperties data={data} patch={patch} />;
    default:
      return <LabelOnlyProperties data={data} patch={patch} />;
  }
}

// ─── Node metadata section ────────────────────────────────────────────────────

function NodeMetadataSection({ node }: { node: Node }) {
  return (
    <div className="space-y-2 text-xs text-muted-foreground">
      <div className="flex items-center justify-between">
        <span>Node ID</span>
        <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px] max-w-[140px] truncate">
          {node.id}
        </code>
      </div>
      <div className="flex items-center justify-between">
        <span>Type</span>
        <Badge variant="outline" className="text-[10px] font-mono h-5">
          {node.type ?? 'default'}
        </Badge>
      </div>
      <div className="flex items-center justify-between">
        <span>Position X</span>
        <span className="font-mono">{Math.round(node.position.x)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Position Y</span>
        <span className="font-mono">{Math.round(node.position.y)}</span>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function NodePropertiesPanel({
  selectedNode,
  onUpdate,
  onClose,
  className,
}: NodePropertiesPanelProps) {
  const nodeType = selectedNode?.type ?? 'default';
  const data = (selectedNode?.data ?? {}) as Record<string, any>;
  const nodeAccent = accent(nodeType);

  const patch = useCallback<Patcher>(
    (field, value) => {
      if (!selectedNode) return;
      onUpdate(selectedNode.id, { ...data, [field]: value });
    },
    [selectedNode, data, onUpdate]
  );

  if (!selectedNode) {
    return (
      <div
        className={cn(
          'flex h-full flex-col items-center justify-center gap-3 border-l bg-background p-6 text-center',
          className
        )}
      >
        <SlidersHorizontal className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          Select a node on the canvas to view and edit its properties.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex h-full w-72 flex-col border-l bg-background',
        className
      )}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderLeftWidth: 3, borderLeftColor: nodeAccent }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Settings2 className="h-4 w-4 shrink-0" style={{ color: nodeAccent }} />
          <span className="font-semibold text-sm truncate capitalize">
            {nodeType.replace(/-/g, ' ')} Properties
          </span>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={onClose}>
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Body */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Accordion type="multiple" defaultValue={['properties', 'metadata']}>

            {/* Properties section */}
            <AccordionItem value="properties" className="border-none">
              <AccordionTrigger className="py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline">
                <div className="flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5" />
                  Node Properties
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-1">
                  <PropertiesForm nodeType={nodeType} data={data} patch={patch} />
                </div>
              </AccordionContent>
            </AccordionItem>

            <Separator className="my-1" />

            {/* Metadata section */}
            <AccordionItem value="metadata" className="border-none">
              <AccordionTrigger className="py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline">
                <div className="flex items-center gap-2">
                  <Info className="h-3.5 w-3.5" />
                  Node Info
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-1">
                  <NodeMetadataSection node={selectedNode} />
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>
      </ScrollArea>

      {/* Accent strip at bottom */}
      <div className="h-1 w-full shrink-0" style={{ backgroundColor: nodeAccent }} />
    </div>
  );
}

export default NodePropertiesPanel;
