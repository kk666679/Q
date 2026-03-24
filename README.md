# QMS - Quality Management System Platform

**AI‑powered Integrated Management System with Multi-Agent Intelligence**

A comprehensive Quality Management System platform featuring specialized AI agents for ISO 9001, ISO 14001, ISO 45001, ISO 17025, ISO 27001, and industry-specific expertise (Manufacturing, Construction, Insurance). Built with Next.js 16, tRPC, React 19, and AI SDK.

---

## ✨ Features

| Capability | Description |
|------------|-------------|
| **Multi-Agent AI System** | 10+ specialized agents (Quality Manager, QA Expert, Manufacturing, Construction, Insurance, ISO specialists) |
| **ISO Knowledge Base** | Pre-loaded clauses for ISO 9001, 14001, 45001, 17025, 17020, 27001 |
| **Conversational AI** | Natural language chat with specialized agents via multi-agent interface |
| **Compliance Checking** | Real-time ISO compliance assessment with scoring and gap analysis |
| **Audit Automation** | Generate audit checklists, conduct internal audits, track findings |
| **Climate Risk Engine** | ISO 14001 AMD.1:2024 climate change adaptation and risk assessment |
| **Process Flow Designer** | Visual workflow and process mapping with xyflow |
| **Document Management** | Document control, version management, and builder |
| **Type-Safe APIs** | Full tRPC integration with React Query |
| **Modern UI** | Radix UI components with Tailwind CSS and Framer Motion |

---

## 🏗️ Architecture

The QMS platform uses a modular architecture with Next.js App Router, tRPC for type-safe APIs, and a multi-agent AI system:

```mermaid
flowchart TB
    subgraph Frontend
        A[React Components] --> B[tRPC React Hooks]
        C[Multi‑Agent Chat UI] --> D[useAgent hook]
    end

    subgraph "Next.js API Layer"
        E[tRPC HTTP Handler<br/>/api/trpc] --> F[Routers<br/>agent, audit, compliance, ...]
    end

    subgraph "QMS SDK"
        G[Agent Registry] --> H[AI Agents<br/>iso9001, iso14001, qa-expert, ...]
        F --> I[Core Services]
    end

    subgraph "Core Services"
        I --> J[Knowledge Base]
        I --> K[Climate Risk Engine]
        I --> L[Risk Engine]
        I --> M[Malaysian Standards]
    end

    subgraph "External Services"
        N[OpenAI GPT-4] --> H
        O[Pinecone Vector DB] --> J
    end

    D --> H
    B --> F
```

---

## 📁 Project Structure

```
qms/
├── app/                           # Next.js 16 App Router
│   ├── agents/                    # Multi-agent chat interface
│   ├── compliance/                # ISO compliance checking
│   ├── documents/                 # Document management
│   ├── flow-process/              # Process flow designer
│   ├── generator/                 # QMS document generator
│   ├── processes/                 # Process management
│   ├── projects/                  # Project tracking
│   └── api/trpc/[trpc]/          # tRPC API handler
├── components/
│   ├── ai/                        # AI-powered components
│   ├── ai-elements/               # Reusable AI UI elements
│   ├── automation/                # Workflow automation (xyflow)
│   ├── dashboard/                 # Dashboard widgets
│   ├── qms/                       # QMS-specific components
│   │   ├── multi-agent-chat.tsx
│   │   ├── ISOComplianceChecker.tsx
│   │   ├── processflow_designer.tsx
│   │   └── ...
│   └── ui/                        # Radix UI components
├── sdk/
│   ├── agents/                    # AI agent definitions
│   │   ├── iso9001-agent.ts
│   │   ├── iso14001-agent.ts
│   │   ├── iso45001-agent.ts
│   │   ├── quality-manager.ts
│   │   ├── qa-expert.ts
│   │   ├── manufacturing-expert.ts
│   │   ├── construction-expert.ts
│   │   ├── insurance-expert.ts
│   │   └── ims-integrator-agent.ts
│   ├── knowledge-base/            # ISO clause databases
│   │   ├── iso9001-clauses.json
│   │   ├── iso14001-clauses.json
│   │   ├── iso45001-clauses.json
│   │   ├── iso17025:2017-clauses.json
│   │   ├── iso17020-clauses.json
│   │   └── iso27001-clauses.json
│   ├── services/
│   │   ├── climate-risk-engine.ts
│   │   ├── risk-engine.ts
│   │   └── malaysian-standards.ts
│   ├── server/                    # tRPC routers
│   │   ├── router.ts
│   │   ├── ms-router.ts
│   │   ├── manufacturing-router.ts
│   │   ├── construction-router.ts
│   │   ├── insurance-router.ts
│   │   └── testing-router.ts
│   ├── client/                    # tRPC client & hooks
│   │   ├── trpc.ts
│   │   ├── hooks.ts
│   │   └── provider.tsx
│   ├── core/
│   │   ├── registry.ts            # Agent registry
│   │   ├── orchestrator.ts
│   │   └── vector-service.ts
│   └── prisma/
│       └── schema.prisma          # Database schema
├── lib/
│   ├── types.ts
│   ├── utils.ts
│   └── mock-data.ts
└── public/                        # Static assets
```

---

## 🧩 Architecture

### Multi-Agent System
Agents are defined in `sdk/agents/` with specialized capabilities:

```ts
// sdk/agents/iso9001-agent.ts
export const iso9001Agent: AgentConfig = {
  id: 'iso9001-agent',
  role: AgentRole.QUALITY_MANAGER,
  name: 'ISO 9001 Quality Manager',
  capabilities: [
    'ISO 9001:2015 QMS Implementation',
    'Quality Policy & Objectives',
    'Risk-Based Thinking',
    'Internal Audit Facilitation',
    // ...
  ],
  tools: [
    { name: 'assess_qms_compliance', /* ... */ },
    { name: 'generate_audit_checklist', /* ... */ },
    { name: 'conduct_risk_assessment', /* ... */ },
  ],
};
```

Agents are registered in `sdk/core/registry.ts` and accessible via the multi-agent chat UI.

### tRPC API Layer
Type-safe APIs with full TypeScript inference:

```ts
// sdk/server/router.ts
export const appRouter = router({
  agent: agentRouter,
  document: documentRouter,
  process: processRouter,
  compliance: complianceRouter,
  audit: auditRouter,
  testing: testingRouter,
  manufacturing: manufacturingRouter,
  construction: constructionRouter,
  insurance: insuranceRouter,
  ms: msRouter,
});
```

### React Hooks
Client-side hooks with React Query integration:

```tsx
import { trpc } from '@/sdk/client/trpc';
import { useAgent, useAgentList } from '@/sdk/client/hooks';

function MyComponent() {
  const { data: agents } = useAgentList();
  const { agent, messages, sendMessage } = useAgent('iso9001-agent');
  const mutation = trpc.audit.generateChecklist.useMutation();
}
```

### UI Components
Reusable components built with Radix UI and Tailwind CSS:
- `<MultiAgentChat />` - Multi-agent conversation interface
- `<ISOComplianceChecker />` - ISO compliance assessment
- `<ProcessFlowDesigner />` - Visual process mapping
- `<DocumentBuilder />` - Document creation and management

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm, pnpm, or yarn
- OpenAI API key (for AI agents)
- Pinecone API key (optional, for vector search)
- PostgreSQL database (optional, for Prisma)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/qms.git
   cd qms
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set environment variables**
   Create `.env.local`:
   ```env
   OPENAI_API_KEY=sk-...
   PINECONE_API_KEY=your-key
   PINECONE_INDEX_NAME=qms-compliance
   DATABASE_URL=postgresql://...
   ```

4. **Setup database** (optional)
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`

---

## 💬 Usage Examples

### Multi-Agent Chat

Navigate to `/agents` to access the multi-agent interface:

```tsx
import { MultiAgentChat } from '@/components/qms/multi-agent-chat';

export default function AgentsPage() {
  return <MultiAgentChat />;
}
```

Select an agent (ISO 9001, QA Expert, Manufacturing, etc.) and chat:
- "Generate an audit checklist for ISO 9001 clause 8"
- "Assess our QMS compliance status"
- "What are the requirements for management review?"

### ISO Compliance Checking

```tsx
import { ISOComplianceChecker } from '@/components/qms/ISOComplianceChecker';

function CompliancePage() {
  return (
    <ISOComplianceChecker
      onCheckCompliance={() => console.log('Checking...')}
    />
  );
}
```

### Using Agent Tools

```tsx
import { useAgent } from '@/sdk/client/hooks';

function AuditGenerator() {
  const { agent, sendMessage } = useAgent('iso9001-agent');
  
  const generateChecklist = async () => {
    await sendMessage('Generate audit checklist for clause 9.2');
  };
}
```

### Climate Risk Assessment

```tsx
import { climateRiskEngine } from '@/sdk/services/climate-risk-engine';

const risk = climateRiskEngine.addRisk('CH-001', {
  likelihood: 'likely',
  severity: 'high',
  owner: 'Environmental Manager',
});

const summary = climateRiskEngine.getRiskSummary();
const plan = climateRiskEngine.generateClimateAdaptationPlan();
```

---

## 🔌 tRPC API Reference

All endpoints are fully type-safe:

### Agent Operations
| Procedure | Input | Output |
|-----------|-------|--------|
| `agent.list` | - | `Agent[]` |
| `agent.get` | `{ id: string }` | `Agent` |
| `agent.chat` | `{ agentId, message, sessionId? }` | `{ userMessage, agentResponse }` |
| `agent.executeTool` | `{ agentId, toolId, parameters }` | `{ executionId, result }` |

### Document Management
| Procedure | Input | Output |
|-----------|-------|--------|
| `document.list` | `{ type?, status?, tags? }` | `Document[]` |
| `document.create` | `{ title, content, type, version, status, tags }` | `Document` |
| `document.update` | `{ id, data }` | `Document` |
| `document.validate` | `{ id }` | `{ valid, issues }` |

### Compliance & Audit
| Procedure | Input | Output |
|-----------|-------|--------|
| `compliance.check` | `{ standard, requirements }` | `ComplianceResult[]` |
| `compliance.getReport` | `{ standard }` | `ComplianceReport` |
| `audit.generateChecklist` | `{ auditType, scope }` | `AuditChecklist` |
| `audit.create` | `{ ... }` | `Audit` |

### Industry-Specific
| Procedure | Input | Output |
|-----------|-------|--------|
| `manufacturing.recordMetrics` | `{ availability, performance, quality, ... }` | `Metrics` |
| `manufacturing.getOEE` | `{ startDate, endDate }` | `OEE` |
| `construction.createProject` | `{ name, description, budget, ... }` | `Project` |
| `insurance.generateQuote` | `{ policyType, coverage, riskFactors }` | `Quote` |

---

## 🤖 Available AI Agents

### ISO Standards Agents
- **ISO 9001 Agent** - Quality Management Systems
- **ISO 14001 Agent** - Environmental Management + Climate Risk (AMD.1:2024)
- **ISO 45001 Agent** - Occupational Health & Safety
- **IMS Integrator** - Integrated Management Systems

### Industry Experts
- **Quality Manager** - ISO 13485, QMS implementation
- **QA Expert** - Test strategy, quality processes
- **Manufacturing Expert** - MES, Industry 4.0, OEE
- **Construction Expert** - Project management, BIM, safety
- **Insurance Expert** - Underwriting, claims, actuarial
- **Documentation Manager** - Document control, regulatory

Each agent has specialized tools and knowledge for their domain.

---

## 📦 Tech Stack

| Technology | Purpose |
|-----------|----------|
| **Next.js 16** | React framework with App Router |
| **React 19** | UI library |
| **TypeScript 5.9** | Type safety |
| **tRPC 11** | Type-safe APIs |
| **AI SDK** | AI agent framework (Vercel AI SDK) |
| **Radix UI** | Accessible component primitives |
| **Tailwind CSS 4** | Utility-first styling |
| **Framer Motion** | Animations |
| **xyflow** | Process flow diagrams |
| **Recharts** | Data visualization |
| **Zod** | Schema validation |
| **Prisma** | Database ORM |
| **Pinecone** | Vector database (optional) |
| **React Query** | Data fetching & caching |

---

## 🗺️ Roadmap

- [ ] Vector database integration for RAG-based compliance
- [ ] Real-time collaboration on documents
- [ ] Advanced analytics and reporting dashboards
- [ ] Mobile app for audits and inspections
- [ ] Integration with external QMS platforms
- [ ] Multi-language support for ISO clauses
- [ ] AI-powered document generation
- [ ] Automated compliance monitoring
- [ ] ESG reporting (GRI, SASB)
- [ ] Supplier quality management portal

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Guidelines
- Add new agents in `sdk/agents/`
- Create tRPC routers in `sdk/server/`
- Build UI components in `components/`
- Follow existing code patterns
- Add TypeScript types
- Test your changes

---

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For questions or issues:
- Open an issue on GitHub
- Check the [SDK documentation](./sdk/README.md)
- Review the [architecture guide](./sdk/ARCHITECTURE.md)

---

**Built with ❤️ for Quality Management professionals**
