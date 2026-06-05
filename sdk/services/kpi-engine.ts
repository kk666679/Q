/**
 * KPI Calculation Engine — auto-calculates enterprise quality KPIs.
 * All calculations are pure functions operating on snapshot data.
 */

export interface KPISnapshot {
  // Compliance
  totalClauses: number;
  compliantClauses: number;
  // Audit
  auditsPlanned: number;
  auditsCompleted: number;
  // CAPA
  capaTotal: number;
  capaClosed: number;
  capaOverdue: number;
  // Risk
  totalRisks: number;
  highRisks: number;
  // Training
  totalTrainings: number;
  completedTrainings: number;
  // Supplier
  totalSuppliers: number;
  approvedSuppliers: number;
  // Documents
  totalDocuments: number;
  approvedDocuments: number;
}

export interface KPIResult {
  id: string;
  name: string;
  category: string;
  value: number;
  target: number;
  unit: string;
  status: 'on-track' | 'at-risk' | 'breached';
  trend: 'up' | 'down' | 'stable';
}

function status(value: number, target: number, lowerIsBetter = false): KPIResult['status'] {
  const ratio = lowerIsBetter ? target / Math.max(value, 0.01) : value / Math.max(target, 0.01);
  if (ratio >= 0.9) return 'on-track';
  if (ratio >= 0.7) return 'at-risk';
  return 'breached';
}

export function calculateKPIs(snap: KPISnapshot): KPIResult[] {
  const complianceRate  = snap.totalClauses > 0 ? (snap.compliantClauses / snap.totalClauses) * 100 : 0;
  const auditCompletion = snap.auditsPlanned > 0 ? (snap.auditsCompleted / snap.auditsPlanned) * 100 : 0;
  const capaClosureRate = snap.capaTotal > 0 ? (snap.capaClosed / snap.capaTotal) * 100 : 0;
  const riskExposure    = snap.totalRisks > 0 ? (snap.highRisks / snap.totalRisks) * 100 : 0;
  const trainingCompl   = snap.totalTrainings > 0 ? (snap.completedTrainings / snap.totalTrainings) * 100 : 0;
  const supplierApproval = snap.totalSuppliers > 0 ? (snap.approvedSuppliers / snap.totalSuppliers) * 100 : 0;
  const docApprovalRate  = snap.totalDocuments > 0 ? (snap.approvedDocuments / snap.totalDocuments) * 100 : 0;

  return [
    { id: 'compliance-rate',   name: 'ISO Compliance Rate',      category: 'compliance', value: +complianceRate.toFixed(1),  target: 90,  unit: '%',     status: status(complianceRate,  90),  trend: 'up'   },
    { id: 'audit-completion',  name: 'Audit Completion Rate',    category: 'audit',      value: +auditCompletion.toFixed(1), target: 100, unit: '%',     status: status(auditCompletion, 100), trend: 'stable' },
    { id: 'capa-closure',      name: 'CAPA Closure Rate',        category: 'capa',       value: +capaClosureRate.toFixed(1), target: 85,  unit: '%',     status: status(capaClosureRate, 85),  trend: 'up'   },
    { id: 'capa-overdue',      name: 'Overdue CAPAs',            category: 'capa',       value: snap.capaOverdue,            target: 0,   unit: 'count', status: status(snap.capaOverdue, 0, true), trend: 'stable' },
    { id: 'risk-exposure',     name: 'High Risk Exposure',       category: 'risk',       value: +riskExposure.toFixed(1),    target: 10,  unit: '%',     status: status(riskExposure,    10, true), trend: 'down' },
    { id: 'training-compl',    name: 'Training Completion',      category: 'training',   value: +trainingCompl.toFixed(1),   target: 95,  unit: '%',     status: status(trainingCompl,   95),  trend: 'up'   },
    { id: 'supplier-approval', name: 'Approved Supplier Rate',   category: 'supplier',   value: +supplierApproval.toFixed(1),target: 100, unit: '%',     status: status(supplierApproval,100), trend: 'stable' },
    { id: 'doc-approval',      name: 'Document Approval Rate',   category: 'document',   value: +docApprovalRate.toFixed(1), target: 80,  unit: '%',     status: status(docApprovalRate, 80),  trend: 'up'   },
  ];
}

/** Default snapshot used when no DB is available (dev/demo mode) */
export const defaultSnapshot: KPISnapshot = {
  totalClauses: 28, compliantClauses: 24,
  auditsPlanned: 12, auditsCompleted: 9,
  capaTotal: 18, capaClosed: 14, capaOverdue: 2,
  totalRisks: 32, highRisks: 4,
  totalTrainings: 45, completedTrainings: 38,
  totalSuppliers: 22, approvedSuppliers: 19,
  totalDocuments: 47, approvedDocuments: 31,
};
