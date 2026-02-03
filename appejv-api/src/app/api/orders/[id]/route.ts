import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        customer:customer_id(id, name, email, phone, address),
        agent:agent_id(id, name, email, phone),
        quotation:quotation_id(id, customer_name, total_price),
        order_items(
          id,
          product_id,
          product_name,
          quantity,
          unit_price,
          total_price,
          product:product_id(id, name, description, image, price)
        ),
        payments(
          id,
          payment_code,
          amount,
          payment_method,
          payment_date,
          reference_number,
          status,
          notes
        ),
        delivery_tracking(
          id,
          status,
          location,
          description,
          tracking_date,
          created_by
        ),
        accounts_receivable(
          id,
          invoice_code,
          total_amount,
          paid_amount,
          outstanding_amount,
          due_date,
          status,
          payment_terms
        )
      `)
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ data: order });

  } catch (error) {
    console.error('Error in order detail API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      status,
      payment_status,
      delivery_status,
      expected_delivery_date,
      actual_delivery_date,
      notes
    } = body;

    const updateData: any = {};
    
    if (status !== undefined) updateData.status = status;
    if (payment_status !== undefined) updateData.payment_status = payment_status;
    if (delivery_status !== undefined) updateData.delivery_status = delivery_status;
    if (expected_delivery_date !== undefined) updateData.expected_delivery_date = expected_delivery_date;
    if (actual_delivery_date !== undefined) updateData.actual_delivery_date = actual_delivery_date;
    if (notes !== undefined) updateData.notes = notes;

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating order:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If delivery status changed, add tracking record
    if (delivery_status) {
      const statusDescriptions: Record<string, string> = {
        preparing: 'Order is being prepared',
        shipped: 'Order has been shipped',
        in_transit: 'Order is in transit',
        delivered: 'Order has been delivered',
        returned: 'Order has been returned'
      };

      await supabaseAdmin
        .from('delivery_tracking')
        .insert({
          order_id: parseInt(params.id),
          status: delivery_status,
          description: statusDescriptions[delivery_status] || `Status updated to ${delivery_status}`
        });
    }

    return NextResponse.json({ data: order });

  } catch (error) {
    console.error('Error in order update API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabaseAdmin
      .from('orders')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting order:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Order deleted successfully' });

  } catch (error) {
    console.error('Error in order delete API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}