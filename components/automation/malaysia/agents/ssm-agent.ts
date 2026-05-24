export function SsmAgent(query: string) {
  return { agent: "ssm-agent", query, summary: `{query}`, risk: "medium" as const, nextActions: ["collect evidence", "validate policy mapping", "prepare filing draft"] };
}
