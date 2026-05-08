'use client'

import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Zap,
  Brain,
  BarChart3,
  FileText,
  Workflow,
  Scale,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface HeroProps {
  title?: string
  subtitle?: string
  description?: string
  ctaText?: string
  ctaLink?: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
  showFeatures?: boolean
}

const defaultFeatures = [
  {
    icon: <Brain className="h-5 w-5" />,
    title: 'AI-Powered Generation',
    description: 'Intelligent automation for QMS documents and processes'
  },
  {
    icon: <Scale className="h-5 w-5" />,
    title: 'ISO 9001 Compliant',
    description: 'Built-in compliance checks for quality standards'
  },
  {
    icon: <Workflow className="h-5 w-5" />,
    title: 'Visual Process Designer',
    description: 'Drag-and-drop flow automation builder'
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: 'Document Management',
    description: 'Complete control over QMS documentation'
  }
]

const stats = [
  { value: 'ISO 9001', label: 'Certified' },
  { value: '500+', label: 'Documents' },
  { value: '95%', label: 'Compliance' },
  { value: '50+', label: 'Templates' }
]

const testimonials = [
  {
    quote: "QMS Generator reduced our documentation time by 60%.",
    author: "Jane Smith",
    role: "Quality Manager"
  },
  {
    quote: "The AI features helped us achieve ISO 9001 compliance faster.",
    author: "John Doe",
    role: "Operations Director"
  }
]

export function LandingHero({
  title = 'AI-Powered QMS Generator',
  subtitle = 'ISO 9001 Quality Management System',
  description = 'Generate, manage, and automate your quality management system with AI-powered tools. Streamline compliance, reduce manual work, and ensure continuous improvement.',
  ctaText = 'Get Started Free',
  ctaLink = '/generator',
  secondaryCtaText = 'Watch Demo',
  secondaryCtaLink = '/demo',
  showFeatures = true
}: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-primary">AI-Powered Quality Management</span>
          </div>

          {/* Main Title */}
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="mb-2 text-lg text-muted-foreground">
            {subtitle}
          </p>

          {/* Description */}
          <p className="mx-auto mb-8 max-w-2xl text-base text-muted-foreground md:text-lg">
            {description}
          </p>

          {/* CTA Buttons */}
          <div className="mb-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link href={ctaLink}>
                <Zap className="h-4 w-4" />
                {ctaText}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href={secondaryCtaLink}>
                <Play className="h-4 w-4" />
                {secondaryCtaText}
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mb-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>ISO 9001 Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>14-Day Free Trial</span>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="rounded-lg border bg-background/50 p-4 text-center"
              >
                <div className="text-2xl font-bold sm:text-3xl">{stat.value}</div>
                <div className="text-xs text-muted-foreground sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Quick Navigation Links */}
          <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm text-muted-foreground">Popular:</span>
            <Button variant="secondary" size="sm" asChild className="h-8">
              <Link href="/generator">
                QMS Generator
                <ChevronRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
            <Button variant="secondary" size="sm" asChild className="h-8">
              <Link href="/iso/risk/assess">
                Risk Assessment
                <ChevronRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
            <Button variant="secondary" size="sm" asChild className="h-8">
              <Link href="/flow-process">
                Process Designer
                <ChevronRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
            <Button variant="secondary" size="sm" asChild className="h-8">
              <Link href="/iso/audit/generate">
                Audit Generator
                <ChevronRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        {showFeatures && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {defaultFeatures.map((feature, index) => (
              <div
                key={index}
                className="group rounded-lg border bg-background/50 p-6 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                  {feature.icon}
                </div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Social Proof - Testimonials */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-lg border bg-background/50 p-6"
            >
              <div className="mb-4 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-4 w-4 fill-primary"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="mb-4 text-lg font-medium">
                "{testimonial.quote}"
              </blockquote>
              <div className="text-sm">
                <div className="font-semibold">{testimonial.author}</div>
                <div className="text-muted-foreground">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-lg border bg-gradient-to-r from-primary/10 to-primary/5 p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
            Ready to Streamline Your QMS?
          </h2>
          <p className="mx-auto mb-6 max-w-xl text-muted-foreground">
            Join 500+ companies already using QMS Generator to automate their quality management system.
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link href="/generator">
              Start Your Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Footer Links */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm">
          <Link href="/docs" className="text-muted-foreground hover:text-foreground">
            Documentation
          </Link>
          <Link href="/help" className="text-muted-foreground hover:text-foreground">
            Help Center
          </Link>
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-muted-foreground hover:text-foreground">
            Terms of Service
          </Link>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          © 2024 QMS Generator. All rights reserved.
        </div>
      </div>
    </section>
  )
}

export default LandingHero
