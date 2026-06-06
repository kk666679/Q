# MYQMS Node Library Development Roadmap

## Enterprise Malaysian Regulatory Workflow Platform

---

# Project Overview

Build a production-grade MYQMS Node Library for XYFlow (React Flow) that provides a visual workflow engine for:

* Malaysian Regulatory Compliance
* Malaysian Standards (MS)
* ISO Management Systems
* Governance, Risk & Compliance (GRC)
* Halal Assurance
* ESG & Sustainability
* Manufacturing Compliance
* Cybersecurity
* Privacy & PDPA
* Business Continuity
* Legal & Regulatory Intelligence
* AI Compliance Copilot

Target:

* 250–500+ Nodes
* 50+ Edge Types
* Registry-driven Architecture
* AI-Assisted Workflow Builder
* Enterprise Multi-Tenant Ready

---

# PHASE 1 — FOUNDATION ARCHITECTURE

## Project Structure

- [ ] Create `/components/my-standards`
- [ ] Create `/nodes`
- [ ] Create `/edges`
- [ ] Create `/handles`
- [ ] Create `/palette`
- [ ] Create `/registry`
- [ ] Create `/validators`
- [ ] Create `/workflows`
- [ ] Create `/templates`
- [ ] Create `/engine`
- [ ] Create `/metadata`
- [ ] Create `/ai`
- [ ] Create `/hooks`
- [ ] Create `/types`
- [ ] Create `/utils`

---

## Shared Types

- [ ] NodeMetadata interface
- [ ] RegulatoryMetadata interface
- [ ] WorkflowNode interface
- [ ] WorkflowEdge interface
- [ ] ConnectionRule interface
- [ ] ValidationResult interface
- [ ] Agency interface
- [ ] Standard interface
- [ ] ComplianceScore interface

---

## Registry Engine

- [ ] NodeRegistry
- [ ] EdgeRegistry
- [ ] CategoryRegistry
- [ ] AgencyRegistry
- [ ] StandardRegistry
- [ ] WorkflowRegistry
- [ ] TemplateRegistry

---

# PHASE 2 — CORE WORKFLOW NODES

Folder:

```
nodes/core
```

## Core Nodes

- [ ] StartNode
- [ ] EndNode
- [ ] ProcessNode
- [ ] TaskNode
- [ ] DecisionNode
- [ ] ConditionNode
- [ ] ApprovalNode
- [ ] ReviewNode
- [ ] EscalationNode
- [ ] NotificationNode
- [ ] ParallelNode
- [ ] MergeNode
- [ ] LoopNode
- [ ] SubProcessNode
- [ ] DelayNode
- [ ] TriggerNode
- [ ] EventNode
- [ ] SLAEscalationNode

---

# PHASE 3 — MALAYSIAN REGULATORY DOMAIN NODES

## Malaysian Standards

Folder:

```
nodes/standards
```

### Standards Management

- [ ] MSStandardNode
- [ ] MSClauseNode
- [ ] MSRequirementNode
- [ ] MSComplianceNode
- [ ] MSGapAnalysisNode
- [ ] MSAssessmentNode
- [ ] MSAuditNode
- [ ] MSCertificationNode
- [ ] MSRenewalNode

### Supported Standards

- [ ] MS ISO 9001
- [ ] MS ISO 14001
- [ ] MS ISO 45001
- [ ] MS ISO 22000
- [ ] MS ISO 27001
- [ ] MS ISO 37001
- [ ] MS ISO 50001
- [ ] MS 1500

---

## SIRIM

Folder:

```
nodes/malaysia/sirim
```

- [ ] SIRIMCertificationNode
- [ ] SIRIMTestingNode
- [ ] SIRIMCalibrationNode
- [ ] SIRIMInspectionNode
- [ ] SIRIMRenewalNode
- [ ] SIRIMComplianceNode

---

## JAKIM & Halal

Folder:

```
nodes/halal
```

- [ ] HalalPolicyNode
- [ ] HalalCommitteeNode
- [ ] HalalTrainingNode
- [ ] HalalAuditNode
- [ ] HalalSupplierNode
- [ ] HalalIngredientNode
- [ ] HalalTraceabilityNode
- [ ] HalalRiskNode
- [ ] HalalCertificateNode
- [ ] InternalHalalAuditNode
- [ ] HalalCorrectiveActionNode
- [ ] HalalReviewNode
- [ ] HalalRenewalNode

---

## DOSH / Occupational Safety

Folder:

```
nodes/manufacturing/dosh
```

- [ ] HazardNode
- [ ] HIRARCNode
- [ ] SafetyInspectionNode
- [ ] NearMissNode
- [ ] IncidentNode
- [ ] OSHTrainingNode
- [ ] PermitToWorkNode
- [ ] MachineryInspectionNode
- [ ] ChemicalRegisterNode
- [ ] ErgonomicAssessmentNode

---

## NPRA

Folder:

```
nodes/manufacturing/npra
```

- [ ] ProductRegistrationNode
- [ ] GMPAuditNode
- [ ] BatchReleaseNode
- [ ] ProductRecallNode
- [ ] PharmacovigilanceNode
- [ ] MedicalDeviceNode

---

## SSM

Folder:

```
nodes/governance/ssm
```

- [ ] CompanyRegistrationNode
- [ ] AnnualReturnNode
- [ ] BeneficialOwnershipNode
- [ ] DirectorComplianceNode
- [ ] CompanySecretaryNode

---

## Customs

Folder:

```
nodes/customs
```

- [ ] ImportPermitNode
- [ ] ExportPermitNode
- [ ] TariffClassificationNode
- [ ] CustomsDeclarationNode
- [ ] TradeComplianceNode
- [ ] DutyCalculationNode
- [ ] FTAValidationNode
- [ ] StrategicTradeNode

---

## Tax

Folder:

```
nodes/tax
```

- [ ] EInvoiceNode
- [ ] CorporateTaxNode
- [ ] PCBNode
- [ ] SSTNode
- [ ] TaxAuditNode
- [ ] TaxAssessmentNode
- [ ] TaxRiskNode
- [ ] TransferPricingNode

---

# PHASE 4 — QMS MODULES

Folder:

```
nodes/quality
```

- [ ] QualityPolicyNode
- [ ] QualityObjectiveNode
- [ ] ProcessMappingNode
- [ ] SIPOCNode
- [ ] KPINode
- [ ] CustomerFeedbackNode
- [ ] QualityReviewNode
- [ ] ImprovementNode
- [ ] ProcessOwnerNode
- [ ] ProcessPerformanceNode

---

# PHASE 5 — AUDIT MANAGEMENT

Folder:

```
nodes/audit
```

- [ ] AuditProgramNode
- [ ] AuditPlanNode
- [ ] AuditChecklistNode
- [ ] AuditExecutionNode
- [ ] AuditFindingNode
- [ ] AuditObservationNode
- [ ] AuditReportNode
- [ ] AuditClosureNode
- [ ] AuditorAssignmentNode
- [ ] FollowUpAuditNode

---

# PHASE 6 — CAPA MANAGEMENT

Folder:

```
nodes/capa
```

- [ ] NonConformanceNode
- [ ] CAPAInitiationNode
- [ ] RootCauseNode
- [ ] FiveWhyNode
- [ ] FishboneNode
- [ ] CorrectiveActionNode
- [ ] PreventiveActionNode
- [ ] VerificationNode
- [ ] EffectivenessReviewNode
- [ ] CAPAClosureNode

---

# PHASE 7 — ENTERPRISE RISK MANAGEMENT

Folder:

```
nodes/risk
```

- [ ] RiskRegisterNode
- [ ] RiskIdentificationNode
- [ ] RiskAssessmentNode
- [ ] RiskMatrixNode
- [ ] RiskTreatmentNode
- [ ] ControlNode
- [ ] ResidualRiskNode
- [ ] RiskReviewNode
- [ ] RiskMonitoringNode
- [ ] KRINode
- [ ] EmergingRiskNode

---

# PHASE 8 — HR COMPLIANCE

Folder:

```
nodes/hr
```

- [ ] EmployeeNode
- [ ] PayrollNode
- [ ] EPFNode
- [ ] SOCSONode
- [ ] EISNode
- [ ] LeaveComplianceNode
- [ ] TrainingComplianceNode
- [ ] EmploymentAuditNode
- [ ] CompetencyNode
- [ ] DisciplinaryNode

---

# PHASE 9 — ESG & SUSTAINABILITY

Folder:

```
nodes/esg
```

- [ ] CarbonEmissionNode
- [ ] EnergyNode
- [ ] WaterUsageNode
- [ ] WasteManagementNode
- [ ] ESGKPINode
- [ ] TCFDNode
- [ ] GRINode
- [ ] SustainabilityProjectNode
- [ ] Scope1Node
- [ ] Scope2Node
- [ ] Scope3Node

---

# PHASE 10 — GOVERNANCE & ABMS

Folder:

```
nodes/governance
```

- [ ] BoardMeetingNode
- [ ] BoardResolutionNode
- [ ] CommitteeNode
- [ ] PolicyNode
- [ ] ProcedureNode
- [ ] DelegationAuthorityNode
- [ ] GovernanceReviewNode

### Anti-Bribery

- [ ] ABMSNode
- [ ] GiftRegisterNode
- [ ] ConflictOfInterestNode
- [ ] ThirdPartyDueDiligenceNode
- [ ] IntegrityRiskNode
- [ ] WhistleblowingNode

---

# PHASE 11 — PRIVACY & CYBERSECURITY

Folder:

```
nodes/privacy
nodes/cybersecurity
```

## PDPA

- [ ] PDPARequirementNode
- [ ] ConsentNode
- [ ] DataInventoryNode
- [ ] PrivacyAssessmentNode
- [ ] DataBreachNode
- [ ] PrivacyAuditNode

## Cybersecurity

- [ ] AssetNode
- [ ] ThreatNode
- [ ] VulnerabilityNode
- [ ] SecurityControlNode
- [ ] CyberIncidentNode
- [ ] ISMSNode
- [ ] SecurityMonitoringNode
- [ ] SOCNode

---

# PHASE 12 — BUSINESS CONTINUITY

Folder:

```
nodes/business-continuity
```

- [ ] BusinessImpactAnalysisNode
- [ ] ContinuityPlanNode
- [ ] RecoveryPlanNode
- [ ] DisasterRecoveryNode
- [ ] CrisisManagementNode
- [ ] ResilienceNode

---

# PHASE 13 — LEGAL & JUDICIARY

Folder:

```
nodes/judiciary
```

- [ ] LegalCaseNode
- [ ] CourtTimelineNode
- [ ] LegalRiskNode
- [ ] ContractReviewNode
- [ ] LitigationNode
- [ ] RegulatoryInvestigationNode

---

# PHASE 14 — AI REGULATORY INTELLIGENCE

Folder:

```
nodes/ai
```

- [ ] ComplianceCopilotNode
- [ ] LawChangeDetectorNode
- [ ] GazetteParserNode
- [ ] PolicyInterpreterNode
- [ ] ComplianceImpactNode
- [ ] PredictiveRiskNode
- [ ] AuditReadinessNode
- [ ] AIRecommendationNode
- [ ] AIWorkflowGeneratorNode

---

# PHASE 15 — ANALYTICS & REPORTING

Folder:

```
nodes/analytics
```

- [ ] DashboardNode
- [ ] KPINode
- [ ] HeatmapNode
- [ ] TrendAnalysisNode
- [ ] ScorecardNode
- [ ] ExecutiveSummaryNode
- [ ] ReportGeneratorNode

---

# PHASE 16 — EDGE LIBRARY

Folder:

```
edges
```

## Regulatory Edges

- [ ] ComplianceFlowEdge
- [ ] AuditFlowEdge
- [ ] RiskFlowEdge
- [ ] CAPAFlowEdge
- [ ] CertificationFlowEdge
- [ ] ApprovalFlowEdge
- [ ] RegulatoryFlowEdge
- [ ] HalalFlowEdge
- [ ] TaxFlowEdge
- [ ] CyberFlowEdge
- [ ] ESGFlowEdge
- [ ] GovernanceFlowEdge

## Additional Enterprise Edges

- [ ] EscalationEdge
- [ ] DependencyEdge
- [ ] EvidenceEdge
- [ ] RiskLinkEdge
- [ ] ComplianceLinkEdge
- [ ] AuditTrailEdge
- [ ] AIRecommendationEdge

Target:
50+ Edge Types

---

# PHASE 17 — CONNECTION VALIDATION ENGINE

Folder:

```
validators
```

- [ ] ConnectionRegistry
- [ ] RuleEngine
- [ ] ComplianceValidator
- [ ] WorkflowValidator
- [ ] AuditValidator
- [ ] RiskValidator
- [ ] HalalValidator
- [ ] ESGValidator
- [ ] GovernanceValidator

### Rule Sets

- [ ] Audit Rules
- [ ] CAPA Rules
- [ ] Risk Rules
- [ ] Halal Rules
- [ ] Tax Rules
- [ ] Cyber Rules
- [ ] ISO Rules

---

# PHASE 18 — ENTERPRISE PALETTE

Folder:

```
palette
```

## Features

- [ ] Search
- [ ] Categories
- [ ] Favorites
- [ ] Recent Nodes
- [ ] Templates
- [ ] Drag and Drop
- [ ] Keyboard Navigation
- [ ] Node Preview
- [ ] AI Suggestions
- [ ] Regulatory Filters
- [ ] Standards Filters
- [ ] Agency Filters

---

# PHASE 19 — WORKFLOW TEMPLATES

Folder:

```
templates
```

## Initial Templates

- [ ] ISO 9001 QMS
- [ ] ISO 14001 EMS
- [ ] ISO 45001 OHSMS
- [ ] ISO 27001 ISMS
- [ ] ISO 37001 ABMS
- [ ] ISO 22301 BCMS
- [ ] ISO 22000 FSMS
- [ ] MS1500 Halal
- [ ] Internal Audit
- [ ] CAPA Workflow
- [ ] Enterprise Risk Assessment
- [ ] ESG Assessment
- [ ] E-Invoice Compliance
- [ ] Customs Import Approval
- [ ] Board Governance Review

---

# PHASE 20 — AI WORKFLOW COMPOSER

Folder:

```
engine/ai
```

- [ ] AI Node Recommendations
- [ ] Workflow Auto Generation
- [ ] Regulatory Mapping Engine
- [ ] Risk Prediction Engine
- [ ] Compliance Gap Detection
- [ ] Audit Readiness Scoring
- [ ] Smart Workflow Optimization

---

# FINAL ENTERPRISE TARGETS

## Node Count

- [ ] 250+ Nodes (MVP)
- [ ] 350+ Nodes (Enterprise)
- [ ] 500+ Nodes (Ultimate)

## Edge Count

- [ ] 50+ Edge Types

## Templates

- [ ] 100+ Workflow Templates

## Validators

- [ ] 1000+ Validation Rules

## Standards Coverage

- [ ] Malaysian Standards
- [ ] ISO Standards
- [ ] JAKIM
- [ ] DOSH
- [ ] NPRA
- [ ] Customs
- [ ] LHDN
- [ ] SSM
- [ ] PDPA
- [ ] ESG Frameworks

## Production Readiness

- [ ] Multi-Tenant Support
- [ ] RBAC
- [ ] Audit Trail
- [ ] Version Control
- [ ] Workflow Import/Export
- [ ] JSON Schema Support
- [ ] TypeScript Strict Mode
- [ ] Unit Tests
- [ ] Integration Tests
- [ ] Performance Benchmarks
- [ ] Documentation
- [ ] Storybook
- [ ] CI/CD Pipeline

