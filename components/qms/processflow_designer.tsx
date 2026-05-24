"use client";

import * as React from "react";

export function ProcessFlowDesigner({ editable = false }: { editable?: boolean }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Process Flow Designer</h3>
      <p className="text-sm text-muted-foreground">
        {editable ? "Editable flow builder is not available yet." : "Read-only flow preview is not available yet."}
      </p>
      <div className="rounded-lg border bg-card p-4">(Stub)</div>
    </div>
  );
}

