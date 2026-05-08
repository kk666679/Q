import { z } from 'zod';
import { AgentConfig, AgentRole } from '../types';

/**
 * Malaysian Standards Agent
 * Specialized agent for Malaysian Standards (MS) adoption of ISO, JSM compliance, and certification readiness.
 */
export const malaysianStandardsAgent: AgentConfig = {
  id: 'malaysian-standards-agent',
  role: AgentRole.QUALITY_MANAGER,
  name: 'Malaysian Standards Compliance Advisor',
  capabilities: [
    'Malaysian Standards (MS) adoption guidance',
    'Jabatan Standard Malaysia (JSM) compliance interpretation',
    'MS ISO 9001, 14001, 45001 and MS series alignment',
    'Certification readiness and audit preparation',
    'Risk-based thinking for Malaysia-specific obligations',
    'Clause mapping between ISO and MS versions',
  ],
  systemPrompt: `You are a Malaysian Standards compliance advisor with deep expertise in Malaysian Standards (MS) adopted from ISO, Department of Standards Malaysia (JSM) practice notes, and certification readiness. 

Your responses should be accurate, jurisdiction-aware, and oriented toward practical implementation, audit readiness, and continuous improvement. 

Your focus includes:
- Malaysian Standards as identical ISO adoptions and local MS-specific amendments
- Certification considerations for accredited Malaysian certification bodies
- Management system alignment with MS ISO 9001, MS ISO 14001, MS ISO 45001, MS ISO 27001, and MS 30400-series
- Environmental, health and safety, and sustainability requirements under Malaysian context
- Documented evidence, records, and gap remediation for audits

Provide clear guidance on applying Malaysian standards in operational systems, audit checklists, and compliance documentation.`,
  tools: [
    {
      name: 'generate_malaysian_standard_checklist',
      description: 'Generate a compliance checklist for a Malaysian Standard or MS-adopted ISO standard.',
      parameters: z.object({
        standard: z.string(),
        scope: z.string(),
        clauses: z.array(z.string()).optional(),
      }),
      execute: async (params: { standard: string; scope: string; clauses?: string[] }) => {
        return {
          standard: params.standard,
          scope: params.scope,
          checklist: (params.clauses || [
            'Context of the organization',
            'Leadership and commitment',
            'Planning and risk-based thinking',
            'Support and documented information',
            'Operational controls',
            'Performance evaluation',
            'Improvement and corrective actions',
          ]).map((clause: string) => ({
            clause,
            question: `Is ${clause.toLowerCase()} defined, documented, and implemented for ${params.standard}?`,
            evidenceRequired: `Records, procedures, and audit trails showing ${clause.toLowerCase()} for ${params.scope}`,
          })),
        };
      },
    },
    {
      name: 'summarize_malaysian_standard',
      description: 'Summarize the key scope, requirements, and certification notes for a Malaysian Standard.',
      parameters: z.object({
        standard: z.string(),
      }),
      execute: async (params: { standard: string }) => {
        return {
          standard: params.standard,
          summary: `Provide a concise summary for ${params.standard}, focusing on its scope as an MS standard, the main management system requirements, and any Malaysia-specific certification or JSM considerations.`,
          keyPoints: [
            'Scope and applicability within Malaysian industry',
            'Core management system clauses and controls',
            'JSM adoption status and equivalence to ISO',
            'Typical audit focus areas and documentation expectations',
            'Local certification notes for Malaysian accredited bodies',
          ],
        };
      },
    },
  ],
};
