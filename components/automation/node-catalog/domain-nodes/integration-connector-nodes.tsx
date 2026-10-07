'use client';

import * as React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

import { Badge } from '@/components/ui/badge';

type LooseNodeProps<T> = NodeProps<any> & { data: T };

// Integration nodes use hardcoded accent
const INT_ACCENT = '#6b7280';

export interface IntegrationNodeData {
  label?: string;
  channelName?: string;
  webhookUrl?: string;
  authType?: string;
  connectionStatus?: string;
  teamName?: string;
  messageTemplate?: string;
  retryPolicy?: string;
  emailAddress?: string;
  emailSubject?: string;
  contentType?: string;
}

const headerClass = 'px-3 py-2 text-xs font-semibold';
const cardClass =
  'rounded-lg border bg-card shadow-sm overflow-hidden transition-colors';

export const SlackConnectorNode = React.memo(function SlackConnectorNode({
  data,
  selected,
}: LooseNodeProps<IntegrationNodeData> & { selected?: boolean }) {
  return (
    <div
      className={cardClass}
      style={{ borderColor: INT_ACCENT, position: 'relative' }}
    >
      <div
        className={headerClass}
        style={{ backgroundColor: `${INT_ACCENT}26` }}
      >
        Slack Connector
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">
          {data?.label ?? 'Slack Integration'}
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Channel Name</div>
          <div className="font-medium">{data?.channelName ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Message Template</div>
          <div className="font-medium text-[9px]">{data?.messageTemplate ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Status</div>
          <div className="font-medium">{data?.connectionStatus ?? '—'}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent"
        style={{ border: `2px solid ${INT_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent"
        style={{ border: `2px solid ${INT_ACCENT}` }}
      />

      {selected ? (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: `0 0 0 2px ${INT_ACCENT}` }}
        />
      ) : null}
    </div>
  );
});

export const TeamsConnectorNode = React.memo(function TeamsConnectorNode({
  data,
  selected,
}: LooseNodeProps<IntegrationNodeData> & { selected?: boolean }) {
  return (
    <div
      className={cardClass}
      style={{ borderColor: INT_ACCENT, position: 'relative' }}
    >
      <div
        className={headerClass}
        style={{ backgroundColor: `${INT_ACCENT}26` }}
      >
        Teams Connector
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">
          {data?.label ?? 'Teams Integration'}
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Team Name</div>
          <div className="font-medium">{data?.teamName ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Webhook URL</div>
          <div className="font-medium text-[9px]">{data?.webhookUrl ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Auth Type</div>
          <div className="font-medium">{data?.authType ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Status</div>
          <div className="font-medium">{data?.connectionStatus ?? '—'}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent"
        style={{ border: `2px solid ${INT_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent"
        style={{ border: `2px solid ${INT_ACCENT}` }}
      />

      {selected ? (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: `0 0 0 2px ${INT_ACCENT}` }}
        />
      ) : null}
    </div>
  );
});

export const WebhookConnectorNode = React.memo(function WebhookConnectorNode({
  data,
  selected,
}: LooseNodeProps<IntegrationNodeData> & { selected?: boolean }) {
  return (
    <div
      className={cardClass}
      style={{ borderColor: INT_ACCENT, position: 'relative' }}
    >
      <div
        className={headerClass}
        style={{ backgroundColor: `${INT_ACCENT}26` }}
      >
        Webhook Connector
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">
          {data?.label ?? 'Webhook'}
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Webhook URL</div>
          <div className="font-medium text-[9px]">{data?.webhookUrl ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Content Type</div>
          <div className="font-medium">{data?.contentType ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Retry Policy</div>
          <div className="font-medium">{data?.retryPolicy ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Status</div>
          <div className="font-medium">{data?.connectionStatus ?? '—'}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent"
        style={{ border: `2px solid ${INT_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent"
        style={{ border: `2px solid ${INT_ACCENT}` }}
      />

      {selected ? (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: `0 0 0 2px ${INT_ACCENT}` }}
        />
      ) : null}
    </div>
  );
});

export const EmailConnectorNode = React.memo(function EmailConnectorNode({
  data,
  selected,
}: LooseNodeProps<IntegrationNodeData> & { selected?: boolean }) {
  return (
    <div
      className={cardClass}
      style={{ borderColor: INT_ACCENT, position: 'relative' }}
    >
      <div
        className={headerClass}
        style={{ backgroundColor: `${INT_ACCENT}26` }}
      >
        Email Connector
      </div>

      <div className="p-3 space-y-2 text-xs">
        <div className="font-semibold text-sm">
          {data?.label ?? 'Email'}
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Email Address</div>
          <div className="font-medium">{data?.emailAddress ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Subject</div>
          <div className="font-medium text-[9px]">{data?.emailSubject ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Content Type</div>
          <div className="font-medium">{data?.contentType ?? '—'}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground">Status</div>
          <div className="font-medium">{data?.connectionStatus ?? '—'}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent"
        style={{ border: `2px solid ${INT_ACCENT}` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent"
        style={{ border: `2px solid ${INT_ACCENT}` }}
      />

      {selected ? (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: `0 0 0 2px ${INT_ACCENT}` }}
        />
      ) : null}
    </div>
  );
});
