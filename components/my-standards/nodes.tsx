'use client';

import * as React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

type LooseNodeProps<T> = NodeProps<any> & { data: T };


import { Badge } from '@/components/ui/badge';
import { MS_ACCENT } from './constants';

export type MSNodeData = {
  label?: string;
  standardCode?: string;
  status?: 'compliant' | 'non-compliant' | 'pending';
  auditType?: string;
  scheduledDate?: string;
  certificateNumber?: string;
  expiryDate?: string;
  certificationBody?: string;
  scopeDescription?: string;
};


const headerClass = 'px-3 py-2 text-xs font-semibold';
const cardClass =
  'rounded-lg border bg-card shadow-sm overflow-hidden transition-colors';

function selectionRing(selected?: boolean, accent = MS_ACCENT) {
  if (!selected) return 'border-border';
  return `border-[${accent}] ring-2 ring-[${accent}]`;
}

export const MSComplianceCheckNode = React.memo(function MSComplianceCheckNode({
  data,
  selected,
}: LooseNodeProps<MSNodeData> & { selected?: boolean }) {

  const label = data?.label ?? 'MS Compliance Check';

  return (
    <div className={cardClass} style={{ borderColor: MS_ACCENT }}>
      <div
        className={headerClass}
        style={{ backgroundColor: `${MS_ACCENT}26` /* ~15% opacity */ }}
      >
        Compliance Check
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">{label}</div>

        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="text-[10px]"
            style={{
              borderColor: MS_ACCENT,
              color: MS_ACCENT,
            }}
          >
            {data?.status ?? 'pending'}
          </Badge>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Standard code</div>
          <div className="font-medium">{data?.standardCode ?? '—'}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent"
        style={{ border: `2px solid ${MS_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent"
        style={{ border: `2px solid ${MS_ACCENT}` }}
      />

      {selected ? (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: `0 0 0 2px ${MS_ACCENT}` }}
        />
      ) : null}
    </div>
  );
});

export const MSAuditNode = React.memo(function MSAuditNode({
  data,
}: LooseNodeProps<MSNodeData>) {

  return (
    <div className={cardClass} style={{ borderColor: MS_ACCENT }}>
      <div
        className={headerClass}
        style={{ backgroundColor: `${MS_ACCENT}26` }}
      >
        Audit
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">{data?.label ?? 'MS Audit'}</div>

        <div>
          <div className="text-[10px] text-muted-foreground">Audit type</div>
          <div className="font-medium">{data?.auditType ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Scheduled date</div>
          <div className="font-medium">{data?.scheduledDate ?? '—'}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent"
        style={{ border: `2px solid ${MS_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent"
        style={{ border: `2px solid ${MS_ACCENT}` }}
      />
    </div>
  );
});

export const MSCertificationNode = React.memo(function MSCertificationNode({
  data,
}: LooseNodeProps<MSNodeData>) {

  return (
    <div className={cardClass} style={{ borderColor: MS_ACCENT }}>
      <div
        className={headerClass}
        style={{ backgroundColor: `${MS_ACCENT}26` }}
      >
        Certification
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">{data?.label ?? 'MS Certification'}</div>

        <div>
          <div className="text-[10px] text-muted-foreground">Certificate number</div>
          <div className="font-medium">{data?.certificateNumber ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Expiry date</div>
          <div className="font-medium">{data?.expiryDate ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Certification body</div>
          <div className="font-medium">{data?.certificationBody ?? '—'}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent"
        style={{ border: `2px solid ${MS_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent"
        style={{ border: `2px solid ${MS_ACCENT}` }}
      />
    </div>
  );
});

const MS_STANDARD_CODES = [
  'MS 1500:2019',
  'MS 1900:2020',
  'MS 2200:2018',
  'MS 2300:2021',
  'MS 2400:2017',
];

export const MSStandardsBrowserNode = React.memo(function MSStandardsBrowserNode({
  data,
}: LooseNodeProps<MSNodeData>) {

  const [input, setInput] = React.useState<string>(data?.standardCode ?? '');

  const matches = React.useMemo(() => {
    const t = input.trim().toLowerCase();
    if (!t) return [];
    return MS_STANDARD_CODES.filter((c) => c.toLowerCase().includes(t));
  }, [input]);

  return (
    <div className={cardClass} style={{ borderColor: MS_ACCENT, position: 'relative' }}>
      <div
        className={headerClass}
        style={{ backgroundColor: `${MS_ACCENT}26` }}
      >
        Standards Browser
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">{data?.label ?? 'MS Standards Browser'}</div>

        <div>
          <div className="text-[10px] text-muted-foreground">Standard code</div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full mt-1 text-xs border rounded px-2 py-1"
            placeholder="Type code…"
          />
          {matches.length > 0 ? (
            <div className="mt-2 border rounded overflow-hidden">
              {matches.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="block w-full text-left text-xs px-2 py-1 hover:bg-muted"
                  onClick={() => setInput(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Scope description</div>
          <div className="font-medium">{data?.scopeDescription ?? '—'}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent"
        style={{ border: `2px solid ${MS_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent"
        style={{ border: `2px solid ${MS_ACCENT}` }}
      />
    </div>
  );
});

