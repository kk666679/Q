

# SDK QMS

Version: 0.2.0 (matches repository package.json)

Comprehensive Quality Management System SDK with Multi-Agent AI, tRPC, and ISO Standards integration.

## 🚀 Features

✅ **Multi-Agent AI System** - 10+ specialized AI agents for quality management  
✅ **ISO Knowledge Base** - Pre-loaded clauses for ISO 9001, 14001, 45001, 17025, 17020, 27001  
✅ **Climate Risk Engine** - ISO 14001 AMD.1:2024 climate change adaptation  
✅ **Interactive Process Mapping** - xyflow-powered process designer  
✅ **Complete tRPC API** - Type-safe APIs for all operations  
✅ **Responsive UI Components** - Framer Motion animations  
✅ **Type Safety** - Full TypeScript support throughout  
✅ **Database Integration** - Prisma ORM with PostgreSQL  

## 📦 Installation

```bash
npm install
# or
yarn install
# or
pnpm install
```

## 🛠️ Setup

### 1. Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/qms_db"
PINECONE_API_KEY="your-pinecone-api-key"
PINECONE_INDEX_NAME="qms-compliance"
OPENAI_API_KEY="your-openai-api-key"
```

### 2. Database Setup

```bash
npx prisma generate
npx prisma db push
```

### 3. Provider Setup

```tsx
import { QMSProvider } from '@/sdk/client/provider';

export default function RootLayout({ children }) {
  return (
    <QMSProvider>
      {children}
    </QMSProvider>
  );
}
```

## 🤖 Multi-Agent System

### Available Agents

1. **ISO 9001 Agent** - Quality Management Systems
2. **ISO 14001 Agent** - Environmental Management + Climate Risk
3. **ISO 45001 Agent** - Occupational Health & Safety
4. **Quality Manager** - ISO 13485 QMS Implementation
5. **Documentation Manager** - Document Control & Regulatory
6. **QA Expert** - Test Strategy & Quality Processes
7. **Manufacturing Expert** - MES, Industry 4.0, Production
8. **Construction Expert** - Project Management, BIM, Safety
9. **Insurance Expert** - Underwriting, Claims, Actuarial
10. **IMS Integrator** - Integrated Management Systems

### Usage

```tsx
import { useAgent, useAgentList } from '@/sdk/client/hooks';

function AgentChat() {
  const { data: agents } = useAgentList();
  const { agent, messages, sendMessage, isLoading } = useAgent('iso9001-agent');
  
  return (
    <button onClick={() => sendMessage('Generate audit checklist')}>
      Ask ISO 9001 Agent
    </button>
  );
}
```

### Multi-Agent Chat

```tsx
import { MultiAgentChat } from '@/components/qms/multi-agent-chat';

function MultiChat() {
  return <MultiAgentChat />;
}
```

## 📊 tRPC API

### Agent Operations

```tsx
import { trpc } from '@/sdk/client/trpc';

function AgentOperations() {
  const { data: agents } = trpc.agent.list.useQuery();
  const chatMutation = trpc.agent.chat.useMutation();
  const toolMutation = trpc.agent.executeTool.useMutation();
  
  const handleChat = async () => {
    await chatMutation.mutateAsync({
      agentId: 'iso9001-agent',
      message: 'Generate compliance report',
    });
  };
  
  const handleTool = async () => {
    await toolMutation.mutateAsync({
      agentId: 'iso9001-agent',
      toolId: 'assess_qms_compliance',
      parameters: { clauses: ['4.1', '5.1', '6.1'] },
    });
  };
}
```

### Document Management

```tsx
function DocumentOps() {
  const { data: documents } = trpc.document.list.useQuery({
    type: 'procedure',
    status: 'approved',
  });
  
  const createMutation = trpc.document.create.useMutation();
  const validateMutation = trpc.document.validate.useMutation();
  
  const createDocument = async () => {
    await createMutation.mutateAsync({
      title: 'Quality Procedure',
      content: 'Document content...',
      type: 'procedure',
      version: '1.0',
      status: 'draft',
      tags: ['quality', 'procedure'],
    });
  };
}
```

### Compliance Checking

```tsx
function ComplianceOps() {
  const checkMutation = trpc.compliance.check.useMutation();
  const { data: report } = trpc.compliance.getReport.useQuery({
    standard: 'ISO9001'
  });
  
  const runCheck = async () => {
    const results = await checkMutation.mutateAsync({
      standard: 'ISO9001',
      requirements: [
        'Quality management system',
        'Management responsibility',
      ],
    });
  };
}
```

## 🎨 UI Components

### ISO Compliance Checker

```tsx
import { ISOComplianceChecker } from '@/components/qms/ISOComplianceChecker';

function ComplianceCheck() {
  return (
    <ISOComplianceChecker
      onCheckCompliance={() => console.log('Checking...')}
    />
  );
}
```

### Process Flow Designer

```tsx
import { ProcessFlowDesigner } from '@/components/qms/processflow_designer';

function ProcessDesigner() {
  return (
    <ProcessFlowDesigner
      onSave={(process) => console.log('Process saved:', process)}
    />
  );
}
```

### Multi-Agent Chat

```tsx
import { MultiAgentChat } from '@/components/qms/multi-agent-chat';

function Chat() {
  return <MultiAgentChat />;
}
```

## 🌍 Climate Risk Engine

### ISO 14001 AMD.1:2024 Climate Change Adaptation

```tsx
import { climateRiskEngine, climateHazards } from '@/sdk/services/climate-risk-engine';

// Add a climate risk
const risk = climateRiskEngine.addRisk('CH-001', {
  likelihood: 'likely',
  severity: 'high',
  adaptiveCapacity: 'moderate',
  owner: 'Environmental Manager',
  currentControls: ['Temperature monitoring', 'HVAC systems'],
});

// Get risk summary
const summary = climateRiskEngine.getRiskSummary();
console.log('Total Risks:', summary.total);
console.log('Critical Risks:', summary.criticalRisks);

// Generate adaptation plan
const plan = climateRiskEngine.generateClimateAdaptationPlan();
console.log(plan);

// Get available hazards
const hazards = climateRiskEngine.getAvailableHazards();
```

### Climate Risk Types

```tsx
// Physical risks
- Temperature extremes (heat waves, cold events)
- Precipitation extremes (flooding, drought)
- Wind extremes (storms, hurricanes)
- Sea level rise
- Water scarcity
- Ecosystem disruption

// Transition risks
- Carbon pricing
- Climate regulations

// Liability risks
- Climate litigation
```

## 📈 Manufacturing Metrics

```tsx
function ManufacturingDashboard() {
  const recordMutation = trpc.manufacturing.recordMetrics.useMutation();
  const { data: oee } = trpc.manufacturing.getOEE.useQuery({
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
  });
  
  const recordOEE = async () => {
    await recordMutation.mutateAsync({
      availability: 95.5,
      performance: 87.2,
      quality: 99.1,
      overall: 82.8,
      throughput: 1250,
      defectRate: 0.9,
      cycleTime: 45.2,
      downtime: 2.3,
    });
  };
}
```

## 🏗️ Construction Management

```tsx
function ConstructionOps() {
  const createMutation = trpc.construction.createProject.useMutation();
  const estimateMutation = trpc.construction.estimateCost.useMutation();
  
  const createProject = async () => {
    await createMutation.mutateAsync({
      name: 'Office Building Construction',
      description: 'New 10-story office building',
      status: 'planning',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2025-12-31'),
      budget: 5000000,
      progress: 0,
      risks: [
        {
          id: 'risk-1',
          description: 'Weather delays',
          probability: 'medium',
          impact: 'high',
          mitigation: 'Schedule buffer and weather monitoring',
        },
      ],
    });
  };
}
```

## 🛡️ Insurance Operations

```tsx
function InsuranceOps() {
  const createClaimMutation = trpc.insurance.createClaim.useMutation();
  const quoteMutation = trpc.insurance.generateQuote.useMutation();
  
  const generateQuote = async () => {
    const quote = await quoteMutation.mutateAsync({
      policyType: 'commercial-property',
      coverage: 1000000,
      riskFactors: ['high-value-equipment', 'urban-location'],
    });
    
    console.log('Premium:', quote.premium);
  };
}
```

## 🧪 Testing Integration

```tsx
function TestingOps() {
  const createTestMutation = trpc.testing.createTestCase.useMutation();
  const executeMutation = trpc.testing.executeTest.useMutation();
  const { data: coverage } = trpc.testing.getCoverage.useQuery();
  
  const runTest = async () => {
    const testCase = await createTestMutation.mutateAsync({
      title: 'Login Functionality Test',
      description: 'Test user login with valid credentials',
      steps: [
        'Navigate to login page',
        'Enter valid username and password',
        'Click login button',
      ],
      expectedResult: 'User successfully logged in',
      status: 'not-run',
      priority: 'high',
      tags: ['authentication', 'critical'],
    });
    
    await executeMutation.mutateAsync({
      testCaseId: testCase.id,
      actualResult: 'User successfully logged in',
    });
  };
}
```

## 📋 Audit Management

```tsx
function AuditOps() {
  const generateMutation = trpc.audit.generateChecklist.useMutation();
  const createMutation = trpc.audit.create.useMutation();
  
  const generateChecklist = async () => {
    const checklist = await generateMutation.mutateAsync({
      auditType: 'internal',
      scope: 'Full QMS',
    });
    
    console.log('Checklist:', checklist.checklist);
  };
}
```

## 🔧 Advanced Configuration

### Custom Agent Registration

```tsx
import { agentRegistry } from '@/sdk/core/registry';

const customAgent = {
  id: 'custom-agent',
  name: 'Custom Quality Agent',
  type: 'quality-manager',
  description: 'Specialized quality management agent',
  capabilities: ['audit-generation', 'compliance-checking'],
  tools: ['audit-checklist', 'gap-analysis'],
  status: 'active',
};

agentRegistry.register(customAgent);
```

### Agent Tools

Each agent has specialized tools. Example from ISO 9001 Agent:

```tsx
// Available tools:
- assess_qms_compliance: Assess compliance against ISO 9001 clauses
- generate_audit_checklist: Generate ISO 9001 audit checklist
- analyze_process_performance: Analyze QMS process performance
- facilitate_management_review: Prepare management review
- conduct_risk_assessment: Conduct risk-based thinking assessment
- evaluate_customer_satisfaction: Evaluate customer satisfaction
- review_supplier_quality: Review supplier quality performance
```

## 📚 Type Definitions

The SDK provides comprehensive TypeScript types:

```tsx
import type {
  Agent,
  AgentConfig,
  AgentRole,
  Message,
  Document,
  Process,
  ComplianceCheck,
  Audit,
  TestCase,
  Project,
  Claim,
  ManufacturingMetrics,
  OEE,
  ClimateRisk,
} from '@/sdk/types';
```

## 📖 ISO Knowledge Base

Pre-loaded ISO standards with full clause details:

```tsx
// Available standards:
- ISO 9001:2015 (Quality Management)
- ISO 14001:2015 + AMD.1:2024 (Environmental + Climate)
- ISO 45001:2018 (Occupational Health & Safety)
- ISO 17025:2017 (Testing and Calibration Laboratories)
- ISO 17020 (Inspection Bodies)
- ISO 27001 (Information Security)
```

Each standard includes:
- Clause numbers and titles
- Detailed requirements
- Implementation guidance
- Compliance criteria

## 🔌 API Reference

### Agent Router

```tsx
agent.list()                    // Get all agents
agent.get({ id })               // Get specific agent
agent.chat({ agentId, message }) // Chat with agent
agent.executeTool({ agentId, toolId, parameters }) // Execute agent tool
```

### Document Router

```tsx
document.list({ type?, status?, tags? })  // List documents
document.create({ title, content, ... })  // Create document
document.update({ id, data })             // Update document
document.validate({ id })                 // Validate document
```

### Compliance Router

```tsx
compliance.check({ standard, requirements })  // Check compliance
compliance.getReport({ standard })            // Get compliance report
```

### Audit Router

```tsx
audit.generateChecklist({ auditType, scope })  // Generate checklist
audit.create({ ... })                          // Create audit
audit.list()                                   // List audits
```

### Manufacturing Router

```tsx
manufacturing.recordMetrics({ ... })           // Record metrics
manufacturing.getOEE({ startDate, endDate })   // Get OEE data
```

### Construction Router

```tsx
construction.createProject({ ... })            // Create project
construction.updateProgress({ ... })           // Update progress
construction.estimateCost({ ... })             // Estimate cost
```

### Insurance Router

```tsx
insurance.createClaim({ ... })                 // Create claim
insurance.processClaim({ ... })                // Process claim
insurance.generateQuote({ ... })               // Generate quote
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For questions or support:
- Open an issue on GitHub
- Check the [main documentation](../README.md)
- Review the [architecture guide](./ARCHITECTURE.md)

---

**Quality Management Systems SDK**