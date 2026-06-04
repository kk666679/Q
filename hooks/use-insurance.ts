import { useCallback, useState } from 'react';
import { trpc } from '@/sdk/client/trpc';

export function useInsurance() {
  const [quoteData, setQuoteData] = useState<any>(null);
  const [claimData, setClaimData] = useState<any>(null);
  const [fraudData, setFraudData] = useState<any>(null);

  const quoteMutation = trpc.insurance.generateQuote.useMutation();
  const claimMutation = trpc.insurance.processClaim.useMutation();
  const fraudMutation = trpc.insurance.detectFraud.useMutation();

  const loading = quoteMutation.isPending || claimMutation.isPending || fraudMutation.isPending;
  const error = quoteMutation.error?.message ?? claimMutation.error?.message ?? null;

  const generateQuote = useCallback(async (params: {
    policyType: 'auto' | 'home' | 'life' | 'health';
    applicant: { age: number; creditScore: number; zipCode: string };
    coverage: { liability?: number; collision?: boolean; comprehensive?: boolean };
    riskFactors?: { accidents?: number; violations?: number; claims?: number };
  }) => {
    const result = await quoteMutation.mutateAsync(params);
    setQuoteData(result);
    return result;
  }, [quoteMutation]);

  const processClaim = useCallback(async (params: {
    policyNumber: string;
    claimType: 'collision' | 'theft' | 'liability' | 'comprehensive' | 'medical';
    dateOfLoss: string;
    estimatedLoss: number;
    description: string;
  }) => {
    const result = await claimMutation.mutateAsync(params);
    setClaimData(result);
    return result;
  }, [claimMutation]);

  const detectFraud = useCallback(async (
    claimData: { claimId: string; amount: number; dateOfLoss: string; reportDate: string; claimant: string }[],
  ) => {
    const result = await fraudMutation.mutateAsync({ claimData });
    setFraudData(result);
    return result;
  }, [fraudMutation]);

  return { quoteData, claimData, fraudData, loading, error, generateQuote, processClaim, detectFraud };
}
