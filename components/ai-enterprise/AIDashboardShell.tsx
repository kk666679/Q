"use client";

import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LayoutDashboard,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Maximize2,
  Minimize2,
  Grid3X3,
  BarChart3,
  PieChart,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Activity,
  Zap,
  Brain,
  Sparkles,
  Target,
  Shield,
  Lightbulb,
  Bot,
  MessageSquare,
  Calendar,
  FileText,
  Database,
  Globe,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Battery,
  Thermometer
} from 'lucide-react';

import { cn } from '@/lib/utils';

import {
  AIInsightCard,
  AIRecommendationPanel,
  AILiveBadge,
  AIAlert,
} from '@/sdk/components/ai';

import {
  Panel,
  Context,
  EnvironmentVariables,
  Reasoning,
  ChainOfThought,
  Task,
  Tool,
  Queue
} from '@/components/ai-elements';

interface DashboardMetric {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  icon?: React.ComponentType<any>;
  color?: string;
  description?: string;
}

interface DashboardAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  source?: string;
}

interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'alert' | 'ai-insight' | 'custom';
  title: string;
  component: React.ReactNode;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number; w: number; h: number };
}

interface AIDashboardShellProps {
  title: string;
  metrics?: DashboardMetric[];
  alerts?: DashboardAlert[];
  widgets?: DashboardWidget[];
  aiInsights?: any[];
  children?: React.ReactNode;
  onMetricClick?: (metric: DashboardMetric) => void;
  onAlertAction?: (alert: DashboardAlert, action: string) => void;
  onWidgetResize?: (widgetId: string, size: any) => void;
  className?: string;
}

interface DashboardContextType {
  metrics: DashboardMetric[];
  alerts: DashboardAlert[];
  isFullscreen: boolean;
  setFullscreen: (fullscreen: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within AIDashboardShell');
  }
  return context;
}

export function AIDashboardShell({
  title,
  metrics = [],
  alerts = [],
  widgets = [],
  aiInsights = [],
  children,
  onMetricClick,
  onAlertAction,
  onWidgetResize,
  className
}: AIDashboardShellProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<DashboardMetric | null>(null);

  const contextValue: DashboardContextType = {
    metrics,
    alerts,
    isFullscreen,
    setFullscreen: setIsFullscreen,
    activeTab,
    setActiveTab
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return AlertCircle;
      case 'warning': return AlertCircle;
      case 'success': return CheckCircle;
      case 'info': return Bell;
      default: return Bell;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-400 border-red-500/20 bg-red-500/10';
      case 'warning': return 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10';
      case 'success': return 'text-green-400 border-green-500/20 bg-green-500/10';
      case 'info': return 'text-blue-400 border-blue-500/20 bg-blue-500/10';
      default: return 'text-slate-400 border-slate-500/20 bg-slate-500/10';
    }
  };

  const systemMetrics: DashboardMetric[] = [
    {
      id: 'cpu',
      label: 'CPU Usage',
      value: 45,
      unit: '%',
      trend: 'stable',
      icon: Cpu,
      color: 'text-blue-400',
      description: 'Current CPU utilization'
    },
    {
      id: 'memory',
      label: 'Memory',
      value: 2.8,
      unit: 'GB',
      trend: 'up',
      trendValue: 0.2,
      icon: HardDrive,
      color: 'text-green-400',
      description: 'RAM usage'
    },
    {
      id: 'network',
      label: 'Network',
      value: 125,
      unit: 'Mbps',
      trend: 'down',
      trendValue: -15,
      icon: Wifi,
      color: 'text-purple-400',
      description: 'Network throughput'
    },
    {
      id: 'uptime',
      label: 'Uptime',
      value: '99.9',
      unit: '%',
      trend: 'stable',
      icon: Activity,
      color: 'text-emerald-400',
      description: 'System availability'
    }
  ];

  const allMetrics = [...systemMetrics, ...metrics];

  return (
    <DashboardContext.Provider value={contextValue}>
      <div className={cn(
        "min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900",
        isFullscreen && "fixed inset-0 z-50",
        className
      )}>
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40"
        >
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-slate-400 hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">{title}</h1>
                  <p className="text-sm text-slate-400">AI-Powered Enterprise Dashboard</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <AILiveBadge status="live" pulse={true} />
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-slate-400 hover:text-white"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </motion.header>

        <div className="flex">
          {/* Sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.aside
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                className="w-64 bg-slate-900/50 backdrop-blur-sm border-r border-slate-700 min-h-[calc(100vh-80px)]"
              >
                <ScrollArea className="h-full p-4">
                  <div className="space-y-6">
                    {/* Navigation */}
                    <div>
                      <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
                        Navigation
                      </h3>
                      <nav className="space-y-1">
                        {[
                          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                          { id: 'compliance', label: 'Compliance', icon: Shield },
                          { id: 'ai-insights', label: 'AI Insights', icon: Brain },
                          { id: 'reports', label: 'Reports', icon: FileText },
                          { id: 'settings', label: 'Settings', icon: Settings }
                        ].map((item) => (
                          <Button
                            key={item.id}
                            variant={activeTab === item.id ? "secondary" : "ghost"}
                            className={cn(
                              "w-full justify-start",
                              activeTab === item.id && "bg-blue-600/20 text-blue-400"
                            )}
                            onClick={() => setActiveTab(item.id)}
                          >
                            <item.icon className="w-4 h-4 mr-3" />
                            {item.label}
                          </Button>
                        ))}
                      </nav>
                    </div>

                    <Separator className="bg-slate-700" />

                    {/* AI Features */}
                    <div>
                      <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
                        AI Features
                      </h3>
                      <div className="space-y-2">
                        <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white">
                          <Bot className="w-4 h-4 mr-3" />
                          AI Assistant
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white">
                          <Sparkles className="w-4 h-4 mr-3" />
                          Smart Recommendations
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white">
                          <Target className="w-4 h-4 mr-3" />
                          Predictive Analytics
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white">
                          <Lightbulb className="w-4 h-4 mr-3" />
                          Anomaly Detection
                        </Button>
                      </div>
                    </div>

                    <Separator className="bg-slate-700" />

                    {/* System Status */}
                    <div>
                      <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
                        System Status
                      </h3>
                      <div className="space-y-2">
                        {systemMetrics.slice(0, 3).map((metric) => (
                          <div key={metric.id} className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg">
                            <div className="flex items-center gap-2">
                              {metric.icon && <metric.icon className={cn("w-4 h-4", metric.color)} />}
                              <span className="text-xs text-slate-300">{metric.label}</span>
                            </div>
                            <span className="text-xs font-medium text-white">
                              {metric.value}{metric.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="grid w-full grid-cols-6 bg-slate-800/50">
                <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                <TabsTrigger value="analytics" className="text-xs">Analytics</TabsTrigger>
                <TabsTrigger value="compliance" className="text-xs">Compliance</TabsTrigger>
                <TabsTrigger value="ai-insights" className="text-xs">AI Insights</TabsTrigger>
                <TabsTrigger value="reports" className="text-xs">Reports</TabsTrigger>
                <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {allMetrics.map((metric, index) => (
                    <motion.div
                      key={metric.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedMetric(metric);
                          onMetricClick?.(metric);
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-slate-400">{metric.label}</p>
                              <p className="text-2xl font-bold text-white">
                                {metric.value}{metric.unit}
                              </p>
                              {metric.trend && (
                                <div className="flex items-center gap-1 mt-1">
                                  <TrendingUp className={cn(
                                    "w-3 h-3",
                                    metric.trend === 'up' && "text-green-400",
                                    metric.trend === 'down' && "text-red-400",
                                    metric.trend === 'stable' && "text-slate-400"
                                  )} />
                                  <span className="text-xs text-slate-400">
                                    {metric.trendValue && `${metric.trendValue > 0 ? '+' : ''}${metric.trendValue}${metric.unit}`}
                                  </span>
                                </div>
                              )}
                            </div>
                            {metric.icon && (
                              <metric.icon className={cn("w-8 h-8", metric.color)} />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Alerts */}
                {alerts.length > 0 && (
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-lg text-white flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Active Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-48">
                        <div className="space-y-2">
                          {alerts.map((alert) => {
                            const Icon = getAlertIcon(alert.type);
                            return (
                              <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={cn(
                                  "p-3 rounded-lg border",
                                  getAlertColor(alert.type)
                                )}
                              >
                                <div className="flex items-start gap-3">
                                  <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <h4 className="font-medium text-white">{alert.title}</h4>
                                      <Badge variant="outline" className="text-xs">
                                        {alert.priority}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-slate-300 mb-2">{alert.message}</p>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-slate-400">
                                        {alert.timestamp.toLocaleTimeString()}
                                      </span>
                                      <div className="flex gap-2">
                                        <Button size="sm" variant="ghost" className="text-xs h-6">
                                          Dismiss
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="text-xs h-6 text-blue-400"
                                          onClick={() => onAlertAction?.(alert, 'investigate')}
                                        >
                                          Investigate
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}

                {/* AI Insights Preview */}
                {aiInsights.length > 0 && (
                  <AIInsightCard
                    insight={String(aiInsights[0])}
                    title="Recent AI Insights"
                    className="bg-slate-800/50 border-slate-700"
                  />
                )}

                {/* Custom Content */}
                {children}
              </TabsContent>

              {/* Other tabs would have their content here */}
              <TabsContent value="analytics" className="mt-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="text-center text-slate-400">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Analytics dashboard coming soon...</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="compliance" className="mt-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="text-center text-slate-400">
                      <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Compliance dashboard coming soon...</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ai-insights" className="mt-6">
                <AIInsightCard
                  insight="AI insights will appear here as they become available."
                  title="All AI Insights"
                  className="bg-slate-800/50 border-slate-700"
                />
              </TabsContent>

              <TabsContent value="reports" className="mt-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="text-center text-slate-400">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Reports dashboard coming soon...</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="text-center text-slate-400">
                      <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Settings dashboard coming soon...</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}