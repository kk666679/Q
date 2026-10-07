'use client';

import * as React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

import { Badge } from '@/components/ui/badge';
import { HR_ACCENT } from '@/components/human-resources/constants';

type LooseNodeProps<T> = NodeProps<any> & { data: T };

export interface HRNodeData {
  label?: string;
  approvalType?: 'leave' | 'claim' | 'promotion';
  approverName?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  statutoryBody?: 'SOCSO' | 'EPF' | 'PCB';
  compliancePeriod?: string;
  complianceStatus?: 'compliant' | 'non-compliant' | 'pending';
  employeeName?: string;
  onboardingStage?: 'documentation' | 'orientation' | 'training' | 'probation' | 'confirmed';
  completionPercentage?: string;
}

const headerClass = 'px-3 py-2 text-xs font-semibold';
const cardClass =
  'rounded-lg border bg-card shadow-sm overflow-hidden transition-colors';

export const HRApprovalNode = React.memo(function HRApprovalNode({
  data,
  selected,
}: LooseNodeProps<HRNodeData> & { selected?: boolean }) {
  return (
    <div
      className={cardClass}
      style={{ borderColor: HR_ACCENT, position: 'relative' }}
    >
      <div
        className={headerClass}
        style={{ backgroundColor: `${HR_ACCENT}26` }}
      >
        HR Approval
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">
          {data?.label ?? 'HR Approval'}
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="text-[10px]"
            style={{ borderColor: HR_ACCENT, color: HR_ACCENT }}
          >
            {data?.approvalType ?? 'leave'}
          </Badge>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Approver Name</div>
          <div className="font-medium">{data?.approverName ?? '—'}</div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="text-[10px]"
            style={{ borderColor: HR_ACCENT, color: HR_ACCENT }}
          >
            {data?.approvalStatus ?? 'pending'}
          </Badge>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent"
        style={{ border: `2px solid ${HR_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent"
        style={{ border: `2px solid ${HR_ACCENT}` }}
      />

      {selected ? (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: `0 0 0 2px ${HR_ACCENT}` }}
        />
      ) : null}
    </div>
  );
});

export const HRComplianceNode = React.memo(function HRComplianceNode({
  data,
  selected,
}: LooseNodeProps<HRNodeData> & { selected?: boolean }) {
  return (
    <div
      className={cardClass}
      style={{ borderColor: HR_ACCENT, position: 'relative' }}
    >
      <div
        className={headerClass}
        style={{ backgroundColor: `${HR_ACCENT}26` }}
      >
        Statutory Compliance
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">
          {data?.label ?? 'HR Compliance'}
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="text-[10px]"
            style={{ borderColor: HR_ACCENT, color: HR_ACCENT }}
          >
            {data?.statutoryBody ?? 'SOCSO'}
          </Badge>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Compliance Period</div>
          <div className="font-medium">{data?.compliancePeriod ?? '—'}</div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="text-[10px]"
            style={{ borderColor: HR_ACCENT, color: HR_ACCENT }}
          >
            {data?.complianceStatus ?? 'pending'}
          </Badge>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent"
        style={{ border: `2px solid ${HR_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent"
        style={{ border: `2px solid ${HR_ACCENT}` }}
      />

      {selected ? (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: `0 0 0 2px ${HR_ACCENT}` }}
        />
      ) : null}
    </div>
  );
});

export const HROnboardingNode = React.memo(function HROnboardingNode({
  data,
  selected,
}: LooseNodeProps<HRNodeData> & { selected?: boolean }) {
  return (
    <div
      className={cardClass}
      style={{ borderColor: HR_ACCENT, position: 'relative' }}
    >
      <div
        className={headerClass}
        style={{ backgroundColor: `${HR_ACCENT}26` }}
      >
        Onboarding
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">
          {data?.label ?? 'Onboarding'}
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Employee Name</div>
          <div className="font-medium">{data?.employeeName ?? '—'}</div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="text-[10px]"
            style={{ borderColor: HR_ACCENT, color: HR_ACCENT }}
          >
            {data?.onboardingStage ?? 'documentation'}
          </Badge>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Completion %</div>
          <div className="font-medium">{data?.completionPercentage ?? '—'}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent"
        style={{ border: `2px solid ${HR_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent"
        style={{ border: `2px solid ${HR_ACCENT}` }}
      />

      {selected ? (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: `0 0 0 2px ${HR_ACCENT}` }}
        />
      ) : null}
    </div>
  );
});
