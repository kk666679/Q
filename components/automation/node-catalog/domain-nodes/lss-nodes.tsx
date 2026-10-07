'use client';

import * as React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

import { Badge } from '@/components/ui/badge';
import { LSS_ACCENT } from '@/components/Lean-six-sigma/constants';

type LooseNodeProps<T> = NodeProps<any> & { data: T };

export interface LSSNodeData {
  label?: string;
  wasteCategory?: string;
  wasteSeverity?: string;
  leadTime?: string;
  cycleTime?: string;
  taktTime?: string;
  processName?: string;
  controlLimitStatus?: 'in-control' | 'out-of-control' | 'warning';
  spcRuleViolations?: string;
}

const headerClass = 'px-3 py-2 text-xs font-semibold';
const cardClass =
  'rounded-lg border bg-card shadow-sm overflow-hidden transition-colors';

const DOWNTIME_CATEGORIES = [
  'Defects',
  'Overproduction',
  'Waiting',
  'Non-utilised talent',
  'Transportation',
  'Inventory',
  'Motion',
  'Extra-processing',
];

export const LSSWasteAnalyzerNode = React.memo(function LSSWasteAnalyzerNode({
  data,
  selected,
}: LooseNodeProps<LSSNodeData> & { selected?: boolean }) {
  const [wasteInput, setWasteInput] = React.useState(data?.wasteCategory ?? '');
  const wasteMatches = wasteInput
    ? DOWNTIME_CATEGORIES.filter((w) =>
        w.toLowerCase().includes(wasteInput.toLowerCase())
      )
    : [];

  return (
    <div
      className={cardClass}
      style={{ borderColor: LSS_ACCENT, position: 'relative' }}
    >
      <div
        className={headerClass}
        style={{ backgroundColor: `${LSS_ACCENT}26` }}
      >
        Waste Analysis
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">
          {data?.label ?? 'Waste Analyzer'}
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Waste Category (DOWNTIME)</div>
          <input
            value={wasteInput}
            onChange={(e) => setWasteInput(e.target.value)}
            className="w-full mt-1 text-xs border rounded px-2 py-1"
            placeholder="Select waste…"
          />
          {wasteMatches.length > 0 ? (
            <div className="mt-2 border rounded overflow-hidden max-h-24 overflow-y-auto">
              {wasteMatches.map((w) => (
                <button
                  key={w}
                  type="button"
                  className="block w-full text-left text-xs px-2 py-1 hover:bg-muted"
                  onClick={() => setWasteInput(w)}
                >
                  {w}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Severity</div>
          <div className="font-medium">{data?.wasteSeverity ?? '—'}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent"
        style={{ border: `2px solid ${LSS_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent"
        style={{ border: `2px solid ${LSS_ACCENT}` }}
      />

      {selected ? (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: `0 0 0 2px ${LSS_ACCENT}` }}
        />
      ) : null}
    </div>
  );
});

export const LSSValueStreamNode = React.memo(function LSSValueStreamNode({
  data,
  selected,
}: LooseNodeProps<LSSNodeData> & { selected?: boolean }) {
  return (
    <div
      className={cardClass}
      style={{ borderColor: LSS_ACCENT, position: 'relative' }}
    >
      <div
        className={headerClass}
        style={{ backgroundColor: `${LSS_ACCENT}26` }}
      >
        Value Stream Map
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">
          {data?.label ?? 'Value Stream'}
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Lead Time</div>
          <div className="font-medium">{data?.leadTime ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Cycle Time</div>
          <div className="font-medium">{data?.cycleTime ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Takt Time</div>
          <div className="font-medium">{data?.taktTime ?? '—'}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent"
        style={{ border: `2px solid ${LSS_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent"
        style={{ border: `2px solid ${LSS_ACCENT}` }}
      />

      {selected ? (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: `0 0 0 2px ${LSS_ACCENT}` }}
        />
      ) : null}
    </div>
  );
});

export const LSSControlChartNode = React.memo(function LSSControlChartNode({
  data,
  selected,
}: LooseNodeProps<LSSNodeData> & { selected?: boolean }) {
  return (
    <div
      className={cardClass}
      style={{ borderColor: LSS_ACCENT, position: 'relative' }}
    >
      <div
        className={headerClass}
        style={{ backgroundColor: `${LSS_ACCENT}26` }}
      >
        Control Chart / SPC
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">
          {data?.label ?? 'Control Chart'}
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Process Name</div>
          <div className="font-medium">{data?.processName ?? '—'}</div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="text-[10px]"
            style={{ borderColor: LSS_ACCENT, color: LSS_ACCENT }}
          >
            {data?.controlLimitStatus ?? 'in-control'}
          </Badge>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">SPC Rule Violations</div>
          <div className="font-medium">{data?.spcRuleViolations ?? '—'}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent"
        style={{ border: `2px solid ${LSS_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent"
        style={{ border: `2px solid ${LSS_ACCENT}` }}
      />

      {selected ? (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: `0 0 0 2px ${LSS_ACCENT}` }}
        />
      ) : null}
    </div>
  );
});
