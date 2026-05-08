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
import { Plus, Trash2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface Hazard {
  id: string;
  processStep: string;
  ingredient: string;
  hazardType: 'biological' | 'chemical' | 'physical';
  hazardDescription: string;
  severity: number;
  likelihood: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  controlMeasures: string;
  justification: string;
}

export function HazardAnalysisForm() {
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [newHazard, setNewHazard] = useState<Partial<Hazard>>({
    processStep: '',
    ingredient: '',
    hazardType: 'biological',
    hazardDescription: '',
    severity: 1,
    likelihood: 1,
    controlMeasures: '',
    justification: ''
  });

  const calculateRiskLevel = (severity: number, likelihood: number): 'low' | 'medium' | 'high' | 'critical' => {
    const riskScore = severity * likelihood;
    if (riskScore <= 4) return 'low';
    if (riskScore <= 9) return 'medium';
    if (riskScore <= 16) return 'high';
    return 'critical';
  };

  const addHazard = () => {
    if (newHazard.processStep && newHazard.ingredient && newHazard.hazardDescription) {
      const hazard: Hazard = {
        id: Date.now().toString(),
        processStep: newHazard.processStep,
        ingredient: newHazard.ingredient,
        hazardType: newHazard.hazardType as 'biological' | 'chemical' | 'physical',
        hazardDescription: newHazard.hazardDescription,
        severity: newHazard.severity || 1,
        likelihood: newHazard.likelihood || 1,
        riskLevel: calculateRiskLevel(newHazard.severity || 1, newHazard.likelihood || 1),
        controlMeasures: newHazard.controlMeasures || '',
        justification: newHazard.justification || ''
      };
      setHazards(prev => [...prev, hazard]);
      setNewHazard({
        processStep: '',
        ingredient: '',
        hazardType: 'biological',
        hazardDescription: '',
        severity: 1,
        likelihood: 1,
        controlMeasures: '',
        justification: ''
      });
    }
  };

  const removeHazard = (id: string) => {
    setHazards(prev => prev.filter(h => h.id !== id));
  };

  const updateHazard = (id: string, updates: Partial<Hazard>) => {
    setHazards(prev => prev.map(h => {
      if (h.id === id) {
        const updated = { ...h, ...updates };
        if (updates.severity !== undefined || updates.likelihood !== undefined) {
          updated.riskLevel = calculateRiskLevel(updated.severity, updated.likelihood);
        }
        return updated;
      }
      return h;
    }));
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'low': return 'secondary';
      case 'medium': return 'outline';
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'secondary';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'high': return <XCircle className="h-4 w-4 text-orange-500" />;
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hazard Analysis</CardTitle>
        <p className="text-sm text-muted-foreground">
          Identify and evaluate potential hazards in each process step
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Hazard Form */}
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-semibold">Add New Hazard</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="processStep">Process Step</Label>
              <Input
                id="processStep"
                value={newHazard.processStep}
                onChange={(e) => setNewHazard(prev => ({ ...prev, processStep: e.target.value }))}
                placeholder="e.g., Raw Material Receiving"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ingredient">Ingredient/Material</Label>
              <Input
                id="ingredient"
                value={newHazard.ingredient}
                onChange={(e) => setNewHazard(prev => ({ ...prev, ingredient: e.target.value }))}
                placeholder="e.g., Chicken Meat"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="hazardType">Hazard Type</Label>
              <Select value={newHazard.hazardType} onValueChange={(value: any) => setNewHazard(prev => ({ ...prev, hazardType: value }))}>
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
              <Label htmlFor="severity">Severity (1-5)</Label>
              <Select value={newHazard.severity?.toString()} onValueChange={(value) => setNewHazard(prev => ({ ...prev, severity: parseInt(value) }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Very Low</SelectItem>
                  <SelectItem value="2">2 - Low</SelectItem>
                  <SelectItem value="3">3 - Medium</SelectItem>
                  <SelectItem value="4">4 - High</SelectItem>
                  <SelectItem value="5">5 - Very High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="likelihood">Likelihood (1-5)</Label>
              <Select value={newHazard.likelihood?.toString()} onValueChange={(value) => setNewHazard(prev => ({ ...prev, likelihood: parseInt(value) }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Very Unlikely</SelectItem>
                  <SelectItem value="2">2 - Unlikely</SelectItem>
                  <SelectItem value="3">3 - Possible</SelectItem>
                  <SelectItem value="4">4 - Likely</SelectItem>
                  <SelectItem value="5">5 - Very Likely</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hazardDescription">Hazard Description</Label>
            <Textarea
              id="hazardDescription"
              value={newHazard.hazardDescription}
              onChange={(e) => setNewHazard(prev => ({ ...prev, hazardDescription: e.target.value }))}
              placeholder="Describe the specific hazard"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="controlMeasures">Control Measures</Label>
            <Textarea
              id="controlMeasures"
              value={newHazard.controlMeasures}
              onChange={(e) => setNewHazard(prev => ({ ...prev, controlMeasures: e.target.value }))}
              placeholder="Describe preventive measures"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="justification">Justification</Label>
            <Textarea
              id="justification"
              value={newHazard.justification}
              onChange={(e) => setNewHazard(prev => ({ ...prev, justification: e.target.value }))}
              placeholder="Why is this control measure sufficient?"
              rows={2}
            />
          </div>

          <Button onClick={addHazard} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Hazard
          </Button>
        </div>

        {/* Hazards Table */}
        <div className="space-y-4">
          <h3 className="font-semibold">Identified Hazards</h3>
          {hazards.length === 0 ? (
            <p className="text-muted-foreground">No hazards identified yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Process Step</TableHead>
                  <TableHead>Ingredient</TableHead>
                  <TableHead>Hazard Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hazards.map((hazard) => (
                  <TableRow key={hazard.id}>
                    <TableCell>{hazard.processStep}</TableCell>
                    <TableCell>{hazard.ingredient}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{hazard.hazardType}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{hazard.hazardDescription}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRiskIcon(hazard.riskLevel)}
                        <Badge variant={getRiskBadgeVariant(hazard.riskLevel)}>
                          {hazard.riskLevel}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHazard(hazard.id)}
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