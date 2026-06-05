/* eslint-disable @typescript-eslint/no-explicit-any */

import { createRegistry } from './registry';
import { createETLAdapter } from './adapters/etl';

export const automationNodeRegistry = createRegistry(createETLAdapter());

export type AutomationNodeRegistry = typeof automationNodeRegistry;

export function getAutomationNodeRegistry() {
  return automationNodeRegistry;
}

