export function SocsoAgent(query: string) {
  return { agent: "socso-agent", query, summary: `{query}`, risk: "medium" as const, nextActions: ["collect evidence", "validate policy mapping", "prepare filing draft"] };
}
