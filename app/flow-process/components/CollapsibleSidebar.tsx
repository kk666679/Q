/**
 * Collapsible Sidebar Component
 * 
 * Reusable sidebar with collapsible functionality for flow process pages.
 * Supports left and right positioning with smooth animations.
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { 
  PanelLeftClose, 
  PanelLeftOpen, 
  PanelRightClose, 
  PanelRightOpen,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CollapsibleSidebarProps {
  /** Whether the sidebar is currently collapsed */
  collapsed: boolean;
  /** Callback when toggle button is clicked */
  onToggle: () => void;
  /** Whether the sidebar can be collapsed */
  collapsible?: boolean;
  /** Side positioning */
  side?: "left" | "right";
  /** Title shown in sidebar header */
  title?: string;
  /** Icon shown in sidebar header */
  titleIcon?: React.ReactNode;
  /** Custom toggle icon for collapsed state */
  collapsedIcon?: LucideIcon;
  /** Custom toggle icon for expanded state */
  expandedIcon?: LucideIcon;
  /** Additional className */
  className?: string;
  /** Children content */
  children?: React.ReactNode;
}

export function CollapsibleSidebar({
  collapsed,
  onToggle,
  collapsible = true,
  side = "left",
  title,
  titleIcon,
  collapsedIcon,
  expandedIcon,
  className,
  children,
}: CollapsibleSidebarProps) {
  const isLeft = side === "left";
  const CollapsedIcon = collapsedIcon || (isLeft ? PanelLeftOpen : PanelRightOpen);
  const ExpandedIcon = expandedIcon || (isLeft ? PanelLeftClose : PanelRightClose);

  // Determine width based on collapsed state
  const widthClass = collapsed 
    ? "w-12" 
    : (isLeft ? "w-64" : "w-80");

  return (
    <div
      className={cn(
        "bg-muted/20 transition-all duration-300 ease-in-out overflow-hidden flex flex-col",
        isLeft ? "border-r" : "border-l",
        widthClass,
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between p-2 border-b min-h-[44px]",
          isLeft ? "border-r" : "border-l"
        )}
      >
        {!collapsed && (
          <div className="flex items-center gap-2 px-2">
            {titleIcon && <span className="flex-shrink-0">{titleIcon}</span>}
            {title && (
              <span className="text-sm font-medium truncate">{title}</span>
            )}
          </div>
        )}
        
        {collapsible && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className={cn(
              "h-8 w-8 p-0",
              collapsed && "w-full justify-center mx-auto"
            )}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <CollapsedIcon className="h-4 w-4" />
            ) : (
              <ExpandedIcon className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Content */}
      {!collapsed && (
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
}

export default CollapsibleSidebar;

