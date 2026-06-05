'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import {
  ArrowRight, ShieldCheck, Brain, ClipboardCheck,
  FileText, GitBranch, AlertTriangle, ChevronDown,
  LayoutDashboard, Factory, Building2, Shield,
  Bot, Wand2, BookOpen, BarChart3, Cpu, HeartPulse,
  Leaf, Landmark, FlaskConical, Zap, Database,
  ClipboardList, Search, BarChart2, Settings, Flag,
  FolderKanban, ChevronRight,
} from 'lucide-react';

import CloudBanner from '@/components/ai-enterprise/cloud-banner';

/* ─── Nav structure ─────────────────────────────────────────── */
const NAV = [
  {
    label: 'Platform',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard',      href: '/dashboard',         desc: 'Live KPIs, compliance trends & activity' },
      { icon: Bot,             label: 'AI Agents',       href: '/agents',            desc: '10+ specialized quality intelligence agents' },
      { icon: Wand2,           label: 'QMS Generator',   href: '/generator',         desc: 'AI-powered document & procedure builder' },
      { icon: GitBranch,       label: 'Flow Designer',   href: '/flow-process',      desc: 'Visual process mapping with AI assist' },
      { icon: FileText,        label: 'Documents',       href: '/documents',         desc: 'Versioned, controlled document management' },
      { icon: FolderKanban,    label: 'Projects',        href: '/projects',          desc: 'QMS implementation project tracking' },
    ],
  },
  {
    label: 'ISO Tools',
    items: [
      { icon: ShieldCheck,     label: 'Compliance Check', href: '/iso/compliance/check',  desc: 'ISO 9001 / 14001 / 45001 real-time scoring' },
      { icon: Search,          label: 'Gap Analysis',     href: '/iso/compliance/gapAnalysis', desc: 'Identify and close compliance gaps' },
      { icon: ClipboardList,   label: 'Generate Audit',   href: '/iso/audit/generate',   desc: 'AI-generated audit checklists' },
      { icon: ClipboardCheck,  label: 'Create Audit Plan',href: '/iso/audit/createPlan', desc: 'Schedule and plan internal audits' },
      { icon: AlertTriangle,   label: 'Risk Management',  href: '/iso/risk',             desc: 'Risk matrix, climate & CAPA engine' },
      { icon: Database,        label: 'Compliance RAG',   href: '/compliance/rag',       desc: 'Vector-search over ISO clause knowledge base' },
    ],
  },
  {
    label: 'Industries',
    items: [
      { icon: Factory,    label: 'Manufacturing',    href: '/industry/manufacturing' },
      { icon: Cpu,        label: 'Electronics',      href: '/industry/electronics' },
      { icon: HeartPulse, label: 'Medical Devices',  href: '/industry/medical' },
      { icon: Leaf,       label: 'Halal / Agro',     href: '/industry/halal' },
      { icon: Landmark,   label: 'Financial',        href: '/industry/financial' },
      { icon: Building2,  label: 'Construction',     href: '/industry/construction' },
      { icon: Shield,     label: 'Insurance',        href: '/industry/insurance' },
    ],
  },
  {
    label: 'Automation',
    items: [
      { icon: Zap,        label: 'AAOS',             href: '/automation/aaos' },
      { icon: Wand2,      label: 'Designer',         href: '/automation/designer' },
      { icon: BarChart2,  label: 'Analytics',        href: '/automation/analytics' },
      { icon: BookOpen,   label: 'Catalog',          href: '/automation/catalog' },
      { icon: Database,   label: 'Data Locker',      href: '/automation/datalocker' },
      { icon: Settings,   label: 'Operations',       href: '/automation/operations' },
      { icon: Flag,       label: 'MY Regulatory Hub',href: '/automation/malaysia' },
    ],
  },
  {
    label: 'Standards',
    items: [
      { icon: BookOpen,      label: 'Malaysian Standards', href: '/standards' },
      { icon: FlaskConical,  label: 'ISO Hub',             href: '/iso' },
      { icon: BarChart3,     label: 'Compliance Score',    href: '/iso/compliance/score' },
      { icon: Brain,         label: 'AI Components',       href: '/ai-components' },
    ],
  },
];

const features = [
  { icon: ShieldCheck,    title: 'ISO Compliance',    href: '/iso/compliance/check', desc: 'Real-time compliance tracking for ISO 9001, 14001, 45001' },
  { icon: ClipboardCheck, title: 'Audit Management',  href: '/iso/audit/generate',   desc: 'Automated audit checklists and intelligent reporting' },
  { icon: Brain,          title: 'AI Agents',         href: '/agents',               desc: '10+ specialized AI experts for quality operations' },
  { icon: FileText,       title: 'Document Control',  href: '/documents',            desc: 'Versioned and controlled documentation management' },
  { icon: GitBranch,      title: 'Process Designer',  href: '/flow-process',         desc: 'Visual workflow and process mapping with AI assist' },
  { icon: AlertTriangle,  title: 'Risk Management',   href: '/iso/risk',             desc: 'Continuous risk monitoring and climate risk engine' },
];

const industries = [
  { icon: Factory,    title: 'Manufacturing',  href: '/industry/manufacturing' },
  { icon: Cpu,        title: 'Electronics',    href: '/industry/electronics' },
  { icon: Building2,  title: 'Construction',   href: '/industry/construction' },
  { icon: Shield,     title: 'Insurance',      href: '/industry/insurance' },
  { icon: BookOpen,   title: 'My Standards',   href: '/standards' },
  { icon: BarChart3,  title: 'Analytics',      href: '/automation/analytics' },
];

/* ─── Dropdown component ────────────────────────────────────── */
function NavDropdown({ label, items }: { label: string; items: typeof NAV[0]['items'] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const hasDesc = items.some((i) => 'desc' in i);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
      >
        {label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          className={`absolute left-0 top-full z-50 mt-2 rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-xl ${
            hasDesc ? 'w-80' : 'w-52'
          }`}
        >
          <div className="p-2">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-start gap-3 rounded-xl p-3 transition hover:bg-white/5"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">
                    <Icon size={15} className="text-cyan-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1 text-sm font-medium text-white">
                      {item.label}
                      <ChevronRight size={12} className="opacity-0 transition group-hover:opacity-100" />
                    </div>
                    {'desc' in item && item.desc && (
                      <p className="mt-0.5 text-xs text-slate-400 leading-snug">{item.desc}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Mobile menu ───────────────────────────────────────────── */
function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-2 text-slate-300 hover:bg-white/5 hover:text-white"
        aria-label="Toggle menu"
      >
        <div className="space-y-1.5">
          <span className={`block h-0.5 w-5 bg-current transition-all ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-5 bg-current transition-all ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-5 bg-current transition-all ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </div>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-[57px] z-50 border-b border-white/10 bg-slate-900/98 backdrop-blur-xl">
          <div className="max-h-[70vh] overflow-y-auto p-4 space-y-4">
            {NAV.map((group) => (
              <div key={group.label}>
                <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {group.label}
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 rounded-xl p-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                      >
                        <Icon size={14} className="text-cyan-400 shrink-0" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[180px]" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-sky-500/10 blur-[180px]" />
      </div>

      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <nav className="relative z-30 flex items-center justify-between border-b border-white/5 px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/MyQMS.png"
            alt="MyQMS"
            width={36}
            height={36}
            priority
            className="rounded-xl object-contain"
          />
          <span className="text-base font-bold text-white tracking-tight">MyQMS</span>
        </Link>

        {/* Desktop dropdowns */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV.map((group) => (
            <NavDropdown key={group.label} label={group.label} items={group.items} />
          ))}
        </div>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="hidden items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 sm:inline-flex"
          >
            <LayoutDashboard size={15} />
            Dashboard
          </Link>
          <MobileMenu />
        </div>
      </nav>

      {/* ── HERO (AI Cloud Enterprise Banner) ───────────────────── */}
      <div className="relative z-10">
        {/* Keep navbar sticky spacing consistent */}
        <div className="-mt-6" />
        {/**/}
        <CloudBanner />
        <div className="px-6">
          <div className="mx-auto max-w-6xl flex justify-center">
            <Link href="#features" aria-label="Jump to features">
              <ChevronDown className="animate-bounce text-slate-500" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section id="features" className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-bold text-white">Powerful Features</h2>
            <p className="mt-3 text-slate-400">Enterprise-grade quality management — click to explore</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-3xl border border-cyan-500/20 bg-white/[0.03] p-8 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-500/40 hover:bg-white/[0.06]"
                >
                  <div className="mb-5 inline-flex rounded-2xl bg-cyan-500/10 p-4">
                    <Icon className="text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{item.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs text-cyan-400 opacity-0 transition group-hover:opacity-100">
                    Open <ArrowRight size={12} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ─────────────────────────────────────────── */}
      <section className="relative z-10 px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-white">Industry Modules</h2>
            <p className="mt-3 text-slate-400">Specialized tools per sector</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {industries.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center transition hover:border-cyan-500/30 hover:bg-white/[0.06]"
                >
                  <Icon className="size-6 text-cyan-400" />
                  <span className="text-sm font-medium text-white">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="relative z-10 px-6 pb-24">
        <div className="mx-auto max-w-5xl rounded-[40px] border border-cyan-500/20 bg-white/[0.03] p-14 text-center backdrop-blur">
          <h2 className="text-4xl font-black text-white">Ready for Intelligent Quality?</h2>
          <p className="mt-4 text-slate-400">Accelerate compliance, automate audits, and transform operations.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-8 py-4 font-semibold text-slate-950 transition hover:scale-[1.03]"
            >
              <LayoutDashboard size={18} />
              Open Dashboard
            </Link>
            <Link
              href="/automation/designer"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 px-8 py-4 text-white transition hover:border-cyan-400"
            >
              <Wand2 size={18} />
              Automation Designer
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
