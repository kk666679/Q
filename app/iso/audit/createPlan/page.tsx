'use client';

import { AuditCreatePlan } from '@/components/iso';

export default function AuditCreatePlanPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Audit Plan</h1>
        <p className="text-gray-600 mt-2">
          Plan and schedule ISO audits with objectives, auditors, and scope
        </p>
      </div>
      <AuditCreatePlan />
    </div>
  );
}

