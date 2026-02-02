import React from 'react';
import { StyleSheet, View, Image, Pressable, Text } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';

interface CustomerNavbarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const CustomerNavbar: React.FC<CustomerNavbarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Định nghĩa menu cho khách hàng (role_id = 3)
  const customerRoutes = state.routes.filter(
    (route: any) =>
      route.name === 'index' || route.name === 'gallery' || route.name === 'home_contract'
  );

  // Sắp xếp theo thứ tự: Home - Home Contract - Gallery
  const sortedRoutes = [...customerRoutes].sort((a, b) => {
    const order = {
      index: 1,
      home_contract: 2,
      gallery: 3,
    };
    return (
      (order[a.name as keyof typeof order] || 99) - (order[b.name as keyof typeof order] || 99)
    );
  });

  return (
    <View
      style={[
        styles.tabBar,
        {
          height: 60 + (insets.bottom > 0 ? insets.bottom : 10),
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          marginTop: 12, // Thêm margin trên cùng cho navbar khách hàng
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
            navigation.navigate(route.name);
          }
        };

        // Lấy icon phù hợp
        let iconSource;
        let label = '';

        if (route.name === 'index') {
          iconSource = require('@/assets/images/nav-icon-1.png');
          label = 'Trang chủ';
        } else if (route.name === 'gallery') {
          iconSource = require('@/assets/images/nav-icon-5.png');
          label = 'Thư viện';
        } else if (route.name === 'home_contract') {
          iconSource = require('@/assets/images/nav-icon-2.png');
          label = 'Hợp đồng';
        }

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.tabItem}>
            <View style={[styles.iconContainer, isFocused && styles.activeIconContainer]}>
              <Image source={iconSource} style={styles.iconImage} resizeMode="contain" />
            </View>
            <Text style={[styles.tabLabel, isFocused && styles.activeTabLabel]}>{label}</Text>
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
    backgroundColor: '#fff',
    borderRadius: 40,
    marginHorizontal: 16,
    paddingTop: 5,
    justifyContent: 'space-evenly',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#777',
  },
  activeTabLabel: {
    color: '#ED1C24',
    fontWeight: '600',
  },
});

export default CustomerNavbar;
