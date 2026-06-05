'use client';
import { PageLayout } from '@/components/layout/page-layout';
import { Fishbone } from '@/components/iso';

export default function FishbonePage() {
  return (
    <PageLayout title="Fishbone Diagram" description="Ishikawa root cause analysis">
      <Fishbone />
    </PageLayout>
  );
}
