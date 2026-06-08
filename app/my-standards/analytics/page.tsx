'use client';

import { PageLayout } from '@/components/layout/page-layout';
import { Dashboard as StandardsDashboard } from '@/components/my-standards';

export default function MyStandardsAnalyticsPage() {
  return (
    <PageLayout
      title="MY Standards · Analytics"
      description="KPI and compliance analytics derived from the registry."
      fullBleed
    >
      <StandardsDashboard />
    </PageLayout>
  );
}

