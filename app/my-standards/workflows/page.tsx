'use client';

import { PageLayout } from '@/components/layout/page-layout';
import { Dashboard as StandardsDashboard } from '@/components/my-standards';

export default function MyStandardsWorkflowsPage() {
  return (
    <PageLayout
      title="MY Standards · Workflows"
      description="Workflow definitions and execution readiness signals."
      fullBleed
    >
      <StandardsDashboard />
    </PageLayout>
  );
}

