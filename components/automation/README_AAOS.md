# AAOS Automation Layer

Version: 0.2.0

AAOS (Automation & Orchestration Service) is the automation layer used by the QMS platform to implement workflow automation, process orchestration, and runtime execution of xyflow process graphs.

Table of contents
- Overview
- Concepts
- Architecture (mermaid diagrams)
- Runtime flow
- Node types
- Developer setup
- Examples
- Extending AAOS
- Troubleshooting & Notes

Overview
AAOS provides a lightweight orchestration runtime and a set of reusable automation building blocks for QMS processes: triggers, task nodes, human-review nodes, agent integrations, and external connectors (databases, vector search, webhooks). It is implemented as React components for the designer UI and server-side tRPC helpers for runtime execution.

Key goals
- Declarative process graphs compatible with xyflow visual designer
- Secure, auditable execution of automation steps
- Tight integration with the multi-agent system and tRPC APIs
- Pluggable node types for easy extension

Concepts
- Process graph: A directed graph of nodes and edges that defines an automation workflow.
- Node: A step in the process. Can be a trigger, task, agent call, human approval, or service connector.
- Instance: A running execution of a process graph with persisted state.
- Orchestrator: The runtime that advances node states based on events and outcomes.

Architecture
High-level automation architecture showing integration points:

```mermaid
flowchart LR

    subgraph Frontend
        UI["Process Designer (xyflow)"] -->|Saves JSON| Repo["Process Store"]
        UI -->|Start| OrchestratorClient["Orchestrator Client"]
    end

    subgraph Backend
        OrchestratorServer["Orchestrator Service"]
        OrchestratorServer --> TRPC["tRPC Routers"]
        OrchestratorServer --> DB[("Postgres / Prisma")]
        TRPC --> SDK["QMS SDK Services"]
        SDK --> Agents["AI Agents (Ollama/OpenAI/Anthropic)"]
        SDK --> Vector["Pinecone / Vector DB"]
        SDK --> External["External Services / Webhooks"]
    end

    UI -->|calls| TRPC
    OrchestratorClient --> OrchestratorServer
    Repo --> OrchestratorServer
    Agents -->|responses| OrchestratorServer
    External -->|events| OrchestratorServer
```

Runtime flow
This sequence shows how a process instance is started and executed:

```mermaid
sequenceDiagram
		participant User
		participant UI
		participant TRPC
		participant Orchestrator
		participant Agent
		participant DB

		User->>UI: Start process
		UI->>TRPC: createInstance(processId, inputs)
		TRPC->>DB: persist instance
		TRPC->>Orchestrator: enqueue(instanceId)
		Orchestrator->>DB: lock instance
		Orchestrator->>Agent: execute task node (call AI)
		Agent-->>Orchestrator: result
		Orchestrator->>DB: save node result
		Orchestrator->>TRPC: emit events (ui updates)
		Orchestrator->>Orchestrator: advance to next node
```

Node types
- Trigger nodes: time-based, webhook, or manual start.
- Task nodes: synchronous tasks implemented as tRPC calls or local functions.
- Agent nodes: calls to AI agents via SDK (OpenAI, Ollama, Anthropic). Support sync and async modes.
- Human-review nodes: pause execution and notify reviewers via UI or email; resume on approval.
- Connector nodes: integrations for DB reads/writes, Pinecone vector search, external APIs and webhooks.

Developer setup
- Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

- Database (optional, for persistence and Prisma):

```bash
npx prisma generate
npx prisma db push
```

- Environment variables (examples):

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/qms
OPENAI_API_KEY=sk-...
OLLAMA_API_KEY=...
PINECONE_API_KEY=...
```

Examples
- Start a simple process that calls an AI agent to draft an audit checklist. Example process JSON (simplified):

```json
{
	"id": "draft-audit-checklist",
	"nodes": [
		{ "id": "start", "type": "trigger", "next": "ai-draft" },
		{ "id": "ai-draft", "type": "agent", "agentId": "iso9001-agent", "tool": "generate_audit_checklist", "next": "review" },
		{ "id": "review", "type": "human-review", "next": "complete" },
		{ "id": "complete", "type": "end" }
	]
}
```

Extending AAOS
- Add a new node type:
	1. Implement a React component for the designer (components/automation/nodes).
	2. Add runtime handler in `sdk/server` (tRPC route) to perform execution logic.
	3. Register the node in the node registry used by the Orchestrator.

- Add new agent/tool integrations by extending `sdk/core/orchestrator.ts` and the `sdk/services` helpers.

Testing and debugging
- Use the Process Designer to validate graphs visually before running them.
- Check tRPC logs and `sdk/server` routers for runtime errors.
- For replayable runs, persist inputs and node outputs in the database.

Troubleshooting & Notes
- Long-running tasks should be written as idempotent operations and persisted state checkpoints must be used to avoid duplicate side effects.
- For production, run the Orchestrator as a background worker (separate process) and protect database locks with retries.

Contributing
- Follow the repository `CONTRIBUTING` guidelines. Create a branch per feature and open a PR describing the automation node behavior and any required schema changes.

License
- See the project root `LICENSE` for licensing details.

AAOS (Automation & Orchestration Service) is the automation layer used by the QMS platform to implement workflow automation, process orchestration, and runtime execution of xyflow process graphs.

Location
- Primary components live under `components/automation` and the App routes that consume them are under `app/flow-process`.

Overview
- Provides reusable building blocks for process steps, triggers, and connectors to agents and external services (OpenAI, Ollama, Pinecone, databases).
- Integrates with xyflow for visual process design and runtime execution.

Developer Setup
- Ensure repository dependencies are installed (`npm install` or `pnpm install`).
- Start development server: `npm run dev` (Next.js App Router will serve the automation UIs).
- If using the Prisma-backed features, run `npx prisma generate` and `npx prisma db push` after configuring `DATABASE_URL`.

Usage
- Open the Process Designer at `/flow-process` to view and edit automation graphs.
- Use the multi-agent tools in `app/agents` to route tasks to AI agents from automation steps.

Notes
- Automation nodes may call tRPC routes in `sdk/server` — check `sdk/server` routers for available tools and operations.
- For long-running or background jobs, integrate with your preferred job queue and persist process state in the database.

Contact
- For questions about AAOS design or extending automation nodes, see the `components/automation` source files or open an issue in the repo.
