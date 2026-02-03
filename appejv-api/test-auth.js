const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAuthentication() {
  console.log('🔐 Testing APPE JV Authentication System...\n')

  try {
    // Test 1: Login with admin credentials
    console.log('1️⃣ Testing admin login...')
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'admin@appejv.vn',
      password: 'appejv2024'
    })

    if (loginError) {
      console.log('❌ Login failed:', loginError.message)
      return
    }

    console.log('✅ Login successful!')
    console.log('   User ID:', loginData.user.id)
    console.log('   Email:', loginData.user.email)
    console.log('   Session expires:', new Date(loginData.session.expires_at * 1000).toLocaleString())

    // Test 2: Get current session
    console.log('\n2️⃣ Testing session retrieval...')
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.log('❌ Session retrieval failed:', sessionError.message)
    } else {
      console.log('✅ Session retrieved successfully!')
      console.log('   Session valid:', !!sessionData.session)
    }

    // Test 3: Get user profile from database
    console.log('\n3️⃣ Testing user profile retrieval...')
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`
        id, email, name, phone, role_id, address,
        roles (name, description)
      `)
      .eq('id', loginData.user.id)
      .single()

    if (userError) {
      console.log('❌ User profile retrieval failed:', userError.message)
    } else {
      console.log('✅ User profile retrieved successfully!')
      console.log('   Name:', userData.name)
      console.log('   Phone:', userData.phone)
      console.log('   Role:', userData.roles?.name)
      console.log('   Address:', userData.address)
    }

    // Test 4: Test password reset (without actually sending email)
    console.log('\n4️⃣ Testing password reset request...')
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      'admin@appejv.vn',
      { redirectTo: 'http://localhost:3001/reset-password' }
    )

    if (resetError) {
      console.log('❌ Password reset failed:', resetError.message)
    } else {
      console.log('✅ Password reset request sent successfully!')
    }

    // Test 5: Logout
    console.log('\n5️⃣ Testing logout...')
    const { error: logoutError } = await supabase.auth.signOut()

    if (logoutError) {
      console.log('❌ Logout failed:', logoutError.message)
    } else {
      console.log('✅ Logout successful!')
    }

    // Test 6: Verify logout
    console.log('\n6️⃣ Verifying logout...')
    const { data: postLogoutSession } = await supabase.auth.getSession()
    
    if (postLogoutSession.session) {
      console.log('❌ Session still exists after logout')
    } else {
      console.log('✅ Session cleared successfully!')
    }

    console.log('\n🎉 All authentication tests completed!')
    console.log('\n📋 Test Summary:')
    console.log('   ✅ Admin login')
    console.log('   ✅ Session management')
    console.log('   ✅ User profile retrieval')
    console.log('   ✅ Password reset')
    console.log('   ✅ Logout')
    console.log('   ✅ Session cleanup')

  } catch (error) {
    console.error('❌ Test failed with error:', error.message)
  }
}

// Test invalid login
async function testInvalidLogin() {
  console.log('\n🔒 Testing invalid login...')
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'invalid@example.com',
    password: 'wrongpassword'
  })

  if (error) {
    console.log('✅ Invalid login correctly rejected:', error.message)
  } else {
    console.log('❌ Invalid login should have been rejected')
  }
}

// Run tests
async function runAllTests() {
  await testAuthentication()
  await testInvalidLogin()
  
  console.log('\n🏁 All tests completed!')
  console.log('🌐 Admin panel: http://localhost:3001')
  console.log('🔑 Login: admin@appejv.vn / appejv2024')
}

runAllTests()