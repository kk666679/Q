'use client';
import { PageLayout } from '@/components/layout/page-layout';
import { AuditCreatePlan } from '@/components/iso';

export default function AuditCreatePlanPage() {
  return (
    <PageLayout title="Create Audit Plan" description="Plan and schedule ISO audits with objectives, auditors, and scope">
      <AuditCreatePlan />
    </PageLayout>
  );
}
