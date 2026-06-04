'use client';
import * as React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppHeader } from '@/components/sidebar/app-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, CheckCircle2, Plus } from 'lucide-react';
import type { ConnectorDef } from '@/components/automation/shared/types';

const CONNECTORS: ConnectorDef[] = [
  // Databases
  { id:'pg',         name:'PostgreSQL',   category:'database', icon:'🐘', description:'Full read/write with schema sync and CDC.',          authType:'basic',  configSchema:{} },
  { id:'mysql',      name:'MySQL',        category:'database', icon:'🐬', description:'MySQL 8+ connector with streaming support.',         authType:'basic',  configSchema:{} },
  { id:'mssql',      name:'SQL Server',   category:'database', icon:'🪟', description:'MSSQL 2019+ bulk load and CDC.',                    authType:'basic',  configSchema:{} },
  { id:'oracle',     name:'Oracle',       category:'database', icon:'🔴', description:'Oracle 19c+ connector with partitioned reads.',      authType:'basic',  configSchema:{} },
  { id:'mongo',      name:'MongoDB',      category:'database', icon:'🍃', description:'Document store with aggregation pipeline push.',     authType:'basic',  configSchema:{} },
  { id:'redis',      name:'Redis',        category:'database', icon:'⚡', description:'Key-value cache and pub/sub trigger.',               authType:'apikey', configSchema:{} },
  { id:'snowflake',  name:'Snowflake',    category:'database', icon:'❄️', description:'Cloud DW — bulk load, unload, task integration.',    authType:'oauth',  configSchema:{} },
  // Storage
  { id:'s3',         name:'Amazon S3',    category:'storage',  icon:'🪣', description:'S3 read/write with prefix, format and event triggers.',authType:'apikey',configSchema:{} },
  { id:'azblob',     name:'Azure Blob',   category:'storage',  icon:'☁️', description:'Azure Blob Storage with SAS token support.',         authType:'apikey', configSchema:{} },
  { id:'gcs',        name:'GCS',          category:'storage',  icon:'🌐', description:'Google Cloud Storage connector.',                    authType:'oauth',  configSchema:{} },
  { id:'sharepoint', name:'SharePoint',   category:'storage',  icon:'📄', description:'SharePoint lists, libraries and document sets.',     authType:'oauth',  configSchema:{} },
  { id:'onedrive',   name:'OneDrive',     category:'storage',  icon:'💾', description:'OneDrive file read/write via Microsoft Graph.',      authType:'oauth',  configSchema:{} },
  // CRM / ERP
  { id:'salesforce', name:'Salesforce',   category:'crm',      icon:'☁️', description:'Objects, bulk API v2, Salesforce Flow triggers.',    authType:'oauth',  configSchema:{} },
  { id:'hubspot',    name:'HubSpot',      category:'crm',      icon:'🟠', description:'CRM contacts, deals, properties and webhooks.',      authType:'apikey', configSchema:{} },
  { id:'sap',        name:'SAP',          category:'erp',      icon:'🔷', description:'SAP S/4HANA RFC and OData connector.',              authType:'basic',  configSchema:{} },
  { id:'dynamics',   name:'Dynamics 365', category:'erp',      icon:'🔵', description:'Dynamics CE and Finance via Dataverse.',            authType:'oauth',  configSchema:{} },
  { id:'quickbooks', name:'QuickBooks',   category:'erp',      icon:'🟢', description:'QuickBooks Online accounting and invoices.',        authType:'oauth',  configSchema:{} },
  // DevOps / Messaging
  { id:'jira',       name:'Jira',         category:'devops',   icon:'🔵', description:'Issues, sprints, transitions and webhooks.',         authType:'apikey', configSchema:{} },
  { id:'servicenow', name:'ServiceNow',   category:'devops',   icon:'🟢', description:'ITSM incidents, changes and CMDB.',                 authType:'basic',  configSchema:{} },
];

const INSTALLED = new Set(['pg','s3','salesforce','jira']);

const CAT_LABELS: Record<string,string> = {
  database:'Databases', storage:'Storage', crm:'CRM', erp:'ERP', devops:'DevOps', messaging:'Messaging', analytics:'Analytics',
};

export default function IntegrationsPage() {
  const [q, setQ] = React.useState('');
  const [cat, setCat] = React.useState('all');

  const filtered = CONNECTORS.filter(c =>
    (cat === 'all' || c.category === cat) &&
    (!q || c.name.toLowerCase().includes(q.toLowerCase()))
  );

  const categories = ['all', ...Array.from(new Set(CONNECTORS.map(c => c.category)))];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Integrations" description="Connect databases, storage, CRM, ERP, messaging and DevOps tools" />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-6xl space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search connectors…" value={q} onChange={e => setQ(e.target.value)} className="pl-8 h-8 text-xs" />
              </div>
              <Tabs value={cat} onValueChange={setCat}>
                <TabsList className="h-8 flex-wrap">
                  {categories.map(c => (
                    <TabsTrigger key={c} value={c} className="text-xs capitalize">
                      {c === 'all' ? 'All' : CAT_LABELS[c] ?? c}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map(c => (
                <Card key={c.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4 pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{c.icon}</span>
                        <div>
                          <p className="text-sm font-semibold">{c.name}</p>
                          <p className="text-[10px] text-muted-foreground capitalize">{CAT_LABELS[c.category] ?? c.category} · {c.authType}</p>
                        </div>
                      </div>
                      {INSTALLED.has(c.id)
                        ? <Badge className="text-[10px] bg-emerald-500/10 text-emerald-700 border-emerald-200 gap-1 flex-shrink-0">
                            <CheckCircle2 className="h-2.5 w-2.5"/>Connected
                          </Badge>
                        : <Button size="sm" className="h-6 text-[10px] flex-shrink-0 gap-1">
                            <Plus className="h-3 w-3"/>Connect
                          </Button>
                      }
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{c.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
