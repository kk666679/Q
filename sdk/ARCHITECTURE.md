# QMS SDK Architecture

# 🏗️ Overview

The QMS SDK is built with a modular, scalable architecture that supports multi-agent AI systems, real-time collaboration, and comprehensive quality management workflows. The design separates concerns across four primary layers—Frontend, SDK, API, and Data—ensuring maintainability and clear boundaries.

# 📊 High‑Level Architecture

```mermaid
flowchart TB
    subgraph Frontend["Frontend Layer"]
        React["React Components"]
        Next["Next.js App Router"]
        Framer["Framer Motion"]
    end

    subgraph SDK["SDK Layer"]
        Hooks["Client Hooks & Provider"]
        Core["Core Orchestrator & Registry"]
        Components["Component Library"]
    end

    subgraph API["API Layer"]
        tRPC["tRPC Router"]
        Agents["Agent System"]
        Vector["Vector Service"]
    end

    subgraph Data["Data Layer"]
        PostgreSQL[("PostgreSQL")]
        Pinecone[("Pinecone Vector DB")]
        Prisma["Prisma ORM"]
    end

    Frontend --> SDK
    SDK --> API
    API --> Data
```

---

# 🧩 Core Components

1. Multi‑Agent System

The agent system is the brain of the QMS SDK. It consists of a central Agent Registry that manages all available agents and an Agent Orchestrator that routes messages, executes tool chains, and manages conversations.

```typescript
// Agent Registry - Central agent management
class AgentRegistry {
  private agents: Map<string, Agent>
  
  register(agent: Agent): void
  get(agentId: string): Agent | undefined
  getByType(type: string): Agent[]
  getActive(): Agent[]
}

// Agent Orchestrator - Coordination and routing
class AgentOrchestrator {
  routeMessage(message: Message, targetAgents?: string[]): Promise<Message[]>
  executeToolChain(agentId: string, tools: string[]): Promise<ToolExecution[]>
  startConversation(conversationId: string, agentIds: string[]): void
}
```

Class Diagram

```mermaid
classDiagram
    class AgentRegistry {
        -Map agents
        +register(agent)
        +get(agentId)
        +getByType(type)
        +getActive()
    }

    class AgentOrchestrator {
        +routeMessage(message, targetAgents)
        +executeToolChain(agentId, tools)
        +startConversation(conversationId, agentIds)
    }

    class VectorService {
        +upsertDocument(document)
        +searchSimilar(query, topK)
        +checkCompliance(requirement, documents)
    }

    AgentOrchestrator --> AgentRegistry : uses
    AgentOrchestrator --> VectorService : uses for RAG/compliance
```

---

2. Vector Database Integration

The vector service provides semantic search, similarity matching, and automated compliance checking by leveraging Pinecone.

```typescript
// Vector Service - RAG and compliance checking
class VectorService {
  upsertDocument(document: VectorDocument): Promise<void>
  searchSimilar(query: number[], topK: number): Promise<SearchResult[]>
  checkCompliance(requirement: string, documents: string[]): Promise<ComplianceResult>
}
```

---

3. tRPC API Layer

All server functionality is exposed through a type‑safe tRPC router, with dedicated sub‑routers for each domain.

```typescript
// Comprehensive API with type safety
export const appRouter = router({
  agent: agentRouter,           // Agent operations
  document: documentRouter,     // Document management
  process: processRouter,       // Process mapping
  compliance: complianceRouter, // Compliance checking
  audit: auditRouter,          // Audit management
  testing: testingRouter,      // QA testing
  manufacturing: manufacturingRouter, // Manufacturing metrics
  construction: constructionRouter,   // Construction management
  insurance: insuranceRouter,         // Insurance operations
});
```

API Router Structure

```mermaid
flowchart LR
    AppRouter[appRouter] --> agent[agentRouter]
    AppRouter --> document[documentRouter]
    AppRouter --> process[processRouter]
    AppRouter --> compliance[complianceRouter]
    AppRouter --> audit[auditRouter]
    AppRouter --> testing[testingRouter]
    AppRouter --> manufacturing[manufacturingRouter]
    AppRouter --> construction[constructionRouter]
    AppRouter --> insurance[insuranceRouter]
```

---

# 🔄 Data Flows

1. Agent Communication Flow

```mermaid
sequenceDiagram
    participant User
    participant tRPCClient
    participant AgentRouter
    participant AgentOrchestrator
    participant AgentRegistry
    participant SpecificAgent
    participant VectorService
    participant Pinecone

    User->>tRPCClient: Send message
    tRPCClient->>AgentRouter: Route message
    AgentRouter->>AgentOrchestrator: routeMessage()
    AgentOrchestrator->>AgentRegistry: Get target agent(s)
    AgentRegistry-->>AgentOrchestrator: Agent instance
    AgentOrchestrator->>SpecificAgent: Execute agent logic
    SpecificAgent->>VectorService: Search similar / compliance check
    VectorService->>Pinecone: Query vector DB
    Pinecone-->>VectorService: Results
    VectorService-->>SpecificAgent: Compliance result
    SpecificAgent-->>AgentOrchestrator: Response
    AgentOrchestrator-->>tRPCClient: Final response
    tRPCClient-->>User: UI update
```

2. Document Processing Flow

```mermaid
sequenceDiagram
    participant User
    participant DocumentRouter
    participant PrismaORM
    participant PostgreSQL
    participant VectorService
    participant Pinecone

    User->>DocumentRouter: Upload document
    DocumentRouter->>PrismaORM: Create document record
    PrismaORM->>PostgreSQL: Store metadata
    DocumentRouter->>VectorService: upsertDocument()
    VectorService->>Pinecone: Generate embedding & upsert
    Pinecone-->>VectorService: Acknowledge
    VectorService-->>DocumentRouter: Success
    DocumentRouter-->>User: Upload complete
```

3. Process Design Flow (xyflow)

```mermaid
sequenceDiagram
    participant User
    participant ProcessDesigner as xyflow Designer
    participant ProcessRouter
    participant ValidationEngine
    participant PostgreSQL

    User->>ProcessDesigner: Drag & drop nodes, create edges
    ProcessDesigner->>ProcessRouter: Auto‑save draft (debounced)
    ProcessRouter->>ValidationEngine: Validate DAG (no cycles, complete I/O)
    ValidationEngine-->>ProcessRouter: Validation result
    alt valid
        ProcessRouter->>PostgreSQL: Store process definition
        PostgreSQL-->>ProcessRouter: Acknowledge
        ProcessRouter-->>User: Visual feedback (green border)
    else invalid
        ProcessRouter-->>User: Highlight errors (red border + tooltip)
    end
```

---

# 🎯 Design Patterns

1. Repository Pattern

Abstraction for data access, allowing the domain logic to remain independent of the persistence mechanism.

```mermaid
classDiagram
    class DocumentRepository {
        <<interface>>
        +create(document)
        +findById(id)
        +findByType(type)
        +update(id, data)
        +delete(id)
    }
    class PrismaDocumentRepository {
        +create(document)
        +findById(id)
        +findByType(type)
        +update(id, data)
        +delete(id)
    }
    DocumentRepository <|.. PrismaDocumentRepository
```

```typescript
// Data access abstraction
interface DocumentRepository {
  create(document: Document): Promise<Document>
  findById(id: string): Promise<Document | null>
  findByType(type: string): Promise<Document[]>
  update(id: string, data: Partial<Document>): Promise<Document>
  delete(id: string): Promise<void>
}
```

2. Observer Pattern

Event‑driven communication that allows decoupled components to react to state changes.

```mermaid
classDiagram
    class EventEmitter {
        -Map listeners
        +on(event, callback)
        +emit(event, data)
        +off(event, callback)
    }
    class Listener {
        <<function>>
    }
    EventEmitter --> Listener : manages
```

```typescript
// Event-driven architecture
class EventEmitter {
  private listeners: Map<string, Function[]>
  
  on(event: string, callback: Function): void
  emit(event: string, data: any): void
  off(event: string, callback: Function): void
}
```

3. Strategy Pattern

Enables pluggable compliance strategies for different regulatory standards.

```mermaid
classDiagram
    class ComplianceStrategy {
        <<interface>>
        +check(requirement, documents)
    }
    class ISO13485Strategy {
        +check(requirement, documents)
    }
    class FDA21CFRStrategy {
        +check(requirement, documents)
    }
    ComplianceStrategy <|.. ISO13485Strategy
    ComplianceStrategy <|.. FDA21CFRStrategy
```

```typescript
// Pluggable compliance strategies
interface ComplianceStrategy {
  check(requirement: string, documents: Document[]): Promise<ComplianceResult>
}

class ISO13485Strategy implements ComplianceStrategy {
  async check(requirement: string, documents: Document[]): Promise<ComplianceResult> {
    // ISO 13485 specific logic
  }
}
```

---

# 🔐 Security Architecture

Security is enforced through authentication, authorization, input validation, and rate limiting.

```mermaid
flowchart LR
    subgraph Auth["Authentication & Authorization"]
        User[User] --> Login[Login]
        Login --> JWT[JWT Issued]
        JWT --> RBAC[Role‑Based Access Control]
        RBAC --> Permissions[Permissions Check]
    end

    subgraph Validation["Data Validation"]
        Input[API Input] --> Zod[Zod Schema Validation]
        Zod --> Sanitized[Sanitized Data]
    end

    subgraph RateLimit["Rate Limiting"]
        Requests[Requests per IP] --> Limit[Rate Limiter]
        Limit --> |Exceeded| Block[Block]
        Limit --> |Allowed| Process[Process]
    end

    Permissions --> Validation
    Validation --> RateLimit
```

1. Authentication & Authorization

```typescript
// Role-based access control
interface User {
  id: string
  roles: Role[]
  permissions: Permission[]
}

interface Role {
  id: string
  name: string
  permissions: Permission[]
}
```

2. Data Validation

```typescript
// Zod schema validation at API boundaries
const DocumentSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  type: z.enum(['procedure', 'policy', 'form']),
  // ... other fields
});
```

3. Rate Limiting

```typescript
// API rate limiting
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
```

---

# 📈 Scalability Considerations

1. Horizontal Scaling

```mermaid
flowchart TD
    Client[Client] --> LB[Load Balancer]
    LB --> App1[App Instance 1]
    LB --> App2[App Instance 2]
    LB --> AppN[App Instance N]

    subgraph Cache["Caching Strategy"]
        Redis[(Redis L1 Cache)]
        QueryCache[(Query L2 Cache)]
        CDN[CDN L3 Cache]
    end

    App1 --> Redis
    App2 --> Redis
    AppN --> Redis

    App1 --> QueryCache
    App2 --> QueryCache
    AppN --> QueryCache

    subgraph DataStore["Data Layer"]
        PostgreSQL[(PostgreSQL)]
        Pinecone[(Pinecone)]
    end

    App1 --> PostgreSQL
    App2 --> PostgreSQL
    AppN --> PostgreSQL

    App1 --> Pinecone
    App2 --> Pinecone
    AppN --> Pinecone
```

2. Caching Strategy

```typescript
// Multi-level caching
interface CacheStrategy {
  // L1: In-memory cache (Redis)
  memory: MemoryCache
  
  // L2: Database query cache
  query: QueryCache
  
  // L3: CDN for static assets
  cdn: CDNCache
}
```

3. Microservices Ready

```typescript
// Service boundaries
interface ServiceBoundary {
  agents: AgentService
  documents: DocumentService
  compliance: ComplianceService
  vector: VectorService
}
```

---

# 🔄 State Management

1. Client State (React Query)

Optimistic updates provide an instant UI response while the actual mutation is in flight.

```mermaid
sequenceDiagram
    participant UI as React Component
    participant Cache as React Query Cache
    participant API as tRPC Server

    UI->>UI: User triggers mutation (e.g., create doc)
    UI->>Cache: Optimistic update (local)
    Cache-->>UI: Render new doc immediately
    UI->>API: Send actual mutation
    alt success
        API-->>UI: 200 OK
        UI->>Cache: Invalidate & refetch
    else error
        API-->>UI: 5xx error
        UI->>Cache: Rollback to previous state
        UI-->>User: Show toast error
    end
```

```typescript
// Optimistic updates and caching
const { data, mutate } = trpc.document.create.useMutation({
  onMutate: async (newDocument) => {
    // Optimistic update
    await utils.document.list.cancel()
    const previousDocuments = utils.document.list.getData()
    utils.document.list.setData(undefined, (old) => [...(old ?? []), newDocument])
    return { previousDocuments }
  },
  onError: (err, newDocument, context) => {
    // Rollback on error
    utils.document.list.setData(undefined, context?.previousDocuments)
  },
})
```

2. Server State (Database)

Prisma transactions guarantee atomicity across multiple tables.

```mermaid
flowchart TD
    A[API receives request] --> B[Begin Prisma transaction]
    B --> C[Create Document record]
    C --> D[Create AuditLog record]
    D --> E[Update User quota]
    E --> F{All succeeded?}
    F -->|Yes| G[Commit transaction]
    F -->|No| H[Rollback all changes]
    G --> I[Return 201 to client]
    H --> J[Return 500 error]
```

```typescript
// Prisma transactions for consistency
await prisma.$transaction(async (tx) => {
  const document = await tx.document.create({ data: documentData })
  await tx.auditLog.create({
    data: {
      action: 'CREATE_DOCUMENT',
      entityId: document.id,
      userId: user.id,
    }
  })
})
```

---

# 🧪 Testing Strategy

1. Unit Tests

```mermaid
flowchart LR
    A[Component / Function] --> B[React Testing Library / Jest]
    B --> C[Assertions]
    C --> D[Pass / Fail]
```

```typescript
// Component testing with React Testing Library
test('ProcessFlowDesigner renders correctly', () => {
  render(<ProcessFlowDesigner />)
  expect(screen.getByText('Process Designer')).toBeInTheDocument()
})
```

2. Integration Tests

```mermaid
flowchart LR
    A[tRPC Caller] --> B[Invoke Router]
    B --> C[Database / Services]
    C --> D[Verify Result]
```

```typescript
// API testing with tRPC
test('agent.chat creates message', async () => {
  const result = await caller.agent.chat({
    agentId: 'test-agent',
    message: 'Hello',
  })
  expect(result.userMessage.content).toBe('Hello')
})
```

3. E2E Tests

```mermaid
flowchart LR
    A[Playwright] --> B[Launch Browser]
    B --> C[User Interactions]
    C --> D[Assertions]
    D --> E[Pass / Fail]
```

```typescript
// Playwright for end-to-end testing
test('complete compliance check workflow', async ({ page }) => {
  await page.goto('/compliance')
  await page.click('[data-testid="select-iso13485"]')
  await page.click('[data-testid="run-check"]')
  await expect(page.locator('[data-testid="results"]')).toBeVisible()
})
```

---

# 📊 Performance Optimization

1. Bundle Optimization

Code splitting and lazy loading reduce initial load time.

```typescript
// Code splitting and lazy loading
const ProcessFlowDesigner = lazy(() => import('./components/process-flow-designer'))
const DocumentBuilder = lazy(() => import('./components/document-builder'))
```

2. Database Optimization

Strategically placed indexes accelerate frequent queries.

```sql
-- Optimized indexes
CREATE INDEX idx_documents_type_status ON documents(type, status);
CREATE INDEX idx_compliance_checks_standard ON compliance_checks(standard);
CREATE INDEX idx_messages_agent_timestamp ON messages(agent_id, timestamp);
```

Index Impact

```mermaid
flowchart LR
    Query[Query] --> Index[Index Scan] --> Table[Table] --> Result[Result]
    NoIndex[No Index] --> FullScan[Full Table Scan] --> SlowResult[Slow Result]
```

3. Vector Search Optimization

Metadata filtering narrows the search space, improving both speed and accuracy.

```typescript
// Optimized vector queries
const searchResults = await vectorService.searchSimilar(
  queryEmbedding,
  10, // topK
  {
    standard: 'ISO13485',
    type: 'requirement'
  } // metadata filter
)
```

```mermaid
flowchart LR
    Query[User Query] --> Embed[Generate Embedding]
    Embed --> Filter[Apply Metadata Filter]
    Filter --> Pinecone[Pinecone Search]
    Pinecone --> Rank[Rank & Re‑score]
    Rank --> Results[Top-K Results]
```

---

# 🔮 Future Enhancements

1. Real‑time Collaboration

WebSockets will enable live multi‑user editing.

```mermaid
sequenceDiagram
    participant UserA
    participant UserB
    participant WebSocketServer
    participant RedisPubSub

    UserA->>WebSocketServer: Subscribe to room 'doc-123'
    UserB->>WebSocketServer: Subscribe to room 'doc-123'
    UserA->>WebSocketServer: Update document (delta)
    WebSocketServer->>RedisPubSub: Publish change to channel 'doc-123'
    RedisPubSub->>WebSocketServer: Broadcast to all subscribers
    WebSocketServer->>UserA: Echo update (ack)
    WebSocketServer->>UserB: Apply remote update
```

```typescript
// WebSocket integration for real-time updates
interface RealtimeService {
  subscribe(channel: string, callback: Function): void
  publish(channel: string, data: any): void
  unsubscribe(channel: string): void
}
```

2. Advanced AI Features

Enhanced AI capabilities include document summarization and predictive compliance.

```typescript
// Enhanced AI capabilities
interface AIService {
  generateEmbeddings(text: string): Promise<number[]>
  summarizeDocument(document: Document): Promise<string>
  predictCompliance(requirements: string[]): Promise<CompliancePrediction>
}
```

3. Mobile Support

A React Native SDK will enable offline‑first usage and seamless synchronization.

```typescript
// React Native compatibility
interface MobileSDK {
  agents: MobileAgentService
  offline: OfflineService
  sync: SyncService
}
```

---

# 📝 Development Guidelines

1. Code Organization

```
sdk/
├── types/           # TypeScript definitions
├── core/            # Core business logic
├── server/          # tRPC routers
├── client/          # React hooks and providers
├── components/      # UI components
├── agents/          # Agent definitions
└── utils/           # Utility functions
```

2. Naming Conventions

· Files: kebab-case (multi-agent-chat.tsx)
· Components: PascalCase (MultiAgentChat)
· Functions: camelCase (sendMessage)
· Constants: UPPER_SNAKE_CASE (API_ENDPOINTS)

3. Error Handling

```typescript
// Consistent error handling
class QMSError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'QMSError'
  }
}
```

Error Flow

```mermaid
flowchart TD
    A[Throw QMSError / unexpected error] --> B[Global error boundary / middleware]
    B --> C{Error type}
    C -->|Validation| D[Zod error → 400]
    C -->|Not found| E[404]
    C -->|Permission| F[403]
    C -->|Internal| G[500]
    
    D & E & F & G --> H[Log to structured logger]
    H --> I[Send to monitoring]
    I --> J[Return sanitized error to client]
```

---

This architecture provides a solid foundation for building scalable, maintainable quality management systems with modern web technologies.