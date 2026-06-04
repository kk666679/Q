'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Download, GitBranch, Cpu, Plug, FileCode2, LayoutTemplate } from 'lucide-react';
import type { MarketplaceItem } from '../shared/types';

const TYPE_ICONS = {
  workflow: GitBranch, agent: Cpu, connector: Plug, node: FileCode2, template: LayoutTemplate,
} as const;

const PRICING_COLOR = {
  free:'bg-emerald-500/10 text-emerald-700 border-emerald-200',
  paid:'bg-blue-500/10 text-blue-700 border-blue-200',
  freemium:'bg-amber-500/10 text-amber-700 border-amber-200',
} as const;

interface Props { item: MarketplaceItem; onInstall?: (id: string) => void; }

export function MarketplaceCard({ item, onInstall }: Props) {
  const Icon = TYPE_ICONS[item.type];
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-primary/10 p-1.5"><Icon className="h-4 w-4 text-primary" /></div>
            <div>
              <CardTitle className="text-sm leading-tight">{item.name}</CardTitle>
              <p className="text-[10px] text-muted-foreground">by {item.author} · v{item.version}</p>
            </div>
          </div>
          <Badge variant="outline" className={`text-[10px] ${PRICING_COLOR[item.pricing]}`}>{item.pricing}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
        <div className="flex gap-1 flex-wrap">
          {item.tags.map(t => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-amber-400 text-amber-400"/>{item.rating}</span>
            <span className="flex items-center gap-0.5"><Download className="h-3 w-3"/>{item.downloads.toLocaleString()}</span>
          </div>
          <Button size="sm" className="h-6 text-[10px] px-2" onClick={() => onInstall?.(item.id)}>Install</Button>
        </div>
      </CardContent>
    </Card>
  );
}
