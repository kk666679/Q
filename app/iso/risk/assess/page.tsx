'use client';
import { PageLayout } from '@/components/layout/page-layout';
import { RiskAssess } from '@/components/iso';

export default function RiskAssessPage() {
  return (
    <PageLayout title="Risk Assessment" description="Assess risks based on likelihood and consequence">
      <RiskAssess />
    </PageLayout>
  );
}
