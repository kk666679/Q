import type { Handle } from '@xyflow/react'

export type ConnectionExecutionMode = 'sync' | 'async' | 'streaming'

export type ConnectionValidationRule = {
  id: string
  description: string
  /** If provided, used to validate connection events */
  eventType?: string
}

export type WorkflowBindingPayload = {
  metrics: Record<string, any>
  events: any[]
  logs: any[]
  compliance: Record<string, any>
  aiInsights: Record<string, any>
}

export type WorkflowBindingSliceKey = keyof WorkflowBindingPayload

export interface ConnectionNode {
  id: string

  inputs: Handle[]
  outputs: Handle[]

  validationRules: ConnectionValidationRule[]

  executionMode: ConnectionExecutionMode

  aiEnabled: boolean
  analyticsEnabled: boolean
  complianceEnabled: boolean
}

export type ConnectionNodeCategory =
  | 'ai-agent'
  | 'workflow'
  | 'api'
  | 'database'
  | 'etl'
  | 'compliance'
  | 'chart'
  | 'dashboard'
  | 'notification'
  | 'human-approval'
  | 'external-system'

export type WorkflowBindingEvent = {
  type: 'workflow.binding'
  payload: {
    workflowRunId: string
    workflowNodeId: string
    binding: WorkflowBindingPayload
  }
}

