import { API_CONFIG } from '@/lib/api-config';
import { apiService } from './api';
import { mockSectorService } from './mock-sector';
import { mockAuthService } from './mock-auth';

// Service selector based on configuration
const useRealAPI = !API_CONFIG.USE_MOCK;

// Sector Service
export const sectorService = useRealAPI ? apiService.sectors : {
  getAllSectors: mockSectorService.getAllSectors,
  getSectorById: mockSectorService.getSectorById,
  getSectorCombos: mockSectorService.getSectorCombos,
};

// Product Service
export const productService = useRealAPI ? apiService.products : {
  getAllProducts: async (params?: { sector_id?: number; search?: string; page?: number; limit?: number }) => {
    // Convert mock combos to products format
    const combos = await mockSectorService.getAllCombos();
    return combos.map(combo => ({
      id: combo.id,
      name: combo.name,
      description: combo.description,
      price: combo.price,
      sector_id: combo.sector_id,
      image: combo.image,
      created_at: combo.created_at,
      updated_at: combo.updated_at,
    }));
  },
  getProductById: async (productId: string) => {
    const combos = await mockSectorService.getAllCombos();
    const combo = combos.find(c => c.id.toString() === productId);
    if (!combo) return null;
    return {
      id: combo.id,
      name: combo.name,
      description: combo.description,
      price: combo.price,
      sector_id: combo.sector_id,
      image: combo.image,
      created_at: combo.created_at,
      updated_at: combo.updated_at,
    };
  },
  searchProducts: async (query: string, params?: { sector_id?: number; page?: number; limit?: number }) => {
    const combos = await mockSectorService.getAllCombos();
    const filtered = combos.filter(combo => 
      combo.name.toLowerCase().includes(query.toLowerCase()) ||
      (combo.description && combo.description.toLowerCase().includes(query.toLowerCase()))
    );
    return filtered.map(combo => ({
      id: combo.id,
      name: combo.name,
      description: combo.description,
      price: combo.price,
      sector_id: combo.sector_id,
      image: combo.image,
      created_at: combo.created_at,
      updated_at: combo.updated_at,
    }));
  },
};

// Content Service
export const contentService = useRealAPI ? apiService.contents : {
  getAllContents: mockSectorService.getAllContents,
  getContentById: async (contentId: string) => {
    const contents = await mockSectorService.getAllContents();
    return contents.find(c => c.id.toString() === contentId) || null;
  },
  getContentsByBrand: async (brand: string, params?: { page?: number; limit?: number }) => {
    const contents = await mockSectorService.getAllContents();
    return contents.filter(c => c.brand === brand);
  },
};

// User Service
export const userService = useRealAPI ? apiService.users : {
  getAllUsers: mockAuthService.getUsers,
  getUserProfile: mockAuthService.getCurrentUser,
  updateUserProfile: mockAuthService.updateUserProfile,
};

// Auth Service - Always use real API for production, fallback to mock for development
export const authService = {
  login: async (credentials: { email?: string; phone?: string; password: string }) => {
    if (useRealAPI) {
      try {
        // For phone-based login, we need to find the user by phone first
        const response = await fetch(`${API_CONFIG.BASE_URL}/users?phone=${credentials.phone}`, {
          method: 'GET',
          headers: API_CONFIG.HEADERS,
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        
        const result = await response.json();
        const users = result.data || [];
        
        // Find user by phone
        const user = users.find((u: any) => u.phone === credentials.phone);
        if (!user) {
          throw new Error('User not found');
        }
        
        // For now, accept any password since we don't have password column
        // In production, you should implement proper password hashing and verification
        if (credentials.password !== '123456') {
          throw new Error('Invalid password');
        }
        
        return user;
      } catch (error) {
        console.error('API login error:', error);
        // Fallback to mock service for development
        return await mockAuthService.login(credentials);
      }
    } else {
      return await mockAuthService.login(credentials);
    }
  },
  logout: async () => {
    if (useRealAPI) {
      // For real API, implement actual logout
      return Promise.resolve();
    } else {
      return await mockAuthService.logout();
    }
  },
  getCurrentUser: async () => {
    if (useRealAPI) {
      // For real API, implement get current user
      // For now, return null to fall back to cookie-based auth
      return null;
    } else {
      return await mockAuthService.getCurrentUser();
    }
  },
};

// Export all services
export {
  sectorService as sectors,
  productService as products,
  contentService as contents,
  userService as users,
  authService as auth,
};

// Default export
export default {
  sectors: sectorService,
  products: productService,
  contents: contentService,
  users: userService,
  auth: authService,
};