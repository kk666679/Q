import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { isValidElement, type ReactElement, type ComponentType } from "react"

interface AIMetricCardProps {
  title: string
  value: string | number
  prefix?: string
  suffix?: string
  description?: string
  trend?: {
    value: number
    label: string
  } | "up" | "down" | "neutral"
  change?: string
  icon?: React.ReactNode | ComponentType<{ className?: string }>
  gradient?: string
  className?: string
}

// Helper function to render icon - handles both React elements and component classes
function renderIcon(icon: React.ReactNode | ComponentType<{ className?: string }>, defaultClassName: string = "h-4 w-4") {
  if (!icon) return null
  
  if (isValidElement(icon)) {
    // Already a React element, return as-is
    return icon
  }
  
  // It's a component class, instantiate it
  const IconComponent = icon as ComponentType<{ className?: string }>
  return <IconComponent className={defaultClassName} />
}

export function AIMetricCard({
  title,
  value,
  description,
  prefix,
  suffix,
  trend,
  icon,
  gradient,
  change,
  className
}: AIMetricCardProps) {
  const getTrendIcon = () => {
    if (!normalizedTrend) return null
    if (normalizedTrend.value > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (normalizedTrend.value < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }


  const normalizedTrend = typeof trend === "string"
    ? { value: trend === "up" ? 1 : trend === "down" ? -1 : 0, label: change || "" }
    : trend

  return (
    <Card className={cn("relative overflow-hidden", gradient && `bg-gradient-to-br ${gradient}`, className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {renderIcon(icon, "h-4 w-4")}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{prefix}{value}{suffix}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {normalizedTrend && (
          <div className="flex items-center gap-1 mt-2">
            {getTrendIcon()}
            <span className={cn(
              "text-xs font-medium",
              normalizedTrend.value > 0 ? "text-green-500" : 
              normalizedTrend.value < 0 ? "text-red-500" : "text-gray-500"
            )}>
              {typeof trend === "string" ? (change || trend) : `${normalizedTrend.value > 0 ? "+" : ""}${normalizedTrend.value}% ${normalizedTrend.label}` }
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}