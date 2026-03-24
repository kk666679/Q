'use client'

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { AppHeader } from '@/components/sidebar/app-header'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { ProjectsList } from '@/components/dashboard/projects-list'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { ComplianceOverview } from '@/components/dashboard/compliance-overview'
import { trpc } from '@/sdk/client/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
} from '@/components/ui/chart'
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
  Area,
  AreaChart,
} from 'recharts'
import { 
  AIChartContainer, 
  AIInsightCard, 
  AIProgressCard,
  AIDataTable,
  AIActionCard,
  AILoadingState
} from '@/sdk/components/ai/index'

import { downloadCSV } from '@/lib/exportUtils'

import { Activity, TrendingUp, Shield, FileText, AlertTriangle, CheckCircle } from 'lucide-react'

// Mock data for charts
const activityTrendData = [
  { month: 'Jan', documents: 12, processes: 8, compliance: 95 },
  { month: 'Feb', documents: 19, processes: 12, compliance: 92 },
  { month: 'Mar', documents: 15, processes: 10, compliance: 88 },
  { month: 'Apr', documents: 22, processes: 15, compliance: 91 },
  { month: 'May', documents: 18, processes: 11, compliance: 94 },
  { month: 'Jun', documents: 25, processes: 18, compliance: 87 },
]

const projectStatusData = [
  { name: 'Active', value: 12, fill: 'var(--chart-1)' },
  { name: 'Draft', value: 4, fill: 'var(--chart-2)' },
  { name: 'On Hold', value: 2, fill: 'var(--chart-3)' },
  { name: 'Completed', value: 8, fill: 'var(--chart-4)' },
]

const complianceTrendData = [
  { month: 'Jan', score: 78 },
  { month: 'Feb', score: 82 },
  { month: 'Mar', score: 79 },
  { month: 'Apr', score: 85 },
  { month: 'May', score: 88 },
  { month: 'Jun', score: 91 },
]

const documentTypeData = [
  { type: 'Quality Manual', count: 5 },
  { type: 'Procedures', count: 24 },
  { type: 'Work Instructions', count: 45 },
  { type: 'Forms', count: 78 },
  { type: 'Records', count: 120 },
]

const chartConfig = {
  documents: { label: 'Documents', color: 'var(--chart-1)' },
  processes: { label: 'Processes', color: 'var(--chart-2)' },
  compliance: { label: 'Compliance %', color: 'var(--chart-3)' },
  score: { label: 'Score', color: 'var(--chart-1)' },
}

export default function DashboardPage() {
  const { data: stats } = trpc.dashboard.getStats.useQuery()
  const { data: projects } = trpc.project.list.useQuery()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Dashboard" description="Overview of your QMS implementation" />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <StatsCards stats={stats || { totalProjects: 0, activeProjects: 0, totalDocuments: 0, averageCompliance: 0, documentsThisMonth: 0, scansThisWeek: 0, recentActivity: [] }} />

            {/* AI-Enhanced Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Activity Trends Chart - AI Enhanced */}
              <AIChartContainer
                title="Activity Trends"
                description="Document and process activity over time"
                timeRanges={[
                  { label: "1W", value: "1w" },
                  { label: "1M", value: "1m" },
                  { label: "3M", value: "3m" },
                  { label: "1Y", value: "1y" },
                ]}
                metrics={[
                  { label: "Documents", value: "documents", color: "var(--chart-1)" },
                  { label: "Processes", value: "processes", color: "var(--chart-2)" },
                ]}
                onExport={() => downloadCSV(activityTrendData, 'activity-trends.csv')}
                onRefresh={() => window.location.reload()}
              >

                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorDocuments" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorProcesses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="documents" stroke="var(--chart-1)" fillOpacity={1} fill="url(#colorDocuments)" />
                    <Area type="monotone" dataKey="processes" stroke="var(--chart-2)" fillOpacity={1} fill="url(#colorProcesses)" />
                  </AreaChart>
                </ResponsiveContainer>
              </AIChartContainer>

              {/* Project Status Distribution - AI Enhanced */}
              <AIChartContainer
                title="Project Status Distribution"
                description="Current status of all projects"
                timeRanges={[
                  { label: "Current", value: "current" },
                  { label: "Last Month", value: "1m" },
                ]}
                metrics={[
                  { label: "Active", value: "active", color: "var(--chart-1)" },
                  { label: "Completed", value: "completed", color: "var(--chart-4)" },
                ]}
                onExport={() => downloadCSV(projectStatusData, 'project-status.csv')}
                onRefresh={() => window.location.reload()}
              >

                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }: any) => `${name}: ${value}`}
                      labelLine={false}
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </AIChartContainer>
            </div>

            {/* Second Charts Row - AI Enhanced */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Compliance Score Trend - AI Enhanced */}
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
                onExport={() => downloadCSV(complianceTrendData, 'compliance-trend.csv')}
                onRefresh={() => window.location.reload()}
              >

                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={complianceTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis domain={[60, 100]} className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="var(--chart-1)" strokeWidth={2} dot={{ fill: 'var(--chart-1)' }} />
                  </LineChart>
                </ResponsiveContainer>
              </AIChartContainer>

              {/* Documents by Type - AI Enhanced */}
              <AIChartContainer
                title="Documents by Type"
                description="Distribution of document types"
                timeRanges={[
                  { label: "Current", value: "current" },
                ]}
                metrics={[
                  { label: "Count", value: "count", color: "var(--chart-2)" },
                ]}
                onExport={() => downloadCSV(documentTypeData, 'document-types.csv')}
                onRefresh={() => window.location.reload()}
              >

                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={documentTypeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="type" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="count" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </AIChartContainer>
            </div>

            {/* AI Insights Row */}
            <div className="grid gap-6 lg:grid-cols-3">
              <AIInsightCard
                title="Compliance Alert"
                insight="ISO 9001 compliance score has improved by 5% this month"
                type="success"
                recommendation="Continue monitoring process performance metrics"
                tags={["ISO 9001", "Compliance"]}
              />
              <AIInsightCard
                title="Document Review Required"
                insight="3 documents are pending review for over 30 days"
                type="warning"
                recommendation="Schedule a document review meeting"
                tags={["Documents", "Review"]}
              />
              <AIInsightCard
                title="Process Optimization"
                insight="Process cycle time has decreased by 12% in Q2"
                type="info"
                recommendation="Review and document best practices"
                tags={["Processes", "Optimization"]}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ProjectsList projects={projects || []} />
              </div>
              <div className="space-y-6">
                <ActivityFeed activities={stats?.recentActivity || []} />
                <ComplianceOverview />
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

