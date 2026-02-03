// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://statics.appejv.app/api',
  TIMEOUT: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,
  HEADERS: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  USE_MOCK: process.env.NEXT_PUBLIC_USE_MOCK === 'true', // Use mock when explicitly set to true
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
    LIST: '/sectors',
    DETAIL: (id: number | string) => `/sectors/${id}`,
    COMBOS: (id: number | string) => `/sectors/${id}/combos`,
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
    LIST: '/contents',
    DETAIL: (id: string) => `/contents/${id}`,
    BY_BRAND: (brand: string) => `/contents?brand=${brand}`,
  },
};

export const buildUrl = (endpoint: string, params?: Record<string, unknown>): string => {
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

export const handleApiError = (error: unknown): { code: string; message: string; details?: unknown } => {
  if (error && typeof error === 'object' && 'response' in error) {
    const errorResponse = error as { response: { status: number; data?: { message?: string } } };
    return {
      code: errorResponse.response.status.toString(),
      message: errorResponse.response.data?.message || 'An error occurred',
      details: errorResponse.response.data,
    };
  }
  const errorMessage = error && typeof error === 'object' && 'message' in error 
    ? (error as { message: string }).message 
    : 'An unexpected error occurred';
  return {
    code: '500',
    message: errorMessage,
    details: error,
  };
};

const apiConfig = {
  API_CONFIG,
  API_ENDPOINTS,
  buildUrl,
  handleApiError,
};

export default apiConfig;
