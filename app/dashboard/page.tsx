'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppHeader } from '@/components/sidebar/app-header';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { ComplianceOverview } from '@/components/dashboard/compliance-overview';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { ProjectsList } from '@/components/dashboard/projects-list';
import { trpc } from '@/lib/sdk';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import { downloadCSV } from '@/lib/exportUtils';
import {
  AIChartContainer,
  AIInsightCard,
} from '@/sdk/components/ai/index';
import {
  TrendingUp, TrendingDown, Minus,
  ShieldAlert, Bell, CheckCircle2, AlertTriangle,
} from 'lucide-react';

// ── Static chart seeds (trend visualisation) ──────────────────────────────────
const complianceTrendData = [
  { month: 'Jan', score: 78 }, { month: 'Feb', score: 82 },
  { month: 'Mar', score: 79 }, { month: 'Apr', score: 85 },
  { month: 'May', score: 88 }, { month: 'Jun', score: 91 },
];
const activityTrendData = [
  { month: 'Jan', documents: 12, processes: 8 },
  { month: 'Feb', documents: 19, processes: 12 },
  { month: 'Mar', documents: 15, processes: 10 },
  { month: 'Apr', documents: 22, processes: 15 },
  { month: 'May', documents: 18, processes: 11 },
  { month: 'Jun', documents: 25, processes: 18 },
];

// ── KPI status helpers ────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'on-track': 'bg-emerald-500/15 text-emerald-600 border-emerald-200',
    'at-risk':  'bg-amber-500/15  text-amber-600  border-amber-200',
    'breached': 'bg-red-500/15    text-red-600    border-red-200',
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${map[status] ?? ''}`}>{status}</span>;
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === 'up')   return <TrendingUp   className="size-4 text-emerald-500" />;
  if (trend === 'down') return <TrendingDown  className="size-4 text-red-500" />;
  return <Minus className="size-4 text-muted-foreground" />;
}

function NotifPriorityIcon({ priority }: { priority: string }) {
  if (priority === 'critical') return <ShieldAlert className="size-4 text-red-500" />;
  if (priority === 'high')     return <AlertTriangle className="size-4 text-amber-500" />;
  return <Bell className="size-4 text-muted-foreground" />;
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: rawStats }      = trpc.dashboard.getStats.useQuery();
  const { data: projects }      = trpc.project.list.useQuery();
  const { data: kpis = [] }     = trpc.kpi.list.useQuery();
  const { data: notifs = [] }   = trpc.notification.list.useQuery({ unreadOnly: false });
  const { data: trainSum }      = trpc.training.summary.useQuery();
  const { data: supplierCard }  = trpc.supplier.scorecard.useQuery();
  const { data: healthData }    = trpc.health.check.useQuery();

  const stats = rawStats ? {
    totalProjects:      rawStats.totalProjects,
    activeProjects:     rawStats.activeProjects,
    totalDocuments:     rawStats.totalDocuments,
    averageCompliance:  rawStats.complianceScore,
    documentsThisMonth: rawStats.approvedDocuments,
    scansThisWeek:      0,
    recentActivity:     (rawStats.recentActivity as any[]).map((a) => ({
      type:   'document' as const,
      action: 'updated',
      item:   (a as any).title ?? 'QMS item',
      time:   (a as any).timestamp ? new Date((a as any).timestamp).toLocaleDateString() : 'recently',
    })),
  } : { totalProjects: 0, activeProjects: 0, totalDocuments: 0, averageCompliance: 0, documentsThisMonth: 0, scansThisWeek: 0, recentActivity: [] };

  const unreadNotifs = notifs.filter((n: any) => !n.isRead);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader
          title="Enterprise Dashboard"
          description={`QMS Intelligence Platform${healthData ? ` · ${healthData.agents} agents active` : ''}`}
        />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">

            {/* KPI Summary Cards */}
            <StatsCards stats={stats} />

            {/* Live KPI Grid */}
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Live KPI Dashboard</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {kpis.map((kpi: any) => (
                  <Card key={kpi.id} className="relative overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-muted-foreground truncate pr-2">{kpi.name}</span>
                        <TrendIcon trend={kpi.trend} />
                      </div>
                      <div className="flex items-end gap-2 mb-2">
                        <span className="text-2xl font-bold tabular-nums">{kpi.value}</span>
                        <span className="text-sm text-muted-foreground mb-0.5">{kpi.unit}</span>
                      </div>
                      <Progress
                        value={kpi.unit === 'count' ? Math.max(0, 100 - kpi.value * 10) : Math.min(kpi.value, 100)}
                        className="h-1.5 mb-2"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Target: {kpi.target}{kpi.unit}</span>
                        <StatusBadge status={kpi.status} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              <AIChartContainer
                title="Compliance Score Trend"
                description="Monthly ISO compliance score"
                timeRanges={[{ label: '6M', value: '6m' }, { label: '1Y', value: '1y' }]}
                metrics={[{ label: 'Score', value: 'score', color: 'var(--chart-1)' }]}
                onExport={() => downloadCSV(complianceTrendData, 'compliance-trend.csv')}
                onRefresh={() => window.location.reload()}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={complianceTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis domain={[60, 100]} className="text-xs" />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="var(--chart-1)" strokeWidth={2} dot={{ fill: 'var(--chart-1)' }} />
                  </LineChart>
                </ResponsiveContainer>
              </AIChartContainer>

              <AIChartContainer
                title="Document & Process Activity"
                description="Monthly creation trends"
                timeRanges={[{ label: '3M', value: '3m' }, { label: '6M', value: '6m' }]}
                metrics={[{ label: 'Documents', value: 'documents', color: 'var(--chart-2)' }]}
                onExport={() => downloadCSV(activityTrendData, 'activity-trends.csv')}
                onRefresh={() => window.location.reload()}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gDoc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="var(--chart-1)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip /><Legend />
                    <Area type="monotone" dataKey="documents" stroke="var(--chart-1)" fill="url(#gDoc)" />
                    <Area type="monotone" dataKey="processes" stroke="var(--chart-2)" fill="transparent" />
                  </AreaChart>
                </ResponsiveContainer>
              </AIChartContainer>
            </div>

            {/* Supplemental cards: Training, Supplier, Notifications */}
            <div className="grid gap-6 lg:grid-cols-3">

              {/* Training summary */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Training & Competency</CardTitle>
                  <CardDescription>ISO 7.2 — workforce compliance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trainSum ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Completion rate</span>
                        <span className="font-semibold">{trainSum.completionRate}%</span>
                      </div>
                      <Progress value={trainSum.completionRate} className="h-2" />
                      <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                        <div><div className="font-bold text-emerald-600">{trainSum.completed}</div><div className="text-muted-foreground">Completed</div></div>
                        <div><div className="font-bold text-amber-600">{trainSum.planned}</div><div className="text-muted-foreground">Planned</div></div>
                        <div><div className="font-bold text-red-600">{trainSum.expired}</div><div className="text-muted-foreground">Expired</div></div>
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">Loading…</div>
                  )}
                </CardContent>
              </Card>

              {/* Supplier scorecard */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Supplier Quality</CardTitle>
                  <CardDescription>ISO 8.4 — external provider control</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {supplierCard ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Avg quality score</span>
                        <span className="font-semibold">{supplierCard.avgScore.toFixed(1)}</span>
                      </div>
                      <Progress value={supplierCard.avgScore} className="h-2" />
                      <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                        <div><div className="font-bold text-emerald-600">{supplierCard.approved}</div><div className="text-muted-foreground">Approved</div></div>
                        <div><div className="font-bold text-amber-600">{supplierCard.suspended}</div><div className="text-muted-foreground">Suspended</div></div>
                        <div><div className="font-bold text-red-600">{supplierCard.highRisk}</div><div className="text-muted-foreground">High Risk</div></div>
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">Loading…</div>
                  )}
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    Notifications
                    {unreadNotifs.length > 0 && (
                      <Badge variant="destructive" className="h-5 px-1.5 text-xs">{unreadNotifs.length}</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>Alerts requiring attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {notifs.slice(0, 4).map((n: any) => (
                    <div key={n.id} className={`flex items-start gap-2 p-2 rounded-md text-xs ${n.isRead ? 'opacity-60' : 'bg-muted/50'}`}>
                      <NotifPriorityIcon priority={n.priority} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{n.title}</div>
                        <div className="text-muted-foreground line-clamp-1">{n.message}</div>
                      </div>
                      {!n.isRead && <div className="size-1.5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* AI Insights */}
            <div className="grid gap-6 lg:grid-cols-3">
              <AIInsightCard title="Compliance Improving"   insight="ISO 9001 score rose 13pts over 6 months (+5% MoM)" type="success" recommendation="Continue monitoring process performance metrics" tags={['ISO 9001', 'Compliance']} />
              <AIInsightCard title="CAPA Action Required"   insight={`${kpis.find((k: any) => k.id === 'capa-overdue')?.value ?? 2} overdue CAPAs — risk of audit finding`}  type="warning" recommendation="Assign owners and set firm closure dates" tags={['CAPA', 'Audit']} />
              <AIInsightCard title="Supplier Risk Detected" insight="1 supplier suspended with quality score below 50" type="warning" recommendation="Initiate supplier CAPA and evaluate alternatives" tags={['Supplier', 'Risk']} />
            </div>

            {/* Projects + Activity + Compliance */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ProjectsList projects={projects ?? []} />
              </div>
              <div className="space-y-6">
                <ActivityFeed activities={stats.recentActivity ?? []} />
                <ComplianceOverview />
              </div>
            </div>

          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
