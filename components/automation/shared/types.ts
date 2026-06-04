// ─── Core ────────────────────────────────────────────────────────────────────
export type Channel="whatsapp"|"telegram"|"discord"|"slack"|"teams"|"email"|"webhook";
export type WorkflowStatus="idle"|"running"|"paused"|"failed"|"completed"|"scheduled"|"cancelled";
export interface OrchestrationEvent{ id:string; source:string; type:string; severity:"low"|"medium"|"high"; at:string; payload:Record<string,unknown>; }
export interface AgentNodeState{ id:string; name:string; model:string; confidence:number; status:WorkflowStatus; }

// ─── ETL Node Registry ───────────────────────────────────────────────────────
export type ETLNodeCategory=
  |"import"|"preparation"|"combine"|"transform"|"quality"
  |"schema"|"analytics"|"ml"|"publish"|"control"|"custom"|"integration";

export interface ETLNodeDef{
  id:string;
  category:ETLNodeCategory;
  label:string;
  icon:string;
  description:string;
  inputs:number;
  outputs:number;
  configSchema:Record<string,unknown>;
}

// ─── Data Engineering ────────────────────────────────────────────────────────
export type DataQualityRuleType="completeness"|"uniqueness"|"accuracy"|"validity"|"consistency";
export interface DataQualityRule{ id:string; name:string; type:DataQualityRuleType; expression:string; severity:"error"|"warning"|"info"; }
export interface SchemaField{ name:string; type:string; nullable:boolean; description?:string; }
export interface SchemaVersion{ version:number; fields:SchemaField[]; createdAt:string; changelog:string; }
export interface DataContract{ id:string; name:string; owner:string; schema:SchemaVersion; sla:string; }

// ─── Analytics ───────────────────────────────────────────────────────────────
export type ForecastModel="arima"|"prophet"|"lstm"|"linear";
export interface KPIDefinition{ id:string; name:string; formula:string; target:number; unit:string; owner:string; }
export interface DashboardWidget{ id:string; type:"chart"|"kpi"|"table"|"map"|"funnel"; title:string; dataSource:string; config:Record<string,unknown>; }

// ─── MLOps ───────────────────────────────────────────────────────────────────
export type ModelStatus="training"|"validating"|"deployed"|"archived"|"failed";
export interface MLModel{ id:string; name:string; version:string; framework:string; status:ModelStatus; accuracy?:number; createdAt:string; }
export interface MLExperiment{ id:string; name:string; modelId:string; params:Record<string,unknown>; metrics:Record<string,number>; status:ModelStatus; runAt:string; }
export interface FeatureStoreEntry{ id:string; name:string; type:string; source:string; description:string; tags:string[]; }

// ─── Marketplace ─────────────────────────────────────────────────────────────
export type MarketplaceItemType="workflow"|"node"|"agent"|"connector"|"template";
export interface MarketplaceItem{
  id:string; type:MarketplaceItemType; name:string; description:string;
  author:string; version:string; downloads:number; rating:number;
  tags:string[]; category:string; pricing:"free"|"paid"|"freemium";
}

// ─── Data Catalog ────────────────────────────────────────────────────────────
export interface CatalogAsset{
  id:string; name:string; type:"table"|"view"|"api"|"file"|"stream";
  source:string; owner:string; description:string; tags:string[];
  schema?:SchemaField[]; lineageUpstream:string[]; lineageDownstream:string[];
  quality?:number; lastScanned:string;
}

// ─── Governance ──────────────────────────────────────────────────────────────
export interface GlossaryTerm{ id:string; term:string; definition:string; domain:string; owner:string; synonyms:string[]; relatedTerms:string[]; }
export interface DataOwnership{ assetId:string; owner:string; steward:string; domain:string; classification:"public"|"internal"|"confidential"|"restricted"; }

// ─── Operations ──────────────────────────────────────────────────────────────
export interface WorkflowExecution{ id:string; workflowId:string; status:WorkflowStatus; startedAt:string; completedAt?:string; duration?:number; error?:string; }
export interface SLAPolicy{ workflowId:string; maxDurationMs:number; alertThresholdMs:number; owner:string; }

// ─── Administration ──────────────────────────────────────────────────────────
export type UserRole="admin"|"developer"|"analyst"|"viewer"|"approver";
export interface TenantUser{ id:string; name:string; email:string; role:UserRole; tenantId:string; createdAt:string; }
export interface Tenant{ id:string; name:string; plan:"starter"|"pro"|"enterprise"; createdAt:string; userCount:number; }
export interface ApiKey{ id:string; name:string; prefix:string; tenantId:string; createdAt:string; lastUsed?:string; scopes:string[]; }

// ─── Connectors ──────────────────────────────────────────────────────────────
export type ConnectorCategory="database"|"storage"|"crm"|"erp"|"analytics"|"messaging"|"devops";
export interface ConnectorDef{ id:string; name:string; category:ConnectorCategory; icon:string; description:string; authType:"oauth"|"apikey"|"basic"|"none"; configSchema:Record<string,unknown>; }
