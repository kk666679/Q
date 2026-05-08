'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Save, FileText } from 'lucide-react';
import { HazardAnalysisForm } from './HazardAnalysisForm';
import { CriticalControlPointsForm } from './CriticalControlPointsForm';
import { MonitoringProceduresForm } from './MonitoringProceduresForm';
import { CorrectiveActionsForm } from './CorrectiveActionsForm';
import { VerificationProceduresForm } from './VerificationProceduresForm';

interface HACCPPlan {
  id: string;
  productName: string;
  productDescription: string;
  intendedUse: string;
  processFlow: string;
  teamMembers: string[];
  dateCreated: string;
  lastUpdated: string;
  status: 'draft' | 'active' | 'review' | 'archived';
}

export function HACCPPlanForm() {
  const [plan, setPlan] = useState<HACCPPlan>({
    id: '',
    productName: '',
    productDescription: '',
    intendedUse: '',
    processFlow: '',
    teamMembers: [],
    dateCreated: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    status: 'draft'
  });

  const [newTeamMember, setNewTeamMember] = useState('');

  const handleSave = () => {
    // Save logic here
    console.log('Saving HACCP Plan:', plan);
  };

  const addTeamMember = () => {
    if (newTeamMember.trim()) {
      setPlan(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, newTeamMember.trim()],
        lastUpdated: new Date().toISOString().split('T')[0]
      }));
      setNewTeamMember('');
    }
  };

  const removeTeamMember = (index: number) => {
    setPlan(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index),
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            HACCP Plan Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={plan.productName}
                onChange={(e) => setPlan(prev => ({ ...prev, productName: e.target.value }))}
                placeholder="Enter product name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={plan.status} onValueChange={(value: any) => setPlan(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="review">Under Review</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="productDescription">Product Description</Label>
            <Textarea
              id="productDescription"
              value={plan.productDescription}
              onChange={(e) => setPlan(prev => ({ ...prev, productDescription: e.target.value }))}
              placeholder="Describe the product and its characteristics"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="intendedUse">Intended Use</Label>
            <Textarea
              id="intendedUse"
              value={plan.intendedUse}
              onChange={(e) => setPlan(prev => ({ ...prev, intendedUse: e.target.value }))}
              placeholder="Describe how the product will be used"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="processFlow">Process Flow Description</Label>
            <Textarea
              id="processFlow"
              value={plan.processFlow}
              onChange={(e) => setPlan(prev => ({ ...prev, processFlow: e.target.value }))}
              placeholder="Describe the manufacturing process flow"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>HACCP Team Members</Label>
            <div className="flex gap-2">
              <Input
                value={newTeamMember}
                onChange={(e) => setNewTeamMember(e.target.value)}
                placeholder="Add team member"
                onKeyPress={(e) => e.key === 'Enter' && addTeamMember()}
              />
              <Button onClick={addTeamMember} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {plan.teamMembers.map((member, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {member}
                  <Trash2
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeTeamMember(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Date Created</Label>
              <Input
                type="date"
                value={plan.dateCreated}
                onChange={(e) => setPlan(prev => ({ ...prev, dateCreated: e.target.value }))}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label>Last Updated</Label>
              <Input
                type="date"
                value={plan.lastUpdated}
                onChange={(e) => setPlan(prev => ({ ...prev, lastUpdated: e.target.value }))}
                readOnly
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="hazard-analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hazard-analysis">Hazard Analysis</TabsTrigger>
          <TabsTrigger value="ccp">Critical Control Points</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="corrective">Corrective Actions</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="hazard-analysis">
          <HazardAnalysisForm />
        </TabsContent>

        <TabsContent value="ccp">
          <CriticalControlPointsForm />
        </TabsContent>

        <TabsContent value="monitoring">
          <MonitoringProceduresForm />
        </TabsContent>

        <TabsContent value="corrective">
          <CorrectiveActionsForm />
        </TabsContent>

        <TabsContent value="verification">
          <VerificationProceduresForm />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save HACCP Plan
        </Button>
      </div>
    </div>
  );
}