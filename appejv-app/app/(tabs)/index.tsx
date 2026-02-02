import React, { useState, useRef, Fragment, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  Text as RNText,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { Text, Button, Flex, WhiteSpace, WingBlank } from '@ant-design/react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSectors } from '@/src/hooks/useSector';
import { Sector, Combo } from '@/src/models/sector';
import ContentGallery from '@/app/components/ContentGallery';
import HomeAgentCTA from '@/app/components/home_agent_cta';
import UserDevices from '@/app/components/UserDevices';
import HomeHeader from '@/app/components/HomeHeader';

// Interface cho banner
interface BannerImage {
  id: number;
  link: string;
  banner_id: number;
  created_at: string | null;
}

interface Banner {
  id: number;
  title: string;
  slug: string;
  location: string;
  created_at: string | null;
  sector_id: number;
  banner_images: BannerImage[];
}

// Định nghĩa interface cho user để sửa lỗi linter
interface User {
  id?: number;
  name?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  code?: string;
  role_id?: number;
}

// Định nghĩa interface cho commission
interface Commission {
  id: number;
  created_at: string;
  paid: boolean;
  seller: number;
  money: number;
  sector_id: number;
  contract_id: number | null;
  sector: any;
  contract: any;
}

interface MonthlyCommission {
  month: number;
  commissions: Commission[];
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
        <LinearGradient
          colors={['#ED1C24', '#D9261C']}
          style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
        >
          <View style={styles.fallbackBannerContent}>
            <Ionicons name="images-outline" size={32} color="white" style={{ marginBottom: 8 }} />
            <RNText style={styles.fallbackBannerTitle}>SLM Global</RNText>
            <RNText style={styles.fallbackBannerSubtitle}>Sản phẩm nổi bật</RNText>
            <View style={styles.fallbackBannerButton}>
              <RNText style={styles.fallbackBannerButtonText}>Xem ngay</RNText>
            </View>
          </View>
        </LinearGradient>
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

// Thêm component PromoFallbackContent để hiển thị khi không có banner data
const PromoFallbackContent = ({ title = 'Sản phẩm nổi bật', subtitle = 'SLM Global' }) => {
  return (
    <LinearGradient
      colors={['#ED1C24', '#D9261C']}
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
      }}
    >
      <View style={styles.fallbackBannerContent}>
        <Ionicons name="images-outline" size={32} color="white" style={{ marginBottom: 8 }} />
        <RNText style={styles.fallbackBannerTitle}>{subtitle}</RNText>
        <RNText style={styles.fallbackBannerSubtitle}>{title}</RNText>
        <View style={styles.fallbackBannerButton}>
          <RNText style={styles.fallbackBannerButtonText}>Xem ngay</RNText>
        </View>
      </View>
    </LinearGradient>
  );
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [activePromoIndex, setActivePromoIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const promoFlatListRef = useRef<FlatList>(null);
  const { width } = Dimensions.get('window');
  const { authState } = useAuth();
  const [userName, setUserName] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userRoleId, setUserRoleId] = useState<number | null>(null);
  const [hasCustomers, setHasCustomers] = useState<boolean>(false);
  const [checkingCustomers, setCheckingCustomers] = useState<boolean>(false);
  const { data: sectors, isLoading: isSectorsLoading, error: sectorsError } = useSectors();

  // Thêm state để lưu trữ dữ liệu hoa hồng
  const [commissionData, setCommissionData] = useState<MonthlyCommission[]>([]);
  const [totalCommissionAmount, setTotalCommissionAmount] = useState<number>(0);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoadingCommission, setIsLoadingCommission] = useState<boolean>(false);

  // Thêm state để theo dõi trạng thái ẩn/hiện số tiền
  const [isAmountVisible, setIsAmountVisible] = useState<boolean>(false);

  // Thêm state để lưu trữ dữ liệu banners
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoadingBanners, setIsLoadingBanners] = useState<boolean>(false);
  const [bannersError, setBannersError] = useState<Error | null>(null);

  // Định nghĩa tabBarHeight để sử dụng khi cần
  const tabBarHeight = userRoleId === 3 ? 60 + (insets.bottom > 0 ? insets.bottom : 10) : 0;

  useEffect(() => {
    if (sectorsError) {
      console.error('Error loading sectors:', sectorsError);
    }
  }, [sectorsError]);

  // Thêm effect để kiểm tra AsyncStorage khi component mount
  useEffect(() => {
    const checkAsyncStorageKeys = async () => {
      try {
        const allKeys = await AsyncStorage.getAllKeys();
        console.log('=== ALL ASYNC STORAGE KEYS ===');
        console.log('Total keys:', allKeys.length);
        console.log('Keys:', allKeys);

        // Tìm và log các key liên quan đến user
        const userKeys = allKeys.filter(key => key.includes('user') || key.includes('slm'));
        console.log('User related keys:', userKeys);

        // Log giá trị của một số key quan trọng
        if (userKeys.length > 0) {
          console.log('=== KEY VALUES ===');
          for (const key of userKeys) {
            const value = await AsyncStorage.getItem(key);
            console.log(
              `${key}: ${value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : 'null'}`
            );
          }
        }

        console.log('==========================');
      } catch (error) {
        console.error('Error checking AsyncStorage keys:', error);
      }
    };

    checkAsyncStorageKeys();
  }, []);

  // Lấy ID người dùng
  useEffect(() => {
    const getUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem('@slm_user_data');
        if (userData) {
          const user = JSON.parse(userData);
          setUserId(user.id);
        } else {
          // Fallback ID nếu không có user đang đăng nhập
          setUserId(4);
        }
      } catch (error) {
        console.error('Error getting user ID:', error);
        // Fallback ID nếu có lỗi
        setUserId(4);
      }
    };

    getUserId();
  }, []);

  // Thêm useEffect mới để lấy avatar khi có userId
  useEffect(() => {
    // Chỉ gọi khi có userId và không có userAvatar
    if (userId && !userAvatar) {
      fetchUserAvatar();
    }
  }, [userId, userAvatar]);

  // Sau khi có userId, gọi API để lấy thông tin hoa hồng
  useEffect(() => {
    if (userId) {
      fetchCommissionData(userId);
      checkUserCustomers(userId);
    }
  }, [userId]);

  // Xử lý dữ liệu commission sau khi nhận được
  useEffect(() => {
    if (commissionData.length > 0) {
      // Tính tổng tiền hoa hồng
      const totalAmount = commissionData.reduce((sum, month) => {
        return sum + month.commissions.reduce((monthSum, comm) => monthSum + comm.money, 0);
      }, 0);
      setTotalCommissionAmount(totalAmount);
    }
  }, [commissionData]);

  // Hàm lấy dữ liệu hoa hồng từ API
  const fetchCommissionData = async (id: number) => {
    try {
      setIsLoadingCommission(true);
      const currentYear = new Date().getFullYear();
      const response = await fetch(
        `https://api.slmglobal.vn/api/user/commission/${id}/${currentYear}`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Lỗi khi lấy dữ liệu hoa hồng: ${response.status}`);
      }

      // Kiểm tra content-type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Phản hồi không phải JSON: ${contentType}`);
      }

      // Lấy text và kiểm tra trước khi parse
      const text = await response.text();
      if (!text || text.trim().startsWith('<')) {
        throw new Error('Phản hồi không phải định dạng JSON');
      }

      // Parse JSON
      const data = JSON.parse(text);

      if (data && Array.isArray(data)) {
        setCommissionData(data);
      } else {
        setCommissionData([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu hoa hồng:', error);
      setCommissionData([]);
    } finally {
      setIsLoadingCommission(false);
    }
  };

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

    // Nếu không đủ 10 số, trả về số gốc
    if (cleaned.length !== 10) return phoneNumber;

    // Format theo xxxx xxx xxx
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Lấy trực tiếp từ AsyncStorage để đảm bảo dữ liệu mới nhất
        const storedName = await AsyncStorage.getItem('@slm_user_name');
        const storedPhone = await AsyncStorage.getItem('@slm_login_phone');
        const storedAvatar = await AsyncStorage.getItem('@slm_user_avatar');
        const userData = await AsyncStorage.getItem('@slm_user_data');
        const storedRoleId = await AsyncStorage.getItem('@slm_user_role_id');

        let currentRoleId = null;

        if (storedName) {
          setUserName(storedName);
        } else if (authState.user?.name) {
          setUserName(authState.user.name);
        }

        if (storedPhone) {
          setUserPhone(storedPhone);
        } else if (authState.user?.phone) {
          setUserPhone(authState.user.phone);
        }

        // Lấy role ID từ user data
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          if (parsedUserData.role_id) {
            setUserRoleId(parsedUserData.role_id);
            currentRoleId = parsedUserData.role_id;
            console.log('Role ID từ user data:', parsedUserData.role_id);
          }
        } else if (authState.user?.role_id) {
          setUserRoleId(authState.user.role_id);
          currentRoleId = authState.user.role_id;
          console.log('Role ID từ authState:', authState.user.role_id);
        } else if (storedRoleId) {
          const roleId = parseInt(storedRoleId, 10);
          setUserRoleId(roleId);
          currentRoleId = roleId;
          console.log('Role ID từ storedRoleId:', roleId);
        }

        // Log thông tin debug
        console.log('=== DEBUG USER ROLE ===');
        console.log('Current user role ID:', currentRoleId);
        console.log('Is customer (role_id=3):', currentRoleId === 3);
        console.log('User role from AsyncStorage:', storedRoleId);
        console.log('User data available:', !!userData);
        console.log('AuthState role_id:', authState.user?.role_id);
        console.log('=====================');

        // Nếu là khách hàng (role_id = 3) và chưa có avatar
        if (currentRoleId === 3 && !storedAvatar) {
          console.log('Người dùng là khách hàng, sử dụng avatar mặc định');
          const defaultCustomerAvatar = 'avatar-customer';
          setUserAvatar(defaultCustomerAvatar);
          await AsyncStorage.setItem('@slm_user_avatar', defaultCustomerAvatar);
          return;
        }

        // Lấy avatar từ AsyncStorage hoặc authState
        if (storedAvatar) {
          console.log('Sử dụng avatar từ AsyncStorage');
          setUserAvatar(storedAvatar);
        } else if (authState.user && 'avatar' in authState.user && authState.user.avatar) {
          console.log('Sử dụng avatar từ authState');
          // Ép kiểu cho avatar từ authState để tránh lỗi type
          const userAvatar = (authState.user as any).avatar as string;
          setUserAvatar(userAvatar);
          // Lưu avatar từ authState vào AsyncStorage
          await AsyncStorage.setItem('@slm_user_avatar', userAvatar);
        } else {
          // Nếu không có trong authState và AsyncStorage, thử lấy từ API
          console.log('Không tìm thấy avatar, sẽ lấy từ API');
          await fetchUserAvatar();
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin người dùng:', error);
      }
    };

    loadUserData();
  }, [authState]);

  // Hàm lấy avatar từ API
  const fetchUserAvatar = async () => {
    try {
      // Lấy user ID từ AsyncStorage hoặc authState
      let userId = null;
      let userRoleId = null;

      // Lấy role_id từ AsyncStorage trước
      const storedRoleId = await AsyncStorage.getItem('@slm_user_role_id');
      if (storedRoleId) {
        userRoleId = parseInt(storedRoleId, 10);
      }

      if (authState.user?.id) {
        userId = authState.user.id;
        if (authState.user.role_id) {
          userRoleId = authState.user.role_id;
        }
      } else {
        const storedUserId = await AsyncStorage.getItem('@slm_user_id');
        if (storedUserId) {
          userId = storedUserId;
        } else {
          // Tìm user ID từ user data nếu có
          const userData = await AsyncStorage.getItem('@slm_user_data');
          if (userData) {
            const parsedUserData = JSON.parse(userData);
            if (parsedUserData.id) {
              userId = parsedUserData.id;
              if (parsedUserData.role_id) {
                userRoleId = parsedUserData.role_id;
              }
            }
          }
        }
      }

      if (!userId) {
        console.log('Không tìm thấy ID người dùng để lấy avatar');
        return;
      }

      console.log(`Đang lấy avatar cho user ID: ${userId}, role_id: ${userRoleId}`);

      // Nếu là khách hàng (role_id = 3), sử dụng avatar mặc định
      if (userRoleId === 3) {
        console.log('Người dùng là khách hàng, sử dụng avatar mặc định');
        const defaultCustomerAvatar = 'avatar-customer';
        setUserAvatar(defaultCustomerAvatar);
        await AsyncStorage.setItem('@slm_user_avatar', defaultCustomerAvatar);
        return;
      }

      const response = await fetch(`https://api.slmglobal.vn/api/users/${userId}`, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Lỗi khi lấy thông tin: ${response.status}`);
      }

      // Kiểm tra content-type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Phản hồi không phải JSON: ${contentType}`);
      }

      // Lấy text và kiểm tra trước khi parse
      const text = await response.text();
      if (!text || text.trim().startsWith('<')) {
        throw new Error('Phản hồi không phải định dạng JSON');
      }

      // Parse JSON
      const data = JSON.parse(text);

      // Kiểm tra nếu role_id là 3 và không có avatar từ API
      if (data.role_id === 3 && (!data.avatar || data.avatar === '')) {
        console.log('Người dùng là khách hàng từ API, sử dụng avatar mặc định');
        const defaultCustomerAvatar = 'avatar-customer';
        setUserAvatar(defaultCustomerAvatar);
        await AsyncStorage.setItem('@slm_user_avatar', defaultCustomerAvatar);
      } else if (data && data.avatar) {
        console.log('Đã lấy được avatar từ API:', data.avatar);
        setUserAvatar(data.avatar);

        // Lưu avatar vào AsyncStorage để sử dụng sau này
        await AsyncStorage.setItem('@slm_user_avatar', data.avatar);
      } else {
        console.log('Không tìm thấy avatar trong dữ liệu API');
      }
    } catch (error) {
      console.error('Lỗi khi lấy avatar người dùng:', error);
    }
  };

  const renderTypeTag = (type: string) => {
    let color = '';
    let displayText = type;

    switch (type) {
      case 'Đặt hàng lại':
        color = '#E07C24'; // Màu cam đậm hơn
        displayText = 'Xử lý hợp đồng';
        break;
      case 'Hàng tháng':
        color = '#4CAF50'; // Màu xanh lá vừa phải
        displayText = 'Hoàn thành';
        break;
      case 'Hàng tháng đơn lẻ':
        color = '#2196F3';
        break;
      default:
        color = '#999';
    }

    return (
      <View
        style={{
          backgroundColor: color,
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 5,
          alignSelf: 'flex-start',
        }}
      >
        <RNText style={{ color: 'white', fontSize: 12 }}>{displayText}</RNText>
      </View>
    );
  };

  const handleProductScroll = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const slideWidth = width - 32; // accounting for padding
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / slideWidth);
    if (index !== activeProductIndex) {
      setActiveProductIndex(index);
    }
  };

  const scrollToProduct = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
      });
      setActiveProductIndex(index);
    }
  };

  const handlePromoScroll = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const slideWidth = width - 32; // accounting for padding
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / slideWidth);
    if (index !== activePromoIndex) {
      setActivePromoIndex(index);
    }
  };

  const scrollToPromo = (index: number) => {
    if (promoFlatListRef.current) {
      promoFlatListRef.current.scrollToIndex({
        index,
        animated: true,
      });
      setActivePromoIndex(index);
    }
  };

  // Thêm nút điều hướng đến màn hình thống kê hoa hồng
  const navigateToCommissionHistory = () => {
    router.push('/(tabs)/stats');
  };

  // Thêm nút điều hướng đến màn hình cộng đồng
  const navigateToGroupAgent = () => {
    router.push('/(group)/group_agent');
  };

  // Hàm chuyển đổi trạng thái ẩn/hiện
  const toggleAmountVisibility = () => {
    setIsAmountVisible(prev => !prev);
  };

  // Hàm tạo chuỗi * thay thế số tiền
  const getMaskedAmount = (amount: number) => {
    // Tạo chuỗi * với độ dài tương ứng với số tiền
    const amountString = formatCurrency(amount);
    return '*'.repeat(Math.min(amountString.length, 10));
  };

  // Khai báo hàm fetchBanners ở cấp component
  const fetchBanners = async (retryCount = 0) => {
    try {
      setIsLoadingBanners(true);
      setBannersError(null);

      // Thử sử dụng dữ liệu hardcoded khi API thất bại sau 2 lần thử
      if (retryCount >= 2) {
        console.log('Sử dụng dữ liệu banner dự phòng sau nhiều lần thử kết nối thất bại');
        const fallbackData = [
          {
            id: 2,
            title: 'Sản phẩm nổi bật',
            slug: 'san_pham_noi_bat',
            location: 'home',
            created_at: null,
            sector_id: 1,
            banner_images: [
              {
                id: 1,
                banner_id: 2,
                link: 'https://images.slmglobal.vn/storage/v1/object/public/solarmax/04_Banner/Banner_01.png',
                created_at: null,
              },
              {
                id: 2,
                banner_id: 2,
                link: 'https://images.slmglobal.vn/storage/v1/object/public/solarmax/04_Banner/Banner_02.png',
                created_at: null,
              },
            ],
          },
        ];
        setBanners(fallbackData);
        setIsLoadingBanners(false);
        return;
      }

      // Thêm timeout cho fetch để tránh chờ quá lâu
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 giây timeout

      const response = await fetch('https://api.slmglobal.vn/api/banners', {
        headers: {
          Accept: 'application/json',
          'Cache-Control': 'no-cache', // Thêm để tránh cache
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Lỗi khi lấy dữ liệu banners: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Phản hồi không phải JSON: ${contentType}`);
      }

      const text = await response.text();
      if (!text || text.trim().startsWith('<')) {
        throw new Error('Phản hồi không phải định dạng JSON');
      }

      const data = JSON.parse(text);
      console.log('Dữ liệu banner từ API:', JSON.stringify(data).substring(0, 200) + '...');

      if (data && Array.isArray(data)) {
        // Lọc để chỉ hiển thị banner ở location 'home'
        const homeBanners = data.filter(banner => banner.location === 'home');
        setBanners(homeBanners);
      } else {
        setBanners([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu banners:', error);
      setBannersError(error instanceof Error ? error : new Error('Lỗi không xác định'));

      // Thử lại nếu chưa vượt quá số lần thử lại tối đa
      if (retryCount < 2) {
        console.log(`Thử lại lần ${retryCount + 1}...`);
        setTimeout(() => fetchBanners(retryCount + 1), 2000); // Thử lại sau 2 giây
      } else {
        // Đã thử đủ số lần, sử dụng dữ liệu dự phòng
        console.log('Sử dụng dữ liệu banner dự phòng');
        const fallbackData = [
          {
            id: 2,
            title: 'Sản phẩm nổi bật',
            slug: 'san_pham_noi_bat',
            location: 'home',
            created_at: null,
            sector_id: 1,
            banner_images: [
              {
                id: 1,
                banner_id: 2,
                link: 'https://images.slmglobal.vn/storage/v1/object/public/solarmax/04_Banner/Banner_01.png',
                created_at: null,
              },
              {
                id: 2,
                banner_id: 2,
                link: 'https://images.slmglobal.vn/storage/v1/object/public/solarmax/04_Banner/Banner_02.png',
                created_at: null,
              },
            ],
          },
        ];
        setBanners(fallbackData);
      }
    } finally {
      setIsLoadingBanners(false);
    }
  };

  // Fetch banners khi component mount
  useEffect(() => {
    fetchBanners();
  }, []);

  // Thêm component ProductItem
  const ProductItem = ({ item, width }: { item: Combo; width: number }) => {
    // Thêm hàm lấy tag cho sản phẩm
    const getProductTag = (combo: Combo) => {
      if (combo.installation_type) {
        return combo.installation_type.toUpperCase();
      }
      return null;
    };

    return (
      <TouchableOpacity
        style={[
          styles.productCard,
          { width: (width - 48) / 2.5, marginHorizontal: 4, marginBottom: 16 },
        ]}
        onPress={() =>
          router.push({
            pathname: '/(products)/product_baogia',
            params: { id: item.id.toString() },
          })
        }
      >
        <View style={{ padding: 0, width: '100%', aspectRatio: 1, overflow: 'hidden' }}>
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.productImagePlaceholder}>
              <Ionicons name="cube-outline" size={40} color="#888" />
            </View>
          )}
          {getProductTag(item) && (
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>{getProductTag(item)}</Text>
            </View>
          )}
        </View>
        <View style={{ padding: 12, flex: 1 }}>
          <Text style={styles.productTitle} numberOfLines={3}>
            {item.name}
          </Text>
          <Text style={styles.productPrice}>
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(Math.round(item.total_price / 1000) * 1000)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Thêm component ProductSection
  const ProductSection = ({ sector }: { sector: Sector }) => {
    const { width } = Dimensions.get('window');
    const flatListRef = useRef<FlatList>(null);

    if (!sector.list_combos || sector.list_combos.length === 0) {
      return null;
    }

    return (
      <>
        <WhiteSpace size="lg" />
        <Flex justify="between" align="center">
          <Text style={styles.sectionSubtitle}>{sector.name.toUpperCase()}</Text>
          <Button
            type="primary"
            size="small"
            style={{ borderWidth: 0, backgroundColor: 'transparent', paddingRight: 8 }}
            onPress={() =>
              router.push({
                pathname: '/(products)/product_brand',
                params: { id: sector.id },
              })
            }
          >
            <Flex align="center">
              <Text style={styles.viewAllText}>Tất cả</Text>
              <Image
                source={require('../../assets/images/arrow-icon.png')}
                style={{ width: 20, height: 20, marginLeft: 8 }}
                resizeMode="contain"
              />
            </Flex>
          </Button>
        </Flex>

        <WhiteSpace size="lg" />
        <View style={[styles.carouselContainer, { paddingBottom: 16 }]}>
          <FlatList
            ref={flatListRef}
            horizontal
            data={sector.list_combos}
            renderItem={({ item }) => <ProductItem item={item} width={width} />}
            keyExtractor={item => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />
        </View>
      </>
    );
  };

  // Cập nhật renderPromoData để xử lý dữ liệu banner đúng cách
  const renderPromoData = (banners: Banner[]) => {
    if (!banners || banners.length === 0) {
      console.log('Không có dữ liệu banner, sử dụng dữ liệu fallback');
      // Dữ liệu fallback khi không có banner
      return [
        {
          id: '1',
          action: 'Sản phẩm nổi bật',
          mainText: 'SLM Solar',
          buttonText: 'Xem ngay',
          backgroundColor: ['#ED1C24', '#D9261C'],
          imageUrl: '',
          useGradient: true,
        },
        {
          id: '2',
          action: 'Giải pháp năng lượng',
          mainText: 'SLM Global',
          buttonText: 'Xem ngay',
          backgroundColor: ['#4CAF50', '#2E7D32'],
          imageUrl: '',
          useGradient: true,
        },
      ];
    }

    console.log(
      `Xử lý ${banners.length} banner, banner đầu tiên có ${banners[0]?.banner_images?.length || 0} hình ảnh`
    );

    // Xử lý trường hợp có banner nhưng không có banner_images
    const firstBanner = banners[0];
    if (!firstBanner || !firstBanner.banner_images || firstBanner.banner_images.length === 0) {
      console.log('Banner không có hình ảnh, sử dụng dữ liệu fallback');
      return [
        {
          id: firstBanner?.id?.toString() || '1',
          action: firstBanner?.title || 'Sản phẩm nổi bật',
          mainText: firstBanner?.slug || 'SLM Solar',
          buttonText: 'Xem ngay',
          backgroundColor: ['#ED1C24', '#D9261C'],
          imageUrl: '',
          useGradient: true,
        },
      ];
    }

    // Map dữ liệu từ API
    console.log('Xử lý hình ảnh banner từ API');
    return firstBanner.banner_images.map(image => {
      console.log(`Xử lý hình ảnh ID ${image.id}, link: ${image.link}`);
      return {
        id: image.id.toString(),
        action: firstBanner.title || 'Sản phẩm nổi bật',
        mainText: firstBanner.slug || 'SLM Solar',
        buttonText: 'Xem ngay',
        backgroundColor: ['#ED1C24', '#D9261C'],
        imageUrl: image.link,
        useGradient: false,
      };
    });
  };

  const promoData = renderPromoData(banners);

  // Thêm hàm kiểm tra khách hàng cũ
  const checkUserCustomers = async (id: number) => {
    try {
      setCheckingCustomers(true);
      const response = await fetch(`https://api.slmglobal.vn/api/agents/${id}/old-customer`, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Lỗi khi kiểm tra khách hàng: ${response.status}`);
      }

      const data = await response.json();

      // Nếu có mảng dữ liệu và có ít nhất 1 phần tử thì đánh dấu đã có khách hàng
      if (Array.isArray(data) && data.length > 0) {
        setHasCustomers(true);
      } else {
        setHasCustomers(false);
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra khách hàng cũ:', error);
      setHasCustomers(false);
    } finally {
      setCheckingCustomers(false);
    }
  };

  if (isSectorsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D9261C" />
        <Text style={{ marginTop: 10, color: '#666' }}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (sectorsError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Có lỗi xảy ra khi tải dữ liệu</Text>
        <Text style={styles.errorSubText}>{sectorsError.message}</Text>
      </View>
    );
  }

  if (!sectors || sectors.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không có dữ liệu</Text>
      </View>
    );
  }

  return (
    <React.Fragment>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.mainContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#ED1C24" />
        <ScrollView
          style={styles.container}
          contentContainerStyle={userRoleId === 3 ? { paddingBottom: tabBarHeight } : undefined}
          showsVerticalScrollIndicator={false}
        >
          {/* Sử dụng component HomeHeader */}
          <HomeHeader
            userName={userName}
            userPhone={userPhone}
            userAvatar={userAvatar}
            userRoleId={userRoleId}
            isLoadingCommission={isLoadingCommission}
            totalCommissionAmount={totalCommissionAmount}
            isAmountVisible={isAmountVisible}
            onToggleAmountVisibility={toggleAmountVisibility}
            onNavigateToGroupAgent={navigateToGroupAgent}
            onNavigateToCommissionHistory={navigateToCommissionHistory}
            onRefreshAvatar={fetchUserAvatar}
          />

          <View style={styles.contentContainer}>
            {/* Hiển thị thiết bị nếu là khách hàng - Sử dụng component UserDevices */}
            {userRoleId === 3 && (
              <View style={styles.deviceSectionWrapper}>
                <UserDevices userId={userId} />
              </View>
            )}

            {/* Brand Selector Section - Ẩn với Khách hàng */}
            {userRoleId !== 3 && (
              <>
                <WhiteSpace size="lg" />
                <Flex justify="between" style={[styles.brandContainer, { paddingVertical: 16 }]}>
                  {sectors?.map(sector => (
                    <TouchableOpacity
                      key={sector.id}
                      style={[
                        styles.brandCard,
                        // Thêm màu background tùy theo brand
                        {
                          backgroundColor:
                            sector.id === 2 ? '#FFD700' : sector.id === 1 ? '#4CAF50' : '#fff',
                        },
                      ]}
                      activeOpacity={0.8}
                      onPress={() =>
                        router.push({
                          pathname: '/(products)/product_brand',
                          params: { id: sector.id },
                        })
                      }
                    >
                      <View style={styles.brandContent}>
                        <Image
                          source={{ uri: sector.image }}
                          style={styles.brandLogo}
                          resizeMode="contain"
                        />
                      </View>
                    </TouchableOpacity>
                  ))}
                </Flex>
              </>
            )}

            {/* Promo Cards - Ẩn với Khách hàng */}
            {userRoleId !== 3 && (
              <>
                <WhiteSpace size="lg" />
                <View style={styles.carouselContainer}>
                  {isLoadingBanners ? (
                    <View style={styles.loadingBannerContainer}>
                      <ActivityIndicator size="small" color="#D9261C" />
                      <Text style={styles.loadingBannerText}>Đang tải banner...</Text>
                    </View>
                  ) : bannersError ? (
                    <View style={styles.loadingBannerContainer}>
                      <Ionicons name="alert-circle-outline" size={24} color="#D9261C" />
                      <Text style={styles.errorBannerText}>Không thể tải banner</Text>
                      <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => {
                          setIsLoadingBanners(true);
                          setBannersError(null);
                          // Thực hiện retry sau 1 giây
                          setTimeout(() => fetchBanners(0), 1000);
                        }}
                      >
                        <Text style={styles.retryButtonText}>Thử lại</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <FlatList
                      ref={promoFlatListRef}
                      horizontal
                      data={promoData}
                      renderItem={({ item }) => (
                        <View
                          style={[styles.promoCard, { width: width - 32, marginHorizontal: 4 }]}
                        >
                          {item.useGradient ? (
                            <LinearGradient
                              colors={item.backgroundColor || ['#ED1C24', '#D9261C']}
                              style={styles.promoFullImage}
                            >
                              <View style={styles.fallbackBannerContent}>
                                <Ionicons
                                  name="images-outline"
                                  size={32}
                                  color="white"
                                  style={{ marginBottom: 8 }}
                                />
                                <RNText style={styles.fallbackBannerTitle}>{item.mainText}</RNText>
                                <RNText style={styles.fallbackBannerSubtitle}>{item.action}</RNText>
                                <View style={styles.fallbackBannerButton}>
                                  <RNText style={styles.fallbackBannerButtonText}>
                                    {item.buttonText}
                                  </RNText>
                                </View>
                              </View>
                            </LinearGradient>
                          ) : item.imageUrl ? (
                            <ImageWithFallback
                              uri={item.imageUrl}
                              style={styles.promoFullImage}
                              resizeMode="cover"
                            />
                          ) : item.image ? (
                            <Image
                              source={item.image}
                              style={styles.promoFullImage}
                              resizeMode="cover"
                            />
                          ) : (
                            <PromoFallbackContent title={item.action} subtitle={item.mainText} />
                          )}
                        </View>
                      )}
                      keyExtractor={item => item.id}
                      showsHorizontalScrollIndicator={false}
                      pagingEnabled
                      snapToInterval={width - 32}
                      decelerationRate="fast"
                      onMomentumScrollEnd={handlePromoScroll}
                      contentContainerStyle={{ paddingHorizontal: 16 }}
                    />
                  )}

                  <View style={styles.promoPaginationContainer}>
                    {promoData.map((_, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.promoPaginationBar,
                          index === activePromoIndex && styles.promoPaginationBarActive,
                        ]}
                        onPress={() => scrollToPromo(index)}
                      />
                    ))}
                  </View>
                </View>
              </>
            )}

            {/* Bán chạy Section - Ẩn với Khách hàng */}
            {userRoleId !== 3 && (
              <>
                <WhiteSpace size="lg" />
                <Text style={styles.sectionTitle}>Bán chạy</Text>
                <WhiteSpace size="xs" />
                {sectors.map(sector => (
                  <ProductSection key={sector.id} sector={sector} />
                ))}
              </>
            )}
          </View>

          {/* HomeAgentCTA Section - Chỉ hiển thị với role_id là 4 hoặc 5 và chưa có khách hàng mua hàng */}
          {(userRoleId === 4 || userRoleId === 5) && !hasCustomers && !checkingCustomers && (
            <HomeAgentCTA />
          )}

          {/* Bài viết mới nhất */}
          <ContentGallery
            userId={userId ?? undefined}
            showTitle={true}
            sectionTitle="Bài viết liên quan"
            maxItems={5}
            horizontal={true}
            cardStyle="simple"
            detailInModal={true}
            showViewAll={true}
            viewAllPath="/(tabs)/gallery"
          />

          <WhiteSpace size="lg" />
        </ScrollView>
      </View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F5F8',
    position: 'relative',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 16,
  },
  deviceSectionWrapper: {
    backgroundColor: '#F5F5F8',
  },
  carouselContainer: {
    paddingBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 28,
    color: '#27273E',
    paddingHorizontal: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7B7D9D',
    marginTop: -8,
    fontWeight: 'bold',
    paddingHorizontal: 16,
  },
  viewAllText: {
    color: '#ED1C24',
    fontSize: 14,
    marginRight: 4,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
  brandCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '48%',
    height: 48,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  brandContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandLogo: {
    width: '100%',
    height: 32,
  },
  promoCard: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 0,
    width: 330,
    aspectRatio: 343 / 150,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.15)',
      },
    }),
    marginVertical: 4,
    marginRight: 12,
  },
  promoFullImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
  },
  promoContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    zIndex: 1,
  },
  promoTextContent: {
    padding: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '100%',
  },
  promoAction: {
    color: 'white',
    fontSize: 14,
    ...Platform.select({
      ios: {
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
      },
      android: {
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
      },
      web: {
        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)',
      },
    }),
    textAlign: 'right',
  },
  promoMainText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
    ...Platform.select({
      ios: {
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
      },
      android: {
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
      },
      web: {
        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)',
      },
    }),
    textAlign: 'right',
  },
  promoButton: {
    backgroundColor: '#FFC107',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'white',
    alignSelf: 'flex-end',
    minWidth: 110,
    height: 30,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoButtonText: {
    color: 'white',
    fontSize: 11,
    marginRight: 2,
    fontWeight: '500',
  },
  productCard: {
    aspectRatio: 10 / 17,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 0,
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
  productImagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
  },
  updateBrandLogoPlaceholder: {
    width: 60,
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateBrandLogo: {
    width: 60,
    height: 20,
  },
  updateBrandText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  updateModelNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  updateDate: {
    fontSize: 12,
    color: '#666',
  },
  articleCard: {
    width: 220,
    aspectRatio: 4 / 5,
    backgroundColor: 'white',
    borderRadius: 8,
    marginRight: 0,
    marginHorizontal: 8,
    overflow: 'hidden',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginVertical: 0,
  },
  articleImagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  articleImage: {
    width: '100%',
    height: 150,
    flex: 1,
    aspectRatio: 1.5,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  articleDescription: {
    fontSize: 14,
    color: '#666',
  },
  headerLogo: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#D9261C',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  contentSection: {
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
    marginTop: 16,
    width: '100%',
  },
  contentSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 8,
    color: '#333',
  },
  tagContainer: {
    position: 'absolute',
    top: 8,
    left: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#000',
  },
  loadingBannerContainer: {
    height: 150,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f8',
    borderRadius: 10,
    marginHorizontal: 16,
  },
  loadingBannerText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  errorBannerText: {
    marginTop: 8,
    color: '#D9261C',
    fontSize: 14,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#ED1C24',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginTop: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  fallbackBannerContent: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  fallbackBannerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    ...Platform.select({
      ios: {
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
      },
      android: {
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
      },
    }),
  },
  fallbackBannerSubtitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 12,
    ...Platform.select({
      ios: {
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
      },
      android: {
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
      },
    }),
  },
  fallbackBannerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'white',
    marginTop: 8,
  },
  fallbackBannerButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  promoPaginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  promoPaginationBar: {
    width: 12,
    height: 2,
    backgroundColor: '#ccc',
    marginHorizontal: 3,
    borderRadius: 2,
  },
  promoPaginationBarActive: {
    backgroundColor: '#ED1C24',
    width: 18,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ED1C24',
    marginTop: 0,
    marginBottom: 4,
  },
});
