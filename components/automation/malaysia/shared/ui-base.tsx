"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AIMetricCard } from "@/sdk/components/ai/aimetric-card";
import { AIInsightCard } from "@/sdk/components/ai/aiinsight-card";
import { Conversation, ConversationContent } from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { regulatorySignals, filings } from "./mock-data";

export function MalaysiaComplianceShell({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <header>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </header>
      <div className="grid gap-3 md:grid-cols-3">
        <AIMetricCard title="Compliance Score" value="93.8%" trend={{ value: 2.1, label: "MoM" }} />
        <AIMetricCard title="Open Filings" value={filings.filter(f=>f.status!=="submitted").length} trend={{ value: -5.4, label: "risk burndown" }} />
        <AIMetricCard title="Critical Signals" value={regulatorySignals.filter(s=>s.severity==="critical").length} trend={{ value: 11.7, label: "new alerts" }} />
      </div>
      <AIInsightCard title="Regulatory AI Insight" insight="Cross-agency dependency detected between LHDN e-Invoice mappings and SSM filing evidence trails." recommendation="Run automated schema-impact simulation and generate filing-ready diffs for finance + legal." tags={["malaysia","regulatory-intelligence"]} />
      <div className="grid gap-3 md:grid-cols-2">
        <Card><CardHeader><CardTitle>Signals</CardTitle></CardHeader><CardContent className="space-y-2">{regulatorySignals.map(s=><div key={s.id} className="flex items-center justify-between rounded border p-2"><span className="text-sm">{s.title}</span><Badge variant="outline">{s.severity}</Badge></div>)}</CardContent></Card>
        <Conversation className="rounded-lg border p-3"><ConversationContent><Message from="assistant"><MessageContent>AI Copilot recommends escalating overdue JAKIM renewal and syncing NPRA GMP evidence package.</MessageContent></Message></ConversationContent></Conversation>
      </div>
    </section>
  );
}
