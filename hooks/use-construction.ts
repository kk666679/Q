import { useCallback, useState } from 'react';
import { trpc } from '@/sdk/client/trpc';

export function useConstruction() {
  const [estimateData, setEstimateData] = useState<any>(null);
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [safetyData, setSafetyData] = useState<any>(null);
  const [clashData, setClashData] = useState<any>(null);
  const [changeOrderData, setChangeOrderData] = useState<any>(null);

  const estimateMutation = trpc.construction.estimateCost.useMutation();
  const scheduleMutation = trpc.construction.calculateSchedule.useMutation();
  const safetyMutation = trpc.construction.assessSafety.useMutation();
  const clashMutation = trpc.construction.detectClashes.useMutation();
  const changeOrderMutation = trpc.construction.manageChangeOrder.useMutation();

  const loading = estimateMutation.isPending || scheduleMutation.isPending || safetyMutation.isPending || clashMutation.isPending || changeOrderMutation.isPending;
  const error = estimateMutation.error?.message ?? null;

  const estimateCost = useCallback(async (
    projectType: 'residential_basic' | 'residential_luxury' | 'commercial_office' | 'industrial_warehouse',
    squareFootage: number,
    specifications: { customDesign?: boolean; sustainableMaterials?: boolean; complexSite?: boolean } = {},
  ) => {
    const result = await estimateMutation.mutateAsync({ projectType, squareFootage, specifications });
    setEstimateData(result);
    return result;
  }, [estimateMutation]);

  const calculateSchedule = useCallback(async (
    projectId: string,
    tasks: { name: string; duration: number; predecessors?: string[] }[],
  ) => {
    const result = await scheduleMutation.mutateAsync({ projectId, tasks });
    setScheduleData(result);
    return result;
  }, [scheduleMutation]);

  const assessSafety = useCallback(async (projectId: string, inspector: string, areas?: string[]) => {
    const result = await safetyMutation.mutateAsync({ projectId, inspector, areas });
    setSafetyData(result);
    return result;
  }, [safetyMutation]);

  const detectClashes = useCallback(async (modelIds: string[], disciplines: string[]) => {
    const result = await clashMutation.mutateAsync({ modelIds, disciplines });
    setClashData(result);
    return result;
  }, [clashMutation]);

  const manageChangeOrder = useCallback(async (
    projectId: string,
    description: string,
    costImpact: number,
    scheduleImpact: number,
    reason: string,
  ) => {
    const result = await changeOrderMutation.mutateAsync({ projectId, description, costImpact, scheduleImpact, reason });
    setChangeOrderData(result);
    return result;
  }, [changeOrderMutation]);

  return { estimateData, scheduleData, safetyData, clashData, changeOrderData, loading, error, estimateCost, calculateSchedule, assessSafety, detectClashes, manageChangeOrder };
}
