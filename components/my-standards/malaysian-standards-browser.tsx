'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Calendar, 
  FileText, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronRight,
  Building2,
  Leaf,
  Shield,
  Lock,
  CloudRain,
  Info,
  Download,
  BookOpen
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  MALAYSIAN_STANDARDS_COLLECTION,
  type MalaysianStandardData,
  getClimateAmendments,
  getBaseStandards,
} from '@/lib/data/malaysian-standards-data'

const categoryIcons: Record<string, React.ElementType> = {
  'MS ISO 9001': Building2,
  'MS ISO 14001': Leaf,
  'MS ISO 45001': Shield,
  'MS ISO/IEC 27001': Lock,
}

const categoryColors: Record<string, string> = {
  'MS ISO 9001': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'MS ISO 14001': 'bg-green-500/10 text-green-600 border-green-500/20',
  'MS ISO 45001': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  'MS ISO/IEC 27001': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
}

function getCategory(standardId: string): string {
  if (standardId.includes('9001')) return 'MS ISO 9001'
  if (standardId.includes('14001')) return 'MS ISO 14001'
  if (standardId.includes('45001')) return 'MS ISO 45001'
  if (standardId.includes('27001')) return 'MS ISO/IEC 27001'
  return 'Other'
}

function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    'MS ISO 9001': 'Quality Management',
    'MS ISO 14001': 'Environmental Management',
    'MS ISO 45001': 'Occupational Health & Safety',
    'MS ISO/IEC 27001': 'Information Security',
  }
  return names[category] || category
}

interface StandardCardProps {
  standard: MalaysianStandardData
  isSelected: boolean
  onClick: () => void
}

function StandardCard({ standard, isSelected, onClick }: StandardCardProps) {
  const category = getCategory(standard.standard_id)
  const Icon = categoryIcons[category] || FileText
  const colorClass = categoryColors[category] || 'bg-muted text-muted-foreground'
  const isAmendment = standard.amendment !== undefined

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <Card 
        className={`cursor-pointer transition-all duration-200 ${
          isSelected 
            ? 'ring-2 ring-primary shadow-lg' 
            : 'hover:shadow-md hover:border-primary/30'
        }`}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${colorClass}`}>
              <Icon className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm leading-tight truncate">
                    {standard.standard_id}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {standard.title}
                  </p>
                </div>
                {isAmendment && (
                  <Badge variant="outline" className="shrink-0 bg-orange-500/10 text-orange-600 border-orange-500/20">
                    <CloudRain className="size-3 mr-1" />
                    Climate
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary" className="text-xs">
                  {standard.status}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="size-3" />
                  {new Date(standard.adoption_date).toLocaleDateString('en-MY', {
                    year: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface StandardDetailProps {
  standard: MalaysianStandardData
}

function StandardDetail({ standard }: StandardDetailProps) {
  const category = getCategory(standard.standard_id)
  const Icon = categoryIcons[category] || FileText
  const colorClass = categoryColors[category] || 'bg-muted text-muted-foreground'
  const isAmendment = standard.amendment !== undefined

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${colorClass}`}>
          <Icon className="size-8" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold">{standard.standard_id}</h2>
            <Badge variant="secondary">{standard.status}</Badge>
            {isAmendment && (
              <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                <CloudRain className="size-3 mr-1" />
                Climate Amendment
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1">{standard.title}</p>
        </div>
      </div>

      <Separator />

      {/* Description */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="size-4" />
            Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {standard.description}
          </p>
        </CardContent>
      </Card>

      {/* Key Information */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="size-4" />
              Standard Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Adoption Date</span>
              <span className="font-medium">
                {new Date(standard.adoption_date).toLocaleDateString('en-MY', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Base Standard</span>
              <span className="font-medium text-right max-w-[200px]">{standard.base_standard}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ICS Code</span>
              <span className="font-medium">{standard.ics_code}</span>
            </div>
            {standard.nsc && (
              <>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">NSC</span>
                  <span className="font-medium text-right max-w-[200px]">{standard.nsc}</span>
                </div>
              </>
            )}
            {standard.identical_to && (
              <>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Identical To</span>
                  <span className="font-medium text-right max-w-[200px]">{standard.identical_to}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Download className="size-4" />
              Access Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Portal</span>
              <span className="font-medium">{standard.access.portal}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price</span>
              <span className="font-medium">{standard.access.price}</span>
            </div>
            <Separator />
            <div className="text-sm">
              <span className="text-muted-foreground">Availability</span>
              <p className="font-medium mt-1">{standard.access.availability}</p>
            </div>
            {standard.url && standard.url !== "Not available" && (
              <>
                <Separator />
                <Button variant="outline" className="w-full" asChild>
                  <a href={standard.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-4 mr-2" />
                    View on MySOL
                  </a>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Climate Amendment Changes */}
      {isAmendment && standard.amendment && (
        <Card className="border-orange-500/30 bg-orange-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-orange-600">
              <CloudRain className="size-4" />
              Climate Action Amendment Changes
            </CardTitle>
            <CardDescription>
              Published: {new Date(standard.amendment.international_publication_date).toLocaleDateString('en-MY')} | 
              Adopted: {new Date(standard.amendment.national_adoption_date).toLocaleDateString('en-MY')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {standard.amendment.key_changes.map((change, index) => (
                <AccordionItem key={index} value={`change-${index}`}>
                  <AccordionTrigger className="text-sm font-medium">
                    {change.clause}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-3 bg-background rounded-lg border">
                      <p className="text-sm">{change.change}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Implementation Requirements */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="size-4" />
            Implementation Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className={`p-1.5 rounded-full ${standard.implementation_requirements.immediate_effect ? 'bg-amber-500/10 text-amber-600' : 'bg-green-500/10 text-green-600'}`}>
              {standard.implementation_requirements.immediate_effect ? (
                <AlertTriangle className="size-4" />
              ) : (
                <Clock className="size-4" />
              )}
            </div>
            <div>
              <h4 className="font-medium text-sm">
                {standard.implementation_requirements.immediate_effect ? 'Immediate Effect' : 'Transition Period Available'}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {standard.implementation_requirements.transition_period}
              </p>
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium text-sm">Impact Assessment</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {standard.implementation_requirements.impact_assessment}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Background and Justification */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="size-4" />
            Background & Justification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="font-medium text-sm">Reason</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {standard.background_and_justification.reason}
            </p>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium text-sm">Reference</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {standard.background_and_justification.reference}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function MalaysianStandardsBrowser() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showAmendmentsOnly, setShowAmendmentsOnly] = useState(false)
  const [selectedStandard, setSelectedStandard] = useState<MalaysianStandardData | null>(
    MALAYSIAN_STANDARDS_COLLECTION.standards[0] || null
  )

  const categories = useMemo(() => {
    const cats = new Set<string>()
    MALAYSIAN_STANDARDS_COLLECTION.standards.forEach(s => {
      cats.add(getCategory(s.standard_id))
    })
    return Array.from(cats)
  }, [])

  const filteredStandards = useMemo(() => {
    return MALAYSIAN_STANDARDS_COLLECTION.standards.filter(standard => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        standard.standard_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        standard.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        standard.description.toLowerCase().includes(searchQuery.toLowerCase())

      // Category filter
      const matchesCategory = selectedCategory === 'all' || 
        getCategory(standard.standard_id) === selectedCategory

      // Amendment filter
      const matchesAmendment = !showAmendmentsOnly || standard.amendment !== undefined

      return matchesSearch && matchesCategory && matchesAmendment
    })
  }, [searchQuery, selectedCategory, showAmendmentsOnly])

  const climateAmendments = getClimateAmendments()
  const baseStandards = getBaseStandards()

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Malaysian Standards Browser</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Source: {MALAYSIAN_STANDARDS_COLLECTION.source} | As of: {MALAYSIAN_STANDARDS_COLLECTION.as_of}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <FileText className="size-3" />
                {MALAYSIAN_STANDARDS_COLLECTION.standards.length} Standards
              </Badge>
              <Badge variant="outline" className="gap-1 bg-orange-500/10 text-orange-600 border-orange-500/20">
                <CloudRain className="size-3" />
                {climateAmendments.length} Climate Amendments
              </Badge>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search standards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <Filter className="size-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {getCategoryName(cat)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={showAmendmentsOnly ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowAmendmentsOnly(!showAmendmentsOnly)}
                  >
                    <CloudRain className="size-4 mr-2" />
                    Climate Amendments
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {showAmendmentsOnly ? 'Show all standards' : 'Show only climate amendments'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Standards List */}
        <div className="w-[400px] border-r bg-muted/30">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredStandards.map((standard) => (
                  <motion.div
                    key={standard.standard_id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <StandardCard
                      standard={standard}
                      isSelected={selectedStandard?.standard_id === standard.standard_id}
                      onClick={() => setSelectedStandard(standard)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredStandards.length === 0 && (
                <div className="text-center py-12">
                  <Search className="size-12 mx-auto text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">No standards found matching your criteria</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Detail Panel */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6">
              {selectedStandard ? (
                <StandardDetail standard={selectedStandard} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="size-16 mx-auto text-muted-foreground/30" />
                    <p className="mt-4 text-muted-foreground">Select a standard to view details</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default MalaysianStandardsBrowser
