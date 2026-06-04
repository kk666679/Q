import { useCallback, useState, useEffect } from 'react';
import { trpc } from '@/sdk/client/trpc';

export function useAgents() {
  const { data: agents = [], isLoading: loading, error: queryError } = trpc.agent.list.useQuery();
  const error = queryError?.message ?? null;

  const chatMutation = trpc.agent.chat.useMutation();

  const sendMessage = useCallback(async (agentId: string, message: string) => {
    return chatMutation.mutateAsync({ agentId, message });
  }, [chatMutation]);

  const executeToolMutation = trpc.agent.executeTool.useMutation();

  const executeTool = useCallback(async (agentId: string, toolId: string, parameters: Record<string, unknown>) => {
    return executeToolMutation.mutateAsync({ agentId, toolId, parameters });
  }, [executeToolMutation]);

  return {
    agents,
    loading,
    error,
    sendMessage,
    executeTool,
  };
}

export function useAIOperations() {
  const { data: modelsData = [], isLoading: loading, error: queryError } = trpc.ai.getModels.useQuery();
  const models = modelsData;
  const error = queryError?.message ?? null;

  const generateDocMutation = trpc.ai.generateDocument.useMutation();
  const analyzeComplianceMutation = trpc.ai.analyzeCompliance.useMutation();
  const fiveWhysMutation = trpc.ai.fiveWhys.useMutation();
  const assessRiskMutation = trpc.ai.assessRisk.useMutation();

  const generateDocument = useCallback(async (documentType: string, context: string) => {
    return generateDocMutation.mutateAsync({ documentType, context });
  }, [generateDocMutation]);

  const analyzeCompliance = useCallback(async (content: string, standard: string) => {
    return analyzeComplianceMutation.mutateAsync({ content, standard });
  }, [analyzeComplianceMutation]);

  const fiveWhys = useCallback(async (problem: string) => {
    return fiveWhysMutation.mutateAsync({ problem });
  }, [fiveWhysMutation]);

  const assessRisk = useCallback(async (context: string) => {
    return assessRiskMutation.mutateAsync({ context });
  }, [assessRiskMutation]);

  return {
    models,
    loading,
    error,
    generateDocument,
    analyzeCompliance,
    fiveWhys,
    assessRisk,
  };
}
