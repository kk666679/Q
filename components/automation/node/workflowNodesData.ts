export type WorkflowNodeLabel = string;

export type WorkflowActionNodeData = {
  label?: WorkflowNodeLabel;
  description?: string;
  duration?: string | number;
  actionType?: string;
};

export type WorkflowApprovalNodeData = {
  label?: WorkflowNodeLabel;
  approver?: string;
  sla?: string | number;
  priority?: string;
};

export type WorkflowWaitNodeData = {
  duration?: string | number;
  description?: string;
};

export type WorkflowNotificationNodeData = {
  label?: WorkflowNodeLabel;
  recipients?: string;
  channel?: 'email' | 'notification' | string;
};

export type WorkflowErrorNodeData = {
  label?: WorkflowNodeLabel;
};

