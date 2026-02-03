const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createUsers() {
  console.log('👥 Creating test users...')

  try {
    // First, let's check if users table exists and what columns it has
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('*')
      .limit(1)

    if (checkError) {
      console.log('Error checking users table:', checkError.message)
    } else {
      console.log('Users table exists, sample user:', existingUsers[0] || 'No users found')
    }

    // Try to create users without password first (to match current schema)
    const testUsersWithoutPassword = [
      {
        email: 'admin@appejv.vn',
        name: 'Admin User',
        phone: '0123456789',
        role_id: 1,
        commission_rate: 10.0,
        total_commission: 1000000,
        address: 'Km 50, Quốc lộ 1A, xã Tiên Tân, Tp Phủ Lý, tỉnh Hà Nam'
      },
      {
        email: 'agent@appejv.vn',
        name: 'Nguyễn Văn A',
        phone: '0987654321',
        role_id: 2,
        commission_rate: 5.0,
        total_commission: 500000,
        address: 'Km 50, Quốc lộ 1A, xã Tiên Tân, Tp Phủ Lý, tỉnh Hà Nam'
      },
      {
        email: 'customer@appejv.vn',
        name: 'Trần Thị B',
        phone: '0111222333',
        role_id: 3,
        address: 'Km 50, Quốc lộ 1A, xã Tiên Tân, Tp Phủ Lý, tỉnh Hà Nam'
      }
    ]

    for (const user of testUsersWithoutPassword) {
      const { data, error } = await supabase
        .from('users')
        .upsert([user], { onConflict: 'email' })
        .select()

      if (error) {
        console.log(`❌ Error creating user ${user.email}:`, error.message)
      } else {
        console.log(`✅ User ${user.email} created/updated successfully`)
      }
    }

    // List all users
    const { data: allUsers, error: listError } = await supabase
      .from('users')
      .select(`
        *,
        role:roles(*)
      `)

    if (listError) {
      console.log('Error listing users:', listError.message)
    } else {
      console.log('\n📋 All users:')
      allUsers.forEach(user => {
        console.log(`  - ${user.email} (${user.role?.name}) - Phone: ${user.phone}`)
      })
    }

    console.log('\n🎉 Users setup completed!')
    console.log('📝 Note: Password authentication will be handled by phone number matching')
    console.log('🔑 Test credentials (phone/password):')
    console.log('  - 0123456789 / 123456 (Admin)')
    console.log('  - 0987654321 / 123456 (Agent)')
    console.log('  - 0111222333 / 123456 (Customer)')

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

createUsers()