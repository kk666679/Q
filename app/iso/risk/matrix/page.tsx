'use client';
import { PageLayout } from '@/components/layout/page-layout';
import { RiskMatrixView } from '@/components/iso';

export default function RiskMatrixPage() {
  return (
    <PageLayout title="Risk Matrix" description="Interactive 5×5 risk matrix for visualising and managing risks">
      <RiskMatrixView />
    </PageLayout>
  );
}
