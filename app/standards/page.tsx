'use client';
import { PageLayout } from '@/components/layout/page-layout';
import { MalaysianStandardsBrowser } from '@/components/my-standards/malaysian-standards-browser';

export default function StandardsPage() {
  return (
    <PageLayout
      title="Malaysian Standards"
      description="Browse and manage Malaysian Standards for ISO compliance"
      fullBleed
    >
      <MalaysianStandardsBrowser />
    </PageLayout>
  );
}
