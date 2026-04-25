/**
 * Compliance Service
 * 
 * Service layer for compliance checking and reporting.
 * Uses the SDK to perform compliance assessments against ISO standards.
 */

import { trpcClient } from '@/lib/sdk/trpc';
import type { ComplianceResult } from '@/lib/sdk/types';

export type ISOStandard = 
  | 'ISO9001'
  | 'ISO14001'
  | 'ISO45001'
  | 'ISO27001'
  | 'ISO17025'
  | 'ISO17020';

export interface ComplianceCheckInput {
  documentId?: string;
  standard?: ISOStandard;
  content?: string;
}

export interface GapAnalysisInput {
  standard: ISOStandard;
  currentState: Record<string, unknown>;
}

/**
 * Compliance Service
 * Provides methods for compliance checking and gap analysis
 */
export const complianceService = {
  /**
   * Check compliance for a document or content
   */
  async check(input: ComplianceCheckInput): Promise<ComplianceResult[]> {
    return trpcClient.compliance.check.mutate({
      documentId: input.documentId,
    });
  },

  /**
   * Get compliance report for a specific standard
   */
  async getReport(standard: ISOStandard) {
    return trpcClient.compliance.getReport.query({ id: standard });
  },

  /**
   * Perform gap analysis between current state and standard requirements
   */
  async performGapAnalysis(input: GapAnalysisInput) {
    const response = await fetch('/api/gap-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error('Failed to perform gap analysis');
    }

    return response.json();
  },

  /**
   * Calculate compliance score for a standard
   */
  async calculateScore(standard: ISOStandard) {
    const response = await fetch(`/api/compliance-score?standard=${standard}`);
    
    if (!response.ok) {
      throw new Error('Failed to calculate compliance score');
    }

    return response.json() as Promise<{
      score: number;
      compliant: number;
      partial: number;
      gaps: number;
      total: number;
    }>;
  },

  /**
   * Get recommended actions to improve compliance
   */
  async getRecommendations(standard: ISOStandard) {
    const response = await fetch(`/api/compliance-recommendations?standard=${standard}`);
    
    if (!response.ok) {
      throw new Error('Failed to get recommendations');
    }

    return response.json() as Promise<{
      recommendations: Array<{
        clause: string;
        action: string;
        priority: 'low' | 'medium' | 'high';
        effort: string;
      }>;
    }>;
  },
};

export default complianceService;
