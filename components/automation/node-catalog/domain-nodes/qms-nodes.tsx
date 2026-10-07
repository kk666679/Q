'use client';

import * as React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

import { Badge } from '@/components/ui/badge';

type LooseNodeProps<T> = NodeProps<any> & { data: T };

// QMS uses hardcoded accent (no constants.ts in QMS package)
const QMS_ACCENT = '#3b82f6';

export interface QMSNodeData {
  label?: string;
  riskDescription?: string;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  mitigation?: string;
  documentName?: string;
  documentStatus?: string;
  revisionHistory?: string;
  approvalDate?: string;
  chartName?: string;
  sampleSize?: string;
  controlLimitStatus?: string;
  trendIndicator?: string;
}

const headerClass = 'px-3 py-2 text-xs font-semibold';
const cardClass =
  'rounded-lg border bg-card shadow-sm overflow-hidden transition-colors';

export const QMSRiskAssessmentNode = React.memo(function QMSRiskAssessmentNode({
  data,
  selected,
}: LooseNodeProps<QMSNodeData> & { selected?: boolean }) {
  return (
    <div
      className={cardClass}
      style={{ borderColor: QMS_ACCENT, position: 'relative' }}
    >
      <div
        className={headerClass}
        style={{ backgroundColor: `${QMS_ACCENT}26` }}
      >
        Risk Assessment
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">
          {data?.label ?? 'QMS Risk Assessment'}
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Risk Description</div>
          <div className="font-medium text-[9px]">{data?.riskDescription ?? '—'}</div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="text-[10px]"
            style={{ borderColor: QMS_ACCENT, color: QMS_ACCENT }}
          >
            {data?.riskLevel ?? 'medium'}
          </Badge>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Mitigation</div>
          <div className="font-medium text-[9px]">{data?.mitigation ?? '—'}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="bg-transparent!"
        style={{ border: `2px solid ${QMS_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="bg-transparent!"
        style={{ border: `2px solid ${QMS_ACCENT}` }}
      />

      {selected ? (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: `0 0 0 2px ${QMS_ACCENT}` }}
        />
      ) : null}
    </div>
  );
});

export const QMSDocumentControlNode = React.memo(function QMSDocumentControlNode({
  data,
  selected,
}: LooseNodeProps<QMSNodeData> & { selected?: boolean }) {
  return (
    <div
      className={cardClass}
      style={{ borderColor: QMS_ACCENT, position: 'relative' }}
    >
      <div
        className={headerClass}
        style={{ backgroundColor: `${QMS_ACCENT}26` }}
      >
        Document Control
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">
          {data?.label ?? 'Document Control'}
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Document Name</div>
          <div className="font-medium">{data?.documentName ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Status</div>
          <div className="font-medium">{data?.documentStatus ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Revision History</div>
          <div className="font-medium text-[9px]">{data?.revisionHistory ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Approval Date</div>
          <div className="font-medium">{data?.approvalDate ?? '—'}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="bg-transparent!"
        style={{ border: `2px solid ${QMS_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="bg-transparent!"
        style={{ border: `2px solid ${QMS_ACCENT}` }}
      />

      {selected ? (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: `0 0 0 2px ${QMS_ACCENT}` }}
        />
      ) : null}
    </div>
  );
});

export const QMSSPCChartNode = React.memo(function QMSSPCChartNode({
  data,
  selected,
}: LooseNodeProps<QMSNodeData> & { selected?: boolean }) {
  return (
    <div
      className={cardClass}
      style={{ borderColor: QMS_ACCENT, position: 'relative' }}
    >
      <div
        className={headerClass}
        style={{ backgroundColor: `${QMS_ACCENT}26` }}
      >
        SPC Chart
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">
          {data?.label ?? 'SPC Chart'}
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Chart Name</div>
          <div className="font-medium">{data?.chartName ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Sample Size</div>
          <div className="font-medium">{data?.sampleSize ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Control Limit Status</div>
          <div className="font-medium">{data?.controlLimitStatus ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Trend</div>
          <div className="font-medium">{data?.trendIndicator ?? '—'}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent"
        style={{ border: `2px solid ${QMS_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent"
        style={{ border: `2px solid ${QMS_ACCENT}` }}
      />

      {selected ? (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: `0 0 0 2px ${QMS_ACCENT}` }}
        />
      ) : null}
    </div>
  );
});
