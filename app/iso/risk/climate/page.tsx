'use client';

import { RiskClimate } from '@/components/iso';

export default function RiskClimatePage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Climate Risk Analysis</h1>
        <p className="text-gray-600 mt-2">
          Analyze climate-related risks and adaptation measures for ISO 14001 compliance
        </p>
      </div>
      <RiskClimate />
    </div>
  );
}

