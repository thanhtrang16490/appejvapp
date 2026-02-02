import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Combo } from '../models/sector';
import { useOfflineQuery } from './useOfflineQuery';

interface ProductBrandCombo {
  id: number;
  name: string;
  type: string;
  image: string;
  total_price: number;
  power_output: string;
  description?: string;
}

// Query keys for better organization
export const productBrandComboKeys = {
  all: ['productBrandCombos'] as const,
  detail: (id: number) => [...productBrandComboKeys.all, id] as const,
};

export function useProductBrandCombo(comboId: number) {
  return useOfflineQuery<ProductBrandCombo, Error>(
    productBrandComboKeys.detail(comboId),
    async () => {
      const { data } = await axios.get(`/api/product-brands/combos/${comboId}`);
      return data;
    },
    {
      enabled: !!comboId,
      retry: 3,
      staleTime: 1000 * 60 * 5, // Fresh for 5 minutes
      gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
    }
  );
}
