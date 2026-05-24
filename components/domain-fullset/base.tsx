"use client";
import { AIMetricCard } from '@/sdk/components/ai/aimetric-card';
import { AIInsightCard } from '@/sdk/components/ai/aiinsight-card';
import { AIActionCard } from '@/sdk/components/ai/aiaction-card';
import { Conversation, ConversationContent } from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
import { Reasoning, ReasoningTrigger, ReasoningContent } from '@/components/ai-elements/reasoning';
import type { DomainConfig } from './types';

export function DomainDashboard({ config }: { config: DomainConfig }) {
  return <section className="space-y-4"><h2 className="text-xl font-semibold">{config.name} Command Center</h2><div className="grid md:grid-cols-3 gap-3">{config.kpis.map((k)=> <AIMetricCard key={k.label} title={k.label} value={k.value} trend={{ value:k.delta,label:'WoW'}} />)}</div></section>
}
export function DomainAI({ config }: { config: DomainConfig }) {
  return <section className="space-y-3"><AIInsightCard title={`${config.name} AI Insight`} insight="Cross-domain anomaly clustering detected latent risk propagation." recommendation="Run orchestrated verification workflow with traceability evidence." tags={[config.key,'ai-native','risk']} /><AIActionCard title="Execute AI Orchestration" description="Trigger guardrailed multi-agent remediation plan" actions={[{label:'Run',onClick:()=>undefined},{label:'Preview',variant:'outline',onClick:()=>undefined}]} /></section>
}
export function DomainFeed({ config }: { config: DomainConfig }) {
  return <Conversation className="rounded-xl border p-3 bg-background/60 backdrop-blur"><ConversationContent><Message from="assistant"><MessageContent>{config.name} monitoring active. {config.alerts.length} alerts require triage.</MessageContent></Message><Reasoning isStreaming={false}><ReasoningTrigger/><ReasoningContent>Prioritized by severity, recurrence, and control impact.</ReasoningContent></Reasoning></ConversationContent></Conversation>
}
