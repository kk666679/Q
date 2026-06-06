'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  Brain,
  Database,
  Lock,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  Agent,
  AgentHeader,
  Task,
  TaskTrigger,
  TaskContent,
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
  Terminal,
  Message,
  MessageContent,
  Checkpoint,
  Suggestions,
  Suggestion,
  Shimmer,
  Persona,
} from '@/components/ai-elements';
import {
  GlassmorphicCard,
  AnimatedCounter,
  StaggerContainer,
  StaggerItem,
} from '@/components/GlassmorphicCard';

function NeuralNetworkSVG() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 600 300"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="nn-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(59,130,246,0.9)" />
          <stop offset="55%" stopColor="rgba(16,185,129,0.7)" />
          <stop offset="100%" stopColor="rgba(168,85,247,0.7)" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* connections */}
      {[
        [60, 60, 170, 70],
        [170, 70, 280, 55],
        [280, 55, 410, 82],
        [410, 82, 540, 55],
        [60, 140, 170, 125],
        [170, 125, 280, 145],
        [280, 145, 410, 130],
        [410, 130, 540, 150],
        [60, 220, 170, 205],
        [170, 205, 280, 225],
        [280, 225, 410, 200],
        [410, 200, 540, 235],
        [60, 60, 60, 140],
        [170, 70, 170, 125],
        [280, 55, 280, 145],
        [410, 82, 410, 130],
        [540, 55, 540, 150],
      ].map(([x1, y1, x2, y2], i) => (
        <path
          key={i}
          d={`M${x1} ${y1} C ${x1 + (x2 - x1) * 0.35} ${y1} ${x1 + (x2 - x1) * 0.65} ${y2} ${x2} ${y2}`}
          fill="none"
          stroke="url(#nn-grad)"
          strokeOpacity="0.35"
          strokeWidth="1.5"
          filter="url(#glow)"
          className="nn-animated"
        />
      ))}

      {/* nodes */}
      {[
        [60, 60],
        [170, 70],
        [280, 55],
        [410, 82],
        [540, 55],
        [60, 140],
        [170, 125],
        [280, 145],
        [410, 130],
        [540, 150],
        [60, 220],
        [170, 205],
        [280, 225],
        [410, 200],
        [540, 235],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={6} fill="rgba(255,255,255,0.05)" />
          <circle cx={cx} cy={cy} r={3.2} fill="rgba(59,130,246,0.9)" className="nn-pulse" />
        </g>
      ))}

      {/* subtle grid */}
      {Array.from({ length: 10 }).map((_, i) => {
        const x = 40 + i * 55;
        return (
          <path
            key={`gx-${i}`}
            d={`M${x} 0 L${x} 300`}
            stroke="rgba(148,163,184,0.06)"
            strokeWidth="1"
            fill="none"
          />
        );
      })}
      {Array.from({ length: 6 }).map((_, i) => {
        const y = 30 + i * 45;
        return (
          <path
            key={`gy-${i}`}
            d={`M0 ${y} L600 ${y}`}
            stroke="rgba(148,163,184,0.06)"
            strokeWidth="1"
            fill="none"
          />
        );
      })}
    </svg>
  );
}

function PipelineFlow() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-1/4 h-56 w-[1px] -translate-x-1/2 bg-gradient-to-b from-cyan-400/0 via-cyan-400/50 to-cyan-400/0 blur-[0.2px]" />
      <div className="absolute left-1/3 top-1/2 h-[1px] w-64 bg-gradient-to-r from-emerald-400/0 via-emerald-400/60 to-emerald-400/0 blur-[0.2px]" />

      <div className="absolute inset-0 opacity-80">
        <svg className="h-full w-full" viewBox="0 0 600 300" preserveAspectRatio="none">
          <defs>
            <linearGradient id="pipe" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(34,211,238,0.0)" />
              <stop offset="35%" stopColor="rgba(34,211,238,0.55)" />
              <stop offset="70%" stopColor="rgba(59,130,246,0.55)" />
              <stop offset="100%" stopColor="rgba(139,92,246,0.0)" />
            </linearGradient>
          </defs>

          <path
            d="M70 220 C 170 140, 260 270, 340 150 S 500 140, 545 90"
            fill="none"
            stroke="url(#pipe)"
            strokeWidth="2"
            strokeDasharray="10 8"
            className="pipeline-dash"
          />
          <circle cx="70" cy="220" r="4" fill="rgba(34,211,238,0.9)" className="nn-pulse" />
          <circle cx="340" cy="150" r="4" fill="rgba(59,130,246,0.9)" className="nn-pulse" />
          <circle cx="545" cy="90" r="4" fill="rgba(139,92,246,0.9)" className="nn-pulse" />
        </svg>
      </div>
    </div>
  );
}

export function CloudBanner() {
  const [terminalOutput, setTerminalOutput] = React.useState<string>(
    '[boot] secure enclave handshake…\n[ok] policy checks: 12/12 passed\n[pipeline] streaming events…\n[analytics] computing p95 latency…\n'
  );

  React.useEffect(() => {
    const lines = [
      '[pipeline] ingest: datalocker://events/iso/clauses batch=48',
      '[pipeline] transform: feature-store updated (vectors=1.2M)',
      '[automation] routing: orchestrator->agents (concurrency=64)',
      '[analytics] realtime: p95=43ms throughput=1280/s',
      '[security] encryption: AES-256-GCM key-rotation successful',
      '[ai-accel] accelerator: inference offloaded to GPU stream #2',
    ];

    let i = 0;
    const t = window.setInterval(() => {
      i += 1;
      if (i > lines.length) {
        window.clearInterval(t);
        return;
      }
      setTerminalOutput((prev) => `${prev}${lines[i - 1]}\n`);
    }, 900);

    return () => window.clearInterval(t);
  }, []);

  return (
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-120px] top-[80px] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute right-[-140px] top-[20px] h-[520px] w-[520px] rounded-full bg-violet-500/10 blur-[140px]" />
        <div className="absolute bottom-[-160px] left-1/3 h-[520px] w-[520px] rounded-full bg-emerald-500/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          {/* Copy */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
              <Sparkles className="size-4 text-cyan-300" />
              <Shimmer duration={2}>AI-POWERED CLOUD • SECURE • SCALABLE</Shimmer>
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Scalable Enterprise AI Platform
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300">
              Automate workflows, accelerate inference, and generate real-time insights.
              <br />
              Deploy globally with built-in security, governance, and compliance.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
              >
                Go to Dashboard <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/agents"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:border-cyan-300/50"
              >
                Explore Agents <Bot className="size-4 text-cyan-200" />
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="flex items-center gap-2">
                  <Zap className="size-4 text-cyan-300" />
                  <p className="text-sm font-semibold text-white">AI Acceleration</p>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  GPU offload + streaming inference for low-latency automation.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="flex items-center gap-2">
                  <Shield className="size-4 text-emerald-300" />
                  <p className="text-sm font-semibold text-white">Security Gates</p>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Policy checkpoints, encryption-at-rest & secure orchestration.
                </p>
              </div>
            </div>
          </div>

          {/* Visuals */}
          <div className="lg:col-span-7">
            <div className="relative">
              <GlassmorphicCard
                className="overflow-hidden"
                gradient="from-white/10 via-cyan-500/10 to-violet-500/10"
                blur="xl"
              >
                <div className="relative h-[520px] w-full">
                  <NeuralNetworkSVG />
                  <PipelineFlow />

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.16),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(139,92,246,0.14),transparent_40%),radial-gradient(circle_at_60%_70%,rgba(16,185,129,0.12),transparent_45%)]" />
                  <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-b from-transparent via-black/0 to-black/10" />

                  <div className="absolute inset-x-0 top-0 px-5 pt-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="absolute -inset-2 rounded-full bg-cyan-500/20 blur-xl" />
                          <Persona state="thinking" variant="glint" className="relative" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Brain className="size-4 text-cyan-200" />
                            <p className="text-sm font-semibold text-white">Neural Orchestrator</p>
                          </div>
                          <p className="mt-1 text-xs text-slate-300">secure automation & realtime analytics</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <CheckpointTriggerPill />
                        <CheckpointTriggerPill label="Policy Verified" icon={<Lock className="size-3" />} />
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 px-5 pb-5 pt-24">
                    <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-12">
                      {/* Left column: agent + tasks */}
                      <div className="md:col-span-7">
                        <StaggerContainer className="space-y-4">
                          <StaggerItem>
                            <Agent className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm">
                              <AgentHeader
                                name="AI Agent Mesh"
                                model="gpt-accelerated • streaming"
                                className="border-b border-white/10"
                              />
                              <div className="p-4">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/90">
                                    <Database className="size-3.5 text-emerald-300" />
                                    Data Pipelines
                                  </span>
                                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/90">
                                    <Zap className="size-3.5 text-cyan-300" />
                                    Intelligent Automation
                                  </span>
                                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/90">
                                    <Shield className="size-3.5 text-violet-300" />
                                    Secure Execution
                                  </span>
                                </div>

                                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                                      Latency (p95)
                                    </p>
                                    <div className="mt-1 text-2xl font-black text-white">
                                      <AnimatedCounter value={43} duration={1.2} />
                                      <span className="ml-2 text-sm font-semibold text-slate-400">ms</span>
                                    </div>
                                  </div>
                                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                                      Throughput
                                    </p>
                                    <div className="mt-1 text-2xl font-black text-white">
                                      <AnimatedCounter value={1280} duration={1.2} />
                                      <span className="ml-2 text-sm font-semibold text-slate-400">/s</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="px-4 pb-4">
                                <Task defaultOpen={true} className="border border-white/10 rounded-xl bg-black/10">
                                  <TaskTrigger title="Automation Flow" className="px-3 py-2" />
                                  <TaskContent>
                                    <div className="space-y-2">
                                      <TaskItemRow label="1) Orchestrate agents" value="policy-aware routing" />
                                      <TaskItemRow label="2) Execute workflows" value="idempotent steps" />
                                      <TaskItemRow label="3) Persist evidence" value="audit-ready trails" />
                                    </div>
                                  </TaskContent>
                                </Task>

                                <Reasoning isStreaming={true} className="mt-3">
                                  <ReasoningTrigger getThinkingMessage={() => <span className="inline-flex items-center gap-2"><Brain className="size-4 text-cyan-300"/> Real-time planning</span>} />
                                  <ReasoningContent>
                                    Planning an adaptive pipeline across datalocker → transformation → compliance scoring.
                                    Enforcing encryption, least privilege, and auditability across every execution step.
                                  </ReasoningContent>
                                </Reasoning>
                              </div>
                            </Agent>
                          </StaggerItem>

                          <StaggerItem>
                            <Terminal
                              output={terminalOutput}
                              isStreaming={true}
                              className="border border-white/10 bg-black/30"
                            />
                          </StaggerItem>
                        </StaggerContainer>
                      </div>

                      {/* Right column: messages + suggestions */}
                      <div className="md:col-span-5">
                        <StaggerContainer className="space-y-4">
                          <StaggerItem>
                            <Message from="assistant" className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm p-4">
                              <div className="flex items-start justify-between gap-3">
                                <MessageContent className="text-slate-200">
                                  <div className="flex items-center gap-2">
                                    <Shield className="size-4 text-emerald-300" />
                                    <p className="text-sm font-semibold text-white">Realtime Analytics</p>
                                  </div>
                                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                                    System health is trending stable. Automation steps are completing within SLA while
                                    policy gates remain fully enforced.
                                  </p>
                                </MessageContent>
                                <div className="hidden sm:block rounded-xl border border-white/10 bg-white/5 p-3">
                                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Status</p>
                                  <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-emerald-200">
                                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                                    LIVE
                                  </p>
                                </div>
                              </div>
                            </Message>
                          </StaggerItem>

                          <StaggerItem>
                            <GlassmorphicCard gradient="from-white/10 to-white/5" blur="md" className="p-4 border border-white/10">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-white">Deploy Actions</p>
                                <p className="text-xs text-slate-400">UI preview</p>
                              </div>
                              <Suggestions className="mt-3">
                                <Suggestion suggestion="Scale agents to 128" variant="outline">
                                  Scale
                                </Suggestion>
                                <Suggestion suggestion="Enable anomaly detection" variant="outline">
                                  Detect
                                </Suggestion>
                                <Suggestion suggestion="Run data pipeline replay" variant="outline">
                                  Replay
                                </Suggestion>
                                <Suggestion suggestion="Rotate encryption keys" variant="outline">
                                  Rotate
                                </Suggestion>
                              </Suggestions>

                              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                                <Checkpoint />
                                <span>Security gates evaluated at every hop.</span>
                              </div>
                            </GlassmorphicCard>
                          </StaggerItem>
                        </StaggerContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassmorphicCard>

              {/* Glassmorphic footer metrics */}
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <MetricPill icon={<Brain className="size-4 text-cyan-200" />} title="AI Acceleration" value="GPU Stream #2" />
                <MetricPill icon={<Database className="size-4" />} title="Pipeline" value="Event batch=48" />
                <MetricPill icon={<Lock className="size-4" />} title="Security" value="Keys rotating" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-[22px] border border-white/10 bg-white/5 backdrop-blur">
          <div className="py-4">
            <div className="flex items-center gap-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <Sparkles className="size-4 text-cyan-200" />
              Scalability • Security • AI Acceleration
            </div>
            <div className="marquee relative mt-2 border-t border-white/10 px-4 py-3">
              <div className="marquee-inner flex w-max items-center gap-6 text-sm text-slate-300">
                {[
                  'Auto-scaling inference',
                  'Least-privilege orchestration',
                  'Streaming analytics',
                  'Datalocker → pipeline → scoring',
                  'Audit-ready evidence trails',
                  'GPU offload for real-time agents',
                  'Continuous policy checkpointing',
                  'Encrypted storage & transit',
                ].map((t) => (
                  <span key={t} className="inline-flex items-center gap-2 whitespace-nowrap">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400/80" />
                    {t}
                  </span>
                ))}
              </div>
              <div className="marquee-inner flex w-max items-center gap-6 text-sm text-slate-300">
                {[
                  'Auto-scaling inference',
                  'Least-privilege orchestration',
                  'Streaming analytics',
                  'Datalocker → pipeline → scoring',
                  'Audit-ready evidence trails',
                  'GPU offload for real-time agents',
                  'Continuous policy checkpointing',
                  'Encrypted storage & transit',
                ].map((t) => (
                  <span key={`${t}-2`} className="inline-flex items-center gap-2 whitespace-nowrap">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400/80" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TaskItemRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <p className="text-[12px] text-slate-200/90">{label}</p>
      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] font-semibold text-cyan-200/90">
        {value}
      </div>
    </div>
  );
}

function MetricPill({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
      <div className="flex items-center gap-2">
        <span className="text-cyan-200">{icon}</span>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">{title}</p>
      </div>
      <p className="mt-2 text-sm font-bold text-white">{value}</p>
    </div>
  );
}

function CheckpointTriggerPill({ label = 'Security Check', icon }: { label?: string; icon?: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-100">
      {icon ?? <Lock className="size-3 text-emerald-300" />}
      <span className="font-semibold text-white/90">{label}</span>
    </div>
  );
}

export default CloudBanner;