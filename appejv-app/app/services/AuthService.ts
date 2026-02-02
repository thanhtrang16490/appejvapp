import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, API_ENDPOINTS, handleApiError } from '@/src/config/api';
import User, { LoginCredentials } from '@/src/models/User';

// Authentication service class
class AuthService {
  // Fetch all users from API
  async getUsers(): Promise<User[]> {
    try {
      // Sử dụng fetch thay vì axios để tránh lỗi mạng
      const response = await fetch('https://api.slmglobal.vn/api/users', {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data as User[];
    } catch (error) {
      console.error('Error fetching users from API:', error);
      return []; // Trả về mảng rỗng thay vì dữ liệu mặc định
    }
  }

  // Authenticate user with phone and password
  async login(credentials: LoginCredentials): Promise<User | null> {
    try {
      console.log('------------------------------');
      console.log('Bắt đầu đăng nhập với số điện thoại:', credentials.phone);

      // Xóa toàn bộ dữ liệu đăng nhập cũ (để tránh cache)
      console.log('Xóa toàn bộ dữ liệu đăng nhập cũ...');
      const allKeys = await AsyncStorage.getAllKeys();
      const userRelatedKeys = allKeys.filter(
        key => key.startsWith('@slm_') && key !== '@slm_login_phone'
      );

      if (userRelatedKeys.length > 0) {
        await AsyncStorage.multiRemove(userRelatedKeys);
        console.log('Đã xóa tất cả dữ liệu người dùng cũ:', userRelatedKeys);
      }

      // Fetch all users
      const users = await this.getUsers();
      console.log(`Tổng số người dùng từ API: ${users.length}`);

      // Tiền xử lý số điện thoại để loại bỏ khoảng trắng và ký tự đặc biệt
      const normalizedPhone = credentials.phone.replace(/\s+/g, '').trim();
      console.log(`Đang kiểm tra SĐT: '${normalizedPhone}' và mật khẩu: '${credentials.password}'`);

      // Log tất cả số điện thoại để kiểm tra
      users.forEach(u => {
        const userPhone = u.phone.replace(/\s+/g, '').trim();
        console.log(`User trong database: ${u.name} - SĐT: '${userPhone}' - Role ID: ${u.role_id}`);
      });

      // Find user with matching phone and password
      const user = users.find(u => {
        const userPhone = u.phone.replace(/\s+/g, '').trim();
        const phoneMatch = userPhone === normalizedPhone;
        const passwordMatch = u.password === credentials.password;

        if (phoneMatch) {
          console.log(`Tìm thấy số điện thoại khớp: ${u.name} (Role ID: ${u.role_id})`);
          if (!passwordMatch) {
            console.log(
              `Mật khẩu không khớp cho ${u.name} - Nhập: '${credentials.password}', Cần: '${u.password}'`
            );
          }
        }

        return phoneMatch && passwordMatch;
      });

      if (user) {
        console.log('Đã xác thực người dùng:', user.name);
        console.log('ID người dùng:', user.id);
        console.log('Role ID ban đầu:', user.role_id);

        // Lấy thông tin user chi tiết từ API
        try {
          console.log('Đang lấy thông tin chi tiết từ API...');
          const response = await fetch(`https://api.slmglobal.vn/api/users/${user.id}`, {
            headers: {
              Accept: 'application/json',
            },
          });

          if (response.ok) {
            const userDetail = await response.json();
            console.log('Thông tin chi tiết từ API:', userDetail);
            console.log('Role ID từ API:', userDetail.role_id);

            if (userDetail.role) {
              user.role = userDetail.role;
              console.log('Đã cập nhật role từ API:', user.role);
            }

            if (userDetail.role_id) {
              user.role_id = userDetail.role_id;
              console.log('Đã cập nhật role_id từ API:', user.role_id);
            }
          }
        } catch (error) {
          console.error('Lỗi khi lấy thông tin chi tiết người dùng:', error);
        }

        // Store user data in AsyncStorage
        await this.storeUserData(user);

        // Kiểm tra dữ liệu đã lưu để xác nhận
        const storedRoleId = await AsyncStorage.getItem('@slm_user_role_id');
        const storedUserData = await AsyncStorage.getItem('@slm_user_data');
        console.log('Kiểm tra role_id đã lưu:', storedRoleId);
        console.log(
          'Kiểm tra user data đã lưu có role_id:',
          storedUserData ? JSON.parse(storedUserData).role_id : null
        );

        console.log(`Đăng nhập thành công: ${user.name} với role_id: ${user.role_id}`);
        console.log('------------------------------');
        return user;
      }

      console.log(`Không tìm thấy người dùng phù hợp`);
      console.log('------------------------------');
      return null;
    } catch (error) {
      console.error('Login error:', error);
      console.log('------------------------------');
      throw error;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const userData = await AsyncStorage.getItem('@slm_user_data');
      return !!userData;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  }

  // Store user data in AsyncStorage
  async storeUserData(user: User): Promise<void> {
    try {
      console.log('------------------------------');
      console.log('Đang lưu dữ liệu người dùng:', user.name);
      console.log('ID người dùng:', user.id);
      console.log('User role_id trước khi lưu:', user.role_id);
      console.log('User role trước khi lưu:', user.role);

      // Đảm bảo xóa dữ liệu cũ trước khi lưu
      await this.resetCache();

      // Lưu role_id trước
      if (user.role_id !== undefined && user.role_id !== null) {
        console.log('Lưu role_id:', user.role_id);
        await AsyncStorage.setItem('@slm_user_role_id', user.role_id.toString());
      } else {
        console.warn('Không có role_id để lưu');
      }

      // Lưu riêng role data
      if (user.role) {
        console.log('Lưu thông tin role:', user.role);
        await AsyncStorage.setItem('@slm_user_role', JSON.stringify(user.role));
      }

      // Lưu toàn bộ user data
      await AsyncStorage.setItem('@slm_user_data', JSON.stringify(user));
      await AsyncStorage.setItem('@slm_login_phone', user.phone);
      await AsyncStorage.setItem('@slm_user_name', user.name);
      await AsyncStorage.setItem('@slm_user_id', user.id.toString());

      // Lưu thời gian gọi API gần đây nhất (ngay khi login)
      await AsyncStorage.setItem('@slm_last_api_fetch_time', Date.now().toString());

      // Kiểm tra nếu là khách hàng (role_id = 3) và avatar rỗng hoặc null
      if (user.role_id === 3 && (!user.avatar || user.avatar === '')) {
        // Sử dụng avatar mặc định cho khách hàng
        console.log('Khách hàng không có avatar, sử dụng avatar mặc định');
        const defaultCustomerAvatar = 'avatar-customer';
        (user as any).avatar = defaultCustomerAvatar;
        await AsyncStorage.setItem('@slm_user_avatar', defaultCustomerAvatar);
      } else if ('avatar' in user && user.avatar) {
        await AsyncStorage.setItem('@slm_user_avatar', (user as any).avatar);
      }

      // Verify stored data
      const storedUser = await AsyncStorage.getItem('@slm_user_data');
      const storedRole = await AsyncStorage.getItem('@slm_user_role');
      const storedRoleId = await AsyncStorage.getItem('@slm_user_role_id');

      console.log('Kiểm tra dữ liệu đã lưu:');
      console.log('- User role_id:', storedRoleId);

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log('- User data role_id:', parsedUser.role_id);
      }

      console.log('- User role:', storedRole);
      console.log('Lưu dữ liệu người dùng thành công');
      console.log('------------------------------');
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
      console.log('------------------------------');
      console.log('Đang lấy thông tin người dùng hiện tại...');

      const userData = await AsyncStorage.getItem('@slm_user_data');

      // Kiểm tra thời gian lần cuối cùng gọi API, mặc định là 0 (chưa gọi bao giờ)
      const lastApiFetchTime = await AsyncStorage.getItem('@slm_last_api_fetch_time');
      const lastFetchTime = lastApiFetchTime ? parseInt(lastApiFetchTime, 10) : 0;
      const currentTime = Date.now();

      // Chỉ gọi API nếu đã qua ít nhất 3 phút kể từ lần cuối
      const shouldFetchFromApi = currentTime - lastFetchTime > 3 * 60 * 1000;

      console.log('Raw user data from AsyncStorage:', userData ? 'Found' : 'Not found');
      console.log(
        'Thời gian kể từ lần cuối gọi API:',
        (currentTime - lastFetchTime) / 1000,
        'giây'
      );
      console.log('Có nên gọi API không:', shouldFetchFromApi);

      if (userData) {
        const user = JSON.parse(userData) as User;
        console.log('User role_id từ AsyncStorage:', user.role_id);

        // Kiểm tra nếu là khách hàng (role_id = 3) và avatar rỗng hoặc null
        if (user.role_id === 3 && (!user.avatar || user.avatar === '')) {
          // Sử dụng avatar mặc định cho khách hàng
          console.log('Khách hàng không có avatar, sử dụng avatar mặc định');
          const defaultCustomerAvatar = 'avatar-customer';
          user.avatar = defaultCustomerAvatar;
        }

        // Lấy role data mới từ API - chỉ khi cần thiết
        if (shouldFetchFromApi && user.id) {
          try {
            console.log('Đang lấy thông tin vai trò mới từ API cho user ID:', user.id);
            const response = await fetch(`https://api.slmglobal.vn/api/users/${user.id}`, {
              headers: {
                Accept: 'application/json',
              },
            });

            // Cập nhật thời gian gọi API gần đây nhất
            await AsyncStorage.setItem('@slm_last_api_fetch_time', currentTime.toString());

            if (response.ok) {
              const freshData = await response.json();
              console.log('Role_id mới từ API:', freshData.role_id);

              let hasUpdates = false;

              if (freshData.role) {
                console.log('Cập nhật role với dữ liệu mới');
                user.role = freshData.role;
                hasUpdates = true;
              }

              if (
                freshData.role_id !== undefined &&
                freshData.role_id !== null &&
                freshData.role_id !== user.role_id
              ) {
                const oldRoleId = user.role_id;
                user.role_id = freshData.role_id;
                console.log(`Cập nhật role_id: ${oldRoleId} -> ${freshData.role_id}`);
                hasUpdates = true;
              }

              if (hasUpdates) {
                // Cập nhật lại AsyncStorage với role mới
                await AsyncStorage.setItem('@slm_user_role', JSON.stringify(freshData.role));
                await AsyncStorage.setItem('@slm_user_role_id', String(freshData.role_id));
                await AsyncStorage.setItem('@slm_user_data', JSON.stringify(user));
                console.log('Đã cập nhật dữ liệu người dùng trong AsyncStorage');
              } else {
                console.log('Không có thay đổi về role/role_id');
              }
            } else {
              console.error('API response not ok:', response.status);
            }
          } catch (error) {
            console.error('Error fetching fresh role data:', error);
            // Không cần thực hiện thêm, sẽ sử dụng dữ liệu từ AsyncStorage
          }
        } else {
          console.log('Sử dụng dữ liệu từ cache, không gọi API');
        }

        console.log('Final role_id:', user.role_id);
        console.log('------------------------------');
        return user;
      }

      console.log('Không tìm thấy dữ liệu người dùng trong AsyncStorage');
      console.log('------------------------------');
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      console.log('------------------------------');
      return null;
    }
  }

  // Reset cache để đảm bảo không còn dữ liệu cũ
  async resetCache(): Promise<void> {
    try {
      console.log('Đang xóa toàn bộ cache để đảm bảo không còn dữ liệu cũ...');

      // Xóa toàn bộ dữ liệu liên quan đến người dùng
      const allKeys = await AsyncStorage.getAllKeys();
      const userRelatedKeys = allKeys.filter(
        key => key.startsWith('@slm_') && key !== '@slm_login_phone'
      );

      if (userRelatedKeys.length > 0) {
        await AsyncStorage.multiRemove(userRelatedKeys);
        console.log('Đã xóa các key liên quan đến người dùng:', userRelatedKeys);
      }

      // Kiểm tra lại dữ liệu sau khi xóa
      const remainingUserData = await AsyncStorage.getItem('@slm_user_data');
      const remainingRoleId = await AsyncStorage.getItem('@slm_user_role_id');
      console.log('Dữ liệu người dùng sau khi xóa cache:', remainingUserData);
      console.log('Role ID sau khi xóa cache:', remainingRoleId);
    } catch (error) {
      console.error('Error resetting cache:', error);
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      console.log('------------------------------');
      console.log('Đang đăng xuất và xóa dữ liệu người dùng...');

      // Hiển thị log dữ liệu người dùng hiện tại trước khi đăng xuất
      const currentUserData = await AsyncStorage.getItem('@slm_user_data');
      const currentRoleId = await AsyncStorage.getItem('@slm_user_role_id');
      console.log('Dữ liệu người dùng trước khi đăng xuất:', currentUserData);
      console.log('Role ID trước khi đăng xuất:', currentRoleId);

      // Xóa toàn bộ cache
      await this.resetCache();

      // Xóa các key khác liên quan đến ứng dụng
      const keysToRemove = [
        'customerData',
        'quotationProducts',
        'quotationTotalPrice',
        'quotationConfig',
        '@slm_temp_form_data',
      ];

      // Xóa từng key một
      for (const key of keysToRemove) {
        await AsyncStorage.removeItem(key);
        console.log(`Đã xóa dữ liệu: ${key}`);
      }

      // Ghi log thông tin còn lại sau khi đăng xuất
      const remainingKeys = await AsyncStorage.getAllKeys();
      console.log('Các key còn lại sau khi đăng xuất:', remainingKeys);
      console.log('------------------------------');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
}

export default new AuthService();
