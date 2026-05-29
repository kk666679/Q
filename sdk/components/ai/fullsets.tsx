"use client";

import { useState } from "react";
import { Bot, FileWarning, ShieldCheck, Sparkles, Wand2 } from "lucide-react";
import { AIMetricCard } from "@/sdk/components/ai/aimetric-card";
import { AIInsightCard } from "@/sdk/components/ai/aiinsight-card";
import { AIActionCard } from "@/sdk/components/ai/aiaction-card";
import { Conversation, ConversationContent, ConversationEmptyState } from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Reasoning, ReasoningTrigger, ReasoningContent } from "@/components/ai-elements/reasoning";
import { Tool, ToolHeader, ToolContent, ToolInput, ToolOutput } from "@/components/ai-elements/tool";
import { PromptInput, PromptInputBody, PromptInputTextarea, PromptInputFooter, PromptInputSubmit } from "@/components/ai-elements/prompt-input";

export function AIExecutiveCockpitFullset() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Executive Copilot Fullset</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <AIMetricCard title="Model Accuracy" value="98.6%" icon={Sparkles} trend={{ value: 3.2, label: "vs last week" }} description="Validated on regulated workflow tasks" />
        <AIMetricCard title="Active Guardrails" value="24" icon={ShieldCheck} trend={{ value: 12.0, label: "new policies" }} description="Runtime and preflight safety checks" />
        <AIMetricCard title="Open Risks" value={6} icon={FileWarning} trend={{ value: -14.1, label: "risk burndown" }} description="Flagged by AI compliance monitor" />
      </div>
      <AIInsightCard
        title="High-impact optimization"
        insight="Reasoning-first routing reduced average response latency by 28% in internal benchmarks."
        type="success"
        recommendation="Enable tiered model fallback + response streaming for all assistant surfaces."
        tags={["latency", "routing", "streaming"]}
      />
    </section>
  );
}

export function AIWorkflowOpsFullset() {
  const [prompt, setPrompt] = useState("");

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Workflow Ops Fullset</h2>
      <AIActionCard
        title="Run policy remediation"
        description="Auto-generate CAPA actions and assign owners from latest audit findings."
        status="in-progress"
        priority="high"
        icon={<Bot className="h-5 w-5" />}
        actions={[
          { label: "Execute", onClick: () => setPrompt("Execute remediation plan for findings > severity 7."), icon: <Wand2 className="h-4 w-4" /> },
          { label: "Review", onClick: () => setPrompt("Review unresolved CAPA records by process owner."), variant: "outline" },
        ]}
      />

      <Conversation className="rounded-xl border p-3">
        <ConversationContent>
          <Message from="assistant">
            <MessageContent>
              I prepared a structured remediation draft with dependencies and ETA projections.
            </MessageContent>
          </Message>
          <Reasoning isStreaming={false}>
            <ReasoningTrigger />
            <ReasoningContent>
              Prioritized controls by residual risk and cross-mapped with ISO 9001 clauses.
            </ReasoningContent>
          </Reasoning>
          <Tool defaultOpen>
            <ToolHeader type="tool-invocation" state="output-available" />
            <ToolContent>
              <ToolInput input={{ tool: "risk_clustering", threshold: 0.72 }} />
              <ToolOutput output={{ impactedAreas: ["Calibration", "Supplier QA"], estimatedSavings: "$48k/quarter" }} errorText={undefined} />
            </ToolContent>
          </Tool>
        </ConversationContent>
        <ConversationEmptyState />
      </Conversation>

      <PromptInput onSubmit={() => {}} className="border">
        <PromptInputBody>
          <PromptInputTextarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ask AI to generate actions, checks, or executive updates..." />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputSubmit disabled={!prompt.trim()} status="ready" />
        </PromptInputFooter>
      </PromptInput>
    </section>
  );
}
