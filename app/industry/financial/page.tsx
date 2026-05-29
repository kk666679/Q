'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PortalShell } from '@/components/portals/PortalShell';
import { PORTAL_CONFIGS } from '@/components/portals/portal-config';
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
import SsmComplianceDashboard from '@/components/automation/malaysia/agencies/ssm-compliance-dashboard';
import LhdnTaxDashboard from '@/components/automation/malaysia/tax/lhdn-tax-dashboard';
import EinvoiceMonitor from '@/components/automation/malaysia/tax/einvoice-monitor';
import BursaEsgDashboard from '@/components/automation/malaysia/esg/bursa-esg-dashboard';
import MalaysiaRegulatoryOrchestrator from '@/components/automation/malaysia/orchestration/malaysia-regulatory-orchestrator';
import RegulationMonitor from '@/components/automation/malaysia/regulatory-intelligence/regulation-monitor';
import LawChangeDetector from '@/components/automation/malaysia/regulatory-intelligence/law-change-detector';
import PolicyDiffViewer from '@/components/automation/malaysia/regulatory-intelligence/policy-diff-viewer';
import { Shield, Lock, AlertTriangle, TrendingUp } from 'lucide-react';

const config = PORTAL_CONFIGS.financial;

export default function FinancialPortalPage() {
  return (
    <PortalShell config={config}>
      <div className="grid gap-4 md:grid-cols-4">
        <AIMetricCard title={config.kpiLabels.quality} value="88.4" suffix="%" trend="up" change="+2.1%" icon={Shield} gradient={config.accent} />
        <AIMetricCard title={config.kpiLabels.performance} value="3.8" suffix=" hrs" trend="down" change="-0.5h" icon={AlertTriangle} />
        <AIMetricCard title={config.kpiLabels.availability} value="82" suffix="%" trend="up" change="+4%" icon={Lock} />
        <AIMetricCard title="Open Risks" value="14" trend="down" change="-3" icon={TrendingUp} />
      </div>

      <AIInsightCard
        title="BNM RMiT & ISO 27001 Alert"
        insight="ISO/IEC 27001:2022/Amd1:2024 climate amendment effective immediately. BNM RMiT Technology Risk assessment due Q3 2026. LHDN e-Invoice schema revision requires payload mapping update."
        type="warning"
        recommendation="Update ISMS context documentation to include climate change determination. Initiate RMiT gap analysis and assign evidence owners."
        tags={['ISO27001', 'BNM-RMiT', 'PDPA', 'LHDN', 'MDEC']}
      />

      <Tabs defaultValue="isms">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="isms">ISMS Documents</TabsTrigger>
          <TabsTrigger value="compliance">ISO 27001</TabsTrigger>
          <TabsTrigger value="gap">Gap Analysis</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
          <TabsTrigger value="capa">CAPA</TabsTrigger>
          <TabsTrigger value="risk">Risk Register</TabsTrigger>
          <TabsTrigger value="climate">Climate Risk</TabsTrigger>
          <TabsTrigger value="regulatory">Regulatory Intel</TabsTrigger>
          <TabsTrigger value="ssm">SSM / LHDN</TabsTrigger>
          <TabsTrigger value="esg">ESG / Bursa</TabsTrigger>
          <TabsTrigger value="orchestrator">MY Orchestrator</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="isms">
          <RegulatoryDocIndex categories={config.documentCategories} />
        </TabsContent>
        <TabsContent value="compliance"><ComplianceCheck standard="ISO27001" /></TabsContent>
        <TabsContent value="gap"><GapAnalysis standard="ISO27001" /></TabsContent>
        <TabsContent value="audit"><AuditGenerate /></TabsContent>
        <TabsContent value="capa"><CAPACreate /></TabsContent>
        <TabsContent value="risk"><RiskMatrix /></TabsContent>
        <TabsContent value="climate"><RiskClimate /></TabsContent>
        <TabsContent value="regulatory" className="space-y-4">
          <RegulationMonitor />
          <LawChangeDetector />
          <PolicyDiffViewer />
        </TabsContent>
        <TabsContent value="ssm" className="space-y-4">
          <SsmComplianceDashboard />
          <LhdnTaxDashboard />
          <EinvoiceMonitor />
        </TabsContent>
        <TabsContent value="esg"><BursaEsgDashboard /></TabsContent>
        <TabsContent value="orchestrator"><MalaysiaRegulatoryOrchestrator /></TabsContent>
        <TabsContent value="integration" className="grid gap-4 md:grid-cols-2">
          <WebhookConfigPanel />
          <DataImportWizard />
        </TabsContent>
      </Tabs>
    </PortalShell>
  );
}
