"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Download, Maximize2 } from "lucide-react";

interface EnhancedMermaidProps {
  chart: string;
  title?: string;
  description?: string;
  height?: number;
  className?: string;
}

export function EnhancedMermaid({
  chart,
  title,
  description,
  height = 400,
  className,
}: EnhancedMermaidProps) {
  const [zoom, setZoom] = React.useState(1);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Parse mermaid-like syntax into visual representation
  const parseChart = (chartStr: string) => {
    const lines = chartStr.trim().split("\n");
    const nodes: Array<{ id: string; label: string; type: string }> = [];
    const edges: Array<{ from: string; to: string; label?: string }> = [];
    const subgraphs: Array<{ title: string; nodes: string[] }> = [];

    let currentSubgraph: { title: string; nodes: string[] } | null = null;

    lines.forEach((line) => {
      const trimmed = line.trim();
      
      // Parse node definitions
      const nodeMatch = trimmed.match(/(\w+)\[([^\]]+)\]/);
      if (nodeMatch) {
        nodes.push({ id: nodeMatch[1], label: nodeMatch[2], type: "process" });
      }

      // Parse edges
      const edgeMatch = trimmed.match(/(\w+)\s*-->\s*(\w+)/);
      if (edgeMatch) {
        edges.push({ from: edgeMatch[1], to: edgeMatch[2] });
      }

      // Parse subgraphs
      if (trimmed.startsWith("subgraph")) {
        const title = trimmed.replace("subgraph", "").replace(/"/g, "").trim();
        currentSubgraph = { title, nodes: [] };
      } else if (trimmed === "end" && currentSubgraph) {
        subgraphs.push(currentSubgraph);
        currentSubgraph = null;
      } else if (currentSubgraph && trimmed.match(/^\w+\[/)) {
        const id = trimmed.match(/^(\w+)/)?.[1];
        if (id) currentSubgraph.nodes.push(id);
      }
    });

    return { nodes, edges, subgraphs };
  };

  const { nodes, edges, subgraphs } = parseChart(chart);

  // Simple visual representation
  const processFlow = [
    { id: "context", label: "Context", color: "from-blue-500/20 to-blue-600/20" },
    { id: "leadership", label: "Leadership", color: "from-purple-500/20 to-purple-600/20" },
    { id: "planning", label: "Planning", color: "from-amber-500/20 to-amber-600/20" },
    { id: "support", label: "Support", color: "from-teal-500/20 to-teal-600/20" },
    { id: "operation", label: "Operation", color: "from-rose-500/20 to-rose-600/20" },
    { id: "evaluation", label: "Evaluation", color: "from-emerald-500/20 to-emerald-600/20" },
    { id: "improvement", label: "Improvement", color: "from-cyan-500/20 to-cyan-600/20" },
  ];

  return (
    <Card className={cn("border-border/50 bg-card/80", className)}>
      {(title || description) && (
        <CardHeader className="pb-2">
          {title && <CardTitle className="text-base">{title}</CardTitle>}
          {description && (
            <CardDescription className="text-sm">{description}</CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className="p-4">
        {/* Toolbar */}
        <div className="flex items-center justify-end gap-2 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">{Math.round(zoom * 100)}%</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>

        {/* Flow Diagram */}
        <div
          ref={containerRef}
          className="overflow-auto rounded-lg bg-muted/30 p-6"
          style={{ height, transform: `scale(${zoom})`, transformOrigin: "top left" }}
        >
          <div className="flex flex-col items-center gap-4 min-w-max">
            {/* PDCA Cycle Representation */}
            <div className="relative w-full max-w-2xl">
              {/* Main Flow */}
              <div className="flex flex-wrap justify-center gap-3">
                {processFlow.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center rounded-lg p-4 min-w-[120px]",
                        "bg-gradient-to-br border border-border/50",
                        step.color
                      )}
                    >
                      <div className="w-10 h-10 rounded-full bg-background/50 flex items-center justify-center font-bold text-lg mb-2">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-center">{step.label}</span>
                    </div>
                    {index < processFlow.length - 1 && (
                      <div className="flex items-center">
                        <svg className="w-6 h-6 text-muted-foreground" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M5 12h14m-7-7l7 7-7 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Feedback Loop Arrow */}
              <div className="mt-4 flex justify-center">
                <svg className="w-full max-w-xl h-12" viewBox="0 0 400 40" fill="none">
                  <path
                    d="M380 10 L380 30 L20 30 L20 20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="text-muted-foreground"
                    fill="none"
                  />
                  <path
                    d="M15 25 L20 15 L25 25"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-muted-foreground"
                    fill="none"
                  />
                </svg>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-1">
                Continual Improvement Cycle (PDCA)
              </p>
            </div>

            {/* Input/Output Sections */}
            <div className="grid grid-cols-2 gap-8 w-full max-w-2xl mt-6">
              <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
                <h4 className="font-medium text-sm mb-3">Inputs</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-chart-1" />
                    Customer Requirements
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-chart-2" />
                    Regulatory Requirements
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-chart-3" />
                    Market Needs
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
                <h4 className="font-medium text-sm mb-3">Outputs</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    Customer Satisfaction
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-info" />
                    Product/Service Quality
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-chart-4" />
                    Business Performance
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
