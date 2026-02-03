import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const includeProducts = searchParams.get('include_products') === 'true'
    const includeContents = searchParams.get('include_contents') === 'true'

    let query = supabaseAdmin.from('sectors').select('*')

    if (includeProducts) {
      query = query.select(`
        *,
        products(*)
      `)
    }

    if (includeContents) {
      query = query.select(`
        *,
        contents(*)
      `)
    }

    if (includeProducts && includeContents) {
      query = query.select(`
        *,
        products(*),
        contents(*)
      `)
    }

    const { data: sectors, error } = await query

    if (error) {
      console.error('Sectors API error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: sectors || [] })
  } catch (error) {
    console.error('Sectors API catch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data: sector, error } = await supabaseAdmin
      .from('sectors')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('Sector creation error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: sector }, { status: 201 })
  } catch (error) {
    console.error('Sector creation catch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}