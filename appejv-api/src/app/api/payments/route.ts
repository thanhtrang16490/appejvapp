import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const order_id = searchParams.get('order_id');
    const status = searchParams.get('status');
    const payment_method = searchParams.get('payment_method');

    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('payments')
      .select(`
        *,
        order:order_id(
          id,
          order_code,
          customer_name,
          total_amount,
          customer:customer_id(id, name, phone)
        )
      `)
      .order('payment_date', { ascending: false });

    // Apply filters
    if (order_id) {
      query = query.eq('order_id', order_id);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (payment_method) {
      query = query.eq('payment_method', payment_method);
    }

    // Get total count for pagination
    const { count } = await supabaseAdmin
      .from('payments')
      .select('*', { count: 'exact', head: true });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: payments, error } = await query;

    if (error) {
      console.error('Error fetching payments:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data: payments,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Error in payments API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      order_id,
      amount,
      payment_method,
      payment_date,
      reference_number,
      notes
    } = body;

    // Generate payment code
    const paymentCode = `PAY-${Date.now()}`;

    // Create payment record
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert({
        order_id,
        payment_code: paymentCode,
        amount,
        payment_method,
        payment_date,
        reference_number,
        notes,
        status: 'completed'
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Error creating payment:', paymentError);
      return NextResponse.json({ error: paymentError.message }, { status: 500 });
    }

    // Get order details to update payment status
    const { data: order } = await supabaseAdmin
      .from('orders')
      .select('total_amount')
      .eq('id', order_id)
      .single();

    if (order) {
      // Get total paid amount for this order
      const { data: payments } = await supabaseAdmin
        .from('payments')
        .select('amount')
        .eq('order_id', order_id)
        .eq('status', 'completed');

      const totalPaid = payments?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;
      const orderTotal = parseFloat(order.total_amount);

      // Update order payment status
      let paymentStatus = 'unpaid';
      if (totalPaid >= orderTotal) {
        paymentStatus = 'paid';
      } else if (totalPaid > 0) {
        paymentStatus = 'partial';
      }

      await supabaseAdmin
        .from('orders')
        .update({ payment_status: paymentStatus })
        .eq('id', order_id);

      // Update accounts receivable
      const { data: receivable } = await supabaseAdmin
        .from('accounts_receivable')
        .select('*')
        .eq('order_id', order_id)
        .single();

      if (receivable) {
        const newPaidAmount = totalPaid;
        const newOutstandingAmount = Math.max(0, orderTotal - totalPaid);
        const receivableStatus = newOutstandingAmount === 0 ? 'paid' : 'outstanding';

        await supabaseAdmin
          .from('accounts_receivable')
          .update({
            paid_amount: newPaidAmount,
            outstanding_amount: newOutstandingAmount,
            status: receivableStatus
          })
          .eq('id', receivable.id);
      }
    }

    return NextResponse.json({ data: payment }, { status: 201 });

  } catch (error) {
    console.error('Error in payments POST API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}