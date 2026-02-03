import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const agent_id = searchParams.get('agent_id')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let query = supabaseAdmin
      .from('contacts')
      .select(`
        *,
        agent:users!agent_id (*),
        interested_product:products (*)
      `)

    // Apply filters
    if (agent_id) {
      query = query.eq('agent_id', agent_id)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to).order('created_at', { ascending: false })

    const { data: contacts, error, count } = await query

    if (error) {
      console.error('Contacts API error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data: contacts || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Contacts API catch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Check if contact with same phone already exists
    const { data: existingContact } = await supabaseAdmin
      .from('contacts')
      .select('id, phone')
      .eq('phone', body.phone)
      .single()

    if (existingContact) {
      return NextResponse.json({ 
        error: 'Contact with this phone number already exists',
        existing: true 
      }, { status: 409 })
    }

    const { data: contact, error } = await supabaseAdmin
      .from('contacts')
      .insert([body])
      .select(`
        *,
        agent:users!agent_id (*),
        interested_product:products (*)
      `)
      .single()

    if (error) {
      console.error('Contact creation error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: contact }, { status: 201 })
  } catch (error) {
    console.error('Contact creation catch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}