'use client';
import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Settings2, ChevronRight } from 'lucide-react';
import { ETL_NODE_REGISTRY } from './etl-node-registry';
import type { ETLNodeDef } from '../shared/types';

// Field-level enums for common configSchema keys
const FIELD_OPTIONS: Record<string, string[]> = {
  format:   ['csv','json','parquet','excel','ndjson'],
  method:   ['GET','POST','PUT','PATCH'],
  joinType: ['inner','left','right','full'],
  dataset:  ['sales_sample','hr_sample','inventory_sample','compliance_sample'],
};

const TEXTAREA_FIELDS = new Set(['sql','code','expression','schema']);

interface NodeInspectorProps {
  nodeId: string | null;
  nodeType: string | null;       // maps to ETLNodeDef.id
  nodeLabel: string | null;
  nodeCategory: string | null;
  config: Record<string, string>;
  onConfigChange: (key: string, value: string) => void;
  onLabelChange: (label: string) => void;
  rowCount?: number | null;
}

export function NodeInspector({
  nodeId, nodeType, nodeLabel, nodeCategory,
  config, onConfigChange, onLabelChange, rowCount,
}: NodeInspectorProps) {

  const def: ETLNodeDef | undefined = ETL_NODE_REGISTRY.find(n => n.id === nodeType);

  if (!nodeId || !def) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center gap-2">
        <Settings2 className="h-8 w-8 text-muted-foreground/40" />
        <p className="text-xs text-muted-foreground">Select a node to configure it</p>
      </div>
    );
  }

  const schemaKeys = Object.keys(def.configSchema);

  return (
    <ScrollArea className="flex-1">
      <div className="p-3 space-y-4">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wide">
            <ChevronRight className="h-3 w-3" />
            <span>{def.category}</span>
          </div>
          <Badge variant="outline" className="text-[10px]">{def.id}</Badge>
          <p className="text-[10px] text-muted-foreground leading-snug">{def.description}</p>
          {rowCount != null && (
            <div className="flex items-center gap-1.5 mt-1">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-medium text-primary">{rowCount.toLocaleString()} rows</span>
            </div>
          )}
        </div>

        {/* Label */}
        <div className="space-y-1">
          <Label className="text-xs">Label</Label>
          <Input
            value={nodeLabel ?? ''}
            onChange={e => onLabelChange(e.target.value)}
            className="h-7 text-xs"
          />
        </div>

        {/* Dynamic config fields */}
        {schemaKeys.length > 0 && (
          <div className="space-y-3">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Configuration</p>
            {schemaKeys.map(key => {
              const opts = FIELD_OPTIONS[key];
              const isTextarea = TEXTAREA_FIELDS.has(key);
              return (
                <div key={key} className="space-y-1">
                  <Label className="text-xs capitalize">{key.replace(/_/g,' ')}</Label>
                  {opts ? (
                    <Select value={config[key] ?? ''} onValueChange={v => onConfigChange(key, v)}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder={`Select ${key}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {opts.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : isTextarea ? (
                    <Textarea
                      value={config[key] ?? ''}
                      onChange={e => onConfigChange(key, e.target.value)}
                      className="text-xs font-mono min-h-[72px] resize-none"
                      placeholder={`Enter ${key}…`}
                    />
                  ) : (
                    <Input
                      value={config[key] ?? ''}
                      onChange={e => onConfigChange(key, e.target.value)}
                      className="h-7 text-xs"
                      placeholder={`Enter ${key}…`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* IO info */}
        <div className="rounded border p-2 space-y-1 bg-muted/20">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">I/O</p>
          <p className="text-[10px] text-muted-foreground">Inputs: <span className="font-medium text-foreground">{def.inputs}</span></p>
          <p className="text-[10px] text-muted-foreground">Outputs: <span className="font-medium text-foreground">{def.outputs}</span></p>
        </div>
      </div>
    </ScrollArea>
  );
}
