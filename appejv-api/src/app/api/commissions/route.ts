import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const agent_id = searchParams.get('agent_id')
    const status = searchParams.get('status')
    const start_date = searchParams.get('start_date')
    const end_date = searchParams.get('end_date')

    let query = supabaseAdmin
      .from('commissions')
      .select(`
        *,
        agent:users!agent_id (*),
        contract:contracts (*)
      `)

    // Apply filters
    if (agent_id) {
      query = query.eq('agent_id', agent_id)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (start_date) {
      query = query.gte('created_at', start_date)
    }

    if (end_date) {
      query = query.lte('created_at', end_date)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to).order('created_at', { ascending: false })

    const { data: commissions, error, count } = await query

    if (error) {
      console.error('Commissions API error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Calculate summary statistics
    const totalAmount = commissions?.reduce((sum, commission) => sum + parseFloat(commission.amount || 0), 0) || 0
    const paidAmount = commissions?.filter(c => c.status === 'paid').reduce((sum, commission) => sum + parseFloat(commission.amount || 0), 0) || 0
    const pendingAmount = commissions?.filter(c => c.status === 'pending').reduce((sum, commission) => sum + parseFloat(commission.amount || 0), 0) || 0

    return NextResponse.json({
      data: commissions || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      summary: {
        totalAmount,
        paidAmount,
        pendingAmount,
        totalCount: count || 0
      }
    })
  } catch (error) {
    console.error('Commissions API catch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data: commission, error } = await supabaseAdmin
      .from('commissions')
      .insert([body])
      .select(`
        *,
        agent:users!agent_id (*),
        contract:contracts (*)
      `)
      .single()

    if (error) {
      console.error('Commission creation error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: commission }, { status: 201 })
  } catch (error) {
    console.error('Commission creation catch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}