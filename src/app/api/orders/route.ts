import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Order } from '@/lib/database.types'

// GET all orders
export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('delivery_date', { ascending: true })
      .order('created_at', { ascending: false }) as { data: Order[] | null; error: Error | null }

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

interface OrderItemInput {
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  subtotal: number
}

// POST create order
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { items, user_id, ...orderData } = body

    // Calculate total
    const total = items?.reduce((sum: number, item: OrderItemInput) => sum + item.subtotal, 0) || 0

    // Get authenticated user - only set user_id if we have a valid session
    const { data: { user } } = await supabase.auth.getUser()
    const validUserId = user?.id || null

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{ ...orderData, total, user_id: validUserId }] as never)
      .select()
      .single() as { data: Order | null; error: Error | null }

    if (orderError) throw orderError

    // Create order items
    if (items && items.length > 0 && order) {
      const orderItems = items.map((item: OrderItemInput) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems as never)

      if (itemsError) throw itemsError
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error: unknown) {
    console.error('Error creating order:', error)
    // Handle different error formats
    let message = 'Failed to create order'
    if (error && typeof error === 'object') {
      if ('message' in error && typeof error.message === 'string') {
        message = error.message
      } else if ('error' in error && typeof error.error === 'string') {
        message = error.error
      }
    }
    return NextResponse.json({ error: message, details: String(error) }, { status: 500 })
  }
}
