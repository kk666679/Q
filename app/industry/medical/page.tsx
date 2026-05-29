'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PortalShell } from '@/components/portals/PortalShell';
import { PORTAL_CONFIGS } from '@/components/portals/portal-config';
import { SupplierScorecard } from '@/components/portals/SupplierScorecard';
import { RegulatoryDocIndex } from '@/components/portals/RegulatoryDocIndex';
import { WebhookConfigPanel } from '@/components/portals/WebhookConfigPanel';
import { DataImportWizard } from '@/components/portals/DataImportWizard';
import { AIMetricCard } from '@/sdk/components/ai/aimetric-card';
import { AIInsightCard } from '@/sdk/components/ai/aiinsight-card';
import { ComplianceCheck } from '@/components/iso/compliance-check';
import { GapAnalysis } from '@/components/iso/gap-analysis';
import { AuditGenerate } from '@/components/iso/audit-generate';
import { CAPACreate } from '@/components/iso/capa-create';
import { RiskMatrix } from '@/components/audit-forms/risk-matrix';
import { RiskClimate } from '@/components/audit-forms/risk-climate';
import NpraComplianceDashboard from '@/components/automation/malaysia/compliance/npra-compliance-dashboard';
import GmpInspectionCenter from '@/components/automation/malaysia/compliance/gmp-inspection-center';
import PharmaRiskEngine from '@/components/automation/malaysia/compliance/pharma-risk-engine';
import { Shield, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

const config = PORTAL_CONFIGS.medical;

export default function MedicalPortalPage() {
  return (
    <PortalShell config={config}>
      <div className="grid gap-4 md:grid-cols-4">
        <AIMetricCard title={config.kpiLabels.quality} value="0.8" suffix="%" trend="down" change="-0.2%" icon={Shield} gradient={config.accent} />
        <AIMetricCard title={config.kpiLabels.performance} value="4.2" suffix=" days" trend="down" change="-0.8d" icon={AlertTriangle} />
        <AIMetricCard title={config.kpiLabels.availability} value="91" suffix="%" trend="up" change="+3%" icon={CheckCircle} />
        <AIMetricCard title="Open CAPAs" value="7" trend="down" change="-2" icon={FileText} />
      </div>

      <AIInsightCard
        title="MDA Regulatory Alert"
        insight="ISO 13485 surveillance audit due in 45 days. 2 DHF documents pending final approval. NPRA GMP inspection protocol updated May 2026."
        type="warning"
        recommendation="Prioritise DHF approval workflow. Ensure batch traceability evidence is packaged per updated NPRA protocol before audit."
        tags={['ISO13485', 'MDA', 'NPRA', 'DHF', 'GMP']}
      />

      <Tabs defaultValue="docs">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="docs">DHF / DMR Index</TabsTrigger>
          <TabsTrigger value="compliance">ISO Compliance</TabsTrigger>
          <TabsTrigger value="gap">Gap Analysis</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
          <TabsTrigger value="capa">CAPA</TabsTrigger>
          <TabsTrigger value="risk">Risk (ISO 14971)</TabsTrigger>
          <TabsTrigger value="climate">Climate Risk</TabsTrigger>
          <TabsTrigger value="supplier">Supplier QA</TabsTrigger>
          <TabsTrigger value="npra">NPRA / GMP</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="docs">
          <RegulatoryDocIndex categories={config.documentCategories} />
        </TabsContent>
        <TabsContent value="compliance"><ComplianceCheck standard="ISO9001" /></TabsContent>
        <TabsContent value="gap"><GapAnalysis standard="ISO9001" /></TabsContent>
        <TabsContent value="audit"><AuditGenerate /></TabsContent>
        <TabsContent value="capa"><CAPACreate /></TabsContent>
        <TabsContent value="risk"><RiskMatrix /></TabsContent>
        <TabsContent value="climate"><RiskClimate /></TabsContent>
        <TabsContent value="supplier"><SupplierScorecard /></TabsContent>
        <TabsContent value="npra" className="space-y-4">
          <NpraComplianceDashboard />
          <GmpInspectionCenter />
          <PharmaRiskEngine />
        </TabsContent>
        <TabsContent value="integration" className="grid gap-4 md:grid-cols-2">
          <WebhookConfigPanel />
          <DataImportWizard />
        </TabsContent>
      </Tabs>
    </PortalShell>
  );
}
