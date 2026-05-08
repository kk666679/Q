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
import { Plus, Trash2, CheckCircle2, Calendar } from 'lucide-react';

interface VerificationProcedure {
  id: string;
  procedureName: string;
  description: string;
  frequency: string;
  method: string;
  responsiblePerson: string;
  acceptanceCriteria: string;
  records: string;
  lastVerification: string;
  nextVerification: string;
  status: 'pending' | 'completed' | 'overdue';
}

export function VerificationProceduresForm() {
  const [procedures, setProcedures] = useState<VerificationProcedure[]>([]);
  const [newProcedure, setNewProcedure] = useState<Partial<VerificationProcedure>>({
    procedureName: '',
    description: '',
    frequency: '',
    method: '',
    responsiblePerson: '',
    acceptanceCriteria: '',
    records: '',
    lastVerification: '',
    nextVerification: '',
    status: 'pending'
  });

  const addProcedure = () => {
    if (newProcedure.procedureName && newProcedure.description && newProcedure.method) {
      const procedure: VerificationProcedure = {
        id: Date.now().toString(),
        procedureName: newProcedure.procedureName,
        description: newProcedure.description,
        frequency: newProcedure.frequency || '',
        method: newProcedure.method,
        responsiblePerson: newProcedure.responsiblePerson || '',
        acceptanceCriteria: newProcedure.acceptanceCriteria || '',
        records: newProcedure.records || '',
        lastVerification: newProcedure.lastVerification || '',
        nextVerification: newProcedure.nextVerification || '',
        status: newProcedure.status as 'pending' | 'completed' | 'overdue' || 'pending'
      };
      setProcedures(prev => [...prev, procedure]);
      setNewProcedure({
        procedureName: '',
        description: '',
        frequency: '',
        method: '',
        responsiblePerson: '',
        acceptanceCriteria: '',
        records: '',
        lastVerification: '',
        nextVerification: '',
        status: 'pending'
      });
    }
  };

  const removeProcedure = (id: string) => {
    setProcedures(prev => prev.filter(p => p.id !== id));
  };

  const updateProcedure = (id: string, updates: Partial<VerificationProcedure>) => {
    setProcedures(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          Verification Procedures
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Define procedures to verify that the HACCP system is working effectively
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Verification Procedure Form */}
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-semibold">Add New Verification Procedure</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="procedureName">Procedure Name</Label>
              <Input
                id="procedureName"
                value={newProcedure.procedureName}
                onChange={(e) => setNewProcedure(prev => ({ ...prev, procedureName: e.target.value }))}
                placeholder="e.g., CCP Validation Check"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsiblePerson">Responsible Person</Label>
              <Input
                id="responsiblePerson"
                value={newProcedure.responsiblePerson}
                onChange={(e) => setNewProcedure(prev => ({ ...prev, responsiblePerson: e.target.value }))}
                placeholder="Person responsible for verification"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newProcedure.description}
              onChange={(e) => setNewProcedure(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this verification procedure checks"
              rows={2}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="frequency">Verification Frequency</Label>
              <Select value={newProcedure.frequency} onValueChange={(value: any) => setNewProcedure(prev => ({ ...prev, frequency: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="semi-annually">Semi-annually</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                  <SelectItem value="as-needed">As needed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">Verification Method</Label>
              <Input
                id="method"
                value={newProcedure.method}
                onChange={(e) => setNewProcedure(prev => ({ ...prev, method: e.target.value }))}
                placeholder="e.g., Audit, Testing, Review"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="acceptanceCriteria">Acceptance Criteria</Label>
            <Textarea
              id="acceptanceCriteria"
              value={newProcedure.acceptanceCriteria}
              onChange={(e) => setNewProcedure(prev => ({ ...prev, acceptanceCriteria: e.target.value }))}
              placeholder="What criteria determine if verification passes?"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="records">Records and Documentation</Label>
            <Textarea
              id="records"
              value={newProcedure.records}
              onChange={(e) => setNewProcedure(prev => ({ ...prev, records: e.target.value }))}
              placeholder="What records will be maintained from this verification?"
              rows={2}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="lastVerification">Last Verification Date</Label>
              <Input
                id="lastVerification"
                type="date"
                value={newProcedure.lastVerification}
                onChange={(e) => setNewProcedure(prev => ({ ...prev, lastVerification: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextVerification">Next Verification Date</Label>
              <Input
                id="nextVerification"
                type="date"
                value={newProcedure.nextVerification}
                onChange={(e) => setNewProcedure(prev => ({ ...prev, nextVerification: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={newProcedure.status} onValueChange={(value: any) => setNewProcedure(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={addProcedure} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Verification Procedure
          </Button>
        </div>

        {/* Verification Procedures Table */}
        <div className="space-y-4">
          <h3 className="font-semibold">Defined Verification Procedures</h3>
          {procedures.length === 0 ? (
            <p className="text-muted-foreground">No verification procedures defined yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Procedure Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Responsible</TableHead>
                  <TableHead>Next Verification</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {procedures.map((procedure) => (
                  <TableRow key={procedure.id}>
                    <TableCell className="font-medium">{procedure.procedureName}</TableCell>
                    <TableCell className="max-w-xs truncate">{procedure.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {procedure.frequency}
                      </div>
                    </TableCell>
                    <TableCell>{procedure.method}</TableCell>
                    <TableCell>{procedure.responsiblePerson}</TableCell>
                    <TableCell>{procedure.nextVerification || 'Not scheduled'}</TableCell>
                    <TableCell>{getStatusBadge(procedure.status)}</TableCell>
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