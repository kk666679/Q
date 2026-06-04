'use client';
import * as React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppHeader } from '@/components/sidebar/app-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, PieChart, Gauge, Users, Funnel } from 'lucide-react';

const KPIS = [
  { name:'Revenue MoM',        value:'RM 4.2M', change:'+12.4%', up:true,  owner:'Finance' },
  { name:'Compliance Score',   value:'94%',     change:'+2.1%',  up:true,  owner:'QMS' },
  { name:'Customer Churn',     value:'3.2%',    change:'-0.8%',  up:true,  owner:'CX' },
  { name:'Pipeline SLA Breach',value:'1.4%',    change:'+0.3%',  up:false, owner:'Ops' },
];

export default function AnalyticsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Analytics Studio" description="KPIs · Forecasting · Dashboards · Cohorts · Segmentation" />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-6xl space-y-4">

            {/* KPI strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {KPIS.map(k => (
                <Card key={k.name}>
                  <CardHeader className="pb-1"><CardTitle className="text-xs text-muted-foreground">{k.name}</CardTitle></CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-2xl font-bold">{k.value}</p>
                    <p className={`text-xs font-medium ${k.up ? 'text-emerald-600' : 'text-red-500'}`}>{k.change}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Owner: {k.owner}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Tabs defaultValue="dashboards">
              <TabsList className="h-8">
                <TabsTrigger value="dashboards" className="text-xs gap-1"><BarChart3 className="h-3 w-3"/>Dashboards</TabsTrigger>
                <TabsTrigger value="forecast"   className="text-xs gap-1"><TrendingUp className="h-3 w-3"/>Forecast</TabsTrigger>
                <TabsTrigger value="cohort"     className="text-xs gap-1"><Users className="h-3 w-3"/>Cohorts</TabsTrigger>
                <TabsTrigger value="segment"    className="text-xs gap-1"><PieChart className="h-3 w-3"/>Segments</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboards" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Executive Overview','Compliance Monitor','Sales Performance','Operations Health'].map(d=>(
                    <Card key={d} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center justify-between">
                          {d}
                          <Button size="sm" variant="outline" className="h-6 text-[10px]">Open</Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-24 rounded bg-muted/40 flex items-center justify-center text-xs text-muted-foreground">
                          Dashboard preview
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Card className="border-dashed cursor-pointer hover:bg-muted/20">
                    <CardContent className="h-full flex items-center justify-center py-12 text-xs text-muted-foreground">
                      + New Dashboard
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="forecast" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" /> ARIMA Forecast Builder
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground">Configure time-series data source, horizon, seasonality, and confidence intervals. Supports ARIMA, Prophet, and LSTM models.</p>
                    <div className="h-48 rounded bg-muted/30 flex items-center justify-center text-xs text-muted-foreground">
                      Forecast chart — connect a dataset to render
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="h-7 text-xs">Run Forecast</Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs">Export</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cohort" className="mt-4">
                <Card>
                  <CardHeader><CardTitle className="text-sm">Cohort Analysis</CardTitle></CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    Retention and engagement cohort matrix. Connect a customer events dataset, define cohort window and metric.
                    <div className="mt-3 h-48 rounded bg-muted/30 flex items-center justify-center">
                      Cohort matrix — connect dataset to render
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="segment" className="mt-4">
                <Card>
                  <CardHeader><CardTitle className="text-sm">Segmentation</CardTitle></CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    Rule-based or ML clustering (k-means, RFM) segmentation. Define features, segment count and labelling strategy.
                    <div className="mt-3 h-48 rounded bg-muted/30 flex items-center justify-center">
                      Segment chart — connect dataset to render
                    </div>
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
