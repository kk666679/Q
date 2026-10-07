'use client';

import * as React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

import { Badge } from '@/components/ui/badge';
import { SS_ACCENT } from '@/components/six-sigma/constants';

type LooseNodeProps<T> = NodeProps<any> & { data: T };

export interface SixSigmaNodeData {
  label?: string;
  dmaikPhase?: 'Define' | 'Measure' | 'Analyze' | 'Improve' | 'Control';
  phaseOwner?: string;
  phaseCompletionPercentage?: string;
  defectType?: string;
  riskPriorityNumber?: string;
  defectRatePPM?: string;
  measurementSystemName?: string;
  gaugeRandRPercentage?: string;
  acceptability?: 'acceptable' | 'marginal' | 'unacceptable';
}

const headerClass = 'px-3 py-2 text-xs font-semibold';
const cardClass =
  'rounded-lg border bg-card shadow-sm overflow-hidden transition-colors';

const DMAIC_PHASES = ['Define', 'Measure', 'Analyze', 'Improve', 'Control'];

export const DMAICPhaseNode = React.memo(function DMAICPhaseNode({
  data,
  selected,
}: LooseNodeProps<SixSigmaNodeData> & { selected?: boolean }) {
  return (
    <div
      className={cardClass}
      style={{ borderColor: SS_ACCENT, position: 'relative' }}
    >
      <div
        className={headerClass}
        style={{ backgroundColor: `${SS_ACCENT}26` }}
      >
        DMAIC Phase
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">
          {data?.label ?? 'DMAIC Phase'}
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="text-[10px]"
            style={{ borderColor: SS_ACCENT, color: SS_ACCENT }}
          >
            {data?.dmaikPhase ?? 'Define'}
          </Badge>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Phase Owner</div>
          <div className="font-medium">{data?.phaseOwner ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Completion %</div>
          <div className="font-medium">{data?.phaseCompletionPercentage ?? '—'}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="bg-transparent!"
        style={{ border: `2px solid ${SS_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="bg-transparent!"
        style={{ border: `2px solid ${SS_ACCENT}` }}
      />

      {selected ? (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: `0 0 0 2px ${SS_ACCENT}` }}
        />
      ) : null}
    </div>
  );
});

export const SixSigmaRiskNode = React.memo(function SixSigmaRiskNode({
  data,
  selected,
}: LooseNodeProps<SixSigmaNodeData> & { selected?: boolean }) {
  return (
    <div
      className={cardClass}
      style={{ borderColor: SS_ACCENT, position: 'relative' }}
    >
      <div
        className={headerClass}
        style={{ backgroundColor: `${SS_ACCENT}26` }}
      >
        Risk & Defect Tracking
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">
          {data?.label ?? 'Six Sigma Risk'}
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Defect Type</div>
          <div className="font-medium">{data?.defectType ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">RPN</div>
          <div className="font-medium">{data?.riskPriorityNumber ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Defect Rate (PPM)</div>
          <div className="font-medium">{data?.defectRatePPM ?? '—'}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="bg-transparent!"
        style={{ border: `2px solid ${SS_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="bg-transparent!"
        style={{ border: `2px solid ${SS_ACCENT}` }}
      />

      {selected ? (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: `0 0 0 2px ${SS_ACCENT}` }}
        />
      ) : null}
    </div>
  );
});

export const SixSigmaMeasurementNode = React.memo(function SixSigmaMeasurementNode({
  data,
  selected,
}: LooseNodeProps<SixSigmaNodeData> & { selected?: boolean }) {
  return (
    <div
      className={cardClass}
      style={{ borderColor: SS_ACCENT, position: 'relative' }}
    >
      <div
        className={headerClass}
        style={{ backgroundColor: `${SS_ACCENT}26` }}
      >
        Measurement System
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">
          {data?.label ?? 'Measurement System'}
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">System Name</div>
          <div className="font-medium">{data?.measurementSystemName ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Gauge R&R %</div>
          <div className="font-medium">{data?.gaugeRandRPercentage ?? '—'}</div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="text-[10px]"
            style={{ borderColor: SS_ACCENT, color: SS_ACCENT }}
          >
            {data?.acceptability ?? 'acceptable'}
          </Badge>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="bg-transparent!"
        style={{ border: `2px solid ${SS_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="bg-transparent!"
        style={{ border: `2px solid ${SS_ACCENT}` }}
      />

      {selected ? (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: `0 0 0 2px ${SS_ACCENT}` }}
        />
      ) : null}
    </div>
  );
});
