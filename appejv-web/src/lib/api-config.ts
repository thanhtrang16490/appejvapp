// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.appejv.vn/api',
  TIMEOUT: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,
  HEADERS: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  USE_MOCK: process.env.NEXT_PUBLIC_USE_MOCK === 'true',
};

// API Endpoints
export const API_ENDPOINTS = {
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    CATEGORIES: '/products/categories',
    SEARCH: '/products/search',
    HEALTHCHECK: '/products/healthcheck',
  },
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: (id: string) => `/categories/${id}`,
    PRODUCTS: (id: string) => `/categories/${id}/products`,
  },
  SECTORS: {
    LIST: '/sector',
    DETAIL: (id: number | string) => `/sector/${id}`,
    COMBOS: (id: number | string) => `/sector/${id}/combos`,
  },
  ORDERS: {
    LIST: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    CREATE: '/orders',
    UPDATE: (id: string) => `/orders/${id}`,
    DELETE: (id: string) => `/orders/${id}`,
  },
  USERS: {
    LIST: '/users',
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    ORDERS: '/users/orders',
    FAVORITES: '/users/favorites',
  },
  AUTH: {
    LOGIN: '/users',
    VERIFY: '/auth/verify',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  CONTENT: {
    LIST: '/content',
    DETAIL: (id: string) => `/content/${id}`,
    BY_BRAND: (brand: string) => `/content?brand=${brand}`,
  },
};

export const buildUrl = (endpoint: string, params?: Record<string, any>): string => {
  const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });
  }
  return url.toString();
};

export const handleApiError = (error: any): { code: string; message: string; details?: any } => {
  if (error.response) {
    return {
      code: error.response.status.toString(),
      message: error.response.data?.message || 'An error occurred',
      details: error.response.data,
    };
  }
  return {
    code: '500',
    message: error.message || 'An unexpected error occurred',
    details: error,
  };
};

export default {
  API_CONFIG,
  API_ENDPOINTS,
  buildUrl,
  handleApiError,
};
