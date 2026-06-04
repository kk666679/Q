'use client';
import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Plus, Settings } from 'lucide-react';
import type { ConnectorDef } from '../shared/types';

interface Props {
  connector: ConnectorDef;
  connected?: boolean;
  onConnect?: (id: string) => void;
  onConfigure?: (id: string) => void;
}

export function ConnectorCard({ connector: c, connected = false, onConnect, onConfigure }: Props) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{c.icon}</span>
            <div>
              <p className="text-sm font-semibold">{c.name}</p>
              <p className="text-[10px] text-muted-foreground capitalize">{c.category} · {c.authType}</p>
            </div>
          </div>
          {connected
            ? <Badge className="text-[10px] bg-emerald-500/10 text-emerald-700 border-emerald-200 gap-1 flex-shrink-0">
                <CheckCircle2 className="h-2.5 w-2.5"/>Connected
              </Badge>
            : <Button size="sm" className="h-6 text-[10px] flex-shrink-0 gap-1" onClick={() => onConnect?.(c.id)}>
                <Plus className="h-3 w-3"/>Connect
              </Button>
          }
        </div>
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{c.description}</p>
        {connected && (
          <Button size="sm" variant="ghost" className="h-6 text-[10px] gap-1 mt-2 w-full" onClick={() => onConfigure?.(c.id)}>
            <Settings className="h-3 w-3"/>Configure
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
