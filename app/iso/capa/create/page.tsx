'use client';

import { CAPACreate } from '@/components/iso';

export default function CAPACreatePage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create CAPA Plan</h1>
        <p className="text-gray-600 mt-2">
          Create Corrective and Preventive Action (CAPA) plans
        </p>
      </div>
      <CAPACreate />
    </div>
  );
}

