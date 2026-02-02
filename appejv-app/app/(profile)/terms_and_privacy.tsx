import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TermsAndPrivacyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Điều khoản và Chính sách</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.paragraphContainer}>
            <Text style={styles.paragraph}>
              Khi truy cập và sử dụng ứng dụng SLM Solar, bạn đồng ý tuân thủ các điều khoản và điều
              kiện sau đây. Vui lòng đọc kỹ trước khi sử dụng ứng dụng.
            </Text>

            <Text style={styles.subTitle}>1. Điều kiện sử dụng</Text>
            <Text style={styles.paragraph}>
              Bằng việc sử dụng ứng dụng SLM Solar, bạn xác nhận rằng bạn đã đủ 18 tuổi hoặc đã đạt
              độ tuổi trưởng thành theo quy định pháp luật tại quốc gia bạn sinh sống. Nếu bạn chưa
              đủ tuổi, bạn phải có sự đồng ý của cha mẹ hoặc người giám hộ hợp pháp.
            </Text>

            <Text style={styles.subTitle}>2. Tài khoản người dùng</Text>
            <Text style={styles.paragraph}>
              Để sử dụng đầy đủ các tính năng của ứng dụng, bạn cần tạo tài khoản với thông tin
              chính xác và cập nhật. Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt
              động diễn ra trong tài khoản của mình. Chúng tôi có quyền từ chối dịch vụ, xóa tài
              khoản hoặc nội dung nếu phát hiện vi phạm điều khoản sử dụng.
            </Text>

            <Text style={styles.subTitle}>3. Quyền sở hữu trí tuệ</Text>
            <Text style={styles.paragraph}>
              Tất cả nội dung trên ứng dụng SLM Solar bao gồm văn bản, hình ảnh, logo, biểu tượng,
              phần mềm và thiết kế là tài sản của công ty chúng tôi và được bảo vệ bởi luật sở hữu
              trí tuệ hiện hành. Bạn không được phép sao chép, phân phối, sửa đổi hoặc tạo các sản
              phẩm phái sinh mà không có sự cho phép bằng văn bản.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chính sách bảo mật</Text>

          <View style={styles.paragraphContainer}>
            <Text style={styles.paragraph}>
              Bảo vệ dữ liệu cá nhân của bạn là ưu tiên hàng đầu của chúng tôi. Chính sách này mô tả
              cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.
            </Text>

            <Text style={styles.subTitle}>1. Thông tin chúng tôi thu thập</Text>
            <Text style={styles.paragraph}>
              - Thông tin cá nhân: tên, số điện thoại, địa chỉ email, địa chỉ liên hệ
              {'\n'}- Thông tin thiết bị: loại thiết bị, phiên bản hệ điều hành, định danh thiết bị
              {'\n'}- Dữ liệu sử dụng: thời gian truy cập, tính năng sử dụng, hiệu suất ứng dụng
              {'\n'}- Metadata: dữ liệu được tạo ra trong quá trình giao tiếp, như địa chỉ IP, nhận
              dạng trình duyệt và chi tiết thiết bị
              {'\n'}- Dữ liệu nội dung: thông tin bạn cung cấp khi sử dụng dịch vụ của chúng tôi
              (văn bản, hình ảnh, biểu mẫu)
            </Text>

            <Text style={styles.subTitle}>2. Mục đích sử dụng thông tin</Text>
            <Text style={styles.paragraph}>
              - Cung cấp, duy trì và cải thiện dịch vụ
              {'\n'}- Thông báo về thay đổi hoặc cập nhật dịch vụ
              {'\n'}- Hỗ trợ kỹ thuật và chăm sóc khách hàng
              {'\n'}- Phân tích dữ liệu để tối ưu hóa trải nghiệm người dùng
              {'\n'}- Xử lý yêu cầu liên hệ và giao tiếp với bạn
              {'\n'}- Cung cấp thông tin về sản phẩm và dịch vụ mà chúng tôi nghĩ sẽ phù hợp với bạn
              {'\n'}- Đo lường hiệu quả của các hoạt động tiếp thị
            </Text>

            <Text style={styles.subTitle}>3. Bảo mật thông tin</Text>
            <Text style={styles.paragraph}>
              Chúng tôi áp dụng các biện pháp an ninh nghiêm ngặt để bảo vệ thông tin của bạn khỏi
              truy cập trái phép, thay đổi, tiết lộ hoặc phá hủy. Thông tin nhạy cảm được mã hóa
              trong quá trình truyền tải và lưu trữ. Chúng tôi sử dụng SSL (Secure Sockets Layer) để
              mã hóa dữ liệu giữa thiết bị của bạn và máy chủ của chúng tôi.
            </Text>

            <Text style={styles.subTitle}>4. Chia sẻ thông tin</Text>
            <Text style={styles.paragraph}>
              Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ
              ba. Thông tin có thể được chia sẻ với các đối tác đáng tin cậy giúp chúng tôi vận hành
              ứng dụng hoặc phục vụ bạn, với điều kiện các bên này đồng ý bảo mật thông tin.
            </Text>

            <Text style={styles.subTitle}>5. Cookies và công nghệ tương tự</Text>
            <Text style={styles.paragraph}>
              Chúng tôi sử dụng cookies và các công nghệ tương tự như web beacons và pixel tags để
              cải thiện trải nghiệm của bạn, hiểu cách bạn sử dụng ứng dụng và cung cấp nội dung phù
              hợp. Bạn có thể cài đặt trình duyệt để từ chối cookies, tuy nhiên điều này có thể ảnh
              hưởng đến chức năng của ứng dụng.
            </Text>

            <Text style={styles.subTitle}>6. Thời gian lưu trữ thông tin</Text>
            <Text style={styles.paragraph}>
              Chúng tôi lưu trữ thông tin cá nhân của bạn trong thời gian cần thiết để thực hiện các
              mục đích được nêu trong chính sách này, trừ khi pháp luật yêu cầu hoặc cho phép thời
              gian lưu trữ lâu hơn.
            </Text>

            <Text style={styles.subTitle}>7. Quyền của bạn</Text>
            <Text style={styles.paragraph}>
              Bạn có quyền yêu cầu truy cập, sửa đổi, xóa thông tin cá nhân mà chúng tôi lưu giữ về
              bạn. Bạn cũng có thể phản đối hoặc hạn chế việc xử lý dữ liệu cá nhân của mình trong
              một số trường hợp. Để thực hiện các quyền này, vui lòng liên hệ với chúng tôi theo
              thông tin bên dưới.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Liên hệ</Text>

          <View style={styles.paragraphContainer}>
            <Text style={styles.paragraph}>
              Nếu bạn có bất kỳ câu hỏi nào về Điều khoản sử dụng hoặc Chính sách bảo mật, vui lòng
              liên hệ với chúng tôi:
            </Text>

            <View style={styles.contactItem}>
              <Ionicons name="business-outline" size={20} color="#ED1C24" />
              <Text style={styles.contactText}>Công ty cổ phần đầu tư SLM</Text>
            </View>

            <View style={styles.contactItem}>
              <Ionicons name="location-outline" size={20} color="#ED1C24" />
              <Text style={styles.contactText}>
                Tầng 5, toà nhà Diamond Flower Tower, Hoàng Đạo Thuý, Thanh Xuân, Hà Nội
              </Text>
            </View>

            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={20} color="#ED1C24" />
              <Text style={styles.contactText}>0977879291</Text>
            </View>

            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={20} color="#ED1C24" />
              <Text style={styles.contactText}>sale@slmsolar.com</Text>
            </View>

            <View style={styles.contactItem}>
              <Ionicons name="globe-outline" size={20} color="#ED1C24" />
              <Text style={styles.contactText}>www.slmsolar.com</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#ED1C24',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27273E',
    marginBottom: 16,
  },
  paragraphContainer: {
    backgroundColor: '#F5F5F8',
    borderRadius: 8,
    padding: 16,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27273E',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    color: '#4E4B66',
    lineHeight: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  contactText: {
    fontSize: 16,
    color: '#4E4B66',
    marginLeft: 12,
  },
});
