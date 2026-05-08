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
import { Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

interface CorrectiveAction {
  id: string;
  ccpNumber: string;
  deviation: string;
  immediateAction: string;
  longTermAction: string;
  preventiveMeasures: string;
  responsiblePerson: string;
  verificationMethod: string;
  records: string;
  reviewFrequency: string;
}

export function CorrectiveActionsForm() {
  const [actions, setActions] = useState<CorrectiveAction[]>([]);
  const [newAction, setNewAction] = useState<Partial<CorrectiveAction>>({
    ccpNumber: '',
    deviation: '',
    immediateAction: '',
    longTermAction: '',
    preventiveMeasures: '',
    responsiblePerson: '',
    verificationMethod: '',
    records: '',
    reviewFrequency: ''
  });

  const addAction = () => {
    if (newAction.ccpNumber && newAction.deviation && newAction.immediateAction) {
      const action: CorrectiveAction = {
        id: Date.now().toString(),
        ccpNumber: newAction.ccpNumber,
        deviation: newAction.deviation,
        immediateAction: newAction.immediateAction,
        longTermAction: newAction.longTermAction || '',
        preventiveMeasures: newAction.preventiveMeasures || '',
        responsiblePerson: newAction.responsiblePerson || '',
        verificationMethod: newAction.verificationMethod || '',
        records: newAction.records || '',
        reviewFrequency: newAction.reviewFrequency || ''
      };
      setActions(prev => [...prev, action]);
      setNewAction({
        ccpNumber: '',
        deviation: '',
        immediateAction: '',
        longTermAction: '',
        preventiveMeasures: '',
        responsiblePerson: '',
        verificationMethod: '',
        records: '',
        reviewFrequency: ''
      });
    }
  };

  const removeAction = (id: string) => {
    setActions(prev => prev.filter(a => a.id !== id));
  };

  const updateAction = (id: string, updates: Partial<CorrectiveAction>) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Corrective Actions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Define actions to take when critical limits are exceeded
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Corrective Action Form */}
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-semibold">Add New Corrective Action</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ccpNumber">CCP Number</Label>
              <Input
                id="ccpNumber"
                value={newAction.ccpNumber}
                onChange={(e) => setNewAction(prev => ({ ...prev, ccpNumber: e.target.value }))}
                placeholder="e.g., CCP-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsiblePerson">Responsible Person</Label>
              <Input
                id="responsiblePerson"
                value={newAction.responsiblePerson}
                onChange={(e) => setNewAction(prev => ({ ...prev, responsiblePerson: e.target.value }))}
                placeholder="Person responsible for corrective actions"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deviation">Deviation/Problem Description</Label>
            <Textarea
              id="deviation"
              value={newAction.deviation}
              onChange={(e) => setNewAction(prev => ({ ...prev, deviation: e.target.value }))}
              placeholder="Describe the deviation from critical limits"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="immediateAction">Immediate Corrective Action</Label>
            <Textarea
              id="immediateAction"
              value={newAction.immediateAction}
              onChange={(e) => setNewAction(prev => ({ ...prev, immediateAction: e.target.value }))}
              placeholder="What immediate steps should be taken?"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longTermAction">Long-term Corrective Action</Label>
            <Textarea
              id="longTermAction"
              value={newAction.longTermAction}
              onChange={(e) => setNewAction(prev => ({ ...prev, longTermAction: e.target.value }))}
              placeholder="What changes should be made to prevent recurrence?"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preventiveMeasures">Preventive Measures</Label>
            <Textarea
              id="preventiveMeasures"
              value={newAction.preventiveMeasures}
              onChange={(e) => setNewAction(prev => ({ ...prev, preventiveMeasures: e.target.value }))}
              placeholder="How can this deviation be prevented in the future?"
              rows={2}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="verificationMethod">Verification Method</Label>
              <Textarea
                id="verificationMethod"
                value={newAction.verificationMethod}
                onChange={(e) => setNewAction(prev => ({ ...prev, verificationMethod: e.target.value }))}
                placeholder="How will the corrective action effectiveness be verified?"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reviewFrequency">Review Frequency</Label>
              <Select value={newAction.reviewFrequency} onValueChange={(value: any) => setNewAction(prev => ({ ...prev, reviewFrequency: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select review frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="records">Records and Documentation</Label>
            <Textarea
              id="records"
              value={newAction.records}
              onChange={(e) => setNewAction(prev => ({ ...prev, records: e.target.value }))}
              placeholder="What records should be maintained for this corrective action?"
              rows={2}
            />
          </div>

          <Button onClick={addAction} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Corrective Action
          </Button>
        </div>

        {/* Corrective Actions Table */}
        <div className="space-y-4">
          <h3 className="font-semibold">Defined Corrective Actions</h3>
          {actions.length === 0 ? (
            <p className="text-muted-foreground">No corrective actions defined yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CCP #</TableHead>
                  <TableHead>Deviation</TableHead>
                  <TableHead>Immediate Action</TableHead>
                  <TableHead>Responsible</TableHead>
                  <TableHead>Review Frequency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actions.map((action) => (
                  <TableRow key={action.id}>
                    <TableCell>
                      <Badge variant="default">{action.ccpNumber}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{action.deviation}</TableCell>
                    <TableCell className="max-w-xs truncate">{action.immediateAction}</TableCell>
                    <TableCell>{action.responsiblePerson}</TableCell>
                    <TableCell>{action.reviewFrequency}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAction(action.id)}
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