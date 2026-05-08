'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Target } from 'lucide-react';

interface CriticalControlPoint {
  id: string;
  ccpNumber: string;
  processStep: string;
  hazardType: 'biological' | 'chemical' | 'physical';
  controlMeasure: string;
  criticalLimits: string;
  monitoringProcedure: string;
  correctiveAction: string;
  verificationProcedure: string;
  records: string;
  responsiblePerson: string;
}

export function CriticalControlPointsForm() {
  const [ccps, setCcps] = useState<CriticalControlPoint[]>([]);
  const [newCcp, setNewCcp] = useState<Partial<CriticalControlPoint>>({
    ccpNumber: '',
    processStep: '',
    hazardType: 'biological',
    controlMeasure: '',
    criticalLimits: '',
    monitoringProcedure: '',
    correctiveAction: '',
    verificationProcedure: '',
    records: '',
    responsiblePerson: ''
  });

  const addCcp = () => {
    if (newCcp.ccpNumber && newCcp.processStep && newCcp.controlMeasure) {
      const ccp: CriticalControlPoint = {
        id: Date.now().toString(),
        ccpNumber: newCcp.ccpNumber,
        processStep: newCcp.processStep,
        hazardType: newCcp.hazardType as 'biological' | 'chemical' | 'physical',
        controlMeasure: newCcp.controlMeasure,
        criticalLimits: newCcp.criticalLimits || '',
        monitoringProcedure: newCcp.monitoringProcedure || '',
        correctiveAction: newCcp.correctiveAction || '',
        verificationProcedure: newCcp.verificationProcedure || '',
        records: newCcp.records || '',
        responsiblePerson: newCcp.responsiblePerson || ''
      };
      setCcps(prev => [...prev, ccp]);
      setNewCcp({
        ccpNumber: '',
        processStep: '',
        hazardType: 'biological',
        controlMeasure: '',
        criticalLimits: '',
        monitoringProcedure: '',
        correctiveAction: '',
        verificationProcedure: '',
        records: '',
        responsiblePerson: ''
      });
    }
  };

  const removeCcp = (id: string) => {
    setCcps(prev => prev.filter(c => c.id !== id));
  };

  const updateCcp = (id: string, updates: Partial<CriticalControlPoint>) => {
    setCcps(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Critical Control Points (CCPs)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Define points where control is essential to prevent hazards
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New CCP Form */}
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-semibold">Add New Critical Control Point</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ccpNumber">CCP Number</Label>
              <Input
                id="ccpNumber"
                value={newCcp.ccpNumber}
                onChange={(e) => setNewCcp(prev => ({ ...prev, ccpNumber: e.target.value }))}
                placeholder="e.g., CCP-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="processStep">Process Step</Label>
              <Input
                id="processStep"
                value={newCcp.processStep}
                onChange={(e) => setNewCcp(prev => ({ ...prev, processStep: e.target.value }))}
                placeholder="e.g., Cooking"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hazardType">Hazard Type</Label>
              <Select value={newCcp.hazardType} onValueChange={(value: any) => setNewCcp(prev => ({ ...prev, hazardType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="biological">Biological</SelectItem>
                  <SelectItem value="chemical">Chemical</SelectItem>
                  <SelectItem value="physical">Physical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsiblePerson">Responsible Person</Label>
              <Input
                id="responsiblePerson"
                value={newCcp.responsiblePerson}
                onChange={(e) => setNewCcp(prev => ({ ...prev, responsiblePerson: e.target.value }))}
                placeholder="Person responsible for this CCP"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="controlMeasure">Control Measure</Label>
            <Textarea
              id="controlMeasure"
              value={newCcp.controlMeasure}
              onChange={(e) => setNewCcp(prev => ({ ...prev, controlMeasure: e.target.value }))}
              placeholder="Describe the control measure"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="criticalLimits">Critical Limits</Label>
            <Textarea
              id="criticalLimits"
              value={newCcp.criticalLimits}
              onChange={(e) => setNewCcp(prev => ({ ...prev, criticalLimits: e.target.value }))}
              placeholder="Define the critical limits (e.g., temperature > 75°C)"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monitoringProcedure">Monitoring Procedure</Label>
            <Textarea
              id="monitoringProcedure"
              value={newCcp.monitoringProcedure}
              onChange={(e) => setNewCcp(prev => ({ ...prev, monitoringProcedure: e.target.value }))}
              placeholder="How will this CCP be monitored?"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="correctiveAction">Corrective Action</Label>
            <Textarea
              id="correctiveAction"
              value={newCcp.correctiveAction}
              onChange={(e) => setNewCcp(prev => ({ ...prev, correctiveAction: e.target.value }))}
              placeholder="What actions to take if limits are exceeded?"
              rows={2}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="verificationProcedure">Verification Procedure</Label>
              <Textarea
                id="verificationProcedure"
                value={newCcp.verificationProcedure}
                onChange={(e) => setNewCcp(prev => ({ ...prev, verificationProcedure: e.target.value }))}
                placeholder="How will the CCP effectiveness be verified?"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="records">Records</Label>
              <Textarea
                id="records"
                value={newCcp.records}
                onChange={(e) => setNewCcp(prev => ({ ...prev, records: e.target.value }))}
                placeholder="What records will be maintained?"
                rows={3}
              />
            </div>
          </div>

          <Button onClick={addCcp} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add CCP
          </Button>
        </div>

        {/* CCPs Table */}
        <div className="space-y-4">
          <h3 className="font-semibold">Defined Critical Control Points</h3>
          {ccps.length === 0 ? (
            <p className="text-muted-foreground">No CCPs defined yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CCP #</TableHead>
                  <TableHead>Process Step</TableHead>
                  <TableHead>Hazard Type</TableHead>
                  <TableHead>Control Measure</TableHead>
                  <TableHead>Critical Limits</TableHead>
                  <TableHead>Responsible</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ccps.map((ccp) => (
                  <TableRow key={ccp.id}>
                    <TableCell>
                      <Badge variant="default">{ccp.ccpNumber}</Badge>
                    </TableCell>
                    <TableCell>{ccp.processStep}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{ccp.hazardType}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{ccp.controlMeasure}</TableCell>
                    <TableCell className="max-w-xs truncate">{ccp.criticalLimits}</TableCell>
                    <TableCell>{ccp.responsiblePerson}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCcp(ccp.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}