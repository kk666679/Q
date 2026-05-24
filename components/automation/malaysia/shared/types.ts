export type MalaysiaAgency = "SSM"|"LHDN"|"JAKIM"|"CUSTOMS"|"DOSH"|"EPF"|"SOCSO"|"NPRA"|"BURSA"|"JUDICIARY";
export type ComplianceLevel = "low"|"medium"|"high"|"critical";
export interface RegulatorySignal { id:string; agency:MalaysiaAgency; title:string; severity:ComplianceLevel; publishedAt:string; impact:string; }
export interface FilingItem { id:string; agency:MalaysiaAgency; name:string; dueDate:string; status:"draft"|"submitted"|"overdue"; owner:string; }
