import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

// GET single order with items
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabase()
    const { id } = await params
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()
    
    if (orderError) throw orderError
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', id)
    
    if (itemsError) throw itemsError

    return NextResponse.json({ 
      ...order,
      items: items || []
    })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

interface OrderItemInput {
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  subtotal: number
}

// PUT update order
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabase()
    const { id } = await params
    const body = await request.json()
    const { items, ...rest } = body
    
    // Build update data
    const updateData: Record<string, unknown> = {}
    if (rest.customer_name !== undefined) updateData.customer_name = rest.customer_name
    if (rest.customer_phone !== undefined) updateData.customer_phone = rest.customer_phone
    if (rest.customer_email !== undefined) updateData.customer_email = rest.customer_email
    if (rest.delivery_address !== undefined) updateData.delivery_address = rest.delivery_address
    if (rest.delivery_date !== undefined) updateData.delivery_date = rest.delivery_date
    if (rest.status !== undefined) updateData.status = rest.status
    if (rest.notes !== undefined) updateData.notes = rest.notes
    
    // Recalculate total if items provided
    if (items) {
      updateData.total = items.reduce((sum: number, item: OrderItemInput) => sum + item.subtotal, 0)
    }
    
    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error

    // Update items if provided
    if (items) {
      // Delete existing items
      await supabase.from('order_items').delete().eq('order_id', id)
      
      // Insert new items
      if (items.length > 0) {
        const orderItems = items.map((item: OrderItemInput) => ({
          order_id: id,
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.subtotal,
        }))
        await supabase.from('order_items').insert(orderItems)
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

// DELETE order
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabase()
    const { id } = await params
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
  }
}
