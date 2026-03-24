'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Search,
  FileText,
  MoreHorizontal,
  Filter,
  ShieldCheck,
  Sparkles,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
  AreaChart,
  Area,
} from 'recharts'
import type { Document, DocumentType, DocumentStatus } from '@/lib/types'
import { AIMetricCard, AIInsightCard, AIActionCard, AILoadingState } from '@/sdk/components/ai'

// Chart data
const documentStatusData = [
  { name: 'Approved', value: 45, fill: 'var(--chart-1)' },
  { name: 'Draft', value: 18, fill: 'var(--chart-2)' },
  { name: 'In Review', value: 12, fill: 'var(--chart-3)' },
  { name: 'Obsolete', value: 5, fill: 'var(--chart-4)' },
]

const documentTypeData = [
  { type: 'Quality Manual', count: 5 },
  { type: 'Procedure', count: 24 },
  { type: 'Work Instruction', count: 45 },
  { type: 'Form', count: 78 },
  { type: 'Record', count: 120 },
]

const approvalTrendData = [
  { month: 'Jan', approved: 8, pending: 5 },
  { month: 'Feb', approved: 12, pending: 3 },
  { month: 'Mar', approved: 10, pending: 4 },
  { month: 'Apr', approved: 15, pending: 6 },
  { month: 'May', approved: 11, pending: 2 },
  { month: 'Jun', approved: 14, pending: 4 },
]

const isoClauseData = [
  { clause: '4.1', count: 8 },
  { clause: '5.1', count: 5 },
  { clause: '6.1', count: 12 },
  { clause: '7.1', count: 15 },
  { clause: '7.2', count: 10 },
  { clause: '7.3', count: 7 },
  { clause: '8.1', count: 9 },
  { clause: '8.2', count: 6 },
  { clause: '8.4', count: 8 },
  { clause: '9.1', count: 5 },
]

const chartConfig = {
  approved: { label: 'Approved', color: 'var(--chart-1)' },
  pending: { label: 'Pending', color: 'var(--chart-2)' },
  count: { label: 'Count', color: 'var(--chart-1)' },
}

function getStatusBadgeVariant(status: DocumentStatus) {
  switch (status) {
    case 'approved':
      return 'default'
    case 'draft':
      return 'secondary'
    case 'review':
      return 'outline'
    case 'obsolete':
      return 'destructive'
    default:
      return 'secondary'
  }
}

const documentTypes: { value: DocumentType; label: string }[] = [
  { value: 'quality-manual', label: 'Quality Manual' },
  { value: 'quality-policy', label: 'Quality Policy' },
  { value: 'procedure', label: 'Procedure' },
  { value: 'work-instruction', label: 'Work Instruction' },
  { value: 'form', label: 'Form' },
  { value: 'record', label: 'Record' },
]

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)

  const { data: documents, isLoading: docsLoading } = trpc.document.list.useQuery()
  const { data: projects } = trpc.project.list.useQuery({})

  const filteredDocuments = (documents || []).filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || doc.type === typeFilter
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const getProjectName = (projectId: string) => {
    return projects?.find((p) => p.id === projectId)?.name || 'Unknown'
  }

  const stats = {
    total: documents?.length || 0,
    approved: documents?.filter(d => d.status === 'approved').length || 0,
    draft: documents?.filter(d => d.status === 'draft').length || 0,
    review: documents?.filter(d => d.status === 'review').length || 0,
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Documents" description="Manage QMS documentation" />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* AI Stats */}
            {docsLoading ? (
              <AILoadingState message="Loading documents..." />
            ) : (
              <div className="grid gap-4 md:grid-cols-4">
                <AIMetricCard
                  title="Total Documents"
                  value={stats.total}
                  icon={FileText}
                  gradient="from-blue-500/80 to-cyan-500/80"
                />
                <AIMetricCard
                  title="Approved"
                  value={stats.approved}
                  icon={ShieldCheck}
                  gradient="from-green-500/80 to-emerald-500/80"
                  trend="up"
                  change="+12%"
                />
                <AIMetricCard
                  title="In Review"
                  value={stats.review}
                  icon={FileText}
                  gradient="from-amber-500/80 to-orange-500/80"
                />
                <AIMetricCard
                  title="Drafts"
                  value={stats.draft}
                  icon={FileText}
                  gradient="from-purple-500/80 to-pink-500/80"
                />
              </div>
            )}

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Document Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Status Distribution</CardTitle>
                  <CardDescription>Documents by status</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <PieChart>
                      <Pie
                        data={documentStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {documentStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Documents by Type */}
              <Card>
                <CardHeader>
                  <CardTitle>By Type</CardTitle>
                  <CardDescription>Distribution by document type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <BarChart data={documentTypeData} layout="vertical" margin={{ top: 10, right: 10, left: 60, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis dataKey="type" type="category" className="text-xs" width={80} />
                      <Tooltip />
                      <Bar dataKey="count" fill="var(--chart-2)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* ISO Clause Coverage */}
              <Card>
                <CardHeader>
                  <CardTitle>ISO Clause Coverage</CardTitle>
                  <CardDescription>Documents by clause</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <BarChart data={isoClauseData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="clause" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Bar dataKey="count" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Approval Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Approval Trends</CardTitle>
                <CardDescription>Monthly document approvals</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                  <AreaChart data={approvalTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="approved" stroke="var(--chart-1)" fillOpacity={1} fill="url(#colorApproved)" />
                    <Area type="monotone" dataKey="pending" stroke="var(--chart-2)" fillOpacity={1} fill="url(#colorPending)" />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Toolbar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {documentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="obsolete">Obsolete</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Sparkles className="size-4" />
                      Generate with AI
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Generate Document with AI</DialogTitle>
                      <DialogDescription>
                        Use AI to generate ISO 9001 compliant documentation
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="gen-project">Project</Label>
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
                        <Label htmlFor="gen-type">Document Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {documentTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="gen-requirements">Requirements</Label>
                        <Textarea
                          id="gen-requirements"
                          placeholder="Describe what the document should cover..."
                          rows={4}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsGenerateDialogOpen(false)}>
                        <Sparkles className="size-4" />
                        Generate
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="size-4" />
                      New Document
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Create New Document</DialogTitle>
                      <DialogDescription>
                        Add a new document to your QMS
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="doc-project">Project</Label>
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
                        <Label htmlFor="doc-title">Title</Label>
                        <Input id="doc-title" placeholder="Document title" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="doc-type">Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {documentTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="doc-content">Content</Label>
                        <Textarea
                          id="doc-content"
                          placeholder="Document content..."
                          rows={6}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsCreateDialogOpen(false)}>
                        Create Document
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Documents Table */}
            {docsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Loading documents...</div>
              </div>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>ISO Clauses</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <Link
                            href={`/documents/${doc.id}`}
                            className="font-medium hover:underline flex items-center gap-2"
                          >
                            <FileText className="size-4 text-muted-foreground" />
                            {doc.title}
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {getProjectName(doc.projectId)}
                        </TableCell>
                        <TableCell>
                          <span className="capitalize text-sm">
                            {doc.type.replace('-', ' ')}
                          </span>
                        </TableCell>
                        <TableCell>v{doc.version}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(doc.status)}>
                            {doc.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {doc.metadata.isoClauses?.slice(0, 2).map((clause) => (
                              <Badge key={clause} variant="outline" className="text-xs">
                                {clause}
                              </Badge>
                            ))}
                            {(doc.metadata.isoClauses?.length || 0) > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{(doc.metadata.isoClauses?.length || 0) - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(doc.updatedAt).toLocaleDateString('en-GB')}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/documents/${doc.id}`}>View</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>
                                <ShieldCheck className="size-4 mr-2" />
                                Scan Compliance
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Duplicate</DropdownMenuItem>
                              <DropdownMenuItem>Export</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}

            {filteredDocuments.length === 0 && !docsLoading && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <FileText className="size-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No documents found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

