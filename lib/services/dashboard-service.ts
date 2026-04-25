/**
 * Dashboard Service
 * 
 * Service layer for dashboard data and statistics.
 * Aggregates data from various sources for the dashboard.
 */

import { trpcClient } from '@/lib/sdk/trpc';

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalDocuments: number;
  approvedDocuments: number;
  totalProcesses: number;
  complianceScore: number;
  documentsThisMonth: number;
  scansThisWeek: number;
  recentActivity: Activity[];
}

export interface Activity {
  id: string;
  type: 'document' | 'process' | 'compliance' | 'audit';
  action: string;
  description: string;
  user: string;
  timestamp: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'archived';
  organizationType: string;
  industry: string;
  scope: string;
  complianceScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Dashboard Service
 * Provides methods for fetching dashboard data
 */
export const dashboardService = {
  /**
   * Get dashboard statistics
   */
  async getStats(): Promise<DashboardStats> {
    const stats = await trpcClient.dashboard.getStats.query();
    return {
      ...stats,
      documentsThisMonth: 0,
      scansThisWeek: 0,
      averageCompliance: stats.complianceScore,
    } as DashboardStats;
  },

  /**
   * Get recent activity feed
   */
  async getRecentActivity(limit = 10): Promise<Activity[]> {
    const stats = await trpcClient.dashboard.getStats.query();
    return (stats.recentActivity || []).slice(0, limit);
  },

  /**
   * Get project list
   */
  async getProjects(): Promise<Project[]> {
    return trpcClient.project.list.query();
  },

  /**
   * Get a single project
   */
  async getProject(id: string): Promise<Project | null> {
    return trpcClient.project.get.query({ id });
  },

  /**
   * Create a new project
   */
  async createProject(input: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'status'>) {
    return trpcClient.project.create.mutate({
      ...input,
    });
  },

  /**
   * Update a project
   */
  async updateProject(id: string, data: Partial<Project>) {
    return trpcClient.project.update.mutate({ id, data });
  },

  /**
   * Delete a project
   */
  async deleteProject(id: string) {
    return trpcClient.project.delete.mutate({ id });
  },
};

export default dashboardService;
