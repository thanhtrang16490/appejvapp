import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';

// Định nghĩa các kiểu dữ liệu
interface Province {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  phone_code: number;
  districts?: District[];
}

interface District {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  province_code: number;
  wards?: Ward[];
}

interface Ward {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  district_code: number;
}

// Định nghĩa kiểu dữ liệu cho Sector
interface Sector {
  id: number;
  name: string;
  code: string;
  image: string;
  image_rectangular: string;
  list_combos?: Combo[];
}

// Định nghĩa kiểu dữ liệu cho Combo
interface Combo {
  id: number;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  phase_type?: string;
  capacity?: string;
  type?: string;
  installation_type?: string;
  power_output?: string;
  total_price?: number;
  payback_period?: number;
  output_min?: string;
  output_max?: string;
}

// Định nghĩa kiểu dữ liệu cho ProductLine
interface ProductLine {
  id: number;
  name: string;
  code: string;
  logoUrl: string;
  selected: boolean;
}

// Interface cho dữ liệu gửi lên API
interface PotentialCustomerData {
  agent_id: number;
  assumed_code: string;
  name: string;
  phone: string;
  gender: boolean;
  email: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  interested_in_combo_id: number | null; // Cho phép null
  description: string;
}

// Interface cho thông tin user
interface User {
  id: number;
  name: string;
  role_id?: number;
  phone?: string;
  address?: string;
  avatar?: string;
  code?: string;
  // các thông tin khác của user
}

// Định nghĩa các schema validation
const phoneSchema = z
  .string()
  .min(10, { message: 'Số điện thoại phải có ít nhất 10 số' })
  .max(15, { message: 'Số điện thoại không được quá 15 số' })
  .regex(/^[0-9]+$/, { message: 'Số điện thoại chỉ được chứa số' })
  .refine(
    value => {
      // Kiểm tra số điện thoại Việt Nam (bắt đầu bằng 0 và có 10 số)
      // hoặc số quốc tế (bắt đầu bằng dấu +)
      return /^(0[0-9]{9}|(\+)[0-9]{10,14})$/.test(value);
    },
    { message: 'Định dạng số điện thoại không hợp lệ' }
  );

const emailSchema = z
  .string()
  .email({ message: 'Email không hợp lệ' })
  .optional()
  .or(z.literal(''));

export default function NewContactScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [gender, setGender] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');

  // State cho danh sách dữ liệu
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  // State cho việc hiển thị modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'province' | 'district' | 'ward' | 'gender'>(
    'province'
  );

  // ID của tỉnh/quận đã chọn
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | null>(null);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<number | null>(null);

  // State cho dữ liệu form
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [occupation, setOccupation] = useState('');
  const [interestedComboId, setInterestedComboId] = useState<number>(0);
  const [assumedCode, setAssumedCode] = useState('');

  // State cho validation
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [phoneTimeout, setPhoneTimeout] = useState<NodeJS.Timeout | null>(null);

  // State cho thông tin user đăng nhập
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  // State cho sản phẩm quan tâm
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [productLines, setProductLines] = useState<ProductLine[]>([]);
  const [isLoadingSectors, setIsLoadingSectors] = useState(false);
  const [sectorsError, setSectorsError] = useState<string | null>(null);

  // State cho combo
  const [combos, setCombos] = useState<Combo[]>([]);
  const [filteredCombos, setFilteredCombos] = useState<Combo[]>([]);
  const [selectedCombos, setSelectedCombos] = useState<Combo[]>([]);
  const [showComboModal, setShowComboModal] = useState(false);
  const [isLoadingCombos, setIsLoadingCombos] = useState(false);
  const [comboError, setComboError] = useState<string | null>(null);

  // State để theo dõi việc điều hướng đến màn hình chọn combo
  const [isNavigatingToCombo, setIsNavigatingToCombo] = useState(false);

  // State for email validation
  const [emailError, setEmailError] = useState('');

  // Sử dụng useRef để theo dõi việc đã xử lý params
  const processedParamsRef = useRef<{
    selectedComboIds?: string;
    sectorId?: string;
    timestamp?: string;
    processed: boolean; // Thêm flag để đánh dấu đã xử lý
  }>({
    processed: false,
  });

  // Hàm lưu dữ liệu form khi chuyển màn hình
  const saveFormData = async () => {
    try {
      // Thu thập tất cả thông tin từ form
      const formData = {
        phoneNumber,
        fullName,
        email,
        address,
        occupation,
        gender,
        province,
        district,
        ward,
        selectedProvinceCode,
        selectedDistrictCode,
        assumedCode,

        // Lưu thông tin về sản phẩm đã chọn
        selectedProductLines: productLines.filter(p => p.selected).map(p => p.id),
        selectedCombos: selectedCombos.map(c => ({
          id: c.id,
          name: c.name,
          image: c.image,
          description: c.description,
          price: c.price,
          output_min: c.output_min,
          output_max: c.output_max,
        })),
        interestedComboId,

        // Thêm timestamp để theo dõi
        timestamp: new Date().getTime(),
      };

      console.log(
        'Đang lưu form data: ',
        JSON.stringify({
          phoneNumber: formData.phoneNumber,
          fullName: formData.fullName,
          email: formData.email,
          province: formData.province,
          district: formData.district,
          ward: formData.ward,
          selectedProvinceCode: formData.selectedProvinceCode,
          selectedDistrictCode: formData.selectedDistrictCode,
          // Không log toàn bộ dữ liệu để tránh log quá dài
          selectedProductCount: formData.selectedProductLines.length,
          selectedComboCount: formData.selectedCombos.length,
          timestamp: formData.timestamp,
        })
      );

      await AsyncStorage.setItem('@slm_temp_form_data', JSON.stringify(formData));
      console.log('Đã lưu dữ liệu form tạm thời thành công');
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu form:', error);
    }
  };

  // Hàm khôi phục dữ liệu form khi quay lại
  const restoreFormData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('@slm_temp_form_data');
      if (savedData) {
        console.log('Đã tìm thấy dữ liệu form đã lưu, đang khôi phục...');
        const formData = JSON.parse(savedData);

        // Log thông tin để debug
        console.log(
          'Dữ liệu form đã lưu:',
          JSON.stringify({
            phoneNumber: formData.phoneNumber,
            fullName: formData.fullName,
            email: formData.email,
            province: formData.province,
            district: formData.district,
            ward: formData.ward,
            selectedProvinceCode: formData.selectedProvinceCode,
            selectedDistrictCode: formData.selectedDistrictCode,
            // Không log toàn bộ dữ liệu để tránh log quá dài
            selectedProductCount: formData.selectedProductLines?.length || 0,
            selectedComboCount: formData.selectedCombos?.length || 0,
            timestamp: formData.timestamp,
          })
        );

        // Khôi phục dữ liệu cơ bản
        setPhoneNumber(formData.phoneNumber || '');
        setFullName(formData.fullName || '');
        setEmail(formData.email || '');
        setAddress(formData.address || '');
        setOccupation(formData.occupation || '');
        setGender(formData.gender || '');

        // Khôi phục dữ liệu địa chỉ
        setProvince(formData.province || '');
        setDistrict(formData.district || '');
        setWard(formData.ward || '');

        // Khôi phục các mã code quan trọng và đảm bảo là kiểu số
        if (formData.selectedProvinceCode) {
          const provinceCode = Number(formData.selectedProvinceCode);
          setSelectedProvinceCode(provinceCode);
          console.log(`Đã khôi phục mã tỉnh/thành: ${provinceCode}`);

          // Tải lại danh sách quận/huyện
          if (provinceCode) {
            fetchDistricts(provinceCode);
          }
        }

        if (formData.selectedDistrictCode) {
          const districtCode = Number(formData.selectedDistrictCode);
          setSelectedDistrictCode(districtCode);
          console.log(`Đã khôi phục mã quận/huyện: ${districtCode}`);

          // Tải lại danh sách phường/xã
          if (districtCode) {
            fetchWards(districtCode);
          }
        }

        setAssumedCode(formData.assumedCode || '');

        // Khôi phục dữ liệu sản phẩm đã chọn (nếu có)
        if (formData.selectedProductLines && formData.selectedProductLines.length > 0) {
          const selectedId = formData.selectedProductLines[0];
          console.log(`Đang cập nhật sản phẩm được chọn: ${selectedId}`);

          setProductLines(prevLines => {
            return prevLines.map(product => ({
              ...product,
              selected: product.id === selectedId,
            }));
          });
        }

        // Khôi phục combo đã chọn nếu có
        if (formData.selectedCombos && formData.selectedCombos.length > 0) {
          console.log(`Đang khôi phục ${formData.selectedCombos.length} combo đã chọn`);
          setSelectedCombos(formData.selectedCombos);

          // Khôi phục interestedComboId
          if (formData.interestedComboId) {
            setInterestedComboId(formData.interestedComboId);
            console.log(`Đã khôi phục interestedComboId = ${formData.interestedComboId}`);
          }
        }

        console.log('Đã khôi phục dữ liệu form thành công');
      } else {
        console.log('Không tìm thấy dữ liệu form đã lưu');
      }
    } catch (error) {
      console.error('Lỗi khi khôi phục dữ liệu form:', error);
    }
  };

  // Xử lý dữ liệu khi quay lại từ trang chọn combo
  useEffect(() => {
    const handleParams = async () => {
      // Chỉ xử lý nếu đang quay lại từ select-combo và có params mới và chưa xử lý
      if (
        params.returnFromSelectCombo === 'true' &&
        params.selectedComboIds &&
        params.sectorId &&
        params.timestamp &&
        !processedParamsRef.current.processed &&
        (processedParamsRef.current.timestamp !== params.timestamp ||
          processedParamsRef.current.selectedComboIds !== params.selectedComboIds ||
          processedParamsRef.current.sectorId !== params.sectorId)
      ) {
        try {
          // Đánh dấu đã xử lý để không lặp lại
          processedParamsRef.current = {
            selectedComboIds: params.selectedComboIds as string,
            sectorId: params.sectorId as string,
            timestamp: params.timestamp as string,
            processed: true,
          };

          console.log(`------ BẮT ĐẦU XỬ LÝ THAM SỐ TỪ SELECT-COMBO ------`);
          console.log(`Đang xử lý params mới với timestamp: ${params.timestamp}`);
          console.log(
            `Params gốc: selectedComboIds=${params.selectedComboIds}, sectorId=${params.sectorId}`
          );

          const sectorId = Number(params.sectorId);
          const comboIds = (params.selectedComboIds as string)
            .split(',')
            .map(id => Number(id))
            .filter(id => !isNaN(id) && id > 0);

          console.log(
            `Sau khi chuyển đổi: sectorId=${sectorId} (${typeof sectorId}), comboIds=[${comboIds.join(',')}] (${comboIds.length} items)`
          );
          console.log(`Debug: comboIds trong params, raw value: ${params.selectedComboIds}`);

          if (isNaN(sectorId) || sectorId <= 0) {
            console.error(`❌ Lỗi: sectorId không hợp lệ: ${sectorId}`);
            return;
          }

          if (comboIds.length === 0) {
            console.error(
              `❌ Lỗi: Không có combo ID hợp lệ sau khi chuyển đổi từ: ${params.selectedComboIds}`
            );
            return;
          }

          // Cập nhật sector được chọn
          setProductLines(prevLines => {
            console.log(`Cập nhật chọn sector ${sectorId} trong ${prevLines.length} product lines`);
            return prevLines.map(product => ({
              ...product,
              selected: product.id === sectorId,
            }));
          });

          // Tìm sector trong danh sách
          const selectedSector = sectors.find(sector => sector.id === sectorId);
          console.log(
            `Tìm sector ${sectorId} trong danh sách: ${selectedSector ? '✅ Đã tìm thấy' : '❌ Không tìm thấy'}`
          );

          if (selectedSector?.list_combos && selectedSector.list_combos.length > 0) {
            console.log(
              `Sector có ${selectedSector.list_combos.length} combos. Đang tìm combo có ID trong: [${comboIds.join(',')}]`
            );

            // Debug: Log toàn bộ combo IDs trong sector để so sánh
            console.log(
              `Danh sách combo ID trong sector: [${selectedSector.list_combos.map(c => c.id).join(',')}]`
            );

            // Tìm các combo được chọn từ danh sách combos đã có
            const foundCombos = selectedSector.list_combos.filter(combo =>
              comboIds.includes(combo.id)
            );

            if (foundCombos.length > 0) {
              console.log(
                `✅ Đã tìm thấy ${foundCombos.length}/${comboIds.length} combo trong data hiện tại`
              );
              console.log(
                `Thông tin combo: ${foundCombos.map(c => `ID=${c.id}, Name=${c.name}`).join(' | ')}`
              );

              setSelectedCombos(foundCombos);
              // Sử dụng ID của combo đầu tiên cho trường interested_in_combo_id
              if (foundCombos[0]) {
                setInterestedComboId(foundCombos[0].id);
                console.log(
                  `✅ Đặt interestedComboId = ${foundCombos[0].id} (${foundCombos[0].name})`
                );
              }
              console.log(`------ KẾT THÚC XỬ LÝ THAM SỐ ------`);
              return; // Đã tìm thấy combo, không cần fetch thêm
            } else {
              console.log(
                `❌ Không tìm thấy combo nào trong danh sách hiện có của sector ${sectorId}`
              );
              console.log(`Combo không tìm thấy: [${comboIds.join(',')}]`);
            }
          } else {
            console.log(`❌ Sector ${sectorId} chưa có danh sách combo hoặc danh sách rỗng`);
          }

          // Nếu chưa có data sector hoặc không tìm thấy combo, fetch dữ liệu mới
          console.log(`🔄 Đang tải dữ liệu sector mới...`);
          await fetchSectorData(sectorId, comboIds);
          console.log(`------ KẾT THÚC XỬ LÝ THAM SỐ ------`);
        } catch (error) {
          console.error('❌ Lỗi khi xử lý tham số từ select-combo:', error);
        }
      }
    };

    handleParams();
  }, [params.returnFromSelectCombo, params.selectedComboIds, params.sectorId, params.timestamp]);

  // Reset form khi có params.refresh="true"
  useEffect(() => {
    if (params.refresh === 'true') {
      // Reset form
      setPhoneNumber('');
      setFullName('');
      setEmail('');
      setAddress('');
      setOccupation('');
      setGender('');
      setProvince('');
      setDistrict('');
      setWard('');
      setSelectedProvinceCode(null);
      setSelectedDistrictCode(null);
      setAssumedCode('');

      // Reset combo data
      setSelectedCombos([]);
      setInterestedComboId(0);

      // Xóa dữ liệu form tạm thời
      AsyncStorage.removeItem('@slm_temp_form_data');
    }
  }, [params.refresh]);

  // Khôi phục dữ liệu form khi quay lại màn hình từ màn hình chọn combo
  useFocusEffect(
    useCallback(() => {
      const restoreData = async () => {
        console.log('Màn hình đang focus - Bắt đầu khôi phục dữ liệu form');

        // Reset flag processed khi focus lại màn hình
        if (!params.returnFromSelectCombo) {
          processedParamsRef.current.processed = false;
        }

        // Kiểm tra nếu đang quay lại từ select-combo
        const isReturningFromSelectCombo = params.returnFromSelectCombo === 'true';

        if (isReturningFromSelectCombo) {
          console.log('Phát hiện quay lại từ màn hình select-combo');

          // Khôi phục toàn bộ dữ liệu form
          await restoreFormData();

          // Đảm bảo tải lại dữ liệu quận/huyện và phường/xã nếu cần
          if (
            selectedProvinceCode &&
            (!districts.length || districts[0].province_code !== selectedProvinceCode)
          ) {
            console.log(`Tải lại dữ liệu quận/huyện cho tỉnh: ${selectedProvinceCode}`);
            fetchDistricts(selectedProvinceCode);
          }

          if (
            selectedDistrictCode &&
            (!wards.length || wards[0].district_code !== selectedDistrictCode)
          ) {
            console.log(`Tải lại dữ liệu phường/xã cho quận/huyện: ${selectedDistrictCode}`);
            fetchWards(selectedDistrictCode);
          }

          console.log('Đã hoàn thành khôi phục dữ liệu form');
        }
        // Nếu không phải quay lại từ select-combo nhưng có đánh dấu isNavigatingToCombo
        else if (isNavigatingToCombo) {
          console.log('Đã phát hiện trạng thái chuyển màn hình chọn combo');

          // Khôi phục toàn bộ dữ liệu form
          await restoreFormData();

          // Đảm bảo tải lại dữ liệu quận/huyện và phường/xã nếu cần
          if (
            selectedProvinceCode &&
            (!districts.length || districts[0].province_code !== selectedProvinceCode)
          ) {
            console.log(`Tải lại dữ liệu quận/huyện cho tỉnh: ${selectedProvinceCode}`);
            fetchDistricts(selectedProvinceCode);
          }

          if (
            selectedDistrictCode &&
            (!wards.length || wards[0].district_code !== selectedDistrictCode)
          ) {
            console.log(`Tải lại dữ liệu phường/xã cho quận/huyện: ${selectedDistrictCode}`);
            fetchWards(selectedDistrictCode);
          }

          // Reset trạng thái sau khi khôi phục xong
          setIsNavigatingToCombo(false);
          console.log('Đã hoàn thành khôi phục dữ liệu form');
        }
      };

      restoreData();

      return () => {
        // Cleanup khi unfocus nếu cần
      };
    }, [
      isNavigatingToCombo,
      params.returnFromSelectCombo,
      params.timestamp,
      selectedProvinceCode,
      selectedDistrictCode,
      districts,
      wards,
    ])
  );

  // Hàm fetch dữ liệu sector và combo cụ thể
  const fetchSectorData = async (sectorId: number, comboIds: number[]) => {
    console.log(`\n------ TẢI SECTOR ${sectorId} TỪ API ------`);
    console.log(`🔍 Tìm kiếm các combo ID: [${comboIds.join(',')}]`);
    setIsLoadingCombos(true);

    try {
      const response = await fetch(`https://api.slmglobal.vn/api/sector`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const allSectors = await response.json();
      console.log(`✅ Đã tải dữ liệu từ API: ${allSectors.length} sectors`);

      const data = allSectors.find((s: { id: number }) => s.id === sectorId);

      if (!data) {
        console.error(`❌ API: Không tìm thấy sector với ID: ${sectorId}`);
        throw new Error(`Không tìm thấy sector với ID: ${sectorId}`);
      }

      console.log(`✅ API: Đã tìm thấy sector: ${data.name} (ID: ${data.id})`);
      updateSectorData(data);

      // Cập nhật product lines nếu cần
      setProductLines(prevLines => {
        // Nếu chưa có product lines, tạo mới từ sectors
        if (prevLines.length === 0) {
          console.log(`Tạo mới product lines từ ${sectors.length} sectors`);
          return sectors.map(
            (sector: { id: number; name: string; code: string; image: string }, index: number) => ({
              id: sector.id,
              name: sector.name,
              code: sector.code,
              logoUrl: sector.image,
              selected: sector.id === sectorId,
            })
          );
        }

        // Nếu đã có, chỉ cập nhật selected status
        console.log(`Cập nhật selected status trong ${prevLines.length} product lines`);
        return prevLines.map(product => ({
          ...product,
          selected: product.id === sectorId,
        }));
      });

      // Tìm các combo
      if (data.list_combos && data.list_combos.length > 0) {
        console.log(`API: Sector có ${data.list_combos.length} combos, đang kiểm tra...`);

        // Debug: Log toàn bộ combo IDs từ API để so sánh
        console.log(
          `API: Danh sách combo ID từ API: [${data.list_combos.map((c: { id: number }) => c.id).join(',')}]`
        );

        // Kiểm tra chi tiết từng combo ID được yêu cầu
        for (const requestedId of comboIds) {
          const exists = data.list_combos.some((c: { id: number }) => c.id === requestedId);
          console.log(
            `Kiểm tra combo ID ${requestedId}: ${exists ? 'Tồn tại ✅' : 'Không tồn tại ❌'}`
          );
        }

        const foundCombos = data.list_combos.filter((c: { id: number }) => comboIds.includes(c.id));

        if (foundCombos.length > 0) {
          console.log(`✅ API: Đã tìm thấy ${foundCombos.length}/${comboIds.length} combo từ API`);
          console.log(
            `Thông tin combo từ API: ${foundCombos.map((c: { id: number; name: string }) => `ID=${c.id}, Name=${c.name}`).join(' | ')}`
          );

          setSelectedCombos(foundCombos);
          // Sử dụng ID của combo đầu tiên cho trường interested_in_combo_id
          if (foundCombos[0]) {
            // Đảm bảo cập nhật interestedComboId với id của combo đã chọn
            setInterestedComboId(foundCombos[0].id);
            console.log(
              `✅ API: Đặt interestedComboId = ${foundCombos[0].id} từ combo: ${foundCombos[0].name}`
            );
          }
        } else {
          console.warn(
            `⚠️ API: Không tìm thấy combo nào trong danh sách requested: [${comboIds.join(',')}]`
          );

          // Nếu không tìm được combo đã yêu cầu, sử dụng combo đầu tiên từ sector
          if (data.list_combos.length > 0) {
            const firstCombo = data.list_combos[0];
            setSelectedCombos([firstCombo]);
            setInterestedComboId(firstCombo.id);
            console.log(
              `ℹ️ API: Sử dụng combo đầu tiên trong sector thay thế: ID=${firstCombo.id}, Name=${firstCombo.name}`
            );
          } else {
            console.error(`❌ API: Sector không có combo nào`);
          }
        }
      } else {
        console.warn(`⚠️ API: Sector ${sectorId} không có danh sách combo hoặc danh sách rỗng`);
      }

      console.log(`------ KẾT THÚC TẢI SECTOR TỪ API ------\n`);
    } catch (error) {
      console.error('❌ Lỗi khi tải dữ liệu sector:', error);
      Alert.alert('Thông báo', 'Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setIsLoadingCombos(false);
    }
  };

  // Cập nhật data sector
  const updateSectorData = (data: Sector) => {
    setSectors(prevSectors => {
      const newSectors = [...prevSectors];
      const index = newSectors.findIndex(s => s.id === data.id);

      if (index !== -1) {
        console.log(`Cập nhật dữ liệu cho sector ${data.id} (${data.name}) đã có sẵn`);
        newSectors[index] = data;
      } else {
        console.log(`Thêm mới sector ${data.id} (${data.name}) vào danh sách`);
        newSectors.push(data);
      }

      return newSectors;
    });
  };

  // Tìm và cập nhật combo được chọn
  const findAndSetCombo = (sector: Sector, comboId: number) => {
    if (!sector.list_combos || sector.list_combos.length === 0) {
      console.warn(`Sector ${sector.id} không có danh sách combo hoặc danh sách rỗng`);
      return;
    }

    if (isNaN(comboId) || comboId <= 0) {
      console.error(`ID combo không hợp lệ: ${comboId}`);
      return;
    }

    const combo = sector.list_combos.find(c => c.id === comboId);
    if (combo) {
      setSelectedCombos(prevCombos => [...prevCombos, combo]);
      setInterestedComboId(combo.id);
      console.log(`Đã tìm thấy và chọn combo: ${combo.name} (ID: ${combo.id})`);
    } else {
      console.error(
        `Không tìm thấy combo ID ${comboId} trong sector ${sector.id} (${sector.name})`
      );
      console.log(
        `Danh sách ID của ${sector.list_combos.length} combo trong sector: ${sector.list_combos.map(c => c.id).join(', ')}`
      );
    }
  };

  // Fetch dữ liệu user và token khi component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setIsLoadingUser(true);
        // Lấy thông tin user từ AsyncStorage
        const userData = await AsyncStorage.getItem('@slm_user_data');
        const userName = await AsyncStorage.getItem('@slm_user_name');
        const userPhone = await AsyncStorage.getItem('@slm_login_phone');
        const userIdStr = await AsyncStorage.getItem('@slm_user_id');
        const token = await AsyncStorage.getItem('@slm_token');

        if (userIdStr) {
          const parsedId = parseInt(userIdStr);
          setUserId(parsedId);
          console.log(`Đã lấy ID người dùng: ${parsedId}`);
        }

        if (userData) {
          const user = JSON.parse(userData);
          setCurrentUser(user);
          if (user.id) setUserId(user.id);
          console.log('Đã lấy thông tin user từ @slm_user_data:', user);
        } else if (userIdStr && userName) {
          // Nếu không có dữ liệu đầy đủ, tạo đối tượng user từ các thông tin riêng lẻ
          const parsedId = parseInt(userIdStr);
          const user = {
            id: parsedId,
            name: userName,
            phone: userPhone || '',
          };
          setCurrentUser(user);
          console.log('Đã tạo thông tin user từ dữ liệu riêng lẻ:', user);
        } else {
          console.warn('Không tìm thấy thông tin user đã đăng nhập');
        }

        if (token) {
          setAuthToken(token);
          console.log('Đã lấy token xác thực');
        } else {
          console.warn('Không tìm thấy token xác thực');
          // Demo: Sử dụng token giả lập cho môi trường development
          const mockToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5IiwibmFtZSI6Ik5ndXnhu4VuIFRow6BuaCBUcsOhbmciLCJpYXQiOjE2OTgwMDAwMDB9.mocktoken';
          setAuthToken(mockToken);
          console.log('Đã sử dụng token giả lập cho phát triển');

          // Lưu token giả lập vào AsyncStorage để tránh lỗi lần sau
          await AsyncStorage.setItem('@slm_token', mockToken);
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin user/token:', error);
        // Demo: Tạo dữ liệu giả lập để test
        const mockToken =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5IiwibmFtZSI6Ik5ndXnhu4VuIFRow6BuaCBUcsOhbmciLCJpYXQiOjE2OTgwMDAwMDB9.mocktoken';
        setAuthToken(mockToken);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Thêm kiểm tra thông tin user mỗi khi component hiển thị
  useEffect(() => {
    const checkUserId = async () => {
      // Nếu chưa có userId, thử lấy lại từ AsyncStorage
      if (!userId) {
        try {
          const userIdStr = await AsyncStorage.getItem('@slm_user_id');
          if (userIdStr) {
            const parsedId = parseInt(userIdStr);
            setUserId(parsedId);
            console.log(`Đã cập nhật ID người dùng từ AsyncStorage: ${parsedId}`);

            // Cập nhật currentUser nếu cần
            if (!currentUser || !currentUser.id) {
              const userName = await AsyncStorage.getItem('@slm_user_name');
              if (userName) {
                setCurrentUser({
                  id: parsedId,
                  name: userName,
                });
                console.log(`Đã cập nhật thông tin user với ID: ${parsedId} và tên: ${userName}`);
              }
            }
          } else {
            console.warn('Không tìm thấy ID người dùng trong AsyncStorage');
          }
        } catch (error) {
          console.error('Lỗi khi kiểm tra ID người dùng:', error);
        }
      }
    };

    checkUserId();
  }, [userId, currentUser]);

  // Fetch dữ liệu tỉnh thành từ API khi component được mount
  useEffect(() => {
    fetchProvinces();
    fetchSectors();
  }, []);

  // Cập nhật districts khi chọn province
  useEffect(() => {
    if (selectedProvinceCode) {
      fetchDistricts(selectedProvinceCode);
    } else {
      setDistricts([]);
      setDistrict('');
    }
    // Reset district và ward selection khi province thay đổi
    setSelectedDistrictCode(null);
    setDistrict('');
    setWard('');
  }, [selectedProvinceCode]);

  // Cập nhật wards khi chọn district
  useEffect(() => {
    if (selectedDistrictCode) {
      fetchWards(selectedDistrictCode);
    } else {
      setWards([]);
      setWard('');
    }
  }, [selectedDistrictCode]);

  // Hàm fetch data tỉnh thành
  const fetchProvinces = async () => {
    try {
      console.log('Đang tải danh sách tỉnh thành...');
      const response = await fetch('https://provinces.open-api.vn/api/');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Đã tải ${data.length} tỉnh thành`);
      setProvinces(data);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu tỉnh thành:', error);
    }
  };

  // Hàm fetch data sectors/brands
  const fetchSectors = async () => {
    try {
      setIsLoadingSectors(true);
      setSectorsError(null);

      console.log('Đang tải danh sách brands/sectors...');
      const response = await fetch('https://api.slmglobal.vn/api/sector');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: Sector[] = await response.json();
      console.log(`Đã tải ${data.length} brands/sectors`);

      setSectors(data);

      // Transform data cho UI
      const formattedData = data.map((sector, index) => ({
        id: sector.id,
        name: sector.name,
        code: sector.code,
        logoUrl: sector.image,
        selected: index === 0, // Chọn mặc định item đầu tiên
      }));

      setProductLines(formattedData);

      // Cập nhật interested_in_combo_id nếu có dữ liệu
      if (formattedData.length > 0 && formattedData[0].id) {
        setInterestedComboId(formattedData[0].id);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu brands/sectors:', error);
      setSectorsError('Không thể tải danh sách sản phẩm');
    } finally {
      setIsLoadingSectors(false);
    }
  };

  // Hàm xử lý khi chọn brand
  const handleProductSelect = (id: number) => {
    setProductLines(
      productLines.map(product => ({
        ...product,
        selected: product.id === id,
      }))
    );

    // Cập nhật interested_in_combo_id
    setInterestedComboId(id);
    console.log(`Đã chọn sản phẩm: ${id} - Đang đặt interestedComboId = ${id}`);

    // Lấy danh sách combo của brand được chọn
    const selectedSector = sectors.find(sector => sector.id === id);
    if (selectedSector && selectedSector.list_combos) {
      setCombos(selectedSector.list_combos);
      setFilteredCombos(selectedSector.list_combos);
    } else {
      setCombos([]);
      setFilteredCombos([]);
    }

    // Reset selected combo
    setSelectedCombos([]);
  };

  // Hàm hiển thị modal chọn combo
  const handleShowComboModal = async () => {
    // Nếu chưa chọn brand hoặc brand không có combo, hiển thị thông báo
    const selectedProduct = productLines.find(product => product.selected);
    if (!selectedProduct) {
      Alert.alert('Thông báo', 'Vui lòng chọn sản phẩm trước khi xem chi tiết.');
      return;
    }

    const selectedSector = sectors.find(sector => sector.id === selectedProduct.id);
    if (!selectedSector || !selectedSector.list_combos || selectedSector.list_combos.length === 0) {
      Alert.alert('Thông báo', 'Sản phẩm này chưa có thông tin chi tiết.');
      return;
    }

    try {
      // Đánh dấu đang điều hướng sang màn hình chọn combo
      console.log('Đang chuẩn bị điều hướng đến màn hình chọn combo...');
      setIsNavigatingToCombo(true);

      // Lưu dữ liệu form hiện tại trước khi chuyển màn hình
      await saveFormData();
      console.log('Đã lưu dữ liệu form vào storage thành công');

      // Thay vì mở modal, chuyển hướng đến trang chọn combo
      router.push({
        pathname: '/(contacts)/select-combo',
        params: {
          sectorId: selectedProduct.id.toString(),
          selectedComboIds: selectedCombos.map(combo => combo.id).join(','),
        },
      });
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu form:', error);
      setIsNavigatingToCombo(false); // Reset trạng thái nếu có lỗi

      // Vẫn điều hướng đến trang chọn combo dù có lỗi khi lưu form
      router.push({
        pathname: '/(contacts)/select-combo',
        params: {
          sectorId: selectedProduct.id.toString(),
          selectedComboIds: selectedCombos.map(combo => combo.id).join(','),
        },
      });
    }
  };

  // Xóa một combo đã chọn
  const handleRemoveCombo = (comboId: number) => {
    setSelectedCombos(prevCombos => {
      const newCombos = prevCombos.filter(combo => combo.id !== comboId);

      // Cập nhật lại interestedComboId nếu cần
      if (interestedComboId === comboId && newCombos.length > 0) {
        setInterestedComboId(newCombos[0].id);
      } else if (newCombos.length === 0) {
        // Nếu không còn combo nào, đặt lại về ID của sector
        const selectedProduct = productLines.find(product => product.selected);
        if (selectedProduct) {
          setInterestedComboId(selectedProduct.id);
        }
      }

      return newCombos;
    });
  };

  // Render danh sách combo đã chọn
  const renderSelectedCombos = () => {
    if (!selectedCombos || selectedCombos.length === 0) return null;

    return (
      <View style={styles.selectedComboContainer}>
        <Text style={styles.selectedComboLabel}>Sản phẩm đã chọn ({selectedCombos.length}):</Text>

        {selectedCombos.map(combo => (
          <View key={combo.id} style={styles.horizontalCard}>
            <View style={styles.horizontalImageContainer}>
              {combo.image ? (
                <Image
                  source={{ uri: combo.image }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="cube-outline" size={30} color="#888" />
                </View>
              )}
            </View>
            <View style={styles.horizontalContentContainer}>
              <Text style={styles.productName} numberOfLines={2}>
                {combo.name}
              </Text>

              <View style={styles.productDetails}>
                {combo.output_min && combo.output_max ? (
                  <Text style={styles.productDetail}>
                    Sản lượng điện: {combo.output_min}-{combo.output_max} kWh/tháng
                  </Text>
                ) : combo.description ? (
                  <Text style={styles.productDetail}>{combo.description}</Text>
                ) : (
                  <Text style={styles.productDetail}>Sản lượng điện: N/A</Text>
                )}
              </View>

              {combo.price && (
                <View style={styles.priceContainer}>
                  <Text style={styles.productPrice}>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                      maximumFractionDigits: 0,
                    }).format(combo.price)}
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              style={styles.removeComboButton}
              onPress={() => handleRemoveCombo(combo.id)}
            >
              <Ionicons name="close-circle" size={24} color="#EE0033" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  // Hàm fetch data quận huyện theo tỉnh/thành
  const fetchDistricts = async (provinceCode: number) => {
    try {
      console.log(`Đang tải quận/huyện cho tỉnh có mã: ${provinceCode}`);
      const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Dữ liệu tỉnh/thành nhận được:', data);

      if (data && data.districts && Array.isArray(data.districts)) {
        console.log(`Đã tải ${data.districts.length} quận/huyện`);
        setDistricts(data.districts);
      } else {
        console.warn('Không tìm thấy dữ liệu quận/huyện hoặc định dạng không đúng:', data);
        setDistricts([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu quận huyện:', error);
      setDistricts([]);
    }
  };

  // Hàm fetch data phường xã theo quận/huyện
  const fetchWards = async (districtCode: number) => {
    try {
      console.log(`Đang tải phường/xã cho quận/huyện có mã: ${districtCode}`);
      const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Dữ liệu quận/huyện nhận được:', data);

      if (data && data.wards && Array.isArray(data.wards)) {
        console.log(`Đã tải ${data.wards.length} phường/xã`);
        setWards(data.wards);
      } else {
        console.warn('Không tìm thấy dữ liệu phường/xã hoặc định dạng không đúng:', data);
        setWards([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu phường xã:', error);
      setWards([]);
    }
  };

  // Hàm kiểm tra số điện thoại đã tồn tại
  const checkPhoneExists = async (phone: string) => {
    try {
      setPhoneError('');

      // Validate phone format first
      try {
        phoneSchema.parse(phone);
      } catch (error) {
        if (error instanceof z.ZodError) {
          setPhoneError(error.errors[0].message);
        } else {
          setPhoneError('Số điện thoại không hợp lệ');
        }
        return true; // Return true to indicate there's an error
      }

      setIsCheckingPhone(true);
      console.log(`Đang kiểm tra số điện thoại: ${phone}`);

      // Kiểm tra token
      if (!authToken) {
        console.warn('Không có token xác thực cho API checkPhoneExists');
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };

      // Thêm token nếu có
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      const response = await fetch(
        `https://api.slmglobal.vn/api/mini_admins/potential-customer/check-exist-by-phone/${phone}`,
        {
          headers,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Kết quả kiểm tra số điện thoại:', data);

      if (data && data.exist === true) {
        setPhoneError('Số điện thoại đã tồn tại trong hệ thống');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Lỗi khi kiểm tra số điện thoại:', error);
      setPhoneError('Không thể kiểm tra số điện thoại, vui lòng thử lại sau');
      return true;
    } finally {
      setIsCheckingPhone(false);
    }
  };

  // Hàm debounce cho kiểm tra số điện thoại
  const debouncedCheckPhone = useCallback(
    (phoneNumber: string) => {
      if (phoneTimeout) {
        clearTimeout(phoneTimeout);
      }

      // Reset error
      setPhoneError('');

      // Validate phone number format first using Zod
      try {
        phoneSchema.parse(phoneNumber);

        if (phoneNumber.length >= 10) {
          setIsCheckingPhone(true);
          const timeoutId = setTimeout(() => {
            checkPhoneExists(phoneNumber);
          }, 500); // Đợi 500ms sau khi người dùng ngừng gõ
          setPhoneTimeout(timeoutId);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          // Lấy thông báo lỗi từ Zod
          setPhoneError(error.errors[0].message);
        } else {
          setPhoneError('Số điện thoại không hợp lệ');
        }
        setIsCheckingPhone(false);
      }
    },
    [phoneTimeout]
  );

  // Hàm validate email
  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError('');
      return true; // Email là trường không bắt buộc
    }

    try {
      emailSchema.parse(email);
      setEmailError('');
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0].message);
      } else {
        setEmailError('Email không hợp lệ');
      }
      return false;
    }
  };

  // Hàm validate form trước khi submit
  const validateForm = async () => {
    let isValid = true;

    // Kiểm tra số điện thoại
    if (!phoneNumber) {
      setPhoneError('Vui lòng nhập số điện thoại');
      isValid = false;
    } else {
      try {
        phoneSchema.parse(phoneNumber);
        // Kiểm tra số điện thoại đã tồn tại
        if (phoneError) {
          isValid = false;
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          setPhoneError(error.errors[0].message);
        } else {
          setPhoneError('Số điện thoại không hợp lệ');
        }
        isValid = false;
      }
    }

    // Kiểm tra email
    if (email) {
      const isEmailValid = validateEmail(email);
      if (!isEmailValid) {
        isValid = false;
      }
    }

    // Kiểm tra các trường khác
    if (!fullName) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ và tên');
      isValid = false;
    }

    // Kiểm tra sản phẩm quan tâm
    const hasCombos = selectedCombos.length > 0;
    if (!hasCombos) {
      // Tìm xem có combo nào trong sectors không
      const anyCombos = sectors.some(sector => {
        return sector.list_combos && sector.list_combos.length > 0;
      });
      if (anyCombos) {
        // Chỉ cảnh báo, không chặn gửi form
        console.warn('Chưa chọn sản phẩm quan tâm!');

        // Nếu muốn bắt buộc phải chọn combo, hãy bỏ comment dòng dưới
        // Alert.alert('Lưu ý', 'Vui lòng chọn sản phẩm quan tâm');
        // isValid = false;
      } else {
        console.warn('Không có danh sách sản phẩm nào trong hệ thống');
      }
    }

    return isValid;
  };

  // Hàm chuẩn bị dữ liệu trước khi gửi
  const prepareSubmitData = (): PotentialCustomerData => {
    // Mặc định gender = true cho nam, false cho nữ
    const genderValue = gender === 'Nam' ? true : false;

    // Sử dụng occupation dưới dạng string thay vì convert sang số
    let descriptionValue = occupation || '';

    // Ưu tiên sử dụng userId từ state độc lập
    const agentId = userId || currentUser?.id || null;

    // Xử lý ID của combo đã chọn
    let comboId: number | null = null;

    // Ưu tiên 1: Sử dụng combo đã chọn từ selectedCombos (chắc chắn tồn tại)
    if (selectedCombos.length > 0) {
      comboId = selectedCombos[0].id;
      console.log(`Sử dụng combo đã chọn: ID=${comboId}, Name=${selectedCombos[0].name}`);
    }
    // Ưu tiên 2: Sử dụng interestedComboId nếu có và kiểm tra tồn tại
    else if (interestedComboId && interestedComboId > 0) {
      // Kiểm tra xem combo có tồn tại trong danh sách sectors không
      const comboExists = sectors.some(sector =>
        sector.list_combos?.some(combo => combo.id === interestedComboId)
      );

      if (comboExists) {
        comboId = interestedComboId;
        console.log(`Sử dụng interestedComboId đã xác minh: ${comboId}`);
      } else {
        console.warn(
          `interestedComboId=${interestedComboId} không tồn tại trong sectors, tìm combo khác`
        );
      }
    }

    // Ưu tiên 3: Nếu chưa có, tìm combo đầu tiên có sẵn trong sectors
    if (comboId === null) {
      // Tìm combo ID hợp lệ từ sector đã chọn trước
      const selectedSector = productLines.find(p => p.selected);
      if (selectedSector) {
        const sectorWithCombos = sectors.find(s => s.id === selectedSector.id);
        // Sử dụng optional chaining cho list_combos?.length
        if (sectorWithCombos?.list_combos && sectorWithCombos.list_combos.length > 0) {
          comboId = sectorWithCombos.list_combos[0].id;
          console.log(`Sử dụng combo từ sector được chọn: ID=${comboId}`);
        }
      }

      // Nếu vẫn chưa có, tìm combo đầu tiên từ bất kỳ sector nào
      if (comboId === null) {
        for (const sector of sectors) {
          // Sử dụng optional chaining và kiểm tra độ dài
          if (sector.list_combos && sector.list_combos.length > 0) {
            comboId = sector.list_combos[0].id;
            console.log(`Sử dụng combo đầu tiên tìm thấy: ID=${comboId} từ sector ${sector.name}`);
            break;
          }
        }
      }
    }

    // Kiểm tra cuối cùng và cảnh báo nếu không tìm thấy combo nào
    if (comboId === null) {
      console.warn('Không tìm thấy combo nào, đây có thể gây lỗi foreign key!');
      // Không tự tạo ID nữa, mà để API server xử lý, hoặc gửi null
      comboId = null;
    }

    // Log để debug
    console.log(
      `prepareSubmitData - comboId: ${comboId}, interestedComboId: ${interestedComboId}, selectedCombos: ${selectedCombos.length > 0 ? selectedCombos[0].id : 'none'}`
    );

    // Đảm bảo luôn có agent_id hợp lệ
    if (!agentId) {
      console.error('Không thể xác định ID người dùng đang đăng nhập');
      // Tạo giá trị mặc định cho trường hợp khẩn cấp (khuyến cáo: chỉ sử dụng cho môi trường phát triển)
      const defaultAgentId = 9; // ID mặc định cho development
      console.warn(`Sử dụng ID mặc định: ${defaultAgentId} cho agent_id`);
      return {
        agent_id: defaultAgentId,
        assumed_code: assumedCode || 'string',
        name: fullName,
        phone: phoneNumber,
        gender: genderValue,
        email: email || '',
        address: address || '',
        province: province || '',
        district: district || '',
        ward: ward || '',
        interested_in_combo_id: comboId, // Có thể null
        description: descriptionValue,
      };
    }

    console.log(
      `Đang gửi form với agent_id = ${agentId} từ user: ${currentUser?.name || 'không xác định'}`
    );
    console.log(`Sản phẩm quan tâm (interested_in_combo_id): ${comboId}`);

    return {
      agent_id: agentId,
      assumed_code: assumedCode || 'string',
      name: fullName,
      phone: phoneNumber,
      gender: genderValue,
      email: email || '',
      address: address || '',
      province: province || '',
      district: district || '',
      ward: ward || '',
      interested_in_combo_id: comboId, // Có thể null
      description: descriptionValue,
    };
  };

  // Hàm xử lý khi submit form
  const handleSubmit = async () => {
    // Reset validation errors first
    setPhoneError('');
    setEmailError('');

    // Kiểm tra token
    if (!authToken) {
      Alert.alert('Lỗi xác thực', 'Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.', [
        {
          text: 'Đăng nhập',
          onPress: () => {
            // Xóa dữ liệu user/token cũ
            AsyncStorage.multiRemove([
              '@slm_user_data',
              '@slm_user_name',
              '@slm_login_phone',
              '@slm_user_id',
              '@slm_token',
            ]);
            // Điều hướng đến màn hình đăng nhập
            router.replace('/(auth)/login');
          },
        },
      ]);
      return;
    }

    setIsSubmitting(true);

    try {
      const isValid = await validateForm();

      if (isValid) {
        // Log dữ liệu quan trọng trước khi chuẩn bị dữ liệu
        console.log(`[SUBMIT] interestedComboId = ${interestedComboId}`);
        console.log(
          `[SUBMIT] selectedCombos = ${JSON.stringify(selectedCombos.map(c => ({ id: c.id, name: c.name })))}`
        );

        // Chuẩn bị dữ liệu
        const customerData = prepareSubmitData();

        // Kiểm tra cuối cùng cho interested_in_combo_id
        if (
          customerData.interested_in_combo_id === null ||
          customerData.interested_in_combo_id === undefined
        ) {
          console.warn('Không có combo ID hợp lệ, tìm một ID tồn tại để gửi lên server');

          // Thử tìm một combo ID từ bất kỳ sector nào
          let foundValidComboId = null;

          // Tìm combo từ sectors đã load
          for (const sector of sectors) {
            if (sector.list_combos && sector.list_combos.length > 0) {
              foundValidComboId = sector.list_combos[0].id;
              console.log(
                `Đã tìm thấy combo ID hợp lệ từ sector ${sector.name}: ${foundValidComboId}`
              );
              break;
            }
          }

          // Nếu vẫn không tìm được, sử dụng ID mặc định
          if (foundValidComboId === null) {
            foundValidComboId = 1; // ID mặc định, hy vọng tồn tại trên server
            console.warn(`Không tìm thấy combo nào, sử dụng ID mặc định = ${foundValidComboId}`);
          }

          // Cập nhật data gửi đi
          customerData.interested_in_combo_id = foundValidComboId;
        }

        console.log('Dữ liệu gửi đi:', customerData);
        // Log JSON body được gửi đi
        console.log('JSON BODY:', JSON.stringify(customerData, null, 2));

        // Gửi dữ liệu lên server với URL đầy đủ
        const apiUrl = 'https://api.slmglobal.vn/api/agents/create-new-potential-customer';
        console.log('Gửi request đến:', apiUrl);

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(customerData),
        });

        if (!response.ok) {
          let errorMessage = '';
          let errorDetails = '';

          try {
            const errorData = await response.json();
            console.error('API response error data:', errorData);

            // Lấy thông báo lỗi chi tiết
            errorMessage = errorData.message || 'Lỗi từ máy chủ';

            // Xử lý các lỗi cụ thể
            if (errorData.errors) {
              // Nếu server trả về mảng lỗi chi tiết
              if (Array.isArray(errorData.errors)) {
                errorDetails = errorData.errors.join(', ');
              }
              // Nếu server trả về object chứa các trường lỗi
              else if (typeof errorData.errors === 'object') {
                errorDetails = Object.entries(errorData.errors)
                  .map(([field, msgs]) => {
                    // Xử lý lỗi interested_in_combo_id một cách rõ ràng
                    if (field === 'interested_in_combo_id') {
                      return `Lỗi sản phẩm: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`;
                    }
                    return `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`;
                  })
                  .join('\n');
              }
            }

            // Kiểm tra lỗi token hết hạn
            if (
              errorData.status === 401 ||
              errorData.statusCode === 401 ||
              errorMessage.includes('token')
            ) {
              throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            }
          } catch (e) {
            // Nếu không thể parse JSON, thử lấy response text
            try {
              const errorText = await response.text();
              console.error('API response error text:', response.status, errorText);

              // Kiểm tra lỗi token từ status code
              if (response.status === 401) {
                throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
              }

              errorMessage = `Lỗi HTTP: ${response.status}`;
              if (errorText) {
                errorDetails = errorText.substring(0, 300); // Giới hạn độ dài
              }
            } catch (textError) {
              errorMessage = `Lỗi không xác định: ${response.status}`;
            }
          }

          // Tạo thông báo lỗi hoàn chỉnh
          let fullErrorMessage = errorMessage;
          if (errorDetails) {
            fullErrorMessage += `\n\nChi tiết lỗi: ${errorDetails}`;
          }

          throw new Error(fullErrorMessage);
        }

        const result = await response.json();
        console.log('Kết quả từ server:', result);

        Alert.alert('Thành công', 'Đã gửi thông tin khách hàng thành công', [
          {
            text: 'OK',
            onPress: () => {
              // Điều hướng về màn hình danh sách với tham số để biết cần refresh
              router.navigate({
                pathname: '/(tabs)/account',
                params: { refresh: 'true', timestamp: new Date().getTime() },
              });
            },
          },
        ]);
      }
    } catch (error) {
      console.error('Lỗi khi gửi form:', error);
      let errorMessage = 'Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại sau.';

      // Kiểm tra chi tiết lỗi để hiển thị thông báo phù hợp
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.';
      } else if (error instanceof Error) {
        errorMessage = error.message;

        // Kiểm tra nếu lỗi liên quan đến token
        if (
          errorMessage.includes('đăng nhập') ||
          errorMessage.includes('xác thực') ||
          errorMessage.includes('token')
        ) {
          Alert.alert('Lỗi xác thực', errorMessage, [
            {
              text: 'Đăng nhập lại',
              onPress: () => {
                // Xóa dữ liệu user/token cũ
                AsyncStorage.multiRemove([
                  '@slm_user_data',
                  '@slm_user_name',
                  '@slm_login_phone',
                  '@slm_user_id',
                  '@slm_token',
                ]);
                // Điều hướng đến màn hình đăng nhập
                router.replace('/(auth)/login');
              },
            },
          ]);
          return;
        }
      }

      Alert.alert('Lỗi', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hàm mở modal chọn
  const openModal = (type: 'province' | 'district' | 'ward' | 'gender') => {
    setModalType(type);
    setModalVisible(true);
  };

  // Hàm xử lý khi chọn một item
  const handleSelectItem = (item: Province | District | Ward | string) => {
    if (modalType === 'province') {
      setProvince((item as Province).name);
      setSelectedProvinceCode((item as Province).code);
      console.log(`Đã chọn tỉnh/thành: ${(item as Province).name}, mã: ${(item as Province).code}`);
    } else if (modalType === 'district') {
      setDistrict((item as District).name);
      setSelectedDistrictCode((item as District).code);
      console.log(`Đã chọn quận/huyện: ${(item as District).name}, mã: ${(item as District).code}`);
    } else if (modalType === 'ward') {
      setWard((item as Ward).name);
      console.log(`Đã chọn phường/xã: ${(item as Ward).name}`);
    } else if (modalType === 'gender') {
      setGender(item as string);
      console.log(`Đã chọn giới tính: ${item}`);
    }
    setModalVisible(false);
  };

  // Danh sách giới tính
  const genderOptions = ['Nam', 'Nữ'];

  // Component renderItem cho FlatList trong Modal
  const renderLocationItem = ({ item }: { item: Province | District | Ward | string }) => (
    <TouchableOpacity style={styles.modalItem} onPress={() => handleSelectItem(item)}>
      <Text style={styles.modalItemText}>
        {modalType === 'gender' ? (item as string) : (item as any).name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#fff' }]}>
      {isLoadingUser && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#EE0033" />
          <Text style={styles.loadingText}>Đang tải thông tin người dùng...</Text>
        </View>
      )}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/account')} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Nhập thông tin khách hàng</Text>
        <TouchableOpacity>
          <Ionicons name="help-circle-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.formContainer} contentContainerStyle={{ paddingTop: 0 }}>
        <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            placeholder="Họ và tên *"
            style={styles.input}
            placeholderTextColor="#666"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            placeholder="Số điện thoại *"
            style={styles.input}
            keyboardType="phone-pad"
            placeholderTextColor="#666"
            value={phoneNumber}
            onChangeText={text => {
              // Chỉ cho phép nhập số và dấu +
              const cleaned = text.replace(/[^0-9+]/g, '');
              setPhoneNumber(cleaned);
              debouncedCheckPhone(cleaned);
            }}
          />
          {isCheckingPhone && (
            <ActivityIndicator size="small" color="#EE0033" style={styles.inputSpinner} />
          )}
        </View>
        {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

        <TouchableOpacity style={styles.inputContainer} onPress={() => openModal('gender')}>
          <Ionicons name="male-female" size={20} color="#666" style={styles.inputIcon} />
          <Text style={[styles.input, !gender && styles.placeholder]}>{gender || 'Giới tính'}</Text>
          <Ionicons name="chevron-down" size={20} color="#666" style={styles.dropdownIcon} />
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            placeholder="Email"
            style={styles.input}
            keyboardType="email-address"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            onBlur={() => validateEmail(email)}
          />
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            placeholder="Số Nhà, Tên Đường"
            style={styles.input}
            placeholderTextColor="#666"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        <View style={styles.addressRow}>
          <TouchableOpacity
            style={[styles.inputContainer, styles.halfInput]}
            onPress={() => openModal('province')}
          >
            <Text style={[styles.input, !province && styles.placeholder]}>
              {province || 'Tỉnh/TP'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" style={styles.dropdownIcon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.inputContainer, styles.halfInput]}
            onPress={() => (selectedProvinceCode ? openModal('district') : null)}
            disabled={!selectedProvinceCode}
          >
            <Text style={[styles.input, !district && styles.placeholder]}>
              {district || 'Quận, Huyện'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" style={styles.dropdownIcon} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => (selectedDistrictCode ? openModal('ward') : null)}
          disabled={!selectedDistrictCode}
        >
          <Text style={[styles.input, !ward && styles.placeholder]}>{ward || 'Phường, Xã'}</Text>
          <Ionicons name="chevron-down" size={20} color="#666" style={styles.dropdownIcon} />
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Ionicons name="briefcase-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            placeholder="Nghề nghiệp (mã số)"
            style={styles.input}
            placeholderTextColor="#666"
            value={occupation}
            onChangeText={setOccupation}
            keyboardType="number-pad"
          />
        </View>

        <Text style={[styles.sectionTitle, styles.productTitle]}>Sản phẩm quan tâm</Text>

        {isLoadingSectors ? (
          <View style={styles.loadingProductContainer}>
            <ActivityIndicator size="small" color="#EE0033" />
            <Text style={styles.loadingText}>Đang tải dữ liệu sản phẩm...</Text>
          </View>
        ) : sectorsError ? (
          <View style={styles.errorProductContainer}>
            <Text style={styles.errorText}>{sectorsError}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchSectors}>
              <Text style={styles.retryText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.productLinesContainer}>
              {productLines.map(product => (
                <TouchableOpacity
                  key={product.id}
                  style={[
                    styles.productCard,
                    { backgroundColor: product.code === 'SLM' ? '#4CAF50' : '#FFD700' },
                    product.selected && {
                      borderColor: product.code === 'SLM' ? '#12B669' : '#FFB800',
                      borderWidth: 2,
                    },
                  ]}
                  onPress={() => handleProductSelect(product.id)}
                >
                  <View style={styles.productCardContent}>
                    <Image
                      source={{ uri: product.logoUrl }}
                      style={styles.productLogo}
                      resizeMode="contain"
                    />
                  </View>

                  {product.selected && (
                    <View style={styles.checkContainer}>
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Nút thêm sản phẩm */}
            <TouchableOpacity style={styles.addProductButton} onPress={handleShowComboModal}>
              <Ionicons
                name="add-circle-outline"
                size={20}
                color="#EE0033"
                style={styles.addProductIcon}
              />
              <Text style={styles.addProductText}>
                {selectedCombos.length > 0 ? 'Sửa sản phẩm đã chọn' : 'Thêm sản phẩm'}
              </Text>
            </TouchableOpacity>

            {/* Hiển thị danh sách các combo đã chọn */}
            {renderSelectedCombos()}
          </>
        )}

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Tôi xác nhận thông tin đã cung cấp là chính xác và phù hợp với yêu cầu của SLM Agent
            App, đồng thời Xác nhận rằng Tôi đã Đọc và Chấp thuận các{' '}
            <Text style={styles.link}>Điều khoản & Điều kiện</Text> của ứng dụng trước khi tiến hành
            gửi.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={isSubmitting}
          >
            <Text style={styles.cancelButtonText}>Hủy bỏ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Đang gửi...' : 'Gửi thông tin'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal chọn */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalType === 'province'
                  ? 'Chọn Tỉnh/Thành phố'
                  : modalType === 'district'
                    ? 'Chọn Quận/Huyện'
                    : modalType === 'ward'
                      ? 'Chọn Phường/Xã'
                      : 'Chọn Giới tính'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={
                modalType === 'province'
                  ? provinces
                  : modalType === 'district'
                    ? districts
                    : modalType === 'ward'
                      ? wards
                      : genderOptions
              }
              renderItem={renderLocationItem}
              keyExtractor={(item, index) =>
                typeof item === 'string' ? `gender-${index}` : item.code.toString()
              }
              contentContainerStyle={styles.modalList}
            />
          </View>
        </View>
      </Modal>

      {/* Modal chọn combo */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showComboModal}
        onRequestClose={() => setShowComboModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn Sản Phẩm</Text>
              <TouchableOpacity onPress={() => setShowComboModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {isLoadingCombos ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#EE0033" />
                <Text style={styles.loadingText}>Đang tải danh sách sản phẩm...</Text>
              </View>
            ) : comboError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{comboError}</Text>
              </View>
            ) : filteredCombos.length === 0 ? (
              <View style={styles.noProductsContainer}>
                <Text style={styles.noProductsText}>Không có sản phẩm nào thuộc dòng này.</Text>
              </View>
            ) : (
              <FlatList
                data={filteredCombos}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.horizontalCard,
                      selectedCombos.some(combo => combo.id === item.id) &&
                        styles.comboCardSelected,
                    ]}
                    onPress={() =>
                      findAndSetCombo(
                        sectors.find(sector => sector.id === selectedCombos[0].id) || sectors[0],
                        item.id
                      )
                    }
                  >
                    <View style={styles.horizontalImageContainer}>
                      {item.image ? (
                        <Image
                          source={{ uri: item.image }}
                          style={styles.productImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.imagePlaceholder}>
                          <Ionicons name="cube-outline" size={30} color="#888" />
                        </View>
                      )}
                    </View>
                    <View style={styles.horizontalContentContainer}>
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
                        {item.payback_period ? (
                          <Text style={styles.productDetail}>
                            Thời gian hoàn vốn: {Math.floor(item.payback_period)} năm{' '}
                            {Math.round((item.payback_period % 1) * 12)} tháng
                          </Text>
                        ) : null}
                      </View>

                      {item.price && (
                        <View style={styles.priceContainer}>
                          <Text style={styles.productPrice}>
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(item.price)}
                          </Text>
                        </View>
                      )}
                    </View>
                    {selectedCombos.some(combo => combo.id === item.id) && (
                      <View style={styles.selectedComboIndicator}>
                        <Ionicons name="checkmark-circle" size={24} color="#12B669" />
                      </View>
                    )}
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.comboList}
              />
            )}

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalSelectButton}
                onPress={() => setShowComboModal(false)}
              >
                <Text style={styles.modalSelectButtonText}>Chọn</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  formContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 0,
    marginBottom: 10,
  },
  productTitle: {
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    padding: 0,
  },
  placeholder: {
    color: '#666',
  },
  dropdownIcon: {
    marginLeft: 10,
  },
  addressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  disclaimer: {
    marginTop: 15,
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  link: {
    color: '#007AFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#EE0033',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ffb3b3',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 15,
    fontWeight: '600',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  errorText: {
    color: '#EE0033',
    fontSize: 13,
    marginTop: -5,
    marginBottom: 10,
    marginLeft: 5,
  },
  inputSpinner: {
    marginLeft: 5,
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  agentInfoContainer: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  agentInfoText: {
    fontSize: 14,
    color: '#666',
  },
  agentInfoValue: {
    fontWeight: '600',
    color: '#333',
  },
  // Styles cho Modal
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingBottom: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalList: {
    paddingHorizontal: 15,
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  loadingProductContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  errorProductContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  retryButton: {
    padding: 10,
  },
  retryText: {
    color: '#EE0033',
    fontSize: 15,
    fontWeight: '600',
  },
  productLinesContainer: {
    padding: 10,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 0,
    paddingVertical: 16,
  },
  productCard: {
    flex: 1,
    borderWidth: 1,
    height: 48,
    borderRadius: 8,
    position: 'relative',
    borderColor: '#DCDCE6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productCardContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productLogo: {
    height: 32,
    width: '100%',
    alignSelf: 'center',
  },
  checkContainer: {
    position: 'absolute',
    width: 24,
    height: 24,
    top: 4,
    right: 8,
    backgroundColor: '#12B669',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  addProductButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#EE0033',
    borderRadius: 8,
  },
  addProductIcon: {
    marginRight: 10,
  },
  addProductText: {
    color: '#EE0033',
    fontSize: 15,
    fontWeight: '600',
  },
  selectedComboContainer: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EE0033',
    borderRadius: 8,
  },
  selectedComboLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  selectedComboCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedComboContent: {
    flex: 1,
  },
  selectedComboName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  selectedComboDescription: {
    fontSize: 13,
    color: '#666',
  },
  selectedComboPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  selectedComboIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  removeComboButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noProductsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noProductsText: {
    color: '#666',
    fontSize: 15,
  },
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    position: 'relative',
    padding: 8,
  },
  comboCardSelected: {
    borderColor: '#12B669',
    borderWidth: 1,
  },
  horizontalImageContainer: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    overflow: 'hidden',
    marginRight: 10,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalContentContainer: {
    flex: 1,
    padding: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#27273E',
    marginBottom: 6,
    minHeight: 36,
    lineHeight: 18,
  },
  productDetails: {
    gap: 2,
    marginBottom: 6,
  },
  productDetail: {
    fontSize: 12,
    color: '#7B7D9D',
    lineHeight: 16,
  },
  priceContainer: {
    marginTop: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ED1C24',
    lineHeight: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  modalSelectButton: {
    backgroundColor: '#EE0033',
    padding: 10,
    borderRadius: 8,
  },
  modalSelectButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  comboList: {
    padding: 10,
  },
});
