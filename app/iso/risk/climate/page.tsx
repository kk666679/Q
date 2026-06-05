'use client';
import { PageLayout } from '@/components/layout/page-layout';
import { RiskClimate } from '@/components/iso';

export default function RiskClimatePage() {
  return (
    <PageLayout title="Climate Risk Analysis" description="ISO 14001 AMD.1:2024 climate change risk assessment">
      <RiskClimate />
    </PageLayout>
  );
}
