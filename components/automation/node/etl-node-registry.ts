import type { ETLNodeDef } from '../shared/types';

export const ETL_NODE_REGISTRY: ETLNodeDef[] = [
  // ── Import ────────────────────────────────────────────────────────────────
  { id:'import-integration', category:'import', label:'Import from Integration', icon:'Plug',        description:'Pull data from a connected integration',    inputs:0, outputs:1, configSchema:{integrationId:{type:'string'}} },
  { id:'import-file',        category:'import', label:'Import from File',        icon:'FileUp',      description:'CSV, Excel, Parquet, JSON upload',          inputs:0, outputs:1, configSchema:{filePath:{type:'string'},format:{type:'string'}} },
  { id:'import-api',         category:'import', label:'Import from API',         icon:'Globe',       description:'REST / GraphQL endpoint ingestion',          inputs:0, outputs:1, configSchema:{url:{type:'string'},method:{type:'string'}} },
  { id:'import-datalocker',  category:'import', label:'Import from Data Locker', icon:'Lock',        description:'Read from managed data locker store',        inputs:0, outputs:1, configSchema:{lockerId:{type:'string'}} },
  { id:'new-table',          category:'import', label:'New Table',               icon:'Table2',      description:'Create an empty table with defined schema',  inputs:0, outputs:1, configSchema:{schema:{type:'object'}} },
  { id:'sample-data',        category:'import', label:'Import Sample Data',      icon:'FlaskConical',description:'Load built-in sample datasets',             inputs:0, outputs:1, configSchema:{dataset:{type:'string'}} },

  // ── Preparation ───────────────────────────────────────────────────────────
  { id:'clean',           category:'preparation', label:'Clean',            icon:'Eraser',    description:'Trim, fix nulls, normalise whitespace',    inputs:1, outputs:1, configSchema:{} },
  { id:'find-replace',    category:'preparation', label:'Find Replace',     icon:'Replace',   description:'Pattern-based find & replace on columns',  inputs:1, outputs:1, configSchema:{} },
  { id:'text-to-columns', category:'preparation', label:'Text to Columns',  icon:'SplitSquareHorizontal', description:'Split delimited text into columns', inputs:1, outputs:1, configSchema:{} },
  { id:'validate',        category:'preparation', label:'Validate',         icon:'CheckCheck',description:'Assert types and constraints',             inputs:1, outputs:2, configSchema:{} },
  { id:'flatten-json',    category:'preparation', label:'Flatten JSON',     icon:'Braces',    description:'Expand nested JSON into flat columns',     inputs:1, outputs:1, configSchema:{} },
  { id:'sample',          category:'preparation', label:'Sample',           icon:'Layers',    description:'Random or top-N row sampling',             inputs:1, outputs:1, configSchema:{n:{type:'number'}} },
  { id:'standardize',     category:'preparation', label:'Standardize',      icon:'AlignLeft', description:'Normalise formats (dates, phone, codes)',   inputs:1, outputs:1, configSchema:{} },

  // ── Combine ───────────────────────────────────────────────────────────────
  { id:'merge',      category:'combine', label:'Merge',      icon:'Merge',       description:'Merge two datasets on a key',           inputs:2, outputs:1, configSchema:{} },
  { id:'join',       category:'combine', label:'Join',        icon:'GitMerge',    description:'Inner/left/right/full join',            inputs:2, outputs:1, configSchema:{joinType:{type:'string'}} },
  { id:'multi-join', category:'combine', label:'Multi Join',  icon:'Network',     description:'Join more than two datasets',           inputs:4, outputs:1, configSchema:{} },
  { id:'append',     category:'combine', label:'Append',      icon:'ListPlus',    description:'Union two datasets vertically',         inputs:2, outputs:1, configSchema:{} },
  { id:'fuzzy-join', category:'combine', label:'Fuzzy Join',  icon:'Wand2',       description:'Approximate-key join using similarity', inputs:2, outputs:1, configSchema:{threshold:{type:'number'}} },

  // ── Transform ─────────────────────────────────────────────────────────────
  { id:'edit-columns',   category:'transform', label:'Edit Columns',   icon:'PenLine',    description:'Rename, cast, compute derived columns', inputs:1, outputs:1, configSchema:{} },
  { id:'select-columns', category:'transform', label:'Select Columns', icon:'Columns',    description:'Keep or drop columns',                  inputs:1, outputs:1, configSchema:{} },
  { id:'filter',         category:'transform', label:'Filter',         icon:'Filter',     description:'Row-level filter expression',           inputs:1, outputs:2, configSchema:{expression:{type:'string'}} },
  { id:'deduplicate',    category:'transform', label:'Deduplicate',    icon:'Copy',       description:'Remove duplicate rows',                 inputs:1, outputs:1, configSchema:{} },
  { id:'sort',           category:'transform', label:'Sort',           icon:'ArrowUpDown',description:'Sort by one or more columns',           inputs:1, outputs:1, configSchema:{} },
  { id:'pivot',          category:'transform', label:'Pivot',          icon:'Table',      description:'Wide-format pivot',                     inputs:1, outputs:1, configSchema:{} },
  { id:'unpivot',        category:'transform', label:'Unpivot',        icon:'LayoutList', description:'Melt wide to long format',              inputs:1, outputs:1, configSchema:{} },

  // ── Quality ───────────────────────────────────────────────────────────────
  { id:'dq-rules',        category:'quality', label:'DQ Rules',         icon:'ShieldCheck',   description:'Apply custom data quality rules',         inputs:1, outputs:2, configSchema:{} },
  { id:'completeness',    category:'quality', label:'Completeness',     icon:'CheckSquare',   description:'Check for nulls and missing values',      inputs:1, outputs:2, configSchema:{} },
  { id:'uniqueness',      category:'quality', label:'Uniqueness',       icon:'Fingerprint',   description:'Detect duplicate values on key columns',  inputs:1, outputs:2, configSchema:{} },
  { id:'accuracy',        category:'quality', label:'Accuracy',         icon:'Target',        description:'Cross-reference accuracy validation',     inputs:1, outputs:2, configSchema:{} },
  { id:'data-profiling',  category:'quality', label:'Data Profiling',   icon:'BarChart2',     description:'Auto-profile distributions and stats',    inputs:1, outputs:1, configSchema:{} },
  { id:'anomaly-detect',  category:'quality', label:'Anomaly Detection',icon:'AlertTriangle', description:'ML-based outlier and anomaly detection',  inputs:1, outputs:2, configSchema:{} },

  // ── Schema ────────────────────────────────────────────────────────────────
  { id:'schema-registry', category:'schema', label:'Schema Registry',   icon:'BookOpen',   description:'Register and manage schemas',       inputs:1, outputs:1, configSchema:{} },
  { id:'schema-diff',     category:'schema', label:'Schema Diff',       icon:'GitCompare', description:'Compare schema versions',           inputs:2, outputs:1, configSchema:{} },
  { id:'data-contract',   category:'schema', label:'Data Contract',     icon:'FileCheck',  description:'Enforce SLA and schema contracts',  inputs:1, outputs:2, configSchema:{} },

  // ── Analytics ─────────────────────────────────────────────────────────────
  { id:'predict',     category:'analytics', label:'Predict',       icon:'Cpu',         description:'Apply a trained ML model',              inputs:1, outputs:1, configSchema:{modelId:{type:'string'}} },
  { id:'build-model', category:'analytics', label:'Build Model',   icon:'BrainCircuit',description:'Train a model on input data',           inputs:1, outputs:1, configSchema:{} },
  { id:'correlate',   category:'analytics', label:'Correlate',     icon:'ScatterChart',description:'Pearson/Spearman correlation matrix',  inputs:1, outputs:1, configSchema:{} },
  { id:'forecast',    category:'analytics', label:'ARIMA Forecast',icon:'TrendingUp',  description:'Time-series forecasting with ARIMA',   inputs:1, outputs:1, configSchema:{periods:{type:'number'}} },
  { id:'kpi-builder', category:'analytics', label:'KPI Builder',   icon:'Gauge',       description:'Define and compute KPI metrics',       inputs:1, outputs:1, configSchema:{} },
  { id:'segment',     category:'analytics', label:'Segmentation',  icon:'PieChart',    description:'Cluster or rule-based segmentation',   inputs:1, outputs:1, configSchema:{} },

  // ── Publish ───────────────────────────────────────────────────────────────
  { id:'publish-integration', category:'publish', label:'Publish to Integration', icon:'Send',      description:'Write to a connected integration',     inputs:1, outputs:0, configSchema:{} },
  { id:'publish-datalocker',  category:'publish', label:'Publish to Data Locker', icon:'Lock',      description:'Write to managed data locker',         inputs:1, outputs:0, configSchema:{} },
  { id:'publish-email',       category:'publish', label:'Publish to Email',       icon:'Mail',      description:'Email report delivery',                inputs:1, outputs:0, configSchema:{} },
  { id:'publish-url',         category:'publish', label:'Publish to URL',         icon:'Link',      description:'Expose result as a shareable URL',     inputs:1, outputs:0, configSchema:{} },
  { id:'schedule-delivery',   category:'publish', label:'Scheduled Delivery',     icon:'CalendarClock',description:'Cron-based report distribution',   inputs:1, outputs:0, configSchema:{cron:{type:'string'}} },

  // ── Control ───────────────────────────────────────────────────────────────
  { id:'conditional',    category:'control', label:'Conditional',     icon:'GitBranch',  description:'if/else branching',               inputs:1, outputs:2, configSchema:{} },
  { id:'iterate',        category:'control', label:'Iterate',         icon:'Repeat',     description:'Loop over rows or batches',       inputs:1, outputs:1, configSchema:{} },
  { id:'switch',         category:'control', label:'Switch',          icon:'Shuffle',    description:'Multi-branch switch routing',     inputs:1, outputs:4, configSchema:{} },
  { id:'parallel',       category:'control', label:'Parallel Branch', icon:'SplitSquareVertical', description:'Fan-out parallel execution', inputs:1, outputs:3, configSchema:{} },
  { id:'wait',           category:'control', label:'Wait',            icon:'Clock',      description:'Delay or wait for event',        inputs:1, outputs:1, configSchema:{} },
  { id:'retry',          category:'control', label:'Retry',           icon:'RotateCw',   description:'Retry on failure with backoff',  inputs:1, outputs:1, configSchema:{maxRetries:{type:'number'}} },
  { id:'error-handler',  category:'control', label:'Error Handler',   icon:'AlertCircle',description:'Catch and handle errors',        inputs:1, outputs:1, configSchema:{} },

  // ── Custom ────────────────────────────────────────────────────────────────
  { id:'custom-sql',    category:'custom', label:'Custom SQL',    icon:'Code2',        description:'Write custom SQL transform',      inputs:1, outputs:1, configSchema:{sql:{type:'string'}} },
  { id:'custom-python', category:'custom', label:'Custom Python', icon:'FileCode2',    description:'Python snippet transform',        inputs:1, outputs:1, configSchema:{code:{type:'string'}} },
  { id:'custom-code',   category:'custom', label:'Custom Code',   icon:'Terminal',     description:'TypeScript/JS transform',        inputs:1, outputs:1, configSchema:{code:{type:'string'}} },
];

export const ETL_CATEGORIES: { id: string; label: string; color: string }[] = [
  { id:'import',      label:'Import',      color:'#3b82f6' },
  { id:'preparation', label:'Preparation', color:'#8b5cf6' },
  { id:'combine',     label:'Combine',     color:'#06b6d4' },
  { id:'transform',   label:'Transform',   color:'#f59e0b' },
  { id:'quality',     label:'Quality',     color:'#10b981' },
  { id:'schema',      label:'Schema',      color:'#6366f1' },
  { id:'analytics',   label:'Analytics',   color:'#ec4899' },
  { id:'publish',     label:'Publish',     color:'#f97316' },
  { id:'control',     label:'Control',     color:'#64748b' },
  { id:'custom',      label:'Custom',      color:'#a16207' },
];
