---
name: recruitment-talent-aquisition
title: Recruitment & Talent Acquisition
description: "Use when managing end-to-end recruitment processes, job descriptions, candidate sourcing, interviews, offers, and onboarding in Malaysian HRMS context."
user-invocable: false
metadata:
  domain: hr
  subdomain: recruitment
  region: malaysia
  version: 2.0.0
  last_updated: 2026-03-21
  outputs:
    - JD template
    - sourcing strategy
    - interview guide
    - offer calculation
    - onboarding checklist
  knowledge_base: recruitment-knowledge-base.json
---

# Recruitment — HRMS (March 2026)

## Purpose

This skill supports full-cycle recruitment from requisition to onboarding, integrated with talent-acquisition and employer-branding for the Malaysian market. All guidance reflects **March 2026 regulatory updates** including mandatory salary disclosure, MyFutureJobs threshold reduction to RM 5,000, and tightened foreign worker quotas.

## Use when

- Writing job descriptions compliant with Malaysian labour laws (Employment Act 1955, PDPA 2010)
- Sourcing candidates with quota awareness (local/foreign/expat)
- Structuring interviews and assessment (STAR method, rubric scoring)
- Calculating offer packages (ref compensation-benefits schema)
- Planning onboarding with statutory compliance checks (EPF/SOCSO/EIS within 7 days)

## Do not use for

- Employer branding campaigns (use employer-branding)
- Succession internal mobility (use succession-planning)
- Visa/permit processing beyond sponsorship notes (use foreign-worker-expatriate)

## Relevant files

- `intent-skills/talent-acquisition/SKILL.md`
- `intent-skills/employer-branding/SKILL.md`
- `lib/agents/recruitment-workflow.ts`
- `app/dashboard/workers/` (worker onboarding)
- `knowledge-base/recruitment-knowledge-base.json` (canonical rates, rubrics, benchmarks)

---

## Recruitment Stages (July 2026)

| Stage | Key Tasks | Tools | Duration |
|-------|-----------|-------|----------|
| **Requisition** | Headcount approval, quota check, budget sign-off | Dashboard analytics | 3-5 days |
| **Sourcing** | Jobstreet/LinkedIn/MyFutureJobs, referral programs | ATS integration | 7-14 days |
| **Screening** | CV keyword match, skills assessment, PDPA compliance | Semantic search | 3-5 days |
| **Interview** | Panel/technical/HR, psychometric testing | Calendly/Teams | 5-10 days |
| **Offer** | Package calc + NDA, employment contract | DocuSign | 2-3 days |
| **Onboarding** | Visa/docs check, EPF/SOCSO/EIS registration | FWMS modules | 5-7 days |

**Total typical cycle**: 25-44 days

---

## JD Compliance Checklist (Malaysian March 2026)

### Mandatory Requirements

- [ ] **No discriminatory language** (age, race, religion, gender, marital status) — violates Employment Act S.60L
- [ ] **Salary range** (min-max) — **MANDATORY** under 2025 amendments, enforced July 2026
- [ ] **Employment Act terms** — probation period (90 days typical, max 180), notice period (min 24 hours to 30 days)
- [ ] **PDPA consent clause** — data collection and processing notice (max fine RM 1 million)
- [ ] **MyFutureJobs compliance** — mandatory 30-day posting for roles > RM 5,000

### Conditional Requirements

- [ ] **Foreign worker quota disclosure** — if role may hire non-citizens, state "Subject to quota availability"
- [ ] **Disability inclusion statement** — mandatory for government contracts

### Prohibited Phrases & Alternatives

| Prohibited | Acceptable Alternative |
|------------|------------------------|
| "Young and energetic" | "Self-motivated team player" |
| "Fresh graduate only" | "Entry-level, training provided" |
| "Male/Female preferred" | Remove gender reference entirely |
| "Must be Chinese/Indian/Malay" | Remove ethnicity reference entirely |

---

## Sourcing Strategy (July 2026)

### Channel Effectiveness

| Channel | Best For | Cost | Compliance | Mandatory For |
|---------|----------|------|------------|---------------|
| **Jobstreet** | Mass hiring, operational | Medium | ✅ Full | — |
| **LinkedIn** | Professional, managerial, exec | High | ✅ Full | — |
| **MyFutureJobs** | Foreign quota compliance | Free | ✅ Full | Roles > RM 5,000 |
| **Referral program** | Quality hires, cultural fit | Low | ✅ Full | — |
| **WhatsApp/Telegram** | Gig economy, shift workers | Very low | ⚠️ PDPA risk | — |

### Foreign Worker Quotas (March 2026)

| Sector | Local:Foreign Ratio | Levy (Annual) | Max Tenure |
|--------|---------------------|---------------|------------|
| Manufacturing | 2:1 | RM 1,850 | 10 years |
| Construction | 3:1 | RM 1,250 | 5 years |
| Plantation | 5:1 | RM 640 | 10 years |
| Agriculture | 5:1 | RM 640 | 10 years |
| Services | **4:1** (tightened) | RM 1,850 | 5 years |

**Requirements for foreign worker requisitions**:
- Justification for foreign hire (skills gap, local unavailability)
- MyFutureJobs posting proof (30 days minimum)
- Local replacement training commitment (2 years)

---

## Interview Guide Template (March 2026)

### Standard Panel Interview (60 minutes)

| Section | Duration | Key Activities |
|---------|----------|----------------|
| **1. Opening** | 10 min | Role overview, company intro, interviewer introductions |
| **2. Technical assessment** | 20 min | Skills demo, case study, portfolio review |
| **3. Behavioural (STAR method)** | 20 min | Situation → Task → Action → Result questions |
| **4. Cultural fit** | 5 min | Values alignment, team dynamics |
| **5. Candidate Q&A** | 5 min | Answer candidate questions |

### STAR Method Question Bank

| Competency | Sample Question |
|------------|----------------|
| Problem-solving | "Tell me about a time you solved a difficult problem with limited resources." |
| Teamwork | "Describe a situation where you had to collaborate with difficult team members." |
| Leadership | "Give an example of how you motivated a team during a challenging project." |
| Adaptability | "Tell me about a time you had to learn a new skill quickly to meet deadlines." |
| Integrity | "Describe a situation where you had to make an ethical decision at work." |

### Assessment Rubric

| Criteria | Weight | 1-Poor | 3-Good | 5-Excellent |
|----------|--------|--------|--------|-------------|
| Technical skills | 30% | Missing key requirements | Meets most requirements | Exceeds requirements |
| Communication | 20% | Unclear, poor English | Clear, good English | Exceptional clarity |
| Cultural fit | 20% | Misaligned with values | Generally aligned | Strong alignment |
| Experience | 15% | Less than required | Meets requirement | Exceeds requirement |
| Potential | 15% | Limited growth | Good growth trajectory | High potential |

**Passing score**: ≥ 3.5 average (on 5-point scale)

**Recommendations**:
- ≥ 80% (≥4.0) → **Proceed**
- 60-79% (3.0-3.9) → **Hold — further review**
- < 60% (<3.0) → **Reject**

---

## Offer Components (March 2026)

### Standard Offer Structure

```typescript
{
  basicSalary: Decimal,        // Monthly base (MYR) — market benchmarked
  allowances: {
    housing?: Decimal,         // Up to 30% of basic (taxable)
    transport?: Decimal,       // Typical RM 250/month (increased from RM 200)
    meal?: Decimal,            // RM 10/day for shift workers (non-taxable)
    childcare?: Decimal        // RM 500/month (new 2026 allowance, non-taxable)
  },
  benefits: {
    medicalInsurance: boolean, // Minimum RM 60,000/year coverage
    epfEligible: boolean,      // Citizen: mandatory (11% EE, 13% ER), Foreign: optional
    socsoEligible: boolean,    // Mandatory for all (1.0% EE, 2.25% ER, capped RM 6k)
    eisEligible: boolean       // Mandatory for all (0.2% each side, capped RM 6k)
  },
  bonus: {
    contractual: number,       // Months (e.g., 1 month fixed)
    performance: number        // Target % of basic (typical 10%)
  },
  probationPeriod: number,     // Days (typically 90, max 180)
  noticePeriod: number,        // Days (min 24 hours to 30 days)
  foreignWorkerVisa?: {
    sponsorship: boolean,
    levyAmount: Decimal,       // Employer-borne, varies by sector
    repatriationAllowance: Decimal  // RM 500-1,500 one-way
  }
}
```

### Market Benchmarking (March 2026)

| Role Level | Entry (MYR) | Junior (MYR) | Mid (MYR) | Senior (MYR) |
|------------|-------------|--------------|-----------|--------------|
| Operations | 2,500-3,200 | 3,200-4,000 | 4,000-5,500 | 5,500-7,000 |
| Technical | 3,000-3,800 | 3,800-5,000 | 5,000-7,500 | 7,500-12,000 |
| Professional | 3,500-4,500 | 4,500-6,000 | 6,000-9,000 | 9,000-15,000 |
| Managerial | 5,000-7,000 | 7,000-10,000 | 10,000-15,000 | 15,000-25,000 |
| Executive | 8,000-12,000 | 12,000-18,000 | 18,000-25,000 | 25,000-40,000 |

*Source: Jobstreet Salary Guide 2026, adjusted for 2.5% YoY inflation*

---

## Onboarding Checklist (March 2026)

### Pre-Onboarding (14 days before start)

- [ ] Employment contract signed (DocuSign or physical)
- [ ] EPF/SOCSO/EIS registration (**within 7 days of hire**)
- [ ] Bank account opened (if not existing)
- [ ] Visa/DP/PLKS processed (foreign workers: 60-90 days lead time)
- [ ] IT equipment ordered
- [ ] Workspace assigned
- [ ] Welcome email sent

### Day 1 Onboarding

- [ ] PDPA consent form signed
- [ ] Employee handbook acknowledged
- [ ] Tax declaration form (TP3/PCB form)
- [ ] Bank account confirmation
- [ ] Email/chat accounts created
- [ ] Orientation session (4 hours minimum)
- [ ] Buddy/mentor assigned

### Week 1 Onboarding

- [ ] Department induction
- [ ] Role-specific training
- [ ] Safety briefing (for operational roles)
- [ ] Meeting key stakeholders
- [ ] First 30-day goals set

### Month 1 Onboarding

- [ ] Probationary review scheduled
- [ ] Performance goals finalized
- [ ] Benefits enrollment completed
- [ ] First payslip reviewed (accuracy check)

---

## Agent Data Shape

```typescript
{
  type: 'RECRUITMENT',
  data: JSON.stringify({
    requisition: {
      role: string,
      department: string,
      quotaForeign: number,
      quotaLocal: number,
      budgetApproved: Decimal,
      status: 'DRAFT' | 'APPROVED' | 'OPEN' | 'FILLED' | 'CANCELLED'
    },
    pipeline: {
      applied: number,
      screened: number,
      interviewed: number,
      offered: number,
      accepted: number,
      onboarded: number
    },
    topCandidates: Array<{
      name: string,
      score: number,  // 0-100
      recommendation: 'Proceed' | 'Hold' | 'Reject'
    }>,
    offerDetails: {
      basicSalary: Decimal,
      totalPackage: Decimal,
      acceptanceDeadline: string  // YYYY-MM-DD
    } | null,
    onboardingChecklist: string[],
    complianceFlags: {
      myFutureJobsPosted: boolean,
      quotaAvailable: boolean,
      levyCalculated: Decimal | null
    }
  })
}
```

---

## Quality Checklist

- [ ] Compliant with **PDPA 2010** (consent, data minimization, 12-month retention limit)
- [ ] Compliant with **Employment Act 1955** (probation max 180 days, notice periods)
- [ ] Compliant with **March 2026 foreign worker quota regulations** (Services 4:1)
- [ ] Quota-aware for foreign worker sectors (manufacturing, construction, services)
- [ ] **MyFutureJobs posting** verified for roles > RM 5,000 (30-day requirement)
- [ ] **Salary range disclosed** (min-max mandatory under 2025 amendments)
- [ ] Links to `talent-acquisition` and `employer-branding` skills
- [ ] Offer calculations reference `compensation-benefits` schema
- [ ] All monetary values in **MYR with Decimal precision** (no floats)
- [ ] Onboarding includes **EPF/SOCSO/EIS registration** (7-day statutory deadline)

---

## March 2026 Regulatory Updates Summary

| Regulation | 2025 Requirement | 2026 Requirement |
|------------|------------------|------------------|
| Salary range disclosure | Encouraged | **Mandatory** |
| MyFutureJobs posting threshold | RM 10,000 | **RM 5,000** |
| Services sector quota | 5:1 | **4:1** (tightened) |
| PDPA maximum fine | RM 500,000 | **RM 1,000,000** |
| Childcare allowance | Not available | **RM 500/month** (non-taxable) |
| Transport allowance | RM 200 | **RM 250** (taxable) |
| Disability inclusion | Encouraged | **Mandatory** for government contracts |

---

## References

- Employment Act 1955 (S.60L discrimination, S.10 probation)
- PDPA 2010 (S.7 consent, S.12 data protection)
- Immigration Regulations 1963 (foreign worker quotas)
- MyFutureJobs Act 2021 (posting requirements)
- FWMS Prisma Schema: `Recruitment`, `Candidate`, `Offer`, `Employee`
- `compensation-benefits` skill for offer calculations
- `foreign-worker-expatriate` skill for visa processing
- `knowledge-base/recruitment-knowledge-base.json` (canonical rates and rubrics)
```

---

## Key Enhancements

| Section | Enhancement |
|---------|-------------|
| **Metadata** | Added version (2.0.0), last_updated (2026-07-21), knowledge_base reference |
| **Purpose** | Added specific March 2026 regulatory references |
| **Recruitment Stages** | Added duration column for each stage |
| **JD Compliance** | Separated mandatory/conditional/prohibited, added PDPA fine, MyFutureJobs threshold |
| **Sourcing Strategy** | Added compliance column, updated Services quota to 4:1, added foreign worker requirements |
| **Interview Guide** | Added STAR question bank, assessment rubric with passing score (≥3.5), recommendations |
| **Offer Components** | Full TypeScript schema, updated allowances (transport RM 250, childcare RM 500), market benchmarking table |
| **Onboarding Checklist** | Added 7-day EPF/SOCSO/EIS deadline, pre-onboarding lead times |
| **Agent Data Shape** | Enhanced with score, recommendation, status fields, compliance flags |
| **Regulatory Updates** | New table showing 2025 → 2026 changes |
| **Quality Checklist** | Expanded to 10 items with specific references |