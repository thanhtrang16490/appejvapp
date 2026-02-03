import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: quotation, error } = await supabaseAdmin
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
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Quotation fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!quotation) {
      return NextResponse.json({ error: 'Quotation not found' }, { status: 404 })
    }

    return NextResponse.json({ data: quotation })
  } catch (error) {
    console.error('Quotation fetch catch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { quotation_items, ...quotationData } = body

    // Update quotation
    const { data: quotation, error: quotationError } = await supabaseAdmin
      .from('quotations')
      .update(quotationData)
      .eq('id', params.id)
      .select()
      .single()

    if (quotationError) {
      console.error('Quotation update error:', quotationError)
      return NextResponse.json({ error: quotationError.message }, { status: 400 })
    }

    // Update quotation items if provided
    if (quotation_items) {
      // Delete existing items
      await supabaseAdmin
        .from('quotation_items')
        .delete()
        .eq('quotation_id', params.id)

      // Insert new items
      if (quotation_items.length > 0) {
        const itemsWithQuotationId = quotation_items.map((item: any) => ({
          ...item,
          quotation_id: parseInt(params.id)
        }))

        const { error: itemsError } = await supabaseAdmin
          .from('quotation_items')
          .insert(itemsWithQuotationId)

        if (itemsError) {
          console.error('Quotation items update error:', itemsError)
          return NextResponse.json({ error: itemsError.message }, { status: 400 })
        }
      }
    }

    // Fetch updated quotation with items
    const { data: updatedQuotation, error: fetchError } = await supabaseAdmin
      .from('quotations')
      .select(`
        *,
        quotation_items (
          *,
          product:products (*)
        )
      `)
      .eq('id', params.id)
      .single()

    if (fetchError) {
      console.error('Updated quotation fetch error:', fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    return NextResponse.json({ data: updatedQuotation })
  } catch (error) {
    console.error('Quotation update catch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabaseAdmin
      .from('quotations')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Quotation deletion error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Quotation deleted successfully' })
  } catch (error) {
    console.error('Quotation deletion catch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}