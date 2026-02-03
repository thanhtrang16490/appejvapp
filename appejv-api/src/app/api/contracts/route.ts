import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const customer_id = searchParams.get('customer_id')
    const agent_id = searchParams.get('agent_id')
    const status = searchParams.get('status')

    let query = supabaseAdmin
      .from('contracts')
      .select(`
        *,
        customer:users!customer_id (*),
        agent:users!agent_id (*),
        quotation:quotations (*)
      `)

    // Apply filters
    if (customer_id) {
      query = query.eq('customer_id', customer_id)
    }

    if (agent_id) {
      query = query.eq('agent_id', agent_id)
    }

    if (status) {
      query = query.eq('status', status)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to).order('created_at', { ascending: false })

    const { data: contracts, error, count } = await query

    if (error) {
      console.error('Contracts API error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data: contracts || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Contracts API catch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Generate contract code if not provided
    if (!body.contract_code) {
      const timestamp = Date.now().toString().slice(-6)
      body.contract_code = `CT${timestamp}`
    }

    const { data: contract, error } = await supabaseAdmin
      .from('contracts')
      .insert([body])
      .select(`
        *,
        customer:users!customer_id (*),
        agent:users!agent_id (*),
        quotation:quotations (*)
      `)
      .single()

    if (error) {
      console.error('Contract creation error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: contract }, { status: 201 })
  } catch (error) {
    console.error('Contract creation catch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}