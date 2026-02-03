import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const sector_id = searchParams.get('sector_id') || ''
    const category = searchParams.get('category') || ''
    const brand = searchParams.get('brand') || ''

    let query = supabaseAdmin
      .from('contents')
      .select(`
        *,
        sector:sectors(*)
      `)

    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
    }

    if (sector_id) {
      query = query.eq('sector_id', sector_id)
    }

    if (category) {
      query = query.eq('category', category)
    }

    if (brand) {
      query = query.eq('brand', brand)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: contents, error, count } = await query

    if (error) {
      console.error('Contents API error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data: contents || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Contents API catch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data: content, error } = await supabaseAdmin
      .from('contents')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('Content creation error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: content }, { status: 201 })
  } catch (error) {
    console.error('Content creation catch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}