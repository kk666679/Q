'use client';

import { Fishbone } from '@/components/iso';

export default function FishbonePage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Fishbone Diagram</h1>
        <p className="text-gray-600 mt-2">
          Create Ishikawa (Fishbone) diagrams for root cause analysis
        </p>
      </div>
      <Fishbone />
    </div>
  );
}

