---
name: hr-quality-management
description: "Use when assessing HR service quality, SOP adherence, audit readiness, CAPA priorities, continuous improvement, or process quality scorecards in FWMS."
user-invocable: false
metadata:
  domain: hr
  subdomain: quality-management
  region: malaysia
  outputs:
    - quality scorecards
    - audit findings
    - CAPA recommendations
    - process improvement actions
---

# HR Quality Management — HRMS

## Purpose

This skill supports HR quality assurance and continuous improvement across the FWMS platform. It is intended for reviewing process consistency, data quality, SOP adherence, and service delivery risks so HR teams can act before operational issues escalate.

## Use when

- Reviewing HR service quality or audit readiness
- Assessing SOP adherence and process control health
- Identifying corrective and preventive actions (CAPA)
- Tracking data quality, documentation quality, and turnaround issues
- Producing a quality scorecard for HR operations leadership

## Do not use for

- Detailed payroll calculations
- Industrial relations case handling
- Employer branding campaigns
- Pure technical implementation work unrelated to HR quality reviews

## Agent file

`lib/agents/hr-quality-management.ts`

## Expected inputs

- `tenantId`
- Optional review window or audit scope
- Optional focus area such as onboarding, payroll accuracy, documentation control, or compliance readiness

## Core capabilities

- HR process quality scoring
- Data completeness review for employee master records
- SOP adherence and documentation control checks
- CAPA and root-cause prioritization
- Continuous improvement recommendations for HR operations

## Quality dimensions

| Dimension              | Focus                                           | Target              |
| ---------------------- | ----------------------------------------------- | ------------------- |
| Data Completeness      | Employee profile accuracy and required fields   | ≥ 98% complete      |
| Document Control       | Required documents present and current          | 0 critical gaps     |
| Payroll Timeliness     | Pending payroll items and processing discipline | 100% on time        |
| Attendance Exceptions  | Late and absent trend monitoring                | < 5% exception rate |
| Continuous Improvement | Active rule reviews and follow-up actions       | Quarterly cadence   |

## Agent parameters

Takes `tenantId` and returns an organization-wide quality scorecard, findings summary, and improvement recommendations.

## Agent data shape

```typescript
{
  type: 'HR_QUALITY_MANAGEMENT',
  data: JSON.stringify({
    qualityScore: '88/100',
    status: '✅ Controlled' | '⚠️ Improvement Needed' | '🚨 Escalate Review',
    processHealth: object,
    dataQuality: object,
    criticalFindings: string[],
    improvementAreas: string[],
    standards: Array<{ area: string; standard: string; target: string }>,
    recommendedActions: string[],
  })
}
```

## Quality checklist

- Findings are evidence-based and tenant-scoped
- Recommendations are actionable and prioritized
- CAPA suggestions focus on recurrence prevention
- Outputs are suitable for HR audits, leadership updates, and AI orchestration