'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import type { KPISignal, ComplianceDashboardState } from '@/components/my-standards/types/foundation';
import { AlertCircle, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

interface RegistryKPIDashboardProps {
  kpiSignals?: KPISignal[];
  complianceState?: ComplianceDashboardState;
  loading?: boolean;
}

/**
 * Registry-Driven KPI Dashboard
 * Displays KPI signals and compliance metrics aggregated from workflow execution
 */
export function RegistryKPIDashboard({
  kpiSignals = [],
  complianceState,
  loading = false,
}: RegistryKPIDashboardProps) {
  const [stats, setStats] = useState({
    totalKPIs: 0,
    greenCount: 0,
    yellowCount: 0,
    redCount: 0,
    avgComplianceScore: 0,
  });

  useEffect(() => {
    const green = kpiSignals.filter(k => k.status === 'green').length;
    const yellow = kpiSignals.filter(k => k.status === 'yellow').length;
    const red = kpiSignals.filter(k => k.status === 'red').length;
    const avg = complianceState?.complianceScore ?? 0;

    setStats({
      totalKPIs: kpiSignals.length,
      greenCount: green,
      yellowCount: yellow,
      redCount: red,
      avgComplianceScore: avg,
    });
  }, [kpiSignals, complianceState]);

  // Group KPIs by category
  const kpisByCategory = React.useMemo(() => {
    const grouped: Record<string, KPISignal[]> = {};
    kpiSignals.forEach(kpi => {
      if (!grouped[kpi.category]) {
        grouped[kpi.category] = [];
      }
      grouped[kpi.category].push(kpi);
    });
    return grouped;
  }, [kpiSignals]);

  // Chart data
  const statusChartData = [
    { name: 'Compliant', value: stats.greenCount, color: '#10b981' },
    { name: 'Warning', value: stats.yellowCount, color: '#f59e0b' },
    { name: 'Non-Compliant', value: stats.redCount, color: '#ef4444' },
  ].filter(d => d.value > 0);

  const categoryChartData = Object.entries(kpisByCategory).map(([category, kpis]) => ({
    category,
    count: kpis.length,
    avg: Math.round(kpis.reduce((sum, k) => sum + k.value, 0) / kpis.length),
  }));

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'green':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'yellow':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'red':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'green':
        return <Badge className="bg-green-500/20 text-green-700">Healthy</Badge>;
      case 'yellow':
        return <Badge className="bg-yellow-500/20 text-yellow-700">Warning</Badge>;
      case 'red':
        return <Badge className="bg-red-500/20 text-red-700">Critical</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>KPI Dashboard</CardTitle>
            <CardDescription>Loading compliance metrics...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-center justify-center text-muted-foreground">
              Loading KPI signals...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total KPIs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalKPIs}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Metrics tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Compliance Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.avgComplianceScore}%
            </div>
            <Progress value={stats.avgComplianceScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Healthy KPIs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.greenCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              No issues detected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.redCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {statusChartData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Distribution</CardTitle>
              <CardDescription>Status breakdown of all KPIs</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {categoryChartData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>KPIs by Category</CardTitle>
                <CardDescription>Count and average value per category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* KPI Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>KPI Details</CardTitle>
          <CardDescription>Individual metrics and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          {kpiSignals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No KPI signals recorded yet. Run a workflow to generate metrics.
            </div>
          ) : (
            <div className="space-y-2">
              {kpiSignals.map((kpi) => (
                <div
                  key={kpi.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(kpi.status)}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{kpi.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Category: {kpi.category}
                        {kpi.unit && ` • Unit: ${kpi.unit}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-sm">{kpi.value}</p>
                      {kpi.threshold && (
                        <p className="text-xs text-muted-foreground">
                          Threshold: {kpi.threshold}
                        </p>
                      )}
                    </div>
                    {getStatusBadge(kpi.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compliance Findings */}
      {complianceState && (
        <Card>
          <CardHeader>
            <CardTitle>Compliance Status</CardTitle>
            <CardDescription>Overall compliance state and non-conformances</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Overall Status</p>
                <p className="text-lg font-semibold capitalize">
                  {complianceState.overallStatus}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Compliance Score</p>
                <p className="text-lg font-semibold">
                  {complianceState.complianceScore}%
                </p>
              </div>
            </div>

            {complianceState.nonconformances && complianceState.nonconformances.length > 0 && (
              <div>
                <p className="font-medium text-sm mb-2">
                  Non-Conformances ({complianceState.nonconformances.length})
                </p>
                <div className="space-y-2">
                  {complianceState.nonconformances.map((nc) => (
                    <div key={nc.id} className="p-2 rounded border border-border text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{nc.standard}</span>
                        <Badge variant="outline">{nc.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Severity: {nc.severity} 
                        {nc.dueDays && ` • Due in ${nc.dueDays} days`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default RegistryKPIDashboard;
