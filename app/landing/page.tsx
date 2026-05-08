'use client'

import { LandingHero, WelcomeBanner, FeaturesSection } from '@/components/landing'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <LandingHero 
        title="QMS Generator"
        subtitle="AI-Powered Quality Management System"
        description="Generate, manage, and automate your quality management system with AI-powered tools. Streamline ISO 9001 compliance, reduce manual work, and ensure continuous improvement."
        ctaText="Start Free Trial"
        ctaLink="/generator"
        secondaryCtaText="View Demo"
        secondaryCtaLink="/demo"
        showFeatures={true}
      />
      
      <WelcomeBanner 
        title="Welcome to QMS Generator"
        message="Your AI-powered quality management system is ready. Start generating documents, designing processes, and achieving compliance."
        showDismiss={true}
      />
      
      <FeaturesSection 
        title="Powerful Features for QMS"
        subtitle="Everything you need to build and maintain a world-class quality management system"
      />
    </div>
  )
}
