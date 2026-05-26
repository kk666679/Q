'use client';

import { useState } from 'react';
import { Shield, FileText, DollarSign, TrendingUp } from 'lucide-react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppHeader } from '@/components/sidebar/app-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartContainer } from '@/components/ui/chart';
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

const stats = {
  activePolicies: 1247,
  pendingClaims: 23,
  totalPremium: 2450000,
  claimRatio: 68.5,
};

const recentClaims = [
  { id: 'CLM-001', policy: 'POL-2024-1234', amount: 15000, status: 'pending' },
  { id: 'CLM-002', policy: 'POL-2024-5678', amount: 8500, status: 'approved' },
  { id: 'CLM-003', policy: 'POL-2024-9012', amount: 22000, status: 'review' },
];

// Chart data
const claimsByTypeData = [
  { name: 'Auto', value: 45, fill: 'var(--chart-1)' },
  { name: 'Home', value: 28, fill: 'var(--chart-2)' },
  { name: 'Life', value: 15, fill: 'var(--chart-3)' },
  { name: 'Health', value: 12, fill: 'var(--chart-4)' },
]

const premiumTrendData = [
  { month: 'Jan', premium: 2100000, claims: 1450000 },
  { month: 'Feb', premium: 2250000, claims: 1520000 },
  { month: 'Mar', premium: 2180000, claims: 1380000 },
  { month: 'Apr', premium: 2350000, claims: 1600000 },
  { month: 'May', premium: 2420000, claims: 1550000 },
  { month: 'Jun', premium: 2450000, claims: 1680000 },
]

const claimRatioData = [
  { month: 'Jan', ratio: 69 },
  { month: 'Feb', ratio: 68 },
  { month: 'Mar', ratio: 63 },
  { month: 'Apr', ratio: 68 },
  { month: 'May', ratio: 64 },
  { month: 'Jun', ratio: 68.5 },
]

const policyDistributionData = [
  { type: 'Comprehensive', count: 450 },
  { type: 'Third Party', count: 380 },
  { type: 'Full Coverage', count: 280 },
  { type: 'Basic', count: 137 },
]

const chartConfig = {
  premium: { label: 'Premium', color: 'var(--chart-1)' },
  claims: { label: 'Claims', color: 'var(--chart-2)' },
  ratio: { label: 'Claim Ratio', color: 'var(--chart-1)' },
  count: { label: 'Count', color: 'var(--chart-1)' },
}

export default function InsurancePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Insurance" description="Policy and claims management" />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Policies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.activePolicies}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Claims</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{stats.pendingClaims}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Premium</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">${(stats.totalPremium / 1000000).toFixed(2)}M</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Claim Ratio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{stats.claimRatio}%</div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Premium vs Claims Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Premium vs Claims</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <AreaChart data={premiumTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorClaims" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" tickFormatter={(value) => `$${(value/1000000).toFixed(1)}M`} />
                      <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                      <Legend />
                      <Area type="monotone" dataKey="premium" stroke="var(--chart-1)" fillOpacity={1} fill="url(#colorPremium)" />
                      <Area type="monotone" dataKey="claims" stroke="var(--chart-2)" fillOpacity={1} fill="url(#colorClaims)" />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Claims by Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Claims by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <PieChart>
                      <Pie
                        data={claimsByTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {claimsByTypeData.map((entry, index) => (
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

            {/* Second Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Claim Ratio Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Claim Ratio Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <LineChart data={claimRatioData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis domain={[50, 80]} className="text-xs" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="ratio" stroke="var(--chart-1)" strokeWidth={2} dot={{ fill: 'var(--chart-1)' }} />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Policy Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Policy Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <BarChart data={policyDistributionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="type" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Bar dataKey="count" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="claims">
              <TabsList>
                <TabsTrigger value="claims">Claims</TabsTrigger>
                <TabsTrigger value="policies">Policies</TabsTrigger>
                <TabsTrigger value="quotes">Quotes</TabsTrigger>
              </TabsList>

              <TabsContent value="claims" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Claims</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentClaims.map((claim) => (
                        <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <FileText className="h-8 w-8 text-blue-600" />
                            <div>
                              <p className="font-medium">{claim.id}</p>
                              <p className="text-sm text-muted-foreground">{claim.policy}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-lg font-bold">${claim.amount.toLocaleString()}</p>
                            </div>
                            <Badge variant={claim.status === 'approved' ? 'default' : 'secondary'}>
                              {claim.status}
                            </Badge>
                            <Button size="sm">Review</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="policies">
                <Card>
                  <CardHeader>
                    <CardTitle>Policy Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Policy portfolio and underwriting</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="quotes">
                <Card>
                  <CardHeader>
                    <CardTitle>Quote Generation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">AI-powered quote generation and risk assessment</p>
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

