'use client';

/**
 * useDashboard Hook
 * 
 * Client-side hook for dashboard data using tRPC.
 * Provides reactive data for dashboard components.
 * 
 * @example
 * function Dashboard() {
 *   const { stats, projects, isLoading } = useDashboard();
 *   
 *   if (isLoading) return <DashboardSkeleton />;
 *   return <DashboardContent stats={stats} projects={projects} />;
 * }
 */

import { trpc } from '@/lib/sdk';
import { useCallback } from 'react';

interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'archived';
  organizationType: string;
  industry: string;
  scope: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateProjectInput {
  name: string;
  description?: string;
  organizationType: string;
  industry: string;
  scope: string;
}

/**
 * Hook for dashboard statistics
 */
export function useDashboardStats() {
  const { data: stats, isLoading, error, refetch } = trpc.dashboard.getStats.useQuery();

  return {
    stats: stats ?? {
      totalProjects: 0,
      activeProjects: 0,
      totalDocuments: 0,
      approvedDocuments: 0,
      totalProcesses: 0,
      complianceScore: 0,
      recentActivity: [],
    },
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for project list operations
 */
export function useProjects() {
  const utils = trpc.useUtils();

  const { data: projects = [], isLoading, error, refetch } = trpc.project.list.useQuery();

  const createMutation = trpc.project.create.useMutation({
    onSuccess: () => {
      utils.project.list.invalidate();
      utils.dashboard.getStats.invalidate();
    },
  });

  const updateMutation = trpc.project.update.useMutation({
    onSuccess: () => {
      utils.project.list.invalidate();
      utils.dashboard.getStats.invalidate();
    },
  });

  const deleteMutation = trpc.project.delete.useMutation({
    onSuccess: () => {
      utils.project.list.invalidate();
      utils.dashboard.getStats.invalidate();
    },
  });

  const createProject = useCallback(
    async (input: CreateProjectInput) => {
      return createMutation.mutateAsync(input);
    },
    [createMutation]
  );

  const updateProject = useCallback(
    async (id: string, data: Partial<Project>) => {
      return updateMutation.mutateAsync({ id, data });
    },
    [updateMutation]
  );

  const deleteProject = useCallback(
    async (id: string) => {
      return deleteMutation.mutateAsync({ id });
    },
    [deleteMutation]
  );

  return {
    projects,
    isLoading,
    error,
    refetch,
    createProject,
    updateProject,
    deleteProject,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

/**
 * Hook for single project operations
 */
export function useProject(id: string) {
  const utils = trpc.useUtils();

  const { data: project, isLoading, error, refetch } = trpc.project.get.useQuery({ id });

  const updateMutation = trpc.project.update.useMutation({
    onSuccess: () => {
      utils.project.get.invalidate({ id });
      utils.project.list.invalidate();
    },
  });

  const update = useCallback(
    async (data: Partial<Project>) => {
      return updateMutation.mutateAsync({ id, data });
    },
    [id, updateMutation]
  );

  return {
    project,
    isLoading,
    error,
    refetch,
    update,
    isUpdating: updateMutation.isPending,
  };
}

/**
 * Combined dashboard hook
 */
export function useDashboard() {
  const { stats, isLoading: statsLoading } = useDashboardStats();
  const { projects, isLoading: projectsLoading, createProject } = useProjects();

  return {
    stats,
    projects,
    isLoading: statsLoading || projectsLoading,
    createProject,
  };
}

export default useDashboard;
