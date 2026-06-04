"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Sparkles,
  Shield
} from 'lucide-react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { AppHeader } from "@/components/sidebar/app-header";
import { DocumentPreview } from '@/components/qms';
import { AIChatInterface } from '@/sdk/components/ai/chat-interface';
import { Agent, Artifact, Reasoning, Tool } from '@/components/ai-elements';
import { 
  DocumentBuilder,
  ComplianceChecker,
  MSStandardsViewer
} from '@/sdk/components/ai/index';
import { trpc } from '@/sdk/client/trpc';

const QMSGenerator = dynamic(() => import('@/components/qms/QMSGenerator').then(mod => ({ default: mod.QMSGenerator })), { ssr: false });

type ViewMode = 'qms' | 'preview' | 'doc-builder' | 'compliance' | 'ms-standards' | 'ai-chat';

export default function GeneratorPage() {
  const [activeView, setActiveView] = useState<ViewMode>('qms');
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  const sampleQMSContent = `# Quality Management System Document
## Company: ACME Corporation
### ISO 9001:2015 Compliance

## 1. QUALITY POLICY

**Policy Statement:**
ACME Corporation is committed to delivering products and services that consistently meet customer requirements.

**Commitments:**
- Customer focus and satisfaction
- Leadership and engagement
- Process approach
- Improvement culture

## 2. SCOPE

This Quality Management System applies to all activities within ACME Corporation.

## 3. LEADERSHIP

Top management demonstrates leadership and commitment by establishing quality policy and objectives.`;

  const navItems = [
    { id: 'qms', label: 'QMS Generator', icon: Sparkles },
    { id: 'preview', label: 'Document Preview', icon: FileText },
    { id: 'doc-builder', label: 'Document Builder', icon: FileText },
    { id: 'compliance', label: 'Compliance Checker', icon: Shield },
    { id: 'ms-standards', label: 'MS Standards', icon: Shield },
    { id: 'ai-chat', label: 'AI Assistant', icon: Sparkles },
  ];

  const handleSendMessage = async (message: string) => {
    const newMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, newMessage]);
    
    try {
      // Try to generate document if message mentions document
      if (message.toLowerCase().includes('document') || message.toLowerCase().includes('generate')) {
        const result = await trpc.ai.generateDocument.mutate({
          documentType: 'procedure',
          context: message,
        });
        
        const response = {
          id: (Date.now() + 1).toString(),
          role: 'assistant' as const,
          content: `Generated document based on your requirements:\n\n${result.document || 'Document generation successful'}`,
          timestamp: new Date(),
        };
        setChatMessages(prev => [...prev, response]);
      } else {
        // Default fallback response
        const response = {
          id: (Date.now() + 1).toString(),
          role: 'assistant' as const,
          content: `I can help you with: QMS documentation, ISO compliance, process mapping, and quality management. What would you like to know?`,
          timestamp: new Date(),
        };
        setChatMessages(prev => [...prev, response]);
      }
    } catch (err) {
      console.error('Message handling failed:', err);
      const errorResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorResponse]);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="QMS Tools" description="Quality Management System tools and generators" />
        
        <div className="bg-white border-b border-gray-200 px-6">
          <nav className="flex space-x-1 -mb-px overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as ViewMode)}
                  className={
                    'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ' +
                    (isActive 
                      ? 'border-indigo-600 text-indigo-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeView === 'qms' && (
              <motion.div
                key="qms"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full overflow-auto"
              >
                <QMSGenerator />
              </motion.div>
            )}

            {activeView === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full overflow-auto"
              >
                <div className="p-6">
                  <DocumentPreview 
                    content={sampleQMSContent}
                    title="Quality Management System Document"
                    version="1.0"
                    status="draft"
                    onDownload={() => console.log('Downloading document...')}
                  />
                </div>
              </motion.div>
            )}

            {activeView === 'doc-builder' && (
              <motion.div
                key="doc-builder"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full overflow-auto"
              >
                <div className="p-6 h-full">
                  <DocumentBuilder onSave={(doc) => console.log('Document saved:', doc)} />
                </div>
              </motion.div>
            )}

            {activeView === 'compliance' && (
              <motion.div
                key="compliance"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full overflow-auto"
              >
                <div className="p-6">
                  <ComplianceChecker onCheckComplete={(results) => console.log('Compliance results:', results)} />
                </div>
              </motion.div>
            )}

            {activeView === 'ms-standards' && (
              <motion.div
                key="ms-standards"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full overflow-auto"
              >
                <div className="p-6">
                  <MSStandardsViewer />
                </div>
              </motion.div>
            )}

            {activeView === 'ai-chat' && (
              <motion.div
                key="ai-chat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full overflow-auto"
              >
                <div className="p-6 max-w-4xl mx-auto">
                  <AIChatInterface
                    messages={chatMessages}
                    onSendMessage={handleSendMessage}
                    suggestions={[
                      { id: '1', label: 'Generate QMS Document', prompt: 'Generate a quality management system document' },
                      { id: '2', label: 'ISO 9001 Compliance', prompt: 'Help me with ISO 9001:2015 compliance' },
                      { id: '3', label: 'Audit Checklist', prompt: 'Create an internal audit checklist' },
                    ]}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
