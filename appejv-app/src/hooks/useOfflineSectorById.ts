import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Sector } from '../models/sector';
import { sectorApi } from '../services/api';

// Query keys
export const sectorKeys = {
  all: ['sectors'] as const,
  detail: (id: number) => [...sectorKeys.all, id] as const,
};

/**
 * Hook để lấy thông tin sector theo ID với hỗ trợ offline
 * @param sectorId ID của sector cần lấy
 * @returns Thông tin sector và trạng thái loading
 */
export function useOfflineSectorById(sectorId: number | string) {
  const sectorIdNum = typeof sectorId === 'string' ? Number(sectorId) : sectorId;
  const cacheKey = `@sector_${sectorIdNum}`;

  // State để theo dõi initialData
  const [initialData, setInitialData] = useState<Sector | undefined>(undefined);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  // Kiểm tra kết nối mạng
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      console.log(`Trạng thái kết nối: ${state.isConnected ? 'Đã kết nối' : 'Không có kết nối'}`);
    });

    return () => unsubscribe();
  }, []);

  // Tải dữ liệu từ cache khi mount component
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log(`Đang tìm dữ liệu cached cho sector ${sectorIdNum}...`);
        const cachedData = await AsyncStorage.getItem(cacheKey);
        if (cachedData) {
          console.log(`Đã tìm thấy dữ liệu cached cho sector ${sectorIdNum}`);
          const parsedData = JSON.parse(cachedData) as Sector;
          setInitialData(parsedData);

          // Log số lượng combo để debug
          if (parsedData.list_combos) {
            console.log(`Dữ liệu cached có ${parsedData.list_combos.length} combos`);
          } else {
            console.log(`Dữ liệu cached không có list_combos hoặc list_combos rỗng`);
          }
        } else {
          console.log(`Không tìm thấy dữ liệu cached cho sector ${sectorIdNum}`);
        }
      } catch (e) {
        console.error(`Lỗi khi đọc cache cho sector ${sectorIdNum}:`, e);
      } finally {
        setInitialDataLoaded(true);
      }
    };

    loadInitialData();
  }, [cacheKey, sectorIdNum]);

  // Tạo một hàm fetchData riêng để có thể tái sử dụng trong queryFn
  const fetchData = async (): Promise<Sector> => {
    if (isNaN(sectorIdNum) || sectorIdNum <= 0) {
      throw new Error('ID sản phẩm không hợp lệ');
    }

    console.log(`Bắt đầu fetch dữ liệu sector ${sectorIdNum} từ API...`);

    try {
      // Kiểm tra kết nối trước khi gọi API
      const networkState = await NetInfo.fetch();
      if (!networkState.isConnected) {
        console.log('Không có kết nối mạng, chuyển sang dùng dữ liệu cache');
        throw new Error('Không có kết nối mạng');
      }

      // Sử dụng sectorApi service để lấy dữ liệu
      const data = await sectorApi.getSectorById(sectorIdNum);

      console.log(`Đã fetch thành công dữ liệu sector ${sectorIdNum} từ API`);

      // Log số lượng combo để debug
      if (data.list_combos) {
        console.log(`API trả về ${data.list_combos.length} combos`);
      } else {
        console.log(`API không trả về list_combos hoặc list_combos rỗng`);
      }

      // Lưu dữ liệu vào bộ nhớ đệm
      try {
        await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
        console.log(`Đã lưu dữ liệu sector ${sectorIdNum} vào cache`);
      } catch (e) {
        console.error(`Không thể lưu dữ liệu sector ${sectorIdNum} vào cache:`, e);
      }

      return data;
    } catch (error) {
      console.error(`Lỗi khi fetch dữ liệu sector ${sectorIdNum}:`, error);

      // Thử lấy từ cache
      console.log(`Không thể kết nối API, thử lấy dữ liệu từ cache...`);
      const cachedData = await AsyncStorage.getItem(cacheKey);

      if (cachedData) {
        console.log(`Đã tìm thấy dữ liệu sector ${sectorIdNum} trong cache`);
        try {
          const data = JSON.parse(cachedData) as Sector;

          // Log số lượng combo để debug
          if (data.list_combos) {
            console.log(`Dữ liệu cached có ${data.list_combos.length} combos`);
          } else {
            console.log(`Dữ liệu cached không có list_combos hoặc list_combos rỗng`);
          }

          return data;
        } catch (parseError) {
          console.error(`Lỗi phân tích dữ liệu cache:`, parseError);
          await AsyncStorage.removeItem(cacheKey); // Xóa dữ liệu cache lỗi
          throw new Error(`Dữ liệu cache bị hỏng. Vui lòng kiểm tra kết nối mạng và thử lại sau.`);
        }
      }

      // Nếu không có bộ đệm, ném lỗi
      throw new Error(
        `Không thể tải dữ liệu sector ${sectorIdNum}. Vui lòng kiểm tra kết nối mạng và thử lại sau.`
      );
    }
  };

  // Chờ cho initialData được tải trước khi thực hiện query
  const query = useQuery({
    queryKey: sectorKeys.detail(sectorIdNum),
    queryFn: fetchData,
    enabled: !isNaN(sectorIdNum) && sectorIdNum > 0 && initialDataLoaded,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff với max 30 giây
    staleTime: 1000 * 60 * 5, // Dữ liệu giữ nguyên trong 5 phút
    gcTime: 1000 * 60 * 60 * 24, // Lưu trong cache 24 giờ
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Lấy dữ liệu mới khi component mount
    refetchOnReconnect: true,
    initialData: initialData,
  });

  // Thêm thông tin về trạng thái kết nối vào result
  return {
    ...query,
    isConnected,
  };
}
