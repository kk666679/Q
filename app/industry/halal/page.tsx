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
import { HACCPPlanForm } from '@/components/haccp';
import GMPDashboard from '@/components/GMP/dashboard';
import IslamicDashboard from '@/components/islamic-manufacturing-process/dashboard';
import JakimHalalDashboard from '@/components/automation/malaysia/halal/jakim-halal-dashboard';
import HalalCertificateMonitor from '@/components/automation/malaysia/halal/halal-certificate-monitor';
import HalalAuditOrchestrator from '@/components/automation/malaysia/halal/halal-audit-orchestrator';
import HalalRiskEngine from '@/components/automation/malaysia/halal/halal-risk-engine';
import BursaEsgDashboard from '@/components/automation/malaysia/esg/bursa-esg-dashboard';
import SustainabilityAiEngine from '@/components/automation/malaysia/esg/sustainability-ai-engine';
import { Leaf, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

const config = PORTAL_CONFIGS.halal;

export default function HalalPortalPage() {
  return (
    <PortalShell config={config}>
      <div className="grid gap-4 md:grid-cols-4">
        <AIMetricCard title={config.kpiLabels.quality} value="97.3" suffix="%" trend="up" change="+0.8%" icon={CheckCircle} gradient={config.accent} />
        <AIMetricCard title={config.kpiLabels.performance} value="98.1" suffix="%" trend="up" change="+1.2%" icon={Leaf} />
        <AIMetricCard title={config.kpiLabels.availability} value="94" suffix="%" trend="down" change="-2%" icon={AlertTriangle} />
        <AIMetricCard title="HACCP CCPs Active" value="12" trend="up" change="+1" icon={TrendingUp} />
      </div>

      <AIInsightCard
        title="JAKIM Halal Alert"
        insight="Halal certificate renewal overdue for 1 supplier. JAKIM ingredient disclosure circular (Apr 2026) requires supplier validation refresh."
        type="critical"
        recommendation="Initiate JAKIM renewal workflow immediately. Run supplier Halal status audit and update ingredient declaration records."
        tags={['JAKIM', 'MS1500', 'HACCP', 'GMP', 'HRDCorp']}
      />

      <Tabs defaultValue="halal">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="halal">JAKIM Halal</TabsTrigger>
          <TabsTrigger value="haccp">HACCP Plan</TabsTrigger>
          <TabsTrigger value="gmp">GMP Dashboard</TabsTrigger>
          <TabsTrigger value="islamic">Islamic Mfg</TabsTrigger>
          <TabsTrigger value="compliance">ISO Compliance</TabsTrigger>
          <TabsTrigger value="gap">Gap Analysis</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
          <TabsTrigger value="capa">CAPA</TabsTrigger>
          <TabsTrigger value="risk">Risk Matrix</TabsTrigger>
          <TabsTrigger value="climate">Climate Risk</TabsTrigger>
          <TabsTrigger value="supplier">Supplier Halal</TabsTrigger>
          <TabsTrigger value="esg">ESG / Bursa</TabsTrigger>
          <TabsTrigger value="docs">Documents</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="halal" className="space-y-4">
          <JakimHalalDashboard />
          <HalalCertificateMonitor />
          <HalalAuditOrchestrator />
          <HalalRiskEngine />
        </TabsContent>
        <TabsContent value="haccp"><HACCPPlanForm /></TabsContent>
        <TabsContent value="gmp"><GMPDashboard /></TabsContent>
        <TabsContent value="islamic"><IslamicDashboard /></TabsContent>
        <TabsContent value="compliance"><ComplianceCheck standard="ISO14001" /></TabsContent>
        <TabsContent value="gap"><GapAnalysis standard="ISO14001" /></TabsContent>
        <TabsContent value="audit"><AuditGenerate /></TabsContent>
        <TabsContent value="capa"><CAPACreate /></TabsContent>
        <TabsContent value="risk"><RiskMatrix /></TabsContent>
        <TabsContent value="climate"><RiskClimate /></TabsContent>
        <TabsContent value="supplier"><SupplierScorecard showHalal /></TabsContent>
        <TabsContent value="esg" className="space-y-4">
          <BursaEsgDashboard />
          <SustainabilityAiEngine />
        </TabsContent>
        <TabsContent value="docs">
          <RegulatoryDocIndex categories={config.documentCategories} />
        </TabsContent>
        <TabsContent value="integration" className="grid gap-4 md:grid-cols-2">
          <WebhookConfigPanel />
          <DataImportWizard />
        </TabsContent>
      </Tabs>
    </PortalShell>
  );
}
