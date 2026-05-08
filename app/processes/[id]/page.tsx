/* @ts-nocheck */

'use client'

import { use, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  MoreHorizontal,
  Save,
  Plus,
  Trash2,
  Play,
  Square,
  Diamond,
  Circle,
  FileText,
  Settings,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Activity,
  GitBranch,
} from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { AppHeader } from '@/components/sidebar/app-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { trpc } from '@/lib/sdk'
import type { FlowNode } from '@/lib/types'

// Import automation components for the canvas
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, addEdge, MarkerType } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

function getTypeColor(type: string): string {
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

function getNodeIcon(type: FlowNode['type']) {
  switch (type) {
    case 'start':
      return <Play className="size-4 text-green-500" />
    case 'end':
      return <Square className="size-4 text-red-500" />
    case 'process':
      return <Activity className="size-4 text-chart-1" />
    case 'decision':
      return <Diamond className="size-4 text-chart-3" />
    case 'document':
      return <FileText className="size-4 text-chart-2" />
    default:
      return <Circle className="size-4" />
  }
}

// Custom Node Component for ReactFlow
function CustomProcessNode({ data, selected }: { data: { label: string; description?: string; responsible?: string }; selected?: boolean }) {
  return (
    <div className={`
      px-4 py-3 rounded-lg border-2 bg-card shadow-sm min-w-[180px]
      ${selected ? 'border-primary ring-2 ring-primary/30' : 'border-border'}
      hover:border-primary/50 transition-colors
    `}>
      <div className="flex items-center gap-2">
        {getNodeIcon(data.type as FlowNode['type'])}
        <span className="font-medium text-sm">{data.label}</span>
      </div>
      {data.responsible && (
        <div className="mt-1 text-xs text-muted-foreground">
          {data.responsible}
        </div>
      )}
    </div>
  )
}

const nodeTypes = {
  process: CustomProcessNode,
  start: CustomProcessNode,
  end: CustomProcessNode,
  decision: CustomProcessNode,
  document: CustomProcessNode,
}

export default function ProcessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  
  const { data: processData } = trpc.process.get.useQuery({ id })
  const { data: projects } = trpc.project.list.useQuery()
  const process = processData || null
  const project = process && projects ? projects.find((p) => p.id === process.projectId) : null
  const [zoom, setZoom] = useState(100)

  // Convert flow data to ReactFlow format
  const initialNodes = useMemo(() => {
    if (!process) return []
    return process.flowData.nodes.map((node) => ({
      id: node.id,
      type: node.type === 'process' ? 'process' : node.type,
      position: node.position,
      data: { 
        label: node.data.label, 
        description: node.data.description,
        responsible: node.data.responsible,
        type: node.type 
      },
    }))
  }, [process])

  const initialEdges = useMemo(() => {
    if (!process) return []
    return process.flowData.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      type: 'smoothstep',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 15,
        height: 15,
      },
      style: { stroke: 'hsl(var(--border))', strokeWidth: 2 },
    }))
  }, [process])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback((params: any) => {
    setEdges((eds) => addEdge(params, eds))
  }, [setEdges])

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 10, 150))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 10, 50))
  }, [])

  if (!process) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader title="Process Not Found" />
          <main className="flex-1 p-6">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-muted p-4 mb-4">
                <GitBranch className="size-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Process not found</p>
              <Button asChild className="mt-4">
                <Link href="/processes">Back to Processes</Link>
              </Button>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title={process.name} description={project?.name} />
        <main className="flex-1 overflow-hidden p-6">
          <div className="mx-auto max-w-7xl space-y-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/processes">
                    <ArrowLeft className="size-4" />
                    Back
                  </Link>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Save className="size-4" />
                  Save Changes
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Duplicate Process</DropdownMenuItem>
                    <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                    <DropdownMenuItem>Generate Procedure</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Process Info Cards */}
            <div className="grid gap-6 md:grid-cols-4 shrink-0">
              <Card className="glass-card md:col-span-3">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{process.name}</CardTitle>
                      <CardDescription className="mt-1">{process.description}</CardDescription>
                    </div>
                    <Badge className={getTypeColor(process.type)}>{process.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                    <div>
                      <dt className="text-muted-foreground">Owner</dt>
                      <dd className="font-medium">{process.owner || 'Not assigned'}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Steps</dt>
                      <dd className="font-medium">{process.flowData.nodes.length}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Created</dt>
                      <dd className="font-medium">{process.createdAt.toLocaleDateString()}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Updated</dt>
                      <dd className="font-medium">{process.updatedAt.toLocaleDateString()}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">SIPOC Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Inputs:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {process.inputs.map((input) => (
                        <Badge key={input} variant="outline" className="text-xs">
                          {input}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Outputs:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {process.outputs.map((output) => (
                        <Badge key={output} variant="outline" className="text-xs">
                          {output}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="flow" className="flex-1 flex flex-col min-h-0">
              <TabsList>
                <TabsTrigger value="flow">Flow Diagram</TabsTrigger>
                <TabsTrigger value="steps">Steps</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
              </TabsList>

              <TabsContent value="flow" className="flex-1 mt-4 space-y-4 min-h-0">
                {/* Flow Editor Toolbar */}
                <div className="flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Add node:</span>
                    <Button variant="outline" size="sm">
                      <Play className="size-3" />
                      Start
                    </Button>
                    <Button variant="outline" size="sm">
                      <Square className="size-3" />
                      Process
                    </Button>
                    <Button variant="outline" size="sm">
                      <Diamond className="size-3" />
                      Decision
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="size-3" />
                      Document
                    </Button>
                    <Button variant="outline" size="sm">
                      <Square className="size-3" />
                      End
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handleZoomOut}>
                      <ZoomOut className="size-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground w-12 text-center">
                      {zoom}%
                    </span>
                    <Button variant="outline" size="icon" onClick={handleZoomIn}>
                      <ZoomIn className="size-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Maximize2 className="size-4" />
                    </Button>
                  </div>
                </div>

                {/* Interactive Flow Diagram Canvas */}
                <Card className="flex-1 glass-card min-h-[500px] overflow-hidden">
                  <CardContent className="p-0 h-full">
                    <div className="h-[500px] w-full">
                      <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        fitView
                        attributionPosition="bottom-left"
                        className="bg-gradient-to-br from-background to-muted/20"
                      >
                        <Background color="hsl(var(--border))" gap={20} />
                        <Controls className="!bg-card/80 !backdrop-blur-sm !border-border" />
                        <MiniMap 
                          className="!bg-card/80 !backdrop-blur-sm"
                          nodeColor={() => 'hsl(var(--primary))'}
                        />
                      </ReactFlow>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="steps" className="flex-1 mt-4 min-h-0 overflow-auto">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Process Steps</CardTitle>
                    <CardDescription>Detailed breakdown of each step</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">#</TableHead>
                          <TableHead>Step</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Responsible</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="w-10"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {process.flowData.nodes.map((node, index) => (
                          <TableRow key={node.id}>
                            <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                            <TableCell className="font-medium">{node.data.label}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize flex items-center gap-1 w-fit">
                                {getNodeIcon(node.type)}
                                {node.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {node.data.responsible || '-'}
                            </TableCell>
                            <TableCell className="text-muted-foreground max-w-xs truncate">
                              {node.data.description || '-'}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="size-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Edit</DropdownMenuItem>
                                  <DropdownMenuItem>Add Document</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="size-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="metrics" className="flex-1 mt-4 overflow-auto">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Process Metrics</h3>
                  <Button size="sm">
                    <Plus className="size-4" />
                    Add Metric
                  </Button>
                </div>

                {process.metrics && process.metrics.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 mt-4">
                    {process.metrics.map((metric, index) => (
                      <Card key={index} className="glass-card">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{metric.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">
                            {metric.description}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Target:</span>
                            <span className="font-medium">
                              {metric.target}
                              {metric.unit && ` ${metric.unit}`}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="glass-card mt-4">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Settings className="size-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No metrics defined for this process</p>
                      <Button className="mt-4">
                        <Plus className="size-4" />
                        Add First Metric
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

