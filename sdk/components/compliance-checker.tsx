'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { useComplianceCheck, useComplianceReport } from '../client/hooks';
// @ts-expect-error - Type import not fully aligned with implementation
import type { ComplianceCheck } from '../types/iso';

const isoStandards = {
  ISO13485: {
    name: 'ISO 13485:2016',
    description: 'Medical devices - Quality management systems',
    requirements: [
      'Quality management system',
      'Management responsibility',
      'Resource management',
      'Product realization',
      'Measurement, analysis and improvement',
      'Design and development',
      'Purchasing',
      'Production and service provision',
    ],
  },
  ISO9001: {
    name: 'ISO 9001:2015',
    description: 'Quality management systems - Requirements',
    requirements: [
      'Context of the organization',
      'Leadership',
      'Planning',
      'Support',
      'Operation',
      'Performance evaluation',
      'Improvement',
    ],
  },
  FDA21CFR820: {
    name: 'FDA 21 CFR Part 820',
    description: 'Quality System Regulation',
    requirements: [
      'Quality system requirements',
      'Management controls',
      'Design controls',
      'Document controls',
      'Purchasing controls',
      'Production and process controls',
      'Acceptance activities',
      'Nonconforming product',
      'Corrective and preventive action',
    ],
  },
  MDSAP: {
    name: 'MDSAP',
    description: 'Medical Device Single Audit Program',
    requirements: [
      'Quality management system',
      'Management responsibility',
      'Resource management',
      'Product realization',
      'Measurement and improvement',
    ],
  },
};

interface ComplianceCheckerProps {
  onCheckComplete?: (results: ComplianceCheck[]) => void;
}

export function ComplianceChecker({ onCheckComplete }: ComplianceCheckerProps) {
  const [selectedStandard, setSelectedStandard] = useState<keyof typeof isoStandards>('ISO13485');
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([]);
  const [checkResults, setCheckResults] = useState<ComplianceCheck[]>([]);

  const complianceCheckMutation = useComplianceCheck();
  const { data: complianceReport } = useComplianceReport(selectedStandard);

  const handleRequirementToggle = (requirement: string) => {
    setSelectedRequirements(prev => 
      prev.includes(requirement)
        ? prev.filter(r => r !== requirement)
        : [...prev, requirement]
    );
  };

  const runComplianceCheck = async () => {
    if (selectedRequirements.length === 0) return;

    try {
      const results = await complianceCheckMutation.mutateAsync({
        standard: selectedStandard,
        requirements: selectedRequirements,
      });
      
      setCheckResults(results);
      onCheckComplete?.(results);
    } catch (error) {
      console.error('Compliance check failed:', error);
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-500';
      case 'non-compliant': return 'bg-red-500';
      case 'partial': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Standard Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Standard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(isoStandards).map(([key, standard]) => (
              <Card
                key={key}
                className={`cursor-pointer transition-colors ${
                  selectedStandard === key ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedStandard(key as keyof typeof isoStandards)}
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold">{standard.name}</h3>
                  <p className="text-sm text-gray-600">{standard.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Requirements Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Requirements to Check</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {isoStandards[selectedStandard].requirements.map((requirement) => (
              <label key={requirement} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedRequirements.includes(requirement)}
                  onChange={() => handleRequirementToggle(requirement)}
                  className="rounded"
                />
                <span>{requirement}</span>
              </label>
            ))}
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button
              onClick={() => setSelectedRequirements(isoStandards[selectedStandard].requirements)}
            >
              Select All
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedRequirements([])}
            >
              Clear All
            </Button>
            <Button
              onClick={runComplianceCheck}
              disabled={selectedRequirements.length === 0 || complianceCheckMutation.isPending}
              className="ml-auto"
            >
              {complianceCheckMutation.isPending ? 'Checking...' : 'Run Compliance Check'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Overall Report */}
      {complianceReport && (
        <Card>
          <CardHeader>
            <CardTitle>Overall Compliance Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(complianceReport.score)}`}>
                  {complianceReport.score.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${complianceReport.passed ? 'text-green-600' : 'text-red-600'}`}>
                  {complianceReport.passed ? 'Pass' : 'Review'}
                </div>
                <div className="text-sm text-gray-600">Status</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {complianceReport.findings.length}
                </div>
                <div className="text-sm text-gray-600">Findings</div>
              </div>
            </div>

            <Progress value={complianceReport.score} className="mb-4" />

            <div className="space-y-2">
              <p className="text-sm text-gray-600">{complianceReport.summary}</p>
              {complianceReport.recommendations?.length ? (
                <div>
                  <h5 className="text-sm font-medium text-blue-700 mb-2">Recommendations:</h5>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    {complianceReport.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Check Results */}
      {checkResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Compliance Check Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {checkResults.map((result) => (
                <Card key={result.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{result.requirement}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={getComplianceColor(result.status)}>
                          {result.status}
                        </Badge>
                        <span className={`font-medium ${getScoreColor(result.score)}`}>
                          {result.score.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    
                    <Progress value={result.score} className="mb-3" />
                    
                    {result.evidence.length > 0 && (
                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-green-700 mb-1">Evidence Found:</h5>
                        <ul className="text-sm space-y-1">
                          {/* @ts-expect-error - Parameter type mismatch */}
                          {result.evidence.map((evidence, index) => (
                            <li key={index} className="text-green-600">• {evidence}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {result.gaps.length > 0 && (
                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-red-700 mb-1">Gaps Identified:</h5>
                        <ul className="text-sm space-y-1">
                          {/* @ts-expect-error - Parameter type mismatch */}
                          {result.gaps.map((gap, index) => (
                            <li key={index} className="text-red-600">• {gap}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {result.recommendations.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-blue-700 mb-1">Recommendations:</h5>
                        <ul className="text-sm space-y-1">
                          {/* @ts-expect-error - Parameter type mismatch */}
                          {result.recommendations.map((rec, index) => (
                            <li key={index} className="text-blue-600">• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}