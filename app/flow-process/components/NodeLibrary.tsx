/**
 * Node Library Component
 * 
 * Left sidebar component showing available nodes for drag-and-drop.
 * Supports search, filtering by category, and custom node types.
 */

"use client";

import React, { useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NodeLibraryItem {
  type: string;
  label: string;
  category: "shapes" | "automation" | "database" | "custom";
  icon: React.ReactNode;
  data?: Record<string, unknown>;
  description?: string;
}

export interface NodeLibraryProps {
  /** Available nodes to display */
  items?: NodeLibraryItem[];
  /** Search query */
  searchQuery?: string;
  /** Callback when search changes */
  onSearchChange?: (query: string) => void;
  /** Currently selected category filter */
  selectedCategory?: string | null;
  /** Callback when category changes */
  onCategoryChange?: (category: string | null) => void;
  /** Callback when a node is dropped or clicked */
  onNodeAdd?: (item: NodeLibraryItem) => void;
  /** Whether the library is loading */
  loading?: boolean;
  /** Additional className */
  className?: string;
}

const defaultNodeLibrary: NodeLibraryItem[] = [
  // Shapes - Basic
  { 
    type: "circle", 
    label: "Circle", 
    category: "shapes", 
    icon: <div className="w-4 h-4 rounded-full bg-green-400" />,
    description: "Circle shape node"
  },
  { 
    type: "rectangle", 
    label: "Rectangle", 
    category: "shapes", 
    icon: <div className="w-5 h-4 bg-amber-400 rounded" />,
    description: "Rectangle shape node"
  },
  { 
    type: "diamond", 
    label: "Diamond", 
    category: "shapes", 
    icon: <div className="w-4 h-4 rotate-45 bg-violet-400" />,
    description: "Diamond shape node"
  },
  { 
    type: "triangle", 
    label: "Triangle", 
    category: "shapes", 
    icon: (
      <div 
        className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] bg-transparent" 
        style={{ borderBottomColor: '#f59e0b' }} 
      />
    ),
    description: "Triangle shape node"
  },
  { 
    type: "hexagon", 
    label: "Hexagon", 
    category: "shapes", 
    icon: (
      <div 
        className="w-5 h-4 bg-orange-400" 
        style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }} 
      />
    ),
    description: "Hexagon shape node"
  },
  { 
    type: "cylinder", 
    label: "Cylinder", 
    category: "shapes", 
    icon: <div className="w-4 h-5 bg-indigo-400 rounded-t-full rounded-b-md" />,
    description: "Cylinder shape node"
  },
  { 
    type: "parallelogram", 
    label: "Parallelogram", 
    category: "shapes", 
    icon: <div className="w-5 h-3 bg-blue-400 transform -skew-x-12" />,
    description: "Parallelogram shape node"
  },
  { 
    type: "rounded-rectangle", 
    label: "Rounded", 
    category: "shapes", 
    icon: <div className="w-5 h-4 bg-pink-400 rounded-lg" />,
    description: "Rounded rectangle node"
  },
  // Automation
  { 
    type: "trigger", 
    label: "Trigger", 
    category: "automation", 
    icon: <div className="w-4 h-4 rounded-full bg-blue-500" />,
    data: { event: "New Event", source: "Webhook" },
    description: "Workflow trigger node"
  },
  { 
    type: "task", 
    label: "Task", 
    category: "automation", 
    icon: <div className="w-4 h-4 rounded bg-amber-500" />,
    data: { title: "New Task", status: "pending" },
    description: "Task node"
  },
  { 
    type: "condition", 
    label: "Condition", 
    category: "automation", 
    icon: <div className="w-4 h-4 rotate-45 bg-violet-500" />,
    data: { condition: "Check condition" },
    description: "Branching condition node"
  },
  { 
    type: "action", 
    label: "Action", 
    category: "automation", 
    icon: <div className="w-4 h-4 rounded-full bg-emerald-500" />,
    data: { action: "Execute action" },
    description: "Action node"
  },
  { 
    type: "wait", 
    label: "Wait", 
    category: "automation", 
    icon: <div className="w-4 h-4 rounded-full bg-cyan-500" />,
    data: { duration: 1, unit: "hour" },
    description: "Wait/delay node"
  },
  { 
    type: "end", 
    label: "End", 
    category: "automation", 
    icon: <div className="w-4 h-4 rounded-full bg-green-500" />,
    data: { result: "Complete" },
    description: "Workflow end node"
  },
  // Database
  { 
    type: "table", 
    label: "Table", 
    category: "database", 
    icon: <div className="w-4 h-4 bg-teal-500 rounded-sm" />,
    data: { name: "users", columns: [] },
    description: "Database table node"
  },
];

const categories = [
  { id: null, label: "All", icon: null },
  { id: "shapes", label: "Shapes", icon: null },
  { id: "automation", label: "Automation", icon: null },
  { id: "database", label: "Database", icon: null },
];

export function NodeLibrary({
  items = defaultNodeLibrary,
  searchQuery = "",
  onSearchChange,
  selectedCategory = null,
  onCategoryChange,
  onNodeAdd,
  loading = false,
  className,
}: NodeLibraryProps) {
  // Filter nodes based on search and category
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  // Handle drag start for drag-and-drop
  const handleDragStart = useCallback((event: React.DragEvent, item: NodeLibraryItem) => {
    event.dataTransfer.setData("application/reactflow", item.type);
    event.dataTransfer.setData("application/node-data", JSON.stringify(item.data || {}));
    event.dataTransfer.effectAllowed = "move";
  }, []);

  // Handle click to add node
  const handleClick = useCallback((item: NodeLibraryItem) => {
    onNodeAdd?.(item);
  }, [onNodeAdd]);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Search */}
      <div className="p pb-2">
        <div className="relative">
          <Search className="absolute-4 left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4 pb-4">
        <div className="flex gap-1 flex-wrap">
          {categories.map((cat) => (
            <Button
              key={cat.id ?? "all"}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange?.(cat.id)}
              className="text-xs"
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Node List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-muted-foreground">Loading nodes...</div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-muted-foreground">No nodes found</div>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={`${item.category}-${item.type}`}
              className="flex cursor-grab items-center gap-3 rounded-md border bg-background p-2 hover:bg-accent transition-colors active:cursor-grabbing"
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onClick={() => handleClick(item)}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium block truncate">{item.label}</span>
                {item.description && (
                  <span className="text-xs text-muted-foreground block truncate">
                    {item.description}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t text-xs text-muted-foreground">
        <span>{filteredItems.length} nodes available</span>
      </div>
    </div>
  );
}

export default NodeLibrary;

