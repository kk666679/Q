// qms-capa-workflow.ts
// Durable QMS CAPA workflow using Vercel Workflows primitives (mocked for local use).

import { NextRequest, NextResponse } from 'next/server';

// NOTE: The following imports assume availability of Vercel Workflows primitives.
// In environments without the real Vercel Workflows SDK these are mocked locally
// to demonstrate shape and behavior.
import {
  useWorkflow,
  useStep,
  hook as useHook,
  sleep as workflowSleep,
} from 'vercel/workflows';

// --- Type definitions
type IoTAnomalyEvent = {
  deviceId: string;
  timestamp: string;
  sensorReadings: Record<string, number>;
  severity?: 'low' | 'medium' | 'high';
  metadata?: Record<string, string>;
};

type AnalysisResult = {
  rootCause: string;
  confidence: number;
  recommendedCorrectiveActions: string[];
};

type WorkflowContext = {
  event: IoTAnomalyEvent;
  analysis?: AnalysisResult;
  approval?: { approved: boolean; approverId?: string; notes?: string };
};

// --- Simple in-memory hook registry for demo resume endpoint
const hookRegistry = new Map<string, { resume: (payload: any) => Promise<void> }>();

// --- Mock integrations (replace with real implementations when available)
class MockAIService {
  static async analyzeRootCause(event: IoTAnomalyEvent): Promise<AnalysisResult> {
    // Simulated AI analysis: use sensor patterns to guess a root cause.
    const mean = Object.values(event.sensorReadings).reduce((a, b) => a + b, 0) / Math.max(1, Object.keys(event.sensorReadings).length);
    const rootCause = mean > 100 ? 'Overtemperature due to cooling failure' : 'Process drift / calibration';
    return {
      rootCause,
      confidence: Math.min(0.99, Math.abs(mean) / 200 + 0.4),
      recommendedCorrectiveActions: rootCause.includes('cooling')
        ? ['Check cooling fans', 'Replace coolant', 'Schedule maintenance']
        : ['Re-calibrate sensor', 'Run process validation', 'Inspect tooling alignment'],
    };
  }
}

class MockBlockchain {
  static async writeEntry(namespace: string, payload: any) {
    // In real usage write to a ledger (e.g., Fabric, Ethereum, or a notarization service).
    console.log(`[blockchain] writeEntry ${namespace}`, JSON.stringify(payload));
    return { txId: `tx_${Date.now()}` };
  }
}

class MockIoT {
  static async fetchEvent(deviceId: string): Promise<IoTAnomalyEvent | null> {
    // Placeholder: edge device would push event to trigger workflow; this enables manual fetch if needed.
    return null;
  }
}

// --- Steps (useStep wrappers)
const iotAnomalyListener = useStep('iotAnomalyListener', async (input: { event?: IoTAnomalyEvent; deviceId?: string }) => {
  if (input.event) return input.event;
  if (input.deviceId) {
    const ev = await MockIoT.fetchEvent(input.deviceId);
    if (!ev) throw new Error('No event available for device');
    return ev;
  }
  throw new Error('iotAnomalyListener requires `event` or `deviceId`');
});

const aiRootCauseAnalysis = useStep('aiRootCauseAnalysis', async (event: IoTAnomalyEvent) => {
  const analysis = await MockAIService.analyzeRootCause(event);
  return analysis;
});

const writeBlockchainAudit = useStep('writeBlockchainAudit', async (payload: { namespace: string; body: any }) => {
  const res = await MockBlockchain.writeEntry(payload.namespace, payload.body);
  return res;
});

const executeCorrectiveActions = useStep('executeCorrectiveActions', async (actions: string[], context: WorkflowContext) => {
  // Mock automated corrective actions: in real world call actuators, invoke edge automation, etc.
  console.log('[actions] executing', actions);
  return { executed: actions, timestamp: new Date().toISOString() };
});

// --- Hook for human approval via mobile-friendly API
const qualityApprovalHook = useHook('qualityApprovalHook', {
  // hook payload shape and purpose: pause the workflow and wait for an external approval.
  async create(context: WorkflowContext) {
    const hookId = `approval_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // register a resume function that the external endpoint will call
    let resumeFn: ((payload: any) => Promise<void>) | undefined;

    const resumePromise = new Promise<void>((resolve) => {
      resumeFn = async (payload: any) => {
        // Attach approval result to context and resolve
        context.approval = payload;
        resolve();
      };
    });

    hookRegistry.set(hookId, { resume: async (payload: any) => resumeFn && resumeFn(payload) });

    // Return a mobile-friendly approval URL and the promise that will resolve when resumed.
    return {
      hookId,
      approvalUrl: `/api/workflows/qms-capa/resume?hookId=${hookId}`,
      resumePromise,
    };
  },
});

// --- Sleep helper (wrap the workflowSleep primitive)
const sleep = workflowSleep;

// --- Define the durable workflow
export const qmsCAPAWorkflow = useWorkflow('qms-capa-workflow', async (input: { event?: IoTAnomalyEvent; deviceId?: string }, ctx) => {
  // 1. Listen to IoT anomaly event
  const event = await iotAnomalyListener({ event: input.event, deviceId: input.deviceId });

  // 2. Run AI step to analyse root cause and suggest corrective actions
  const analysis = await aiRootCauseAnalysis(event as IoTAnomalyEvent);

  // 3. Write the event and analysis to blockchain audit trail
  await writeBlockchainAudit({ namespace: 'qms:capa:event', body: { event, analysis } });

  // 4. Use hook to wait for quality manager approval (mobile-friendly API)
  const hookResult = await qualityApprovalHook.create({ event, analysis } as any);

  // In real Vercel Workflows hook usage the workflow would pause here and resume when hook completes.
  // Wait for external resume (approval) via hookResult.resumePromise
  await hookResult.resumePromise;

  const approval = (ctx as unknown as WorkflowContext).approval;

  // 5. If approved, execute automated corrective actions and wait 7 days for re-validation
  if (approval?.approved) {
    const exec = await executeCorrectiveActions(analysis.recommendedCorrectiveActions, { event, analysis } as any);

    // Wait 7 days for re-validation (sleep)
    await sleep('7d');

    // Here you might re-run sensors or schedule re-inspection. For demo we mark re-validation succeeded.
    const reValidation = { status: 'passed', checkedAt: new Date().toISOString() };

    // 6. Log final outcome to blockchain
    await writeBlockchainAudit({ namespace: 'qms:capa:final', body: { event, analysis, approval, exec, reValidation } });

    return { status: 'completed', exec, reValidation };
  }

  // If not approved, log outcome and return
  await writeBlockchainAudit({ namespace: 'qms:capa:rejected', body: { event, analysis, approval } });
  return { status: 'rejected', approval };
});

// --- Resume API route for external systems (mobile app / edge) to POST approval
// Example usage: POST /api/workflows/qms-capa/resume?hookId=approval_... with JSON { approved: true, approverId: 'user_123', notes: '...' }
export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const hookId = url.searchParams.get('hookId');
  if (!hookId) return NextResponse.json({ error: 'missing hookId' }, { status: 400 });

  const payload = await req.json().catch(() => null);
  if (!payload) return NextResponse.json({ error: 'invalid payload' }, { status: 400 });

  const record = hookRegistry.get(hookId);
  if (!record) return NextResponse.json({ error: 'unknown hookId' }, { status: 404 });

  // Resume the workflow
  await record.resume(payload).catch((err) => console.error('resume error', err));

  // Optionally remove the hook registration
  hookRegistry.delete(hookId);

  return NextResponse.json({ ok: true });
}

export default qmsCAPAWorkflow;
