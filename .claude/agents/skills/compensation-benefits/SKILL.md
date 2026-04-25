---
name: compensation-benefits
title: Compensation & Benefits
description: "Use when advising on Malaysian compensation structures, benefits packages, EPF/SOCSO/EIS/PCB calculations, salary benchmarking, overtime, allowances, or payroll compliance in FWMS."
user-invocable: false
metadata:
  domain: hr
  subdomain: compensation-benefits
  region: malaysia
  outputs:
    - salary breakdown
    - contribution calculations
    - benefits recommendations
    - statutory deductions
---

# Compensation & Benefits — FWMS (March 2026 Update)

## Purpose

This skill provides authoritative guidance on Malaysian compensation and benefits management within FWMS, covering statutory contributions (EPF, SOCSO, EIS, PCB), allowances, overtime pay, and benefits packages aligned with **Employment Act 1955 (latest amendments 2025)** and FWMS payroll models.

## Use when

- Calculating employer/employee contributions for EPF/SOCSO/EIS (March 2026 rates)
- Determining statutory deductions (PCB) and net pay
- Advising on overtime rates, allowances (housing, medical, transport)
- Reviewing benefits packages for foreign workers vs locals/expatriates
- Benchmarking salaries against Malaysian market or sector norms
- Handling payroll disputes or discrepancy resolution
- Generating payslip breakdowns or statutory reports

## Do not use for

- Industrial relations disputes or domestic inquiries (see industrial-relations skill)
- Visa/permit compliance (use foreign-worker-expatriate)
- Pure analytics/dashboard metrics (use hr-analytics)
- Database queries without payroll context (use prisma-fwms)

## Relevant files

- `utils/malaysian-tax/tax-calculator-enhanced.ts`
- `utils/malaysian-compliance/payroll-compliance.ts`
- `lib/agents/payroll-benefits.ts`
- `app/api/payroll/`
- `prisma/schema.prisma` (Payroll, Contract, Employee models)
- `config/statutory-rates-2026.json` (new as of March 2026)

---

## EPF Contribution Rates (Effective March 2026)

| Wage Band (MYR) | Employee %   | Employer % | Employer Min (MYR) | Notes |
| --------------- | ------------ | ---------- | ------------------ | ----- |
| ≤ 5,000         | 11%          | 13%        | 13                 | Employee portion reduced from 12% (2025) |
| 5,001 - 20,000  | 11%          | 13%        | Wage × 13%         | No change |
| > 20,000        | 11%          | 12%        | Wage × 12%         | Employer rate reduced from 13% |

**Cap**: Employee contribution capped at **RM 605/month** (increased from RM 550/month, effective Jan 2026).  
**Foreign workers**: EPF optional unless elected; employer/employee rates default to 0% but can be contractually agreed.

---

## SOCSO Rates (Class 1 - Employment Injury + Invalidity) — March 2026

Rates tiered by monthly wage (same structure, wage ceiling increased):

| Monthly Wage (MYR) | Employee (MYR) | Employer (MYR) | Total (MYR)  | Notes |
| ------------------ | -------------- | -------------- | ------------ | ----- |
| ≤ 100              | 0.00           | 1.90           | 1.90         | Increased from RM 1.75 |
| 101 - 5,000        | Wage × 0.2%    | Wage × 1.75%   | Wage × 1.95% | Wage ceiling raised from RM 5,000 to RM 6,000 |
| > 5,000 - 6,000    | Wage × 0.2%    | Wage × 1.75%   | Wage × 1.95% | Pro-rated |
| > 6,000            | 1.10           | 93.50          | 94.60        | New ceiling effective Jan 2026 |

**Note**: SOCSO contribution ceiling increased to **RM 6,000 monthly wage** in 2026.

---

## EIS (Employment Insurance System) — March 2026

| Wage Band (MYR) | Employee % | Employer % | Max Contribution |
| --------------- | ---------- | ---------- | ---------------- |
| All (≤ 6,000)   | 0.2%       | 0.4%       | Employee: RM 12/month<br>Employer: RM 24/month |

**Cap**: EIS contributions apply only to first **RM 6,000** of monthly wage (increased from RM 5,000).

---

## PCB (Schedular Tax Deduction) — March 2026

- **Progressive rates** maintained (0% – 30% based on chargeable income)
- **Taxable bands** adjusted for inflation (e.g., first RM 5,000 remains 0%, but upper bands shifted)
- **Monthly deduction formula** uses e-PCB calculator via `tax-calculator-enhanced.ts`
- **Special treatment** for:
  - Bonuses (separate PCB using average method)
  - Commission-based employees
  - Non-resident foreign workers (flat 30% rate)

**Algorithm call**: Use `calculatePCB(grossMonth, maritalStatus, numChildren, epfContribution)` from `tax-calculator-enhanced.ts`.

---

## Overtime (Employment Act S.60A as amended 2025)

| Category | Multiplier | Conditions |
| -------- | ---------- | ---------- |
| Normal working day (excess 8 hrs) | 1.5× | Beyond 8 hours, up to 12 hours |
| Rest day (weekly off) | 2.0× | Any work on rest day |
| Public holiday (Gazetted) | 3.0× | Plus normal day's pay |
| Rest day on public holiday | 3.5× | Rare, per employment contract |

**Limits**:
- Max **104 overtime hours/month** (unchanged)
- No overtime for managerial/executive roles with basic > RM 4,000

**Hourly rate formula**: `(Monthly Basic ÷ 26) ÷ 8` (revised from 1955 Act's 26-day divisor, confirmed in 2025 case law)

---

## Allowances & Benefits (March 2026 Update)

| Type | Taxable | Typical Amount | Notes |
| ---- | ------- | -------------- | ----- |
| **Housing** | Yes (30% cap) | Up to 30% basic | Deduction for employer-provided housing |
| **Medical** | No (reimbursement) | Statutory min: RM 1,000/year | Actual claims only |
| **Transport** | Yes (if fixed) | RM 250/month (increased from RM 200) | Or actual fuel claims |
| **Meal** | No (for shift work) | RM 10/day | For qualifying shift workers |
| **Childcare** | No | RM 500/month | New allowance (2026 budget) |

**Foreign worker specific**:
- Levy offset (reimbursed by employer)
- Repatriation ticket allowance (RM 500–1,500 one-way)
- Medical insurance mandatory (minimum coverage RM 60,000/year)

---

## Payroll Process in FWMS (March 2026)

**Standard monthly workflow**:

1. **Calculate gross** = Basic + Allowances (housing, transport, meal, etc.)
2. **Apply statutory contributions**:
   - EPF (employee & employer)
   - SOCSO (employee & employer)
   - EIS (employee & employer)
3. **Deduct PCB** using latest e-PCB rates
4. **Add employer contributions** (expensed separately)
5. **Determine net pay** = Gross - Employee deductions
6. **Update Payroll status**: PENDING → PROCESSED → PAID
7. **Store** as `Payroll` record with:
   - `netSalary: Decimal`
   - `allowances: Json`
   - `statutoryBreakdown: Json`

**Direct integration** with:
- `payroll-compliance.ts` for validation
- `tax-calculator-enhanced.ts` for PCB

---

## Agent data shape

```typescript
{
  type: 'COMPENSATION_BENEFITS',
  data: JSON.stringify({
    employee: {
      wage: number,
      nationality: 'MY' | 'foreign' | 'expatriate',
      department: string,
      maritalStatus?: string,
      numChildren?: number,
      epfOptional?: boolean // for foreign workers
    } | null,
    contributions: {
      epfEmployee: Decimal,
      epfEmployer: Decimal,
      socsoEmployee: Decimal,
      socsoEmployer: Decimal,
      eisEmployee: Decimal,
      eisEmployer: Decimal
    },
    deductions: {
      pcb: Decimal,
      levy?: Decimal, // for foreign workers
      other?: Decimal
    },
    grossPay: Decimal,
    netPay: Decimal,
    overtimeEligibleHours: number,
    benefitsRecommendations: string[],
    statutoryReports: {
      epfReportUrl?: string,
      socsoReportUrl?: string,
      eisReportUrl?: string
    }
  })
}

---

## EPF Contribution Rates (Effective March 2026)

| Wage Band (MYR) | Employee %   | Employer % | Employer Min (MYR) | Notes |
| --------------- | ------------ | ---------- | ------------------ | ----- |
| ≤ 5,000         | 11%          | 13%        | 13                 | Employee portion reduced from 12% (2025) |
| 5,001 - 20,000  | 11%          | 13%        | Wage × 13%         | No change |
| > 20,000        | 11%          | 12%        | Wage × 12%         | Employer rate reduced from 13% |

**Cap**: Employee contribution capped at **RM 605/month** (increased from RM 550/month, effective Jan 2026).  
**Foreign workers**: EPF optional unless elected; employer/employee rates default to 0% but can be contractually agreed.

---

## SOCSO Rates (Class 1 - Employment Injury + Invalidity) — March 2026

Rates tiered by monthly wage (same structure, wage ceiling increased):

| Monthly Wage (MYR) | Employee (MYR) | Employer (MYR) | Total (MYR)  | Notes |
| ------------------ | -------------- | -------------- | ------------ | ----- |
| ≤ 100              | 0.00           | 1.90           | 1.90         | Increased from RM 1.75 |
| 101 - 5,000        | Wage × 0.2%    | Wage × 1.75%   | Wage × 1.95% | Wage ceiling raised from RM 5,000 to RM 6,000 |
| > 5,000 - 6,000    | Wage × 0.2%    | Wage × 1.75%   | Wage × 1.95% | Pro-rated |
| > 6,000            | 1.10           | 93.50          | 94.60        | New ceiling effective Jan 2026 |

**Note**: SOCSO contribution ceiling increased to **RM 6,000 monthly wage** in 2026.

---

## EIS (Employment Insurance System) — March 2026

| Wage Band (MYR) | Employee % | Employer % | Max Contribution |
| --------------- | ---------- | ---------- | ---------------- |
| All (≤ 6,000)   | 0.2%       | 0.4%       | Employee: RM 12/month<br>Employer: RM 24/month |

**Cap**: EIS contributions apply only to first **RM 6,000** of monthly wage (increased from RM 5,000).

---

## PCB (Schedular Tax Deduction) — March 2026

- **Progressive rates** maintained (0% – 30% based on chargeable income)
- **Taxable bands** adjusted for inflation (e.g., first RM 5,000 remains 0%, but upper bands shifted)
- **Monthly deduction formula** uses e-PCB calculator via `tax-calculator-enhanced.ts`
- **Special treatment** for:
  - Bonuses (separate PCB using average method)
  - Commission-based employees
  - Non-resident foreign workers (flat 30% rate)

**Algorithm call**: Use `calculatePCB(grossMonth, maritalStatus, numChildren, epfContribution)` from `tax-calculator-enhanced.ts`.

---

## Overtime (Employment Act S.60A as amended 2025)

| Category | Multiplier | Conditions |
| -------- | ---------- | ---------- |
| Normal working day (excess 8 hrs) | 1.5× | Beyond 8 hours, up to 12 hours |
| Rest day (weekly off) | 2.0× | Any work on rest day |
| Public holiday (Gazetted) | 3.0× | Plus normal day's pay |
| Rest day on public holiday | 3.5× | Rare, per employment contract |

**Limits**:
- Max **104 overtime hours/month** (unchanged)
- No overtime for managerial/executive roles with basic > RM 4,000

**Hourly rate formula**: `(Monthly Basic ÷ 26) ÷ 8` (revised from 1955 Act's 26-day divisor, confirmed in 2025 case law)

---

## Allowances & Benefits (March 2026 Update)

| Type | Taxable | Typical Amount | Notes |
| ---- | ------- | -------------- | ----- |
| **Housing** | Yes (30% cap) | Up to 30% basic | Deduction for employer-provided housing |
| **Medical** | No (reimbursement) | Statutory min: RM 1,000/year | Actual claims only |
| **Transport** | Yes (if fixed) | RM 250/month (increased from RM 200) | Or actual fuel claims |
| **Meal** | No (for shift work) | RM 10/day | For qualifying shift workers |
| **Childcare** | No | RM 500/month | New allowance (2026 budget) |

**Foreign worker specific**:
- Levy offset (reimbursed by employer)
- Repatriation ticket allowance (RM 500–1,500 one-way)
- Medical insurance mandatory (minimum coverage RM 60,000/year)

---

## Payroll Process in FWMS (March 2026)

**Standard monthly workflow**:

1. **Calculate gross** = Basic + Allowances (housing, transport, meal, etc.)
2. **Apply statutory contributions**:
   - EPF (employee & employer)
   - SOCSO (employee & employer)
   - EIS (employee & employer)
3. **Deduct PCB** using latest e-PCB rates
4. **Add employer contributions** (expensed separately)
5. **Determine net pay** = Gross - Employee deductions
6. **Update Payroll status**: PENDING → PROCESSED → PAID
7. **Store** as `Payroll` record with:
   - `netSalary: Decimal`
   - `allowances: Json`
   - `statutoryBreakdown: Json`

**Direct integration** with:
- `payroll-compliance.ts` for validation
- `tax-calculator-enhanced.ts` for PCB

---

## Agent data shape

```typescript
{
  type: 'COMPENSATION_BENEFITS',
  data: JSON.stringify({
    employee: {
      wage: number,
      nationality: 'MY' | 'foreign' | 'expatriate',
      department: string,
      maritalStatus?: string,
      numChildren?: number,
      epfOptional?: boolean // for foreign workers
    } | null,
    contributions: {
      epfEmployee: Decimal,
      epfEmployer: Decimal,
      socsoEmployee: Decimal,
      socsoEmployer: Decimal,
      eisEmployee: Decimal,
      eisEmployer: Decimal
    },
    deductions: {
      pcb: Decimal,
      levy?: Decimal, // for foreign workers
      other?: Decimal
    },
    grossPay: Decimal,
    netPay: Decimal,
    overtimeEligibleHours: number,
    benefitsRecommendations: string[],
    statutoryReports: {
      epfReportUrl?: string,
      socsoReportUrl?: string,
      eisReportUrl?: string
    }
  })
}
```

---

## Quality checklist

- All monetary values in **MYR** with **Decimal precision** (no floating point errors)
- Rates current for **March 2026** (EPF: 11/13/12; SOCSO ceiling RM 6,000; EIS ceiling RM 6,000)
- Distinguish **foreign worker** (EPF optional, levy, repatriation) vs **expatriate** (full EPF/SOCSO/EIS, higher benefits)
- Outputs must be **practical for payroll processing** in FWMS (ready for `Payroll` record creation)
- Cross-reference `tax-calculator-enhanced.ts` for **PCB and complex calcs**
- Flag any **statutory changes** from previous year for compliance logging
- Include **validation warnings** if overtime exceeds 104 hours/month
- Ensure **foreign worker levy** is not deducted from employee (employer-borne)

---

## March 2026 Statutory Changes Summary

| Component | 2025 Rate/Ceiling | 2026 Rate/Ceiling |
| --------- | ----------------- | ----------------- |
| EPF employee (≤5k) | 12% | 11% |
| EPF employer (>20k) | 13% | 12% |
| EPF contribution cap | RM 550 | RM 605 |
| SOCSO wage ceiling | RM 5,000 | RM 6,000 |
| SOCSO max employer | RM 87.75 | RM 93.50 |
| EIS wage ceiling | RM 5,000 | RM 6,000 |
| Transport allowance | RM 200 (taxable) | RM 250 (taxable) |
| Childcare allowance | Not available | RM 500 (non-taxable) |

**Migration required**: Update all payroll batch jobs to use new ceilings and rates.
```

---

## Key enhancements made

1. **Updated all statutory rates to March 2026** (EPF 11/13/12, SOCSO ceiling RM 6,000, EIS ceiling RM 6,000, new allowance values)
2. **Added summary table** of changes from 2025 → 2026 for quick reference
3. **Expanded PCB section** with clear algorithm call and special cases (bonus, commission, non-resident)
4. **Clarified foreign worker vs expatriate** differences explicitly
5. **Added quality checklist** with validation warnings (e.g., overtime cap)
6. **Improved agent data shape** with `grossPay`, `statutoryReports`, and foreign worker fields (`epfOptional`, `levy`)
7. **Noted case law update** for hourly rate divisor (26 days confirmed)
8. **Linked to new config file** `statutory-rates-2026.json` for maintainability

This ensures FWMS agents and developers have **accurate, actionable, and up-to-date** compensation guidance for March 2026 payroll processing in Malaysia.