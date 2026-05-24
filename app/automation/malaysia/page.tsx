import SsmComplianceDashboard from '@/components/automation/malaysia/agencies/ssm-compliance-dashboard';
import LhdnTaxDashboard from '@/components/automation/malaysia/tax/lhdn-tax-dashboard';
import JakimHalalDashboard from '@/components/automation/malaysia/halal/jakim-halal-dashboard';
import NpraComplianceDashboard from '@/components/automation/malaysia/compliance/npra-compliance-dashboard';
import BursaEsgDashboard from '@/components/automation/malaysia/esg/bursa-esg-dashboard';
import RegulationMonitor from '@/components/automation/malaysia/regulatory-intelligence/regulation-monitor';

export default function MalaysiaAutomationPage() {
  return (
    <main className="container mx-auto space-y-6 px-6 py-8">
      <header>
        <h1 className="text-3xl font-bold">Malaysia Regulatory AI Integration</h1>
        <p className="text-muted-foreground">Frontend integration of agency modules across SSM, LHDN, JAKIM, NPRA, Bursa, and regulatory intelligence.</p>
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        <SsmComplianceDashboard />
        <LhdnTaxDashboard />
        <JakimHalalDashboard />
        <NpraComplianceDashboard />
        <BursaEsgDashboard />
        <RegulationMonitor />
      </div>
    </main>
  );
}
