import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agent_id = searchParams.get('agent_id');
    const period_year = searchParams.get('period_year');
    const period_month = searchParams.get('period_month');
    const status = searchParams.get('status');

    let query = supabaseAdmin
      .from('revenue_tracking')
      .select(`
        *,
        agent:agent_id(id, name, email, phone),
        order:order_id(
          id,
          order_code,
          customer_name,
          total_amount,
          order_date
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (agent_id) {
      query = query.eq('agent_id', agent_id);
    }
    if (period_year) {
      query = query.eq('period_year', parseInt(period_year));
    }
    if (period_month) {
      query = query.eq('period_month', parseInt(period_month));
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data: revenue, error } = await query;

    if (error) {
      console.error('Error fetching revenue tracking:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Calculate summary statistics
    const summary = {
      total_revenue: 0,
      total_commission: 0,
      order_count: 0
    };

    if (revenue) {
      revenue.forEach(item => {
        summary.total_revenue += parseFloat(item.revenue_amount);
        summary.total_commission += parseFloat(item.commission_amount || 0);
        summary.order_count += 1;
      });
    }

    return NextResponse.json({
      data: revenue,
      summary
    });

  } catch (error) {
    console.error('Error in revenue tracking API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      agent_id,
      order_id,
      revenue_amount,
      commission_rate,
      period_month,
      period_year
    } = body;

    const commission_amount = revenue_amount * (commission_rate / 100);

    // Create revenue tracking record
    const { data: revenue, error: revenueError } = await supabaseAdmin
      .from('revenue_tracking')
      .insert({
        agent_id,
        order_id,
        revenue_amount,
        commission_amount,
        commission_rate,
        period_month,
        period_year
      })
      .select()
      .single();

    if (revenueError) {
      console.error('Error creating revenue tracking:', revenueError);
      return NextResponse.json({ error: revenueError.message }, { status: 500 });
    }

    // Update agent's total commission
    const { data: agent } = await supabaseAdmin
      .from('users')
      .select('total_commission')
      .eq('id', agent_id)
      .single();

    if (agent) {
      const newTotalCommission = parseFloat(agent.total_commission || 0) + commission_amount;
      
      await supabaseAdmin
        .from('users')
        .update({ total_commission: newTotalCommission })
        .eq('id', agent_id);
    }

    return NextResponse.json({ data: revenue }, { status: 201 });

  } catch (error) {
    console.error('Error in revenue tracking POST API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get revenue summary by period
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { agent_id, start_date, end_date } = body;

    // Get orders within date range
    let query = supabaseAdmin
      .from('orders')
      .select(`
        id,
        order_code,
        customer_name,
        total_amount,
        order_date,
        agent_id,
        agent:agent_id(id, name, commission_rate)
      `)
      .gte('order_date', start_date)
      .lte('order_date', end_date)
      .eq('status', 'delivered'); // Only count delivered orders

    if (agent_id) {
      query = query.eq('agent_id', agent_id);
    }

    const { data: orders, error } = await query;

    if (error) {
      console.error('Error fetching orders for revenue summary:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Group by agent and calculate revenue
    const revenueByAgent: Record<string, any> = {};

    orders?.forEach(order => {
      const agentId = order.agent_id;
      if (!revenueByAgent[agentId]) {
        revenueByAgent[agentId] = {
          agent: order.agent,
          total_revenue: 0,
          total_commission: 0,
          order_count: 0,
          orders: []
        };
      }

      const revenue = parseFloat(order.total_amount);
      const commissionRate = parseFloat(order.agent?.commission_rate || 0);
      const commission = revenue * (commissionRate / 100);

      revenueByAgent[agentId].total_revenue += revenue;
      revenueByAgent[agentId].total_commission += commission;
      revenueByAgent[agentId].order_count += 1;
      revenueByAgent[agentId].orders.push({
        id: order.id,
        order_code: order.order_code,
        customer_name: order.customer_name,
        total_amount: revenue,
        commission_amount: commission,
        order_date: order.order_date
      });
    });

    return NextResponse.json({
      data: Object.values(revenueByAgent),
      period: { start_date, end_date }
    });

  } catch (error) {
    console.error('Error in revenue summary API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}