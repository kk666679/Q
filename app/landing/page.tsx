import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Brain,
  ClipboardCheck,
  FileText,
  GitBranch,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "ISO Compliance",
    desc: "Automate compliance tracking for ISO 9001, 14001, 45001",
  },
  {
    icon: ClipboardCheck,
    title: "Audit Management",
    desc: "Automated audits and intelligent reporting",
  },
  {
    icon: Brain,
    title: "AI Agents",
    desc: "Specialized AI experts for quality operations",
  },
  {
    icon: FileText,
    title: "Document Control",
    desc: "Versioned and controlled documentation",
  },
  {
    icon: GitBranch,
    title: "Process Designer",
    desc: "Visual process mapping and optimization",
  },
  {
    icon: AlertTriangle,
    title: "Risk Management",
    desc: "Continuous risk monitoring and mitigation",
  },
];

export default function Page() {
  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[180px]" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-sky-500/10 blur-[180px]" />
      </div>

      {/* HERO */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6">

        <div className="max-w-6xl text-center">

          {/* LOGO */}
          <div className="mb-10 flex justify-center">
            <div className="rounded-[32px] border border-cyan-500/30 bg-white/5 backdrop-blur-xl p-6 shadow-[0_0_80px_rgba(6,182,212,.2)]">

              <Image
                src="/myqms-logo.png"
                alt="MyQMS Logo"
                width={220}
                height={220}
                priority
                className="object-contain"
              />

            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight">
            MyQMS
          </h1>

          <p className="mt-6 text-2xl text-cyan-300">
            AI-Powered Integrated Management System
          </p>

          <p className="mt-8 max-w-3xl mx-auto text-slate-400 text-lg">
            Multi-Agent Intelligence • ISO Compliance • Audit Automation •
            Process Excellence • Intelligent Quality Operations
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <Link
              href="/generator"
              className="rounded-2xl bg-cyan-500 px-8 py-4 font-semibold hover:scale-[1.03] transition inline-flex items-center gap-2"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/docs"
              className="rounded-2xl border border-slate-700 px-8 py-4 hover:border-cyan-400 transition inline-flex items-center justify-center"
            >
              Learn More
            </Link>

          </div>

          <div className="mt-24 flex justify-center">
            <Link href="#features" aria-label="Jump to features">
              <ChevronDown className="animate-bounce text-slate-500" />
            </Link>
          </div>

        </div>
      </section>

      {/* FEATURES */}

      <section id="features" className="relative z-10 px-6 py-28">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">

            <h2 className="text-5xl font-bold">
              Powerful Features
            </h2>

            <p className="mt-4 text-slate-400">
              Enterprise-grade quality management
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {features.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="
                    rounded-3xl
                    border
                    border-cyan-500/20
                    bg-white/[0.03]
                    p-8
                    backdrop-blur-xl
                    hover:-translate-y-2
                    transition
                  "
                >
                  <div className="mb-6 inline-flex rounded-2xl bg-cyan-500/10 p-4">
                    <Icon className="text-cyan-400" />
                  </div>

                  <h3 className="text-xl font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-slate-400">
                    {item.desc}
                  </p>
                </div>
              );
            })}

          </div>
        </div>

      </section>

      {/* CTA */}

      <section className="px-6 pb-24">

        <div
          className="
            max-w-5xl
            mx-auto
            rounded-[40px]
            border
            border-cyan-500/20
            bg-white/[0.03]
            p-14
            text-center
            backdrop-blur
          "
        >
          <h2 className="text-5xl font-black">
            Ready for Intelligent Quality?
          </h2>

          <p className="mt-6 text-slate-400">
            Accelerate compliance, automate audits, and transform operations.
          </p>

          <button className="mt-10 rounded-2xl bg-cyan-500 px-8 py-4 font-semibold">
            Start Free Trial
          </button>

        </div>

      </section>

    </main>
  );
}
