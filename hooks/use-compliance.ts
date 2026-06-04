'use client';

/**
 * useCompliance Hook
 * 
 * Client-side hook for compliance operations using tRPC.
 * Provides methods for compliance checking and reporting.
 * 
 * @example
 * function ComplianceChecker() {
 *   const { checkCompliance, isChecking, results } = useCompliance();
 *   
 *   const handleCheck = () => checkCompliance({ documentId: 'doc-123' });
 *   return <button onClick={handleCheck} disabled={isChecking}>Check</button>;
 * }
 */

import { trpc } from '@/lib/sdk';
import { useState, useCallback } from 'react';
import type { ComplianceResult } from '@/lib/sdk/types';

type ISOStandard = 'ISO9001' | 'ISO14001' | 'ISO45001' | 'ISO27001' | 'ISO17025' | 'ISO17020';

interface UseComplianceOptions {
  /** Default standard to check against */
  defaultStandard?: ISOStandard;
}

interface CheckComplianceInput {
  documentId?: string;
  standard?: ISOStandard;
}

/**
 * Hook for compliance operations
 */
export function useCompliance(options: UseComplianceOptions = {}) {
  const [results, setResults] = useState<ComplianceResult[]>([]);
  
  const checkMutation = trpc.compliance.check.useMutation({
    onSuccess: (data) => {
      setResults((data as unknown as ComplianceResult[]) || []);
    },
  });

  const checkCompliance = useCallback(
    async (input: CheckComplianceInput = {}) => {
      return checkMutation.mutateAsync({
        documentId: input.documentId,
      });
    },
    [checkMutation]
  );

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  return {
    results,
    isChecking: checkMutation.isPending,
    error: checkMutation.error,
    checkCompliance,
    clearResults,
  };
}

/**
 * Hook for compliance reports
 */
export function useComplianceReport(standard?: ISOStandard) {
  type StandardType = 'ISO13485' | 'ISO9001' | 'ISO14001' | 'ISO45001' | 'ISO17025' | 'ISO17020' | 'ISO27001' | 'FDA21CFR820' | 'MDSAP';
  const validStandards: StandardType[] = ['ISO13485','ISO9001','ISO14001','ISO45001','ISO17025','ISO17020','ISO27001','FDA21CFR820','MDSAP'];
  const typedStandard = validStandards.includes(standard as StandardType) ? (standard as StandardType) : undefined;
  const { data: report, isLoading, error, refetch } = trpc.compliance.getReport.useQuery(
    { standard: typedStandard },
    { enabled: !!standard }
  );

  return {
    report,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for compliance score calculation
 */
export function useComplianceScore(standard: ISOStandard) {
  const [score, setScore] = useState<{
    score: number;
    compliant: number;
    partial: number;
    gaps: number;
    total: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const calculateScore = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/compliance-score?standard=${standard}`);
      if (!response.ok) throw new Error('Failed to calculate score');
      const data = await response.json();
      setScore(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [standard]);

  return {
    score,
    isLoading,
    error,
    calculateScore,
  };
}

export default useCompliance;
