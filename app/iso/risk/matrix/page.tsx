'use client';

import { RiskMatrixView } from '@/components/iso';

export default function RiskMatrixPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Risk Matrix</h1>
        <p className="text-gray-600 mt-2">
          Interactive 5x5 risk matrix for visualizing and managing risks
        </p>
      </div>
      <RiskMatrixView />
    </div>
  );
}

