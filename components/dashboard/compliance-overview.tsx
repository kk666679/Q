'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ISO_CLAUSES } from '@/lib/types'
import { trpc } from '@/lib/sdk'

interface ClauseCompliance {
  clause: string
  score: number
  status: 'compliant' | 'partial' | 'non-compliant'
}

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

function groupClausesBySection(clauses: ClauseCompliance[]) {
  const groups = new Map<string, { scoreSum: number; count: number }>()
  clauses.forEach((clause) => {
    const section = clause.clause.split('.')[0]
    const groupName = `Section ${section}`
    if (!groups.has(groupName)) {
      groups.set(groupName, { scoreSum: 0, count: 0 })
    }
    const entry = groups.get(groupName)!
    entry.scoreSum += clause.score
    entry.count += 1
  })

  return Array.from(groups.entries()).map(([group, entry]) => ({
    group: `${group} (${entry.count})`,
    score: Math.round(entry.scoreSum / entry.count),
  }))
}

export function ComplianceOverview() {
  const { data: report } = trpc.compliance.getReport.useQuery({ standard: undefined })

  const clauseGroups = useMemo(() => {
    if (!report) {
      return [
        { group: 'Context (4)', score: 85 },
        { group: 'Leadership (5)', score: 78 },
        { group: 'Planning (6)', score: 92 },
        { group: 'Support (7)', score: 70 },
        { group: 'Operation (8)', score: 88 },
        { group: 'Evaluation (9)', score: 65 },
        { group: 'Improvement (10)', score: 72 },
      ]
    }

    const clauseScores: ClauseCompliance[] = ISO_CLAUSES.map((clause) => {
      const findings = report.findings.filter((finding) => finding.clause === clause.number)
      const deduction = findings.reduce((sum, finding) => {
        if (finding.severity === 'critical') return sum + 18
        if (finding.severity === 'major') return sum + 12
        if (finding.severity === 'minor') return sum + 8
        return sum + 4
      }, 0)
      const score = Math.max(55, 95 - deduction)
      return {
        clause: clause.number,
        score,
        status: score >= 80 ? 'compliant' : score >= 60 ? 'partial' : 'non-compliant',
      }
    })

    return groupClausesBySection(clauseScores)
  }, [report])

  return (
    <Card>
      <CardHeader>
        <CardTitle>ISO 9001:2015 Compliance</CardTitle>
        <CardDescription>Compliance status by clause group</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {clauseGroups.map((group) => (
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
