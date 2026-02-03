import { API_CONFIG, API_ENDPOINTS, buildUrl, handleApiError } from '@/lib/api-config';

// Types
interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Generic API client
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private headers: Record<string, string>;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.headers = API_CONFIG.HEADERS;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    const url = params ? buildUrl(endpoint, params) : `${this.baseURL}${endpoint}`;
    return this.request<T>(url.replace(this.baseURL, ''));
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create API client instance
const apiClient = new ApiClient();

// Sector API Service
export const sectorService = {
  async getAllSectors() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SECTORS.LIST, { include_products: 'true' });
      return response;
    } catch (error) {
      console.error('Error fetching sectors:', error);
      throw handleApiError(error);
    }
  },

  async getSectorById(sectorId: number) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SECTORS.DETAIL(sectorId));
      return response;
    } catch (error) {
      console.error('Error fetching sector:', error);
      throw handleApiError(error);
    }
  },

  async getSectorCombos(sectorId: number) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SECTORS.COMBOS(sectorId));
      return response;
    } catch (error) {
      console.error('Error fetching sector combos:', error);
      throw handleApiError(error);
    }
  },
};

// Product API Service
export const productService = {
  async getAllProducts(params?: { sector_id?: number; search?: string; page?: number; limit?: number }) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.LIST, params);
      return response;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw handleApiError(error);
    }
  },

  async getProductById(productId: string) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.DETAIL(productId));
      return response;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw handleApiError(error);
    }
  },

  async searchProducts(query: string, params?: { sector_id?: number; page?: number; limit?: number }) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.SEARCH, { q: query, ...params });
      return response;
    } catch (error) {
      console.error('Error searching products:', error);
      throw handleApiError(error);
    }
  },
};

// Content API Service
export const contentService = {
  async getAllContents(params?: { sector_id?: number; category?: string; brand?: string; page?: number; limit?: number }) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CONTENT.LIST, params);
      return response;
    } catch (error) {
      console.error('Error fetching contents:', error);
      throw handleApiError(error);
    }
  },

  async getContentById(contentId: string) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CONTENT.DETAIL(contentId));
      return response;
    } catch (error) {
      console.error('Error fetching content:', error);
      throw handleApiError(error);
    }
  },

  async getContentsByBrand(brand: string, params?: { page?: number; limit?: number }) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CONTENT.BY_BRAND(brand), params);
      return response;
    } catch (error) {
      console.error('Error fetching contents by brand:', error);
      throw handleApiError(error);
    }
  },
};

// User API Service
export const userService = {
  async getAllUsers(params?: { role_id?: number; search?: string; page?: number; limit?: number }) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.LIST, params);
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw handleApiError(error);
    }
  },

  async getUserProfile() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.PROFILE);
      return response;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw handleApiError(error);
    }
  },

  async updateUserProfile(data: unknown) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, data);
      return response;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw handleApiError(error);
    }
  },
};

// Export all services
export const apiService = {
  sectors: sectorService,
  products: productService,
  contents: contentService,
  users: userService,
};

export default apiService;