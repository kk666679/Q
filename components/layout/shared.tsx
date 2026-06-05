import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

// ── PageHeader ────────────────────────────────────────────────────────────────
interface PageHeaderProps {
  heading: string;
  subheading?: string;
  children?: React.ReactNode; // right-side actions
  className?: string;
}

export function PageHeader({ heading, subheading, children, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{heading}</h1>
        {subheading && <p className="text-sm text-muted-foreground mt-0.5">{subheading}</p>}
      </div>
      {children && <div className="flex items-center gap-2 flex-shrink-0">{children}</div>}
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon?: LucideIcon;
  heading: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
  className?: string;
}

export function EmptyState({ icon: Icon, heading, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      {Icon && (
        <div className="rounded-full bg-muted p-4 mb-4">
          <Icon className="size-8 text-muted-foreground" aria-hidden="true" />
        </div>
      )}
      <h3 className="text-base font-semibold">{heading}</h3>
      {description && <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>}
      {action && (
        <div className="mt-4">
          {action.href ? (
            <Button asChild size="sm">
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : (
            <Button size="sm" onClick={action.onClick}>{action.label}</Button>
          )}
        </div>
      )}
    </div>
  );
}

// ── LoadingRows ───────────────────────────────────────────────────────────────
export function LoadingRows({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 rounded-md bg-muted animate-pulse" />
      ))}
    </div>
  );
}

// ── StatusBadge ───────────────────────────────────────────────────────────────
const STATUS_CLASSES: Record<string, string> = {
  active:    'bg-emerald-500/15 text-emerald-700 border-emerald-200',
  approved:  'bg-emerald-500/15 text-emerald-700 border-emerald-200',
  completed: 'bg-emerald-500/15 text-emerald-700 border-emerald-200',
  'on-track':'bg-emerald-500/15 text-emerald-700 border-emerald-200',
  draft:     'bg-slate-500/15  text-slate-600    border-slate-200',
  planned:   'bg-slate-500/15  text-slate-600    border-slate-200',
  review:    'bg-amber-500/15  text-amber-700    border-amber-200',
  'at-risk': 'bg-amber-500/15  text-amber-700    border-amber-200',
  pending:   'bg-amber-500/15  text-amber-700    border-amber-200',
  breached:  'bg-red-500/15    text-red-700      border-red-200',
  critical:  'bg-red-500/15    text-red-700      border-red-200',
  suspended: 'bg-red-500/15    text-red-700      border-red-200',
  obsolete:  'bg-gray-500/15   text-gray-600     border-gray-200',
  archived:  'bg-gray-500/15   text-gray-600     border-gray-200',
  closed:    'bg-gray-500/15   text-gray-600     border-gray-200',
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const cls = STATUS_CLASSES[status.toLowerCase()] ?? 'bg-muted text-muted-foreground border-border';
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize', cls, className)}>
      {status.replace(/-/g, ' ')}
    </span>
  );
}
