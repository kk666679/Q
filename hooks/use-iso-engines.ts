import { useCallback, useState } from 'react';
import { trpc } from '@/sdk/client/trpc';

export function useRiskManagement() {
  const [riskData, setRiskData] = useState<any>(null);
  const [climateData, setClimateData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assessRiskMutation = trpc.iso.risk.assess.useMutation();
  const climateMutation = trpc.iso.risk.climate.useMutation();

  const assessRisk = useCallback(async (params: {
    description: string;
    category: 'quality' | 'environmental' | 'safety' | 'security' | 'operational' | 'strategic';
    likelihood: 'rare' | 'unlikely' | 'possible' | 'likely' | 'almost-certain';
    consequence: 'insignificant' | 'minor' | 'moderate' | 'major' | 'catastrophic';
    context?: string;
    existingControls?: string[];
  }) => {
    try {
      setLoading(true);
      const result = await assessRiskMutation.mutateAsync(params);
      setRiskData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assess risk');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [assessRiskMutation]);

  const assessClimateRisk = useCallback(async (params: {
    organizationContext: string;
    location?: string;
    hazardIds?: string[];
    timeHorizon?: 'short' | 'medium' | 'long';
  }) => {
    try {
      setLoading(true);
      const result = await climateMutation.mutateAsync(params);
      setClimateData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assess climate risk');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [climateMutation]);

  return {
    riskData,
    climateData,
    loading,
    error,
    assessRisk,
    assessClimateRisk,
  };
}

export function useAuditManagement() {
  const [auditData, setAuditData] = useState<any>(null);
  const [checklist, setChecklist] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMutation = trpc.iso.audit.generate.useMutation();

  const generateAudit = useCallback(async (params: {
    standard: 'ISO9001' | 'ISO14001' | 'ISO45001' | 'ISO17025' | 'ISO27001';
    scope: string;
    clauses?: string[];
    auditType?: 'internal' | 'external' | 'surveillance' | 'certification';
  }) => {
    try {
      setLoading(true);
      const result = await generateMutation.mutateAsync(params);
      setAuditData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate audit');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [generateMutation]);

  const generateChecklist = useCallback(async (
    standard: 'ISO9001' | 'ISO14001' | 'ISO45001' | 'ISO17025' | 'ISO27001',
    scope = 'full',
  ) => {
    try {
      setLoading(true);
      const result = await generateMutation.mutateAsync({ standard, scope });
      setChecklist(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate checklist');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [generateMutation]);

  return {
    auditData,
    checklist,
    loading,
    error,
    generateAudit,
    generateChecklist,
  };
}
