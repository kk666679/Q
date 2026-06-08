'use client';

import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

import type { NodeDefinition } from './nodeLibrary';
import { nodeCatalog } from './nodeLibrary';


export interface NodeCatalogProps {
  draggable?: boolean;
  onNodeSelect?: (node: NodeDefinition) => void;
  className?: string;
}

type ActiveTab =
  | 'all'
  | 'core-workflow'
  | 'my-standards'
  | 'islamic-manufacturing'
  | 'gmp'
  | 'lean-six-sigma'
  | 'human-resources'
  | 'six-sigma'
  | 'iso'
  | 'qms'
  | 'integrations';

function matchesSearch(def: NodeDefinition, term: string): boolean {
  const t = term.trim().toLowerCase();
  if (!t) return true;
  return (
    def.label.toLowerCase().includes(t) ||
    def.description.toLowerCase().includes(t)
  );
}

export function NodeCatalog({
  draggable = false,
  onNodeSelect,
  className,
}: NodeCatalogProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<ActiveTab>('all');

  const handleDragStart = React.useCallback(
    (def: NodeDefinition) => (event: React.DragEvent<HTMLDivElement>) => {
      if (!draggable) return;
      event.dataTransfer.setData(
        'application/automation-node',
        JSON.stringify({ type: def.type, defaultData: def.defaultData })
      );
      event.dataTransfer.effectAllowed = 'move';
    },
    [draggable]
  );


  const filteredCatalog = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return nodeCatalog.filter((def) => {
      if (activeTab !== 'all' && def.category !== activeTab) return false;
      if (!term) return true;
      return matchesSearch(def, term);
    });
  }, [searchTerm, activeTab]);



  const categories: ActiveTab[] = [
    'core-workflow',
    'my-standards',
    'islamic-manufacturing',
    'gmp',
    'lean-six-sigma',
    'human-resources',
    'six-sigma',
    'iso',
    'qms',
    'integrations',
  ];

  return (
    <div className={className ?? 'h-full'}>
      <div className="p-3 border-b bg-muted/30">
        <Input
          placeholder="Search nodes…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-8 text-xs"
        />
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ActiveTab)}>
        <TabsList className="h-8 p-1 bg-muted/10">
          <TabsTrigger value="all" className="text-[11px]">All</TabsTrigger>
          {categories.map((c) => (
            <TabsTrigger key={c} value={c} className="text-[11px]">{c}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab}>
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="p-2 space-y-2">
              {filteredCatalog.map((def) => {
                const Icon = def.icon as unknown as LucideIcon;
                return (
<Card
                    key={def.id}
                    className="cursor-pointer hover:bg-muted/30 transition-colors"
                    draggable={draggable}
                    onDragStart={draggable ? handleDragStart(def) : undefined}
                    onClick={() => onNodeSelect?.(def)}
                  >
                    <CardContent className="p-2 space-y-1">
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 w-6 h-6 flex items-center justify-center rounded bg-muted/30">
                          {Icon ? <Icon className="w-4 h-4" /> : null}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-semibold truncate">{def.label}</p>
                            <Badge variant="secondary" className="text-[10px]">{def.category}</Badge>
                          </div>
                          <p className="text-[10px] text-muted-foreground line-clamp-2">{def.description}</p>
                        </div>
                        <div
                          className="w-2.5 h-2.5 rounded-full mt-2 shrink-0"
                          style={{ backgroundColor: def.color }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

