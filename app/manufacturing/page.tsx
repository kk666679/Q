'use client';

import { Factory, TrendingUp, AlertCircle, Activity, Shield } from 'lucide-react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppHeader } from '@/components/sidebar/app-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { downloadCSV } from '@/lib/exportUtils';

import {
  AIChartContainer,
  AIInsightCard,
  AIMetricCard,
  AIProgressCard,
  AIRiskAssessmentCard,
  AIActionCard
} from '@/sdk/components/ai';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
} from 'recharts';

const oeeData = {
  availability: 92.5,
  performance: 88.3,
  quality: 95.7,
  oee: 78.2,
};

const productionLines = [
  { id: 'line-1', name: ' Assembly Line 1', status: 'running', oee: 78.2 },
  { id: 'line-2', name: ' Assembly Line 2', status: 'running', oee: 82.5 },
  { id: 'line-3', name: 'Packaging Line', status: 'maintenance', oee: 0 },
];

const oeeTrendData = [
  { month: 'Jan', availability: 88, performance: 85, quality: 94, oee: 70 },
  { month: 'Feb', availability: 90, performance: 86, quality: 95, oee: 73 },
  { month: 'Mar', availability: 91, performance: 87, quality: 94, oee: 74 },
  { month: 'Apr', availability: 89, performance: 88, quality: 96, oee: 75 },
  { month: 'May', availability: 92, performance: 89, quality: 95, oee: 77 },
  { month: 'Jun', availability: 92.5, performance: 88.3, quality: 95.7, oee: 78.2 },
];

const productionOutputData = [
  { week: 'W1', output: 4200, target: 4500 },
  { week: 'W2', output: 4350, target: 4500 },
  { week: 'W3', output: 4100, target: 4500 },
  { week: 'W4', output: 4450, target: 4500 },
  { week: 'W5', output: 4600, target: 4500 },
  { week: 'W6', output: 4550, target: 4500 },
];

const qualityMetricsData = [
  { metric: 'Defect Rate', value: 85, fullMark: 100 },
  { metric: 'First Pass Yield', value: 92, fullMark: 100 },
  { metric: 'Scrap Rate', value: 78, fullMark: 100 },
  { metric: 'Rework Rate', value: 88, fullMark: 100 },
  { metric: 'Customer Returns', value: 95, fullMark: 100 },
  { metric: 'Process Capability', value: 82, fullMark: 100 },
];

const downtimeData = [
  { reason: 'Maintenance', hours: 12, fill: 'var(--chart-1)' },
  { reason: 'Material Shortage', hours: 8, fill: 'var(--chart-2)' },
  { reason: 'Equipment Failure', hours: 5, fill: 'var(--chart-3)' },
  { reason: 'Quality Holds', hours: 3, fill: 'var(--chart-4)' },
  { reason: 'Shift Change', hours: 2, fill: 'var(--chart-5)' },
];

export default function ManufacturingPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Manufacturing" description="OEE monitoring and production analytics" />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <AIMetricCard
                title="OEE"
                value={oeeData.oee}
                icon={Activity}
                gradient="from-blue-500/80 to-cyan-500/80"
                trend="up"
                change="+8.2%"
                suffix="%"
              />
              <AIMetricCard
                title="Availability"
                value={oeeData.availability}
                icon={Factory}
                gradient="from-green-500/80 to-emerald-500/80"
                trend="up"
                change="+4.5%"
                suffix="%"
              />
              <AIMetricCard
                title="Performance"
                value={oeeData.performance}
                icon={TrendingUp}
                gradient="from-orange-500/80 to-amber-500/80"
                trend="up"
                change="+3.3%"
                suffix="%"
              />
              <AIMetricCard
                title="Quality"
                value={oeeData.quality}
                icon={Shield}
                gradient="from-purple-500/80 to-pink-500/80"
                trend="up"
                change="+1.7%"
                suffix="%"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <AIChartContainer
                title="OEE Trend"
                description="Overall Equipment Effectiveness over time"
                timeRanges={[
                  { label: "1M", value: "1m" },
                  { label: "3M", value: "3m" },
                  { label: "6M", value: "6m" },
                  { label: "1Y", value: "1y" },
                ]}
                metrics={[{ label: "OEE", value: "oee", color: "var(--chart-4)" }]}
                onExport={() => downloadCSV(oeeTrendData, 'oee-trend.csv')}
                onRefresh={() => window.location.reload()}
              >

                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={oeeTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorOee" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-4)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--chart-4)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis domain={[60, 100]} className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="oee" stroke="var(--chart-4)" fillOpacity={1} fill="url(#colorOee)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </AIChartContainer>

              <AIChartContainer
                title="Production Output vs Target"
                description="Weekly production performance"
                timeRanges={[
                  { label: "Last 6 Weeks", value: "6w" },
                  { label: "Last Quarter", value: "3m" },
                ]}
                metrics={undefined as any}
                onExport={() => console.log('Export')}
                onRefresh={() => console.log('Refresh')}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productionOutputData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="week" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="output" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </AIChartContainer>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <AIChartContainer
                title="OEE Components Over Time"
                description="Availability, Performance, Quality trends"
                timeRanges={[
                  { label: "1M", value: "1m" },
                  { label: "3M", value: "3m" },
                  { label: "6M", value: "6m" },
                ]}
                metrics={undefined as any}
                onExport={() => console.log('Export')}
                onRefresh={() => console.log('Refresh')}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={oeeTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis domain={[80, 100]} className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="availability" stroke="var(--chart-1)" strokeWidth={2} />
                    <Line type="monotone" dataKey="performance" stroke="var(--chart-2)" strokeWidth={2} />
                    <Line type="monotone" dataKey="quality" stroke="var(--chart-3)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </AIChartContainer>

              <AIChartContainer
                title="Quality Metrics"
                description="Multi-dimensional quality assessment"
                timeRanges={[
                  { label: "Current", value: "current" },
                ]}
                metrics={undefined as any}
                onExport={() => console.log('Export')}
                onRefresh={() => console.log('Refresh')}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={qualityMetricsData}>
                    <PolarGrid className="stroke-muted" />
                    <PolarAngleAxis dataKey="metric" className="text-xs" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} className="text-xs" />
                    <Radar name="Score" dataKey="value" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </AIChartContainer>
            </div>

            <AIChartContainer
              title="Downtime Analysis"
              description="Breakdown of production downtime by reason"
              timeRanges={[
                { label: "This Month", value: "1m" },
                { label: "Last Quarter", value: "3m" },
              ]}
              metrics={undefined as any}
              onExport={() => console.log('Export')}
              onRefresh={() => console.log('Refresh')}
            >
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={downtimeData} layout="vertical" margin={{ top: 10, right: 10, left: 60, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="reason" type="category" className="text-xs" width={80} />
                  <Tooltip />
                  <Bar dataKey="hours" radius={[0, 4, 4, 0]}>
                    {downtimeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </AIChartContainer>

            <div className="grid gap-6 lg:grid-cols-3">
              <AIInsightCard
                title="OEE Improvement"
                insight="OEE has improved by 8.2% over the past 6 months, reaching 78.2%"
                type="success"
                recommendation="Continue monitoring equipment performance to maintain the upward trend"
                tags={["OEE", "Performance"]}
              />
              <AIInsightCard
                title="Maintenance Alert"
                insight="Packaging Line has been in maintenance for 48 hours"
                type="warning"
                recommendation="Review maintenance schedule and ensure timely completion"
                tags={["Maintenance", "Equipment"]}
              />
              <AIInsightCard
                title="Quality Excellence"
                insight="Quality rate at 95.7% exceeds the target of 95%"
                type="success"
                recommendation="Document best practices from high-performing production lines"
                tags={["Quality", "Best Practices"]}
              />
            </div>

            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="lines">Production Lines</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Production Lines Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {productionLines.map((line) => (
                        <div key={line.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <Factory className="h-8 w-8 text-blue-600" />
                            <div>
                              <p className="font-medium">{line.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {line.status === 'running' ? 'Running' : 'Maintenance'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant={line.status === 'running' ? 'default' : 'secondary'}>
                              {line.status}
                            </Badge>
                            <div className="text-right">
                              <p className="text-2xl font-bold">{line.oee}%</p>
                              <p className="text-xs text-muted-foreground">OEE</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="lines">
                <Card>
                  <CardHeader>
                    <CardTitle>Line Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Detailed production line metrics and controls</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Production Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Historical trends and predictive analytics</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

