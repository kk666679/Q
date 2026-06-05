'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight, Shield, Zap, Globe, Brain,
  Activity, Database, Lock, Server, ChevronRight,
  LayoutDashboard, Bot, Wand2, TrendingUp,
  CheckCircle2, AlertCircle, Clock,
} from 'lucide-react';

/* ── ai-elements ─────────────────────────────────────────────────────────── */
import { Shimmer }                       from '@/components/ai-elements/shimmer';
import { Terminal, TerminalHeader, TerminalTitle, TerminalContent, TerminalStatus, TerminalActions, TerminalCopyButton } from '@/components/ai-elements/terminal';
import { Agent, AgentHeader, AgentContent, AgentInstructions } from '@/components/ai-elements/agent';
import { Task, TaskTrigger, TaskContent, TaskItem } from '@/components/ai-elements/task';
import { Reasoning, ReasoningTrigger, ReasoningContent } from '@/components/ai-elements/reasoning';
import { Checkpoint } from '@/components/ai-elements/checkpoint';
import { Suggestions, Suggestion } from '@/components/ai-elements/suggestion';
import { Message, MessageContent } from '@/components/ai-elements/message';

/* ── Animated counter ─────────────────────────────────────────────────────── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const dur = 1800;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(Math.floor(ease * to));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [to]);
  return <>{val.toLocaleString()}{suffix}</>;
}

/* ── Neural network SVG (pure CSS-animated) ──────────────────────────────── */
const NODES = [
  { cx: 60,  cy: 100 }, { cx: 60,  cy: 200 }, { cx: 60,  cy: 300 },
  { cx: 180, cy: 60  }, { cx: 180, cy: 150 }, { cx: 180, cy: 250 }, { cx: 180, cy: 340 },
  { cx: 300, cy: 110 }, { cx: 300, cy: 220 }, { cx: 300, cy: 320 },
  { cx: 420, cy: 80  }, { cx: 420, cy: 200 }, { cx: 420, cy: 320 },
  { cx: 520, cy: 140 }, { cx: 520, cy: 270 },
];
const EDGES = [
  [0,3],[0,4],[1,4],[1,5],[2,5],[2,6],
  [3,7],[3,8],[4,7],[4,8],[4,9],[5,8],[5,9],[6,9],
  [7,10],[7,11],[8,11],[8,12],[9,12],
  [10,13],[11,13],[11,14],[12,14],
];

function NeuralSVG() {
  return (
    <svg viewBox="0 0 580 400" className="w-full h-full" aria-hidden>
      <defs>
        <radialGradient id="nglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
        </radialGradient>
        <filter id="blur4">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <rect width="580" height="400" fill="url(#nglow)" rx="16" />
      {EDGES.map(([a, b], i) => {
        const A = NODES[a]!, B = NODES[b]!;
        return (
          <line
            key={i}
            x1={A.cx} y1={A.cy} x2={B.cx} y2={B.cy}
            stroke="#06b6d4" strokeOpacity="0.18" strokeWidth="1.5"
          />
        );
      })}
      {NODES.map((n, i) => (
        <g key={i}>
          <circle cx={n.cx} cy={n.cy} r="12" fill="#06b6d4" opacity="0.07" filter="url(#blur4)" />
          <circle cx={n.cx} cy={n.cy} r="5" fill="#0e7490" stroke="#22d3ee" strokeWidth="1.5">
            <animate attributeName="r" values="4;6;4" dur={`${1.6 + (i % 5) * 0.4}s`} repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.6;1;0.6" dur={`${1.6 + (i % 5) * 0.4}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      {/* Travelling signal dots */}
      {EDGES.slice(0, 8).map(([a, b], i) => {
        const A = NODES[a]!, B = NODES[b]!;
        return (
          <circle key={`sig-${i}`} r="3" fill="#67e8f9" opacity="0.9">
            <animateMotion
              dur={`${1.2 + i * 0.3}s`}
              repeatCount="indefinite"
              path={`M${A.cx},${A.cy} L${B.cx},${B.cy}`}
              begin={`${i * 0.25}s`}
            />
          </circle>
        );
      })}
    </svg>
  );
}

/* ── Pipeline flow card ───────────────────────────────────────────────────── */
const PIPELINE = [
  { label: 'Ingest',    icon: Database, color: 'text-violet-400', bg: 'bg-violet-500/10', status: 'output-available' as const },
  { label: 'Transform', icon: Zap,      color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   status: 'input-available' as const },
  { label: 'Analyse',   icon: Brain,    color: 'text-sky-400',    bg: 'bg-sky-500/10',    status: 'input-streaming' as const },
  { label: 'Deploy',    icon: Globe,    color: 'text-emerald-400',bg: 'bg-emerald-500/10',status: 'output-available' as const },
];

const stateIcons: Record<string, JSX.Element> = {
  'output-available': <CheckCircle2 size={11} className="text-emerald-400" />,
  'input-available':  <Clock        size={11} className="text-amber-400 animate-pulse" />,
  'input-streaming':  <AlertCircle  size={11} className="text-sky-400 animate-pulse" />,
};

/* ── Metrics strip ───────────────────────────────────────────────────────── */
const METRICS = [
  { label: 'Uptime',       value: 99.99,  suffix: '%', icon: Activity, color: 'text-emerald-400' },
  { label: 'AI Agents',    value: 128,    suffix: '+',  icon: Bot,     color: 'text-cyan-400' },
  { label: 'API Requests', value: 4_200,  suffix: '/s', icon: Zap,     color: 'text-violet-400' },
  { label: 'Data Secured', value: 12,     suffix: 'PB', icon: Lock,    color: 'text-sky-400' },
];

/* ── Trust badges ────────────────────────────────────────────────────────── */
const TRUST = ['ISO 27001', 'SOC 2 Type II', 'GDPR', 'CSA STAR', 'HIPAA'];

/* ── Terminal output lines ───────────────────────────────────────────────── */
const TERMINAL_LINES = [
  '\x1b[32m✓\x1b[0m  AI orchestration engine online',
  '\x1b[36m→\x1b[0m  Loading 128 intelligent agents...',
  '\x1b[32m✓\x1b[0m  ISO 9001 compliance engine active',
  '\x1b[36m→\x1b[0m  Neural inference cluster: 99.99% uptime',
  '\x1b[33m⚡\x1b[0m  Climate risk engine initialised (ISO 14001 AMD.1:2024)',
  '\x1b[32m✓\x1b[0m  Multi-agent coordinator ready',
  '\x1b[36m→\x1b[0m  Pinecone vector store connected (12 PB indexed)',
  '\x1b[32m✓\x1b[0m  \x1b[1mMyQMS platform ready\x1b[0m — all systems nominal',
];

/* ════════════════════════════════════════════════════════════════════════════
   HERO BANNER
   ════════════════════════════════════════════════════════════════════════════ */
export function HeroBanner() {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [terminalDone, setTerminalDone] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const lineIndex = useRef(0);

  /* stream terminal lines */
  useEffect(() => {
    const id = setInterval(() => {
      if (lineIndex.current < TERMINAL_LINES.length) {
        setTerminalLines((p) => [...p, TERMINAL_LINES[lineIndex.current]!]);
        lineIndex.current++;
      } else {
        setTerminalDone(true);
        clearInterval(id);
      }
    }, 520);
    return () => clearInterval(id);
  }, []);

  /* cycle pipeline active step */
  useEffect(() => {
    const id = setInterval(() => setActiveStep((s) => (s + 1) % PIPELINE.length), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden bg-slate-950 py-24 md:py-32">

      {/* ── Animated gradient mesh ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 left-1/3 h-[700px] w-[700px] rounded-full bg-cyan-600/10 blur-[130px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 right-1/4 h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[130px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.div
          className="absolute top-1/2 left-0 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-sky-600/8 blur-[100px]"
          animate={{ x: [0, 60, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />
        {/* grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(#06b6d4 1px,transparent 1px),linear-gradient(90deg,#06b6d4 1px,transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        {/* ══ TOP BADGE ══════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/8 px-4 py-1.5 text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
            </span>
            <Shimmer className="text-cyan-300 text-sm" duration={2.5}>
              AI-Powered Cloud Intelligence — Now Live
            </Shimmer>
          </div>
        </motion.div>

        {/* ══ HEADLINE ═══════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 text-center"
        >
          <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-white md:text-7xl lg:text-8xl">
            The Intelligence<br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-400 bg-clip-text text-transparent">
              Cloud Platform
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Enterprise-grade AI orchestration with real-time compliance, multi-agent automation,
            and end-to-end data pipelines — secured to ISO 27001 &amp; SOC 2.
          </p>
        </motion.div>

        {/* ══ CTA ROW ════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-6 flex flex-wrap justify-center gap-3"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 px-7 py-3.5 font-semibold text-slate-950 shadow-[0_0_32px_rgba(6,182,212,.4)] transition hover:shadow-[0_0_48px_rgba(6,182,212,.6)] hover:scale-[1.03]"
          >
            <LayoutDashboard size={17} />
            Launch Dashboard
            <ArrowRight size={17} />
          </Link>
          <Link
            href="/agents"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-3.5 font-semibold text-white backdrop-blur transition hover:border-cyan-500/40 hover:bg-white/8"
          >
            <Bot size={17} />
            Explore AI Agents
          </Link>
        </motion.div>

        {/* ══ SUGGESTIONS (ai-element) ═══════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-16 flex justify-center"
        >
          <Suggestions>
            {['ISO 9001 Compliance', 'Audit Automation', 'Climate Risk', 'Multi-Agent AI', 'Process Designer'].map((s) => (
              <Suggestion
                key={s}
                suggestion={s}
                className="border-white/10 bg-white/5 text-slate-300 hover:border-cyan-500/40 hover:text-white rounded-full text-xs"
              />
            ))}
          </Suggestions>
        </motion.div>

        {/* ══ MAIN VISUAL GRID ═══════════════════════════════════════════════ */}
        <div className="grid gap-4 lg:grid-cols-12">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-4 lg:col-span-4">

            {/* Agent card (ai-element) */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden">
                <Agent className="border-none rounded-none bg-transparent">
                  <AgentHeader
                    name="ISO 9001 Quality Agent"
                    model="GPT-4o"
                    className="border-b border-white/8 bg-white/[0.03]"
                  />
                  <AgentContent>
                    <AgentInstructions>
                      Orchestrating compliance scan across 28 ISO 9001:2015 clauses. Real-time gap analysis with corrective action recommendations enabled.
                    </AgentInstructions>

                    {/* Task (ai-element) */}
                    <Task defaultOpen>
                      <TaskTrigger title="Running compliance assessment…" />
                      <TaskContent>
                        <TaskItem>→ Clause 4.1 context analysis <span className="ml-2 text-emerald-400 text-xs">✓ 97%</span></TaskItem>
                        <TaskItem>→ Risk-based thinking review <span className="ml-2 text-cyan-400 text-xs">⚡ live</span></TaskItem>
                        <TaskItem>→ Internal audit checklist generation</TaskItem>
                      </TaskContent>
                    </Task>

                    {/* Reasoning (ai-element) */}
                    <Reasoning isStreaming={false} defaultOpen={false}>
                      <ReasoningTrigger className="text-xs text-slate-500 hover:text-slate-300" />
                      <ReasoningContent>
                        {`Analysing clause 6.1 risk matrix against 14 identified hazards. 
Cross-referencing ISO 14001 climate risk amendments (AMD.1:2024). 
Generating CAPA recommendations for 2 critical non-conformances.`}
                      </ReasoningContent>
                    </Reasoning>

                    {/* Message (ai-element) */}
                    <Message from="assistant">
                      <MessageContent className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-4 py-3 text-xs text-emerald-300">
                        Compliance score: <strong>91/100</strong> — 2 minor findings. CAPA auto-generated.
                      </MessageContent>
                    </Message>
                  </AgentContent>
                </Agent>
              </div>
            </motion.div>

            {/* Checkpoint strip (ai-element) */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Audit Trail</p>
              <div className="space-y-2">
                {[
                  { label: 'Policy review completed', time: '09:14', ok: true },
                  { label: 'CAPA-042 closed',          time: '09:31', ok: true },
                  { label: 'Supplier audit scheduled', time: '10:05', ok: null },
                ].map((c) => (
                  <div key={c.label} className="flex items-center justify-between text-xs">
                    <Checkpoint className="gap-2 text-slate-400 border-none">
                      <span className={c.ok === true ? 'text-emerald-400' : c.ok === false ? 'text-red-400' : 'text-amber-400'}>
                        {c.ok === true ? '✓' : c.ok === false ? '✗' : '○'}
                      </span>
                      {c.label}
                    </Checkpoint>
                    <span className="text-slate-600">{c.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── CENTER COLUMN (neural network) ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative lg:col-span-4"
          >
            <div className="relative h-full min-h-[380px] rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-6 backdrop-blur-xl overflow-hidden">
              {/* glow ring */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl border border-cyan-500/10" />
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[60px]" />

              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-cyan-500/70">Neural Inference Network</p>
                <div className="w-full flex-1">
                  <NeuralSVG />
                </div>
                {/* live badge */}
                <div className="flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
                  <span className="h-1.5 w-1.5 animate-ping rounded-full bg-cyan-400" />
                  128 agents · 4 200 req/s
                </div>
              </div>

              {/* floating stat chips */}
              <div className="absolute right-3 top-12 rounded-xl border border-violet-500/25 bg-violet-500/10 px-2.5 py-1.5 text-xs backdrop-blur">
                <span className="text-violet-300 font-mono font-bold">99.99%</span>
                <p className="text-[10px] text-slate-500">Uptime SLA</p>
              </div>
              <div className="absolute left-3 bottom-16 rounded-xl border border-sky-500/25 bg-sky-500/10 px-2.5 py-1.5 text-xs backdrop-blur">
                <span className="text-sky-300 font-mono font-bold">12 PB</span>
                <p className="text-[10px] text-slate-500">Indexed data</p>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-col gap-4 lg:col-span-4">

            {/* Terminal (ai-element) */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="rounded-2xl overflow-hidden"
            >
              <Terminal
                output={terminalLines.join('\n')}
                isStreaming={!terminalDone}
                className="border-white/10 bg-slate-950/90 rounded-2xl text-xs"
              >
                <TerminalHeader className="border-white/10">
                  <TerminalTitle className="text-slate-400">
                    <span className="flex gap-1.5 mr-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                    </span>
                    myqms — bootstrap
                  </TerminalTitle>
                  <TerminalActions>
                    {!terminalDone && <TerminalStatus />}
                    <TerminalCopyButton />
                  </TerminalActions>
                </TerminalHeader>
                <TerminalContent className="max-h-44 text-xs leading-6" />
              </Terminal>
            </motion.div>

            {/* Data pipeline (ai-elements: Task + custom) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.55 }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">AI Data Pipeline</p>
              <div className="flex items-center gap-1">
                {PIPELINE.map((step, i) => {
                  const Icon = step.icon;
                  const isActive = i === activeStep;
                  return (
                    <div key={step.label} className="flex flex-1 items-center">
                      <motion.div
                        animate={{ scale: isActive ? 1.08 : 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className={`flex-1 rounded-xl border p-2 text-center transition-all ${
                          isActive
                            ? 'border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_16px_rgba(6,182,212,.2)]'
                            : 'border-white/8 bg-white/[0.02]'
                        }`}
                      >
                        <div className={`mb-1 flex justify-center ${isActive ? step.color : 'text-slate-600'}`}>
                          <Icon size={14} />
                        </div>
                        <p className={`text-[10px] font-medium ${isActive ? 'text-white' : 'text-slate-600'}`}>
                          {step.label}
                        </p>
                        <div className="mt-1 flex justify-center">
                          {stateIcons[isActive ? step.status : 'output-available']}
                        </div>
                      </motion.div>
                      {i < PIPELINE.length - 1 && (
                        <div className="relative mx-0.5 flex h-px w-4 flex-shrink-0 items-center">
                          <div className="h-px w-full bg-white/10" />
                          <AnimatePresence>
                            {isActive && i === activeStep && (
                              <motion.div
                                key="pulse"
                                initial={{ scaleX: 0, opacity: 0 }}
                                animate={{ scaleX: 1, opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 h-px origin-left bg-gradient-to-r from-cyan-400 to-transparent"
                              />
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Security / infra badges */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-2"
            >
              {[
                { icon: Lock,   label: 'Zero-Trust',    sub: 'Security',   color: 'text-violet-400', border: 'border-violet-500/20', bg: 'bg-violet-500/8' },
                { icon: Server, label: 'Multi-Region',  sub: 'Infra',      color: 'text-cyan-400',   border: 'border-cyan-500/20',   bg: 'bg-cyan-500/8' },
                { icon: Shield, label: 'ISO 27001',     sub: 'Certified',  color: 'text-sky-400',    border: 'border-sky-500/20',    bg: 'bg-sky-500/8' },
              ].map((b) => (
                <div key={b.label} className={`rounded-xl border ${b.border} ${b.bg} p-3 text-center backdrop-blur`}>
                  <b.icon size={16} className={`${b.color} mx-auto mb-1`} />
                  <p className="text-[11px] font-semibold text-white leading-tight">{b.label}</p>
                  <p className="text-[9px] text-slate-500">{b.sub}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ══ METRICS STRIP ══════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="group rounded-2xl border border-white/8 bg-white/[0.03] p-5 text-center backdrop-blur-xl transition hover:border-white/15 hover:bg-white/[0.05]"
            >
              <m.icon size={18} className={`${m.color} mx-auto mb-2`} />
              <p className="text-2xl font-black tabular-nums text-white">
                <Counter to={m.value} suffix={m.suffix} />
              </p>
              <p className="mt-1 text-xs text-slate-500">{m.label}</p>
            </div>
          ))}
        </motion.div>

        {/* ══ TRUST BADGES ═══════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <span className="text-xs text-slate-600">Compliant with</span>
          {TRUST.map((t) => (
            <div
              key={t}
              className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-slate-400"
            >
              {t}
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
