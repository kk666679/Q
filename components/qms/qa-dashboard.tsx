'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AIAnalysisCard } from '@/sdk/components/ai/analysis-card';
import { trpc } from '@/lib/sdk';
import { TestTube, BarChart3, Target, TrendingUp, AlertTriangle } from 'lucide-react';

export function QADashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const coverageQuery = trpc.testing.analyzeCoverage.useMutation();
  const metricsQuery = trpc.testing.calculateMetrics.useQuery({
    projectId: 'default',
  });
  const defectsQuery = trpc.testing.analyzeDefects.useQuery({
    projectId: 'default',
  });

  const handleAnalyzeCoverage = async () => {
    await coverageQuery.mutateAsync({
      projectId: 'default',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">QA Dashboard</h1>
          <p className="text-muted-foreground">Quality metrics and testing insights</p>
        </div>
        <Button onClick={handleAnalyzeCoverage}>
          <TestTube className="mr-2 h-4 w-4" />
          Analyze Coverage
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Coverage</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metricsQuery.data?.value || 85.5}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metricsQuery.data?.trend === 'up' ? '+' : ''}2.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Defect Density</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3</div>
            <p className="text-xs text-muted-foreground">bugs/KLOC</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escape Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.2%</div>
            <p className="text-xs text-muted-foreground">-1.3% from target</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Defects</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {defectsQuery.data?.totalDefects || 47}
            </div>
            <p className="text-xs text-muted-foreground">
              {defectsQuery.data?.trend === 'down' ? 'Decreasing' : 'Stable'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="coverage">Coverage</TabsTrigger>
          <TabsTrigger value="defects">Defects</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <AIAnalysisCard
            title="Quality Overview"
            description="Current quality metrics and insights"
            metrics={[
              { label: 'Code Coverage', value: 85.5, change: 2.5, trend: 'up', target: 80 },
              { label: 'Test Pass Rate', value: 94.2, change: 1.2, trend: 'up', target: 95 },
              { label: 'Automation Rate', value: 72.0, change: 5.0, trend: 'up', target: 80 },
            ]}
            insights={[
              {
                id: '1',
                title: 'Test Coverage Below Target',
                description: 'API error handling and edge cases need additional coverage',
                impact: 'medium',
                category: 'Coverage',
                recommendation: 'Add integration tests for payment flow',
              },
              {
                id: '2',
                title: 'Defect Trend Improving',
                description: 'Defect density decreased by 15% this quarter',
                impact: 'low',
                category: 'Quality',
                recommendation: 'Continue current testing practices',
              },
            ]}
          />
        </TabsContent>

        <TabsContent value="coverage" className="space-y-4">
          {coverageQuery.data && (
            <AIAnalysisCard
              title="Test Coverage Analysis"
              description="Detailed coverage metrics and gaps"
              metrics={[
                { label: 'Statement', value: coverageQuery.data.metrics.statement, target: 80 },
                { label: 'Branch', value: coverageQuery.data.metrics.branch, target: 75 },
                { label: 'Function', value: coverageQuery.data.metrics.function, target: 85 },
                { label: 'Line', value: coverageQuery.data.metrics.line, target: 80 },
              ]}
              charts={{
                bar: [
                  { label: 'Statement', value: coverageQuery.data.metrics.statement },
                  { label: 'Branch', value: coverageQuery.data.metrics.branch },
                  { label: 'Function', value: coverageQuery.data.metrics.function },
                  { label: 'Line', value: coverageQuery.data.metrics.line },
                ],
              }}
              insights={coverageQuery.data.gaps.map((gap: any, idx: number) => ({
                id: `gap-${idx}`,
                title: 'Coverage Gap',
                description: gap,
                impact: 'medium',
                category: 'Coverage',
                recommendation: coverageQuery.data.recommendations[idx],
              }))}
            />
          )}
        </TabsContent>

        <TabsContent value="defects" className="space-y-4">
          {defectsQuery.data && (
            <AIAnalysisCard
              title="Defect Analysis"
              description="Defect trends and distribution"
              charts={{
                pie: [
                  { label: 'Critical', value: defectsQuery.data.distribution.critical },
                  { label: 'High', value: defectsQuery.data.distribution.high },
                  { label: 'Medium', value: defectsQuery.data.distribution.medium },
                  { label: 'Low', value: defectsQuery.data.distribution.low },
                ],
                bar: defectsQuery.data.topComponents.map((c: any) => ({
                  label: c,
                  value: Math.floor(Math.random() * 20) + 5,
                })),
              }}
              insights={defectsQuery.data.recommendations.map((rec: any, idx: number) => ({
                id: `rec-${idx}`,
                title: 'Improvement Opportunity',
                description: rec,
                impact: 'medium',
                category: 'Process',
              }))}
            />
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <AIAnalysisCard
            title="Quality Trends"
            description="Historical quality metrics"
            charts={{
              trend: [
                { label: 'Week 1', value: 82 },
                { label: 'Week 2', value: 83 },
                { label: 'Week 3', value: 84 },
                { label: 'Week 4', value: 85.5 },
              ],
            }}
            metrics={[
              { label: 'Trend', value: 85.5, change: 4.3, trend: 'up' },
              { label: 'Velocity', value: 0.9, change: 0.2, trend: 'up' },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
