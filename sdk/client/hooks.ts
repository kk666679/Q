import { useState, useCallback, useRef } from 'react';
import { trpc } from './trpc';
import type { Message } from '../types/index';

const AGENT_LIST_STALE_MS    = 5 * 60 * 1000;  // agents rarely change
const REPORT_STALE_MS        = 2 * 60 * 1000;
const COVERAGE_STALE_MS      = 60 * 1000;

// ── Agent Hooks ───────────────────────────────────────────────────────────────
export function useAgent(agentId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId]  = useState(() => crypto.randomUUID());
  const abortRef     = useRef<AbortController | null>(null);

  const { data: agent } = trpc.agent.get.useQuery(
    { id: agentId },
    { staleTime: AGENT_LIST_STALE_MS, enabled: !!agentId },
  );
  const chatMutation = trpc.agent.chat.useMutation();
  const toolMutation = trpc.agent.executeTool.useMutation();

  const sendMessage = useCallback(async (content: string) => {
    if (!agent) return;
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const result = await chatMutation.mutateAsync({ agentId, message: content, sessionId });
    const toMsg = (m: typeof result.userMessage | typeof result.agentResponse): Message => ({
      ...m, timestamp: new Date(m.timestamp),
    } as unknown as Message);
    setMessages(prev => [...prev, toMsg(result.userMessage), toMsg(result.agentResponse)]);
    return result;
  }, [agent, agentId, sessionId, chatMutation]);

  const executeTool = useCallback(async (
    toolId: string,
    parameters: Record<string, unknown>,
  ) => {
    if (!agent) return;
    return toolMutation.mutateAsync({ agentId, toolId, parameters });
  }, [agent, agentId, toolMutation]);

  const cancelPending = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return {
    agent,
    messages,
    sendMessage,
    executeTool,
    cancelPending,
    isLoading: chatMutation.isPending || toolMutation.isPending,
  };
}

export function useAgents() {
  return trpc.agent.list.useQuery(undefined, {
    staleTime:            AGENT_LIST_STALE_MS,
    refetchOnWindowFocus: false,
  });
}

// ── Document Hooks ────────────────────────────────────────────────────────────
export function useDocuments(filters?: { type?: string; status?: string; tags?: string[] }) {
  return trpc.document.list.useQuery(filters ?? {}, { staleTime: 30_000 });
}

export function useCreateDocument() {
  const utils = trpc.useUtils();
  return trpc.document.create.useMutation({
    onSuccess: () => { utils.document.list.invalidate(); },
  });
}

export function useUpdateDocument() {
  const utils = trpc.useUtils();
  return trpc.document.update.useMutation({
    onSuccess: () => { utils.document.list.invalidate(); },
  });
}

export function useValidateDocument() {
  return trpc.document.validate.useMutation();
}

// ── Process Hooks ─────────────────────────────────────────────────────────────
export function useProcesses() {
  return trpc.process.list.useQuery(undefined, { staleTime: 30_000 });
}

export function useCreateProcess() {
  const utils = trpc.useUtils();
  return trpc.process.create.useMutation({
    onSuccess: () => { utils.process.list.invalidate(); },
  });
}

export function useUpdateProcess() {
  const utils = trpc.useUtils();
  return trpc.process.update.useMutation({
    onSuccess: () => { utils.process.list.invalidate(); },
  });
}

export function useValidateProcess() {
  return trpc.process.validate.useMutation();
}

// ── Compliance Hooks ──────────────────────────────────────────────────────────
export function useComplianceCheck() {
  return trpc.compliance.check.useMutation();
}

export function useComplianceReport(standard?: string) {
  type StandardType = 'ISO13485' | 'ISO9001' | 'ISO14001' | 'ISO45001' | 'ISO17025' | 'ISO17020' | 'ISO27001' | 'FDA21CFR820' | 'MDSAP';
  const validStandards: StandardType[] = ['ISO13485','ISO9001','ISO14001','ISO45001','ISO17025','ISO17020','ISO27001','FDA21CFR820','MDSAP'];
  const typedStandard = validStandards.includes(standard as StandardType)
    ? (standard as StandardType)
    : undefined;
  return trpc.compliance.getReport.useQuery(
    { standard: typedStandard },
    { staleTime: REPORT_STALE_MS, enabled: !!standard },
  );
}

// ── Audit Hooks ───────────────────────────────────────────────────────────────
export function useAudits() {
  return trpc.audit.list.useQuery(undefined, { staleTime: 30_000 });
}

export function useGenerateAuditChecklist() {
  return trpc.audit.generateChecklist.useMutation();
}

export function useCreateAudit() {
  const utils = trpc.useUtils();
  return trpc.audit.create.useMutation({
    onSuccess: () => { utils.audit.list.invalidate(); },
  });
}

// ── Testing Hooks ─────────────────────────────────────────────────────────────
export function useCreateTestCase() {
  return trpc.testing.createTestCase.useMutation();
}

export function useExecuteTest() {
  return trpc.testing.executeTest.useMutation();
}

export function useTestCoverage() {
  return trpc.testing.getCoverage.useQuery(undefined, { staleTime: COVERAGE_STALE_MS });
}

// ── Manufacturing Hooks ───────────────────────────────────────────────────────
export function useRecordMetrics() {
  return trpc.manufacturing.recordMetrics.useMutation();
}

export function useOEE(startDate: Date, endDate: Date) {
  return trpc.manufacturing.getOEE.useQuery(
    { startDate, endDate },
    { staleTime: COVERAGE_STALE_MS, enabled: !!startDate && !!endDate },
  );
}

// ── Construction Hooks ────────────────────────────────────────────────────────
export function useCreateProject() {
  return trpc.construction.createProject.useMutation();
}

export function useUpdateProjectProgress() {
  return trpc.construction.updateProgress.useMutation();
}

export function useEstimateCost() {
  return trpc.construction.estimateCost.useMutation();
}

// ── Insurance Hooks ───────────────────────────────────────────────────────────
export function useCreateClaim() {
  return trpc.insurance.createClaim.useMutation();
}

export function useProcessClaim() {
  return trpc.insurance.processClaim.useMutation();
}

export function useGenerateQuote() {
  return trpc.insurance.generateQuote.useMutation();
}

// ── Multi-Agent Chat Hook ─────────────────────────────────────────────────────
export function useMultiAgentChat() {
  const [activeAgents, setActiveAgents] = useState<string[]>([]);
  const [messages, setMessages]         = useState<(Message & { agentName?: string })[]>([]);

  const { data: agents }  = useAgents();
  const chatMutation      = trpc.agent.chat.useMutation();

  const addAgent = useCallback((agentId: string) => {
    setActiveAgents(prev => prev.includes(agentId) ? prev : [...prev, agentId]);
  }, []);

  const removeAgent = useCallback((agentId: string) => {
    setActiveAgents(prev => prev.filter(id => id !== agentId));
  }, []);

  const sendToAgent = useCallback(async (agentId: string, message: string) => {
    const agent = (agents as Array<{ id: string; name: string }> | undefined)
      ?.find(a => a.id === agentId);
    if (!agent) return;

    const result = await chatMutation.mutateAsync({ agentId, message });
    const toMsg = (m: typeof result.userMessage | typeof result.agentResponse, name: string): Message & { agentName?: string } =>
      ({ ...m, timestamp: new Date(m.timestamp), agentName: name } as unknown as Message & { agentName?: string });
    setMessages(prev => [
      ...prev,
      toMsg(result.userMessage,   'User'),
      toMsg(result.agentResponse, agent.name),
    ]);
    return result;
  }, [agents, chatMutation]);

  const broadcastMessage = useCallback(async (message: string) => {
    return Promise.all(activeAgents.map(id => sendToAgent(id, message)));
  }, [activeAgents, sendToAgent]);

  return {
    agents:          agents ?? [],
    activeAgents,
    messages,
    addAgent,
    removeAgent,
    sendToAgent,
    broadcastMessage,
    isLoading: chatMutation.isPending,
  };
}

// ── Malaysian Standards Hooks ─────────────────────────────────────────────────
export * from './ms-hooks';
