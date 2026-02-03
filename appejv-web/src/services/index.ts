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
  updateUserProfile: mockAuthService.updateUser,
};

// Auth Service
export const authService = useRealAPI ? {
  login: async (credentials: { email?: string; phone?: string; password: string }) => {
    // Convert phone-based login to email-based for API compatibility
    const apiCredentials = {
      email: credentials.email || credentials.phone || '',
      password: credentials.password
    };
    // For real API, implement actual login
    throw new Error('Real API login not implemented yet');
  },
  logout: async () => {
    // For real API, implement actual logout
    throw new Error('Real API logout not implemented yet');
  },
  getCurrentUser: async () => {
    // For real API, implement get current user
    throw new Error('Real API getCurrentUser not implemented yet');
  },
} : mockAuthService;

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