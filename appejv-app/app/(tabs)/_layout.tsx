import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs, useRouter, usePathname, useFocusEffect } from 'expo-router';
import { Pressable, useColorScheme, View, StyleSheet, Image, AppState } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import CustomTabBarClient from '../components/CustomTabBarClient';
import { useEffect, useState, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tạo useClientOnlyValue tạm thời nếu không import được
function useClientOnlyValue(webValue: any, nativeValue: any) {
  return nativeValue;
}

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

// Custom TabBar component dành cho người dùng không phải khách hàng
function RegularTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { authState } = useAuth();
  const userRoleId = authState.user?.role_id;
  const router = useRouter();

  console.log('RegularTabBar - userRoleId:', userRoleId);

  // Kiểm tra role_id từ AsyncStorage khi cần
  useEffect(() => {
    const checkRole = async () => {
      const roleIdStr = await AsyncStorage.getItem('@slm_user_role_id');
      console.log('RegularTabBar - Role ID từ AsyncStorage:', roleIdStr);

      if (roleIdStr === '3') {
        console.warn('RegularTabBar đang được hiển thị cho khách hàng (role_id = 3)');
      }
    };

    checkRole();
  }, []);

  // Lọc các routes được hiển thị dựa vào role
  const filteredRoutes = state.routes.filter((route: any) => {
    // Các vai trò khác hiển thị tất cả các tab ngoại trừ home_contract
    return route.name !== 'home_contract';
  });

  console.log(
    'RegularTabBar - Routes hiển thị:',
    filteredRoutes.map((r: any) => r.name)
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
      {filteredRoutes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === state.routes.findIndex((r: any) => r.key === route.key);

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            if (route.name === 'products') {
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
        if (route.name === 'index') {
          iconSource = require('@/assets/images/nav-icon-1.png');
        } else if (route.name === 'account') {
          iconSource = require('@/assets/images/nav-icon-2.png');
        } else if (route.name === 'products') {
          iconSource = require('@/assets/images/nav-icon-3.png');
        } else if (route.name === 'stats') {
          iconSource = require('@/assets/images/nav-icon-4.png');
        } else if (route.name === 'gallery') {
          iconSource = require('@/assets/images/nav-icon-5.png');
        }

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.tabItem}>
            <View style={[styles.iconContainer, isFocused && styles.activeIconContainer]}>
              <Image source={iconSource} style={styles.iconImage} resizeMode="contain" />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { authState } = useAuth();
  const [userRoleId, setUserRoleId] = useState<number | undefined>(authState.user?.role_id);
  // Thêm key để force re-render khi role_id thay đổi
  const [tabBarKey, setTabBarKey] = useState<number>(0);
  const appState = useRef(AppState.currentState);
  const lastCheckTime = useRef<number>(Date.now());

  // Xử lý khi app trở về foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground - checking role_id');
        checkRoleIdFromLocalStorage();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Kiểm tra định kỳ role_id từ AsyncStorage
  useEffect(() => {
    const refreshTimer = setInterval(
      () => {
        // Chỉ kiểm tra thông tin từ bộ nhớ local, không gọi API
        if (Date.now() - lastCheckTime.current > 3 * 60 * 1000) {
          // Tăng lên 3 phút
          console.log('Periodic check for role_id changes - local only');
          checkRoleIdFromLocalStorage();
          lastCheckTime.current = Date.now();
        }
      },
      3 * 60 * 1000
    ); // Tăng lên 3 phút

    return () => clearInterval(refreshTimer);
  }, []);

  // Screen focus effect
  useFocusEffect(
    useCallback(() => {
      console.log('Tab screen focused - checking role_id');
      checkRoleIdFromLocalStorage();

      return () => {
        // Cleanup when screen is unfocused
      };
    }, [])
  );

  // Kiểm tra role_id từ AsyncStorage - không gọi API
  const checkRoleIdFromLocalStorage = async () => {
    try {
      // Chỉ đọc dữ liệu từ AsyncStorage, không gọi API
      const roleIdStr = await AsyncStorage.getItem('@slm_user_role_id');
      const userData = await AsyncStorage.getItem('@slm_user_data');
      const parsedUserData = userData ? JSON.parse(userData) : null;

      const roleIdFromUserData = parsedUserData?.role_id;
      const roleIdFromAuthState = authState.user?.role_id;

      // Chỉ log khi role_id thay đổi để giảm thiểu log
      if (roleIdFromAuthState !== userRoleId) {
        console.log('TabLayout - Role ID từ AsyncStorage:', roleIdStr);
        console.log('TabLayout - Role ID từ user data:', roleIdFromUserData);
        console.log('TabLayout - Role ID từ authState:', roleIdFromAuthState);
      }

      // Ưu tiên role_id từ authState, sau đó đến userData, cuối cùng là roleIdStr
      const newRoleId =
        roleIdFromAuthState !== undefined
          ? roleIdFromAuthState
          : roleIdFromUserData !== undefined
            ? roleIdFromUserData
            : roleIdStr
              ? parseInt(roleIdStr, 10)
              : undefined;

      // Chỉ cập nhật state khi role_id thực sự thay đổi
      if (newRoleId !== userRoleId && newRoleId !== undefined) {
        console.log(`TabLayout - Cập nhật role_id: ${userRoleId} -> ${newRoleId}`);
        setUserRoleId(newRoleId);
        // Force re-render TabBar khi role_id thay đổi
        setTabBarKey(prevKey => prevKey + 1);
      }
    } catch (error) {
      console.error('Error checking role_id from local storage:', error);
    }
  };

  // Kiểm tra role_id từ AsyncStorage khi component mount và khi authState thay đổi
  useEffect(() => {
    if (authState.user?.role_id !== userRoleId) {
      console.log('AuthState changed, checking role_id');
      checkRoleIdFromLocalStorage();
    }
  }, [authState.user, authState.isAuthenticated]);

  console.log('TabLayout - Current userRoleId:', userRoleId);
  console.log(
    'TabLayout - Using TabBar:',
    userRoleId === 3 ? 'CustomTabBarClient' : 'RegularTabBar'
  );

  // Sử dụng TabBar dựa vào role người dùng
  const TabBarComponent = userRoleId === 3 ? CustomTabBarClient : RegularTabBar;

  return (
    <Tabs
      key={`tab-layout-${tabBarKey}`}
      tabBar={props => <TabBarComponent {...props} />}
      screenOptions={{
        headerShown: useClientOnlyValue(false, false),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Khách hàng tiềm năng',
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Sản phẩm',
          href: {
            pathname: '/(products)/product_brand',
            params: { id: '1' },
          },
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Thống kê',
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: 'Thư viện',
          href: '/(gallery)',
        }}
      />
      <Tabs.Screen
        name="home_contract"
        options={{
          title: 'Hồ sơ & Hợp đồng',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 5,
    justifyContent: 'space-evenly',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 5,
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
