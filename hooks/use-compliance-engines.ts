import { useCallback, useState } from 'react';
import { trpc } from '@/sdk/client/trpc';

type ISOStandard = 'ISO9001' | 'ISO14001' | 'ISO45001' | 'ISO17025' | 'ISO27001';

export function useCompliance() {
  const [checkData, setCheckData] = useState<any>(null);
  const [scoreData, setScoreData] = useState<any>(null);
  const [gapData, setGapData] = useState<any>(null);

  const checkMutation = trpc.iso.compliance.check.useMutation();
  const scoreMutation = trpc.iso.compliance.score.useMutation();
  const gapMutation = trpc.iso.compliance.gapAnalysis.useMutation();

  const loading = checkMutation.isPending || scoreMutation.isPending || gapMutation.isPending;
  const error = checkMutation.error?.message ?? scoreMutation.error?.message ?? null;

  const checkCompliance = useCallback(async (
    standard: ISOStandard,
    options?: { documentId?: string; content?: string; clauses?: string[] },
  ) => {
    const result = await checkMutation.mutateAsync({ standard, ...options });
    setCheckData(result);
    return result;
  }, [checkMutation]);

  const scoreCompliance = useCallback(async (
    standard: ISOStandard,
    findings: { clause: string; status: 'compliant' | 'partial' | 'non-compliant' | 'not-applicable'; weight?: number }[],
  ) => {
    const result = await scoreMutation.mutateAsync({ standard, findings });
    setScoreData(result);
    return result;
  }, [scoreMutation]);

  const getGapAnalysis = useCallback(async (
    standard: ISOStandard,
    currentState: { clause: string; status: 'compliant' | 'partial' | 'non-compliant' | 'not-applicable'; evidence?: string[] }[],
  ) => {
    const result = await gapMutation.mutateAsync({ standard, currentState });
    setGapData(result);
    return result;
  }, [gapMutation]);

  return { checkData, scoreData, gapData, loading, error, checkCompliance, scoreCompliance, getGapAnalysis };
}

export function useCAPAOperations() {
  const [capaData, setCAPAData] = useState<any>(null);
  const [fishboneData, setFishboneData] = useState<any>(null);
  const [fiveWhysData, setFiveWhysData] = useState<any>(null);

  const capaMutation = trpc.iso.capa.create.useMutation();
  const fishboneMutation = trpc.iso.capa.fishbone.useMutation();
  const fiveWhysMutation = trpc.iso.capa.fiveWhys.useMutation();

  const loading = capaMutation.isPending || fishboneMutation.isPending || fiveWhysMutation.isPending;
  const error = capaMutation.error?.message ?? null;

  const createCAPAPlan = useCallback(async (params: {
    title: string;
    description: string;
    type: 'corrective' | 'preventive';
    source: 'audit' | 'complaint' | 'nonconformity' | 'risk' | 'improvement';
    rootCause?: string;
    proposedAction: string;
    owner: string;
    dueDate: Date;
    priority: 'low' | 'medium' | 'high' | 'critical';
  }) => {
    const result = await capaMutation.mutateAsync(params);
    setCAPAData(result);
    return result;
  }, [capaMutation]);

  const generateFishbone = useCallback(async (
    problem: string,
    categories?: { name: 'people' | 'process' | 'equipment' | 'materials' | 'environment' | 'management'; causes: string[] }[],
  ) => {
    const result = await fishboneMutation.mutateAsync({ problem, categories });
    setFishboneData(result);
    return result;
  }, [fishboneMutation]);

  const generateFiveWhys = useCallback(async (
    problem: string,
    whys?: { question: string; answer: string }[],
  ) => {
    const result = await fiveWhysMutation.mutateAsync({ problem, whys });
    setFiveWhysData(result);
    return result;
  }, [fiveWhysMutation]);

  return { capaData, fishboneData, fiveWhysData, loading, error, createCAPAPlan, generateFishbone, generateFiveWhys };
}
