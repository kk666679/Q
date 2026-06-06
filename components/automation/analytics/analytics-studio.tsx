'use client';
import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, PieChart, Gauge, Users, Plus, GripVertical, X } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  AreaChart, Area, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import type { KPIDefinition, DashboardWidget } from '../shared/types';

// ── Sample data ───────────────────────────────────────────────────────────────
const MONTHLY = [
  { month:'Jan', revenue:320000, cost:210000, margin:34 },
  { month:'Feb', revenue:380000, cost:230000, margin:39 },
  { month:'Mar', revenue:410000, cost:245000, margin:40 },
  { month:'Apr', revenue:360000, cost:220000, margin:39 },
  { month:'May', revenue:450000, cost:260000, margin:42 },
  { month:'Jun', revenue:490000, cost:275000, margin:44 },
];

const FORECAST = [
  { month:'May', actual:450000, forecast:448000 },
  { month:'Jun', actual:490000, forecast:485000 },
  { month:'Jul', actual: null,  forecast:512000 },
  { month:'Aug', actual: null,  forecast:538000 },
  { month:'Sep', actual: null,  forecast:561000 },
];

const SEGMENTS = [
  { name:'Enterprise', value:42 },
  { name:'Mid-Market', value:31 },
  { name:'SMB',        value:18 },
  { name:'Startup',    value:9  },
];

const COHORT = ['Jan','Feb','Mar','Apr','May'].map((m, i) => ({
  month: m,
  w0: 100, w1: 78 - i*3, w2: 61 - i*4, w3: 52 - i*4, w4: 46 - i*3,
}));

const COLORS = ['#3b82f6','#10b981','#f59e0b','#ec4899','#8b5cf6','#06b6d4'];

// ── KPI Evaluator ─────────────────────────────────────────────────────────────
function evalFormula(formula: string, row: Record<string, number>): number | null {
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function(...Object.keys(row), `return ${formula}`);
    const result = fn(...Object.values(row));
    return typeof result === 'number' ? Math.round(result * 100) / 100 : null;
  } catch { return null; }
}

const SAMPLE_ROW = { revenue: 490000, cost: 275000, customers: 1240, churned: 38 };

function KPIBuilder() {
  const [kpis, setKpis] = React.useState<KPIDefinition[]>([
    { id:'k1', name:'Gross Margin %',     formula:'((revenue - cost) / revenue) * 100', target:40, unit:'%',   owner:'Finance' },
    { id:'k2', name:'Churn Rate',         formula:'(churned / customers) * 100',        target:3,  unit:'%',   owner:'CX' },
    { id:'k3', name:'Revenue per Customer',formula:'revenue / customers',               target:400, unit:'RM', owner:'Sales' },
  ]);
  const [name, setName] = React.useState('');
  const [formula, setFormula] = React.useState('');
  const [target, setTarget] = React.useState('');
  const [unit, setUnit] = React.useState('%');

  const add = () => {
    if (!name || !formula) return;
    setKpis(prev => [...prev, { id:`k${Date.now()}`, name, formula, target: Number(target), unit, owner:'me' }]);
    setName(''); setFormula(''); setTarget('');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {kpis.map(k => {
          const val = evalFormula(k.formula, SAMPLE_ROW);
          const ok = val != null && val <= k.target + (k.target * 0.1);
          return (
            <Card key={k.id}>
              <CardHeader className="pb-1">
                <CardTitle className="text-xs text-muted-foreground flex items-center justify-between">
                  {k.name}
                  <Badge variant="outline" className="text-[10px]">{k.owner}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className={`text-2xl font-bold ${ok ? 'text-emerald-600':'text-red-500'}`}>
                  {val != null ? `${val}${k.unit}` : '—'}
                </p>
                <p className="text-[10px] text-muted-foreground">Target: {k.target}{k.unit}</p>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5 truncate">{k.formula}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add KPI form */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">+ Define KPI</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-2 items-end">
          <div className="space-y-1">
            <Label className="text-xs">Name</Label>
            <Input value={name} onChange={e=>setName(e.target.value)} className="h-7 text-xs" placeholder="KPI name"/>
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label className="text-xs">Formula (JS — use: revenue, cost, customers, churned)</Label>
            <Input value={formula} onChange={e=>setFormula(e.target.value)} className="h-7 text-xs font-mono" placeholder="(revenue - cost) / revenue * 100"/>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Target</Label>
            <Input value={target} onChange={e=>setTarget(e.target.value)} className="h-7 text-xs" type="number"/>
          </div>
          <Button onClick={add} size="sm" className="h-7 text-xs gap-1 col-span-2 md:col-span-1">
            <Plus className="h-3 w-3"/>Add
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Dashboard Canvas ──────────────────────────────────────────────────────────
interface DashItem extends DashboardWidget { order: number; }

const WIDGET_PRESETS: DashboardWidget[] = [
  { id:'w1', type:'chart', title:'Monthly Revenue', dataSource:'monthly', config:{chartType:'bar'} },
  { id:'w2', type:'chart', title:'Margin Trend',    dataSource:'monthly', config:{chartType:'line'} },
  { id:'w3', type:'chart', title:'Segments',        dataSource:'segments',config:{chartType:'pie'} },
  { id:'w4', type:'kpi',   title:'Gross Margin %',  dataSource:'kpi',     config:{formula:'((revenue-cost)/revenue)*100',unit:'%'} },
];

function DashboardCanvas() {
  const [widgets, setWidgets] = React.useState<DashItem[]>(
    WIDGET_PRESETS.map((w, i) => ({ ...w, order: i }))
  );
  const [chartType, setChartType] = React.useState('bar');
  const dragItem = React.useRef<number | null>(null);
  const dragOver = React.useRef<number | null>(null);

  const removeWidget = (id: string) => setWidgets(ws => ws.filter(w => w.id !== id));

  const handleDragStart = (order: number) => { dragItem.current = order; };
  const handleDragEnter = (order: number) => { dragOver.current = order; };
  const handleDrop = () => {
    if (dragItem.current == null || dragOver.current == null) return;
    setWidgets(ws => {
      const updated = [...ws];
      const from = updated.findIndex(w => w.order === dragItem.current);
      const to   = updated.findIndex(w => w.order === dragOver.current);
      if (from < 0 || to < 0) return ws;
      [updated[from].order, updated[to].order] = [updated[to].order, updated[from].order];
      return [...updated].sort((a,b) => a.order - b.order);
    });
    dragItem.current = null; dragOver.current = null;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Select value={chartType} onValueChange={setChartType}>
          <SelectTrigger className="h-7 w-32 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {['bar','line','area','pie'].map(t=><SelectItem key={t} value={t} className="text-xs capitalize">{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button size="sm" variant="outline" className="h-7 text-xs gap-1"
          onClick={() => setWidgets(ws => [...ws, { id:`w${Date.now()}`, type:'chart', title:'New Chart', dataSource:'monthly', config:{chartType}, order:ws.length }])}>
          <Plus className="h-3 w-3"/>Add Widget
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...widgets].sort((a,b)=>a.order-b.order).map(w => (
          <div key={w.id} draggable
            onDragStart={() => handleDragStart(w.order)}
            onDragEnter={() => handleDragEnter(w.order)}
            onDragEnd={handleDrop}
            className="cursor-grab active:cursor-grabbing">
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground"/>
                    {w.title}
                  </span>
                  <button onClick={() => removeWidget(w.id)} className="text-muted-foreground hover:text-destructive">
                    <X className="h-3.5 w-3.5"/>
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {w.type === 'kpi' ? (
                  <p className="text-3xl font-bold text-emerald-600">
                    {evalFormula('((revenue-cost)/revenue)*100', SAMPLE_ROW)}%
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={160}>
                    {(w.config.chartType ?? chartType) === 'bar' ? (
                      <BarChart data={MONTHLY}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
                        <XAxis dataKey="month" tick={{fontSize:10}}/>
                        <YAxis tick={{fontSize:10}} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
                        <Tooltip formatter={(v) => `RM ${(v ?? 0).toLocaleString()}`}/>
                        <Bar dataKey="revenue" fill="#3b82f6" radius={[3,3,0,0]}/>
                        <Bar dataKey="cost"    fill="#f59e0b" radius={[3,3,0,0]}/>
                      </BarChart>
                    ) : (w.config.chartType ?? chartType) === 'line' ? (
                      <LineChart data={MONTHLY}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
                        <XAxis dataKey="month" tick={{fontSize:10}}/>
                        <YAxis tick={{fontSize:10}}/>
                        <Tooltip/>
                        <Line type="monotone" dataKey="margin" stroke="#10b981" strokeWidth={2} dot={{r:3}}/>
                      </LineChart>
                    ) : (w.config.chartType ?? chartType) === 'area' ? (
                      <AreaChart data={MONTHLY}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
                        <XAxis dataKey="month" tick={{fontSize:10}}/>
                        <YAxis tick={{fontSize:10}} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
                        <Tooltip/>
                        <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f620" strokeWidth={2}/>
                      </AreaChart>
                    ) : (
                      <RePieChart>
                        <Pie data={SEGMENTS} cx="50%" cy="50%" outerRadius={60} dataKey="value" label={({name,value})=>`${name} ${value}%`} labelLine={false}>
                          {SEGMENTS.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                        </Pie>
                        <Tooltip/>
                      </RePieChart>
                    )}
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Cohort Table ──────────────────────────────────────────────────────────────
function CohortMatrix() {
  const weeks = ['W0','W1','W2','W3','W4'];
  const keys: (keyof typeof COHORT[0])[] = ['w0','w1','w2','w3','w4'];
  const getColor = (v: number) =>
    v >= 80 ? '#10b98120' : v >= 60 ? '#3b82f620' : v >= 40 ? '#f59e0b20' : '#ef444420';

  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-sm">Retention Cohort Matrix</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="text-xs w-full">
            <thead>
              <tr>
                <th className="text-left px-2 py-1 text-muted-foreground">Cohort</th>
                {weeks.map(w=><th key={w} className="px-2 py-1 text-muted-foreground">{w}</th>)}
              </tr>
            </thead>
            <tbody>
              {COHORT.map(row=>(
                <tr key={row.month}>
                  <td className="px-2 py-1.5 font-medium">{row.month}</td>
                  {keys.map(k=>(
                    <td key={k} className="px-2 py-1.5 text-center rounded" style={{background:getColor(row[k] as number)}}>
                      {(row[k] as number)}%
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// ── ARIMA Forecast ────────────────────────────────────────────────────────────
function ForecastChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary"/>ARIMA Revenue Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={FORECAST}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
            <XAxis dataKey="month" tick={{fontSize:10}}/>
            <YAxis tick={{fontSize:10}} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
            <Tooltip formatter={(v) => `RM ${((v ?? 0) as number).toLocaleString()}`}/>
            <Legend wrapperStyle={{fontSize:11}}/>
            <Line type="monotone" dataKey="actual"   stroke="#3b82f6" strokeWidth={2} dot={{r:3}} name="Actual"/>
            <Line type="monotone" dataKey="forecast" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={{r:3}} name="Forecast"/>
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
          <span>Model: ARIMA(2,1,2)</span>
          <span>Horizon: 3 months</span>
          <span>RMSE: 12,400</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export function AnalyticsStudio() {
  return (
    <Tabs defaultValue="dashboard">
      <TabsList className="h-8">
        <TabsTrigger value="dashboard" className="text-xs gap-1"><BarChart3 className="h-3 w-3"/>Dashboards</TabsTrigger>
        <TabsTrigger value="kpi"       className="text-xs gap-1"><Gauge className="h-3 w-3"/>KPI Builder</TabsTrigger>
        <TabsTrigger value="forecast"  className="text-xs gap-1"><TrendingUp className="h-3 w-3"/>Forecast</TabsTrigger>
        <TabsTrigger value="cohort"    className="text-xs gap-1"><Users className="h-3 w-3"/>Cohorts</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="mt-4"><DashboardCanvas /></TabsContent>
      <TabsContent value="kpi"       className="mt-4"><KPIBuilder /></TabsContent>
      <TabsContent value="forecast"  className="mt-4"><ForecastChart /></TabsContent>
      <TabsContent value="cohort"    className="mt-4"><CohortMatrix /></TabsContent>
    </Tabs>
  );
}
