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

import type { NodeDefinition, CatalogCategory } from './nodeLibrary';
import { nodeCatalog } from './nodeLibrary';

export interface NodeCatalogProps {
  draggable?: boolean;
  onNodeSelect?: (node: NodeDefinition) => void;
  className?: string;
}

type ActiveTab = 'all' | CatalogCategory;

const TAB_LABELS: Record<ActiveTab, string> = {
  all: 'All',
  'core-workflow': 'Core',
  'my-standards': 'MS',
  'islamic-manufacturing': 'Halal',
  gmp: 'GMP',
  'lean-six-sigma': 'LSS',
  'human-resources': 'HR',
  'six-sigma': 'Six Sigma',
  iso: 'ISO',
  qms: 'QMS',
  integrations: 'Integrations',
};

const ALL_TABS: ActiveTab[] = [
  'all',
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

function matchesSearch(def: NodeDefinition, term: string): boolean {
  const t = term.trim().toLowerCase();
  if (!t) return true;
  return (
    def.label.toLowerCase().includes(t) ||
    def.description.toLowerCase().includes(t)
  );
}

function filterCatalog(
  catalog: NodeDefinition[],
  searchTerm: string,
  activeTab: ActiveTab
): NodeDefinition[] {
  return catalog.filter((def) => {
    if (activeTab !== 'all' && def.category !== activeTab) return false;
    return matchesSearch(def, searchTerm);
  });
}

function NodeTile({
  def,
  draggable,
  onDragStart,
  onClick,
}: {
  def: NodeDefinition;
  draggable: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick: () => void;
}) {
  const Icon = def.icon as unknown as LucideIcon;
  return (
    <Card
      className="cursor-pointer hover:bg-muted/30 transition-colors"
      draggable={draggable}
      onDragStart={draggable ? onDragStart : undefined}
      onClick={onClick}
    >
      <CardContent className="p-2 space-y-1">
        <div className="flex items-start gap-2">
          <div className="mt-0.5 w-6 h-6 flex items-center justify-center rounded bg-muted/30 shrink-0">
            {Icon ? <Icon className="w-4 h-4" /> : null}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
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
      event.dataTransfer.setData(
        'application/automation-node',
        JSON.stringify({ type: def.type, defaultData: def.defaultData })
      );
      event.dataTransfer.effectAllowed = 'move';
    },
    []
  );

  // Visible tabs: always show 'all'; show category tabs only if they have entries
  const visibleTabs = React.useMemo<ActiveTab[]>(() => {
    const categoryCounts = new Map<CatalogCategory, number>();
    for (const def of nodeCatalog) {
      categoryCounts.set(def.category, (categoryCounts.get(def.category) ?? 0) + 1);
    }
    return ALL_TABS.filter(
      (t) => t === 'all' || (categoryCounts.get(t as CatalogCategory) ?? 0) > 0
    );
  }, []);

  const filteredCatalog = React.useMemo(
    () => filterCatalog(nodeCatalog, searchTerm, activeTab),
    [searchTerm, activeTab]
  );

  return (
    <div className={className ?? 'h-full flex flex-col'}>
      <div className="p-3 border-b bg-muted/30 shrink-0">
        <Input
          placeholder="Search nodes…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-8 text-xs"
        />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as ActiveTab)}
        className="flex flex-col flex-1 min-h-0"
      >
        <TabsList className="h-auto flex-wrap gap-0.5 p-1 bg-muted/10 shrink-0 justify-start">
          {visibleTabs.map((t) => (
            <TabsTrigger key={t} value={t} className="text-[10px] px-2 py-1 h-6">
              {TAB_LABELS[t]}
            </TabsTrigger>
          ))}
        </TabsList>

        {visibleTabs.map((t) => (
          <TabsContent key={t} value={t} className="flex-1 min-h-0 mt-0">
            <ScrollArea className="h-full">
              <div className="p-2 space-y-1.5">
                {filteredCatalog.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No nodes found.</p>
                ) : (
                  filteredCatalog.map((def) => (
                    <NodeTile
                      key={def.id}
                      def={def}
                      draggable={draggable}
                      onDragStart={handleDragStart(def)}
                      onClick={() => onNodeSelect?.(def)}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
