import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''
    const phone = searchParams.get('phone') || ''

    let query = supabaseAdmin
      .from('users')
      .select(`
        *,
        role:roles(*)
      `)

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
    }

    if (role) {
      query = query.eq('role_id', role)
    }

    if (phone) {
      query = query.eq('phone', phone)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: users, error, count } = await query

    if (error) {
      console.error('Users API error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data: users || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Users API catch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('User creation error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: user }, { status: 201 })
  } catch (error) {
    console.error('User creation catch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}