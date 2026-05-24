'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Bot, Send, Sparkles, FileText, GitBranch, ShieldCheck, 
  Factory, HardHat, Briefcase, FileCheck, Leaf, Heart, 
  Layers, Play, Settings, BarChart3, ClipboardCheck, Calculator,
  TrendingUp, Shield, AlertTriangle, Clock, CheckCircle,
  XCircle, RefreshCw, ChevronDown, ChevronUp, Zap
} from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { AppHeader } from '@/components/sidebar/app-header'
import { Agent, Message, Suggestion } from '@/components/ai-elements'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { trpc } from '@/lib/sdk'
import { z } from 'zod'

const mockProjects = [
  { id: '1', name: 'Project Alpha' },
  { id: '2', name: 'Project Beta' },
  { id: '3', name: 'Project Gamma' },
]

// Extended agent definitions with full capabilities
const agents = [
  { 
    id: 'quality-manager', 
    name: 'Quality Manager', 
    icon: Bot,
    color: 'bg-blue-500',
    role: 'ISO 13485 QMS Implementation',
    description: 'Quality management, audits, document control, management review',
    capabilities: [
      'ISO 13485 QMS Implementation',
      'Document Control System',
      'Management Review Process',
      'Internal Audit Program',
      'Design Controls',
      'Supplier Quality Management',
    ]
  },
  { 
    id: 'qa-expert', 
    name: 'QA Expert', 
    icon: ClipboardCheck,
    color: 'bg-purple-500',
    role: 'Quality Assurance',
    description: 'Test strategy, automation, quality metrics, defect analysis',
    capabilities: [
      'Test Strategy Development',
      'Quality Process Optimization',
      'Test Automation Framework',
      'Risk-Based Testing',
      'Defect Management',
      'Quality Metrics & KPIs',
    ]
  },
  { 
    id: 'manufacturing-expert', 
    name: 'Manufacturing Expert', 
    icon: Factory,
    color: 'bg-orange-500',
    role: 'Manufacturing & Industry 4.0',
    description: 'MES, OEE, SPC, predictive maintenance, digital twins',
    capabilities: [
      'Manufacturing Execution Systems',
      'Industry 4.0 & Smart Factory',
      'Production Optimization',
      'Quality Control & SPC',
      'Predictive Maintenance',
      'OEE Calculation',
    ]
  },
  { 
    id: 'construction-expert', 
    name: 'Construction Expert', 
    icon: HardHat,
    color: 'bg-yellow-500',
    role: 'Construction Management',
    description: 'Project management, BIM, safety compliance, cost estimation',
    capabilities: [
      'Construction Project Management',
      'Building Information Modeling',
      'Safety Compliance (OSHA)',
      'Cost Estimation',
      'Critical Path Scheduling',
      'Risk Management',
    ]
  },
  { 
    id: 'insurance-expert', 
    name: 'Insurance Expert', 
    icon: Briefcase,
    color: 'bg-red-500',
    role: 'Insurance & Risk',
    description: 'Claims processing, underwriting, fraud detection, actuarial',
    capabilities: [
      'Policy Administration',
      'Claims Management',
      'Underwriting & Risk Assessment',
      'Actuarial Analysis',
      'Fraud Detection',
      'Regulatory Compliance',
    ]
  },
  { 
    id: 'document-drafter', 
    name: 'Document Drafter', 
    icon: FileText,
    color: 'bg-green-500',
    role: 'Documentation',
    description: 'QMS documentation, procedures, policies, forms',
    capabilities: [
      'Quality Manual Creation',
      'Procedure Development',
      'Policy Writing',
      'Form Design',
      'Document Control',
      'Version Management',
    ]
  },
  { 
    id: 'iso9001-agent', 
    name: 'ISO 9001 Agent', 
    icon: ShieldCheck,
    color: 'bg-indigo-500',
    role: 'ISO 9001:2015 Compliance',
    description: 'QMS compliance, audits, process performance, customer satisfaction',
    capabilities: [
      'ISO 9001:2015 Implementation',
      'Gap Analysis',
      'Internal Audit',
      'Process Performance',
      'Customer Satisfaction',
      'Supplier Quality',
    ]
  },
  { 
    id: 'iso14001-agent', 
    name: 'ISO 14001 Agent', 
    icon: Leaf,
    color: 'bg-emerald-500',
    role: 'Environmental Management',
    description: 'Environmental compliance, aspects, impacts, sustainability',
    capabilities: [
      'ISO 14001:2015 Implementation',
      'Environmental Aspects',
      'Impact Assessment',
      'Sustainability Planning',
      'Waste Management',
      'Carbon Footprint',
    ]
  },
  { 
    id: 'iso45001-agent', 
    name: 'ISO 45001 Agent', 
    icon: Heart,
    color: 'bg-rose-500',
    role: 'Occupational Health & Safety',
    description: 'Safety management, hazard assessment, risk controls',
    capabilities: [
      'ISO 45001:2018 Implementation',
      'Hazard Identification',
      'Risk Assessment',
      'Emergency Preparedness',
      'Incident Management',
      'Safety Culture',
    ]
  },
  { 
    id: 'ims-integrator', 
    name: 'IMS Integrator', 
    icon: Layers,
    color: 'bg-cyan-500',
    role: 'Integrated Management System',
    description: 'Multi-standard integration (9001, 14001, 45001), unified processes',
    capabilities: [
      'IMS Architecture Design',
      'Clause Mapping',
      'Integrated Audits',
      'Process Harmonization',
      'Unified Metrics',
      'Compliance Integration',
    ]
  },
]

// Agent tool definitions with execution capability
const agentTools: Record<string, Array<{
  name: string
  description: string
  params: z.ZodType<any>
  execute: (params: any) => Promise<any>
}>> = {
  'quality-manager': [
    {
      name: 'Generate Audit Checklist',
      description: 'Create ISO 13485 audit checklist',
      params: z.object({ auditType: z.enum(['process', 'system', 'product']), scope: z.string() }),
      execute: async (p) => ({
        checklist: `Generated ${p.auditType} audit checklist for ${p.scope}`,
        items: [
          { clause: '4.1', question: 'Context of organization documented?', status: 'pending' },
          { clause: '5.1', question: 'Leadership commitment evident?', status: 'pending' },
          { clause: '7.5', question: 'Document control adequate?', status: 'pending' },
        ]
      })
    },
    {
      name: 'Calculate QMS Metrics',
      description: 'Calculate QMS performance KPIs',
      params: z.object({ metricType: z.enum(['audit', 'capa', 'complaints', 'training']) }),
      execute: async (p) => ({
        metric: p.metricType,
        value: 95.5,
        trend: 'improving',
        target: 90,
        status: 'on-track'
      })
    },
    {
      name: 'Prepare Management Review',
      description: 'Prepare management review inputs',
      params: z.object({ reviewDate: z.string() }),
      execute: async (p) => ({
        inputs: {
          auditResults: { status: 'ready', findings: 3 },
          customerFeedback: { status: 'ready', score: 4.2 },
          processPerformance: { status: 'ready', overall: 87 },
        }
      })
    }
  ],
  'qa-expert': [
    {
      name: 'Analyze Test Coverage',
      description: 'Analyze test coverage and gaps',
      params: z.object({ projectPath: z.string(), coverageType: z.enum(['code', 'requirements']) }),
      execute: async (p) => ({
        coverage: 85.5,
        gaps: ['API error handling', 'Edge cases in payment'],
        metrics: { statement: 87, branch: 82, function: 90 }
      })
    },
    {
      name: 'Generate Test Strategy',
      description: 'Create test strategy document',
      params: z.object({ projectType: z.enum(['web', 'mobile', 'api']), riskLevel: z.enum(['high', 'medium', 'low']) }),
      execute: async (p) => ({
        approach: 'Risk-based testing with automation-first',
        automation: 'Playwright for E2E, Jest for unit',
        coverage: 'Target 80% code coverage'
      })
    },
    {
      name: 'Assess Quality Maturity',
      description: 'Assess QA process maturity',
      params: z.object({ areas: z.array(z.string()) }),
      execute: async () => ({
        maturityLevel: 3,
        score: 72,
        strengths: ['Good automation', 'Clear metrics'],
        weaknesses: ['Manual regression', 'Limited shift-left']
      })
    }
  ],
  'manufacturing-expert': [
    {
      name: 'Calculate OEE',
      description: 'Calculate Overall Equipment Effectiveness',
      params: z.object({ availability: z.number(), performance: z.number(), quality: z.number() }),
      execute: async (p) => {
        const oee = (p.availability * p.performance * p.quality) / 10000
        return { oee: oee.toFixed(2), status: oee >= 85 ? 'excellent' : 'needs_improvement' }
      }
    },
    {
      name: 'Analyze SPC',
      description: 'Statistical Process Control analysis',
      params: z.object({ measurements: z.array(z.number()), sigmaLevel: z.number().default(3) }),
      execute: async (p) => {
        const mean = p.measurements.reduce((a: number, b: number) => a + b, 0) / p.measurements.length
        return { mean: mean.toFixed(2), status: 'in-control', cpk: 1.45 }
      }
    },
    {
      name: 'Predict Maintenance',
      description: 'Predict equipment maintenance needs',
      params: z.object({ machineId: z.string(), vibration: z.number(), temperature: z.number() }),
      execute: async () => ({
        failureProbability: 15,
        remainingUsefulLife: 720,
        priority: 'low',
        recommendation: 'Continue monitoring'
      })
    }
  ],
  'construction-expert': [
    {
      name: 'Estimate Project Cost',
      description: 'Estimate construction costs',
      params: z.object({ projectType: z.enum(['commercial', 'residential', 'industrial']), squareFootage: z.number() }),
      execute: async (p) => ({
        totalEstimate: (p.squareFootage * (p.projectType === 'commercial' ? 200 : p.projectType === 'residential' ? 150 : 75)).toFixed(2),
        breakdown: { site: 8, foundation: 12, structure: 25, interior: 20 }
      })
    },
    {
      name: 'Assess Safety Compliance',
      description: 'OSHA safety inspection',
      params: z.object({ projectId: z.string() }),
      execute: async () => ({
        score: 85,
        violations: 2,
        status: 'pass',
        recommendations: ['Add fall protection', 'Improve housekeeping']
      })
    },
    {
      name: 'Track Project Progress',
      description: 'Track construction progress',
      params: z.object({ completedTasks: z.number(), totalTasks: z.number() }),
      execute: async (p) => ({
        progress: ((p.completedTasks / p.totalTasks) * 100).toFixed(1),
        status: 'on-track',
        scheduleVariance: 2
      })
    }
  ],
  'insurance-expert': [
    {
      name: 'Generate Quote',
      description: 'Generate insurance quote',
      params: z.object({ policyType: z.enum(['auto', 'home', 'life']), age: z.number(), creditScore: z.number() }),
      execute: async (p) => ({
        annualPremium: (500 * (1 + (650 - p.creditScore) / 1000) * (p.age < 25 ? 1.5 : 1)).toFixed(2),
        riskClass: p.creditScore > 700 ? 'preferred' : 'standard'
      })
    },
    {
      name: 'Process Claim',
      description: 'Process insurance claim',
      params: z.object({ claimType: z.enum(['collision', 'theft', 'liability']), estimatedLoss: z.number() }),
      execute: async (p) => ({
        status: p.estimatedLoss > 50000 ? 'investigating' : 'approved',
        reserveAmount: (p.estimatedLoss * 1.5).toFixed(2),
        fraudScore: p.estimatedLoss > 50000 ? 25 : 5
      })
    },
    {
      name: 'Calculate Loss Ratio',
      description: 'Calculate loss ratio metrics',
      params: z.object({ claimsPaid: z.number(), premiumsEarned: z.number() }),
      execute: async (p) => ({
        lossRatio: ((p.claimsPaid / p.premiumsEarned) * 100).toFixed(2),
        profitable: p.claimsPaid < p.premiumsEarned
      })
    }
  ],
  'iso9001-agent': [
    {
      name: 'Assess QMS Compliance',
      description: 'ISO 9001 compliance assessment',
      params: z.object({ focusAreas: z.array(z.string()).optional() }),
      execute: async () => ({
        complianceScore: 78,
        gaps: ['Leadership commitment', 'Risk documentation'],
        recommendations: ['Develop risk register', 'Enhance audit program']
      })
    },
    {
      name: 'Generate Audit Checklist',
      description: 'ISO 9001 audit checklist',
      params: z.object({ auditType: z.enum(['internal', 'certification']), scope: z.string() }),
      execute: async (p) => ({
        totalQuestions: 25,
        checklist: [{ clause: '4.1', question: 'Context documented?', status: 'pending' }],
        guidance: 'Complete with Yes/No/NA'
      })
    },
    {
      name: 'Analyze Process Performance',
      description: 'Process performance analysis',
      params: z.object({ processName: z.string() }),
      execute: async () => ({
        effectivenessScore: 82,
        metrics: { cycleTime: 5.2, defectRate: 1.8, firstPassYield: 94.5 }
      })
    }
  ],
  'ims-integrator': [
    {
      name: 'Assess IMS Maturity',
      description: 'Integrated Management System maturity',
      params: z.object({ standards: z.array(z.string()) }),
      execute: async () => ({
        overallMaturityLevel: 3,
        overallMaturityScore: 68,
        dimensionScores: {
          integrationStructure: 65,
          documentation: 70,
          processHarmonization: 58
        }
      })
    },
    {
      name: 'Map Clause Correspondence',
      description: 'Map ISO 9001/14001/45001 clauses',
      params: z.object({ focusArea: z.string().optional() }),
      execute: async () => ({
        clauseMappings: [
          { iso9001: '4.1', iso14001: '4.1', iso45001: '4.1', common: 'Context of organization' }
        ],
        benefits: ['Reduced duplication', 'Streamlined audits']
      })
    },
    {
      name: 'Design Integrated Audit',
      description: 'Design combined audit program',
      params: z.object({ standards: z.array(z.string()) }),
      execute: async () => ({
        totalAuditDays: 7,
        auditorDays: 21,
        cycles: [{ focus: 'Core Processes', duration: '3 days' }]
      })
    }
  ]
}

const suggestedPrompts: Record<string, string[]> = {
  'quality-manager': [
    'Generate an audit checklist for our QMS',
    'Show current quality metrics',
    'Prepare management review inputs',
  ],
  'qa-expert': [
    'Analyze test coverage gaps',
    'Generate test strategy for web app',
    'Assess our quality maturity level',
  ],
  'manufacturing-expert': [
    'Calculate OEE for production line',
    'Analyze SPC data',
    'Predict maintenance for machine',
  ],
  'construction-expert': [
    'Estimate cost for commercial building',
    'Assess safety compliance',
    'Track project progress',
  ],
  'insurance-expert': [
    'Generate auto insurance quote',
    'Process a collision claim',
    'Calculate loss ratio',
  ],
  'document-drafter': [
    'Create a quality policy',
    'Draft document control procedure',
    'Generate a CAPA form',
  ],
  'iso9001-agent': [
    'Assess ISO 9001 compliance',
    'Generate internal audit checklist',
    'Analyze process performance',
  ],
  'iso14001-agent': [
    'Assess environmental aspects',
    'Review compliance status',
    'Generate environmental policy',
  ],
  'iso45001-agent': [
    'Conduct hazard assessment',
    'Review safety controls',
    'Generate emergency plan',
  ],
  'ims-integrator': [
    'Assess IMS maturity level',
    'Map clause correspondence',
    'Design integrated audit program',
  ],
}

type MessageType = {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  agentId?: string
  toolResult?: any
  isToolCall?: boolean
  toolName?: string
}

export default function AgentsPage() {
  const [selectedProject, setSelectedProject] = useState('1')
  const [selectedAgent, setSelectedAgent] = useState('quality-manager')
  const [activeTab, setActiveTab] = useState('chat')
  const [messages, setMessages] = useState<MessageType[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [toolResults, setToolResults] = useState<Record<string, any>>({})
  const [isToolExpanded, setIsToolExpanded] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const currentAgent = agents.find(a => a.id === selectedAgent) || agents[0]
  const currentTools = agentTools[selectedAgent] || []

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, toolResults])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    
    const userMsg: MessageType = { id: Date.now().toString(), role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    const query = input
    setInput('')
    setIsLoading(true)

    // Simulate agent response
    setTimeout(() => {
      const agentMsg: MessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAgentResponse(selectedAgent, query),
        agentId: selectedAgent
      }
      setMessages(prev => [...prev, agentMsg])
      setIsLoading(false)
    }, 1500)
  }

  const handleToolExecute = async (toolName: string, params: any) => {
    setIsLoading(true)
    const tool = currentTools.find(t => t.name === toolName)
    if (tool) {
      const result = await tool.execute(params)
      const toolMsg: MessageType = {
        id: Date.now().toString(),
        role: 'system',
        content: `Executed ${toolName}`,
        agentId: selectedAgent,
        toolResult: result,
        isToolCall: true,
        toolName
      }
      setMessages(prev => [...prev, toolMsg])
      setToolResults(prev => ({ ...prev, [toolName]: result }))
    }
    setIsLoading(false)
  }

  const getAgentResponse = (agentId: string, userMessage: string): string => {
    const responses: Record<string, string> = {
      'quality-manager': `I've analyzed your request regarding quality management. Based on ISO 13485 requirements, I can help you with:\n\n• Document control procedures\n• Internal audit programs\n• Management review preparation\n• Supplier quality evaluation\n\nWhat specific task would you like me to perform? Use the tools panel to execute specific functions.`,
      'qa-expert': `I've reviewed your QA-related query. I can assist with:\n\n• Test strategy development\n• Quality metrics analysis\n• Automation framework design\n• Defect trend analysis\n\nWould you like me to analyze your test coverage or generate a test strategy?`,
      'manufacturing-expert': `For manufacturing operations, I can help with:\n\n• OEE calculations and optimization\n• Statistical Process Control (SPC)\n• Predictive maintenance\n• Production scheduling\n• Digital twin simulations\n\nWhat aspect would you like to explore?`,
      'construction-expert': `Regarding construction management, I can assist with:\n\n• Project cost estimation\n• Safety compliance assessments\n• BIM clash detection\n• Progress tracking\n• Change order management\n\nWhich area requires attention?`,
      'insurance-expert': `For insurance operations, I can help with:\n\n• Quote generation\n• Claims processing\n• Underwriting risk assessment\n• Fraud detection\n• Loss ratio analysis\n\nWhat would you like to process?`,
      'document-drafter': `I can help you create QMS documentation including:\n\n• Quality manuals\n• Procedures and work instructions\n• Policies\n• Forms and templates\n• Records\n\nWhat document type do you need?`,
      'iso9001-agent': `As your ISO 9001 compliance specialist, I can assist with:\n\n• Gap analysis against ISO 9001:2015\n• Audit checklist generation\n• Process performance analysis\n• Risk-based thinking implementation\n• Customer satisfaction evaluation\n\nWhat compliance area needs attention?`,
      'iso14001-agent': `For environmental management (ISO 14001), I can help with:\n\n• Environmental aspects identification\n• Impact assessment\n• Compliance monitoring\n• Sustainability planning\n• Waste management\n\nWhat environmental concern would you like to address?`,
      'iso45001-agent': `For occupational health and safety (ISO 45001), I can assist with:\n\n• Hazard identification\n• Risk assessment\n• Safety controls\n• Emergency preparedness\n• Incident management\n\nWhat safety aspect requires evaluation?`,
      'ims-integrator': `As your IMS integration specialist, I can help harmonize:\n\n• ISO 9001 (Quality)\n• ISO 14001 (Environment)\n• ISO 45001 (Safety)\n\nI can assess maturity, map clause correspondences, and design integrated audit programs. How would you like to proceed?`,
    }
    return responses[agentId] || 'I can help you with QMS operations. Please select an agent or use the available tools.'
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="AI Agents" description="Interact with QMS specialist agents" />
        <main className="flex h-[calc(100vh-3.5rem)] flex-col">
          {/* Agent Selection Bar */}
          <div className="flex items-center gap-4 border-b px-6 py-3 bg-muted/30">
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex-1 overflow-x-auto">
              <div className="flex gap-1">
                {agents.map((agent) => {
                  const Icon = agent.icon
                  return (
                    <Button
                      key={agent.id}
                      variant={selectedAgent === agent.id ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSelectedAgent(agent.id)}
                      className="gap-2 whitespace-nowrap"
                    >
                      <Icon className="size-4" />
                      {agent.name}
                    </Button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Tools Panel */}
            <div className="w-80 border-r bg-muted/10 flex flex-col">
              <div className="p-4 border-b">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-lg ${currentAgent.color} flex items-center justify-center`}>
                    <currentAgent.icon className="size-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{currentAgent.name}</h3>
                    <p className="text-xs text-muted-foreground">{currentAgent.role}</p>
                  </div>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="mx-4 mt-2">
                  <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
                  <TabsTrigger value="tools" className="flex-1">Tools</TabsTrigger>
                  <TabsTrigger value="info" className="flex-1">Info</TabsTrigger>
                </TabsList>

                <TabsContent value="tools" className="flex-1 overflow-y-auto m-0 p-4 space-y-3">
                  {currentTools.length > 0 ? (
                    currentTools.map((tool) => (
                      <Card key={tool.name} className="cursor-pointer hover:bg-muted/50" onClick={() => handleToolExecute(tool.name, {})}>
                        <CardHeader className="p-3">
                          <div className="flex items-center gap-2">
                            <Zap className="size-4 text-amber-500" />
                            <span className="font-medium text-sm">{tool.name}</span>
                          </div>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                          <p className="text-xs text-muted-foreground">{tool.description}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">No tools available</p>
                  )}

                  {/* Tool Results */}
                  {Object.keys(toolResults).length > 0 && (
                    <Collapsible open={isToolExpanded} onOpenChange={setIsToolExpanded}>
                      <CollapsibleTrigger className="flex items-center gap-2 w-full text-sm font-medium py-2">
                        {isToolExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                        Tool Results ({Object.keys(toolResults).length})
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-2">
                        {Object.entries(toolResults).map(([toolName, result]) => (
                          <Card key={toolName} className="bg-muted/30">
                            <CardContent className="p-3">
                              <p className="font-medium text-xs mb-1">{toolName}</p>
                              <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                                {JSON.stringify(result, null, 2)}
                              </pre>
                            </CardContent>
                          </Card>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </TabsContent>

                <TabsContent value="info" className="flex-1 overflow-y-auto m-0 p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Capabilities</h4>
                      <div className="flex flex-wrap gap-1">
                        {currentAgent.capabilities.map((cap, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {cap}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">{currentAgent.description}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="chat" className="flex-1 m-0">
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-4">
                      {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <currentAgent.icon className="size-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Chat with {currentAgent.name}</h3>
                          <p className="text-sm text-muted-foreground mb-6">Ask questions or use tools</p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {(suggestedPrompts[selectedAgent] || []).map((prompt, i) => (
                              <Badge 
                                key={i} 
                                variant="outline" 
                                className="cursor-pointer hover:bg-muted"
                                onClick={() => setInput(prompt)}
                              >
                                {prompt}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : (
                        messages.map((msg) => (
                          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full ${msg.role === 'user' ? 'bg-gray-500' : currentAgent.color} flex items-center justify-center text-white text-sm`}>
                              {msg.role === 'user' ? '👤' : <currentAgent.icon className="size-4" />}
                            </div>
                            <div className={`flex-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                              <div className="text-sm font-medium mb-1">
                                {msg.role === 'user' ? 'You' : currentAgent.name}
                              </div>
                              {msg.isToolCall ? (
                                <Card className="bg-muted/50 inline-block text-left">
                                  <CardContent className="p-2">
                                    <p className="text-xs font-medium mb-1">⚡ {msg.toolName}</p>
                                    <pre className="text-xs overflow-x-auto">
                                      {JSON.stringify(msg.toolResult, null, 2)}
                                    </pre>
                                  </CardContent>
                                </Card>
                              ) : (
                                <div className={`inline-block p-3 rounded-lg max-w-md text-sm ${
                                  msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-muted'
                                }`}>
                                  {msg.content}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                      {isLoading && (
                        <div className="flex gap-3">
                          <div className={`w-8 h-8 rounded-full ${currentAgent.color} flex items-center justify-center text-white`}>
                            <RefreshCw className="size-4 animate-spin" />
                          </div>
                          <div className="bg-muted p-3 rounded-lg">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={scrollRef} />
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 p-6">
                <div className="mx-auto max-w-3xl space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Bot className="size-16 text-muted-foreground mb-4" />
                      <h3 className="text-2xl font-semibold mb-2">QMS AI Agent System</h3>
                      <p className="text-muted-foreground mb-6 max-w-md">
                        Interact with specialized agents for Quality Management, Manufacturing, Construction, Insurance, and ISO Compliance
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {suggestedPrompts[selectedAgent]?.map((prompt, i) => (
                          <Suggestion key={i} suggestion={prompt} onClick={(selected) => setInput(selected)} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    messages.filter(m => !m.isToolCall).map((msg) => (
                      <Message key={msg.id} from={msg.role}>
                        <div className="space-y-1">
                          {msg.agentId && (
                            <p className="text-xs text-muted-foreground">{agents.find(a => a.id === msg.agentId)?.name}</p>
                          )}
                          <p>{msg.content}</p>
                        </div>
                      </Message>
                    ))
                  )}
                  {isLoading && <Message from="assistant">Thinking…</Message>}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>

              <div className="border-t p-4">
                <div className="mx-auto max-w-3xl flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                    placeholder={`Message ${currentAgent.name}...`}
                    className="min-h-[44px] max-h-32 resize-none"
                    rows={1}
                  />
                  <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
                    <Send className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

