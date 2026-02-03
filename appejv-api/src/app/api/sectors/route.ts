import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    
    const includeProducts = searchParams.get('include_products') === 'true'
    const includeContents = searchParams.get('include_contents') === 'true'

    let query = supabase.from('sectors').select('*')

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
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: sectors })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    const { data: sector, error } = await supabase
      .from('sectors')
      .insert([body])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: sector }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}