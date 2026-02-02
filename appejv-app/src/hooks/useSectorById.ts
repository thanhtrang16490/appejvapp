import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Sector } from '../models/sector';

// Query keys
export const sectorKeys = {
  all: ['sectors'] as const,
  detail: (id: number) => [...sectorKeys.all, id] as const,
};

/**
 * Hook để lấy thông tin sector theo ID
 * @param sectorId ID của sector cần lấy
 * @returns Thông tin sector và trạng thái loading
 */
export function useSectorById(sectorId: number | string) {
  const sectorIdNum = typeof sectorId === 'string' ? Number(sectorId) : sectorId;

  return useQuery({
    queryKey: sectorKeys.detail(sectorIdNum),
    queryFn: async () => {
      if (isNaN(sectorIdNum) || sectorIdNum <= 0) {
        throw new Error('ID lĩnh vực không hợp lệ');
      }
      const response = await axios.get(`https://api.slmglobal.vn/api/sector/${sectorIdNum}`);
      return response.data as Sector;
    },
    enabled: !isNaN(sectorIdNum) && sectorIdNum > 0,
    retry: 3,
    staleTime: 1000 * 60 * 5, // Dữ liệu giữ nguyên trong 5 phút
    gcTime: 1000 * 60 * 60 * 24, // Lưu trong cache 24 giờ
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
}
