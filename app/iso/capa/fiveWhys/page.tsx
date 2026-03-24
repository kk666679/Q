'use client';

import { FiveWhys } from '@/components/iso';

export default function FiveWhysPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">5 Whys Analysis</h1>
        <p className="text-gray-600 mt-2">
          Perform root cause analysis using the 5 Whys technique
        </p>
      </div>
      <FiveWhys />
    </div>
  );
}

