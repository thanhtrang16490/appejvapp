import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const order_id = searchParams.get('order_id');
    const status = searchParams.get('status');

    let query = supabaseAdmin
      .from('delivery_tracking')
      .select(`
        *,
        order:order_id(
          id,
          order_code,
          customer_name,
          delivery_status
        ),
        created_by_user:created_by(id, name)
      `)
      .order('tracking_date', { ascending: false });

    // Apply filters
    if (order_id) {
      query = query.eq('order_id', order_id);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data: tracking, error } = await query;

    if (error) {
      console.error('Error fetching delivery tracking:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: tracking });

  } catch (error) {
    console.error('Error in delivery tracking API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      order_id,
      status,
      location,
      description,
      created_by
    } = body;

    // Create tracking record
    const { data: tracking, error: trackingError } = await supabaseAdmin
      .from('delivery_tracking')
      .insert({
        order_id,
        status,
        location,
        description,
        created_by
      })
      .select()
      .single();

    if (trackingError) {
      console.error('Error creating delivery tracking:', trackingError);
      return NextResponse.json({ error: trackingError.message }, { status: 500 });
    }

    // Update order delivery status
    await supabaseAdmin
      .from('orders')
      .update({ delivery_status: status })
      .eq('id', order_id);

    return NextResponse.json({ data: tracking }, { status: 201 });

  } catch (error) {
    console.error('Error in delivery tracking POST API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}