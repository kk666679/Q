"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AIInsightCard } from "@/sdk/components/ai/aiinsight-card";
import { sampleEvents } from "@/components/automation/shared/mock";

export default function QueueDashboard() {
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader><CardTitle>QueueDashboard</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <AIInsightCard title="AI Recommendation" insight="Use guarded retries + HITL for high-severity deviations." type="info" tags={["aaos","compliance"]} />
        <div className="space-y-2">{sampleEvents.map(e => <div key={e.id} className="flex items-center justify-between rounded-lg border p-2"><span className="text-sm">{e.type}</span><Badge variant="outline">{e.severity}</Badge></div>)}</div>
      </CardContent>
    </Card>
  );
}
