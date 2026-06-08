'use client';

import { PageLayout } from '@/components/layout/page-layout';
import { Dashboard as StandardsDashboard } from '@/components/my-standards';

export default function MyStandardsRegistryPage() {
  return (
    <PageLayout
      title="MY Standards · Registry"
      description="Registry-backed nodes, edges, templates and workflows."
      fullBleed
    >
      <StandardsDashboard />
    </PageLayout>
  );
}

