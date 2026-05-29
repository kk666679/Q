'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PortalShell } from '@/components/portals/PortalShell';
import { PORTAL_CONFIGS } from '@/components/portals/portal-config';
import { SupplierScorecard } from '@/components/portals/SupplierScorecard';
import { TraceabilityPanel } from '@/components/portals/TraceabilityPanel';
import { SpcChartPanel } from '@/components/portals/SpcChartPanel';
import { RegulatoryDocIndex } from '@/components/portals/RegulatoryDocIndex';
import { WebhookConfigPanel } from '@/components/portals/WebhookConfigPanel';
import { DataImportWizard } from '@/components/portals/DataImportWizard';
import { AIMetricCard } from '@/sdk/components/ai/aimetric-card';
import { AIInsightCard } from '@/sdk/components/ai/aiinsight-card';
import { ComplianceCheck } from '@/components/iso/compliance-check';
import { GapAnalysis } from '@/components/iso/gap-analysis';
import { AuditGenerate } from '@/components/iso/audit-generate';
import { CAPACreate } from '@/components/iso/capa-create';
import { RiskClimate } from '@/components/audit-forms/risk-climate';
import { RiskMatrix } from '@/components/audit-forms/risk-matrix';
import StandardsComplianceCenter from '@/components/automation/malaysia/manufacturing/standards-compliance-center';
import IsoCertificationMonitor from '@/components/automation/malaysia/manufacturing/iso-certification-monitor';
import StandardsAiAdvisor from '@/components/automation/malaysia/manufacturing/standards-ai-advisor';
import { Activity, BarChart2, Shield, Cpu } from 'lucide-react';

const config = PORTAL_CONFIGS.electronics;

export default function ElectronicsPortalPage() {
  return (
    <PortalShell config={config}>
      {/* KPI row */}
      <div className="grid gap-4 md:grid-cols-4">
        <AIMetricCard title={config.kpiLabels.quality} value="96.8" suffix="%" trend="up" change="+1.2%" icon={Shield} gradient={config.accent} />
        <AIMetricCard title={config.kpiLabels.performance} value="1.72" trend="up" change="+0.05" icon={BarChart2} />
        <AIMetricCard title={config.kpiLabels.availability} value="94.1" suffix="%" trend="up" change="+2.3%" icon={Activity} />
        <AIMetricCard title="OEE" value="78.4" suffix="%" trend="up" change="+3.1%" icon={Cpu} />
      </div>

      <AIInsightCard
        title="MIDA E&E Sector Alert"
        insight="Penang fab cluster: 3 suppliers approaching PPAP re-submission deadline. SPC Cpk trending below 1.67 on Line 2."
        type="warning"
        recommendation="Trigger supplier CAPA workflow and schedule Line 2 process re-qualification. Reference MIDA Pioneer Status compliance evidence."
        tags={['IATF16949', 'SPC', 'PPAP', 'MIDA']}
      />

      <Tabs defaultValue="spc">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="spc">SPC Control</TabsTrigger>
          <TabsTrigger value="supplier">Supplier Scorecard</TabsTrigger>
          <TabsTrigger value="trace">Traceability</TabsTrigger>
          <TabsTrigger value="compliance">ISO Compliance</TabsTrigger>
          <TabsTrigger value="gap">Gap Analysis</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
          <TabsTrigger value="capa">CAPA</TabsTrigger>
          <TabsTrigger value="risk">Risk Matrix</TabsTrigger>
          <TabsTrigger value="climate">Climate Risk</TabsTrigger>
          <TabsTrigger value="docs">Documents</TabsTrigger>
          <TabsTrigger value="standards">MY Standards</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="spc"><SpcChartPanel /></TabsContent>
        <TabsContent value="supplier"><SupplierScorecard /></TabsContent>
        <TabsContent value="trace"><TraceabilityPanel /></TabsContent>
        <TabsContent value="compliance"><ComplianceCheck standard="ISO9001" /></TabsContent>
        <TabsContent value="gap"><GapAnalysis standard="ISO9001" /></TabsContent>
        <TabsContent value="audit"><AuditGenerate /></TabsContent>
        <TabsContent value="capa"><CAPACreate /></TabsContent>
        <TabsContent value="risk"><RiskMatrix /></TabsContent>
        <TabsContent value="climate"><RiskClimate /></TabsContent>
        <TabsContent value="docs">
          <RegulatoryDocIndex categories={config.documentCategories} />
        </TabsContent>
        <TabsContent value="standards" className="space-y-4">
          <StandardsComplianceCenter />
          <IsoCertificationMonitor />
          <StandardsAiAdvisor />
        </TabsContent>
        <TabsContent value="integration" className="grid gap-4 md:grid-cols-2">
          <WebhookConfigPanel />
          <DataImportWizard />
        </TabsContent>
      </Tabs>
    </PortalShell>
  );
}
