"use client";

import * as React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button, ButtonProps } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LucideIcon } from "lucide-react";

// Glassmorphic Card
interface GlassmorphicCardProps {
  children: React.ReactNode;
  gradient?: string;
  blur?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  className?: string;
}

export function GlassmorphicCard({
  children,
  gradient = "from-card/80 to-card/60",
  blur = "xl",
  className,
}: GlassmorphicCardProps) {
  const blurClasses = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
    "2xl": "backdrop-blur-2xl",
    "3xl": "backdrop-blur-3xl",
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-border/50",
        `bg-gradient-to-br ${gradient}`,
        blurClasses[blur],
        "shadow-lg",
        className
      )}
    >
      {children}
    </Card>
  );
}

// Stagger Container
interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function StaggerContainer({ children, staggerDelay = 0.1, className }: StaggerContainerProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger Item
interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

// Slide In
interface SlideInProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  className?: string;
}

export function SlideIn({
  children,
  direction = "up",
  delay = 0,
  duration = 0.4,
  className,
}: SlideInProps) {
  const directionOffset = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directionOffset[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay, duration, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Glass Button
interface GlassButtonProps extends Omit<ButtonProps, "variant"> {
  variant?: "primary" | "secondary" | "ghost";
  glow?: boolean;
}

export function GlassButton({
  children,
  variant = "primary",
  glow = false,
  className,
  ...props
}: GlassButtonProps) {
  const variantClasses = {
    primary: "bg-gradient-to-r from-chart-1 to-chart-2 text-foreground hover:opacity-90",
    secondary: "bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card",
    ghost: "bg-transparent hover:bg-muted/50",
  };

  return (
    <Button
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        variantClasses[variant],
        glow && "shadow-lg shadow-chart-1/20",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

// Glass Input
interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export function GlassInput({ icon, className, ...props }: GlassInputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>
      )}
      <Input
        className={cn(
          "bg-card/80 backdrop-blur-sm border-border/50 focus:border-chart-1/50",
          icon && "pl-10",
          className
        )}
        {...props}
      />
    </div>
  );
}

// Glass Textarea
interface GlassTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export function GlassTextarea({ className, ...props }: GlassTextareaProps) {
  return (
    <Textarea
      className={cn(
        "bg-card/80 backdrop-blur-sm border-border/50 focus:border-chart-1/50",
        className
      )}
      {...props}
    />
  );
}

// Glass Select
interface GlassSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
  className?: string;
}

export function GlassSelect({
  value,
  onValueChange,
  placeholder,
  children,
  className,
}: GlassSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn(
          "bg-card/80 backdrop-blur-sm border-border/50 focus:border-chart-1/50",
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-card/95 backdrop-blur-lg border-border/50">
        {children}
      </SelectContent>
    </Select>
  );
}

// Animated Counter
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ value, duration = 1, className }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const diff = value - startValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(startValue + diff * easeProgress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span className={className}>{displayValue}</span>;
}

// Floating Element
interface FloatingElementProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

export function FloatingElement({
  children,
  duration = 4,
  delay = 0,
  className,
}: FloatingElementProps) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Gradient Text
interface GradientTextProps {
  children: React.ReactNode;
  from?: string;
  to?: string;
  className?: string;
}

export function GradientText({
  children,
  from = "from-chart-1",
  to = "to-chart-2",
  className,
}: GradientTextProps) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r bg-clip-text text-transparent",
        from,
        to,
        className
      )}
    >
      {children}
    </span>
  );
}

// Glass Modal
interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

export function GlassModal({
  isOpen,
  onClose,
  children,
  size = "md",
  className,
}: GlassModalProps) {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[90vw]",
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={cn(
          "relative w-full rounded-xl bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl",
          sizeClasses[size],
          className
        )}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
