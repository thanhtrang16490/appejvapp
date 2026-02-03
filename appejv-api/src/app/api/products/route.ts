import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100') // Increase default limit to 100
    const search = searchParams.get('search') || ''
    const sector_id = searchParams.get('sector_id') || ''

    let query = supabaseAdmin
      .from('products')
      .select(`
        *,
        sector:sectors(*)
      `)

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (sector_id) {
      query = query.eq('sector_id', sector_id)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: products, error, count } = await query

    if (error) {
      console.error('Products API error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data: products || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Products API catch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('Product creation error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: product }, { status: 201 })
  } catch (error) {
    console.error('Product creation catch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}