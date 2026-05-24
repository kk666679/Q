export function JakimAgent(query: string) {
  return { agent: "jakim-agent", query, summary: `{query}`, risk: "medium" as const, nextActions: ["collect evidence", "validate policy mapping", "prepare filing draft"] };
}
