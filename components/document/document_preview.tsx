"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Printer, Copy, Share2, CheckCircle, FileText } from "lucide-react";

interface DocumentPreviewProps {
  title: string;
  content: string;
  version?: string;
  status?: "draft" | "review" | "approved";
  sections?: string[];
  complianceScore?: number;
  onDownload?: () => void;
  onPrint?: () => void;
  onCopy?: () => void;
  onShare?: () => void;
  className?: string;
}

export function DocumentPreview({
  title,
  content,
  version = "1.0",
  status = "draft",
  sections = [],
  complianceScore,
  onDownload,
  onPrint,
  onCopy,
  onShare,
  className,
}: DocumentPreviewProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();
  };

  const statusColors = {
    draft: "bg-warning/20 text-warning",
    review: "bg-info/20 text-info",
    approved: "bg-success/20 text-success",
  };

  return (
    <Card className={cn("border-border/50 bg-card/80", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Version {version}</span>
              <span>•</span>
              <Badge className={cn("text-xs", statusColors[status])}>
                {status.toUpperCase()}
              </Badge>
              {complianceScore !== undefined && (
                <>
                  <span>•</span>
                  <span className={cn(
                    complianceScore >= 90 ? "text-success" :
                    complianceScore >= 70 ? "text-warning" : "text-destructive"
                  )}>
                    {complianceScore}% Compliant
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={onDownload}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onPrint}>
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Table of Contents */}
        {sections.length > 0 && (
          <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
            <h4 className="font-medium text-sm mb-3">Table of Contents</h4>
            <div className="grid grid-cols-2 gap-2">
              {sections.map((section, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                  <span className="w-6 h-6 rounded bg-muted flex items-center justify-center text-xs">
                    {idx + 1}
                  </span>
                  {section}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Document Content */}
        <ScrollArea className="h-[400px] rounded-lg border border-border/50 bg-muted/20">
          <div className="p-6">
            <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
              {content}
            </pre>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
