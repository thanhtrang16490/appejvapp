import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Định nghĩa kiểu dữ liệu cho Sector
export interface Sector {
  id: number;
  name: string;
  logo: string;
  image?: string;
  list_combos: Combo[];
}

// Định nghĩa kiểu dữ liệu cho Combo
export interface Combo {
  id: number;
  name: string;
  category?: string;
  description?: string;
  image?: string;
  icon?: string;
  price?: number;
  payback?: number;
  payback_period?: number;
  output_min?: string;
  output_max?: string;
  power_output?: string;
  installation_type?: string;
  phase_type?: string;
  type?: string;
  product_lines?: any[];
  image_rectangular?: string;
  total_price?: number;
  capacity?: string;
  status?: string;
  sector?: string;
  code?: string;
  created_at?: string;
  best_selling?: boolean;
  customer_id?: number | null;
  customer?: any;
  pre_quote_merchandises?: any[];
  grouped_merchandises?: any[];
  data_json?: {
    output_min?: string;
    output_max?: string;
  };
}

interface GroupedCombos {
  hybrid1Phase: Combo[];
  hybrid3Phase: Combo[];
  ongrid1Phase: Combo[];
  ongrid3Phase: Combo[];
  other: Combo[];
}

// Định nghĩa kiểu cho filter type
type FilterType =
  | 'hybrid'
  | 'ongrid'
  | 'hybrid1Phase'
  | 'hybrid3Phase'
  | 'ongrid1Phase'
  | 'ongrid3Phase'
  | null;

// Helper function to check phase type
const getPhaseType = (combo: Combo) => {
  const type = combo.type?.toLowerCase() || '';
  const phaseType = combo.phase_type?.toLowerCase() || '';

  if (phaseType.includes('3-phase')) {
    if (phaseType.includes('low voltage')) {
      return '3-phase-low';
    }
    if (phaseType.includes('high voltage')) {
      return '3-phase-high';
    }
    return '3-phase'; // general 3-phase if voltage not specified
  }
  if (phaseType.includes('1-phase') || type.includes('mot_pha')) {
    return '1-phase';
  }
  return '';
};

export default function SelectComboScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const sectorId = params.sectorId as string;

  // Xử lý chuỗi selectedComboIds từ tham số URL
  const selectedComboIdsParam = useMemo(() => {
    const idsParam = params.selectedComboIds as string;
    if (!idsParam) return [];
    return idsParam.split(',').filter(id => id.trim() !== '');
  }, [params.selectedComboIds]);

  // State cho dữ liệu sector và combos
  const [sector, setSector] = useState<Sector | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredCombos, setFilteredCombos] = useState<Combo[]>([]);
  const [selectedCombos, setSelectedCombos] = useState<Combo[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  // State cho việc mở/đóng accordions
  const [expandedSections, setExpandedSections] = useState<{
    hybrid1Phase: boolean;
    hybrid3Phase: boolean;
    ongrid1Phase: boolean;
    ongrid3Phase: boolean;
  }>({
    hybrid1Phase: true, // Mặc định mở 1 pha độc lập
    hybrid3Phase: false,
    ongrid1Phase: false,
    ongrid3Phase: false,
  });

  // Xử lý toggle accordion section
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Hằng số cho số lượng combo tối đa
  const MAX_COMBOS = 1;

  // Fetch sector
  useEffect(() => {
    // Tránh gọi API nhiều lần
    if (hasFetched) return;

    const fetchSectorData = async () => {
      if (!sectorId) return;

      try {
        setLoading(true);
        console.log(`Đang tải dữ liệu sector với ID: ${sectorId}`);

        const response = await fetch('https://api.slmglobal.vn/api/sector');

        if (!response.ok) {
          throw new Error('Failed to fetch sectors');
        }

        const sectors: Sector[] = await response.json();
        const foundSector = sectors.find(item => item.id.toString() === sectorId);

        if (foundSector) {
          setSector(foundSector);
          console.log(`Đã tải sector: ${foundSector.name} (ID: ${foundSector.id})`);

          // Kiểm tra nếu có danh sách combos từ API
          if (foundSector.list_combos && foundSector.list_combos.length > 0) {
            console.log(`Có ${foundSector.list_combos.length} combos trong sector`);
            setFilteredCombos(foundSector.list_combos);

            // Tìm các combo đã chọn trước đó nếu có
            if (selectedComboIdsParam.length > 0) {
              console.log(`Tìm ${selectedComboIdsParam.length} combo đã chọn trước đó`);
              const selected = foundSector.list_combos.filter(combo =>
                selectedComboIdsParam.includes(combo.id.toString())
              );

              if (selected.length > 0) {
                setSelectedCombos(selected);
                console.log(`Đã tìm thấy ${selected.length} combo đã chọn trước đó`);
              }
            }
          } else {
            console.log(`Sector không có combos hoặc list_combos rỗng`);
            setError('Không có sản phẩm nào cho thương hiệu này');
          }
        } else {
          console.error(`Không tìm thấy sector có ID: ${sectorId}`);
          setError('Không tìm thấy sector');
        }
      } catch (err) {
        console.error('Error fetching sector data:', err);
        setError('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.');
        setIsConnected(false);
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    };

    fetchSectorData();
  }, [sectorId, selectedComboIdsParam, hasFetched]);

  // Phân loại combos vào các nhóm
  const groupedCombos = useMemo(() => {
    if (!sector?.list_combos) return null;

    const groups: GroupedCombos = {
      hybrid1Phase: [],
      hybrid3Phase: [],
      ongrid1Phase: [],
      ongrid3Phase: [],
      other: [],
    };

    sector.list_combos.forEach(combo => {
      // Xác định loại hệ thống (Ongrid hoặc Hybrid)
      const isHybrid =
        combo.installation_type?.toLowerCase() === 'hybrid' || combo.type?.includes('DOC_LAP');

      const isOngrid =
        combo.installation_type?.toLowerCase() === 'ongrid' || combo.type?.includes('BAM_TAI');

      // Xác định loại pha (1 pha hoặc 3 pha)
      const is3Phase =
        combo.phase_type?.toLowerCase()?.includes('3-phase') || combo.type?.includes('BA_PHA');

      const is1Phase =
        combo.phase_type?.toLowerCase()?.includes('1-phase') || combo.type?.includes('MOT_PHA');

      // Phân loại vào các nhóm
      if (isHybrid && is1Phase) {
        groups.hybrid1Phase.push(combo);
      } else if (isHybrid && is3Phase) {
        groups.hybrid3Phase.push(combo);
      } else if (isOngrid && is1Phase) {
        groups.ongrid1Phase.push(combo);
      } else if (isOngrid && is3Phase) {
        groups.ongrid3Phase.push(combo);
      } else {
        groups.other.push(combo);
      }
    });

    return groups;
  }, [sector]);

  // Xử lý khi chọn combo
  const handleSelectCombo = (combo: Combo) => {
    // Kiểm tra xem combo đã được chọn chưa
    const isSelected = selectedCombos.some(item => item.id === combo.id);

    if (isSelected) {
      // Nếu đã chọn thì bỏ chọn
      setSelectedCombos(selectedCombos.filter(item => item.id !== combo.id));
    } else {
      // Vì MAX_COMBOS = 1, thay thế combo đã chọn với combo mới và xác nhận ngay
      setSelectedCombos([combo]);

      // Xác nhận và chuyển hướng ngay lập tức
      console.log(`------ XÁC NHẬN CHỌN COMBO ------`);
      console.log(`Đã chọn combo - Đang quay lại màn hình trước`);
      console.log(`Thông tin combo được chọn: ID=${combo.id}, Name=${combo.name}`);
      console.log(`Sector ID: ${sectorId}`);

      // Trở về trang trước với combo đã chọn
      router.navigate({
        pathname: '/(contacts)/new-contact',
        params: {
          selectedComboIds: combo.id.toString(),
          sectorId: sectorId?.toString() || '',
          timestamp: new Date().getTime().toString(), // Thêm timestamp để đảm bảo params thay đổi
          returnFromSelectCombo: 'true', // Đánh dấu đang quay lại từ màn hình select-combo
        },
      });

      console.log(`------ ĐÃ CHUYỂN VỀ MÀN HÌNH NEW-CONTACT ------`);
    }
  };

  // Xử lý khi xác nhận chọn combo (Giữ lại để tái sử dụng nếu cần)
  const handleConfirmSelection = () => {
    if (selectedCombos.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn một sản phẩm');
      return;
    }

    console.log(`------ XÁC NHẬN CHỌN COMBO ------`);
    console.log(`Đã chọn ${selectedCombos.length} combo - Đang quay lại màn hình trước`);
    console.log(
      `Thông tin combo được chọn: ${selectedCombos.map(c => `ID=${c.id}, Name=${c.name}`).join(' | ')}`
    );
    console.log(`Sector ID: ${sectorId}`);

    const selectedComboIds = selectedCombos.map(combo => combo.id).join(',');
    console.log(`Chuỗi comboIds sẽ truyền: ${selectedComboIds}`);

    // Trở về trang trước với các combo đã chọn
    router.navigate({
      pathname: '/(contacts)/new-contact',
      params: {
        selectedComboIds: selectedComboIds,
        sectorId: sectorId?.toString() || '',
        timestamp: new Date().getTime().toString(), // Thêm timestamp để đảm bảo params thay đổi
        returnFromSelectCombo: 'true', // Đánh dấu đang quay lại từ màn hình select-combo
      },
    });

    console.log(`------ ĐÃ CHUYỂN VỀ MÀN HÌNH NEW-CONTACT ------`);
  };

  // Format thời gian hoàn vốn
  const formatPaybackPeriod = (period?: number) => {
    if (!period) return 'N/A';

    const years = Math.floor(period);
    const months = Math.round((period % 1) * 12);

    if (years === 0) {
      return `${months} tháng`;
    } else if (months === 0) {
      return `${years} năm`;
    } else {
      return `${years} năm ${months} tháng`;
    }
  };

  // Thêm hàm getProductTag
  const getProductTag = (combo: Combo) => {
    const tags = {
      installation: combo.installation_type ? combo.installation_type.toUpperCase() : null,
      phase: null as string | null,
      system: null as string | null,
    };

    const phaseType = getPhaseType(combo);
    if (phaseType === '3-phase-low') {
      tags.phase = '3 PHA ÁP THẤP';
    } else if (phaseType === '3-phase-high') {
      tags.phase = '3 PHA ÁP CAO';
    } else if (phaseType === '1-phase') {
      tags.phase = '1 PHA';
    }

    // Xác định loại hệ
    if (combo.installation_type?.toLowerCase() === 'ongrid' || combo.type?.includes('BAM_TAI')) {
      tags.system = 'BÁM TẢI';
    } else if (
      combo.installation_type?.toLowerCase() === 'hybrid' ||
      combo.type?.includes('DOC_LAP')
    ) {
      tags.system = 'ĐỘC LẬP';
    }

    return tags;
  };

  // Xử lý khi thử lại
  const handleRetry = () => {
    if (isConnected) {
      setHasFetched(false); // Reset state để cho phép fetch lại data
    } else {
      Alert.alert(
        'Thông báo',
        'Bạn đang ở chế độ offline. Vui lòng kiểm tra kết nối mạng và thử lại.'
      );
    }
  };

  // Mở cài đặt kết nối
  const openConnectionSettings = () => {
    Linking.openSettings();
  };

  // Hiển thị chi tiết lỗi
  const renderErrorDetails = () => {
    if (!isConnected) {
      return (
        <>
          <Text style={styles.errorSubText}>
            Không có kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn và thử lại.
          </Text>
          <TouchableOpacity style={styles.settingsButton} onPress={openConnectionSettings}>
            <Text style={styles.retryText}>Mở cài đặt mạng</Text>
          </TouchableOpacity>
        </>
      );
    }

    if (error) {
      return <Text style={styles.errorSubText}>{error}</Text>;
    }

    return null;
  };

  // Kiểm tra xem combo có được chọn không
  const isComboSelected = (comboId: number) => {
    return selectedCombos.some(combo => combo.id === comboId);
  };

  // Component render cho mỗi item combo
  const renderComboItem = ({ item }: { item: Combo }) => (
    <TouchableOpacity
      style={[styles.productCard, isComboSelected(item.id) && styles.selectedCard]}
      onPress={() => handleSelectCombo(item)}
    >
      <View style={styles.productImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />
        ) : item.icon ? (
          <Image source={{ uri: item.icon }} style={styles.productImage} resizeMode="contain" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="cube-outline" size={30} color="#888" />
          </View>
        )}
      </View>

      <View style={styles.productContent}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>

        <View style={styles.productDetails}>
          {item.output_min && item.output_max ? (
            <Text style={styles.productDetail}>
              Sản lượng điện: {item.output_min}-{item.output_max} kWh/tháng
            </Text>
          ) : (
            <Text style={styles.productDetail}>Sản lượng điện: N/A</Text>
          )}

          {item.power_output && (
            <Text style={styles.productDetail}>Công suất: {item.power_output}</Text>
          )}

          {item.payback_period && (
            <Text style={styles.productDetail}>
              Hoàn vốn: {formatPaybackPeriod(item.payback_period)}
            </Text>
          )}
        </View>

        {item.price && (
          <Text style={styles.productPrice}>
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              maximumFractionDigits: 0,
            }).format(item.price)}
          </Text>
        )}
      </View>

      {isComboSelected(item.id) && (
        <View style={styles.selectedIndicator}>
          <Ionicons name="checkmark-circle" size={24} color="#12B669" />
        </View>
      )}
    </TouchableOpacity>
  );

  // Render accordion section
  const renderAccordionSection = (
    title: string,
    items: Combo[],
    isExpanded: boolean,
    sectionKey: keyof typeof expandedSections,
    badgeNumber?: number
  ) => {
    if (!items || items.length === 0) return null;

    // Đếm số sản phẩm đã chọn trong mục này
    const selectedCount = items.filter(item => isComboSelected(item.id)).length;
    const hasBadge = selectedCount > 0;

    return (
      <View style={styles.accordionContainer}>
        <TouchableOpacity style={styles.accordionHeader} onPress={() => toggleSection(sectionKey)}>
          <Text style={styles.accordionTitle}>{title}</Text>
          <View style={styles.accordionRightContent}>
            {hasBadge && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{selectedCount}</Text>
              </View>
            )}
            <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} color="#666" />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.accordionContent}>
            <FlatList
              data={items}
              renderItem={renderComboItem}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
            />
          </View>
        )}
      </View>
    );
  };

  // Get number of selected items in any section
  const getSelectionCount = () => {
    return selectedCombos.length;
  };

  // Xử lý khi đóng màn hình (quay lại với các lựa chọn hiện tại)
  const handleClose = () => {
    console.log(`------ ĐÓNG MÀN HÌNH CHỌN COMBO ------`);
    console.log(`Đóng màn hình với ${selectedCombos.length} combo đã chọn`);

    // Trở về trang trước với các combo đã chọn (nếu có)
    if (selectedCombos.length > 0) {
      console.log(
        `Thông tin combo được chọn: ${selectedCombos.map(c => `ID=${c.id}, Name=${c.name}`).join(' | ')}`
      );
      console.log(`Sector ID: ${sectorId}`);

      const selectedComboIds = selectedCombos.map(combo => combo.id).join(',');
      console.log(`Chuỗi comboIds sẽ truyền: ${selectedComboIds}`);

      router.navigate({
        pathname: '/(contacts)/new-contact',
        params: {
          selectedComboIds: selectedComboIds,
          sectorId: sectorId?.toString() || '',
          timestamp: new Date().getTime().toString(), // Thêm timestamp để đảm bảo params thay đổi
          returnFromSelectCombo: 'true', // Đánh dấu đang quay lại từ màn hình select-combo
        },
      });
    } else {
      // Nếu không có combo nào được chọn, quay lại với tham số
      console.log(`Không có combo nào được chọn, quay lại không truyền ID`);
      router.navigate({
        pathname: '/(contacts)/new-contact',
        params: {
          returnFromSelectCombo: 'true', // Đánh dấu đang quay lại từ màn hình select-combo
          timestamp: new Date().getTime().toString(),
        },
      });
    }

    console.log(`------ ĐÃ CHUYỂN VỀ MÀN HÌNH NEW-CONTACT ------`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.title}>{sector ? `Sản phẩm ${sector.name}` : 'Sản phẩm'}</Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EE0033" />
          <Text style={styles.loadingText}>Đang tải dữ liệu sản phẩm...</Text>
          {isConnected && (
            <Text style={styles.connectionWarning}>
              Không có kết nối mạng. Đang tìm dữ liệu đã lưu...
            </Text>
          )}
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="cloud-offline" size={48} color="#EE0033" />
          <Text style={styles.errorText}>{error}</Text>
          {renderErrorDetails()}
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.retryButton, styles.backButtonAlt]}
            onPress={handleClose}
          >
            <Text style={styles.retryText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Thông tin lựa chọn */}
          <View style={styles.selectionInfoContainer}>
            <Text style={styles.selectionTitle}>Chọn 1 sản phẩm</Text>
            <Text style={styles.selectionSubtitle}>
              Để đảm bảo chất lượng tư vấn và chốt đơn dễ dàng, vui lòng chỉ chọn 1 sản phẩm. Khi
              chọn, bạn sẽ tự động quay lại màn hình trước.
            </Text>
          </View>

          {groupedCombos ? (
            <ScrollView contentContainerStyle={styles.productList}>
              {/* Hệ độc lập */}
              <View style={styles.systemSection}>
                <View style={styles.systemHeaderContainer}>
                  <Text style={styles.systemHeader}>Hệ Độc lập</Text>
                </View>

                {renderAccordionSection(
                  'Hệ Độc lập - Một pha',
                  groupedCombos.hybrid1Phase,
                  expandedSections.hybrid1Phase,
                  'hybrid1Phase'
                )}

                {renderAccordionSection(
                  'Hệ Độc lập - Ba pha',
                  groupedCombos.hybrid3Phase,
                  expandedSections.hybrid3Phase,
                  'hybrid3Phase'
                )}
              </View>

              {/* Hệ bám tải */}
              <View style={styles.systemSection}>
                <View style={styles.systemHeaderContainer}>
                  <Text style={styles.systemHeader}>Hệ Bám tải</Text>
                </View>

                {renderAccordionSection(
                  'Hệ Bám tải - Một pha',
                  groupedCombos.ongrid1Phase,
                  expandedSections.ongrid1Phase,
                  'ongrid1Phase'
                )}

                {renderAccordionSection(
                  'Hệ Bám tải - Ba pha',
                  groupedCombos.ongrid3Phase,
                  expandedSections.ongrid3Phase,
                  'ongrid3Phase'
                )}
              </View>

              {/* Sản phẩm khác nếu có */}
              {groupedCombos.other.length > 0 && (
                <View style={styles.otherProductsContainer}>
                  <Text style={styles.groupTitle}>Sản phẩm khác</Text>
                  <FlatList
                    data={groupedCombos.other}
                    renderItem={renderComboItem}
                    keyExtractor={item => item.id.toString()}
                    scrollEnabled={false}
                  />
                </View>
              )}

              {/* Thêm padding ở dưới cùng */}
              <View style={{ height: 20 }} />
            </ScrollView>
          ) : (
            <FlatList
              data={sector?.list_combos || []}
              renderItem={renderComboItem}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={[styles.productList, { paddingBottom: 20 }]}
              ListEmptyComponent={
                <View style={styles.emptyListContainer}>
                  <Text style={styles.emptyListText}>Không có sản phẩm nào</Text>
                </View>
              }
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EE0033',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    padding: 12,
    backgroundColor: '#EE0033',
    borderRadius: 8,
    marginBottom: 10,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  selectionInfoContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  selectionSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  productList: {
    padding: 0,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#12B669',
  },
  productImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#f5f5f5',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f1f1f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  productDetails: {
    marginBottom: 8,
  },
  productDetail: {
    fontSize: 14,
    color: '#666',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EE0033',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  emptyListContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyListText: {
    fontSize: 16,
    color: '#666',
  },
  bottomButtonContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  confirmButton: {
    backgroundColor: '#EE0033',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ffb3b3',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  systemSection: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  systemHeaderContainer: {
    backgroundColor: '#25253D',
    padding: 12,
  },
  systemHeader: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  accordionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  accordionTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  accordionRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeContainer: {
    backgroundColor: '#12B669',
    borderRadius: 50,
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  accordionContent: {
    padding: 16,
    paddingTop: 0,
  },
  otherProductsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  connectionWarning: {
    marginTop: 8,
    fontSize: 14,
    color: '#EE0033',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  errorSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 30,
  },
  settingsButton: {
    padding: 12,
    backgroundColor: '#0077CC',
    borderRadius: 8,
    marginBottom: 10,
  },
  backButtonAlt: {
    backgroundColor: '#666',
  },
});
