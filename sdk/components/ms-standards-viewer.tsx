'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { useMSStandards, useMSStandard, useCheckMSCompliance } from '../client/ms-hooks';

export function MSStandardsViewer() {
  const { data: standards } = useMSStandards();
  const [selectedCode, setSelectedCode] = useState<string>('MS ISO 9001:2015');
  const { data: standard } = useMSStandard(selectedCode);
  const checkCompliance = useCheckMSCompliance();
  const [complianceResult, setComplianceResult] = useState<any>(null);

  const handleCheckCompliance = async () => {
    if (!standard) return;
    
    const implemented = standard.requirements.slice(0, Math.floor(standard.requirements.length * 0.7));
    const result = await checkCompliance.mutateAsync({
      code: selectedCode,
      implementedRequirements: implemented,
    });
    setComplianceResult(result);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-12 gap-6"
    >
      <div className="col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>Malaysian Standards (MS)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {standards?.map((std) => (
              <Card
                key={std.code}
                className={`cursor-pointer transition-colors ${
                  selectedCode === std.code ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedCode(std.code)}
              >
                <CardContent className="p-3">
                  <div className="font-semibold text-sm">{std.code}</div>
                  <div className="text-xs text-gray-600 mt-1">{std.title}</div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {std.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {std.publishedYear}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="col-span-8 space-y-6">
        {standard && (
          <>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{standard.code}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{standard.title}</p>
                  </div>
                  <Button onClick={handleCheckCompliance}>
                    Check Compliance
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm text-gray-700">{standard.description}</p>
                  </div>

                  {standard.isoEquivalent && (
                    <div>
                      <h4 className="font-semibold mb-2">ISO Equivalent</h4>
                      <Badge>{standard.isoEquivalent}</Badge>
                    </div>
                  )}

                  {standard.revision && (
                    <div>
                      <h4 className="font-semibold mb-2">Revision</h4>
                      <Badge variant="outline">{standard.revision}</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requirements ({standard.requirements.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {standard.requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <span className="text-sm font-medium text-gray-500">
                        {index + 1}.
                      </span>
                      <span className="text-sm">{req}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Clauses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {standard.clauses.map((clause) => (
                    <div key={clause.number} className="border-l-4 border-blue-500 pl-4">
                      <div className="font-semibold">
                        Clause {clause.number}: {clause.title}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {clause.content}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {complianceResult && (
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Check Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{complianceResult.total}</div>
                        <div className="text-sm text-gray-600">Total Requirements</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {complianceResult.implemented}
                        </div>
                        <div className="text-sm text-gray-600">Implemented</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {complianceResult.missing.length}
                        </div>
                        <div className="text-sm text-gray-600">Missing</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Compliance Rate</span>
                        <span className="text-sm font-bold">
                          {complianceResult.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={complianceResult.percentage} />
                    </div>

                    {complianceResult.missing.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 text-red-700">
                          Missing Requirements:
                        </h4>
                        <ul className="space-y-1">
                          {complianceResult.missing.map((req: string, index: number) => (
                            <li key={index} className="text-sm text-red-600">
                              • {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}