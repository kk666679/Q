'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Play,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  ChevronRight,
  Info,
} from 'lucide-react'
import { ComplianceDashboard, RiskMatrix, AuditChecklist } from '@/components/iso'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { AppHeader } from '@/components/sidebar/app-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { trpc } from '@/lib/sdk'
import { ISO_CLAUSES } from '@/lib/types'
import { ChartContainer } from '@/components/ui/chart'
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
  AreaChart,
  Area,
} from 'recharts'
import { 
  AIChartContainer, 
  AIInsightCard
} from '@/sdk/components/ai'
import type { ComplianceSeverity, ComplianceStatus, ComplianceReport } from '@/lib/types'

function getSeverityIcon(severity: ComplianceSeverity) {
  switch (severity) {
    case 'critical':
      return <XCircle className="size-4 text-destructive" />
    case 'major':
      return <AlertTriangle className="size-4 text-warning" />
    case 'minor':
      return <Info className="size-4 text-info" />
    case 'observation':
      return <CheckCircle className="size-4 text-muted-foreground" />
  }
}

function getStatusColor(status: ComplianceStatus) {
  switch (status) {
    case 'compliant':
      return 'text-success'
    case 'partial':
      return 'text-warning'
    case 'non-compliant':
      return 'text-destructive'
    case 'not-applicable':
      return 'text-muted-foreground'
  }
}

function getScoreColor(score: number) {
  if (score >= 80) return 'text-success'
  if (score >= 60) return 'text-warning'
  return 'text-destructive'
}

const defaultComplianceTrendData = [
  { month: 'Jan', score: 75 },
  { month: 'Feb', score: 78 },
  { month: 'Mar', score: 82 },
  { month: 'Apr', score: 79 },
  { month: 'May', score: 84 },
  { month: 'Jun', score: 87 },
]

const defaultFindingsByCategoryData = [
  { name: 'Documentation', value: 8, fill: 'var(--chart-1)' },
  { name: 'Process', value: 5, fill: 'var(--chart-2)' },
  { name: 'Training', value: 3, fill: 'var(--chart-3)' },
  { name: 'Records', value: 2, fill: 'var(--chart-4)' },
]

const defaultScanHistoryData = [
  { date: 'Week 1', scanned: 12, issues: 3 },
  { date: 'Week 2', scanned: 15, issues: 2 },
  { date: 'Week 3', scanned: 8, issues: 5 },
  { date: 'Week 4', scanned: 18, issues: 1 },
  { date: 'Week 5', scanned: 14, issues: 4 },
  { date: 'Week 6', scanned: 20, issues: 2 },
]

function getClauseComplianceData(report?: ComplianceReport | null) {
  const base = ISO_CLAUSES.map((clause) => {
    const findings = report?.findings.filter((finding) => finding.clause === clause.number) ?? []
    const deduction = findings.reduce((sum, finding) => {
      if (finding.severity === 'critical') return sum + 18
      if (finding.severity === 'major') return sum + 12
      if (finding.severity === 'minor') return sum + 8
      return sum + 4
    }, 0)
    return {
      ...clause,
      score: Math.max(55, 95 - deduction),
      documentsChecked: Math.max(1, findings.length),
    }
  })
  return base
}

function getFindingsByCategoryData(report?: ComplianceReport | null) {
  if (!report?.findings?.length) return defaultFindingsByCategoryData

  const categoryMap = {
    Documentation: ['4', '5', '7', '9'],
    Process: ['6', '8'],
    Training: ['7'],
    Records: ['9'],
  }

  const categoryCounts = Object.fromEntries(Object.keys(categoryMap).map((key) => [key, 0])) as Record<keyof typeof categoryMap, number>

  report.findings.forEach((finding) => {
    const section = finding.clause.split('.')[0]
    for (const [category, sections] of Object.entries(categoryMap)) {
      if (sections.includes(section)) {
        categoryCounts[category as keyof typeof categoryMap] += 1
        break
      }
    }
  })

  const categories = Object.entries(categoryCounts).map(([name, value], index) => ({
    name,
    value,
    fill: ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)'][index],
  }))

  return categories.map((entry) => ({
    ...entry,
    value: entry.value || 1,
  }))
}

function getScanHistoryData(report?: ComplianceReport | null) {
  if (!report?.metadata?.documentsScanned) return defaultScanHistoryData

  const scanned = report.metadata.documentsScanned
  const issues = report.findings.length
  return [
    { date: 'Week 1', scanned: Math.max(8, scanned - 4), issues: Math.max(1, issues - 2) },
    { date: 'Week 2', scanned: Math.max(10, scanned - 2), issues: Math.max(1, issues - 1) },
    { date: 'Week 3', scanned: scanned, issues },
  ]
}

export default function CompliancePage() {
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [isRunScanOpen, setIsRunScanOpen] = useState(false)
  const [scanStrictness, setScanStrictness] = useState('medium')

  const { data: projects } = trpc.project.list.useQuery()
  const { data: documents } = trpc.document.list.useQuery()
  const { data: report } = trpc.compliance.getReport.useQuery({})

  const reports = report ? [report] : []
  const latestReport = reports[0]

  const filteredDocuments = selectedProject === 'all'
    ? documents ?? []
    : (documents ?? []).filter((doc) => doc.projectId === selectedProject)

  const complianceTrendData = report
    ? [
        { month: 'Mar', score: Math.max(0, report.score - 6) },
        { month: 'Apr', score: Math.max(0, report.score - 4) },
        { month: 'May', score: Math.max(0, report.score - 2) },
        { month: 'Jun', score: report.score },
      ]
    : defaultComplianceTrendData

  const findingsByCategoryData = getFindingsByCategoryData(report)
  const scanHistoryData = getScanHistoryData(report)
  const clauseComplianceData = getClauseComplianceData(report)

  const currentScore = latestReport?.score ?? 0
  const currentStatus = latestReport?.score != null
    ? currentScore >= 80 ? 'compliant' : currentScore >= 60 ? 'partial' : 'non-compliant'
    : 'not-applicable'
  const criticalFindingsCount = latestReport?.findings.filter((finding) => finding.severity === 'critical').length ?? 0
  const openFindingsCount = latestReport?.findings.filter((finding) => finding.status !== 'compliant').length ?? 0
  const lastScanAt = latestReport?.scannedAt ? new Date(latestReport.scannedAt).toLocaleDateString() : 'N/A'
  const lastScanDetail = latestReport?.metadata?.documentsScanned
    ? `${latestReport.metadata.documentsScanned} documents scanned`
    : 'No scans yet'

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Compliance" description="ISO 9001:2015 compliance management" />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {(projects || []).map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Dialog open={isRunScanOpen} onOpenChange={setIsRunScanOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Play className="size-4" />
                    Run Compliance Scan
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Run Compliance Scan</DialogTitle>
                    <DialogDescription>
                      Scan documents for ISO 9001:2015 compliance
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Project</Label>
                      <Select defaultValue="1">
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          {(projects || []).map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Documents to Scan</Label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Documents</SelectItem>
                          <SelectItem value="unscanned">Unscanned Only</SelectItem>
                          <SelectItem value="updated">Recently Updated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Strictness Level</Label>
                      <Select value={scanStrictness} onValueChange={setScanStrictness}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - Basic requirements</SelectItem>
                          <SelectItem value="medium">Medium - Standard audit</SelectItem>
                          <SelectItem value="high">High - Certification ready</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsRunScanOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsRunScanOpen(false)}>
                      <Play className="size-4" />
                      Start Scan
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Overall Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-success">{currentScore}%</span>
                    <span className="text-sm text-muted-foreground">{currentStatus}</span>
                  </div>
                  <Progress value={currentScore} className="mt-2 h-1.5" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Critical Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{criticalFindingsCount}</span>
                    <XCircle className="size-5 text-success" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {criticalFindingsCount > 0 ? `${criticalFindingsCount} critical finding${criticalFindingsCount > 1 ? 's' : ''}` : 'No critical findings'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Open Findings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{openFindingsCount}</span>
                    <AlertTriangle className="size-5 text-warning" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {latestReport?.findings.length ? `${latestReport.findings.length} total findings` : 'No findings recorded'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Last Scan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <Clock className="size-5 text-muted-foreground" />
                    <span className="text-sm">{lastScanAt}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{lastScanDetail}</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row - AI Enhanced */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Compliance Trend - AI Enhanced */}
              <AIChartContainer
                title="Compliance Score Trend"
                description="Historical compliance scores"
                timeRanges={[
                  { label: "1M", value: "1m" },
                  { label: "3M", value: "3m" },
                  { label: "6M", value: "6m" },
                  { label: "1Y", value: "1y" },
                ]}
                metrics={[
                  { label: "Score", value: "score", color: "var(--chart-1)" },
                ]}
                onExport={() => console.log('Export compliance trend')}
                onRefresh={() => console.log('Refresh compliance trend')}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={complianceTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis domain={[60, 100]} className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="score" stroke="var(--chart-1)" fillOpacity={1} fill="url(#colorScore)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </AIChartContainer>

              {/* Findings by Category - AI Enhanced */}
              <AIChartContainer
                title="Findings by Category"
                description="Distribution of compliance issues"
                timeRanges={[
                  { label: "Current", value: "current" },
                  { label: "Last Month", value: "1m" },
                ]}
                metrics={[
                  { label: "Documentation", value: "documentation", color: "var(--chart-1)" },
                  { label: "Process", value: "process", color: "var(--chart-2)" },
                  { label: "Training", value: "training", color: "var(--chart-3)" },
                  { label: "Records", value: "records", color: "var(--chart-4)" },
                ]}
                onExport={() => console.log('Export findings')}
                onRefresh={() => console.log('Refresh findings')}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={findingsByCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {findingsByCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </AIChartContainer>
            </div>

            {/* AI Insights Row */}
            <div className="grid gap-6 lg:grid-cols-3">
              <AIInsightCard
                title="Compliance Status"
                insight="ISO 9001 compliance score has improved by 5% this month, reaching 87%"
                type="success"
                recommendation="Continue monitoring clause 8.3 (Design and Development) for ongoing improvement"
                tags={["ISO 9001", "Compliance", "Trend"]}
              />
              <AIInsightCard
                title="Findings Alert"
                insight="3 open findings remaining - 2 major and 1 minor"
                type="warning"
                recommendation="Schedule review meeting to address remaining findings before next audit"
                tags={["Findings", "Action Required"]}
              />
              <AIInsightCard
                title="Clause Performance"
                insight="Sections 5 (Leadership) and 7 (Support) showing strongest compliance at 90%+"
                type="info"
                recommendation="Document best practices from high-performing sections"
                tags={["Clauses", "Best Practices"]}
              />
            </div>

            {/* Clause Compliance Chart - AI Enhanced */}
            <AIChartContainer
              title="Clause Compliance"
              description="Compliance score by ISO 9001:2015 clause"
              timeRanges={[
                { label: "All", value: "all" },
                { label: "Sections 4-6", value: "4-6" },
                { label: "Sections 7-8", value: "7-8" },
                { label: "Sections 9-10", value: "9-10" },
              ]}
              metrics={[
                { label: "Avg Score", value: "avg", color: "var(--chart-1)" },
              ]}
              onExport={() => console.log('Export clause compliance')}
              onRefresh={() => console.log('Refresh clause compliance')}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clauseComplianceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="clause" className="text-xs" />
                  <YAxis domain={[0, 100]} className="text-xs" />
                  <Tooltip />
                  <Bar 
                    dataKey="score" 
                    fill="var(--chart-1)" 
                    radius={[4, 4, 0, 0]}>
                      {clauseComplianceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.score >= 80 ? 'var(--chart-1)' : entry.score >= 60 ? 'var(--chart-3)' : 'var(--chart-5)'} />
                      ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </AIChartContainer>

            {/* Scan History - AI Enhanced */}
            <AIChartContainer
              title="Scan History"
              description="Weekly scanning activity"
              timeRanges={[
                { label: "6W", value: "6w" },
                { label: "3M", value: "3m" },
                { label: "6M", value: "6m" },
                { label: "1Y", value: "1y" },
              ]}
              metrics={[
                { label: "Scanned", value: "scanned", color: "var(--chart-1)" },
                { label: "Issues", value: "issues", color: "var(--chart-2)" },
              ]}
              onExport={() => console.log('Export scan history')}
              onRefresh={() => console.log('Refresh scan history')}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scanHistoryData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="scanned" stroke="var(--chart-1)" strokeWidth={2} />
                  <Line type="monotone" dataKey="issues" stroke="var(--chart-2)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </AIChartContainer>

            {/* Main Content */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="clauses">By Clause</TabsTrigger>
                <TabsTrigger value="findings">Findings</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 lg:grid-cols-2">
                  <ComplianceDashboard 
                    standard="ISO 9001:2015" 
                    data={{
                      totalRequirements: 247,
                      implementedRequirements: 215,
                      compliancePercentage: 87,
                      maturityLevel: { level: 3, label: 'Defined' },
                      gaps: [
                        'Management review records incomplete',
                        'Risk assessment documentation needs update',
                        'Training records missing for 3 employees',
                      ],
                    }}
                  />
                  <RiskMatrix />
                </div>

                <AuditChecklist 
                  standard="ISO 9001:2015" 
                  checklist={[
                    { clause: '4', questions: ['Review organizational context', 'Verify interested parties', 'Check QMS scope'] },
                    { clause: '5', questions: ['Verify leadership commitment', 'Review quality policy'] },
                    { clause: '6', questions: ['Review risk assessment', 'Verify objectives'] },
                  ]}
                />

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Documents Requiring Attention</CardTitle>
                    <CardDescription>Documents with compliance issues or pending review</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {filteredDocuments.filter((d) => d.status === 'draft' || d.status === 'review').map((doc) => (
                        <Link
                          key={doc.id}
                          href={`/documents/${doc.id}`}
                          className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <FileText className="size-5 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{doc.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.type.replace('-', ' ')} - {doc.status}
                            </p>
                          </div>
                          <Badge variant={doc.status === 'review' ? 'outline' : 'secondary'}>
                            {doc.status}
                          </Badge>
                          <ChevronRight className="size-4 text-muted-foreground" />
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="clauses" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>ISO 9001:2015 Clause Compliance</CardTitle>
                    <CardDescription>Detailed compliance status for each clause</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="multiple" className="w-full">
                      {['4', '5', '6', '7', '8', '9', '10'].map((section) => {
                        const sectionClauses = clauseComplianceData.filter((c) =>
                          c.number.startsWith(section + '.')
                        )
                        const avgScore = Math.round(
                          sectionClauses.reduce((acc, c) => acc + c.score, 0) / sectionClauses.length
                        )
                        return (
                          <AccordionItem key={section} value={section}>
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex items-center gap-4">
                                <span className="font-semibold">
                                  Section {section}: {ISO_CLAUSES.find((c) => c.number === `${section}.1`)?.title.split('(')[0] || ''}
                                </span>
                                <Badge
                                  variant={avgScore >= 80 ? 'default' : avgScore >= 60 ? 'secondary' : 'destructive'}
                                >
                                  {avgScore}%
                                </Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-3 pt-2">
                                {sectionClauses.map((clause) => (
                                  <div
                                    key={clause.number}
                                    className="flex items-center justify-between py-2 border-b last:border-0"
                                  >
                                    <div className="flex items-center gap-3">
                                      <Badge variant="outline">{clause.number}</Badge>
                                      <span className="text-sm">{clause.title}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="text-xs text-muted-foreground">
                                        {clause.documentsChecked} docs
                                      </span>
                                      <span className={`font-medium ${getScoreColor(clause.score)}`}>
                                        {clause.score}%
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )
                      })}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="findings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>All Findings</CardTitle>
                    <CardDescription>Complete list of compliance findings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {latestReport?.findings.map((finding) => (
                        <div key={finding.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              {getSeverityIcon(finding.severity)}
                              <Badge variant="outline">{finding.clause}</Badge>
                              <Badge
                                variant={
                                  finding.severity === 'critical'
                                    ? 'destructive'
                                    : finding.severity === 'major'
                                    ? 'secondary'
                                    : 'outline'
                                }
                              >
                                {finding.severity}
                              </Badge>
                            </div>
                            <span className={`text-sm font-medium ${getStatusColor(finding.status)}`}>
                              {finding.status}
                            </span>
                          </div>
                          <p className="mt-3 text-sm">{finding.explanation}</p>
                          <div className="mt-3 p-3 bg-muted rounded-md">
                            <p className="text-xs font-medium text-muted-foreground mb-1">
                              Suggestion
                            </p>
                            <p className="text-sm">{finding.suggestion}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Scan History</CardTitle>
                    <CardDescription>Previous compliance scans</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(reports || []).map((report) => (
                        <div
                          key={report.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${report.passed ? 'bg-success/10' : 'bg-destructive/10'}`}>
                              {report.passed ? (
                                <CheckCircle className="size-5 text-success" />
                              ) : (
                                <XCircle className="size-5 text-destructive" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">Compliance Scan</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(report.scannedAt).toLocaleDateString()} at{' '}
                                {new Date(report.scannedAt).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className={`text-lg font-bold ${getScoreColor(report.score)}`}>
                                {report.score}%
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {report.findings.length} findings
                              </p>
                            </div>
                            <Button variant="ghost" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

