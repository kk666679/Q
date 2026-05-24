import { filings, regulatorySignals } from "../shared/mock-data";
export function connectSSMApi(companyNo: string) {
  const filingRisk = filings.some((f) => f.agency === "SSM" && f.status === "overdue");
  return { companyNo, connected: true, filingRisk, signals: regulatorySignals.filter((s) => s.agency === "SSM") };
}
