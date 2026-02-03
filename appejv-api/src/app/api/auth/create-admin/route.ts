import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Email và mật khẩu là bắt buộc'
      }, { status: 400 })
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        name: 'Admin User'
      }
    })

    if (authError) {
      return NextResponse.json({
        success: false,
        message: 'Lỗi tạo tài khoản auth',
        error: authError.message
      }, { status: 400 })
    }

    // Create user record in database
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        email: email,
        name: 'Admin User',
        phone: '03513595030',
        role_id: 1, // Admin role
        address: 'Km 50, Quốc lộ 1A, xã Tiên Tân, Tp Phủ Lý, tỉnh Hà Nam'
      })
      .select()
      .single()

    if (userError) {
      // If database insert fails, try to delete the auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      
      return NextResponse.json({
        success: false,
        message: 'Lỗi tạo user record',
        error: userError.message
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Tạo admin user thành công',
      data: {
        id: authData.user.id,
        email: authData.user.email,
        created_at: authData.user.created_at
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET endpoint to check if admin exists
export async function GET(request: NextRequest) {
  try {
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('id, email, name, role_id')
      .eq('role_id', 1) // Admin role
      .limit(1)

    if (error) {
      return NextResponse.json({
        success: false,
        message: 'Lỗi kiểm tra admin user',
        error: error.message
      }, { status: 400 })
    }

    const adminExists = users && users.length > 0

    return NextResponse.json({
      success: true,
      adminExists,
      admin: adminExists ? users[0] : null,
      message: adminExists ? 'Admin user đã tồn tại' : 'Chưa có admin user'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}