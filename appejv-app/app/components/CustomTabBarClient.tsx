import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Image, Pressable, Text, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CustomerNavbarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const CustomTabBarClient: React.FC<CustomerNavbarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { authState } = useAuth();
  const [isCustomer, setIsCustomer] = useState<boolean>(false);
  const checkedRole = useRef<boolean>(false);

  // Kiểm tra role_id từ context chỉ khi cần thiết
  useEffect(() => {
    // Chỉ kiểm tra role một lần hoặc khi authState thay đổi
    if (!checkedRole.current || authState.user?.role_id !== undefined) {
      const checkRole = async () => {
        try {
          // Lấy role_id từ nhiều nguồn để đảm bảo chính xác
          const roleIdStr = await AsyncStorage.getItem('@slm_user_role_id');
          const userData = await AsyncStorage.getItem('@slm_user_data');
          const parsedUserData = userData ? JSON.parse(userData) : null;

          const roleIdFromStorage = roleIdStr ? parseInt(roleIdStr, 10) : undefined;
          const roleIdFromUserData = parsedUserData?.role_id;
          const roleIdFromAuthState = authState.user?.role_id;

          // Chỉ log khi thực sự cần
          console.log('CustomTabBarClient - Role ID check');

          // Ưu tiên authState, sau đó đến dữ liệu người dùng, cuối cùng là giá trị lưu trực tiếp
          const effectiveRoleId =
            roleIdFromAuthState !== undefined
              ? roleIdFromAuthState
              : roleIdFromUserData !== undefined
                ? roleIdFromUserData
                : roleIdFromStorage;

          const customer = effectiveRoleId === 3;

          // Chỉ cập nhật state khi giá trị thay đổi
          if (customer !== isCustomer) {
            console.log('CustomTabBarClient - Effective role_id:', effectiveRoleId);
            setIsCustomer(customer);

            if (!customer) {
              console.warn(
                'CustomTabBarClient đang được hiển thị cho user không phải khách hàng (role_id != 3)'
              );
            }
          }

          // Đánh dấu đã kiểm tra
          checkedRole.current = true;
        } catch (error) {
          console.error('Error checking role in CustomTabBarClient:', error);
        }
      };

      checkRole();
    }
  }, [authState.user]);

  // Định nghĩa menu cho khách hàng (role_id = 3)
  const customerRoutes = state.routes.filter(
    (route: any) =>
      route.name === 'gallery' || route.name === 'product_brand'
  );

  // Sắp xếp theo thứ tự: Product Brand - Gallery
  const sortedRoutes = [...customerRoutes].sort((a, b) => {
    const order = {
      product_brand: 1,
      gallery: 2,
    };
    return (
      (order[a.name as keyof typeof order] || 99) - (order[b.name as keyof typeof order] || 99)
    );
  });

  // Kiểm tra và chuyển hướng đến Gallery nếu không có tab nào được chọn
  useEffect(() => {
    if (state.index === -1 || !sortedRoutes.some(route => route.key === state.routes[state.index]?.key)) {
      navigation.navigate('gallery');
    }
  }, [state.index, state.routes, navigation]);

  console.log(
    'CustomTabBarClient - Routes hiển thị:',
    sortedRoutes.map(r => r.name)
  );

  return (
    <View
      style={[
        styles.tabBar,
        {
          height: 60 + (insets.bottom > 0 ? insets.bottom : 10),
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
        },
      ]}
    >
      {sortedRoutes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === state.routes.findIndex((r: any) => r.key === route.key);

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            if (route.name === 'product_brand') {
              // Chuyển hướng đến trang product_brand với id của SolarMax
              router.push({
                pathname: '/(products)/product_brand',
                params: { id: '1' },
              });
            } else {
              navigation.navigate(route.name);
            }
          }
        };

        // Lấy icon phù hợp
        let iconSource;

        if (route.name === 'gallery') {
          iconSource = require('../../assets/images/nav-icon-5.png');
        } else if (route.name === 'product_brand') {
          iconSource = require('../../assets/images/nav-icon-3.png');
        }

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.tabItem}>
            <View style={[styles.iconContainer, isFocused && styles.activeIconContainer]}>
              <Image 
                source={iconSource} 
                style={[styles.iconImage, { tintColor: isFocused ? '#D9261C' : '#7B7D9D' }]} 
                resizeMode="contain" 
              />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  activeIconContainer: {
    backgroundColor: '#FFE8E8',
    borderRadius: 50,
    padding: 12,
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 5,
    justifyContent: 'space-evenly',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomTabBarClient;
