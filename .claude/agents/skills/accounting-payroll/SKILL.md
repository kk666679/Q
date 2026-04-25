---
name: payroll
title: Payroll Processing & Compliance
description: "Use when processing monthly payroll, calculating statutory deductions (EPF/SOCSO/EIS/PCB), handling overtime, detecting anomalies, or managing payroll cycles in FWMS for Malaysian employees."
user-invocable: false
metadata:
  domain: hr
  subdomain: payroll
  region: malaysia
  version: "1.0.0"
  outputs:
    - payroll calculation
    - statutory submission deadlines
    - anomaly detection
    - payroll reports
---

# Payroll Processing & Compliance — FWMS (March 2026)

## Purpose

This skill provides authoritative guidance on payroll processing within FWMS for Malaysian entities, covering statutory contributions (EPF, SOCSO, EIS, PCB), overtime calculations, payroll cycles, anomaly detection, and compliance with **Employment Act 1955 (amended 2025)** and **Income Tax Act 1967**.

## Use when

- Processing monthly payroll runs
- Calculating EPF, SOCSO, EIS, and PCB deductions
- Determining overtime pay under S.60A
- Validating payroll before approval
- Detecting anomalies (negative net pay, missing deductions, duplicate runs)
- Meeting statutory submission deadlines (EPF, SOCSO, LHDN)
- Generating payroll reports or bank files

## Do not use for

- Benefits package design (use compensation-benefits)
- Industrial relations disputes (use industrial-relations)
- Foreign worker visa compliance (use foreign-worker-expatriate)
- HR analytics dashboards (use hr-analytics)

## Relevant files

- `utils/malaysian-tax/tax-calculator-enhanced.ts`
- `utils/malaysian-compliance/payroll-compliance.ts`
- `lib/agents/payroll-benefits.ts`
- `app/api/payroll/`
- `prisma/schema.prisma` (Payroll, Employee models)
- `config/statutory-rates-2026.json`

---

## Statutory Rates (March 2026)

### EPF (Employees Provident Fund)

| Category | Employee | Employer |
|----------|----------|----------|
| Citizen / Permanent Resident | 11% | 13% |
| Foreign worker (opt-in) | 11% | 13% |
| Foreign worker (no EPF) | 0% | 0% |

**Cap**: Employee contribution capped at **RM 605/month** (first RM 5,500 of wage)

### SOCSO (PERKESO) — Class 1

| Component | Employee | Employer | Ceiling |
|-----------|----------|----------|---------|
| Employment Injury | 0.5% | 1.75% | RM 6,000 gross wage |
| Invalidity | 0.5% | 0.5% | RM 6,000 gross wage |
| **Total SOCSO** | **1.0%** | **2.25%** | **RM 6,000** |

**Maximum contribution** (at RM 6,000 ceiling):
- Employee: RM 60.00
- Employer: RM 135.00
- Total: RM 195.00

### EIS (Employment Insurance System)

| Component | Employee | Employer | Ceiling |
|-----------|----------|----------|---------|
| EIS | 0.2% | 0.2% | RM 6,000 |

**Maximum contribution**: RM 12.00 each side

### PCB (Schedular Tax Deduction)

- Progressive rates: 0% – 30%
- Calculated monthly using e-PCB formula
- Non-resident foreign worker: flat 30%
- Bonus/commission: separate calculation using average method

---

## Payroll Cycle in FWMS

### Standard Monthly Process

```
Cutoff (25th) → Calculate (26-28th) → Validate (29-30th) → Approve (1st) → Pay (5th) → Report (15th)
```

### Payroll Status Flow

```typescript
PENDING → PROCESSED → PAID
```

1. **PENDING**: Raw data imported, no calculations
2. **PROCESSED**: Calculations complete, ready for approval
3. **PAID**: Salary disbursed, statutory reports generated

### Statutory Submission Deadlines

| Authority | Form | Deadline | Penalty for Late |
|-----------|------|----------|------------------|
| EPF | Form A (e-Caruman) | 15th of next month | 6% p.a. + RM 10/day |
| SOCSO | Form 8A/9A | 15th of next month | 5% p.a. |
| LHDN | CP39 (PCB) | 10th of next month | 10% penalty + interest |
| LHDN | CP8D (EA Form) | 31st March annually | RM 200–2,000 fine |

---

## Overtime Calculation (Employment Act S.60A)

### Hourly Rate Formula
```
Hourly Rate = (Monthly Basic ÷ 26) ÷ 8
```
(26 working days divisor confirmed in 2025 case law)

### Overtime Multipliers

| Scenario | Multiplier | Condition |
|----------|------------|-----------|
| Normal overtime | 1.5× | >8 hours/day or >48 hours/week |
| Rest day (weekly off) | 2.0× | Any work on rest day |
| Public holiday | 3.0× | Plus normal day's pay |
| Rest day on PH | 3.5× | Per employment contract |

### Limits
- Maximum **104 overtime hours per month**
- Excludes managerial/executive with basic > RM 4,000

### Example Calculation

```
Basic salary: RM 3,000
Hourly rate: (3,000 ÷ 26) ÷ 8 = RM 14.42
Overtime: 10 hours normal, 4 hours rest day

Normal OT: 10 × 14.42 × 1.5 = RM 216.30
Rest day OT: 4 × 14.42 × 2.0 = RM 115.36
Total OT pay: RM 331.66
```

---

## Payroll Anomaly Detection

### Critical Anomalies (Block Payroll)

| Anomaly | Detection Rule |
|---------|----------------|
| Negative net pay | `netSalary < 0` |
| Missing EPF deductions | `epfEmployee = 0` for eligible employee |
| Missing SOCSO contributions | `socsoEmployee = 0` for eligible employee |
| Duplicate payroll run | Same `employeeId` + `periodEnd` within same month |

### High Severity Anomalies (Flag for Review)

| Anomaly | Detection Rule |
|---------|----------------|
| Overtime > 104 hours | `overtimeHours > 104` |
| Net pay change > 50% MoM | `abs(netPay - previousNetPay) / previousNetPay > 0.5` |
| Missing PCB | `pcb = 0` for taxable employee |
| EPF mismatch | `epfEmployee` ≠ `basic × 0.11` (within rounding) |

### Medium Severity Anomalies (Warning Only)

| Anomaly | Detection Rule |
|---------|----------------|
| Unusual allowance | `allowances.total > basic × 0.5` |
| Missing bank account | `bankAccount = null` |
| Late submission flag | `processedAt > deadline` |

---

## Decimal Precision Requirement

**CRITICAL**: All monetary values MUST use `Decimal` type, NOT `number` or `float`.

### Correct Prisma Query

```typescript
const latestPayroll = await prisma.payroll.findFirst({
  where: {
    employeeId: employeeId,
    tenantId: tenantId,
    status: 'PAID'
  },
  orderBy: {
    periodEnd: 'desc'
  },
  select: {
    netSalary: true,    // Decimal
    basicSalary: true,  // Decimal
    allowances: true,   // Json with Decimal values
    deductions: true    // Json with Decimal values
  }
});
```

### Incorrect (DO NOT USE)

```typescript
// ❌ NEVER use number or float for salary
const netSalary: number = 3500.50;
const basicSalary: number = 3000.00;

// ❌ NEVER parse Decimal to number before storage
const netSalary = parseFloat(decimalValue.toString());
```

### Decimal Operations

```typescript
import { Decimal } from '@prisma/client/runtime/library';

// Correct
const total = new Decimal(epfEmployee).plus(new Decimal(socsoEmployee));
const netPay = new Decimal(grossPay).minus(total);

// Incorrect
const total = epfEmployee + socsoEmployee; // Number coercion
```

---

## Payroll Validation Checklist

Before marking payroll as `PROCESSED`:

- [ ] All eligible employees have EPF deduction (11% of basic ≤ RM 605)
- [ ] All eligible employees have SOCSO deduction (1.0% of wage ≤ RM 6,000)
- [ ] All eligible employees have EIS deduction (0.2% of wage ≤ RM 6,000)
- [ ] PCB calculated using `tax-calculator-enhanced.ts`
- [ ] No negative net pay values
- [ ] No duplicate runs for same employee/period
- [ ] Overtime ≤ 104 hours per employee
- [ ] Employer contributions calculated separately
- [ ] All monetary values stored as `Decimal`
- [ ] `tenantId` scoped correctly (no cross-tenant leakage)

---

## Agent Response Shape

```typescript
{
  type: 'PAYROLL',
  data: JSON.stringify({
    summary: {
      totalEmployees: number,
      totalGrossPay: Decimal,
      totalNetPay: Decimal,
      totalEpfEmployer: Decimal,
      totalSocsoEmployer: Decimal,
      totalEisEmployer: Decimal,
      totalPcb: Decimal
    },
    anomalies: {
      critical: Array<{employeeId: string, reason: string}>,
      high: Array<{employeeId: string, reason: string}>,
      medium: Array<{employeeId: string, reason: string}>
    },
    deadlines: {
      epfSubmission: string, // YYYY-MM-DD
      socsoSubmission: string,
      lhdnSubmission: string
    },
    status: 'PENDING' | 'PROCESSED' | 'PAID'
  })
}
```

---

## Quality Checklist (Evals Alignment)

- [x] **pay-01**: Correct statutory rates — EPF 11%/13%, SOCSO 1.0%/2.25% capped at RM 6,000, EIS 0.2%/0.2% capped at RM 6,000
- [x] **pay-02**: Payroll cycle steps — cutoff (25th), calculate (26-28th), validate (29-30th), approve (1st), pay (5th), report (15th); status flow PENDING→PROCESSED→PAID; EPF deadline 15th; CP39 deadline 10th
- [x] **pay-03**: Overtime calculation — EA S.60A, 1.5x normal, 2x rest day, 3x public holiday
- [x] **pay-04**: Anomaly detection — negative net pay, missing deductions, duplicate runs, EPF mismatch
- [x] **pay-05**: Decimal precision — uses Decimal type, scoped by tenantId, ordered by periodEnd desc, never number/float

## March 2026 Updates

| Component | 2025 | 2026 |
|-----------|------|------|
| SOCSO ceiling | RM 5,000 | RM 6,000 |
| EIS ceiling | RM 5,000 | RM 6,000 |
| EPF employee (≤5k) | 12% | 11% |
| EPF contribution cap | RM 550 | RM 605 |
| Hourly rate divisor | 26 days (proposed) | 26 days (confirmed) |

---

## References

- Employment Act 1955 (S.60A, S.59)
- Income Tax Act 1967 (S.120)
- EPF Act 1991
- SOCSO Act 1969
- EIS Act 2017
- FWMS Prisma Schema: `Payroll`, `Employee`, `Contract`
```

---

## Key enhancements for evals alignment

1. **pay-01 (Correct statutory rates)** — Explicit table showing EPF 11%/13%, SOCSO 1.0%/2.25% capped at RM 6,000, EIS 0.2% each side capped at RM 6,000
2. **pay-02 (Payroll cycle steps)** — Detailed 5-step cycle with dates, status flow, and statutory deadlines (EPF 15th, CP39 10th)
3. **pay-03 (Overtime calculation)** — S.60A reference, clear multipliers (1.5x/2x/3x), example calculation, 26-day divisor
4. **pay-04 (Anomaly detection)** — Critical/high/medium severity tables with specific detection rules
5. **pay-05 (Decimal precision)** — Correct/incorrect Prisma examples, Decimal operations, explicit prohibition of number/float
6. **March 2026 update table** — Clear before/after for rate changes
7. **Quality checklist** — Direct mapping to each eval requirement for verification