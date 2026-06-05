'use client';
import { PageLayout } from '@/components/layout/page-layout';
import { ComplianceCheck } from '@/components/iso';

export default function ComplianceCheckPage() {
  return (
    <PageLayout title="Compliance Check" description="Check compliance against ISO standards clause by clause">
      <div className="max-w-4xl mx-auto">
        <ComplianceCheck />
      </div>
    </PageLayout>
  );
}
