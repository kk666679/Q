# ISO 14971 Risk Management Integration with ISO 13485 QMS

## Risk Management Framework

### Risk Management Process Overview
```
┌─────────────────────────────────────────────────────────┐
│         Risk Management Planning (4.1, 4.2)             │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│         Risk Analysis (4.3, 4.4)                        │
│  • Identify hazards and hazardous situations            │
│  • Estimate risk for each hazardous situation           │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│         Risk Evaluation (4.5)                           │
│  • Compare estimated risks to risk criteria             │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│         Risk Control (4.6, 4.7, 4.8)                    │
│  • Implement risk control measures                      │
│  • Verify effectiveness                                 │
│  • Evaluate residual risk                               │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│    Production and Post-Production Information (5)       │
│  • Collect and review information                       │
│  • Update risk management file                          │
└─────────────────────────────────────────────────────────┘
```

---

## Integration with ISO 13485 Clauses

### Design and Development (ISO 13485 Clause 7.3)

#### 7.3.2 Design and Development Planning
**Risk Management Integration:**
- Include risk management activities in design plan
- Define risk management milestones
- Assign risk management responsibilities
- Schedule risk management reviews

**Documentation:**
- Risk management plan
- Risk management schedule
- Risk management team assignments

#### 7.3.3 Design and Development Inputs
**Risk Management Integration:**
- Identify safety requirements from risk analysis
- Include risk control measures in design inputs
- Reference applicable safety standards
- Define risk acceptability criteria

**Documentation:**
- Hazard identification from intended use analysis
- Safety requirements derived from risk analysis

#### 7.3.4 Design and Development Outputs
**Risk Management Integration:**
- Design outputs include risk control measures
- Specifications for safety-critical characteristics
- Information for safe use (warnings, precautions)
- Residual risk disclosure requirements

**Documentation:**
- Risk control measures in design specifications
- Safety-related acceptance criteria
- Labeling and IFU safety information

#### 7.3.5 Design and Development Review
**Risk Management Integration:**
- Review risk management activities at each stage
- Assess completeness of hazard identification
- Evaluate adequacy of risk control measures
- Review residual risks

**Documentation:**
- Risk management review records
- Risk acceptability decisions

#### 7.3.6 Design and Development Verification
**Risk Management Integration:**
- Verify implementation of risk control measures
- Confirm risk control effectiveness
- Test safety-critical features
- Validate risk analysis assumptions

**Documentation:**
- Verification of risk control measures
- Test results for safety features

#### 7.3.7 Design and Development Validation
**Risk Management Integration:**
- Validate risk control measures in use conditions
- Confirm residual risks acceptable
- Evaluate use errors and misuse scenarios
- Clinical evaluation (if required)

**Documentation:**
- Validation of risk control effectiveness
- Clinical evaluation report
- Usability validation results

#### 7.3.9 Design and Development Changes
**Risk Management Integration:**
- Assess risk impact of design changes
- Update risk analysis for changes
- Re-evaluate risk control measures
- Update risk management file

**Documentation:**
- Risk assessment of design changes
- Updated risk analysis
- Change impact on residual risk

---

### Production and Service Provision (ISO 13485 Clause 7.5)

#### 7.5.1 Control of Production and Service Provision
**Risk Management Integration:**
- Implement risk control measures in production
- Control safety-critical process parameters
- Monitor effectiveness of risk controls
- Maintain risk management file

#### 7.5.2 Cleanliness of Product
**Risk Management Integration:**
- Address contamination hazards in risk analysis
- Define cleanliness requirements from risk assessment
- Validate cleaning processes for risk control

#### 7.5.6 Validation of Processes
**Risk Management Integration:**
- Validate processes that implement risk controls
- Confirm risk control effectiveness
- Establish process parameters from risk analysis

---

### Measurement, Analysis and Improvement (ISO 13485 Clause 8)

#### 8.2.1 Feedback
**Risk Management Integration:**
- Collect post-production information per ISO 14971
- Monitor for new hazards or hazardous situations
- Assess if risk analysis remains valid
- Update risk management file

**Information Sources:**
- Customer complaints
- Field actions (recalls, corrections)
- Adverse event reports
- Post-market surveillance data
- Literature and standards updates

#### 8.2.3 Monitoring and Measurement of Processes
**Risk Management Integration:**
- Monitor processes that implement risk controls
- Measure effectiveness of risk control measures
- Trend data for risk indicators

#### 8.3 Control of Nonconforming Product
**Risk Management Integration:**
- Assess risk of nonconforming product
- Determine disposition based on risk
- Evaluate if nonconformance indicates new hazard
- Update risk analysis if needed

#### 8.5.2 Corrective Action
**Risk Management Integration:**
- Assess if corrective action affects risk analysis
- Update risk management file
- Implement additional risk controls if needed
- Verify risk control effectiveness

#### 8.5.3 Preventive Action
**Risk Management Integration:**
- Use risk analysis to identify preventive actions
- Implement risk control measures proactively
- Update risk management file

---

## Risk Management Plan Template

### Product Information
- **Product Name:**
- **Intended Use:**
- **Product Classification:**
- **Applicable Standards:**

### Risk Management Scope
- **Lifecycle Phases Covered:**
  - [ ] Design and development
  - [ ] Manufacturing
  - [ ] Installation and commissioning
  - [ ] Use and operation
  - [ ] Maintenance and servicing
  - [ ] Disposal

### Risk Management Activities
| Activity | Responsibility | Timeline | Deliverable |
|----------|---------------|----------|-------------|
| Risk management planning | | | Risk management plan |
| Hazard identification | | | Hazard list |
| Risk analysis | | | Risk analysis table |
| Risk evaluation | | | Risk evaluation report |
| Risk control | | | Risk control plan |
| Residual risk evaluation | | | Residual risk report |
| Risk/benefit analysis | | | Risk/benefit report |
| Risk management review | | | Review records |

### Risk Acceptability Criteria
**Risk Matrix:**
| Severity | Probability | Risk Level | Acceptability |
|----------|------------|------------|---------------|
| Catastrophic | Frequent | Unacceptable | Risk control required |
| Critical | Probable | Unacceptable | Risk control required |
| Serious | Occasional | ALARP | Risk control if practical |
| Minor | Remote | Acceptable | Monitor |
| Negligible | Improbable | Acceptable | Monitor |

**Severity Definitions:**
- **Catastrophic:** Death or permanent impairment
- **Critical:** Serious injury requiring medical intervention
- **Serious:** Injury requiring first aid or temporary impairment
- **Minor:** Discomfort or inconvenience
- **Negligible:** No injury or health effect

**Probability Definitions:**
- **Frequent:** >1 in 100
- **Probable:** 1 in 1,000 to 1 in 100
- **Occasional:** 1 in 10,000 to 1 in 1,000
- **Remote:** 1 in 100,000 to 1 in 10,000
- **Improbable:** <1 in 100,000

### Risk Control Hierarchy
1. **Inherent safety by design** (eliminate hazard)
2. **Protective measures** (guards, alarms, interlocks)
3. **Information for safety** (warnings, training)

### Risk Management Review
- **Review Frequency:** At each design stage and annually
- **Review Participants:** Design team, quality, regulatory, clinical
- **Review Criteria:** Completeness, appropriateness, effectiveness

### Risk Management File
**Location:** [Specify location]

**Contents:**
- Risk management plan
- Hazard identification records
- Risk analysis and evaluation
- Risk control measures
- Verification and validation records
- Residual risk evaluation
- Risk/benefit analysis
- Production and post-production information
- Risk management review records

---

## Risk Analysis Template

### Hazard Identification
| Hazard ID | Hazard | Hazardous Situation | Harm | Severity |
|-----------|--------|---------------------|------|----------|
| H-001 | | | | |

### Risk Estimation
| Hazard ID | Sequence of Events | Probability | Severity | Risk Level |
|-----------|-------------------|-------------|----------|------------|
| H-001 | | P1-P5 | S1-S5 | |

### Risk Evaluation
| Hazard ID | Risk Level | Acceptability | Action Required |
|-----------|------------|---------------|-----------------|
| H-001 | | Acceptable/ALARP/Unacceptable | Yes/No |

---

## Risk Control Measures

### Risk Control Plan
| Hazard ID | Risk Control Measure | Control Type | Implementation | Verification Method |
|-----------|---------------------|--------------|----------------|---------------------|
| H-001 | | Design/Protective/Information | Design spec/Procedure | Test/Inspection/Analysis |

**Control Types:**
- **Inherent Safety:** Design eliminates hazard
- **Protective Measures:** Guards, alarms, interlocks
- **Information for Safety:** Warnings, labels, training

### Risk Control Verification
| Control Measure | Verification Method | Acceptance Criteria | Result | Status |
|-----------------|---------------------|---------------------|--------|--------|
| | | | | Pass/Fail |

### Residual Risk Evaluation
| Hazard ID | Initial Risk | Risk Control | Residual Risk | Acceptable? |
|-----------|--------------|--------------|---------------|-------------|
| H-001 | | | | Yes/No |

### Overall Residual Risk
**Evaluation:** Is the overall residual risk acceptable considering the benefits?

[ ] Yes - Benefits outweigh residual risks
[ ] No - Additional risk controls required

**Risk/Benefit Analysis:**

---

## Post-Production Information Review

### Information Sources
- [ ] Customer complaints
- [ ] Service reports
- [ ] Adverse events
- [ ] Field actions
- [ ] Post-market surveillance
- [ ] Literature review
- [ ] Similar device information
- [ ] Standards updates

### Review Frequency
- **Routine Review:** Quarterly
- **Triggered Review:** Upon significant event

### Review Criteria
1. Are there new hazards or hazardous situations?
2. Has the estimated risk changed?
3. Are risk control measures still effective?
4. Is the risk analysis still valid?
5. Are there new risk control options?

### Actions
| Finding | Risk Impact | Action Required | Responsibility | Due Date |
|---------|-------------|-----------------|----------------|----------|
| | New/Changed/None | Update RMF/CAPA/Field Action | | |

---

## Risk Management Review Checklist

### Completeness
- [ ] All intended uses and foreseeable misuses identified
- [ ] All lifecycle phases considered
- [ ] All hazards identified
- [ ] All hazardous situations analyzed
- [ ] All risks estimated and evaluated
- [ ] Risk control measures implemented
- [ ] Risk controls verified
- [ ] Residual risks evaluated
- [ ] Overall residual risk acceptable
- [ ] Risk management file complete

### Appropriateness
- [ ] Risk analysis methods appropriate
- [ ] Risk acceptability criteria appropriate
- [ ] Risk control measures appropriate
- [ ] Verification methods appropriate
- [ ] Post-production plan appropriate

### Effectiveness
- [ ] Risk control measures effective
- [ ] Residual risks reduced to acceptable level
- [ ] Benefits outweigh residual risks
- [ ] Information for safety adequate

### Review Decision
[ ] Risk management activities complete and acceptable
[ ] Additional work required

**Reviewed by:** _________________ Date: _______
