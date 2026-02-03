const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function syncAuthUser() {
  console.log('🔄 Syncing admin user with Supabase Auth...')

  try {
    // Check if user exists in database
    const { data: dbUser, error: dbError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', 'admin@appejv.vn')
      .single()

    if (dbError) {
      console.log('❌ Database user not found:', dbError.message)
      return
    }

    console.log('✅ Found user in database:', dbUser.email)

    // Check if user exists in Auth
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (authError) {
      console.log('❌ Error listing auth users:', authError.message)
      return
    }

    const existingAuthUser = authUsers.users.find(user => user.email === 'admin@appejv.vn')

    if (existingAuthUser) {
      console.log('✅ User already exists in Auth:', existingAuthUser.email)
      
      // Update database user ID to match auth user ID
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({ id: existingAuthUser.id })
        .eq('email', 'admin@appejv.vn')

      if (updateError) {
        console.log('⚠️ Could not update user ID:', updateError.message)
      } else {
        console.log('✅ User ID synchronized')
      }
    } else {
      console.log('📝 Creating user in Auth...')
      
      // Create user in Auth with the same ID as database
      const { data: newAuthUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: 'admin@appejv.vn',
        password: 'appejv2024',
        email_confirm: true,
        user_metadata: {
          role: 'admin',
          name: dbUser.name
        }
      })

      if (createError) {
        console.log('❌ Error creating auth user:', createError.message)
        return
      }

      console.log('✅ Auth user created:', newAuthUser.user.email)

      // Update database user ID to match auth user ID
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({ id: newAuthUser.user.id })
        .eq('email', 'admin@appejv.vn')

      if (updateError) {
        console.log('⚠️ Could not update user ID:', updateError.message)
      } else {
        console.log('✅ User ID synchronized')
      }
    }

    console.log('\n🎉 Auth sync completed!')
    console.log('🔑 You can now login with: admin@appejv.vn / appejv2024')

  } catch (error) {
    console.error('❌ Sync failed:', error.message)
  }
}

syncAuthUser()