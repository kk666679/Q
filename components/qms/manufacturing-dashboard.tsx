'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AIAnalysisCard } from '@/sdk/components/ai/analysis-card';
import { trpc } from '@/lib/sdk';
import { Factory, Gauge, Wrench, Activity, TrendingUp, AlertTriangle } from 'lucide-react';

export function ManufacturingDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const oeeQuery = trpc.manufacturing.calculateOEE.useMutation();
  const maintenanceQuery = trpc.manufacturing.predictMaintenance.useMutation();
  const metricsQuery = trpc.manufacturing.analyzeMetrics.useQuery({
    lineId: 'LINE-01',
    period: '2024-Q1',
    metrics: {
      produced: 1000,
      defective: 25,
      downtime: 45,
      cycleTime: 120,
    },
  });

  const handleCalculateOEE = async () => {
    await oeeQuery.mutateAsync({
      machineId: 'MACHINE-01',
      availability: 92.5,
      performance: 88.0,
      quality: 97.5,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manufacturing Dashboard</h1>
          <p className="text-muted-foreground">Production metrics and equipment monitoring</p>
        </div>
        <Button onClick={handleCalculateOEE}>
          <Gauge className="mr-2 h-4 w-4" />
          Calculate OEE
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OEE</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {oeeQuery.data?.oee || '79.2'}%
            </div>
            <p className="text-xs text-muted-foreground">
              Target: 85% (World Class)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yield Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metricsQuery.data?.yieldRate || '97.5'}%
            </div>
            <p className="text-xs text-muted-foreground">
              +2.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              3 machines need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              2 critical, 3 scheduled
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="oee">OEE Analysis</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <AIAnalysisCard
            title="Production Overview"
            description="Real-time manufacturing metrics"
            metrics={[
              { label: 'Availability', value: 92.5, change: 1.5, trend: 'up', target: 90 },
              { label: 'Performance', value: 88.0, change: -2.0, trend: 'down', target: 90 },
              { label: 'Quality', value: 97.5, change: 0.5, trend: 'up', target: 95 },
            ]}
            insights={[
              {
                id: '1',
                title: 'Performance Below Target',
                description: 'Cycle time increased by 5% due to equipment wear',
                impact: 'medium',
                category: 'Performance',
                recommendation: 'Schedule preventive maintenance for Line 2',
              },
              {
                id: '2',
                title: 'Quality Improvement',
                description: 'Defect rate decreased after process optimization',
                impact: 'low',
                category: 'Quality',
                recommendation: 'Document and standardize new process',
              },
            ]}
          />
        </TabsContent>

        <TabsContent value="oee" className="space-y-4">
          {oeeQuery.data && (
            <AIAnalysisCard
              title="OEE Analysis"
              description="Overall Equipment Effectiveness breakdown"
              metrics={[
                { label: 'OEE', value: parseFloat(oeeQuery.data.oee), target: 85 },
                { label: 'Availability', value: oeeQuery.data.availability, target: 90 },
                { label: 'Performance', value: oeeQuery.data.performance, target: 90 },
                { label: 'Quality', value: oeeQuery.data.quality, target: 95 },
              ]}
              charts={{
                bar: [
                  { label: 'Availability', value: oeeQuery.data.availability },
                  { label: 'Performance', value: oeeQuery.data.performance },
                  { label: 'Quality', value: oeeQuery.data.quality },
                ],
              }}
              insights={oeeQuery.data.recommendations.map((rec: any, idx: number) => ({
                id: `oee-${idx}`,
                title: 'OEE Improvement',
                description: rec,
                impact: 'medium',
                category: 'Efficiency',
              }))}
            />
          )}
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <AIAnalysisCard
            title="Predictive Maintenance"
            description="Equipment health and maintenance predictions"
            charts={{
              pie: [
                { label: 'Healthy', value: 12 },
                { label: 'Monitor', value: 5 },
                { label: 'Maintenance Due', value: 3 },
                { label: 'Critical', value: 2 },
              ],
            }}
            insights={[
              {
                id: 'm1',
                title: 'Critical: Machine M-105',
                description: 'High vibration detected - bearing failure risk',
                impact: 'high',
                category: 'Maintenance',
                recommendation: 'Schedule immediate maintenance',
              },
              {
                id: 'm2',
                title: 'Scheduled: Machine M-203',
                description: 'Operating hours threshold reached',
                impact: 'medium',
                category: 'Maintenance',
                recommendation: 'Schedule maintenance within 1 week',
              },
            ]}
          />
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          {metricsQuery.data && (
            <AIAnalysisCard
              title="Quality Control Metrics"
              description="Statistical process control and quality trends"
              metrics={[
                { label: 'Yield Rate', value: parseFloat(metricsQuery.data.yieldRate), target: 95 },
                { label: 'Defect Rate', value: parseFloat(metricsQuery.data.defectRate), target: 3 },
                { label: 'Efficiency', value: parseFloat(metricsQuery.data.efficiency), target: 85 },
              ]}
              charts={{
                trend: [
                  { label: 'Week 1', value: 96 },
                  { label: 'Week 2', value: 97 },
                  { label: 'Week 3', value: 96.5 },
                  { label: 'Week 4', value: parseFloat(metricsQuery.data.yieldRate) },
                ],
              }}
              insights={metricsQuery.data.recommendations.map((rec: any, idx: number) => ({
                id: `q-${idx}`,
                title: 'Quality Improvement',
                description: rec,
                impact: 'medium',
                category: 'Quality',
              }))}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
