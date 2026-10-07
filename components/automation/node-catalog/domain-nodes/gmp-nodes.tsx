'use client';

import * as React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

import { Badge } from '@/components/ui/badge';
import { GMP_ACCENT } from '@/components/GMP/constants';

type LooseNodeProps<T> = NodeProps<any> & { data: T };

export interface GMPNodeData {
  label?: string;
  complianceStatus?: 'compliant' | 'non-compliant' | 'pending';
  kpiSummary?: string;
  deviationType?: 'critical' | 'major' | 'minor';
  deviationDescription?: string;
  correctiveActionStatus?: string;
  cleanlinessZone?: string;
  zoneStatus?: 'clean' | 'at-risk' | 'contaminated';
  lastInspectionDate?: string;
}

const headerClass = 'px-3 py-2 text-xs font-semibold';
const cardClass =
  'rounded-lg border bg-card shadow-sm overflow-hidden transition-colors';

export const GMPWorkflowNode = React.memo(function GMPWorkflowNode({
  data,
  selected,
}: LooseNodeProps<GMPNodeData> & { selected?: boolean }) {
  return (
    <div
      className={cardClass}
      style={{ borderColor: GMP_ACCENT, position: 'relative' }}
    >
      <div
        className={headerClass}
        style={{ backgroundColor: `${GMP_ACCENT}26` }}
      >
        GMP Workflow
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">
          {data?.label ?? 'GMP Workflow'}
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">KPI Summary</div>
          <div className="font-medium">{data?.kpiSummary ?? '—'}</div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="text-[10px]"
            style={{ borderColor: GMP_ACCENT, color: GMP_ACCENT }}
          >
            {data?.complianceStatus ?? 'pending'}
          </Badge>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent"
        style={{ border: `2px solid ${GMP_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent"
        style={{ border: `2px solid ${GMP_ACCENT}` }}
      />

      {selected ? (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: `0 0 0 2px ${GMP_ACCENT}` }}
        />
      ) : null}
    </div>
  );
});

export const GMPDeviationNode = React.memo(function GMPDeviationNode({
  data,
  selected,
}: LooseNodeProps<GMPNodeData> & { selected?: boolean }) {
  return (
    <div
      className={cardClass}
      style={{ borderColor: GMP_ACCENT, position: 'relative' }}
    >
      <div
        className={headerClass}
        style={{ backgroundColor: `${GMP_ACCENT}26` }}
      >
        GMP Deviation
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">
          {data?.label ?? 'GMP Deviation'}
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="text-[10px]"
            style={{ borderColor: GMP_ACCENT, color: GMP_ACCENT }}
          >
            {data?.deviationType ?? 'major'}
          </Badge>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Description</div>
          <div className="font-medium">{data?.deviationDescription ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Corrective Action Status</div>
          <div className="font-medium">{data?.correctiveActionStatus ?? '—'}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent"
        style={{ border: `2px solid ${GMP_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent"
        style={{ border: `2px solid ${GMP_ACCENT}` }}
      />

      {selected ? (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: `0 0 0 2px ${GMP_ACCENT}` }}
        />
      ) : null}
    </div>
  );
});

export const GMPCleanlinessNode = React.memo(function GMPCleanlinessNode({
  data,
  selected,
}: LooseNodeProps<GMPNodeData> & { selected?: boolean }) {
  return (
    <div
      className={cardClass}
      style={{ borderColor: GMP_ACCENT, position: 'relative' }}
    >
      <div
        className={headerClass}
        style={{ backgroundColor: `${GMP_ACCENT}26` }}
      >
        Cleanliness Check
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">
          {data?.label ?? 'Cleanliness Check'}
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Zone</div>
          <div className="font-medium">{data?.cleanlinessZone ?? '—'}</div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="text-[10px]"
            style={{ borderColor: GMP_ACCENT, color: GMP_ACCENT }}
          >
            {data?.zoneStatus ?? 'clean'}
          </Badge>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Last Inspection</div>
          <div className="font-medium">{data?.lastInspectionDate ?? '—'}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent"
        style={{ border: `2px solid ${GMP_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent"
        style={{ border: `2px solid ${GMP_ACCENT}` }}
      />

      {selected ? (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: `0 0 0 2px ${GMP_ACCENT}` }}
        />
      ) : null}
    </div>
  );
});
