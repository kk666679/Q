'use client';

import { useState } from 'react';
import { HardHat, Building2, AlertTriangle, DollarSign } from 'lucide-react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppHeader } from '@/components/sidebar/app-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChartContainer } from '@/components/ui/chart';
import { useConstruction } from '@/hooks/use-construction';
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
} from 'recharts';
import { 
  AIChartContainer, 
  AIInsightCard
} from '@/sdk/components/ai';

const projects = [
  { id: 1, name: 'Office Tower A', progress: 65, budget: 5000000, spent: 3250000, status: 'on-track' },
  { id: 2, name: 'Residential Complex', progress: 42, budget: 8500000, spent: 3570000, status: 'on-track' },
  { id: 3, name: 'Shopping Mall', progress: 78, budget: 12000000, spent: 10200000, status: 'at-risk' },
];

const safetyMetrics = {
  daysWithoutIncident: 127,
  safetyScore: 94,
  openHazards: 3,
  completedInspections: 45,
};

// Chart data
const budgetData = [
  { project: 'Office Tower A', budget: 5000000, spent: 3250000 },
  { project: 'Residential', budget: 8500000, spent: 3570000 },
  { project: 'Shopping Mall', budget: 12000000, spent: 10200000 },
]

const safetyTrendData = [
  { month: 'Jan', score: 88, incidents: 2 },
  { month: 'Feb', score: 90, incidents: 1 },
  { month: 'Mar', score: 92, incidents: 1 },
  { month: 'Apr', score: 89, incidents: 3 },
  { month: 'May', score: 93, incidents: 0 },
  { month: 'Jun', score: 94, incidents: 1 },
]

const progressData = [
  { week: 'W1', planned: 20, actual: 18 },
  { week: 'W2', planned: 40, actual: 42 },
  { week: 'W3', planned: 60, actual: 55 },
  { week: 'W4', planned: 80, actual: 78 },
  { week: 'W5', planned: 100, actual: 95 },
]

const projectStatusData = [
  { name: 'On Track', value: 8, fill: 'var(--chart-1)' },
  { name: 'At Risk', value: 2, fill: 'var(--chart-2)' },
  { name: 'Delayed', value: 1, fill: 'var(--chart-3)' },
]

const chartConfig = {
  budget: { label: 'Budget', color: 'var(--chart-1)' },
  spent: { label: 'Spent', color: 'var(--chart-2)' },
  score: { label: 'Safety Score', color: 'var(--chart-1)' },
  incidents: { label: 'Incidents', color: 'var(--chart-2)' },
  planned: { label: 'Planned', color: 'var(--chart-1)' },
  actual: { label: 'Actual', color: 'var(--chart-2)' },
}

export default function ConstructionPage() {
  const { estimateCost, calculateSchedule, assessSafety, detectClashes, loading, error } = useConstruction();
  const [selectedProject, setSelectedProject] = useState('1');
  
  const handleEstimate = async () => {
    try {
      await estimateCost('commercial_office', 25000, {
        customDesign: true,
        sustainableMaterials: true,
        complexSite: false,
      });
    } catch (err) {
      console.error('Estimate failed:', err);
    }
  };

  const handleSchedule = async () => {
    try {
      await calculateSchedule('proj-1', [
        { name: 'Site Prep', duration: 14, predecessors: [] },
        { name: 'Foundation', duration: 30, predecessors: ['Site Prep'] },
        { name: 'Structure', duration: 60, predecessors: ['Foundation'] },
        { name: 'Interior', duration: 45, predecessors: ['Structure'] },
      ]);
    } catch (err) {
      console.error('Schedule failed:', err);
    }
  };

  const handleSafety = async () => {
    try {
      await assessSafety('proj-1', 'Inspector A');
    } catch (err) {
      console.error('Safety assessment failed:', err);
    }
  };

  const handleClashDetection = async () => {
    try {
      await detectClashes(['model-1', 'model-2'], ['structural', 'mechanical', 'electrical']);
    } catch (err) {
      console.error('Clash detection failed:', err);
    }
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Construction" description="Project management and safety tracking" />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{projects.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Safety Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{safetyMetrics.safetyScore}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Days Without Incident</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{safetyMetrics.daysWithoutIncident}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Open Hazards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{safetyMetrics.openHazards}</div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row - AI Enhanced */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Budget vs Actual - AI Enhanced */}
              <AIChartContainer
                title="Budget vs Actual Spending"
                description="Project budget comparison"
                timeRanges={[
                  { label: "Q1", value: "q1" },
                  { label: "Q2", value: "q2" },
                  { label: "Q3", value: "q3" },
                ]}
                metrics={[
                  { label: "Budget", value: "budget", color: "var(--chart-1)" },
                  { label: "Spent", value: "spent", color: "var(--chart-2)" },
                ]}
                onExport={() => console.log('Export budget')}
                onRefresh={() => console.log('Refresh budget')}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgetData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="project" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(value) => `$${(value/1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="budget" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="spent" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </AIChartContainer>

              {/* Safety Trend - AI Enhanced */}
              <AIChartContainer
                title="Safety Score Trend"
                description="Monthly safety performance"
                timeRanges={[
                  { label: "1M", value: "1m" },
                  { label: "3M", value: "3m" },
                  { label: "6M", value: "6m" },
                  { label: "1Y", value: "1y" },
                ]}
                metrics={[
                  { label: "Score", value: "score", color: "var(--chart-1)" },
                  { label: "Incidents", value: "incidents", color: "var(--chart-2)" },
                ]}
                onExport={() => console.log('Export safety')}
                onRefresh={() => console.log('Refresh safety')}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={safetyTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSafety" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis domain={[80, 100]} className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="score" stroke="var(--chart-1)" fillOpacity={1} fill="url(#colorSafety)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </AIChartContainer>
            </div>

            {/* AI Insights Row */}
            <div className="grid gap-6 lg:grid-cols-3">
              <AIInsightCard
                title="Project Performance"
                insight="2 of 3 projects are on track with budget utilization at 68%"
                type="success"
                recommendation="Continue monitoring the Shopping Mall project which is at risk"
                tags={["Projects", "Budget"]}
              />
              <AIInsightCard
                title="Safety Alert"
                insight="Safety score improved to 94%, 127 days without incident"
                type="success"
                recommendation="Recognize team for maintaining strong safety standards"
                tags={["Safety", "Performance"]}
              />
              <AIInsightCard
                title="Hazard Warning"
                insight="3 open hazards require immediate attention"
                type="warning"
                recommendation="Schedule safety review meeting to address pending hazards"
                tags={["Safety", "Action Required"]}
              />
            </div>

            {/* Second Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Project Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <LineChart data={progressData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="week" className="text-xs" />
                      <YAxis domain={[0, 100]} className="text-xs" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="planned" stroke="var(--chart-1)" strokeWidth={2} />
                      <Line type="monotone" dataKey="actual" stroke="var(--chart-2)" strokeWidth={2} />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Project Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <PieChart>
                      <Pie
                        data={projectStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {projectStatusData.map((entry, index) => (
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

            <Tabs defaultValue="projects">
              <TabsList>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="safety">Safety</TabsTrigger>
                <TabsTrigger value="bim">BIM</TabsTrigger>
              </TabsList>

              <TabsContent value="projects" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {projects.map((project) => (
                        <div key={project.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Building2 className="h-6 w-6 text-blue-600" />
                              <div>
                                <p className="font-medium">{project.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <Badge variant={project.status === 'on-track' ? 'default' : 'destructive'}>
                              {project.status}
                            </Badge>
                          </div>
                          <Progress value={project.progress} />
                          <p className="text-xs text-muted-foreground text-right">{project.progress}% complete</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="safety">
                <Card>
                  <CardHeader>
                    <CardTitle>Safety Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Safety inspections, hazard tracking, and incident reporting</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bim">
                <Card>
                  <CardHeader>
                    <CardTitle>BIM Integration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Building Information Modeling and 3D visualization</p>
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

