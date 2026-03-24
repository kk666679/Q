"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  ArrowRight, 
  Circle, 
  Square, 
  Diamond,
  Settings,
  Users,
  FileText,
  Target,
  AlertTriangle,
  BarChart
} from "lucide-react";

interface ProcessStep {
  id: string;
  name: string;
  description: string;
  responsible: string;
  inputs: string[];
  outputs: string[];
  metrics: string[];
  risks: string[];
}

interface ProcessFlowDesignerProps {
  steps?: ProcessStep[];
  onStepsChange?: (steps: ProcessStep[]) => void;
  editable?: boolean;
  className?: string;
}

export function ProcessFlowDesigner({
  steps: initialSteps,
  onStepsChange,
  editable = true,
  className,
}: ProcessFlowDesignerProps) {
  const [steps, setSteps] = React.useState<ProcessStep[]>(
    initialSteps || [
      {
        id: "1",
        name: "Customer Requirements",
        description: "Gather and document customer requirements",
        responsible: "Sales/Account Management",
        inputs: ["Market Research", "Customer Feedback"],
        outputs: ["Requirements Specification"],
        metrics: ["Requirement Clarity Score"],
        risks: ["Incomplete Requirements"],
      },
      {
        id: "2",
        name: "Design & Development",
        description: "Design products/services based on requirements",
        responsible: "R&D/Engineering",
        inputs: ["Requirements Specification"],
        outputs: ["Design Documents", "Prototypes"],
        metrics: ["Design Review Score"],
        risks: ["Design Flaws"],
      },
      {
        id: "3",
        name: "Production/Delivery",
        description: "Execute production or service delivery",
        responsible: "Operations",
        inputs: ["Design Documents", "Resources"],
        outputs: ["Products/Services"],
        metrics: ["Quality Rate", "On-Time Delivery"],
        risks: ["Production Delays"],
      },
      {
        id: "4",
        name: "Quality Control",
        description: "Verify quality meets specifications",
        responsible: "Quality Assurance",
        inputs: ["Products/Services"],
        outputs: ["Inspection Reports", "Approved Products"],
        metrics: ["Defect Rate", "First Pass Yield"],
        risks: ["Quality Escapes"],
      },
      {
        id: "5",
        name: "Customer Delivery",
        description: "Deliver to customer and gather feedback",
        responsible: "Sales/Logistics",
        inputs: ["Approved Products"],
        outputs: ["Delivered Products", "Customer Feedback"],
        metrics: ["Customer Satisfaction", "Delivery Accuracy"],
        risks: ["Delivery Damage"],
      },
    ]
  );

  const [selectedStep, setSelectedStep] = React.useState<string | null>(null);

  const handleStepChange = (id: string, field: keyof ProcessStep, value: unknown) => {
    const updatedSteps = steps.map((step) =>
      step.id === id ? { ...step, [field]: value } : step
    );
    setSteps(updatedSteps);
    onStepsChange?.(updatedSteps);
  };

  const addStep = () => {
    const newStep: ProcessStep = {
      id: `${Date.now()}`,
      name: "New Process Step",
      description: "Describe this process step",
      responsible: "Responsible Party",
      inputs: [],
      outputs: [],
      metrics: [],
      risks: [],
    };
    const updatedSteps = [...steps, newStep];
    setSteps(updatedSteps);
    onStepsChange?.(updatedSteps);
    setSelectedStep(newStep.id);
  };

  const removeStep = (id: string) => {
    const updatedSteps = steps.filter((step) => step.id !== id);
    setSteps(updatedSteps);
    onStepsChange?.(updatedSteps);
    if (selectedStep === id) setSelectedStep(null);
  };

  const selected = steps.find((s) => s.id === selectedStep);

  return (
    <Card className={cn("border-border/50 bg-card/80", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Process Flow Designer</CardTitle>
            <CardDescription>Design and visualize your business processes</CardDescription>
          </div>
          {editable && (
            <Button variant="outline" size="sm" onClick={addStep}>
              <Plus className="h-4 w-4 mr-2" />
              Add Step
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visual Flow */}
        <div className="overflow-x-auto pb-4">
          <div className="flex items-center gap-2 min-w-max">
            {/* Start Node */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-success/20 border-2 border-success flex items-center justify-center">
                <Circle className="h-4 w-4 text-success" />
              </div>
              <span className="text-xs text-muted-foreground mt-1">Start</span>
            </div>

            <ArrowRight className="h-4 w-4 text-muted-foreground" />

            {/* Process Steps */}
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setSelectedStep(step.id)}
                  className={cn(
                    "flex flex-col items-center p-3 rounded-lg border-2 transition-all min-w-[140px]",
                    selectedStep === step.id
                      ? "border-chart-1 bg-chart-1/10"
                      : "border-border/50 bg-muted/30 hover:border-border"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Square className="h-4 w-4 text-chart-1" />
                    <span className="text-xs font-mono text-muted-foreground">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-center line-clamp-2">
                    {step.name}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {step.responsible.split("/")[0]}
                  </span>
                  {step.risks.length > 0 && (
                    <Badge variant="outline" className="mt-2 text-xs text-warning">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {step.risks.length} risks
                    </Badge>
                  )}
                </button>

                {index < steps.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                )}
              </React.Fragment>
            ))}

            <ArrowRight className="h-4 w-4 text-muted-foreground" />

            {/* End Node */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-chart-1/20 border-2 border-chart-1 flex items-center justify-center">
                <Circle className="h-4 w-4 text-chart-1 fill-current" />
              </div>
              <span className="text-xs text-muted-foreground mt-1">End</span>
            </div>
          </div>
        </div>

        {/* Step Details Panel */}
        {selected && (
          <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Step Details</span>
              </div>
              {editable && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStep(selected.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Step Name</label>
                  <Input
                    value={selected.name}
                    onChange={(e) => handleStepChange(selected.id, "name", e.target.value)}
                    disabled={!editable}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Description</label>
                  <Input
                    value={selected.description}
                    onChange={(e) => handleStepChange(selected.id, "description", e.target.value)}
                    disabled={!editable}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" /> Responsible
                  </label>
                  <Input
                    value={selected.responsible}
                    onChange={(e) => handleStepChange(selected.id, "responsible", e.target.value)}
                    disabled={!editable}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground flex items-center gap-1">
                    <FileText className="h-3 w-3" /> Inputs
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selected.inputs.map((input, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {input}
                      </Badge>
                    ))}
                    {selected.inputs.length === 0 && (
                      <span className="text-xs text-muted-foreground">No inputs defined</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Target className="h-3 w-3" /> Outputs
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selected.outputs.map((output, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {output}
                      </Badge>
                    ))}
                    {selected.outputs.length === 0 && (
                      <span className="text-xs text-muted-foreground">No outputs defined</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground flex items-center gap-1">
                    <BarChart className="h-3 w-3" /> Metrics
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selected.metrics.map((metric, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {metric}
                      </Badge>
                    ))}
                    {selected.metrics.length === 0 && (
                      <span className="text-xs text-muted-foreground">No metrics defined</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Risks
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selected.risks.map((risk, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs text-warning border-warning/50">
                        {risk}
                      </Badge>
                    ))}
                    {selected.risks.length === 0 && (
                      <span className="text-xs text-muted-foreground">No risks identified</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!selected && (
          <div className="text-center py-8 text-muted-foreground">
            <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Select a process step to view and edit details</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
