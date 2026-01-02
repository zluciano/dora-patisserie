import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface OrderRow {
  id: string
  status: string
  delivery_date: string
  total: number
}

export async function GET() {
  try {
    const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]

    // Get order stats
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, status, delivery_date, total')

    if (ordersError) throw ordersError

    // Get product count
    const { count: totalProducts, error: productsError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    if (productsError) throw productsError

    const ordersList = (orders || []) as OrderRow[]

    const stats = {
      totalOrders: ordersList.length,
      pendingOrders: ordersList.filter(o => o.status === 'pending' || o.status === 'confirmed').length,
      todayOrders: ordersList.filter(o => o.delivery_date === today).length,
      totalProducts: totalProducts || 0,
      totalRevenue: ordersList.reduce((sum, o) => sum + (o.total || 0), 0),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    // Return default stats if Supabase is not configured
    return NextResponse.json({
      totalOrders: 0,
      pendingOrders: 0,
      todayOrders: 0,
      totalProducts: 0,
      totalRevenue: 0,
    })
  }
}
