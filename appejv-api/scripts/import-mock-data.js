const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Mock data from appejv-web
const MOCK_SECTORS = [
  {
    id: 1,
    name: 'Thức ăn gia súc',
    description: 'Thức ăn hỗn hợp và đậm đặc cho lợn, bò các giai đoạn phát triển',
    image: null
  },
  {
    id: 2,
    name: 'Thức ăn gia cầm',
    description: 'Thức ăn hỗn hợp và đậm đặc cho gà, vịt, ngan các giai đoạn phát triển',
    image: null
  }
]

const MOCK_PRODUCTS = [
  // Thức ăn gia súc
  { id: 1, name: 'HH cho lợn sữa (7 ngày tuổi - 10kg)', price: 27100, description: 'Mã SP: A1 - Đạm 20% - Bao 20kg', sector_id: 1 },
  { id: 2, name: 'HH cho lợn con tập ăn (10 ngày tuổi - 20kg)', price: 18090, description: 'Mã SP: A2 - Đạm 19% - Bao 25kg', sector_id: 1 },
  { id: 3, name: 'HH cho lợn con tập ăn (10 ngày tuổi - 25kg)', price: 14640, description: 'Mã SP: A2GP - Đạm 19% - Bao 25kg', sector_id: 1 },
  { id: 4, name: 'HH cho lợn siêu nạc (10 - 25kg)', price: 12830, description: 'Mã SP: A3 - Đạm 18.5% - Bao 25kg', sector_id: 1 },
  { id: 5, name: 'HH cho lợn con siêu nạc từ tập ăn - 25kg', price: 12830, description: 'Mã SP: A1020 - Đạm 18.5% - Bao 25kg', sector_id: 1 },
  { id: 6, name: 'HH cho lợn siêu nạc từ 12 - 30kg', price: 12380, description: 'Mã SP: A1021 - Đạm 18% - Bao 25kg', sector_id: 1 },
  { id: 7, name: 'HH cho lợn siêu nạc 60kg - xuất chuồng', price: 11400, description: 'Mã SP: A1022SF - Đạm 17% - Bao 25kg', sector_id: 1 },
  { id: 8, name: 'HH cho lợn nái hậu bị, nái chửa', price: 11130, description: 'Mã SP: A117 - Đạm 14% - Bao 25kg', sector_id: 1 },
  { id: 9, name: 'HH cho lợn nái nuôi con', price: 13190, description: 'Mã SP: A118 - Đạm 17% - Bao 25kg', sector_id: 1 },
  { id: 10, name: 'HH cho lợn thịt (15kg - 25kg)', price: 11675, description: 'Mã SP: A1031 - Đạm 17% - Bao 40kg', sector_id: 1 },
  { id: 11, name: 'HH cho lợn thịt 15kg - 60kg', price: 11225, description: 'Mã SP: A1032 - Đạm 16.5% - Bao 40kg', sector_id: 1 },
  { id: 12, name: 'HH cho lợn thịt 35kg - 90kg', price: 10775, description: 'Mã SP: A1033 - Đạm 14% - Bao 40kg', sector_id: 1 },
  { id: 13, name: 'HH cho lợn lai từ 30kg - xuất chuồng', price: 10475, description: 'Mã SP: A1034 - Đạm 13% - Bao 40kg', sector_id: 1 },
  { id: 14, name: 'Đậm đặc cao cấp cho lợn tập ăn - xuất chuồng', price: 18770, description: 'Mã SP: A999 - Đạm 46% - Bao 25kg', sector_id: 1 },
  { id: 15, name: 'HH cho bò thịt', price: 10640, description: 'Mã SP: A618 - Đạm 16% - Bao 25kg', sector_id: 1 },

  // Thức ăn gia cầm
  { id: 16, name: 'HH cho gà công nghiệp 01 - 12 ngày tuổi', price: 13480, description: 'Mã SP: A2010 - Đạm 21% - Bao 25kg', sector_id: 2 },
  { id: 17, name: 'HH cho gà công nghiệp 13 - 24 ngày tuổi', price: 13180, description: 'Mã SP: A2011 - Đạm 20% - Bao 25kg', sector_id: 2 },
  { id: 18, name: 'HH cho gà công nghiệp 25 - 39 ngày tuổi', price: 12980, description: 'Mã SP: A2012 - Đạm 18% - Bao 25kg', sector_id: 2 },
  { id: 19, name: 'HH gà trắng siêu thịt từ 1-14 ngày tuổi', price: 13500, description: 'Mã SP: L310-S - Đạm 21% - Bao 25kg', sector_id: 2 },
  { id: 20, name: 'HH gà trắng siêu thịt từ 1-14 ngày tuổi (Cầu trùng)', price: 13500, description: 'Mã SP: L310-S Cầu trùng - Đạm 21% - Bao 25kg', sector_id: 2 },
  { id: 21, name: 'HH gà trắng siêu thịt từ 15-28 ngày tuổi', price: 13200, description: 'Mã SP: L311-S - Đạm 20% - Bao 25kg', sector_id: 2 },
  { id: 22, name: 'HH đặc biệt cho gà siêu thịt vỗ béo', price: 13120, description: 'Mã SP: L312-S - Đạm 18% - Bao 25kg', sector_id: 2 },
  { id: 23, name: 'HH cho gà trắng 01 - 21 ngày tuổi', price: 13530, description: 'Mã SP: A2010S - Đạm 21% - Bao 25kg', sector_id: 2 },
  { id: 24, name: 'Hỗn hợp cao cấp cho gà thịt 22 - 42 ngày tuổi', price: 13180, description: 'Mã SP: A2011S - Đạm 19% - Bao 25kg', sector_id: 2 },
  { id: 25, name: 'Hỗn hợp đặc biệt cho gà thịt vỗ béo', price: 13300, description: 'Mã SP: A2012S - Đạm 18% - Bao 25kg', sector_id: 2 },
  { id: 26, name: 'HH gà ủm từ 01-21 ngày tuổi', price: 13380, description: 'Mã SP: A2020 - Đạm 20.5% - Bao 25kg', sector_id: 2 },
  { id: 27, name: 'HH cho gà siêu thịt từ 22-42 ngày tuổi', price: 12830, description: 'Mã SP: A2021 - Đạm 18% - Bao 25kg', sector_id: 2 },
  { id: 28, name: 'HH cho gà lông màu 01-28 ngày tuổi', price: 11620, description: 'Mã SP: A2030 - Đạm 19% - Bao 25kg', sector_id: 2 },
  { id: 29, name: 'HH cho gà thịt 29 ngày tuổi - xuất chuồng', price: 12030, description: 'Mã SP: A2031PLUS - Đạm 17% - Bao 25kg', sector_id: 2 },
  { id: 30, name: 'HH cho gà lông màu 01 ngày tuổi - xuất chuồng', price: 10960, description: 'Mã SP: A2033 - Đạm 17% - Bao 25kg', sector_id: 2 },
  { id: 31, name: 'HH cho gà hậu bị từ 5 - 8 tuần tuổi', price: 10480, description: 'Mã SP: A310 - Đạm 17% - Bao 25kg', sector_id: 2 },
  { id: 32, name: 'HH cho gà hậu bị từ 7-18 tuần tuổi', price: 10280, description: 'Mã SP: A311 - Đạm 17% - Bao 25kg', sector_id: 2 },
  { id: 33, name: 'HH cho gà đẻ bố mẹ giống', price: 10400, description: 'Mã SP: A312 - Đạm 17% - Bao 25kg', sector_id: 2 },
  { id: 34, name: 'HH cho gà đẻ siêu trứng', price: 10080, description: 'Mã SP: A313S - Đạm 17% - Bao 25kg', sector_id: 2 },
  { id: 35, name: 'HH cho gà đẻ cao sàn', price: 10280, description: 'Mã SP: A313PLUS - Đạm 17% - Bao 25kg', sector_id: 2 },
  { id: 36, name: 'Đậm đặc cho gà thịt 01 ngày tuổi - xuất chuồng', price: 18450, description: 'Mã SP: A308 - Đạm 43% - Bao 25kg', sector_id: 2 },
  { id: 37, name: 'HH cho vịt, ngan con (từ 01 - 21 ngày tuổi)', price: 12360, description: 'Mã SP: L810 - Đạm 20% - Bao 25kg', sector_id: 2 },
  { id: 38, name: 'HH cho vịt, ngan thịt cao cấp 20 ngày tuổi - xuất chuồng', price: 11540, description: 'Mã SP: A4041S - Đạm 18.5% - Bao 25kg', sector_id: 2 },
  { id: 39, name: 'HH cho vịt, ngan thịt (20 ngày tuổi - xuất chuồng)', price: 11220, description: 'Mã SP: L811-S - Đạm 18% - Bao 25kg', sector_id: 2 },
  { id: 40, name: 'HH cho vịt, ngan dẻ siêu trứng', price: 10025, description: 'Mã SP: L814 - Đạm 19% - Bao 25kg', sector_id: 2 },
  { id: 41, name: 'HH cho vịt, ngan dẻ trứng', price: 9775, description: 'Mã SP: L815 - Đạm 18% - Bao 25kg', sector_id: 2 }
]

const MOCK_CONTENTS = [
  {
    id: 1,
    title: 'Hướng dẫn chăn nuôi lợn hiệu quả với thức ăn APPE JV',
    content: 'Thức ăn hỗn hợp APPE JV được nghiên cứu và sản xuất theo công nghệ tiên tiến, đảm bảo cung cấp đầy đủ dinh dưỡng cho lợn ở mọi giai đoạn phát triển. Với hàm lượng đạm từ 13-20%, sản phẩm giúp tối ưu hóa tỷ lệ chuyển đổi thức ăn và tăng trọng nhanh. Quy trình chăn nuôi bao gồm: 1) Chuẩn bị chuồng trại sạch sẽ, 2) Lựa chọn giống lợn khỏe mạnh, 3) Cho ăn đúng định lượng theo từng giai đoạn, 4) Tiêm phòng đầy đủ, 5) Theo dõi sức khỏe hàng ngày.',
    image: null,
    brand: 'APPE JV',
    category: 'guide',
    sector_id: 1
  },
  {
    id: 2,
    title: 'Lợi ích của thức ăn đậm đặc cao cấp A999',
    content: 'Thức ăn đậm đặc A999 với hàm lượng đạm lên đến 46% là giải pháp tối ưu cho việc bổ sung dinh dưỡng cho lợn. Sản phẩm giúp cải thiện sức khỏe đường ruột, tăng cường hệ miễn dịch và nâng cao hiệu quả chăn nuôi. Các lợi ích chính: 1) Tăng tỷ lệ chuyển đổi thức ăn, 2) Cải thiện chất lượng thịt, 3) Giảm tỷ lệ bệnh tật, 4) Tăng trọng lượng xuất chuồng, 5) Tiết kiệm chi phí chăn nuôi.',
    image: null,
    brand: 'APPE JV',
    category: 'product',
    sector_id: 1
  },
  {
    id: 3,
    title: 'Quy trình chăn nuôi bò thịt với thức ăn A618',
    content: 'Thức ăn hỗn hợp A618 dành cho bò thịt được thiết kế đặc biệt với hàm lượng đạm 16%, phù hợp với nhu cầu dinh dưỡng của bò trong giai đoạn nuôi thịt. Sản phẩm giúp bò phát triển khỏe mạnh và đạt trọng lượng xuất chuồng tối ưu. Quy trình chăn nuôi: 1) Chuẩn bị chuồng trại thông thoáng, 2) Chọn giống bò khỏe mạnh, 3) Cho ăn 2-3 lần/ngày, 4) Bổ sung thức ăn thô, 5) Theo dõi sức khỏe và tăng trọng.',
    image: null,
    brand: 'APPE JV',
    category: 'guide',
    sector_id: 1
  },
  {
    id: 4,
    title: 'Hướng dẫn chăn nuôi gà thịt hiệu quả',
    content: 'Thức ăn hỗn hợp cho gà thịt APPE JV được phân chia theo từng giai đoạn phát triển, từ gà con 1 ngày tuổi đến xuất chuồng. Với hàm lượng đạm từ 18-21%, sản phẩm đảm bảo gà phát triển đều, tăng trọng nhanh và đạt trọng lượng xuất chuồng tối ưu. Các giai đoạn chăn nuôi: 1) Giai đoạn 1-14 ngày: Thức ăn đạm cao 21%, 2) Giai đoạn 15-28 ngày: Thức ăn đạm 20%, 3) Giai đoạn 29-42 ngày: Thức ăn đạm 18%, 4) Kiểm soát nhiệt độ và độ ẩm, 5) Tiêm phòng đầy đủ.',
    image: null,
    brand: 'APPE JV',
    category: 'guide',
    sector_id: 2
  },
  {
    id: 5,
    title: 'Lợi ích của thức ăn đậm đặc A308 cho gà thịt',
    content: 'Thức ăn đậm đặc A308 với hàm lượng đạm 43% là giải pháp bổ sung dinh dưỡng tối ưu cho gà thịt. Sản phẩm giúp cải thiện tỷ lệ chuyển đổi thức ăn, tăng cường sức đề kháng và nâng cao chất lượng thịt gà. Ưu điểm nổi bật: 1) Tăng tốc độ tăng trọng, 2) Cải thiện màu sắc và chất lượng thịt, 3) Giảm tỷ lệ chết, 4) Tăng hiệu quả kinh tế, 5) Dễ tiêu hóa và hấp thụ.',
    image: null,
    brand: 'APPE JV',
    category: 'product',
    sector_id: 2
  },
  {
    id: 6,
    title: 'Kỹ thuật chăn nuôi vịt, ngan thịt',
    content: 'Thức ăn hỗn hợp cho vịt, ngan APPE JV được thiết kế phù hợp với đặc điểm sinh lý của gia cầm nước. Với công thức dinh dưỡng cân bằng, sản phẩm giúp vịt, ngan phát triển khỏe mạnh và đạt hiệu quả kinh tế cao. Kỹ thuật chăn nuôi: 1) Chuẩn bị ao nuôi sạch sẽ, 2) Chọn giống vịt, ngan khỏe mạnh, 3) Cho ăn 3-4 lần/ngày, 4) Bổ sung thức ăn xanh, 5) Phòng bệnh định kỳ.',
    image: null,
    brand: 'APPE JV',
    category: 'guide',
    sector_id: 2
  },
  {
    id: 7,
    title: 'Chăn nuôi gà đẻ bền vững với thức ăn APPE JV',
    content: 'Thức ăn cho gà đẻ APPE JV được nghiên cứu đặc biệt để tối ưu hóa năng suất đẻ trứng. Với hàm lượng dinh dưỡng cân bằng, sản phẩm giúp gà đẻ nhiều trứng, trứng to, chất lượng cao và duy trì sức khỏe tốt. Quy trình chăn nuôi: 1) Chuẩn bị chuồng nuôi phù hợp, 2) Chọn giống gà đẻ tốt, 3) Cho ăn đúng định lượng, 4) Bổ sung canxi và vitamin, 5) Kiểm soát ánh sáng và nhiệt độ.',
    image: null,
    brand: 'APPE JV',
    category: 'guide',
    sector_id: 2
  },
  {
    id: 8,
    title: 'Công nghệ sản xuất thức ăn chăn nuôi hiện đại tại APPE JV',
    content: 'APPE JV áp dụng công nghệ sản xuất hiện đại với dây chuyền tự động, đảm bảo chất lượng sản phẩm ổn định. Quy trình kiểm soát chất lượng nghiêm ngặt từ khâu nguyên liệu đầu vào đến sản phẩm hoàn thiện. Các công nghệ áp dụng: 1) Hệ thống trộn tự động, 2) Kiểm soát nhiệt độ và độ ẩm, 3) Phân tích dinh dưỡng chính xác, 4) Đóng gói tự động, 5) Kiểm tra chất lượng 24/7.',
    image: null,
    brand: 'APPE JV',
    category: 'news',
    sector_id: 1
  },
  {
    id: 9,
    title: 'Xu hướng chăn nuôi bền vững với APPE JV',
    content: 'APPE JV cam kết phát triển các sản phẩm thức ăn chăn nuôi thân thiện với môi trường, góp phần xây dựng ngành chăn nuôi bền vững. Các sáng kiến xanh: 1) Sử dụng nguyên liệu hữu cơ, 2) Giảm phát thải khí nhà kính, 3) Tái chế bao bì, 4) Tiết kiệm năng lượng, 5) Hỗ trợ nông dân địa phương.',
    image: null,
    brand: 'APPE JV',
    category: 'news',
    sector_id: 1
  },
  {
    id: 10,
    title: 'Chương trình đào tạo kỹ thuật chăn nuôi APPE JV',
    content: 'APPE JV tổ chức các khóa đào tạo kỹ thuật chăn nuôi miễn phí cho nông dân, giúp nâng cao hiệu quả chăn nuôi và tăng thu nhập. Nội dung đào tạo: 1) Kỹ thuật chăn nuôi hiện đại, 2) Sử dụng thức ăn hiệu quả, 3) Phòng chống dịch bệnh, 4) Quản lý tài chính, 5) Tiếp thị sản phẩm.',
    image: null,
    brand: 'APPE JV',
    category: 'news',
    sector_id: 2
  }
]

const MOCK_USERS = [
  {
    email: 'agent1@appejv.vn',
    name: 'Nguyễn Văn An',
    phone: '0987654321',
    role_id: 2,
    commission_rate: 8.0,
    total_commission: 2500000,
    address: 'Km 50, Quốc lộ 1A, xã Tiên Tân, Tp Phủ Lý, tỉnh Hà Nam'
  },
  {
    email: 'agent2@appejv.vn',
    name: 'Trần Thị Bình',
    phone: '0901234567',
    role_id: 2,
    commission_rate: 7.5,
    total_commission: 1800000,
    address: 'Km 50, Quốc lộ 1A, xã Tiên Tân, Tp Phủ Lý, tỉnh Hà Nam'
  },
  {
    email: 'customer1@appejv.vn',
    name: 'Lê Văn Cường',
    phone: '0912345678',
    role_id: 3,
    commission_rate: null,
    total_commission: null,
    address: 'Thôn 1, xã Tiên Tân, Tp Phủ Lý, tỉnh Hà Nam'
  },
  {
    email: 'customer2@appejv.vn',
    name: 'Phạm Thị Dung',
    phone: '0923456789',
    role_id: 3,
    commission_rate: null,
    total_commission: null,
    address: 'Thôn 2, xã Tiên Tân, Tp Phủ Lý, tỉnh Hà Nam'
  },
  {
    email: 'customer3@appejv.vn',
    name: 'Hoàng Văn Em',
    phone: '0934567890',
    role_id: 3,
    commission_rate: null,
    total_commission: null,
    address: 'Thôn 3, xã Tiên Tân, Tp Phủ Lý, tỉnh Hà Nam'
  }
]

async function importMockData() {
  console.log('🚀 Importing mock data from appejv-web to Supabase...\n')

  try {
    // 1. Import Sectors
    console.log('1️⃣ Importing sectors...')
    const { data: sectorsData, error: sectorsError } = await supabaseAdmin
      .from('sectors')
      .upsert(MOCK_SECTORS, { onConflict: 'id' })
      .select()

    if (sectorsError) {
      console.log('⚠️ Sectors import error:', sectorsError.message)
    } else {
      console.log(`✅ Imported ${MOCK_SECTORS.length} sectors`)
    }

    // 2. Import Products
    console.log('\n2️⃣ Importing products...')
    const { data: productsData, error: productsError } = await supabaseAdmin
      .from('products')
      .upsert(MOCK_PRODUCTS, { onConflict: 'id' })
      .select()

    if (productsError) {
      console.log('⚠️ Products import error:', productsError.message)
    } else {
      console.log(`✅ Imported ${MOCK_PRODUCTS.length} products`)
    }

    // 3. Import Contents
    console.log('\n3️⃣ Importing contents...')
    const { data: contentsData, error: contentsError } = await supabaseAdmin
      .from('contents')
      .upsert(MOCK_CONTENTS, { onConflict: 'id' })
      .select()

    if (contentsError) {
      console.log('⚠️ Contents import error:', contentsError.message)
    } else {
      console.log(`✅ Imported ${MOCK_CONTENTS.length} contents`)
    }

    // 4. Import Users (only database records, not auth)
    console.log('\n4️⃣ Importing users...')
    for (const user of MOCK_USERS) {
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .upsert({
          id: require('crypto').randomUUID(),
          ...user
        }, { onConflict: 'email' })
        .select()

      if (userError) {
        console.log(`⚠️ User ${user.email} import error:`, userError.message)
      } else {
        console.log(`✅ Imported user: ${user.name}`)
      }
    }

    // 5. Get final statistics
    console.log('\n📊 Final Statistics:')
    const [usersCount, productsCount, sectorsCount, contentsCount] = await Promise.all([
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('sectors').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('contents').select('*', { count: 'exact', head: true })
    ])

    console.log(`👥 Total Users: ${usersCount.count}`)
    console.log(`📦 Total Products: ${productsCount.count}`)
    console.log(`🏢 Total Sectors: ${sectorsCount.count}`)
    console.log(`📝 Total Contents: ${contentsCount.count}`)

    console.log('\n🎉 Mock data import completed successfully!')
    console.log('🌐 Admin panel: http://localhost:3001')
    console.log('🔑 Login: admin@appejv.vn / appejv2024')

  } catch (error) {
    console.error('❌ Import failed:', error.message)
  }
}

importMockData()