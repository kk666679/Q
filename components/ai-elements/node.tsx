import type { ComponentProps } from "react";
import type { NodeProps as FlowNodeProps } from "@xyflow/react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Handle, Position } from "@xyflow/react";

export type NodeProps = ComponentProps<typeof Card> & Partial<Omit<FlowNodeProps, 'children'>> & {
  handles: {
    target: boolean;
    source: boolean;
  };
};

export const Node = ({ handles, className, children, ...props }: NodeProps) => {
  const {
    id,
    type,
    data,
    selected,
    draggable,
    deletable,
    dragHandle,
    dragging,
    parentId,
    sourcePosition,
    targetPosition,
    width,
    height,
    zIndex,
    selectable,
    ...cardProps
  } = props as Record<string, unknown>;

  return (
    <Card
      className={cn(
        "node-container relative size-full h-auto w-sm gap-0 rounded-md p-0",
        className
      )}
      {...(cardProps as ComponentProps<typeof Card>)}
    >
      {handles.target && <Handle position={Position.Left} type="target" />}
      {handles.source && <Handle position={Position.Right} type="source" />}
      {children}
    </Card>
  );
};

export type NodeHeaderProps = ComponentProps<typeof CardHeader>;

export const NodeHeader = ({ className, ...props }: NodeHeaderProps) => (
  <CardHeader
    className={cn("gap-0.5 rounded-t-md border-b bg-secondary p-3!", className)}
    {...props}
  />
);

export type NodeTitleProps = ComponentProps<typeof CardTitle>;

export const NodeTitle = (props: NodeTitleProps) => <CardTitle {...props} />;

export type NodeDescriptionProps = ComponentProps<typeof CardDescription>;

export const NodeDescription = (props: NodeDescriptionProps) => (
  <CardDescription {...props} />
);

export type NodeActionProps = ComponentProps<typeof CardAction>;

export const NodeAction = (props: NodeActionProps) => <CardAction {...props} />;

export type NodeContentProps = ComponentProps<typeof CardContent>;

export const NodeContent = ({ className, ...props }: NodeContentProps) => (
  <CardContent className={cn("p-3", className)} {...props} />
);

export type NodeFooterProps = ComponentProps<typeof CardFooter>;

export const NodeFooter = ({ className, ...props }: NodeFooterProps) => (
  <CardFooter
    className={cn("rounded-b-md border-t bg-secondary p-3!", className)}
    {...props}
  />
);
