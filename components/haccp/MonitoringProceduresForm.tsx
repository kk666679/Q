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
import { Plus, Trash2, Eye, Clock } from 'lucide-react';

interface MonitoringProcedure {
  id: string;
  ccpNumber: string;
  parameter: string;
  method: string;
  frequency: string;
  responsiblePerson: string;
  equipment: string;
  records: string;
  correctiveActionTrigger: string;
}

export function MonitoringProceduresForm() {
  const [procedures, setProcedures] = useState<MonitoringProcedure[]>([]);
  const [newProcedure, setNewProcedure] = useState<Partial<MonitoringProcedure>>({
    ccpNumber: '',
    parameter: '',
    method: '',
    frequency: '',
    responsiblePerson: '',
    equipment: '',
    records: '',
    correctiveActionTrigger: ''
  });

  const addProcedure = () => {
    if (newProcedure.ccpNumber && newProcedure.parameter && newProcedure.method) {
      const procedure: MonitoringProcedure = {
        id: Date.now().toString(),
        ccpNumber: newProcedure.ccpNumber,
        parameter: newProcedure.parameter,
        method: newProcedure.method,
        frequency: newProcedure.frequency || '',
        responsiblePerson: newProcedure.responsiblePerson || '',
        equipment: newProcedure.equipment || '',
        records: newProcedure.records || '',
        correctiveActionTrigger: newProcedure.correctiveActionTrigger || ''
      };
      setProcedures(prev => [...prev, procedure]);
      setNewProcedure({
        ccpNumber: '',
        parameter: '',
        method: '',
        frequency: '',
        responsiblePerson: '',
        equipment: '',
        records: '',
        correctiveActionTrigger: ''
      });
    }
  };

  const removeProcedure = (id: string) => {
    setProcedures(prev => prev.filter(p => p.id !== id));
  };

  const updateProcedure = (id: string, updates: Partial<MonitoringProcedure>) => {
    setProcedures(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Monitoring Procedures
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Define how CCPs will be monitored to ensure critical limits are met
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Monitoring Procedure Form */}
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-semibold">Add New Monitoring Procedure</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ccpNumber">CCP Number</Label>
              <Input
                id="ccpNumber"
                value={newProcedure.ccpNumber}
                onChange={(e) => setNewProcedure(prev => ({ ...prev, ccpNumber: e.target.value }))}
                placeholder="e.g., CCP-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parameter">Parameter to Monitor</Label>
              <Input
                id="parameter"
                value={newProcedure.parameter}
                onChange={(e) => setNewProcedure(prev => ({ ...prev, parameter: e.target.value }))}
                placeholder="e.g., Temperature"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="method">Monitoring Method</Label>
              <Input
                id="method"
                value={newProcedure.method}
                onChange={(e) => setNewProcedure(prev => ({ ...prev, method: e.target.value }))}
                placeholder="e.g., Digital thermometer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Monitoring Frequency</Label>
              <Select value={newProcedure.frequency} onValueChange={(value: any) => setNewProcedure(prev => ({ ...prev, frequency: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="continuous">Continuous</SelectItem>
                  <SelectItem value="every-15-min">Every 15 minutes</SelectItem>
                  <SelectItem value="every-30-min">Every 30 minutes</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="every-2-hours">Every 2 hours</SelectItem>
                  <SelectItem value="every-4-hours">Every 4 hours</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="per-batch">Per batch</SelectItem>
                  <SelectItem value="per-shift">Per shift</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="responsiblePerson">Responsible Person</Label>
              <Input
                id="responsiblePerson"
                value={newProcedure.responsiblePerson}
                onChange={(e) => setNewProcedure(prev => ({ ...prev, responsiblePerson: e.target.value }))}
                placeholder="Person responsible for monitoring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="equipment">Equipment Used</Label>
              <Input
                id="equipment"
                value={newProcedure.equipment}
                onChange={(e) => setNewProcedure(prev => ({ ...prev, equipment: e.target.value }))}
                placeholder="e.g., Thermometer model XYZ"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="records">Records/Maintenance</Label>
            <Textarea
              id="records"
              value={newProcedure.records}
              onChange={(e) => setNewProcedure(prev => ({ ...prev, records: e.target.value }))}
              placeholder="What records will be kept? How will equipment be maintained?"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="correctiveActionTrigger">Corrective Action Trigger</Label>
            <Textarea
              id="correctiveActionTrigger"
              value={newProcedure.correctiveActionTrigger}
              onChange={(e) => setNewProcedure(prev => ({ ...prev, correctiveActionTrigger: e.target.value }))}
              placeholder="When should corrective actions be initiated?"
              rows={2}
            />
          </div>

          <Button onClick={addProcedure} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Monitoring Procedure
          </Button>
        </div>

        {/* Monitoring Procedures Table */}
        <div className="space-y-4">
          <h3 className="font-semibold">Defined Monitoring Procedures</h3>
          {procedures.length === 0 ? (
            <p className="text-muted-foreground">No monitoring procedures defined yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CCP #</TableHead>
                  <TableHead>Parameter</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Responsible</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {procedures.map((procedure) => (
                  <TableRow key={procedure.id}>
                    <TableCell>
                      <Badge variant="default">{procedure.ccpNumber}</Badge>
                    </TableCell>
                    <TableCell>{procedure.parameter}</TableCell>
                    <TableCell>{procedure.method}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {procedure.frequency}
                      </div>
                    </TableCell>
                    <TableCell>{procedure.responsiblePerson}</TableCell>
                    <TableCell className="max-w-xs truncate">{procedure.equipment}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProcedure(procedure.id)}
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