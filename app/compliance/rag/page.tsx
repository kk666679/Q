'use client'

import { trpc } from '@/lib/sdk';
import { GlassmorphicCard } from '@/components/GlassmorphicCard';

export default function RAGDemoPage() {
  const ragQuery = trpc.compliance.ragQuery.useQuery(
    { query: 'Assess ISO 9001 clause 8.5.1 production control risks' },
    { enabled: true }
  );

  if (ragQuery.isLoading) return <div>Loading RAG analysis...</div>;
  if (ragQuery.error) return <div>Error: {ragQuery.error.message}</div>;

  const data = ragQuery.data;

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold">RAG Compliance Analysis</h1>
      
      <GlassmorphicCard title="Summary">
        <p>{data.summary}</p>
      </GlassmorphicCard>

      {data.risks.length > 0 && (
        <GlassmorphicCard title="Risks">
          {data.risks.map((risk, i) => (
            <div key={i} className="mb-4 p-4 border rounded-lg">
              <h3 className="font-semibold">{risk.title} ({risk.severity})</h3>
              <p>{risk.description}</p>
              <p><strong>Mitigation:</strong> {risk.mitigation}</p>
            </div>
          ))}
        </GlassmorphicCard>
      )}

      {data.compliance.length > 0 && (
        <GlassmorphicCard title="Compliance Status">
          <div className="space-y-2">
            {data.compliance.map((comp, i) => (
              <div key={i}>
                <span className="font-semibold">{comp.standard} {comp.clause}: </span>
                <span className={`px-2 py-1 rounded text-sm ${comp.status === 'compliant' ? 'bg-green-100' : comp.status === 'partial' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                  {comp.status}
                </span>
              </div>
            ))}
          </div>
        </GlassmorphicCard>
      )}

      {data.recommendations.length > 0 && (
        <GlassmorphicCard title="Recommendations">
          <ul className="space-y-2">
            {data.recommendations.map((rec, i) => (
              <li key={i} className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <strong>{rec.title}</strong> - {rec.description}
              </li>
            ))}
          </ul>
        </GlassmorphicCard>
      )}

      <pre className="p-4 bg-gray-900 text-green-400 rounded-lg overflow-auto max-h-96">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

