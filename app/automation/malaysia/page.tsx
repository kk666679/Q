'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppHeader } from '@/components/sidebar/app-header';
import { AIMetricCard } from '@/sdk/components/ai/aimetric-card';
import { AIInsightCard } from '@/sdk/components/ai/aiinsight-card';
import { Badge } from '@/components/ui/badge';

// Malaysia automation modules
import SsmComplianceDashboard from '@/components/automation/malaysia/agencies/ssm-compliance-dashboard';
import SsmFilingTracker from '@/components/automation/malaysia/agencies/ssm-filing-tracker';
import SsmCompanyMonitor from '@/components/automation/malaysia/agencies/ssm-company-monitor';
import LhdnTaxDashboard from '@/components/automation/malaysia/tax/lhdn-tax-dashboard';
import EinvoiceMonitor from '@/components/automation/malaysia/tax/einvoice-monitor';
import PcbEngine from '@/components/automation/malaysia/tax/pcb-engine';
import TaxAiCopilot from '@/components/automation/malaysia/tax/tax-ai-copilot';
import CustomsClearanceWorkflow from '@/components/automation/malaysia/customs/customs-clearance-workflow';
import TariffAiEngine from '@/components/automation/malaysia/customs/tariff-ai-engine';
import ImportExportMonitor from '@/components/automation/malaysia/customs/import-export-monitor';
import JakimHalalDashboard from '@/components/automation/malaysia/halal/jakim-halal-dashboard';
import HalalCertificateMonitor from '@/components/automation/malaysia/halal/halal-certificate-monitor';
import HalalAuditOrchestrator from '@/components/automation/malaysia/halal/halal-audit-orchestrator';
import HalalRiskEngine from '@/components/automation/malaysia/halal/halal-risk-engine';
import StandardsComplianceCenter from '@/components/automation/malaysia/manufacturing/standards-compliance-center';
import IsoCertificationMonitor from '@/components/automation/malaysia/manufacturing/iso-certification-monitor';
import StandardsAiAdvisor from '@/components/automation/malaysia/manufacturing/standards-ai-advisor';
import NpraComplianceDashboard from '@/components/automation/malaysia/compliance/npra-compliance-dashboard';
import GmpInspectionCenter from '@/components/automation/malaysia/compliance/gmp-inspection-center';
import PharmaRiskEngine from '@/components/automation/malaysia/compliance/pharma-risk-engine';
import BursaEsgDashboard from '@/components/automation/malaysia/esg/bursa-esg-dashboard';
import EsgReportGenerator from '@/components/automation/malaysia/esg/esg-report-generator';
import SustainabilityAiEngine from '@/components/automation/malaysia/esg/sustainability-ai-engine';
import RegulationMonitor from '@/components/automation/malaysia/regulatory-intelligence/regulation-monitor';
import GazetteParser from '@/components/automation/malaysia/regulatory-intelligence/gazette-parser';
import LawChangeDetector from '@/components/automation/malaysia/regulatory-intelligence/law-change-detector';
import ComplianceImpactEngine from '@/components/automation/malaysia/regulatory-intelligence/compliance-impact-engine';
import PolicyDiffViewer from '@/components/automation/malaysia/regulatory-intelligence/policy-diff-viewer';
import EpfSocsoComplianceMonitor from '@/components/automation/malaysia/hr/epf-socso-compliance-monitor';
import MalaysiaRegulatoryOrchestrator from '@/components/automation/malaysia/orchestration/malaysia-regulatory-orchestrator';
import RegulatoryNotificationCenter from '@/components/automation/malaysia/notifications/regulatory-notification-center';
import ComplianceHeatmap from '@/components/automation/malaysia/monitoring/compliance-heatmap';
import CourtTimelineTracker from '@/components/automation/malaysia/judiciary/court-timeline-tracker';
import { regulatorySignals, filings } from '@/components/automation/malaysia/shared/mock-data';
import { Flag, Building2, Leaf, Shield, Factory, FileText, TrendingUp, Bell } from 'lucide-react';

export default function MalaysiaAutomationPage() {
  const criticalSignals = regulatorySignals.filter((s) => s.severity === 'critical').length;
  const overdueFilings = filings.filter((f) => f.status === 'overdue').length;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader
          title="Malaysia Regulatory Automation"
          description="Multi-agency AI orchestration — SSM · LHDN · JAKIM · NPRA · DOSH · EPF · SOCSO · Bursa · BNM"
        />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">

            {/* Identity bar */}
            <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Flag className="h-6 w-6" />
                  <div>
                    <p className="font-semibold text-lg">Malaysia Regulatory Intelligence Hub</p>
                    <p className="text-sm opacity-80">
                      AI-orchestrated compliance across all Malaysian regulatory agencies
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['SSM', 'LHDN', 'JAKIM', 'NPRA', 'DOSH', 'EPF', 'SOCSO', 'Bursa', 'BNM'].map((a) => (
                    <Badge key={a} variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                      {a}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* KPI row */}
            <div className="grid gap-4 md:grid-cols-4">
              <AIMetricCard title="Overall Compliance Score" value="93.8" suffix="%" trend="up" change="+2.1%" icon={Shield} gradient="from-blue-500/80 to-indigo-500/80" />
              <AIMetricCard title="Critical Signals" value={criticalSignals} trend="up" change="+1 new" icon={Bell} />
              <AIMetricCard title="Overdue Filings" value={overdueFilings} trend="down" change="action needed" icon={FileText} />
              <AIMetricCard title="Agencies Monitored" value={9} trend="up" change="live" icon={Building2} />
            </div>

            <AIInsightCard
              title="Multi-Agency AI Orchestration Alert"
              insight="Cross-agency dependency detected: LHDN e-Invoice schema revision impacts SSM filing evidence trails. JAKIM Halal certificate renewal overdue. NPRA GMP inspection protocol updated."
              type="critical"
              recommendation="Run automated schema-impact simulation. Escalate JAKIM renewal. Package NPRA batch traceability evidence. Sync EPF/SOCSO payroll records before month-end."
              tags={['multi-agency', 'regulatory-intelligence', 'malaysia', 'ai-orchestration']}
            />

            <Tabs defaultValue="orchestrator">
              <TabsList className="flex-wrap h-auto gap-1">
                <TabsTrigger value="orchestrator">Orchestrator</TabsTrigger>
                <TabsTrigger value="ssm">SSM</TabsTrigger>
                <TabsTrigger value="tax">LHDN / Tax</TabsTrigger>
                <TabsTrigger value="customs">Customs</TabsTrigger>
                <TabsTrigger value="halal">JAKIM / Halal</TabsTrigger>
                <TabsTrigger value="manufacturing">Manufacturing</TabsTrigger>
                <TabsTrigger value="pharma">NPRA / GMP</TabsTrigger>
                <TabsTrigger value="esg">ESG / Bursa</TabsTrigger>
                <TabsTrigger value="regulatory">Regulatory Intel</TabsTrigger>
                <TabsTrigger value="hr">EPF / SOCSO</TabsTrigger>
                <TabsTrigger value="judiciary">Judiciary</TabsTrigger>
                <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              <TabsContent value="orchestrator">
                <MalaysiaRegulatoryOrchestrator />
              </TabsContent>

              <TabsContent value="ssm" className="space-y-4">
                <SsmComplianceDashboard />
                <SsmFilingTracker />
                <SsmCompanyMonitor />
              </TabsContent>

              <TabsContent value="tax" className="space-y-4">
                <LhdnTaxDashboard />
                <EinvoiceMonitor />
                <PcbEngine />
                <TaxAiCopilot />
              </TabsContent>

              <TabsContent value="customs" className="space-y-4">
                <CustomsClearanceWorkflow />
                <TariffAiEngine />
                <ImportExportMonitor />
              </TabsContent>

              <TabsContent value="halal" className="space-y-4">
                <JakimHalalDashboard />
                <HalalCertificateMonitor />
                <HalalAuditOrchestrator />
                <HalalRiskEngine />
              </TabsContent>

              <TabsContent value="manufacturing" className="space-y-4">
                <StandardsComplianceCenter />
                <IsoCertificationMonitor />
                <StandardsAiAdvisor />
              </TabsContent>

              <TabsContent value="pharma" className="space-y-4">
                <NpraComplianceDashboard />
                <GmpInspectionCenter />
                <PharmaRiskEngine />
              </TabsContent>

              <TabsContent value="esg" className="space-y-4">
                <BursaEsgDashboard />
                <EsgReportGenerator />
                <SustainabilityAiEngine />
              </TabsContent>

              <TabsContent value="regulatory" className="space-y-4">
                <RegulationMonitor />
                <GazetteParser />
                <LawChangeDetector />
                <ComplianceImpactEngine />
                <PolicyDiffViewer />
              </TabsContent>

              <TabsContent value="hr">
                <EpfSocsoComplianceMonitor />
              </TabsContent>

              <TabsContent value="judiciary">
                <CourtTimelineTracker />
              </TabsContent>

              <TabsContent value="heatmap">
                <ComplianceHeatmap />
              </TabsContent>

              <TabsContent value="notifications">
                <RegulatoryNotificationCenter />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
