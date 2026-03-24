'use client';

import { ComplianceCheck } from '@/components/iso';

export default function ComplianceCheckPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Compliance Check</h1>
        <p className="text-gray-600 mt-2">
          Check compliance against ISO standards clause by clause
        </p>
      </div>
      <ComplianceCheck />
    </div>
  );
}

