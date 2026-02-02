import { useQuery } from '@tanstack/react-query';
import { sectorApi } from '../services/api';
import { Sector } from '../models/sector';
import { useOfflineQuery } from './useOfflineQuery';

// Query keys
export const sectorKeys = {
  all: ['sectors'] as const,
  detail: (id: number) => [...sectorKeys.all, id] as const,
};

export const useSectors = () => {
  return useOfflineQuery<Sector[]>(sectorKeys.all, sectorApi.getAllSectors, {
    retry: 3, // Retry failed requests 3 times
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnReconnect: true, // Refetch when network reconnects
    refetchOnMount: false, // Don't refetch on component mount if data exists
    gcTime: 1000 * 60 * 60 * 24, // Keep data in cache for 24 hours
    // Fallback to empty array if offline and no cached data
    offlineData: [],
  });
};

export const useSector = (sectorId: number) => {
  return useOfflineQuery<Sector>(
    sectorKeys.detail(sectorId),
    () => sectorApi.getSectorById(sectorId),
    {
      enabled: !!sectorId,
      retry: 3,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false,
      gcTime: 1000 * 60 * 60 * 24, // Keep data in cache for 24 hours
    }
  );
};
