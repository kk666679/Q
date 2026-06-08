'use client';

import * as React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

import { Badge } from '@/components/ui/badge';
import { IM_ACCENT } from './constants';

type LooseNodeProps<T> = NodeProps<any> & { data: T };

export type IMNodeData = {
  label?: string;
  auditScope?: string;
  auditorName?: string;
  halalStatus?: 'certified' | 'pending' | 'rejected';
  certificateNumber?: string;
  validityPeriod?: string;
  productCategory?: string;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  riskDescription?: string;
  mitigationAction?: string;
  ingredientName?: string;
  detectionMethod?: string;
  result?: 'pass' | 'fail';
};

const headerClass = 'px-3 py-2 text-xs font-semibold';
const cardClass =
  'rounded-lg border bg-card shadow-sm overflow-hidden transition-colors';

export const HalalAuditNode = React.memo(function HalalAuditNode({
  data,
  selected,
}: LooseNodeProps<IMNodeData> & { selected?: boolean }) {
  return (
    <div
      className={cardClass}
      style={{ borderColor: IM_ACCENT, position: 'relative' }}
    >
      <div
        className={headerClass}
        style={{ backgroundColor: `${IM_ACCENT}26` }}
      >
        Halal Audit
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">
          {data?.label ?? 'Halal Audit'}
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Audit scope</div>
          <div className="font-medium">{data?.auditScope ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Auditor name</div>
          <div className="font-medium">{data?.auditorName ?? '—'}</div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="text-[10px]"
            style={{ borderColor: IM_ACCENT, color: IM_ACCENT }}
          >
            {data?.halalStatus ?? 'pending'}
          </Badge>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent"
        style={{ border: `2px solid ${IM_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent"
        style={{ border: `2px solid ${IM_ACCENT}` }}
      />

      {selected ? (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: `0 0 0 2px ${IM_ACCENT}` }}
        />
      ) : null}
    </div>
  );
});

export const JAKIMCertificateNode = React.memo(function JAKIMCertificateNode({
  data,
}: LooseNodeProps<IMNodeData>) {
  return (
    <div className={cardClass} style={{ borderColor: IM_ACCENT }}>
      <div className={headerClass} style={{ backgroundColor: `${IM_ACCENT}26` }}>
        JAKIM Certificate
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">
          {data?.label ?? 'JAKIM Certificate'}
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Certificate number</div>
          <div className="font-medium">
            {data?.certificateNumber ?? '—'}
          </div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Validity period</div>
          <div className="font-medium">{data?.validityPeriod ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Product category</div>
          <div className="font-medium">
            {data?.productCategory ?? '—'}
          </div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent"
        style={{ border: `2px solid ${IM_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent"
        style={{ border: `2px solid ${IM_ACCENT}` }}
      />
    </div>
  );
});

export const HalalRiskNode = React.memo(function HalalRiskNode({
  data,
}: LooseNodeProps<IMNodeData>) {
  return (
    <div className={cardClass} style={{ borderColor: IM_ACCENT }}>
      <div className={headerClass} style={{ backgroundColor: `${IM_ACCENT}26` }}>
        Halal Risk
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">
          {data?.label ?? 'Halal Risk'}
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="text-[10px]"
            style={{ borderColor: IM_ACCENT, color: IM_ACCENT }}
          >
            {data?.riskLevel ?? 'medium'}
          </Badge>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Risk description</div>
          <div className="font-medium">{data?.riskDescription ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Mitigation action</div>
          <div className="font-medium">{data?.mitigationAction ?? '—'}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent"
        style={{ border: `2px solid ${IM_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent"
        style={{ border: `2px solid ${IM_ACCENT}` }}
      />
    </div>
  );
});

export const HaramIngredientCheckNode = React.memo(function HaramIngredientCheckNode({
  data,
}: LooseNodeProps<IMNodeData>) {
  return (
    <div className={cardClass} style={{ borderColor: IM_ACCENT }}>
      <div className={headerClass} style={{ backgroundColor: `${IM_ACCENT}26` }}>
        Haram Ingredient Check
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">
          {data?.label ?? 'Haram Ingredient Check'}
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Ingredient name</div>
          <div className="font-medium">{data?.ingredientName ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Detection method</div>
          <div className="font-medium">{data?.detectionMethod ?? '—'}</div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="text-[10px]"
            style={{ borderColor: IM_ACCENT, color: IM_ACCENT }}
          >
            {data?.result ?? 'pass'}
          </Badge>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent"
        style={{ border: `2px solid ${IM_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent"
        style={{ border: `2px solid ${IM_ACCENT}` }}
      />
    </div>
  );
});

