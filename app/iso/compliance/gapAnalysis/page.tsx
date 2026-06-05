'use client';
import { PageLayout } from '@/components/layout/page-layout';
import { GapAnalysis } from '@/components/iso';

export default function GapAnalysisPage() {
  return (
    <PageLayout title="Gap Analysis" description="Identify gaps between current compliance and target requirements">
      <GapAnalysis />
    </PageLayout>
  );
}
