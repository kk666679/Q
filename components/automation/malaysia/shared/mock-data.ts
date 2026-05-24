import type { FilingItem, RegulatorySignal } from "./types";
export const regulatorySignals: RegulatorySignal[] = [
  { id:"sig-1", agency:"JAKIM", title:"Halal ingredient disclosure circular", severity:"high", publishedAt:"2026-04-17", impact:"Supplier validation refresh required" },
  { id:"sig-2", agency:"LHDN", title:"e-Invoice schema revision", severity:"critical", publishedAt:"2026-04-25", impact:"Update payload mapping before next filing" },
  { id:"sig-3", agency:"NPRA", title:"GMP inspection protocol update", severity:"medium", publishedAt:"2026-05-04", impact:"Add batch traceability evidence" },
];
export const filings: FilingItem[] = [
  { id:"f-1", agency:"SSM", name:"Annual Return", dueDate:"2026-06-30", status:"draft", owner:"Corp Secretary" },
  { id:"f-2", agency:"LHDN", name:"e-Invoice Batch Submission", dueDate:"2026-05-30", status:"submitted", owner:"Finance Ops" },
  { id:"f-3", agency:"JAKIM", name:"Halal Certificate Renewal", dueDate:"2026-07-12", status:"overdue", owner:"Halal Lead" },
];
