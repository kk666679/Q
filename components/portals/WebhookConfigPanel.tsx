'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Webhook, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface WebhookEntry {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  lastFired?: string;
}

const EVENT_OPTIONS = [
  'document.created', 'document.approved', 'capa.created', 'capa.closed',
  'audit.generated', 'compliance.checked', 'risk.assessed', 'nonconformity.raised',
];

export function WebhookConfigPanel() {
  const [webhooks, setWebhooks] = useState<WebhookEntry[]>([
    {
      id: 'wh-1',
      name: 'SAP ERP Integration',
      url: 'https://erp.example.com/api/qms-events',
      events: ['document.created', 'capa.created'],
      active: true,
      lastFired: '2026-05-24 14:32',
    },
  ]);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const toggleEvent = (ev: string) =>
    setSelectedEvents((prev) => (prev.includes(ev) ? prev.filter((e) => e !== ev) : [...prev, ev]));

  const addWebhook = () => {
    if (!newName || !newUrl || selectedEvents.length === 0) return;
    setWebhooks((prev) => [
      ...prev,
      { id: `wh-${Date.now()}`, name: newName, url: newUrl, events: selectedEvents, active: true },
    ]);
    setNewName('');
    setNewUrl('');
    setSelectedEvents([]);
  };

  const removeWebhook = (id: string) => setWebhooks((prev) => prev.filter((w) => w.id !== id));
  const toggleActive = (id: string) =>
    setWebhooks((prev) => prev.map((w) => (w.id === id ? { ...w, active: !w.active } : w)));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webhook className="h-5 w-5 text-orange-500" />
          ERP / Webhook Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing webhooks */}
        <div className="space-y-2">
          {webhooks.map((wh) => (
            <div key={wh.id} className="rounded-lg border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {wh.active ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400" />
                  )}
                  <p className="font-medium text-sm">{wh.name}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toggleActive(wh.id)}>
                    {wh.active ? 'Disable' : 'Enable'}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 text-red-500 hover:text-red-700" onClick={() => removeWebhook(wh.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-mono truncate">{wh.url}</p>
              <div className="flex flex-wrap gap-1">
                {wh.events.map((ev) => (
                  <Badge key={ev} variant="secondary" className="text-xs">{ev}</Badge>
                ))}
              </div>
              {wh.lastFired && (
                <p className="text-xs text-muted-foreground">Last fired: {wh.lastFired}</p>
              )}
            </div>
          ))}
        </div>

        {/* Add new */}
        <div className="rounded-lg border border-dashed p-3 space-y-3">
          <p className="text-sm font-medium">Add Webhook</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Name</Label>
              <Input placeholder="e.g. SAP ERP" value={newName} onChange={(e) => setNewName(e.target.value)} className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Endpoint URL</Label>
              <Input placeholder="https://..." value={newUrl} onChange={(e) => setNewUrl(e.target.value)} className="h-8 text-xs" />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Events to fire</Label>
            <div className="flex flex-wrap gap-1.5">
              {EVENT_OPTIONS.map((ev) => (
                <Button
                  key={ev}
                  variant={selectedEvents.includes(ev) ? 'default' : 'outline'}
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => toggleEvent(ev)}
                >
                  {ev}
                </Button>
              ))}
            </div>
          </div>
          <Button size="sm" onClick={addWebhook} disabled={!newName || !newUrl || selectedEvents.length === 0}>
            <Plus className="h-4 w-4 mr-1" /> Add Webhook
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Webhooks fire a POST request with JSON payload to your ERP/legacy system on each selected event.
          Compatible with SAP, Oracle, SQL Accounting, AutoCount, and any REST endpoint.
        </p>
      </CardContent>
    </Card>
  );
}
