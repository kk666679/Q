'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Search,
  GitBranch,
  MoreHorizontal,
  Layers,
  Users,
  FileText,
  Play,
  Settings,
  Activity,
} from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { AppHeader } from '@/components/sidebar/app-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { trpc } from '@/sdk/client/trpc'
import { ChartContainer } from '@/components/ui/chart'
import {
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
} from 'recharts'
import type { Process, ProcessType } from '@/lib/types'

// Chart data
const processTypeData = [
  { name: 'Core', value: 8, fill: 'var(--chart-1)' },
  { name: 'Support', value: 12, fill: 'var(--chart-2)' },
  { name: 'Management', value: 5, fill: 'var(--chart-3)' },
]

const processPerformanceData = [
  { name: 'Order to Delivery', efficiency: 92, compliance: 88 },
  { name: 'Procurement', efficiency: 85, compliance: 95 },
  { name: 'Production', efficiency: 78, compliance: 82 },
  { name: 'Quality Control', efficiency: 95, compliance: 90 },
  { name: 'Customer Support', efficiency: 88, compliance: 85 },
]

const processActivityData = [
  { month: 'Jan', created: 3, updated: 8 },
  { month: 'Feb', created: 5, updated: 12 },
  { month: 'Mar', created: 2, updated: 6 },
  { month: 'Apr', created: 4, updated: 10 },
  { month: 'May', created: 6, updated: 14 },
  { month: 'Jun', created: 3, updated: 9 },
]

const chartConfig = {
  efficiency: { label: 'Efficiency', color: 'var(--chart-1)' },
  compliance: { label: 'Compliance', color: 'var(--chart-2)' },
  created: { label: 'Created', color: 'var(--chart-1)' },
  updated: { label: 'Updated', color: 'var(--chart-2)' },
}

function getTypeColor(type: ProcessType): string {
  switch (type) {
    case 'core':
      return 'bg-chart-1 text-foreground'
    case 'support':
      return 'bg-chart-2 text-foreground'
    case 'management':
      return 'bg-chart-3 text-foreground'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

function getStatusColor(status?: string): string {
  switch (status) {
    case 'active':
      return 'bg-green-500'
    case 'pending':
      return 'bg-yellow-500'
    case 'completed':
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
}

// Visual Process Flow Diagram Component
function ProcessFlowDiagram({ 
  nodes, 
  maxDisplay = 5 
}: { 
  nodes: Process['flowData']['nodes']
  maxDisplay?: number
}) {
  return (
    <div className="flex items-center gap-2 py-2 px-3 bg-muted/50 rounded-md overflow-x-auto">
      {nodes.slice(0, maxDisplay).map((node, index) => (
        <div key={node.id} className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px1 bg-background/-2 py-800 rounded border text-xs">
            <Activity className="size-3 text-primary" />
            <span className="font-medium">{node.data.label}</span>
          </div>
          {index < Math.min(nodes.length - 1, maxDisplay - 1) && (
            <span className="text-muted-foreground text-xs">→</span>
          )}
        </div>
      ))}
      {nodes.length > maxDisplay && (
        <span className="text-xs text-muted-foreground shrink-0">
          +{nodes.length - maxDisplay} more
        </span>
      )}
    </div>
  )
}

export default function ProcessesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const { data: processes, isLoading } = trpc.process.list.useQuery()
  const { data: projects } = trpc.project.list.useQuery()

  const filteredProcesses = (processes || []).filter((process) => {
    const matchesSearch =
      process.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      process.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || process.type === typeFilter
    return matchesSearch && matchesType
  })

  const getProjectName = (projectId: string) => {
    return projects?.find((p) => p.id === projectId)?.name || 'Unknown'
  }

  // Group processes by type
  const coreProcesses = filteredProcesses.filter((p) => p.type === 'core')
  const supportProcesses = filteredProcesses.filter((p) => p.type === 'support')
  const managementProcesses = filteredProcesses.filter((p) => p.type === 'management')

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Processes" description="Manage your business processes" />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Process Type Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Type Distribution</CardTitle>
                  <CardDescription>Processes by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <PieChart>
                      <Pie
                        data={processTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {processTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Process Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Efficiency vs compliance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <BarChart data={processPerformanceData} layout="vertical" margin={{ top: 10, right: 10, left: 60, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" domain={[0, 100]} className="text-xs" />
                      <YAxis dataKey="name" type="category" className="text-xs" width={60} />
                      <Tooltip />
                      <Bar dataKey="efficiency" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="compliance" fill="var(--chart-2)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Process Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                  <CardDescription>Created vs updated</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <BarChart data={processActivityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="created" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="updated" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search processes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="core">Core</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="management">Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="size-4" />
                    New Process
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create New Process</DialogTitle>
                    <DialogDescription>
                      Define a new business process for your QMS
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="proc-project">Project</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          {(projects || []).map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="proc-name">Process Name</Label>
                      <Input id="proc-name" placeholder="e.g., Order to Delivery" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="proc-type">Process Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="core">Core Process</SelectItem>
                          <SelectItem value="support">Support Process</SelectItem>
                          <SelectItem value="management">Management Process</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="proc-desc">Description</Label>
                      <Textarea
                        id="proc-desc"
                        placeholder="Describe the process purpose and scope..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="proc-owner">Process Owner</Label>
                        <Input id="proc-owner" placeholder="e.g., Operations Manager" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="proc-inputs">Inputs (comma-separated)</Label>
                        <Input id="proc-inputs" placeholder="e.g., Order, Specs" />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsCreateDialogOpen(false)}>
                      Create Process
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Process Type Legend */}
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">Process Types:</span>
              <span className="flex items-center gap-1.5">
                <span className="size-3 rounded-full bg-chart-1" />
                Core
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-3 rounded-full bg-chart-2" />
                Support
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-3 rounded-full bg-chart-3" />
                Management
              </span>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Loading processes...</div>
              </div>
            ) : (
              <>
                {/* Process Map Visualization with Glassmorphism */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Process Map</CardTitle>
                    <CardDescription>Visual overview of your process landscape</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-3">
                      {/* Core Processes */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="size-2 rounded-full bg-chart-1" />
                          <span className="text-sm font-medium">Core Processes</span>
                          <Badge variant="secondary" className="ml-auto">
                            {coreProcesses.length}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {coreProcesses.map((process) => (
                            <ProcessMapCard key={process.id} process={process} />
                          ))}
                          {coreProcesses.length === 0 && (
                            <p className="text-sm text-muted-foreground py-4 text-center">
                              No core processes defined
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Support Processes */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="size-2 rounded-full bg-chart-2" />
                          <span className="text-sm font-medium">Support Processes</span>
                          <Badge variant="secondary" className="ml-auto">
                            {supportProcesses.length}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {supportProcesses.map((process) => (
                            <ProcessMapCard key={process.id} process={process} />
                          ))}
                          {supportProcesses.length === 0 && (
                            <p className="text-sm text-muted-foreground py-4 text-center">
                              No support processes defined
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Management Processes */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="size-2 rounded-full bg-chart-3" />
                          <span className="text-sm font-medium">Management Processes</span>
                          <Badge variant="secondary" className="ml-auto">
                            {managementProcesses.length}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {managementProcesses.map((process) => (
                            <ProcessMapCard key={process.id} process={process} />
                          ))}
                          {managementProcesses.length === 0 && (
                            <p className="text-sm text-muted-foreground py-4 text-center">
                              No management processes defined
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Process List with enhanced cards */}
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredProcesses.map((process) => (
                    <Card 
                      key={process.id} 
                      className="group glass-card hover:glass-lg transition-all"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-base">
                                {process.name}
                              </CardTitle>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getTypeColor(process.type)}>
                                {process.type}
                              </Badge>
                              <div className={`w-2 h-2 rounded-full ${getStatusColor('active')}`} />
                              <span className="text-xs text-muted-foreground">
                                {getProjectName(process.projectId)}
                              </span>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100"
                              >
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/processes/${process.id}`}>View Details</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Edit Process
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Duplicate</DropdownMenuItem>
                              <DropdownMenuItem>Export</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {process.description}
                        </p>

                        {/* Visual Process Flow */}
                        <ProcessFlowDiagram nodes={process.flowData.nodes} />

                        {/* Metadata */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {process.owner && (
                            <span className="flex items-center gap-1">
                              <Users className="size-3" />
                              {process.owner}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Layers className="size-3" />
                            {process.flowData.nodes.length} steps
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="size-3" />
                            {process.inputs.length} inputs
                          </span>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-2 pt-2 border-t">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            asChild
                          >
                            <Link href={`/processes/${process.id}`}>
                              <Play className="size-3 mr-1" />
                              View Details
                            </Link>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                          >
                            <Settings className="size-3 mr-1" />
                            Configure
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredProcesses.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-4 mb-4">
                      <GitBranch className="size-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No processes found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {searchQuery || typeFilter !== 'all'
                        ? 'Try adjusting your search or filters'
                        : 'Get started by creating your first process'}
                    </p>
                    {!searchQuery && typeFilter === 'all' && (
                      <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="size-4" />
                        Create Process
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

// Simple process card for the map
function ProcessMapCard({ process }: { process: Process }) {
  return (
    <Link
      href={`/processes/${process.id}`}
      className="block p-3 border rounded-lg hover:bg-muted/50 transition-colors"
    >
      <p className="font-medium text-sm truncate">{process.name}</p>
      <p className="text-xs text-muted-foreground mt-0.5 truncate">
        {process.flowData.nodes.length} steps
      </p>
    </Link>
  )
}

