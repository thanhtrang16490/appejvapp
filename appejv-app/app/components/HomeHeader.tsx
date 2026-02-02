import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text as AntText, Flex } from '@ant-design/react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HomeHeaderProps {
  userName: string;
  userPhone: string;
  userAvatar: string | null;
  userRoleId: number | null;
  isLoadingCommission?: boolean;
  totalCommissionAmount?: number;
  isAmountVisible?: boolean;
  onToggleAmountVisibility?: () => void;
  onNavigateToGroupAgent?: () => void;
  onNavigateToCommissionHistory?: () => void;
  onRefreshAvatar?: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  userName,
  userPhone,
  userAvatar,
  userRoleId,
  isLoadingCommission = false,
  totalCommissionAmount = 0,
  isAmountVisible = false,
  onToggleAmountVisibility = () => {},
  onNavigateToGroupAgent = () => {},
  onNavigateToCommissionHistory = () => {},
  onRefreshAvatar = () => {},
}) => {
  const insets = useSafeAreaInsets();

  // Format số tiền
  const formatCurrency = (amount: number) => {
    // Làm tròn đến hàng nghìn
    const roundedAmount = Math.round(amount / 1000) * 1000;
    // Format không hiển thị phần thập phân
    return new Intl.NumberFormat('vi-VN', {
      maximumFractionDigits: 0,
    }).format(roundedAmount);
  };

  // Format số điện thoại theo dạng xxxx xxx xxx
  const formatPhoneNumber = (phoneNumber: string): string => {
    if (!phoneNumber) return '';

    // Loại bỏ tất cả các ký tự không phải số
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Xử lý các trường hợp khác nhau
    if (cleaned.length === 10) {
      // Định dạng tiêu chuẩn cho 10 số (xxx xxx xxxx)
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('84')) {
      // Trường hợp số điện thoại bắt đầu bằng 84 (mã quốc gia Việt Nam)
      const withoutCountryCode = cleaned.slice(2);
      return `${withoutCountryCode.slice(0, 3)} ${withoutCountryCode.slice(3, 6)} ${withoutCountryCode.slice(6)}`;
    } else if (cleaned.length === 9) {
      // Một số định dạng cũ có thể chỉ có 9 số
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    } else if (cleaned.length > 10) {
      // Với số dài hơn 10 số, hiển thị không phân tách ở cuối
      // Chỉ phân tách 2 nhóm đầu tiên, phần còn lại giữ nguyên
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }

    // Với số ngắn hơn 9 số, giữ nguyên không phân tách
    return cleaned;
  };

  // Hàm tạo chuỗi * thay thế số tiền
  const getMaskedAmount = (amount: number) => {
    // Tạo chuỗi * với độ dài tương ứng với số tiền
    const amountString = formatCurrency(amount);
    return '*'.repeat(Math.min(amountString.length, 10));
  };

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <View style={styles.headerOverlay} />

      <View style={{ height: 16 }} />

      <Flex
        direction="row"
        align="center"
        justify="between"
        style={{ zIndex: 3, paddingHorizontal: 16 }}
      >
        <TouchableOpacity
          onPress={() => router.push('/profile')}
          style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
        >
          {userAvatar ? (
            userAvatar === 'avatar-customer' ? (
              <View style={styles.avatarPlaceholder}>
                <Image
                  source={require('../../assets/images/avatar-customer.jpeg')}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </View>
            ) : (
              <Image
                source={{ uri: userAvatar }}
                style={styles.avatarPlaceholder}
                onError={() => {
                  console.log('Lỗi khi tải ảnh avatar từ URI:', userAvatar);
                  onRefreshAvatar();
                }}
              />
            )
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={24} color="white" />
            </View>
          )}
          <View style={styles.userInfo}>
            <Text style={styles.greeting} numberOfLines={1}>
              {userName || 'Người dùng'}
            </Text>
            <Text style={styles.userId} numberOfLines={1}>
              {formatPhoneNumber(userPhone) || '(Chưa đăng nhập)'}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.notificationContainer}>
          <Flex direction="row" align="center">
            {(userRoleId === 1 || userRoleId === 2) && (
              <TouchableOpacity
                style={styles.notificationIconContainer}
                onPress={() => router.push('/(quotation)/quotation_create_new')}
              >
                <Image
                  source={require('../../assets/images/trail-icon.png')}
                  style={{ width: 24, height: 24 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.notificationIconContainer,
                userRoleId === 1 || userRoleId === 2 ? { marginLeft: 8 } : {},
              ]}
              onPress={() => router.push('/(notification)/notification')}
            >
              <Image
                source={require('../../assets/images/bell.png')}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </Flex>
        </View>
      </Flex>

      {/* Income Card - Ẩn với Khách hàng */}
      {userRoleId !== 3 && (
        <>
          <View style={{ height: 16 }} />
          <View style={{ ...styles.incomeCard, marginHorizontal: 16, borderRadius: 10 }}>
            <LinearGradient
              colors={['rgba(255, 208, 121, 0.6)', 'rgba(255, 208, 121, 0)']}
              locations={[0, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.incomeCardContent, { borderRadius: 10 }]}
            >
              <Flex direction="row" align="center" justify="between">
                <View style={[styles.incomeTextContainer, { justifyContent: 'center' }]}>
                  <Text style={styles.incomeTitle}>
                    Thu nhập dự kiến {`T${new Date().getMonth() + 1}`}
                  </Text>
                  <Flex align="center">
                    {isLoadingCommission ? (
                      <ActivityIndicator size="small" color="#fff" style={{ marginRight: 10 }} />
                    ) : (
                      <Text style={styles.incomeAmount}>
                        {isAmountVisible
                          ? formatCurrency(totalCommissionAmount)
                          : getMaskedAmount(totalCommissionAmount)}
                      </Text>
                    )}
                    <TouchableOpacity onPress={onToggleAmountVisibility}>
                      <Image
                        source={require('../../assets/images/eye-icon.png')}
                        style={{ width: 36, height: 36, marginLeft: 2 }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </Flex>
                </View>
                <View
                  style={[
                    styles.iconContainer,
                    { paddingBottom: 8, paddingTop: 8, alignSelf: 'center' },
                  ]}
                >
                  {userRoleId !== 5 && (
                    <TouchableOpacity style={styles.statItem} onPress={onNavigateToGroupAgent}>
                      <Image
                        source={require('../../assets/images/cong-dong.png')}
                        style={{ width: 24, height: 24, marginBottom: 4 }}
                        resizeMode="contain"
                      />
                      <Text style={styles.statLabel}>Cộng đồng</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.statItem, { marginLeft: userRoleId !== 5 ? 16 : 0 }]}
                    onPress={onNavigateToCommissionHistory}
                  >
                    <Image
                      source={require('../../assets/images/chart-pie.png')}
                      style={{ width: 24, height: 24, marginBottom: 4 }}
                      resizeMode="contain"
                    />
                    <Text style={styles.statLabel}>Thống kê</Text>
                  </TouchableOpacity>
                </View>
              </Flex>
            </LinearGradient>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#ED1C24',
    padding: 0,
    paddingTop: 16,
    paddingBottom: 24,
    position: 'relative',
    zIndex: 0,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ABACC2',
    zIndex: 3,
    overflow: 'hidden',
  },
  userInfo: {
    marginLeft: 12,
    zIndex: 3,
    flex: 1,
  },
  greeting: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userId: {
    color: '#F79009',
    fontSize: 14,
    flexWrap: 'wrap',
  },
  notificationContainer: {
    position: 'relative',
    zIndex: 3,
  },
  notificationIconContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    borderRadius: 20,
    padding: 8,
    position: 'relative',
  },
  incomeCard: {
    backgroundColor: 'rgba(180, 120, 70, 0.9)',
    borderRadius: 10,
    borderWidth: 0,
    marginHorizontal: 16,
    zIndex: 2,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
      },
    }),
  },
  incomeCardContent: {
    padding: 12,
    zIndex: 2,
  },
  incomeTextContainer: {
    flex: 1,
    marginRight: 16,
    zIndex: 2,
  },
  incomeTitle: {
    color: 'white',
    fontSize: 15,
    marginBottom: 4,
  },
  incomeAmount: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    zIndex: 2,
  },
  statItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    color: 'white',
    fontSize: 11,
  },
});

export default HomeHeader;
