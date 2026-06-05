'use client';
import { PageLayout } from '@/components/layout/page-layout';
import { ComplianceScore } from '@/components/iso';

export default function ComplianceScorePage() {
  return (
    <PageLayout title="Compliance Scoring" description="Calculate and track compliance scores for ISO standards">
      <div className="max-w-4xl mx-auto">
        <ComplianceScore />
      </div>
    </PageLayout>
  );
}
