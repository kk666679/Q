'use client';
import * as React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppHeader } from '@/components/sidebar/app-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Key, Shield, Building2, Settings, ScrollText, Lock } from 'lucide-react';
import type { TenantUser, ApiKey, Tenant } from '@/components/automation/shared/types';

const USERS: TenantUser[] = [
  { id:'u1', name:'Ahmad Razif',    email:'ahmad@acme.com',   role:'admin',     tenantId:'t1', createdAt:'2025-01-10' },
  { id:'u2', name:'Siti Aminah',    email:'siti@acme.com',    role:'developer', tenantId:'t1', createdAt:'2025-02-14' },
  { id:'u3', name:'Raj Kumar',      email:'raj@acme.com',     role:'analyst',   tenantId:'t1', createdAt:'2025-03-05' },
  { id:'u4', name:'Lim Wei Ling',   email:'lim@acme.com',     role:'approver',  tenantId:'t1', createdAt:'2025-04-20' },
  { id:'u5', name:'Fatimah Zahra',  email:'fatimah@acme.com', role:'viewer',    tenantId:'t1', createdAt:'2025-05-01' },
];

const API_KEYS: ApiKey[] = [
  { id:'k1', name:'CI/CD Pipeline',   prefix:'qms_live_***', tenantId:'t1', createdAt:'2025-03-01', lastUsed:'2025-05-24', scopes:['workflows:read','workflows:run'] },
  { id:'k2', name:'Analytics Service',prefix:'qms_live_***', tenantId:'t1', createdAt:'2025-04-10', lastUsed:'2025-05-23', scopes:['catalog:read','models:read'] },
  { id:'k3', name:'LHDN Integration', prefix:'qms_live_***', tenantId:'t1', createdAt:'2025-05-15', scopes:['integrations:write'] },
];

const ROLE_COLOR: Record<string,string> = {
  admin:'bg-red-500/10 text-red-700',
  developer:'bg-blue-500/10 text-blue-700',
  analyst:'bg-purple-500/10 text-purple-700',
  approver:'bg-amber-500/10 text-amber-700',
  viewer:'bg-muted text-muted-foreground',
};

const ENVS = [
  { name:'production', status:'healthy', version:'v2.4.1', updated:'2025-05-24' },
  { name:'staging',    status:'healthy', version:'v2.4.2', updated:'2025-05-23' },
  { name:'dev',        status:'degraded',version:'v2.5.0', updated:'2025-05-22' },
];

const AUDIT_LOG = [
  { user:'ahmad@acme.com', action:'Deployed workflow lhdn-einvoice-v3', at:'2025-05-24 08:02', level:'info' },
  { user:'siti@acme.com',  action:'Created API key for CI/CD Pipeline',  at:'2025-05-23 17:44', level:'info' },
  { user:'raj@acme.com',   action:'Exported catalog asset orders_fact',  at:'2025-05-23 15:11', level:'info' },
  { user:'system',         action:'Workflow hr-compliance-v3 failed SLA',at:'2025-05-23 09:05', level:'warn' },
];

export default function AdministrationPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Administration" description="Users · RBAC · API Keys · Secrets · Environments · Audit" />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-6xl space-y-4">
            <Tabs defaultValue="users">
              <TabsList className="h-8 flex-wrap">
                <TabsTrigger value="users"   className="text-xs gap-1"><Users className="h-3 w-3"/>Users</TabsTrigger>
                <TabsTrigger value="apikeys" className="text-xs gap-1"><Key className="h-3 w-3"/>API Keys</TabsTrigger>
                <TabsTrigger value="secrets" className="text-xs gap-1"><Lock className="h-3 w-3"/>Secrets</TabsTrigger>
                <TabsTrigger value="envs"    className="text-xs gap-1"><Settings className="h-3 w-3"/>Environments</TabsTrigger>
                <TabsTrigger value="audit"   className="text-xs gap-1"><ScrollText className="h-3 w-3"/>Audit Log</TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="mt-4">
                <div className="flex justify-end mb-3">
                  <Button size="sm" className="h-7 text-xs">+ Invite User</Button>
                </div>
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/40 border-b">
                      <tr>{['Name','Email','Role','Joined',''].map(h => (
                        <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody>
                      {USERS.map(u => (
                        <tr key={u.id} className="border-b hover:bg-muted/20">
                          <td className="px-3 py-2 font-medium">{u.name}</td>
                          <td className="px-3 py-2 text-muted-foreground">{u.email}</td>
                          <td className="px-3 py-2">
                            <Badge className={`text-[10px] ${ROLE_COLOR[u.role]}`}>{u.role}</Badge>
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">{u.createdAt}</td>
                          <td className="px-3 py-2">
                            <Button size="sm" variant="ghost" className="h-6 text-[10px]">Edit</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="apikeys" className="mt-4 space-y-2">
                <div className="flex justify-end mb-1">
                  <Button size="sm" className="h-7 text-xs">+ Create Key</Button>
                </div>
                {API_KEYS.map(k => (
                  <Card key={k.id}>
                    <CardContent className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold">{k.name}</p>
                        <p className="font-mono text-[11px] text-muted-foreground">{k.prefix}</p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {k.scopes.map(s => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[10px] text-muted-foreground">Created {k.createdAt}</p>
                        {k.lastUsed && <p className="text-[10px] text-muted-foreground">Last used {k.lastUsed}</p>}
                        <Button size="sm" variant="ghost" className="h-6 text-[10px] text-destructive mt-1">Revoke</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="secrets" className="mt-4">
                <Card>
                  <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Lock className="h-4 w-4"/>Secrets Vault</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {['OPENAI_API_KEY','LHDN_CLIENT_SECRET','SNOWFLAKE_PASSWORD','SMTP_PASSWORD'].map(s => (
                      <div key={s} className="flex items-center justify-between rounded border p-2.5">
                        <div className="flex items-center gap-2">
                          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-mono text-xs">{s}</span>
                        </div>
                        <div className="flex gap-1.5">
                          <Badge variant="outline" className="text-[10px]">encrypted</Badge>
                          <Button size="sm" variant="ghost" className="h-6 text-[10px]">Rotate</Button>
                        </div>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" className="h-7 text-xs">+ Add Secret</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="envs" className="mt-4 space-y-2">
                {ENVS.map(e => (
                  <Card key={e.name}>
                    <CardContent className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold capitalize">{e.name}</p>
                        <p className="text-[11px] text-muted-foreground">Version: {e.version} · Updated: {e.updated}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-[10px] ${e.status === 'healthy' ? 'bg-emerald-500/10 text-emerald-700' : 'bg-amber-500/10 text-amber-700'}`}>
                          {e.status}
                        </Badge>
                        <Button size="sm" variant="ghost" className="h-6 text-[10px]">Manage</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="audit" className="mt-4">
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/40 border-b">
                      <tr>{['User','Action','Timestamp','Level'].map(h => (
                        <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody>
                      {AUDIT_LOG.map((a, i) => (
                        <tr key={i} className="border-b hover:bg-muted/20">
                          <td className="px-3 py-2 font-medium">{a.user}</td>
                          <td className="px-3 py-2 text-muted-foreground">{a.action}</td>
                          <td className="px-3 py-2 text-muted-foreground">{a.at}</td>
                          <td className="px-3 py-2">
                            <Badge className={`text-[10px] ${a.level === 'warn' ? 'bg-amber-500/10 text-amber-700' : 'bg-muted text-muted-foreground'}`}>
                              {a.level}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
