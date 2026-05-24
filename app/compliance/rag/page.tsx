'use client'

import { trpc } from '@/lib/sdk';
import { GlassmorphicCard } from '@/components/GlassmorphicCard';

export default function RAGDemoPage() {
  const checkQuery = trpc.compliance.check.useMutation();

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold">Compliance Analysis</h1>

      <GlassmorphicCard><h2 className="mb-3 text-lg font-semibold">Run analysis</h2>
        <button
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
          onClick={() =>
            checkQuery.mutate({
              standard: 'ISO9001',
              requirements: ['Clause 8.5.1 production and service provision controls'],
            })
          }
          disabled={checkQuery.isPending}
        >
          {checkQuery.isPending ? 'Analyzing...' : 'Analyze now'}
        </button>
      </GlassmorphicCard>

      {checkQuery.error && (
        <GlassmorphicCard><h2 className="mb-3 text-lg font-semibold">Error</h2>
          <p>{checkQuery.error.message}</p>
        </GlassmorphicCard>
      )}

      <GlassmorphicCard><h2 className="mb-3 text-lg font-semibold">Result</h2>
        <pre className="overflow-auto rounded-lg bg-black/70 p-4 text-xs text-green-300">
          {JSON.stringify(checkQuery.data ?? [], null, 2)}
        </pre>
      </GlassmorphicCard>
    </div>
  );
}
