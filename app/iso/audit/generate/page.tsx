'use client';

import { AuditGenerate } from '@/components/iso';

export default function AuditGeneratePage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Generate Audit Checklist</h1>
        <p className="text-gray-600 mt-2">
          Generate customized audit checklists based on ISO clauses
        </p>
      </div>
      <AuditGenerate />
    </div>
  );
}

