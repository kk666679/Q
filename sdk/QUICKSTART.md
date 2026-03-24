# QMS SDK Quick Start Guide

Get up and running with the QMS SDK in minutes!

## 🚀 Installation

```bash
npm install @qms/sdk
```

## ⚡ 5-Minute Setup

### 1. Environment Setup

Create `.env.local`:

```env
DATABASE_URL="postgresql://localhost:5432/qms_dev"
PINECONE_API_KEY="your-key-here"
PINECONE_INDEX_NAME="qms-compliance"
```

### 2. Provider Setup

```tsx
// app/layout.tsx
import { QMSProvider } from '@qms/sdk';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <QMSProvider>
          {children}
        </QMSProvider>
      </body>
    </html>
  );
}
```

### 3. Database Setup

```bash
npx prisma generate
npx prisma db push
```

## 🎯 Quick Examples

### Multi-Agent Chat

```tsx
import { MultiAgentChat } from '@qms/sdk';

export default function ChatPage() {
  return (
    <div className="h-screen p-4">
      <MultiAgentChat />
    </div>
  );
}
```

### Process Designer

```tsx
import { ProcessFlowDesigner } from '@qms/sdk';

export default function ProcessPage() {
  return (
    <div className="h-screen p-4">
      <ProcessFlowDesigner
        onSave={(process) => console.log('Saved:', process)}
      />
    </div>
  );
}
```

### Document Builder

```tsx
import { DocumentBuilder } from '@qms/sdk';

export default function DocumentPage() {
  return (
    <div className="h-screen p-4">
      <DocumentBuilder
        onSave={(doc) => console.log('Document saved:', doc)}
      />
    </div>
  );
}
```

### Compliance Checker

```tsx
import { ComplianceChecker } from '@qms/sdk';

export default function CompliancePage() {
  return (
    <div className="h-screen p-4">
      <ComplianceChecker
        onCheckComplete={(results) => console.log('Results:', results)}
      />
    </div>
  );
}
```

## 🔧 API Usage

### Agent Operations

```tsx
import { useAgent, trpc } from '@qms/sdk';

function AgentExample() {
  // Hook-based approach
  const { agent, sendMessage } = useAgent('quality-manager');
  
  // Direct tRPC approach
  const { data: agents } = trpc.agent.list.useQuery();
  const chatMutation = trpc.agent.chat.useMutation();
  
  return (
    <div>
      <button onClick={() => sendMessage('Generate audit checklist')}>
        Ask Quality Manager
      </button>
    </div>
  );
}
```

### Document Management

```tsx
import { useCreateDocument, useDocuments } from '@qms/sdk';

function DocumentExample() {
  const { data: documents } = useDocuments({ type: 'procedure' });
  const createMutation = useCreateDocument();
  
  const createDoc = () => {
    createMutation.mutate({
      title: 'New Procedure',
      content: 'Procedure content...',
      type: 'procedure',
      version: '1.0',
      status: 'draft',
      tags: ['quality'],
    });
  };
  
  return (
    <div>
      <button onClick={createDoc}>Create Document</button>
      {documents?.map(doc => (
        <div key={doc.id}>{doc.title}</div>
      ))}
    </div>
  );
}
```

### Compliance Checking

```tsx
import { useComplianceCheck } from '@qms/sdk';

function ComplianceExample() {
  const checkMutation = useComplianceCheck();
  
  const runCheck = async () => {
    const results = await checkMutation.mutateAsync({
      standard: 'ISO13485',
      requirements: ['Quality management system'],
    });
    console.log('Compliance results:', results);
  };
  
  return <button onClick={runCheck}>Run Compliance Check</button>;
}
```

## 📊 Dashboard Example

```tsx
import { 
  useAgents, 
  useDocuments, 
  useTestCoverage,
  useOEE 
} from '@qms/sdk';

function QMSDashboard() {
  const { data: agents } = useAgents();
  const { data: documents } = useDocuments();
  const { data: coverage } = useTestCoverage();
  const { data: oee } = useOEE(
    new Date('2024-01-01'),
    new Date('2024-01-31')
  );
  
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <div className="bg-blue-100 p-4 rounded">
        <h3>Active Agents</h3>
        <p className="text-2xl">{agents?.filter(a => a.status === 'active').length}</p>
      </div>
      
      <div className="bg-green-100 p-4 rounded">
        <h3>Documents</h3>
        <p className="text-2xl">{documents?.length}</p>
      </div>
      
      <div className="bg-purple-100 p-4 rounded">
        <h3>Test Coverage</h3>
        <p className="text-2xl">{coverage?.coverage.toFixed(1)}%</p>
      </div>
      
      <div className="bg-orange-100 p-4 rounded">
        <h3>OEE</h3>
        <p className="text-2xl">{oee?.overall.toFixed(1)}%</p>
      </div>
    </div>
  );
}
```

## 🎨 Styling

The SDK components use Tailwind CSS classes. Make sure Tailwind is configured:

```js
// tailwind.config.js
module.exports = {
  content: [
    './node_modules/@qms/sdk/**/*.{js,ts,jsx,tsx}',
    // ... your other content paths
  ],
  // ... rest of config
}
```

## 🔄 Real-time Updates

```tsx
import { useEffect } from 'react';
import { trpc } from '@qms/sdk';

function RealtimeExample() {
  const utils = trpc.useUtils();
  
  useEffect(() => {
    // Invalidate queries every 30 seconds for real-time feel
    const interval = setInterval(() => {
      utils.agent.list.invalidate();
      utils.document.list.invalidate();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [utils]);
  
  return <div>Real-time dashboard content...</div>;
}
```

## 🧪 Testing Your Setup

```tsx
// pages/test.tsx
import { 
  MultiAgentChat,
  ProcessFlowDesigner,
  DocumentBuilder,
  ComplianceChecker 
} from '@qms/sdk';

export default function TestPage() {
  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold">QMS SDK Test Page</h1>
      
      <section>
        <h2 className="text-xl mb-4">Multi-Agent Chat</h2>
        <div className="h-96 border rounded">
          <MultiAgentChat />
        </div>
      </section>
      
      <section>
        <h2 className="text-xl mb-4">Process Designer</h2>
        <div className="h-96 border rounded">
          <ProcessFlowDesigner />
        </div>
      </section>
      
      <section>
        <h2 className="text-xl mb-4">Document Builder</h2>
        <div className="h-96 border rounded">
          <DocumentBuilder />
        </div>
      </section>
      
      <section>
        <h2 className="text-xl mb-4">Compliance Checker</h2>
        <div className="h-96 border rounded">
          <ComplianceChecker />
        </div>
      </section>
    </div>
  );
}
```

## 🚀 Next Steps

1. **Explore Components**: Try each component in your app
2. **Customize Agents**: Add your own agent configurations
3. **Extend API**: Add custom tRPC procedures
4. **Style Components**: Customize the UI to match your brand
5. **Add Authentication**: Implement user management
6. **Deploy**: Deploy to your preferred platform

## 📚 Learn More

- [Full Documentation](./README.md)
- [Architecture Guide](./ARCHITECTURE.md)
- [API Reference](./docs/api.md)
- [Component Gallery](./docs/components.md)

## 🆘 Need Help?

- Check the [FAQ](./docs/faq.md)
- Open an [issue](https://github.com/your-repo/issues)
- Join our [Discord](https://discord.gg/your-server)

Happy building! 🎉