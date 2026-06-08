'use client';

import { PageLayout } from '@/components/layout/page-layout';
import { Dashboard as StandardsDashboard } from '@/components/my-standards';

export default function MyStandardsTemplatesPage() {
  return (
    <PageLayout
      title="MY Standards · Templates"
      description="Template library mapped to workflow definitions."
      fullBleed
    >
      <StandardsDashboard />
    </PageLayout>
  );
}

