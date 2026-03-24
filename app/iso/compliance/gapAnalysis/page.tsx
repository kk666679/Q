'use client';

import { GapAnalysis } from '@/components/iso';

export default function GapAnalysisPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gap Analysis</h1>
        <p className="text-gray-600 mt-2">
          Identify gaps between current compliance and target requirements
        </p>
      </div>
      <GapAnalysis />
    </div>
  );
}

