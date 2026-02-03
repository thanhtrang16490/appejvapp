import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const user_id = searchParams.get('user_id')
    const type = searchParams.get('type')
    const unread_only = searchParams.get('unread_only') === 'true'

    let query = supabaseAdmin
      .from('notifications')
      .select('*')

    // Apply filters
    if (user_id) {
      query = query.eq('user_id', user_id)
    }

    if (type) {
      query = query.eq('type', type)
    }

    if (unread_only) {
      query = query.is('read_at', null)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to).order('created_at', { ascending: false })

    const { data: notifications, error, count } = await query

    if (error) {
      console.error('Notifications API error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Count unread notifications
    const { count: unreadCount } = await supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user_id || '')
      .is('read_at', null)

    return NextResponse.json({
      data: notifications || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      unreadCount: unreadCount || 0
    })
  } catch (error) {
    console.error('Notifications API catch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data: notification, error } = await supabaseAdmin
      .from('notifications')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('Notification creation error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: notification }, { status: 201 })
  } catch (error) {
    console.error('Notification creation catch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids, read_at } = body

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: 'Invalid notification IDs' }, { status: 400 })
    }

    const { data: notifications, error } = await supabaseAdmin
      .from('notifications')
      .update({ read_at: read_at || new Date().toISOString() })
      .in('id', ids)
      .select()

    if (error) {
      console.error('Notification update error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: notifications })
  } catch (error) {
    console.error('Notification update catch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}