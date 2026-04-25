'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, FileCheck, AlertTriangle, TrendingUp, ArrowRight, CheckCircle, ClipboardList, Target, Activity, GitBranch, Lightbulb } from 'lucide-react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppHeader } from '@/components/sidebar/app-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer } from '@/components/ui/chart';
import { ComplianceDashboard } from '@/components/iso/compliance-dashboard';
import { AuditChecklist } from '@/components/iso/audit-checklist';
import { RiskMatrix } from '@/components/audit-forms/risk-matrix';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from 'recharts';

export default function ISOPage() {
  const [selectedStandard, setSelectedStandard] = useState('ISO9001');

  const standards = [
    { id: 'ISO9001', name: 'ISO 9001:2015', description: 'Quality Management', color: 'bg-blue-500', score: 85 },
    { id: 'ISO14001', name: 'ISO 14001:2015', description: 'Environmental Management', color: 'bg-green-500', score: 72 },
    { id: 'ISO45001', name: 'ISO 45001:2018', description: 'Occupational Health & Safety', color: 'bg-orange-500', score: 78 },
  ];

  const complianceTools = [
    { name: 'Compliance Check', description: 'Check compliance against ISO clauses', href: '/iso/compliance/check', icon: CheckCircle, color: 'bg-blue-500' },
    { name: 'Scoring', description: 'Calculate compliance scores', href: '/iso/compliance/score', icon: Target, color: 'bg-green-500' },
    { name: 'Gap Analysis', description: 'Identify gaps and action plans', href: '/iso/compliance/gapAnalysis', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  const auditTools = [
    { name: 'Generate Checklist', description: 'Create audit checklists', href: '/iso/audit/generate', icon: ClipboardList, color: 'bg-purple-500' },
    { name: 'Create Plan', description: 'Plan and schedule audits', href: '/iso/audit/createPlan', icon: FileCheck, color: 'bg-indigo-500' },
  ];

  const riskTools = [
    { name: 'Risk Assessment', description: 'Assess risks with likelihood & impact', href: '/iso/risk/assess', icon: Activity, color: 'bg-red-500' },
    { name: 'Risk Matrix', description: 'Interactive 5x5 risk matrix', href: '/iso/risk/matrix', icon: Shield, color: 'bg-yellow-500' },
    { name: 'Climate Risk', description: 'Climate risk analysis for ISO 14001', href: '/iso/risk/climate', icon: AlertTriangle, color: 'bg-teal-500' },
  ];

  const capaTools = [
    { name: 'Create CAPA', description: 'Create corrective/preventive actions', href: '/iso/capa/create', icon: CheckCircle, color: 'bg-cyan-500' },
    { name: '5 Whys', description: 'Root cause analysis', href: '/iso/capa/fiveWhys', icon: Lightbulb, color: 'bg-amber-500' },
    { name: 'Fishbone', description: 'Ishikawa diagram', href: '/iso/capa/fishbone', icon: GitBranch, color: 'bg-pink-500' },
  ];

  // Chart Data
  const complianceTrendData = [
    { month: 'Jan', iso9001: 75, iso14001: 65, iso45001: 68 },
    { month: 'Feb', iso9001: 78, iso14001: 67, iso45001: 70 },
    { month: 'Mar', iso9001: 80, iso14001: 68, iso45001: 72 },
    { month: 'Apr', iso9001: 82, iso14001: 70, iso45001: 74 },
    { month: 'May', iso9001: 84, iso14001: 71, iso45001: 76 },
    { month: 'Jun', iso9001: 85, iso14001: 72, iso45001: 78 },
  ];

  const requirementsData = [
    { name: 'Implemented', value: 210, fill: 'var(--chart-1)' },
    { name: 'In Progress', value: 25, fill: 'var(--chart-2)' },
    { name: 'Not Started', value: 12, fill: 'var(--chart-3)' },
  ];

  const maturityData = [
    { aspect: 'Documentation', score: 75, fullMark: 100 },
    { aspect: 'Process Control', score: 82, fullMark: 100 },
    { aspect: 'Leadership', score: 68, fullMark: 100 },
    { aspect: 'Risk Management', score: 72, fullMark: 100 },
    { aspect: 'Continuous Improvement', score: 78, fullMark: 100 },
    { aspect: 'Customer Focus', score: 85, fullMark: 100 },
  ];

  const standardsComparisonData = standards.map(s => ({
    name: s.id.replace('ISO', 'ISO '),
    score: s.score,
  }));

  const chartConfig = {
    iso9001: { label: 'ISO 9001', color: 'var(--chart-1)' },
    iso14001: { label: 'ISO 14001', color: 'var(--chart-2)' },
    iso45001: { label: 'ISO 45001', color: 'var(--chart-3)' },
    score: { label: 'Score', color: 'var(--chart-1)' },
  };

  const mockComplianceData = {
    totalRequirements: 247,
    implementedRequirements: 210,
    compliancePercentage: 85,
    maturityLevel: { level: 3, label: 'Defined' },
    gaps: [
      'Management review records incomplete',
      'Risk assessment documentation needs update',
      'Training records missing for 3 employees',
    ],
  };

  const mockChecklist = [
    { clause: '4', questions: ['Review organizational context', 'Verify interested parties analysis', 'Check QMS scope'] },
    { clause: '5', questions: ['Verify leadership commitment', 'Review quality policy', 'Check roles and responsibilities'] },
    { clause: '6', questions: ['Review risk assessment', 'Verify quality objectives', 'Check change management'] },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader 
          title="ISO Compliance Copilot" 
          description="AI-powered compliance management for ISO standards" 
        />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center justify-end">
              <Button>
                <FileCheck className="mr-2 size-4" />
                New Assessment
              </Button>
            </div>

      {/* Quick Access Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-full">
          <h2 className="text-xl font-semibold mb-4">Quick Access Tools</h2>
        </div>
        
        {/* Compliance Tools */}
        {complianceTools.map((tool) => (
          <Link key={tool.name} href={tool.href}>
            <Card className="cursor-pointer hover:shadow-lg transition-all h-full">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`${tool.color} p-3 rounded-lg`}>
                    <tool.icon className="size-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Audit Tools */}
        {auditTools.map((tool) => (
          <Link key={tool.name} href={tool.href}>
            <Card className="cursor-pointer hover:shadow-lg transition-all h-full">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`${tool.color} p-3 rounded-lg`}>
                    <tool.icon className="size-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {/* Risk Tools */}
        {riskTools.map((tool) => (
          <Link key={tool.name} href={tool.href}>
            <Card className="cursor-pointer hover:shadow-lg transition-all h-full">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`${tool.color} p-3 rounded-lg`}>
                    <tool.icon className="size-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {/* CAPA Tools */}
        {capaTools.map((tool) => (
          <Link key={tool.name} href={tool.href}>
            <Card className="cursor-pointer hover:shadow-lg transition-all h-full">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`${tool.color} p-3 rounded-lg`}>
                    <tool.icon className="size-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Standards Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Standards Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart data={standardsComparisonData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis domain={[0, 100]} className="text-xs" />
                <Tooltip />
                <Bar dataKey="score" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Requirements Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Requirements Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <PieChart>
                <Pie
                  data={requirementsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {requirementsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <LineChart data={complianceTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis domain={[50, 100]} className="text-xs" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="iso9001" stroke="var(--chart-1)" strokeWidth={2} />
              <Line type="monotone" dataKey="iso14001" stroke="var(--chart-2)" strokeWidth={2} />
              <Line type="monotone" dataKey="iso45001" stroke="var(--chart-3)" strokeWidth={2} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Maturity Radar */}
      <Card>
        <CardHeader>
          <CardTitle>Maturity Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={maturityData}>
              <PolarGrid className="stroke-muted" />
              <PolarAngleAxis dataKey="aspect" className="text-xs" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} className="text-xs" />
              <Radar name="Score" dataKey="score" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.3} />
            </RadarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Standards Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {standards.map((standard) => (
          <Card
            key={standard.id}
            className={`cursor-pointer transition-all ${
              selectedStandard === standard.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedStandard(standard.id)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <Shield className={`size-8 ${standard.color} text-white rounded p-1`} />
                <Badge variant="outline">Active</Badge>
              </div>
              <CardTitle className="mt-4">{standard.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{standard.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Compliance</span>
                  <span className="font-semibold">{standard.score}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className={`${standard.color} h-2 rounded-full`} style={{ width: `${standard.score}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Check</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
          <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">247</div>
                <p className="text-xs text-muted-foreground">Across all standards</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Compliant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">210</div>
                <p className="text-xs text-muted-foreground">85% compliance rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Gaps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">37</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Maturity Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Level 3</div>
                <p className="text-xs text-muted-foreground">Defined</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance">
          <ComplianceDashboard standard={selectedStandard} data={mockComplianceData} />
        </TabsContent>

        <TabsContent value="audit">
          <AuditChecklist standard={selectedStandard} checklist={mockChecklist} />
        </TabsContent>

        <TabsContent value="risks">
          <RiskMatrix />
        </TabsContent>
      </Tabs>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

