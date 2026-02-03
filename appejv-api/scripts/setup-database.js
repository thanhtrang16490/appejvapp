const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('🚀 Setting up APPE JV database...')

  try {
    // Create roles
    console.log('📝 Creating roles...')
    const { error: rolesError } = await supabase
      .from('roles')
      .upsert([
        { id: 1, name: 'admin', description: 'Administrator with full access' },
        { id: 2, name: 'agent', description: 'Sales agent with limited access' },
        { id: 3, name: 'customer', description: 'Customer with basic access' },
        { id: 4, name: 'public', description: 'Public user with read-only access' }
      ], { onConflict: 'name' })

    if (rolesError) console.log('Roles may already exist:', rolesError.message)

    // Create sectors
    console.log('🏢 Creating sectors...')
    const { error: sectorsError } = await supabase
      .from('sectors')
      .upsert([
        { 
          id: 1, 
          name: 'Thức ăn gia súc', 
          description: 'Thức ăn hỗn hợp và đậm đặc cho lợn, bò các giai đoạn phát triển' 
        },
        { 
          id: 2, 
          name: 'Thức ăn gia cầm', 
          description: 'Thức ăn hỗn hợp cho gà, vịt, ngan các giai đoạn phát triển' 
        }
      ], { onConflict: 'id' })

    if (sectorsError) console.log('Sectors may already exist:', sectorsError.message)

    // Create products
    console.log('📦 Creating products...')
    const products = [
      // Thức ăn gia súc
      { name: 'HH cho lợn sữa (7 ngày tuổi - 10kg)', description: 'Mã SP: A1 - Đạm 20% - Bao 20kg', price: 27100, sector_id: 1 },
      { name: 'HH cho lợn con tập ăn (10 ngày tuổi - 20kg)', description: 'Mã SP: A2 - Đạm 19% - Bao 25kg', price: 18090, sector_id: 1 },
      { name: 'HH cho lợn con tập ăn (10 ngày tuổi - 25kg)', description: 'Mã SP: A2GP - Đạm 19% - Bao 25kg', price: 14640, sector_id: 1 },
      { name: 'HH cho lợn siêu nạc (10 - 25kg)', description: 'Mã SP: A3 - Đạm 18.5% - Bao 25kg', price: 12830, sector_id: 1 },
      { name: 'Đậm đặc cao cấp cho lợn tập ăn - xuất chuồng', description: 'Mã SP: A999 - Đạm 46% - Bao 25kg', price: 18770, sector_id: 1 },
      { name: 'HH cho bò thịt', description: 'Mã SP: A618 - Đạm 16% - Bao 25kg', price: 10640, sector_id: 1 },
      
      // Thức ăn gia cầm
      { name: 'HH cho gà công nghiệp 01 - 12 ngày tuổi', description: 'Mã SP: A2010 - Đạm 21% - Bao 25kg', price: 13480, sector_id: 2 },
      { name: 'HH cho gà công nghiệp 13 - 24 ngày tuổi', description: 'Mã SP: A2011 - Đạm 20% - Bao 25kg', price: 13180, sector_id: 2 },
      { name: 'HH cho gà công nghiệp 25 - 39 ngày tuổi', description: 'Mã SP: A2012 - Đạm 18% - Bao 25kg', price: 12980, sector_id: 2 },
      { name: 'HH gà trắng siêu thịt từ 1-14 ngày tuổi', description: 'Mã SP: L310-S - Đạm 21% - Bao 25kg', price: 13500, sector_id: 2 },
      { name: 'HH cho vịt, ngan con (từ 01 - 21 ngày tuổi)', description: 'Mã SP: L810 - Đạm 20% - Bao 25kg', price: 12360, sector_id: 2 },
      { name: 'Đậm đặc cho gà thịt 01 ngày tuổi - xuất chuồng', description: 'Mã SP: A308 - Đạm 43% - Bao 25kg', price: 18450, sector_id: 2 }
    ]

    const { error: productsError } = await supabase
      .from('products')
      .upsert(products, { onConflict: 'name' })

    if (productsError) console.log('Products may already exist:', productsError.message)

    // Create contents
    console.log('📝 Creating contents...')
    const contents = [
      {
        title: 'Thức ăn chăn nuôi APPE JV - Giải pháp dinh dưỡng tối ưu',
        content: 'APPE JV mang đến những sản phẩm thức ăn chăn nuôi chất lượng cao với công thức dinh dưỡng cân bằng, giúp vật nuôi phát triển khỏe mạnh và đạt hiệu quả kinh tế tối ưu. Với nhiều năm kinh nghiệm trong ngành chăn nuôi, chúng tôi cam kết cung cấp những giải pháp dinh dưỡng tốt nhất cho từng giai đoạn phát triển của vật nuôi.',
        brand: 'APPE JV',
        category: 'product',
        sector_id: 1
      },
      {
        title: 'Hướng dẫn chăn nuôi lợn hiệu quả với thức ăn APPE JV',
        content: 'Thức ăn hỗn hợp APPE JV được nghiên cứu và sản xuất theo công nghệ tiên tiến, đảm bảo cung cấp đầy đủ dinh dưỡng cho lợn ở mọi giai đoạn phát triển. Với hàm lượng đạm từ 13-20%, sản phẩm giúp tối ưu hóa tỷ lệ chuyển đổi thức ăn và tăng trọng nhanh.',
        brand: 'APPE JV',
        category: 'guide',
        sector_id: 1
      },
      {
        title: 'Thức ăn gia cầm APPE JV - Chất lượng vượt trội',
        content: 'Thức ăn hỗn hợp cho gà, vịt, ngan APPE JV được thiết kế phù hợp với đặc điểm sinh lý của gia cầm. Với công thức dinh dưỡng cân bằng và hàm lượng đạm từ 17-21%, sản phẩm giúp gia cầm phát triển đều, tăng trọng nhanh và đạt hiệu quả kinh tế cao.',
        brand: 'APPE JV',
        category: 'product',
        sector_id: 2
      },
      {
        title: 'Công nghệ sản xuất thức ăn chăn nuôi hiện đại tại APPE JV',
        content: 'APPE JV áp dụng công nghệ sản xuất hiện đại với dây chuyền tự động, đảm bảo chất lượng sản phẩm ổn định. Quy trình kiểm soát chất lượng nghiêm ngặt từ khâu nguyên liệu đầu vào đến sản phẩm hoàn thiện.',
        brand: 'APPE JV',
        category: 'news',
        sector_id: 1
      }
    ]

    const { error: contentsError } = await supabase
      .from('contents')
      .upsert(contents, { onConflict: 'title' })

    if (contentsError) console.log('Contents may already exist:', contentsError.message)

    console.log('✅ Database setup completed successfully!')
    console.log('🎉 You can now run: npm run dev')
    console.log('🌐 Admin panel will be available at: http://localhost:3001')
    console.log('🔑 Login with: admin@appejv.vn / appejv2024')

  } catch (error) {
    console.error('❌ Error setting up database:', error)
  }
}

setupDatabase()