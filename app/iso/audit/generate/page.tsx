'use client';

import { PageLayout } from '@/components/layout/page-layout';
import { AuditGenerate } from '@/components/iso';

export default function AuditGeneratePage() {
  return (
    <PageLayout
      title="Generate Audit Checklist"
      description="Create customised audit checklists based on ISO clauses"
    >
      <AuditGenerate />
    </PageLayout>
  );
}
