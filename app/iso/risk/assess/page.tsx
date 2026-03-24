'use client';

import { RiskAssess } from '@/components/iso';

export default function RiskAssessPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Risk Assessment</h1>
        <p className="text-gray-600 mt-2">
          Assess and evaluate risks based on likelihood and consequence
        </p>
      </div>
      <RiskAssess />
    </div>
  );
}

