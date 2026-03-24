'use client'

import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, GitBranch, ShieldCheck, Settings, MoreHorizontal, Plus, Play } from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { AppHeader } from '@/components/sidebar/app-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
import { trpc } from '@/sdk/client/trpc'

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'active':
    case 'approved':
      return 'default'
    case 'draft':
      return 'secondary'
    case 'review':
      return 'outline'
    case 'archived':
    case 'obsolete':
      return 'destructive'
    default:
      return 'secondary'
  }
}

function getComplianceColor(score: number) {
  if (score >= 80) return 'text-success'
  if (score >= 60) return 'text-warning'
  return 'text-destructive'
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  
  const { data: project } = trpc.project.get.useQuery({ id })
  const { data: documents } = trpc.document.list.useQuery({})
  const { data: processes } = trpc.process.list.useQuery({})
  const { data: reports } = trpc.compliance.getReport.useQuery({})

  const projectDocuments = (documents || []).filter((d) => d.projectId === id)
  const projectProcesses = (processes || []).filter((p) => p.projectId === id)
  const projectReports = (reports || []).filter((r) => r.projectId === id)

  if (!project) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader title="Project Not Found" />
          <main className="flex-1 p-6">
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">Project not found</p>
              <Button asChild className="mt-4">
                <Link href="/projects">Back to Projects</Link>
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
        <AppHeader title={project.name} description={project.industry} />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Breadcrumb & Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/projects">
                    <ArrowLeft className="size-4" />
                    Back
                  </Link>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <ShieldCheck className="size-4" />
                  Run Compliance Scan
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Duplicate Project</DropdownMenuItem>
                    <DropdownMenuItem>Export Documents</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Project Overview */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card className="md:col-span-3">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                      <CardDescription className="mt-1">{project.description}</CardDescription>
                    </div>
                    <Badge variant={getStatusBadgeVariant(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                    <div>
                      <dt className="text-muted-foreground">Organization Type</dt>
                      <dd className="font-medium">{project.organizationType}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Industry</dt>
                      <dd className="font-medium">{project.industry}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Created</dt>
                      <dd className="font-medium">{new Date(project.createdAt).toLocaleDateString()}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Last Updated</dt>
                      <dd className="font-medium">{new Date(project.updatedAt).toLocaleDateString()}</dd>
                    </div>
                  </dl>
                  <div className="mt-4 pt-4 border-t">
                    <dt className="text-sm text-muted-foreground mb-1">Scope</dt>
                    <dd className="text-sm">{project.scope}</dd>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Compliance Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <span className={`text-4xl font-bold ${getComplianceColor(project.complianceScore || 0)}`}>
                      {project.complianceScore || 0}%
                    </span>
                    <Progress value={project.complianceScore || 0} className="mt-3 h-2 w-full" />
                    <p className="mt-2 text-xs text-muted-foreground">
                      {(project.complianceScore || 0) >= 80 ? 'Compliant' : 'Needs improvement'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="documents" className="space-y-4">
              <TabsList>
                <TabsTrigger value="documents" className="gap-1.5">
                  <FileText className="size-4" />
                  Documents ({projectDocuments.length})
                </TabsTrigger>
                <TabsTrigger value="processes" className="gap-1.5">
                  <GitBranch className="size-4" />
                  Processes ({projectProcesses.length})
                </TabsTrigger>
                <TabsTrigger value="compliance" className="gap-1.5">
                  <ShieldCheck className="size-4" />
                  Compliance
                </TabsTrigger>
              </TabsList>

              <TabsContent value="documents" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Documents</h3>
                  <Button size="sm">
                    <Plus className="size-4" />
                    Add Document
                  </Button>
                </div>
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectDocuments.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>
                            <Link href={`/documents/${doc.id}`} className="font-medium hover:underline">
                              {doc.title}
                            </Link>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{doc.type}</TableCell>
                          <TableCell>v{doc.version}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(doc.status)}>
                              {doc.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(doc.updatedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View</DropdownMenuItem>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Scan Compliance</DropdownMenuItem>
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
              </TabsContent>

              <TabsContent value="processes" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Processes</h3>
                  <Button size="sm">
                    <Plus className="size-4" />
                    Add Process
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {projectProcesses.map((process) => (
                    <Card key={process.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">
                              <Link href={`/processes/${process.id}`} className="hover:underline">
                                {process.name}
                              </Link>
                            </CardTitle>
                            <Badge variant="outline" className="mt-1">{process.type}</Badge>
                          </div>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {process.description}
                        </p>
                        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{process.inputs.length} inputs</span>
                          <span>{process.outputs.length} outputs</span>
                          {process.owner && <span>Owner: {process.owner}</span>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="compliance" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Compliance Reports</h3>
                  <Button size="sm">
                    <Play className="size-4" />
                    Run New Scan
                  </Button>
                </div>
                {projectReports.length > 0 ? (
                  <div className="space-y-4">
                    {projectReports.map((report) => (
                      <Card key={report.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-base">Compliance Report</CardTitle>
                              <CardDescription>
                                Scanned on {new Date(report.scannedAt).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <div className="text-right">
                              <span className={`text-2xl font-bold ${getComplianceColor(report.score)}`}>
                                {report.score}%
                              </span>
                              <Badge variant={report.passed ? 'default' : 'destructive'} className="ml-2">
                                {report.passed ? 'Passed' : 'Failed'}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{report.summary}</p>
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Findings ({report.findings.length})</h4>
                            <div className="space-y-2">
                              {report.findings.slice(0, 3).map((finding) => (
                                <div key={finding.id} className="flex items-start gap-2 text-sm">
                                  <Badge
                                    variant={finding.status === 'compliant' ? 'default' : 'secondary'}
                                    className="shrink-0"
                                  >
                                    {finding.clause}
                                  </Badge>
                                  <span className="text-muted-foreground">{finding.explanation}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <ShieldCheck className="size-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No compliance reports yet</p>
                      <Button className="mt-4">
                        <Play className="size-4" />
                        Run First Scan
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

