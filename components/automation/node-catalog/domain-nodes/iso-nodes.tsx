'use client';

import * as React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

import { Badge } from '@/components/ui/badge';

type LooseNodeProps<T> = NodeProps<any> & { data: T };

// ISO uses hardcoded accent (no constants.ts in ISO package)
const ISO_ACCENT = '#06b6d4';

export interface ISONodeData {
  label?: string;
  auditPlanName?: string;
  scope?: string;
  auditDate?: string;
  capaType?: string;
  nonconformanceDescription?: string;
  rootCauseAnalysis?: string;
  status?: string;
  frameworkVersion?: string;
  controlMeasure?: string;
  verificationDate?: string;
}

const headerClass = 'px-3 py-2 text-xs font-semibold';
const cardClass =
  'rounded-lg border bg-card shadow-sm overflow-hidden transition-colors';

export const ISOAuditPlanNode = React.memo(function ISOAuditPlanNode({
  data,
  selected,
}: LooseNodeProps<ISONodeData> & { selected?: boolean }) {
  return (
    <div
      className={cardClass}
      style={{ borderColor: ISO_ACCENT, position: 'relative' }}
    >
      <div
        className={headerClass}
        style={{ backgroundColor: `${ISO_ACCENT}26` }}
      >
        ISO Audit Plan
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">
          {data?.label ?? 'ISO Audit Plan'}
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Plan Name</div>
          <div className="font-medium">{data?.auditPlanName ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Scope</div>
          <div className="font-medium">{data?.scope ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Audit Date</div>
          <div className="font-medium">{data?.auditDate ?? '—'}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent"
        style={{ border: `2px solid ${ISO_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent"
        style={{ border: `2px solid ${ISO_ACCENT}` }}
      />

      {selected ? (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: `0 0 0 2px ${ISO_ACCENT}` }}
        />
      ) : null}
    </div>
  );
});

export const ISOCAPANode = React.memo(function ISOCAPANode({
  data,
  selected,
}: LooseNodeProps<ISONodeData> & { selected?: boolean }) {
  return (
    <div
      className={cardClass}
      style={{ borderColor: ISO_ACCENT, position: 'relative' }}
    >
      <div
        className={headerClass}
        style={{ backgroundColor: `${ISO_ACCENT}26` }}
      >
        ISO CAPA
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">
          {data?.label ?? 'ISO CAPA'}
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Type</div>
          <div className="font-medium">{data?.capaType ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Non-conformance</div>
          <div className="font-medium text-[9px]">{data?.nonconformanceDescription ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Root Cause</div>
          <div className="font-medium text-[9px]">{data?.rootCauseAnalysis ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Status</div>
          <div className="font-medium">{data?.status ?? '—'}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent"
        style={{ border: `2px solid ${ISO_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent"
        style={{ border: `2px solid ${ISO_ACCENT}` }}
      />

      {selected ? (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: `0 0 0 2px ${ISO_ACCENT}` }}
        />
      ) : null}
    </div>
  );
});

export const ISOComplianceCheckNode = React.memo(function ISOComplianceCheckNode({
  data,
  selected,
}: LooseNodeProps<ISONodeData> & { selected?: boolean }) {
  return (
    <div
      className={cardClass}
      style={{ borderColor: ISO_ACCENT, position: 'relative' }}
    >
      <div
        className={headerClass}
        style={{ backgroundColor: `${ISO_ACCENT}26` }}
      >
        ISO Compliance Check
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">
          {data?.label ?? 'ISO Compliance'}
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Framework Version</div>
          <div className="font-medium">{data?.frameworkVersion ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Control Measure</div>
          <div className="font-medium text-[9px]">{data?.controlMeasure ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Verification Date</div>
          <div className="font-medium">{data?.verificationDate ?? '—'}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent"
        style={{ border: `2px solid ${ISO_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent"
        style={{ border: `2px solid ${ISO_ACCENT}` }}
      />

      {selected ? (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: `0 0 0 2px ${ISO_ACCENT}` }}
        />
      ) : null}
    </div>
  );
});
