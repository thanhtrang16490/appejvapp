import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, API_ENDPOINTS, handleApiError } from '@/src/config/api';
import User, { LoginCredentials } from '@/src/models/User';

// Authentication service class
class AuthService {
  // Fetch all users from API
  async getUsers(): Promise<User[]> {
    try {
      console.log('Fetching users from API...');
      const response = await axios.get<User[]>(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.USERS.LIST}`,
        {
          headers: API_CONFIG.HEADERS,
          timeout: API_CONFIG.TIMEOUT,
        }
      );

      if (response.status === 200) {
        console.log(`Successfully fetched ${response.data.length} users`);
        return response.data;
      } else {
        console.error(`API returned unexpected status: ${response.status}`);
        throw new Error(`API returned status ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching users:', error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('API Error Response:', {
            status: error.response.status,
            data: error.response.data,
          });
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error setting up request:', error.message);
        }
      }

      throw handleApiError(error);
    }
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('@slm_token');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async refreshToken(): Promise<void> {
    try {
      const refreshToken = await AsyncStorage.getItem('@slm_refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/auth/refresh`,
        { refresh_token: refreshToken },
        { headers: API_CONFIG.HEADERS }
      );

      if (response.status === 200 && response.data.token) {
        await AsyncStorage.setItem('@slm_token', response.data.token);
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }

  // Authenticate user with phone and password
  async login(credentials: LoginCredentials): Promise<User | null> {
    try {
      console.log('Starting login process...');

      // Fetch all users
      const users = await this.getUsers();
      console.log(`Total users from API: ${users.length}`);

      // Normalize phone number
      const normalizedPhone = credentials.phone.replace(/\s+/g, '').trim();
      console.log(`Checking phone: '${normalizedPhone}' and password: '${credentials.password}'`);

      // Find matching user
      const user = users.find(u => {
        const userPhone = u.phone.replace(/\s+/g, '').trim();
        const phoneMatch = userPhone === normalizedPhone;
        const passwordMatch = u.password === credentials.password;

        if (phoneMatch) {
          console.log(`Found matching phone for user: ${u.name}`);
          if (!passwordMatch) {
            console.log(`Password mismatch for ${u.name}`);
          }
        }

        return phoneMatch && passwordMatch;
      });

      if (user) {
        console.log(`Login successful for user: ${user.name}`);
        await this.storeUserData(user);
        return user;
      }

      console.log('No matching user found');
      return null;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const [userData, token] = await Promise.all([
        AsyncStorage.getItem('@slm_user_data'),
        AsyncStorage.getItem('@slm_token')
      ]);
      
      // Chỉ trả về true nếu có cả userData và token
      return !!(userData && token);
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  }

  // Store user data in AsyncStorage
  async storeUserData(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem('@slm_user_data', JSON.stringify(user));
      await AsyncStorage.setItem('@slm_login_phone', user.phone);
      await AsyncStorage.setItem('@slm_user_name', user.name);
    } catch (error) {
      console.error('Error storing user data:', error);
      throw error;
    }
  }

  // Update user profile information
  async updateUserProfile(userInfo: {
    email?: string | null;
    address?: string;
    idNumber?: string;
    birthDate?: string;
    gender?: string;
    avatar?: string;
    phone?: string;
  }): Promise<User | null> {
    try {
      // Get current user data
      const currentUser = await this.getCurrentUser();

      if (!currentUser) {
        throw new Error('No user data found');
      }

      // Update user information
      const updatedUser: User = {
        ...currentUser,
        email: userInfo.email !== undefined ? userInfo.email : currentUser.email,
        phone: userInfo.phone !== undefined ? userInfo.phone : currentUser.phone,
        // Store additional user info in user object
        // These fields are not in the User interface, so we use type assertion
        ...(userInfo.address && { address: userInfo.address }),
        ...(userInfo.idNumber && { idNumber: userInfo.idNumber }),
        ...(userInfo.birthDate && { birthDate: userInfo.birthDate }),
        ...(userInfo.gender && { gender: userInfo.gender }),
        ...(userInfo.avatar && { avatar: userInfo.avatar }),
      };

      // Store updated user data
      await this.storeUserData(updatedUser);
      console.log('User profile updated successfully');

      return updatedUser;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Get current user data
  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem('@slm_user_data');
      if (userData) {
        return JSON.parse(userData) as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Xóa tất cả thông tin người dùng đã lưu
  async clearAllUserData(): Promise<void> {
    try {
      await AsyncStorage.removeItem('@slm_user_data');
      await AsyncStorage.removeItem('@slm_login_phone');
      await AsyncStorage.removeItem('@slm_user_name');
      console.log('Đã xóa tất cả thông tin người dùng từ AsyncStorage');
    } catch (error) {
      console.error('Lỗi khi xóa thông tin người dùng:', error);
      throw error;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // Xóa tất cả dữ liệu người dùng
      await AsyncStorage.multiRemove([
        '@slm_user_data',
        '@slm_login_phone',
        '@slm_user_name',
        '@slm_token',
        '@slm_refresh_token'
      ]);
      
      // Đảm bảo dữ liệu đã được xóa
      const userData = await AsyncStorage.getItem('@slm_user_data');
      if (userData) {
        throw new Error('Failed to clear user data');
      }
      
      console.log('Đã xóa tất cả thông tin người dùng từ AsyncStorage');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
}

export default new AuthService();
