import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

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

interface UserDevicesProps {
  userId?: number | null;
}

const UserDevices: React.FC<UserDevicesProps> = ({ userId }) => {
  // States cho thiết bị
  const [merchandises, setMerchandises] = useState<PreQuoteMerchandise[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [contractCode, setContractCode] = useState<string>('');
  const [contractActivationDate, setContractActivationDate] = useState<string>('');
  const [isLoadingDevices, setIsLoadingDevices] = useState<boolean>(false);

  // Fetch thiết bị khi component được tạo và userId thay đổi
  useEffect(() => {
    if (userId) {
      fetchUserDevices(userId);
    }
  }, [userId]);

  // Hàm fetch thiết bị từ API
  const fetchUserDevices = async (id: number) => {
    try {
      setIsLoadingDevices(true);
      const response = await fetch(`https://api.slmglobal.vn/api/users/${id}`, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching user: ${response.status}`);
      }

      const data = await response.json();
      if (data) {
        // Nếu có contracts trong dữ liệu user, lấy contract đầu tiên
        if (data.contracts && data.contracts.length > 0) {
          setContractCode(data.contracts[0].code || '');
          setContractActivationDate(data.contracts[0].created_at || '');

          // Lấy merchandises từ contract
          if (
            data.contracts[0].pre_quote_merchandises &&
            data.contracts[0].pre_quote_merchandises.length > 0
          ) {
            const merchandisesData = data.contracts[0].pre_quote_merchandises
              .filter((item: any) => item.warranty_years > 0)
              .map((item: any) => ({
                id: item.id,
                merchandise_id: item.merchandise_id,
                pre_quote_id: item.pre_quote_id,
                name: item.merchandise?.name || '',
                warranty_years: item.warranty_years || 0,
                warranty_period_unit: 'year',
                activation_date: item.created_at || '',
                created_at: item.created_at || '',
                updated_at: item.updated_at || '',
                merchandise: item.merchandise,
              }));
            setMerchandises(merchandisesData);
          } else {
            // Nếu không có pre_quote_merchandises trong contract, gọi API riêng
            fetchMerchandises(data.contracts[0].id);
          }
        } else {
          // Nếu không có contracts trong user data, gọi API contracts riêng
          fetchContract();
        }
      }
    } catch (error) {
      console.error('Error fetching user devices:', error);
    } finally {
      setIsLoadingDevices(false);
    }
  };

  // Hàm fetch contract
  const fetchContract = async () => {
    try {
      const response = await fetch('https://slmsolar.com/api/contracts', {
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.status === 404) {
        // Nếu không tìm thấy contract, set giá trị mặc định
        setContractCode('');
        setContractActivationDate('');
        setMerchandises([]);
        return;
      }

      if (!response.ok) {
        throw new Error(`Error fetching contract: ${response.status}`);
      }

      const data = await response.json();
      if (data?.data?.length > 0) {
        setContractCode(data.data[0].code || '');
        setContractActivationDate(data.data[0].created_at || '');

        // Fetch merchandises based on contract
        if (data.data[0].id) {
          await fetchMerchandises(data.data[0].id);
        }
      } else {
        // Nếu không có data, set giá trị mặc định
        setContractCode('');
        setContractActivationDate('');
        setMerchandises([]);
      }
    } catch (error) {
      console.error('Error fetching contract:', error);
      // Set giá trị mặc định khi có lỗi
      setContractCode('');
      setContractActivationDate('');
      setMerchandises([]);
    }
  };

  // Hàm fetch merchandises
  const fetchMerchandises = async (contractId: number) => {
    try {
      const response = await fetch(
        `https://slmsolar.com/api/contracts/${contractId}/merchandises`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching merchandises: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.data) {
        // Lọc ra chỉ những thiết bị có warranty_years > 0
        const filteredMerchandises = data.data.filter((item: any) => item.warranty_years > 0);
        setMerchandises(filteredMerchandises);
      }
    } catch (error) {
      console.error('Error fetching merchandises:', error);
      // Fallback to empty array to prevent errors
      setMerchandises([]);
    }
  };

  // Convert merchandises to devices
  useEffect(() => {
    if (merchandises.length > 0) {
      // Chuyển đổi dữ liệu từ PreQuoteMerchandise sang Device
      const mappedDevices = merchandises.map(item => {
        // Tính toán ngày hết hạn bảo hành
        const activationDate = contractActivationDate
          ? new Date(contractActivationDate)
          : item.activation_date
            ? new Date(item.activation_date)
            : new Date();
        const expireDate = new Date(activationDate);
        expireDate.setFullYear(expireDate.getFullYear() + item.warranty_years);

        // Tính phần trăm thời gian bảo hành đã trôi qua
        const now = new Date();
        const totalWarrantyTime = expireDate.getTime() - activationDate.getTime();
        const timeElapsed = now.getTime() - activationDate.getTime();
        const progressPercent = Math.min(Math.round((timeElapsed / totalWarrantyTime) * 100), 100);

        // Định dạng ngày tháng
        const formatDate = (date: Date) => {
          return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        };

        // Lấy URL hình ảnh từ merchandise nếu có
        const imageUrl =
          item.merchandise?.images && item.merchandise.images.length > 0
            ? item.merchandise.images[0].link
            : undefined;

        return {
          id: item.id,
          name: item.name,
          activationDate: formatDate(activationDate),
          warrantyPeriod: `${item.warranty_years} năm`,
          expireDate: formatDate(expireDate),
          progressPercent: progressPercent,
          imageUrl: imageUrl,
        };
      });

      setDevices(mappedDevices);
    }
  }, [merchandises, contractActivationDate]);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { paddingHorizontal: 0 }]}>Thiết bị của bạn</Text>
      </View>

      <View style={styles.deviceIdContainer}>
        <Text style={styles.deviceId}>{contractCode}</Text>
        <TouchableOpacity
          style={styles.sectionButton}
          onPress={() =>
            router.push({
              pathname: '/home_contract_detail',
              params: { contractCode },
            })
          }
        >
          <Text style={styles.sectionButtonText}>Chi tiết</Text>
          <Image
            source={require('../../assets/images/arrow-icon.png')}
            style={{ width: 20, height: 20, marginLeft: 8 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.deviceList}>
        {isLoadingDevices ? (
          <View style={styles.loadingDeviceContainer}>
            <ActivityIndicator size="large" color="#ED1C24" />
            <Text style={styles.loadingDeviceText}>Đang tải dữ liệu thiết bị...</Text>
          </View>
        ) : devices.length > 0 ? (
          devices.map(device => (
            <View key={device.id} style={styles.deviceCard}>
              <View style={styles.deviceCardContent}>
                <View style={styles.deviceImageContainer}>
                  <ImageWithFallback
                    uri={device.imageUrl}
                    style={styles.deviceImage}
                    resizeMode="contain"
                  />
                </View>

                <View style={styles.deviceInfo}>
                  <View>
                    <View style={styles.nameContainer}>
                      <Text style={styles.infoLabel}>Tên thiết bị:</Text>
                      <Text style={styles.deviceName} numberOfLines={1} ellipsizeMode="tail">
                        {device.name}
                      </Text>
                    </View>

                    <View style={styles.activationDateContainer}>
                      <Text style={styles.infoLabel}>Ngày kích hoạt:</Text>
                      <Text style={styles.infoValue}>{device.activationDate}</Text>
                    </View>

                    <View style={styles.warrantyTextContainer}>
                      <Text style={styles.infoLabel}>
                        Thời gian bảo hành: {device.warrantyPeriod}
                      </Text>
                      <Text style={styles.infoLabel}>đến hết {device.expireDate}</Text>
                    </View>
                  </View>

                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[styles.progressBarFill, { width: `${device.progressPercent}%` }]}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyDeviceContainer}>
            <Text style={styles.emptyDeviceText}>Không có thiết bị nào</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    paddingHorizontal: 16,
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
    paddingBottom: 16,
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
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
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
  loadingDeviceContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingDeviceText: {
    marginTop: 8,
    color: '#7B7D9D',
    fontSize: 14,
  },
  emptyDeviceContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyDeviceText: {
    color: '#7B7D9D',
    fontSize: 14,
  },
});

export default UserDevices;
