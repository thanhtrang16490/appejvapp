import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Combo } from '../models/sector';
import { useOfflineQuery } from './useOfflineQuery';

// Query keys for better organization
export const comboKeys = {
  all: ['combos'] as const,
  detail: (id: number) => [...comboKeys.all, id] as const,
};

export function useCombo(id: number) {
  return useOfflineQuery<Combo>(
    comboKeys.detail(id),
    async () => {
      const response = await axios.get(`https://api.slmglobal.vn/api/pre_quote/combo/${id}`);
      return response.data;
    },
    {
      enabled: !!id,
      retry: 3,
      staleTime: 1000 * 60 * 5, // Fresh for 5 minutes
      gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
    }
  );
}
