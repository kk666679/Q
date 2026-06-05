'use client';
import { PageLayout } from '@/components/layout/page-layout';
import { CAPACreate } from '@/components/iso';

export default function CAPACreatePage() {
  return (
    <PageLayout title="Create CAPA" description="Create Corrective and Preventive Action plans">
      <CAPACreate />
    </PageLayout>
  );
}
