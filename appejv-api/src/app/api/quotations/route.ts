import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const agent_id = searchParams.get('agent_id')
    const customer_id = searchParams.get('customer_id')
    const status = searchParams.get('status')

    let query = supabaseAdmin
      .from('quotations')
      .select(`
        *,
        quotation_items (
          *,
          product:products (*)
        ),
        customer:users!customer_id (*),
        agent:users!agent_id (*)
      `)

    // Apply filters
    if (agent_id) {
      query = query.eq('agent_id', agent_id)
    }

    if (customer_id) {
      query = query.eq('customer_id', customer_id)
    }

    if (status) {
      query = query.eq('status', status)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to).order('created_at', { ascending: false })

    const { data: quotations, error, count } = await query

    if (error) {
      console.error('Quotations API error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data: quotations || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Quotations API catch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { quotation_items, ...quotationData } = body

    // Create quotation
    const { data: quotation, error: quotationError } = await supabaseAdmin
      .from('quotations')
      .insert([quotationData])
      .select()
      .single()

    if (quotationError) {
      console.error('Quotation creation error:', quotationError)
      return NextResponse.json({ error: quotationError.message }, { status: 400 })
    }

    // Create quotation items if provided
    if (quotation_items && quotation_items.length > 0) {
      const itemsWithQuotationId = quotation_items.map((item: any) => ({
        ...item,
        quotation_id: quotation.id
      }))

      const { error: itemsError } = await supabaseAdmin
        .from('quotation_items')
        .insert(itemsWithQuotationId)

      if (itemsError) {
        console.error('Quotation items creation error:', itemsError)
        // Rollback quotation creation
        await supabaseAdmin.from('quotations').delete().eq('id', quotation.id)
        return NextResponse.json({ error: itemsError.message }, { status: 400 })
      }
    }

    // Fetch complete quotation with items
    const { data: completeQuotation, error: fetchError } = await supabaseAdmin
      .from('quotations')
      .select(`
        *,
        quotation_items (
          *,
          product:products (*)
        )
      `)
      .eq('id', quotation.id)
      .single()

    if (fetchError) {
      console.error('Quotation fetch error:', fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    return NextResponse.json({ data: completeQuotation }, { status: 201 })
  } catch (error) {
    console.error('Quotation creation catch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}