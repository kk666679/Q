# Senior Quality Manager - QMS ISO 13485 Specialist Agent

## Overview
This agent provides expert-level guidance on ISO 13485 Quality Management System implementation and maintenance for medical device organizations. It includes comprehensive tools, templates, and resources for quality professionals.

## Agent Structure

```
agents/
└── senior-quality-manager.md          # Agent profile and competencies

scripts/
├── qms-performance-dashboard.py       # QMS metrics tracking
├── document-control-audit.py          # Document control compliance
├── management-review-prep.py          # Management review preparation
└── audit-checklists/
    ├── process-audit.py               # Process audit checklist generator
    ├── system-audit.py                # System audit checklist generator
    └── product-audit.py               # Product audit checklist generator

references/
├── iso13485-procedures.md             # Standard operating procedures
├── root-cause-analysis-tools.md       # RCA methodologies
├── design-control-templates.md        # Design control documentation
├── supplier-qualification-criteria.md # Supplier management framework
└── risk-management-integration.md     # ISO 14971 integration guide

assets/
├── qms-templates/
│   └── quality-manual-template.md     # Quality Manual template
├── audit-forms/
│   └── internal-audit-report-template.md
├── training-materials/                # (Ready for content)
└── process-flowcharts/                # (Ready for content)
```

## Core Capabilities

### 1. QMS Implementation
- Gap analysis and planning
- Quality Manual development
- Process documentation
- Training and deployment

### 2. Document Control
- Document lifecycle management
- Version control systems
- Distribution and access control
- Compliance auditing

### 3. Management Review
- Quarterly review facilitation
- Input preparation per ISO 13485 5.6.2
- Decision tracking
- Action item management

### 4. Internal Audit Program
- Risk-based audit planning
- Comprehensive audit checklists
- Nonconformity management
- CAPA integration

### 5. Design Controls
- Design planning through validation
- Risk management integration
- Design transfer processes
- Change control

### 6. Supplier Quality
- Supplier qualification
- Performance monitoring
- Audit programs
- Corrective action management

## Using the Scripts

### QMS Performance Dashboard
```bash
python scripts/qms-performance-dashboard.py
```
Generates comprehensive QMS metrics including:
- Audit closure rates
- CAPA performance
- Customer complaint metrics
- Training compliance
- Document control status

### Document Control Audit
```bash
python scripts/document-control-audit.py
```
Audits document control system compliance with ISO 13485 Clause 4.2.3

### Management Review Preparation
```bash
python scripts/management-review-prep.py
```
Compiles all required inputs per ISO 13485 Clause 5.6.2

### Audit Checklists
```bash
# Process audit
python scripts/audit-checklists/process-audit.py

# System audit
python scripts/audit-checklists/system-audit.py

# Product audit
python scripts/audit-checklists/product-audit.py
```

## Key Resources

### ISO 13485 Procedures
Comprehensive SOP templates for:
- Document Control (4.2.3)
- Management Review (5.6)
- Internal Audit (8.2.2)
- CAPA (8.5.2, 8.5.3)
- Supplier Management (7.4)
- Design Control (7.3)
- Risk Management (ISO 14971)

### Root Cause Analysis Tools
Methodologies including:
- 5 Whys Analysis
- Fishbone Diagram (Ishikawa)
- FMEA
- Pareto Analysis
- Fault Tree Analysis
- Kepner-Tregoe
- A3 Problem Solving

### Design Control Templates
Complete templates for:
- Design and Development Plan
- Design Input Specification
- Design Output Specification
- Design Review Report
- Design Verification Protocol
- Design Validation Protocol
- Design Transfer Checklist
- Design Change Request

### Supplier Management
Framework for:
- Supplier qualification process
- Performance monitoring KPIs
- Audit programs
- Corrective action requests
- Quality agreements

### Risk Management Integration
ISO 14971 integration with:
- Design and development (7.3)
- Production processes (7.5)
- Measurement and improvement (8)
- Post-production information

## Quality Manual Template
Comprehensive Quality Manual template aligned with ISO 13485:2016 structure covering all clauses from 4 through 8.

## Best Practices

### Internal Audit Program
1. **Risk-Based Planning**: Focus audit resources on high-risk areas
2. **Competent Auditors**: Ensure auditor training and independence
3. **Effective Follow-Up**: Verify corrective action effectiveness
4. **Continuous Improvement**: Use audit findings to drive improvement

### Management Review
1. **Preparation**: Compile comprehensive inputs before meeting
2. **Data-Driven**: Use metrics and trends for decision-making
3. **Action-Oriented**: Ensure clear decisions and action items
4. **Follow-Through**: Track and verify action item completion

### CAPA System
1. **Root Cause Analysis**: Use appropriate tools for complexity
2. **Risk-Based**: Prioritize based on risk and impact
3. **Effectiveness**: Verify corrective actions eliminate root cause
4. **Prevention**: Identify and address potential issues proactively

### Document Control
1. **Approval Workflow**: Clear review and approval process
2. **Version Control**: Robust version management system
3. **Access Control**: Ensure current versions at point of use
4. **Obsolete Control**: Prevent unintended use of obsolete documents

## Regulatory Compliance

### ISO 13485:2016
Complete alignment with all requirements including:
- Quality Management System (Clause 4)
- Management Responsibility (Clause 5)
- Resource Management (Clause 6)
- Product Realization (Clause 7)
- Measurement, Analysis and Improvement (Clause 8)

### FDA 21 CFR Part 820
Quality System Regulation alignment for US market

### EU MDR 2017/745
Medical Device Regulation compliance for European market

## Key Quality Indicators

Monitor these critical metrics:
- **Audit Closure Rate**: Target >95%
- **CAPA On-Time Closure**: Target >90%
- **Customer Complaint Response**: Target <5 days
- **Training Compliance**: Target 100%
- **Document Control Compliance**: Target 100%

## Getting Started

1. **Review Agent Profile**: Read `agents/senior-quality-manager.md`
2. **Assess Current State**: Use audit checklists to evaluate QMS
3. **Identify Gaps**: Compare against ISO 13485 requirements
4. **Develop Plan**: Create implementation roadmap
5. **Implement**: Use templates and procedures to build QMS
6. **Monitor**: Use dashboard to track performance
7. **Improve**: Continuous improvement through CAPA and management review

## Support and Maintenance

### Annual Activities
- Management review (minimum quarterly)
- Internal audit program execution
- Supplier re-evaluation
- Document periodic review
- Training effectiveness assessment

### Continuous Activities
- Customer feedback monitoring
- Process performance tracking
- CAPA management
- Risk management updates
- Regulatory monitoring

## Customization

All templates and procedures can be customized to your organization's:
- Product types and classifications
- Regulatory requirements
- Organizational structure
- Process complexity
- Risk profile

## Version Control
- **Version**: 1.0
- **Date**: 2024
- **Status**: Active
- **Next Review**: Annual

## Contact
For questions or support regarding this agent, contact your Quality Management Representative.
