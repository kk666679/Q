'use client';

import { ComplianceScore } from '@/components/iso';

export default function ComplianceScorePage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Compliance Scoring</h1>
        <p className="text-gray-600 mt-2">
          Calculate and track compliance scores for ISO standards
        </p>
      </div>
      <ComplianceScore />
    </div>
  );
}

