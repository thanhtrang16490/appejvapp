const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function resetData() {
  console.log('🗑️ Resetting all data in Supabase...\n')

  try {
    // Delete in correct order (respecting foreign key constraints)
    console.log('1️⃣ Deleting contents...')
    const { error: contentsError } = await supabaseAdmin
      .from('contents')
      .delete()
      .neq('id', 0) // Delete all records

    if (contentsError) {
      console.log('⚠️ Contents delete error:', contentsError.message)
    } else {
      console.log('✅ All contents deleted')
    }

    console.log('\n2️⃣ Deleting products...')
    const { error: productsError } = await supabaseAdmin
      .from('products')
      .delete()
      .neq('id', 0) // Delete all records

    if (productsError) {
      console.log('⚠️ Products delete error:', productsError.message)
    } else {
      console.log('✅ All products deleted')
    }

    console.log('\n3️⃣ Deleting users (except admin)...')
    const { error: usersError } = await supabaseAdmin
      .from('users')
      .delete()
      .neq('email', 'admin@appejv.vn') // Keep admin user

    if (usersError) {
      console.log('⚠️ Users delete error:', usersError.message)
    } else {
      console.log('✅ All users deleted (except admin)')
    }

    console.log('\n4️⃣ Deleting sectors...')
    const { error: sectorsError } = await supabaseAdmin
      .from('sectors')
      .delete()
      .neq('id', 0) // Delete all records

    if (sectorsError) {
      console.log('⚠️ Sectors delete error:', sectorsError.message)
    } else {
      console.log('✅ All sectors deleted')
    }

    // Get final statistics
    console.log('\n📊 Final Statistics:')
    const [usersCount, productsCount, sectorsCount, contentsCount] = await Promise.all([
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('sectors').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('contents').select('*', { count: 'exact', head: true })
    ])

    console.log(`👥 Remaining Users: ${usersCount.count}`)
    console.log(`📦 Remaining Products: ${productsCount.count}`)
    console.log(`🏢 Remaining Sectors: ${sectorsCount.count}`)
    console.log(`📝 Remaining Contents: ${contentsCount.count}`)

    console.log('\n🎉 Data reset completed successfully!')
    console.log('💡 Run "npm run import-mock" to import fresh data')

  } catch (error) {
    console.error('❌ Reset failed:', error.message)
  }
}

resetData()