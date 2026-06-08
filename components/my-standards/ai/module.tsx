'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AiModule() {
  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">AI Module</CardTitle>
          <Badge variant="secondary">Registry-ready</Badge>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        This module is wired to the MY Standards workflow runtime registry in future phases.
      </CardContent>
    </Card>
  );
}

