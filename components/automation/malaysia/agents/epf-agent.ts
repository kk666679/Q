export function EpfAgent(query: string) {
  return { agent: "epf-agent", query, summary: `{query}`, risk: "medium" as const, nextActions: ["collect evidence", "validate policy mapping", "prepare filing draft"] };
}
