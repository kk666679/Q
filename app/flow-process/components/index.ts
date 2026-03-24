/**
 * Flow Process Components Index
 * 
 * Exports all shared components for the flow process pages.
 */

export { FlowDesigner, default } from "./FlowDesigner";
export { default as CollapsibleSidebar } from "./CollapsibleSidebar";
export { default as NodeLibrary } from "./NodeLibrary";
export { default as DesignerPanel } from "./DesignerPanel";
export { default as PropertiesPanel } from "./PropertiesPanel";
export { default as AIPanel } from "./AIPanel";

export type { FlowDesignerProps } from "./FlowDesigner";
export type { CollapsibleSidebarProps } from "./CollapsibleSidebar";
export type { NodeLibraryProps, NodeLibraryItem } from "./NodeLibrary";
export type { DesignerPanelProps } from "./DesignerPanel";
export type { PropertiesPanelProps } from "./PropertiesPanel";
export type { AIPanelProps, WorkflowMessage } from "./AIPanel";

