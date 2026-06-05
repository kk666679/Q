/**
 * Enterprise client state — Zustand stores for UI-local state
 * that doesn't need server persistence (selections, UI mode, sidebar state).
 */
import { create } from 'zustand';

// ── Notification bell state ───────────────────────────────────────────────────
interface NotificationState {
  unreadCount: number;
  setUnreadCount: (n: number) => void;
  decrement: () => void;
  clear: () => void;
}

export const useNotificationStore = create<NotificationState>(set => ({
  unreadCount: 0,
  setUnreadCount: (n) => set({ unreadCount: n }),
  decrement: () => set(s => ({ unreadCount: Math.max(0, s.unreadCount - 1) })),
  clear: () => set({ unreadCount: 0 }),
}));

// ── Dashboard filter state ────────────────────────────────────────────────────
type DashboardPeriod = '1w' | '1m' | '3m' | '6m' | '1y';

interface DashboardState {
  period: DashboardPeriod;
  standard: string;
  setPeriod: (p: DashboardPeriod) => void;
  setStandard: (s: string) => void;
}

export const useDashboardStore = create<DashboardState>(set => ({
  period: '3m',
  standard: 'ISO9001',
  setPeriod: (period) => set({ period }),
  setStandard: (standard) => set({ standard }),
}));

// ── Active agent session ──────────────────────────────────────────────────────
interface AgentSessionState {
  activeAgentId: string | null;
  sessionId: string | null;
  setAgent: (agentId: string, sessionId: string) => void;
  clearSession: () => void;
}

export const useAgentSessionStore = create<AgentSessionState>(set => ({
  activeAgentId: null,
  sessionId: null,
  setAgent: (activeAgentId, sessionId) => set({ activeAgentId, sessionId }),
  clearSession: () => set({ activeAgentId: null, sessionId: null }),
}));

// ── Sidebar state ─────────────────────────────────────────────────────────────
interface SidebarState {
  collapsed: boolean;
  toggle: () => void;
  collapse: () => void;
  expand: () => void;
}

export const useSidebarStore = create<SidebarState>(set => ({
  collapsed: false,
  toggle: () => set(s => ({ collapsed: !s.collapsed })),
  collapse: () => set({ collapsed: true }),
  expand: () => set({ collapsed: false }),
}));
