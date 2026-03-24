"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Download,
  Eye,
  Wand2,
  Shield,
  Building,
  Target,
  Settings,
  Users,
  CheckCircle,
  AlertCircle,
  Brain,
  Sparkles,
  Plus,
  X,
  FolderOpen,
  Printer,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  AIMetricCard,
  AIInsightCard,
  AIToggle,
  AIBadge,
  AIAlert,
  AILiveBadge,
} from "@/sdk/components/ai/index";

import {
  GlassmorphicCard,
  StaggerContainer,
  StaggerItem,
  SlideIn,
  GlassButton,
  GlassInput,
  GlassTextarea,
  GlassSelect,
  FloatingElement,
  GradientText,
  GlassModal,
} from "@/components/GlassmorphicCard";

import { EnhancedMermaid } from "./enhanced_mermaid";
import { ISOComplianceChecker } from "./ISOComplianceChecker";
import { ProcessFlowDesigner } from "./processflow_designer";
import { RiskAssessmentTool } from "./RiskAssessmentTool";

interface FormData {
  companyName: string;
  industry: string;
  scope: string;
  objectives: string;
  processes: string;
  qualityPolicy: string;
  locations: string[];
  employees: number;
  certificationTarget: string;
  complianceLevel: "basic" | "standard" | "premium";
  riskTolerance: "low" | "medium" | "high";
}

interface GeneratedDocument {
  id: string;
  title: string;
  content: string;
  version: string;
  status: "draft" | "review" | "approved";
  createdAt: string;
  sections: string[];
  isoRequirements: string[];
  complianceScore: number;
}

const industries = [
  "Manufacturing",
  "Software Development",
  "Healthcare",
  "Automotive",
  "Aerospace",
  "Food & Beverage",
  "Pharmaceutical",
  "Construction",
  "Education",
  "Financial Services",
  "Retail",
  "Telecommunications",
  "Energy",
  "Logistics",
  "Hospitality",
  "Consulting",
  "Other",
];

const certificationTargets = [
  "ISO 9001:2015",
  "ISO 14001:2015",
  "ISO 45001:2018",
  "ISO 27001:2022",
  "IATF 16949:2016",
  "AS9100D",
  "ISO 13485:2016",
  "Multiple Certifications",
];

const complianceLevels = [
  { value: "basic", label: "Basic Compliance", description: "Essential requirements only" },
  { value: "standard", label: "Standard", description: "Full ISO 9001 compliance" },
  { value: "premium", label: "Premium", description: "Advanced quality management with AI analytics" },
];

const isoRequirements = [
  { clause: "4", title: "Context of the Organization" },
  { clause: "5", title: "Leadership" },
  { clause: "6", title: "Planning" },
  { clause: "7", title: "Support" },
  { clause: "8", title: "Operation" },
  { clause: "9", title: "Performance Evaluation" },
  { clause: "10", title: "Improvement" },
];

export function QMSGenerator() {
  const [formData, setFormData] = React.useState<FormData>({
    companyName: "",
    industry: "",
    scope: "",
    objectives: "",
    processes: "",
    qualityPolicy: "",
    locations: [""],
    employees: 50,
    certificationTarget: "ISO 9001:2015",
    complianceLevel: "standard",
    riskTolerance: "medium",
  });

  const [isGenerating, setIsGenerating] = React.useState(false);
  const [aiMode, setAiMode] = React.useState(true);
  const [activeStep, setActiveStep] = React.useState<"info" | "processes" | "risks" | "review">("info");
  const [generatedDocuments, setGeneratedDocuments] = React.useState<GeneratedDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = React.useState<GeneratedDocument | null>(null);
  const [showPreview, setShowPreview] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const stats = [
    {
      label: "ISO Compliance",
      value: 92,
      trend: "up" as const,
      change: "+5%",
      icon: Shield,
      gradient: "from-success/80 to-success/60",
      description: "Current score",
    },
    {
      label: "Processes Mapped",
      value: 14,
      trend: "up" as const,
      change: "+3",
      icon: Target,
      gradient: "from-chart-1/80 to-chart-2/80",
      description: "Business processes",
    },
    {
      label: "Documents Generated",
      value: 28,
      trend: "up" as const,
      change: "+8",
      icon: FileText,
      gradient: "from-chart-4/80 to-chart-5/80",
      description: "QMS documents",
    },
    {
      label: "Risk Score",
      value: 7.2,
      trend: "down" as const,
      change: "-1.3",
      icon: AlertCircle,
      gradient: "from-warning/80 to-warning/60",
      description: "Lower is better",
    },
  ];

  const aiInsights = [
    {
      id: "insight-1",
      title: "Risk Assessment Required",
      description: "High-risk processes identified in manufacturing flow. AI recommends implementing additional controls.",
      severity: "warning" as const,
      confidence: 89,
      icon: AlertCircle,
      action: "View Risk Assessment",
    },
    {
      id: "insight-2",
      title: "Document Optimization",
      description: "AI detected redundant procedures in current QMS. Suggested consolidation can reduce documentation by 40%.",
      severity: "info" as const,
      confidence: 92,
      icon: FileText,
      action: "Optimize Documents",
    },
    {
      id: "insight-3",
      title: "Compliance Score: 92%",
      description: "Current QMS meets 92% of ISO 9001:2015 requirements. Areas for improvement identified.",
      severity: "success" as const,
      confidence: 94,
      icon: Shield,
      action: "View Details",
    },
  ];

  const generateQMSContent = () => {
    return `# Quality Management System
## ${formData.companyName || "Company Name"}
### ${formData.certificationTarget} Compliance

---

## 1. QUALITY POLICY
**Policy Statement:**
${formData.qualityPolicy || `${formData.companyName || "Our organization"} is committed to delivering products and services that consistently meet customer requirements while complying with applicable statutory and regulatory requirements. We are dedicated to continual improvement of our Quality Management System to enhance customer satisfaction.`}

**Commitments:**
- Customer focus and satisfaction
- Leadership and engagement
- Process approach
- Improvement culture
- Evidence-based decision making
- Relationship management

---

## 2. SCOPE OF THE QUALITY MANAGEMENT SYSTEM
### 2.1 Applicability
${formData.scope || `This Quality Management System applies to all activities, processes, and functions within ${formData.companyName || "the organization"} that affect the quality of products and services delivered to customers.`}

### 2.2 Organizational Context
- **Industry:** ${formData.industry || "Not specified"}
- **Employees:** ${formData.employees}
- **Locations:** ${formData.locations.filter(l => l).join(", ") || "Not specified"}
- **Certification Target:** ${formData.certificationTarget}

---

## 3. NORMATIVE REFERENCES
- ISO 9000:2015 - Quality management systems - Fundamentals and vocabulary
- ISO 9001:2015 - Quality management systems - Requirements
- ISO 9004:2018 - Quality management - Quality of an organization

---

## 4. CONTEXT OF THE ORGANIZATION
### 4.1 Understanding the Organization and Its Context
${formData.companyName || "The organization"} operates in the ${formData.industry || "industry"}, serving customers with ${formData.processes || "high-quality products and services"}.

**External Issues:**
- Market conditions and competition
- Regulatory requirements
- Technological changes
- Social and cultural factors

**Internal Issues:**
- Organizational culture
- Knowledge and performance
- Infrastructure and resources

---

## 5. LEADERSHIP
### 5.1 Leadership and Commitment
Top management demonstrates leadership and commitment by:
- Establishing quality policy and objectives
- Integrating QMS requirements into business processes
- Promoting process approach and risk-based thinking
- Ensuring availability of necessary resources

---

## 6. PLANNING
### 6.1 Actions to Address Risks and Opportunities
**Risk Assessment:** ${formData.riskTolerance === "high" ? "Aggressive risk management approach with innovation focus." : "Balanced approach to risk and opportunity management."}

### 6.2 Quality Objectives and Planning to Achieve Them
${formData.objectives || "Quality objectives are established at relevant functions and levels, and are measurable, consistent with the quality policy."}

**Key Objectives:**
1. Customer Satisfaction >= 95%
2. On-time Delivery >= 98%
3. Product/Service Non-conformities <= 2%
4. Continual Improvement Projects >= 4 per year

---

## 7. SUPPORT
### 7.1 Resources
**Human Resources:** ${formData.employees} employees with defined competence requirements.

### 7.2 Competence
Competence requirements are defined, personnel are competent, and training effectiveness is evaluated.

### 7.3 Awareness
Personnel are aware of quality policy, objectives, and their contribution to QMS effectiveness.

### 7.4 Communication
Internal and external communications relevant to the QMS are established and maintained.

### 7.5 Documented Information
Documented information required by ISO 9001:2015 is maintained and controlled.

---

## 8. OPERATION
### 8.1 Operational Planning and Control
Processes needed to meet requirements for products and services are planned, implemented, and controlled.

### 8.2 Requirements for Products and Services
Customer requirements are determined, reviewed, and communicated.

---

## 9. PERFORMANCE EVALUATION
### 9.1 Monitoring, Measurement, Analysis and Evaluation
Performance is monitored and measured at appropriate intervals.

### 9.2 Internal Audit
Internal audits are conducted at planned intervals to verify QMS conformity and effectiveness.

### 9.3 Management Review
Top management reviews the QMS at planned intervals.

---

## 10. IMPROVEMENT
### 10.1 General
The organization continually improves the suitability, adequacy, and effectiveness of the QMS.

### 10.2 Nonconformity and Corrective Action
When nonconformities occur, appropriate actions are taken.

### 10.3 Continual Improvement
Continual improvement opportunities are identified and implemented.

---

**DOCUMENT INFORMATION**
- **Document ID:** QMS-${(formData.companyName || "ORG").replace(/\s+/g, "-").toUpperCase()}
- **Version:** 1.0
- **Status:** DRAFT
- **Created:** ${new Date().toLocaleDateString()}

---
*Generated by AI-Powered QMS Generator*`;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    setTimeout(() => {
      const content = generateQMSContent();
      const newDocument: GeneratedDocument = {
        id: `QMS-${Date.now()}`,
        title: `QMS - ${formData.companyName || "New Organization"} - ${formData.certificationTarget}`,
        content,
        version: "1.0",
        status: "draft",
        createdAt: new Date().toISOString(),
        sections: [
          "Quality Policy",
          "Scope",
          "Normative References",
          "Context of Organization",
          "Leadership",
          "Planning",
          "Support",
          "Operation",
          "Performance Evaluation",
          "Improvement",
        ],
        isoRequirements: isoRequirements.map((req) => `${req.clause} - ${req.title}`),
        complianceScore: 92,
      };

      setGeneratedDocuments((prev) => [newDocument, ...prev]);
      setSelectedDocument(newDocument);
      setIsGenerating(false);
    }, 2500);
  };

  const handleDownload = (doc: GeneratedDocument) => {
    const blob = new Blob([doc.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.title.replace(/\s+/g, "-")}-v${doc.version}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { id: "info", label: "Company Info", icon: Building },
    { id: "processes", label: "QMS Details", icon: FileText },
    { id: "risks", label: "Risk Assessment", icon: AlertCircle },
    { id: "review", label: "Review", icon: CheckCircle },
  ];

  const processFlowDiagram = `
flowchart TD
    A[Organizational Context] --> B[Leadership & Commitment]
    B --> C[Quality Policy]
    C --> D[Planning & Objectives]
    D --> E[Resource Management]
    E --> F[Operational Processes]
    F --> G[Performance Evaluation]
    G --> H[Continual Improvement]
    H --> B
  `;

  const renderStepContent = () => {
    switch (activeStep) {
      case "info":
        return (
          <StaggerContainer className="space-y-6">
            <StaggerItem>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="companyName" className="text-sm font-medium mb-2 block">
                      Company Name *
                    </Label>
                    <GlassInput
                      id="companyName"
                      placeholder="Enter your company name"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      icon={<Building className="w-4 h-4" />}
                    />
                  </div>

                  <div>
                    <Label htmlFor="industry" className="text-sm font-medium mb-2 block">
                      Industry *
                    </Label>
                    <GlassSelect
                      value={formData.industry}
                      onValueChange={(value) => setFormData({ ...formData, industry: value })}
                      placeholder="Select your industry"
                    >
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </GlassSelect>
                  </div>

                  <div>
                    <Label htmlFor="employees" className="text-sm font-medium mb-2 block">
                      Number of Employees
                    </Label>
                    <Input
                      id="employees"
                      type="number"
                      min="1"
                      value={formData.employees}
                      onChange={(e) =>
                        setFormData({ ...formData, employees: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="certificationTarget" className="text-sm font-medium mb-2 block">
                      Certification Target *
                    </Label>
                    <Select
                      value={formData.certificationTarget}
                      onValueChange={(value) =>
                        setFormData({ ...formData, certificationTarget: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select certification" />
                      </SelectTrigger>
                      <SelectContent>
                        {certificationTargets.map((cert) => (
                          <SelectItem key={cert} value={cert}>
                            {cert}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="complianceLevel" className="text-sm font-medium mb-2 block">
                      Compliance Level
                    </Label>
                    <Select
                      value={formData.complianceLevel}
                      onValueChange={(value: "basic" | "standard" | "premium") =>
                        setFormData({ ...formData, complianceLevel: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {complianceLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="riskTolerance" className="text-sm font-medium mb-2 block">
                      Risk Tolerance
                    </Label>
                    <Select
                      value={formData.riskTolerance}
                      onValueChange={(value: "low" | "medium" | "high") =>
                        setFormData({ ...formData, riskTolerance: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tolerance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (Conservative)</SelectItem>
                        <SelectItem value="medium">Medium (Balanced)</SelectItem>
                        <SelectItem value="high">High (Innovative)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="space-y-4">
                <Label className="text-sm font-medium">Company Locations</Label>
                <div className="space-y-3">
                  {formData.locations.map((location, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Input
                        value={location}
                        onChange={(e) => {
                          const newLocations = [...formData.locations];
                          newLocations[index] = e.target.value;
                          setFormData({ ...formData, locations: newLocations });
                        }}
                        placeholder="Enter location (e.g., New York, USA)"
                        className="flex-1"
                      />
                      {formData.locations.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newLocations = formData.locations.filter((_, i) => i !== index);
                            setFormData({ ...formData, locations: newLocations });
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFormData({ ...formData, locations: [...formData.locations, ""] })
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Location
                  </Button>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        );

      case "processes":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="scope" className="text-sm font-medium mb-2 block">
                    QMS Scope *
                  </Label>
                  <GlassTextarea
                    id="scope"
                    placeholder="Define the scope of your Quality Management System"
                    value={formData.scope}
                    onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="qualityPolicy" className="text-sm font-medium mb-2 block">
                    Quality Policy
                  </Label>
                  <Textarea
                    id="qualityPolicy"
                    placeholder="Enter your company's quality policy statement"
                    value={formData.qualityPolicy}
                    onChange={(e) => setFormData({ ...formData, qualityPolicy: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="objectives" className="text-sm font-medium mb-2 block">
                    Quality Objectives *
                  </Label>
                  <Textarea
                    id="objectives"
                    placeholder="Define measurable quality objectives"
                    value={formData.objectives}
                    onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="processes" className="text-sm font-medium mb-2 block">
                    Key Processes Description
                  </Label>
                  <Textarea
                    id="processes"
                    placeholder="Describe your key business processes and interactions"
                    value={formData.processes}
                    onChange={(e) => setFormData({ ...formData, processes: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {aiMode && (
              <AIAlert
                type="info"
                title="AI Process Optimization"
                description="AI can analyze your processes and suggest optimizations based on industry best practices."
                showIcon
                showAction
                actionText="Optimize with AI"
                onClick={() => console.log("AI optimization")}
              />
            )}
          </div>
        );

      case "risks":
        return (
          <div className="space-y-6">
            <RiskAssessmentTool />
          </div>
        );

      case "review":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassmorphicCard gradient="from-card/80 to-card/60" blur="xl">
                <div className="p-6">
                  <h3 className="font-semibold mb-4">Configuration Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Company:</span>
                      <span className="font-medium">{formData.companyName || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Industry:</span>
                      <span className="font-medium">{formData.industry || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Certification:</span>
                      <span className="font-medium">{formData.certificationTarget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Compliance Level:</span>
                      <span className="font-medium">
                        {complianceLevels.find((l) => l.value === formData.complianceLevel)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Risk Tolerance:</span>
                      <span className="font-medium capitalize">{formData.riskTolerance}</span>
                    </div>
                  </div>
                </div>
              </GlassmorphicCard>

              <GlassmorphicCard gradient="from-card/80 to-card/60" blur="xl">
                <div className="p-6">
                  <h3 className="font-semibold mb-4">Generated Content Preview</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Sections:</span>
                      <span className="font-medium">10 Main Sections</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">ISO Clauses:</span>
                      <span className="font-medium">All 10 Clauses Covered</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Estimated Pages:</span>
                      <span className="font-medium">40-50 Pages</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">AI Enhancement:</span>
                      <AIBadge variant={aiMode ? "success" : "outline"}>
                        {aiMode ? "Enabled" : "Disabled"}
                      </AIBadge>
                    </div>
                  </div>
                </div>
              </GlassmorphicCard>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">ISO 9001:2015 Requirements Coverage</h3>
              <div className="grid grid-cols-7 gap-2">
                {isoRequirements.map((req) => (
                  <div key={req.clause} className="text-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-chart-1 to-chart-2 rounded-lg flex items-center justify-center text-foreground font-bold mx-auto mb-1">
                      {req.clause}
                    </div>
                    <p className="text-xs text-muted-foreground">{req.title}</p>
                  </div>
                ))}
              </div>
            </div>

            <ISOComplianceChecker />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">
              <GradientText from="from-chart-1" to="to-chart-2">
                AI QMS Generator
              </GradientText>
            </h1>
            <p className="text-muted-foreground mt-1">
              Generate ISO 9001:2015 compliant Quality Management System documents with AI
            </p>
          </div>

          <div className="flex items-center gap-3">
            <AIToggle
              checked={aiMode}
              onChange={setAiMode}
              label="AI Mode"
              showIcon
              icon={Brain}
            />

            <GlassButton variant="secondary" onClick={() => console.log("Load template")}>
              <FolderOpen className="w-4 h-4 mr-2" />
              Templates
            </GlassButton>
          </div>
        </div>

        {/* Live Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AILiveBadge status="active" pulse={aiMode} size="lg" />
            <span className="text-sm text-muted-foreground">
              {aiMode ? "AI Generation Active - ISO 9001:2015 Compliance" : "Manual Mode"}
            </span>
          </div>

          <div className="text-sm text-muted-foreground">
            Documents Generated: {generatedDocuments.length}
          </div>
        </div>

        {/* Stats */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StaggerItem key={index}>
              <AIMetricCard
                title={stat.label}
                value={stat.value}
                trend={stat.trend}
                change={stat.change}
                icon={stat.icon}
                gradient={stat.gradient}
                description={stat.description}
                onClick={() => console.log(`View ${stat.label}`)}
                animation="scale"
                delay={index * 0.1}
                enhanced={aiMode}
                precision={stat.label === "Risk Score" ? 1 : 0}
                suffix={stat.label === "ISO Compliance" ? "%" : ""}
                size="sm"
              />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* AI Insights */}
        {aiMode && (
          <SlideIn direction="up" delay={0.2}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Brain className="w-6 h-6 text-chart-1" />
                  <h2 className="text-lg font-bold">AI QMS Insights</h2>
                </div>
                <AIBadge variant="outline">{aiInsights.length} Active Insights</AIBadge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {aiInsights.map((insight) => (
                  <AIInsightCard
                    key={insight.id}
                    title={insight.title}
                    description={insight.description}
                    icon={insight.icon}
                    severity={insight.severity}
                    confidence={insight.confidence}
                    onClick={() => console.log("View insight:", insight.title)}
                    showAction
                    actionText={insight.action}
                    size="sm"
                  />
                ))}
              </div>
            </div>
          </SlideIn>
        )}

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Form */}
          <SlideIn direction="left" delay={0.3}>
            <GlassmorphicCard gradient="from-card/80 to-card/60" blur="xl">
              <div className="p-6">
                {/* Step Navigation */}
                <div className="flex flex-wrap items-center gap-2 mb-8">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = activeStep === step.id;
                    const isCompleted = steps.findIndex((s) => s.id === activeStep) > index;

                    return (
                      <React.Fragment key={step.id}>
                        {index > 0 && <div className="w-4 h-0.5 bg-border hidden sm:block" />}
                        <button
                          onClick={() => setActiveStep(step.id as typeof activeStep)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm",
                            isActive && "bg-gradient-to-r from-chart-1 to-chart-2 text-foreground shadow-lg",
                            isCompleted && "bg-success/20 text-success",
                            !isActive && !isCompleted && "bg-muted text-muted-foreground hover:bg-muted/80"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="font-medium hidden sm:inline">{step.label}</span>
                          {isCompleted && <CheckCircle className="w-4 h-4 ml-1" />}
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Form Content */}
                <div className="space-y-6">
                  {renderStepContent()}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <div>
                      {activeStep !== "info" && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            const currentIndex = steps.findIndex((s) => s.id === activeStep);
                            if (currentIndex > 0) {
                              setActiveStep(steps[currentIndex - 1].id as typeof activeStep);
                            }
                          }}
                        >
                          Previous
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {activeStep !== "review" ? (
                        <Button
                          onClick={() => {
                            const currentIndex = steps.findIndex((s) => s.id === activeStep);
                            if (currentIndex < steps.length - 1) {
                              setActiveStep(steps[currentIndex + 1].id as typeof activeStep);
                            }
                          }}
                          disabled={
                            activeStep === "info" &&
                            (!formData.companyName ||
                              !formData.industry ||
                              !formData.certificationTarget)
                          }
                        >
                          Next
                        </Button>
                      ) : (
                        <Button
                          onClick={handleGenerate}
                          disabled={isGenerating}
                          className="bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70"
                        >
                          {isGenerating ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="mr-2"
                              >
                                <Wand2 className="h-4 w-4" />
                              </motion.div>
                              Generating QMS...
                            </>
                          ) : (
                            <>
                              <Wand2 className="mr-2 h-4 w-4" />
                              Generate Complete QMS
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </GlassmorphicCard>
          </SlideIn>

          {/* Right Column - Preview & Output */}
          <SlideIn direction="right" delay={0.3} className="space-y-6">
            {/* Process Flow Diagram */}
            <EnhancedMermaid
              chart={processFlowDiagram}
              title="QMS Process Flow Diagram"
              description="High-level overview of QMS processes and interactions"
              height={350}
            />

            {/* Generated Documents */}
            {generatedDocuments.length > 0 && (
              <GlassmorphicCard gradient="from-card/80 to-card/60" blur="xl">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Generated Documents</h3>
                    <AIBadge variant="outline">{generatedDocuments.length} documents</AIBadge>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {generatedDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 bg-muted/30 rounded-lg border border-border/50 hover:border-chart-1/50 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedDocument(doc);
                          setShowPreview(true);
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{doc.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span>Version: {doc.version}</span>
                              <span>-</span>
                              <span>Created: {new Date(doc.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <AIBadge variant={doc.status === "approved" ? "success" : "warning"}>
                                {doc.status.toUpperCase()}
                              </AIBadge>
                              <AIBadge variant="outline">Compliance: {doc.complianceScore}%</AIBadge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(doc);
                              }}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowPreview(true);
                                setSelectedDocument(doc);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassmorphicCard>
            )}

            {/* Process Flow Designer */}
            <ProcessFlowDesigner editable={false} />
          </SlideIn>
        </div>
      </div>

      {/* Document Preview Modal */}
      <GlassModal isOpen={showPreview} onClose={() => setShowPreview(false)} size="xl">
        {selectedDocument && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">{selectedDocument.title}</h2>
                <p className="text-muted-foreground">
                  Version {selectedDocument.version} - {selectedDocument.status.toUpperCase()}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <ScrollArea className="h-[60vh]">
              <pre className="whitespace-pre-wrap text-sm bg-muted/30 p-4 rounded-lg">
                {selectedDocument.content}
              </pre>
            </ScrollArea>

            <div className="flex items-center justify-between pt-6 mt-6 border-t border-border">
              <div className="flex items-center gap-2">
                <AIBadge variant="info">Compliance: {selectedDocument.complianceScore}%</AIBadge>
                <AIBadge variant="outline">{selectedDocument.sections.length} Sections</AIBadge>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => handleCopy(selectedDocument.content)}>
                  {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button variant="outline" onClick={() => handleDownload(selectedDocument)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button>
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
          </div>
        )}
      </GlassModal>

      {/* Floating AI Assistant */}
      {aiMode && (
        <FloatingElement duration={5} delay={1}>
          <button
            onClick={() => console.log("Open AI Assistant")}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-chart-1 to-chart-2 text-foreground p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-40 group"
          >
            <Brain className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse" />
          </button>
        </FloatingElement>
      )}
    </div>
  );
}
