'use client'

import { 
  Sparkles, 
  Zap, 
  Brain, 
  Shield, 
  FileText, 
  Workflow, 
  BarChart3,
  Scale,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  link?: string
  linkText?: string
  badge?: string
  color?: string
}

interface FeaturesSectionProps {
  title?: string
  subtitle?: string
  features?: Feature[]
}

const defaultFeatures: Feature[] = [
  {
    icon: <Brain className="h-5 w-5" />,
    title: 'AI Document Generation',
    description: 'Generate QMS documents automatically with AI. Create procedures, work instructions, and forms in minutes.',
    link: '/generator',
    linkText: 'Generate Documents',
    badge: 'Popular',
    color: 'bg-blue-500'
  },
  {
    icon: <Workflow className="h-5 w-5" />,
    title: 'Visual Process Designer',
    description: 'Drag-and-drop interface to design and automate business processes with flowcharts.',
    link: '/flow-process',
    linkText: 'Design Process',
    badge: 'New',
    color: 'bg-purple-500'
  },
  {
    icon: <Scale className="h-5 w-5" />,
    title: 'Risk Assessment',
    description: 'AI-powered risk identification and assessment with automated scoring.',
    link: '/iso/risk/assess',
    linkText: 'Assess Risks',
    color: 'bg-orange-500'
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: 'ISO Compliance',
    description: 'Built-in compliance checks for ISO 9001, ISO 14001, and other standards.',
    link: '/iso/compliance/check',
    linkText: 'Check Compliance',
    badge: 'Certified',
    color: 'bg-green-500'
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: 'Document Management',
    description: 'Complete control over QMS documentation with version control and approvals.',
    link: '/documents',
    linkText: 'Manage Docs',
    color: 'bg-cyan-500'
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: 'Analytics Dashboard',
    description: 'Real-time insights into your QMS performance with AI-generated recommendations.',
    link: '/',
    linkText: 'View Dashboard',
    color: 'bg-pink-500'
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: 'Automated Workflows',
    description: 'Streamline processes with automated approval chains and notifications.',
    link: '/flow-process/enhanced',
    linkText: 'Create Workflow',
    badge: 'AI',
    color: 'bg-yellow-500'
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: 'Team Collaboration',
    description: 'Built-in tools for team collaboration on quality initiatives.',
    link: '/agents',
    linkText: 'Invite Team',
    color: 'bg-indigo-500'
  }
]

export function FeaturesSection({
  title = 'Powerful Features for QMS',
  subtitle = 'Everything you need to build and maintain a world-class quality management system',
  features = defaultFeatures
}: FeaturesSectionProps) {
  return (
    <section className="py-16">
      <div className="container px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Features
          </div>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{title}</h2>
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-lg border bg-background p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              {feature.badge && (
                <div className="absolute right-3 top-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white ${feature.color || 'bg-primary'}`}>
                    {feature.badge}
                  </span>
                </div>
              )}
              
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.color || 'bg-primary'} text-white`}>
                {feature.icon}
              </div>
              
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {feature.description}
              </p>
              
              {feature.link && (
                <Link
                  href={feature.link}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
                >
                  {feature.linkText || 'Learn More'}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/features">
              View All Features
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

// Feature comparison table
interface ComparisonFeature {
  feature: string
  free: boolean | string
  pro: boolean | string
  enterprise: boolean | string
}

interface FeatureComparisonProps {
  title?: string
  subtitle?: string
  features?: ComparisonFeature[]
}

const defaultComparisonFeatures: ComparisonFeature[] = [
  { feature: 'AI Document Generation', free: '5/mo', pro: '50/mo', enterprise: 'Unlimited' },
  { feature: 'Process Designer', free: true, pro: true, enterprise: true },
  { feature: 'Risk Assessment', free: true, pro: true, enterprise: true },
  { feature: 'ISO Compliance Checks', free: 'Basic', pro: 'Full', enterprise: 'Full + Custom' },
  { feature: 'Document Management', free: '100 docs', pro: '5,000 docs', enterprise: 'Unlimited' },
  { feature: 'Team Members', free: '1', pro: '10', enterprise: 'Unlimited' },
  { feature: 'Analytics Dashboard', free: false, pro: true, enterprise: true },
  { feature: 'API Access', free: false, pro: true, enterprise: true },
  { feature: 'Priority Support', free: false, pro: true, enterprise: true },
  { feature: 'Custom Branding', free: false, pro: false, enterprise: true }
]

export function FeatureComparison({
  title = 'Compare Plans',
  subtitle = 'Choose the plan that fits your needs',
  features = defaultComparisonFeatures
}: FeatureComparisonProps) {
  const Check = ({ value }: { value: boolean | string }) => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckCircle2 className="h-5 w-5 text-green-500" />
      ) : (
        <span className="text-muted-foreground">—</span>
      )
    }
    return <span className="text-sm">{value}</span>
  }

  return (
    <section className="py-16">
      <div className="container px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{title}</h2>
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b">
                <th className="pb-4 text-left font-medium">Feature</th>
                <th className="pb-4 text-center">
                  <span className="rounded-full bg-muted px-3 py-1 text-sm">Free</span>
                </th>
                <th className="pb-4 text-center">
                  <span className="rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground">Pro</span>
                </th>
                <th className="pb-4 text-center">
                  <span className="rounded-full bg-muted px-3 py-1 text-sm">Enterprise</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((row, index) => (
                <tr key={index} className="border-b">
                  <td className="py-4 text-left">{row.feature}</td>
                  <td className="py-4 text-center"><Check value={row.free} /></td>
                  <td className="py-4 text-center"><Check value={row.pro} /></td>
                  <td className="py-4 text-center"><Check value={row.enterprise} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/pricing">View Full Comparison</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
