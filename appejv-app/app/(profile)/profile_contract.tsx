import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, Stack } from 'expo-router';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import { useAuth } from '@/src/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContentGallery from '@/app/components/ContentGallery';
import { StatusBar } from 'expo-status-bar';
import UserDevices from '@/app/components/UserDevices';

// Định nghĩa kiểu dữ liệu cho người dùng
interface User {
  id: number;
  name: string;
  phone: string;
  address: string;
  avatar: string;
}

// Định nghĩa kiểu dữ liệu cho bài viết
interface Article {
  id: number;
  author: string;
  title: string;
  thumbnail?: string;
  content?: string;
  hashtag?: string;
  time: string;
  isLight: boolean;
  hasIndicator: boolean;
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

// Format số điện thoại theo dạng xxxx xxx xxx
const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';

  // Loại bỏ tất cả các ký tự không phải số
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Nếu không đủ 10 số, trả về số gốc
  if (cleaned.length !== 10) return phoneNumber;

  // Format theo xxxx xxx xxx
  return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
};

export default function ProfileContractScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { authState, getUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { top } = useSafeAreaInsets();

  // Avatar mặc định từ trang web SLM Solar
  const defaultAvatar =
    'https://supabase.slmsolar.com/storage/v1/object/sign/solarmax/06.%20Logo/01.%20SolarMax/Avartar_Customer.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb2xhcm1heC8wNi4gTG9nby8wMS4gU29sYXJNYXgvQXZhcnRhcl9DdXN0b21lci5qcGciLCJpYXQiOjE3NDM3NzkwODgsImV4cCI6MTc3NTMxNTA4OH0.-HJ2KptEXlSkipxDr85bDDxqkrPC2MrtIrAKXc3x7GY';

  // Lấy 2 ký tự đầu của tên
  const getInitials = (name: string) => {
    return name?.trim().substring(0, 2).toUpperCase() || '';
  };

  // Hàm lấy thông tin chi tiết của user
  const fetchUser = async () => {
    try {
      // Sử dụng getUser để lấy thông tin người dùng đã đăng nhập
      const userData = await getUser();
      console.log('User data from API:', userData);

      if (userData && userData.id) {
        // Gọi API để lấy thông tin chi tiết của user
        const userId = userData.id;
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

          // Nếu có contracts trong dữ liệu user, lấy contract đầu tiên
          if (data.contracts && data.contracts.length > 0) {
            setLoading(false);
          } else {
            console.log('No contracts found in user data');
            setLoading(false);
          }
        } else {
          console.log('No user data found');
          setLoading(false);
        }
      } else {
        console.log('No user authentication data found');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
      setLoading(false);
      throw error; // Re-throw để useEffect có thể bắt lỗi và xử lý
    }
  };

  // Hàm lấy thông tin contract từ API users/[userId]
  const fetchContract = async () => {
    setLoading(true);
    try {
      // Lấy token từ AsyncStorage
      const token = await AsyncStorage.getItem('@auth_token');

      // Lấy thông tin người dùng hiện tại
      const userData = await getUser();

      if (!userData || !userData.id) {
        throw new Error('Không thể lấy thông tin người dùng');
      }

      // Sử dụng API users/[userId] thay vì API contracts
      const response = await fetch(`https://api.slmglobal.vn/api/users/${userData.id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching user data: ${response.status}`);
      }

      const data = await response.json();

      // Cập nhật thông tin người dùng
      if (data) {
        setUser({
          id: data.id || 0,
          name: data.name || '',
          phone: data.phone || '',
          address: data.address || '',
          avatar: data.avatar || '',
        });

        // Nếu có contracts trong dữ liệu user, lấy contract đầu tiên
        if (data.contracts && data.contracts.length > 0) {
          setLoading(false);
        } else {
          console.log('No contract data found');
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
      throw error; // Re-throw để useEffect có thể bắt lỗi và xử lý
    }
  };

  // Fetch user data
  useEffect(() => {
    // Xác định nếu người dùng đã đăng nhập
    if (authState.isAuthenticated) {
      const loadData = async () => {
        try {
          await fetchUser();
        } catch (error) {
          console.error('Error loading initial data:', error);
        }
      };
      loadData();
    }
  }, [getUser]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} giây trước`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      {/* Custom Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Hồ sơ người dùng</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.mainContainer}>
        <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 30 }}>
          <View style={styles.content}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ED1C24" />
                <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
              </View>
            ) : (
              <>
                {/* Thông tin người dùng */}
                <View style={styles.userInfoContainer}>
                  <View style={styles.userInfoHeader}>
                    <View style={styles.avatarContainer}>
                      {user?.avatar ? (
                        <ImageWithFallback
                          uri={user.avatar}
                          style={styles.avatar}
                          resizeMode="cover"
                        />
                      ) : (
                        <ImageWithFallback
                          uri={defaultAvatar}
                          style={styles.avatar}
                          resizeMode="cover"
                        />
                      )}
                    </View>
                    <View style={styles.userDetails}>
                      <Text style={styles.userName}>{user?.name || 'Người dùng'}</Text>
                      <Text style={styles.userPhone}>{formatPhoneNumber(user?.phone || '')}</Text>
                    </View>
                  </View>
                </View>

                {/* Sử dụng component UserDevices */}
                <UserDevices userId={user?.id} />

                {/* Bài viết liên quan */}
                <ContentGallery
                  userId={user?.id}
                  showTitle={true}
                  sectionTitle="Bài viết liên quan"
                  maxItems={5}
                  horizontal={true}
                  cardStyle="simple"
                  detailInModal={true}
                  showViewAll={true}
                  viewAllPath="/(tabs)/gallery"
                />
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButton: {
    width: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F5F8',
    paddingTop: 16,
    paddingBottom: 16,
    gap: 24,
  },
  section: {
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 28,
    color: '#27273E',
    paddingHorizontal: 0,
  },
  sectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionButtonText: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 14,
    color: '#ED1C24',
  },
  deviceIdContainer: {
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceId: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 16,
    color: '#7B7D9D',
  },
  deviceList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  deviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  deviceCardContent: {
    flexDirection: 'row',
  },
  deviceImageContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#F5F5F8',
    overflow: 'hidden',
  },
  deviceImage: {
    width: '100%',
    height: '100%',
  },
  deviceInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  deviceName: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: 13,
    color: '#27273E',
    flex: 1,
    marginLeft: 4,
  },
  activationDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoLabel: {
    fontFamily: 'Roboto',
    fontSize: 10,
    color: '#7B7D9D',
    marginRight: 4,
  },
  infoValue: {
    fontFamily: 'Roboto',
    fontSize: 10,
    color: '#7B7D9D',
  },
  warrantyInfoContainer: {
    width: '100%',
  },
  warrantyTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressBarContainer: {
    width: '100%',
    marginTop: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#12B669',
    borderRadius: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  loadingContainer: {
    padding: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#7B7D9D',
    textAlign: 'center',
  },
  headerUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  headerUserName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ED1C24',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  mainContainer: {
    flex: 1,
  },
  userInfoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  placeholderAvatar: {
    backgroundColor: '#ED1C24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#27273E',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: '#7B7D9D',
    marginBottom: 2,
  },
  userAddress: {
    fontSize: 13,
    color: '#7B7D9D',
  },
});
