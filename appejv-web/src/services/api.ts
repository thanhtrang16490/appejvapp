import { API_CONFIG, buildUrl, handleApiError } from '@/lib/api-config';

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

  async get<T>(endpoint: string, options?: { params?: Record<string, unknown> }): Promise<T> {
    const url = options?.params ? buildUrl(endpoint, options.params) : endpoint;
    return this.request<T>(url);
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

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
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

// Generic API service
export const apiService = {
  // Generic methods
  get: <T>(endpoint: string, options?: { params?: Record<string, unknown> }) => 
    apiClient.get<T>(endpoint, options),
  post: <T>(endpoint: string, data?: unknown) => 
    apiClient.post<T>(endpoint, data),
  put: <T>(endpoint: string, data?: unknown) => 
    apiClient.put<T>(endpoint, data),
  patch: <T>(endpoint: string, data?: unknown) => 
    apiClient.patch<T>(endpoint, data),
  delete: <T>(endpoint: string) => 
    apiClient.delete<T>(endpoint),

  // Users
  getUsers: (params?: Record<string, unknown>) => apiService.get('/users', { params }),
  getUserById: (id: number) => apiService.get(`/users/${id}`),
  updateUser: (id: number, data: Record<string, unknown>) => apiService.put(`/users/${id}`, data),

  // Products
  getProducts: (params?: Record<string, unknown>) => apiService.get('/products', { params }),
  getProductById: (id: number) => apiService.get(`/products/${id}`),

  // Sectors
  getSectors: (params?: Record<string, unknown>) => apiService.get('/sectors', { params }),
  getSectorById: (id: number) => apiService.get(`/sectors/${id}`),

  // Contents
  getContents: (params?: Record<string, unknown>) => apiService.get('/contents', { params }),
  getContentById: (id: number) => apiService.get(`/contents/${id}`),

  // Quotations
  getQuotations: (params?: Record<string, unknown>) => apiService.get('/quotations', { params }),
  getQuotationById: (id: number) => apiService.get(`/quotations/${id}`),
  createQuotation: (data: Record<string, unknown>) => apiService.post('/quotations', data),
  updateQuotation: (id: number, data: Record<string, unknown>) => apiService.put(`/quotations/${id}`, data),

  // Contacts
  getContacts: (params?: Record<string, unknown>) => apiService.get('/contacts', { params }),
  getContactById: (id: number) => apiService.get(`/contacts/${id}`),
  createContact: (data: Record<string, unknown>) => apiService.post('/contacts', data),
  updateContact: (id: number, data: Record<string, unknown>) => apiService.put(`/contacts/${id}`, data),

  // Contracts
  getContracts: (params?: Record<string, unknown>) => apiService.get('/contracts', { params }),
  getContractById: (id: number) => apiService.get(`/contracts/${id}`),
  createContract: (data: Record<string, unknown>) => apiService.post('/contracts', data),

  // Commissions
  getCommissions: (params?: Record<string, unknown>) => apiService.get('/commissions', { params }),
  getCommissionById: (id: number) => apiService.get(`/commissions/${id}`),
  createCommission: (data: Record<string, unknown>) => apiService.post('/commissions', data),

  // Notifications
  getNotifications: (params?: Record<string, unknown>) => apiService.get('/notifications', { params }),
  markNotificationsAsRead: (ids: number[]) => apiService.patch('/notifications', { ids, read_at: new Date().toISOString() }),
  createNotification: (data: Record<string, unknown>) => apiService.post('/notifications', data),

  // Orders
  getOrders: (params?: Record<string, unknown>) => apiService.get('/orders', { params }),
  getOrderById: (id: number) => apiService.get(`/orders/${id}`),
  createOrder: (data: Record<string, unknown>) => apiService.post('/orders', data),
  updateOrder: (id: number, data: Record<string, unknown>) => apiService.put(`/orders/${id}`, data),
  deleteOrder: (id: number) => apiService.delete(`/orders/${id}`),

  // Payments
  getPayments: (params?: Record<string, unknown>) => apiService.get('/payments', { params }),
  createPayment: (data: Record<string, unknown>) => apiService.post('/payments', data),

  // Delivery Tracking
  getDeliveryTracking: (params?: Record<string, unknown>) => apiService.get('/delivery-tracking', { params }),
  createDeliveryTracking: (data: Record<string, unknown>) => apiService.post('/delivery-tracking', data),

  // Accounts Receivable
  getAccountsReceivable: (params?: Record<string, unknown>) => apiService.get('/accounts-receivable', { params }),
  updateAccountsReceivable: (data: Record<string, unknown>) => apiService.put('/accounts-receivable', data),

  // Revenue Tracking
  getRevenueTracking: (params?: Record<string, unknown>) => apiService.get('/revenue-tracking', { params }),
  createRevenueTracking: (data: Record<string, unknown>) => apiService.post('/revenue-tracking', data),
  getRevenueSummary: (data: Record<string, unknown>) => apiService.put('/revenue-tracking', data),

  // Inventory Management
  getProductInventory: (productId: string) => apiService.get(`/products/${productId}/inventory`),
  getMultipleProductInventory: (productIds: string[]) => apiService.post('/inventory/bulk', { product_ids: productIds }),
  validateInventoryForOrder: (items: { product_id: string; quantity: number }[]) => 
    apiService.post('/inventory/validate', { items }),
  updateProductInventory: (productId: string, data: { quantity_change: number; reason: string }) => 
    apiService.put(`/products/${productId}/inventory`, data),

  // Order Management
  getOrdersList: () => apiService.getOrders(),
  getOrderDetails: (orderId: string) => apiService.getOrderById(parseInt(orderId)),
  createOrderWithValidation: (data: Record<string, unknown>) => apiService.post('/orders/create-with-validation', data),
  updateOrderStatus: (orderId: string, status: string) => 
    apiService.patch(`/orders/${orderId}/status`, { status }),
};

// Legacy services for backward compatibility
export const sectorService = {
  getAllSectors: () => apiService.getSectors({ include_products: 'true' }),
  getSectorById: (id: number) => apiService.getSectorById(id),
  getSectorCombos: (id: number) => apiService.getSectorById(id),
};

export const productService = {
  getAllProducts: (params?: Record<string, unknown>) => apiService.getProducts(params),
  getProductById: (id: string) => apiService.getProductById(parseInt(id)),
  searchProducts: (query: string, params?: Record<string, unknown>) => apiService.getProducts({ search: query, ...params }),
};

export const contentService = {
  getAllContents: (params?: Record<string, unknown>) => apiService.getContents(params),
  getContentById: (id: string) => apiService.getContentById(parseInt(id)),
  getContentsByBrand: (brand: string, params?: Record<string, unknown>) => apiService.getContents({ brand, ...params }),
};

export const userService = {
  getAllUsers: (params?: Record<string, unknown>) => apiService.getUsers(params),
  getUserProfile: () => apiService.get('/users/profile'),
  updateUserProfile: (data: Record<string, unknown>) => apiService.put('/users/profile', data),
};

export default apiService;