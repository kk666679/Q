'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ISO_CLAUSES } from '@/lib/types'

interface ClauseCompliance {
  clause: string
  score: number
  status: 'compliant' | 'partial' | 'non-compliant'
}

interface ComplianceOverviewProps {
  clauses?: ClauseCompliance[]
}

// Mock compliance data for different clause groups
const mockClauseGroups = [
  { group: 'Context (4)', score: 85, count: 4 },
  { group: 'Leadership (5)', score: 78, count: 3 },
  { group: 'Planning (6)', score: 92, count: 3 },
  { group: 'Support (7)', score: 70, count: 5 },
  { group: 'Operation (8)', score: 88, count: 7 },
  { group: 'Evaluation (9)', score: 65, count: 3 },
  { group: 'Improvement (10)', score: 72, count: 3 },
]

function getScoreColor(score: number) {
  if (score >= 80) return 'bg-success'
  if (score >= 60) return 'bg-warning'
  return 'bg-destructive'
}

function getScoreTextColor(score: number) {
  if (score >= 80) return 'text-success'
  if (score >= 60) return 'text-warning'
  return 'text-destructive'
}

export function ComplianceOverview({ clauses }: ComplianceOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ISO 9001:2015 Compliance</CardTitle>
        <CardDescription>Compliance status by clause group</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockClauseGroups.map((group) => (
            <div key={group.group} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{group.group}</span>
                <span className={getScoreTextColor(group.score)}>
                  {group.score}%
                </span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full transition-all ${getScoreColor(group.score)}`}
                  style={{ width: `${group.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-success" />
              Compliant (80%+)
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-warning" />
              Partial (60-79%)
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-destructive" />
              Needs Work ({'<'}60%)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
