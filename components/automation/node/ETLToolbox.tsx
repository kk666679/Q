'use client';
import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ETL_NODE_REGISTRY, ETL_CATEGORIES } from './etl-node-registry';
import type { ETLNodeDef, ETLNodeCategory } from '../shared/types';
import { Search } from 'lucide-react';

interface Props { onDragStart?: (def: ETLNodeDef) => void; }

export function ETLToolbox({ onDragStart }: Props) {
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState<Set<ETLNodeCategory>>(
    new Set(['import','preparation','transform'])
  );

  const filtered = query
    ? ETL_NODE_REGISTRY.filter(n =>
        n.label.toLowerCase().includes(query.toLowerCase()) ||
        n.description.toLowerCase().includes(query.toLowerCase()))
    : ETL_NODE_REGISTRY;

  const toggle = (cat: ETLNodeCategory) =>
    setOpen(prev => { const s = new Set(prev); s.has(cat) ? s.delete(cat) : s.add(cat); return s; });

  const grouped = ETL_CATEGORIES.map(cat => ({
    ...cat,
    nodes: filtered.filter(n => n.category === cat.id),
  })).filter(g => g.nodes.length > 0);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search nodes…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {grouped.map(group => (
            <div key={group.id}>
              <button
                onClick={() => toggle(group.id as ETLNodeCategory)}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
              >
                <span style={{ color: group.color }}>{group.label}</span>
                <Badge variant="outline" className="text-[10px] h-4 px-1">{group.nodes.length}</Badge>
              </button>
              {(open.has(group.id as ETLNodeCategory) || query) && (
                <div className="space-y-0.5 pl-1 pb-1">
                  {group.nodes.map(node => (
                    <ETLNodeItem key={node.id} node={node} color={group.color} onDragStart={onDragStart} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function ETLNodeItem({ node, color, onDragStart }: { node: ETLNodeDef; color: string; onDragStart?: (d: ETLNodeDef) => void }) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart?.(node)}
      className="flex items-start gap-2 px-2 py-1.5 rounded cursor-grab hover:bg-muted/60 active:cursor-grabbing group"
    >
      <div className="mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold"
        style={{ background: color }}>
        {node.label[0]}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium leading-tight truncate">{node.label}</p>
        <p className="text-[10px] text-muted-foreground leading-tight line-clamp-1">{node.description}</p>
      </div>
    </div>
  );
}
