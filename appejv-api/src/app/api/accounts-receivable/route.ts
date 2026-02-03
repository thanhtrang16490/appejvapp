import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const customer_id = searchParams.get('customer_id');
    const status = searchParams.get('status');
    const overdue = searchParams.get('overdue');

    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('accounts_receivable')
      .select(`
        *,
        customer:customer_id(id, name, email, phone, address),
        order:order_id(
          id,
          order_code,
          order_date,
          agent:agent_id(id, name)
        )
      `)
      .order('due_date', { ascending: true });

    // Apply filters
    if (customer_id) {
      query = query.eq('customer_id', customer_id);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (overdue === 'true') {
      const today = new Date().toISOString().split('T')[0];
      query = query.lt('due_date', today).neq('status', 'paid');
    }

    // Get total count for pagination
    const { count } = await supabaseAdmin
      .from('accounts_receivable')
      .select('*', { count: 'exact', head: true });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: receivables, error } = await query;

    if (error) {
      console.error('Error fetching accounts receivable:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Calculate summary statistics
    const { data: summaryData } = await supabaseAdmin
      .from('accounts_receivable')
      .select('total_amount, outstanding_amount, status, due_date');

    const summary = {
      total_outstanding: 0,
      total_overdue: 0,
      count_outstanding: 0,
      count_overdue: 0
    };

    if (summaryData) {
      const today = new Date().toISOString().split('T')[0];
      
      summaryData.forEach(item => {
        if (item.status !== 'paid') {
          summary.total_outstanding += parseFloat(item.outstanding_amount);
          summary.count_outstanding += 1;
          
          if (item.due_date < today) {
            summary.total_overdue += parseFloat(item.outstanding_amount);
            summary.count_overdue += 1;
          }
        }
      });
    }

    return NextResponse.json({
      data: receivables,
      summary,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Error in accounts receivable API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, payment_terms, notes } = body;

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (payment_terms !== undefined) updateData.payment_terms = payment_terms;

    const { data: receivable, error } = await supabaseAdmin
      .from('accounts_receivable')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating accounts receivable:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: receivable });

  } catch (error) {
    console.error('Error in accounts receivable PUT API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}