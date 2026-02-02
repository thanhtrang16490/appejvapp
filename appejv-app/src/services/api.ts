import axios from 'axios';
import { Sector } from '../models/sector';
import { API_CONFIG, API_ENDPOINTS } from '../config/api';

// Timeout mặc định cho tất cả các request
axios.defaults.timeout = API_CONFIG.TIMEOUT;

export const sectorApi = {
  /**
   * Fetch all sectors with their combos and contents
   */
  getAllSectors: async (): Promise<Sector[]> => {
    try {
      const response = await axios.get<Sector[]>(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.SECTORS.LIST}`,
        {
          headers: API_CONFIG.HEADERS,
          timeout: API_CONFIG.TIMEOUT,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching all sectors:', error);
      throw error;
    }
  },

  /**
   * Fetch a specific sector by ID
   */
  getSectorById: async (sectorId: number): Promise<Sector> => {
    try {
      // Sử dụng endpoint từ API_ENDPOINTS
      const response = await axios.get<Sector>(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.SECTORS.DETAIL(sectorId)}`,
        {
          headers: API_CONFIG.HEADERS,
          timeout: API_CONFIG.TIMEOUT,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching sector ID ${sectorId}:`, error);
      throw error;
    }
  },

  /**
   * Fetch combos of a sector by sector ID
   */
  getSectorCombos: async (sectorId: number): Promise<Sector['list_combos']> => {
    try {
      // Có thể gọi API riêng cho combos nếu có endpoint, nhưng trong trường hợp này
      // ta lấy từ thông tin sector vì API đang trả về cả list_combos
      const sector = await sectorApi.getSectorById(sectorId);
      return sector.list_combos || [];
    } catch (error) {
      console.error(`Error fetching combos for sector ID ${sectorId}:`, error);
      throw error;
    }
  },
};
