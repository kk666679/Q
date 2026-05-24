export function LhdnAgent(query: string) {
  return { agent: "lhdn-agent", query, summary: `{query}`, risk: "medium" as const, nextActions: ["collect evidence", "validate policy mapping", "prepare filing draft"] };
}
