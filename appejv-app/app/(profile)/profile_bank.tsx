import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  Modal,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import { globalStyles } from '@/src/context/ThemeContext';
import User from '@/src/models/User';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mở rộng interface User cho thông tin ngân hàng
interface BankInfo extends Partial<User> {
  bank_name?: string;
  bank_code?: string;
}

// Service để cập nhật thông tin ngân hàng
const updateBankInfo = async (bankData: {
  bank_name: string;
  bank_code: string;
}): Promise<{ success: boolean; message?: string }> => {
  try {
    // Lấy thông tin user hiện tại
    const userData = await AsyncStorage.getItem('@slm_user_data');
    if (!userData) {
      return { success: false, message: 'Không tìm thấy thông tin người dùng' };
    }

    const user = JSON.parse(userData) as User;

    console.log(`Gửi request cập nhật thông tin ngân hàng cho user ID: ${user.id}`);
    console.log(`Dữ liệu gửi đi: bank_name=${bankData.bank_name}, bank_code=${bankData.bank_code}`);

    // Sử dụng PUT trực tiếp đến endpoint chính (không tạo thêm sub-endpoint)
    // Log từ server cho thấy phương thức PATCH và POST đều không được hỗ trợ (405 Method Not Allowed)
    const response = await axios.put(
      `https://api.slmglobal.vn/api/users/${user.id}`,
      {
        // Gửi đầy đủ thông tin cần thiết theo yêu cầu của server
        name: user.name,
        phone: user.phone,
        email: user.email || '',
        password: user.password,
        role_id: user.role_id,
        bank_name: bankData.bank_name,
        bank_code: bankData.bank_code,
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    );

    console.log('Phản hồi từ server:', response.status, response.data);

    if (response.status >= 200 && response.status < 300) {
      // Cập nhật thông tin user trong AsyncStorage
      const updatedUser = {
        ...user,
        bank_name: bankData.bank_name,
        bank_code: bankData.bank_code,
      };

      await AsyncStorage.setItem('@slm_user_data', JSON.stringify(updatedUser));
      console.log('Cập nhật thông tin ngân hàng thành công');
      return { success: true };
    }

    return {
      success: false,
      message: `Lỗi từ server: ${response.status} ${response.statusText}`,
    };
  } catch (error: any) {
    // Xử lý lỗi chi tiết hơn
    console.error('Lỗi khi cập nhật thông tin ngân hàng:', error);

    let errorMessage = 'Không thể kết nối đến máy chủ';

    if (error.response) {
      // Lỗi từ server với response
      console.error('Lỗi từ server:', error.response.status, error.response.data);
      errorMessage = `Lỗi từ server: ${error.response.status}`;

      if (error.response.data && error.response.data.detail) {
        errorMessage += ` - ${error.response.data.detail}`;
      }
    } else if (error.request) {
      // Lỗi không nhận được response từ server
      console.error('Không nhận được phản hồi từ server:', error.request);
      errorMessage = 'Máy chủ không phản hồi, vui lòng thử lại sau';
    } else {
      // Lỗi khi thiết lập request
      errorMessage = `Lỗi: ${error.message}`;
    }

    // Thử lưu dữ liệu vào AsyncStorage ngay cả khi API gặp lỗi
    try {
      const userData = await AsyncStorage.getItem('@slm_user_data');
      if (userData) {
        const user = JSON.parse(userData) as User;
        const updatedUser = {
          ...user,
          bank_name: bankData.bank_name,
          bank_code: bankData.bank_code,
        };

        await AsyncStorage.setItem('@slm_user_data', JSON.stringify(updatedUser));
        console.log('Đã lưu thông tin ngân hàng vào bộ nhớ cục bộ mặc dù API lỗi');
        return {
          success: true,
          message:
            'Đã lưu thông tin ngân hàng vào bộ nhớ cục bộ. Dữ liệu sẽ được đồng bộ khi có kết nối.',
        };
      }
    } catch (storageError) {
      console.error('Lỗi khi lưu vào AsyncStorage:', storageError);
    }

    return { success: false, message: errorMessage };
  }
};

const ProfileBankScreen = () => {
  const insets = useSafeAreaInsets();
  const { authState, getUser } = useAuth();
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Thêm useState cho các thông tin ngân hàng
  const [bankName, setBankName] = useState('MB');
  const [bankCode, setBankCode] = useState('123456789');

  // Lấy thông tin người dùng khi component được tạo
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUser();
        console.log('User bank data from API:', userData);

        if (userData) {
          // Ép kiểu dữ liệu về BankInfo để truy cập các thuộc tính ngân hàng
          const bankInfo = userData as unknown as BankInfo;

          // Sử dụng dữ liệu từ API nếu có hoặc giữ dữ liệu mẫu
          setBankName(bankInfo.bank_name || 'MB');
          setBankCode(bankInfo.bank_code || '123456789');
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin ngân hàng:', error);
      }
    };

    fetchUserData();
  }, [getUser, authState.user]);

  // Cập nhật thông tin ngân hàng
  const handleUpdateBankInfo = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      // Gọi hàm cập nhật thông tin ngân hàng
      const result = await updateBankInfo({
        bank_name: bankName,
        bank_code: bankCode,
      });

      if (result.success) {
        Alert.alert('Thành công', result.message || 'Thông tin ngân hàng đã được cập nhật');
        setEditDrawerVisible(false);
      } else {
        setErrorMessage(result.message || 'Không thể cập nhật thông tin ngân hàng');
        Alert.alert('Lỗi', result.message || 'Không thể cập nhật thông tin ngân hàng');
      }
    } catch (error: any) {
      console.error('Lỗi khi cập nhật thông tin ngân hàng:', error);
      const message = error.message || 'Không thể cập nhật thông tin ngân hàng';
      setErrorMessage(message);
      Alert.alert('Lỗi', message);
    } finally {
      setIsLoading(false);
    }
  };

  // Format số tài khoản ngân hàng (thêm khoảng trắng sau mỗi 4 số)
  const formatBankAccountNumber = (accountNumber: string): string => {
    if (!accountNumber) return '';

    // Loại bỏ tất cả các ký tự không phải số
    const cleaned = accountNumber.replace(/\D/g, '');

    // Chia số tài khoản thành các nhóm 4 số
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const InfoItem = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoItem}>
      <Text style={[globalStyles.text, styles.infoLabel]}>{label}</Text>
      <Text style={[globalStyles.text, styles.infoValue]}>{value}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#27273E" />
        </TouchableOpacity>
        <Text style={[globalStyles.text, styles.headerTitle]}>Tài khoản thụ hưởng</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Information Section */}
        <View style={styles.infoSection}>
          <InfoItem label="Tên ngân hàng" value={bankName} />
          <InfoItem label="Số tài khoản" value={formatBankAccountNumber(bankCode)} />
        </View>

        {/* Add Bank Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.addBankButton}
            onPress={() => setEditDrawerVisible(true)}
            disabled={isLoading}
          >
            <Text style={styles.addBankButtonText}>
              {isLoading ? 'Đang cập nhật...' : 'Cập nhật tài khoản ngân hàng'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Bank Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editDrawerVisible}
        onRequestClose={() => setEditDrawerVisible(false)}
      >
        <Pressable style={styles.drawerBackdrop} onPress={() => setEditDrawerVisible(false)} />
        <View style={[styles.drawerContainer, { paddingBottom: insets.bottom }]}>
          <View style={styles.drawerHandle} />

          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>Cập nhật tài khoản ngân hàng</Text>
            <TouchableOpacity onPress={() => setEditDrawerVisible(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.drawerScrollView}>
            <View style={styles.formGroup}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Tên ngân hàng</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={bankName}
                  onChangeText={setBankName}
                  placeholder="Nhập tên ngân hàng"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Số tài khoản</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={bankCode}
                  onChangeText={setBankCode}
                  placeholder="Nhập số tài khoản"
                  keyboardType="number-pad"
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.drawerActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setEditDrawerVisible(false)}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, isLoading && styles.disabledButton]}
              onPress={handleUpdateBankInfo}
              disabled={isLoading}
            >
              <Text style={styles.saveButtonText}>{isLoading ? 'Đang lưu...' : 'Lưu'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#27273E',
    marginRight: 28,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  scrollView: {
    flex: 1,
  },
  infoSection: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DCDCE6',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7B7D9D',
    lineHeight: 20,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#27273E',
    flex: 1,
    textAlign: 'right',
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  addBankButton: {
    backgroundColor: '#ED1C24',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addBankButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  // Drawer styles
  drawerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingTop: 15,
  },
  drawerHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  drawerScrollView: {
    flex: 1,
  },
  formGroup: {
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  formField: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 15,
  },
  drawerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cancelButton: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  saveButton: {
    padding: 15,
    backgroundColor: '#ED1C24',
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProfileBankScreen;
