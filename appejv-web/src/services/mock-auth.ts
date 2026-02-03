import { User, LoginCredentials } from '@/types';

// Mock Users Data
const MOCK_USERS: User[] = [
  {
    id: 1,
    role_id: 1,
    email: 'admin@appejv.vn',
    password: '123456',
    created_at: '2024-01-01T00:00:00Z',
    commission_rate: 10,
    name: 'Admin User',
    phone: '0123456789',
    parent_id: null,
    total_commission: 1000000,
    role: { name: 'admin', description: 'Administrator', id: 1 },
    address: 'Km 50, Quốc lộ 1A, xã Tiên Tân, Tp Phủ Lý, tỉnh Hà Nam',
  },
  {
    id: 2,
    role_id: 2,
    email: 'agent@appejv.vn',
    password: '123456',
    created_at: '2024-01-15T00:00:00Z',
    commission_rate: 5,
    name: 'Nguyễn Văn A',
    phone: '0987654321',
    parent_id: 1,
    total_commission: 500000,
    role: { name: 'agent', description: 'Sales Agent', id: 2 },
    address: 'Km 50, Quốc lộ 1A, xã Tiên Tân, Tp Phủ Lý, tỉnh Hà Nam',
  },
  {
    id: 3,
    role_id: 3,
    email: 'user@appejv.vn',
    password: '123456',
    created_at: '2024-02-01T00:00:00Z',
    commission_rate: null,
    name: 'Trần Thị B',
    phone: '0901234567',
    parent_id: 2,
    total_commission: null,
    role: { name: 'user', description: 'Customer', id: 3 },
    address: 'Km 50, Quốc lộ 1A, xã Tiên Tân, Tp Phủ Lý, tỉnh Hà Nam',
  },
  {
    id: 4,
    role_id: 4,
    email: null,
    password: '',
    created_at: '2024-01-01T00:00:00Z',
    commission_rate: null,
    name: 'Khách vãng lai',
    phone: '',
    parent_id: null,
    total_commission: null,
    role: { name: 'public', description: 'Public User', id: 4 },
    address: undefined,
  },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthService = {
  async getUsers(): Promise<User[]> {
    await delay(500);
    return MOCK_USERS;
  },

  async getPublicUser(): Promise<User> {
    await delay(100);
    return MOCK_USERS.find(u => u.role_id === 4) || MOCK_USERS[3];
  },

  async login(credentials: LoginCredentials): Promise<User | null> {
    await delay(800);
    const normalizedPhone = credentials.phone.replace(/\s+/g, '').trim();
    const user = MOCK_USERS.find(u => {
      const userPhone = u.phone.replace(/\s+/g, '').trim();
      return userPhone === normalizedPhone && u.password === credentials.password;
    });
    return user || null;
  },

  async isAuthenticated(): Promise<boolean> {
    await delay(300);
    if (typeof window === 'undefined') return false;
    const userData = localStorage.getItem('@appejv_user_data');
    const token = localStorage.getItem('@appejv_token');
    return !!(userData && token);
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(300);
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem('@appejv_user_data');
    if (userData) return JSON.parse(userData) as User;
    return null;
  },

  async storeUserData(user: User): Promise<void> {
    await delay(200);
    if (typeof window !== 'undefined') {
      localStorage.setItem('@appejv_user_data', JSON.stringify(user));
      localStorage.setItem('@appejv_token', 'mock-jwt-token-' + user.id);
      localStorage.setItem('@appejv_login_phone', user.phone);
      localStorage.setItem('@appejv_user_name', user.name);
    }
  },

  async updateUserProfile(userInfo: Partial<User>): Promise<User | null> {
    await delay(500);
    const currentUser = await this.getCurrentUser();
    if (!currentUser) return null;
    const updatedUser = { ...currentUser, ...userInfo };
    await this.storeUserData(updatedUser);
    return updatedUser;
  },

  async logout(): Promise<void> {
    await delay(300);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('@appejv_user_data');
      localStorage.removeItem('@appejv_token');
      localStorage.removeItem('@appejv_login_phone');
      localStorage.removeItem('@appejv_user_name');
    }
  },

  async clearAllUserData(): Promise<void> {
    await this.logout();
  },
};

export default mockAuthService;
