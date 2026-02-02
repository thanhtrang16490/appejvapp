import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, Stack } from 'expo-router';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import { useAuth } from '@/src/context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import UserDevices from '@/app/components/UserDevices';
import HomeHeader from '@/app/components/HomeHeader';

// Định nghĩa kiểu dữ liệu cho người dùng
interface User {
  id: number;
  name: string;
  phone: string;
  address: string;
  avatar: string;
}

// Định nghĩa kiểu dữ liệu cho thiết bị
interface Device {
  id: number;
  name: string;
  activationDate: string;
  warrantyPeriod: string;
  expireDate: string;
  progressPercent: number;
  imageUrl?: string;
}

// Định nghĩa kiểu dữ liệu cho pre_quote_merchandise
interface PreQuoteMerchandise {
  id: number;
  merchandise_id: number;
  pre_quote_id: number;
  name: string;
  warranty_years: number;
  warranty_period_unit: string;
  activation_date?: string;
  created_at: string;
  updated_at: string;
  merchandise?: {
    id: number;
    name: string;
    images?: Array<{
      id: number;
      merchandise_id: number;
      link: string;
    }>;
  };
}

// Thêm component riêng để xử lý ảnh và lỗi CORS
interface ImageWithFallbackProps {
  uri: string | undefined;
  style: any;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  uri,
  style,
  resizeMode = 'cover',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fallbackImage = require('../../assets/images/replace-holder.png');

  return (
    <View style={[style, { overflow: 'hidden', position: 'relative' }]}>
      {isLoading && (
        <View
          style={[
            StyleSheet.absoluteFill,
            { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
          ]}
        >
          <ActivityIndicator size="small" color="#ED1C24" />
        </View>
      )}

      {hasError || !uri ? (
        <Image
          source={fallbackImage}
          style={{ width: '100%', height: '100%' }}
          resizeMode={resizeMode}
          onLoadEnd={() => setIsLoading(false)}
        />
      ) : (
        <Image
          source={{ uri: uri }}
          style={{ width: '100%', height: '100%' }}
          resizeMode={resizeMode}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onError={() => {
            console.log('Lỗi khi tải ảnh:', uri);
            setHasError(true);
            setIsLoading(false);
          }}
        />
      )}
    </View>
  );
};

// Hàm strip HTML tags
const stripHtmlTags = (html: string) => {
  if (!html) return '';
  const text = html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
  return text.length > 80 ? text.substring(0, 80) + '...' : text;
};

export default function HomeContractScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { authState } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { top } = useSafeAreaInsets();

  // Kiểm tra quyền truy cập - chỉ cho phép role_id = 3
  useEffect(() => {
    if (authState.user && authState.user.role_id !== 3) {
      // Nếu không phải khách hàng, chuyển hướng về trang chủ
      router.replace('/');
    }
  }, [authState.user, router]);

  // Nếu đang kiểm tra authentication hoặc không phải role_id = 3, hiển thị loading hoặc không hiển thị gì
  if (authState.isLoading || (authState.user && authState.user.role_id !== 3)) {
    return (
      <View style={[styles.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#ED1C24" />
      </View>
    );
  }

  // Avatar mặc định từ trang web SLM Solar
  const defaultAvatar =
    'https://supabase.slmsolar.com/storage/v1/object/sign/solarmax/06.%20Logo/01.%20SolarMax/Avartar_Customer.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb2xhcm1heC8wNi4gTG9nby8wMS4gU29sYXJNYXgvQXZhcnRhcl9DdXN0b21lci5qcGciLCJpYXQiOjE3NDM3NzkwODgsImV4cCI6MTc3NTMxNTA4OH0.-HJ2KptEXlSkipxDr85bDDxqkrPC2MrtIrAKXc3x7GY';

  // Lấy 2 ký tự đầu của tên
  const getInitials = (name: string) => {
    return name?.trim().substring(0, 2).toUpperCase() || '';
  };

  // Fetch user data - sử dụng user ID từ authState
  useEffect(() => {
    // Nếu không phải role_id = 3, không cần fetch dữ liệu
    if (authState.user?.role_id !== 3) {
      return;
    }

    const userId = authState.user?.id || 73; // Fallback to ID 73 if not available

    const fetchUser = async () => {
      try {
        const response = await fetch(`https://api.slmglobal.vn/api/users/${userId}`, {
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching user: ${response.status}`);
        }

        const data = await response.json();
        if (data) {
          setUser({
            id: data.id || 0,
            name: data.name || '',
            phone: data.phone || '',
            address: data.address || '',
            avatar: data.avatar || '',
          });
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
        setLoading(false);
      }
    };

    fetchUser();
  }, [authState.user?.id, authState.user?.role_id]);

  return (
    <React.Fragment>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.mainContainer}>
        <StatusBar style="light" />
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 0, marginBottom: 0 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Sử dụng component HomeHeader */}
          <HomeHeader
            userName={user?.name || ''}
            userPhone={user?.phone || ''}
            userAvatar={user?.avatar || null}
            userRoleId={authState.user?.role_id || null}
            isLoadingCommission={false}
            totalCommissionAmount={0}
            isAmountVisible={false}
            onRefreshAvatar={() => {}}
          />

          <View style={styles.content}>
            {/* Sử dụng component UserDevices */}
            <UserDevices userId={authState.user?.id} />
          </View>
        </ScrollView>
      </View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F5F8',
    paddingTop: 16,
    paddingBottom: 0,
    marginBottom: 0,
    gap: 24,
  },
});
