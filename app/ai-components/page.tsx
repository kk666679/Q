import { AIExecutiveCockpitFullset, AIWorkflowOpsFullset } from "@/sdk/components/ai/fullsets";

export default function AIComponentsPage() {
  return (
    <main className="container mx-auto space-y-8 px-6 py-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">AI Component Fullsets (April 2026 style)</h1>
        <p className="text-muted-foreground">
          Production-ready composed patterns built with <code>@/components/ai-elements</code> + <code>@/sdk/components/ai</code>.
        </p>
      </header>

      <AIExecutiveCockpitFullset />
      <AIWorkflowOpsFullset />
    </main>
  );
}
