'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from './query-keys';
import { Project } from '@/types';
import { useStore } from '@/store/useStore';

export function useProjectsQuery() {
  const fallbackProjects = useStore((state) => state.projects);

  return useQuery({
    queryKey: queryKeys.projects.lists(),
    queryFn: async (): Promise<Project[]> => {
      try {
        const data = await apiClient.projects.getAll();
        return data && data.length > 0 ? data : fallbackProjects;
      } catch {
        return fallbackProjects;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes fresh
  });
}
