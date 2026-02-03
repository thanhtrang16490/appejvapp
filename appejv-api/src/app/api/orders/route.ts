import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const payment_status = searchParams.get('payment_status');
    const delivery_status = searchParams.get('delivery_status');
    const customer_id = searchParams.get('customer_id');
    const agent_id = searchParams.get('agent_id');
    const search = searchParams.get('search');

    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('orders')
      .select(`
        *,
        customer:customer_id(id, name, email, phone),
        agent:agent_id(id, name, email, phone),
        order_items(
          id,
          product_id,
          product_name,
          quantity,
          unit_price,
          total_price,
          product:product_id(id, name, description, image)
        ),
        payments(
          id,
          payment_code,
          amount,
          payment_method,
          payment_date,
          status
        ),
        accounts_receivable(
          id,
          invoice_code,
          total_amount,
          paid_amount,
          outstanding_amount,
          due_date,
          status
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (payment_status) {
      query = query.eq('payment_status', payment_status);
    }
    if (delivery_status) {
      query = query.eq('delivery_status', delivery_status);
    }
    if (customer_id) {
      query = query.eq('customer_id', customer_id);
    }
    if (agent_id) {
      query = query.eq('agent_id', agent_id);
    }
    if (search) {
      query = query.or(`order_code.ilike.%${search}%,customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%`);
    }

    // Get total count for pagination
    const { count } = await supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact', head: true });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: orders, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data: orders,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Error in orders API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_id,
      agent_id,
      quotation_id,
      customer_name,
      customer_phone,
      customer_email,
      customer_address,
      province,
      district,
      ward,
      items,
      notes,
      expected_delivery_date
    } = body;

    // Generate order code
    const orderCode = `ORD-${Date.now()}`;

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.quantity * item.unit_price), 0);
    const tax_amount = subtotal * 0.1; // 10% tax
    const total_amount = subtotal + tax_amount;

    // Create order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        order_code: orderCode,
        customer_id,
        agent_id,
        quotation_id,
        customer_name,
        customer_phone,
        customer_email,
        customer_address,
        province,
        district,
        ward,
        subtotal,
        tax_amount,
        total_amount,
        expected_delivery_date,
        notes
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.quantity * item.unit_price
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    // Create accounts receivable record
    const invoiceCode = `INV-${Date.now()}`;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); // 30 days payment terms

    const { error: receivableError } = await supabaseAdmin
      .from('accounts_receivable')
      .insert({
        customer_id,
        order_id: order.id,
        invoice_code: invoiceCode,
        total_amount,
        outstanding_amount: total_amount,
        due_date: dueDate.toISOString().split('T')[0],
        payment_terms: 'Net 30'
      });

    if (receivableError) {
      console.error('Error creating accounts receivable:', receivableError);
    }

    // Create initial delivery tracking
    const { error: trackingError } = await supabaseAdmin
      .from('delivery_tracking')
      .insert({
        order_id: order.id,
        status: 'preparing',
        description: 'Order received and being prepared',
        created_by: agent_id
      });

    if (trackingError) {
      console.error('Error creating delivery tracking:', trackingError);
    }

    return NextResponse.json({ data: order }, { status: 201 });

  } catch (error) {
    console.error('Error in orders POST API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}