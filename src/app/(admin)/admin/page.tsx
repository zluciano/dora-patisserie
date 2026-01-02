'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Order } from '@/lib/database.types'
import KanbanBoard from '@/components/admin/KanbanBoard'

const columns = [
  { id: 'pending', title: 'Pendente', color: 'yellow' },
  { id: 'confirmed', title: 'Confirmado', color: 'blue' },
  { id: 'in_progress', title: 'Em Preparo', color: 'purple' },
  { id: 'ready', title: 'Pronto', color: 'green' },
  { id: 'delivered', title: 'Entregue', color: 'gray' },
  { id: 'cancelled', title: 'Cancelado', color: 'red' },
]

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchOrders = useCallback(async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('delivery_date')
      .order('created_at')

    if (error) {
      console.error('Error fetching orders:', error)
    } else if (data) {
      setOrders(data)
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchOrders()

    // Subscribe to realtime updates
    const channel = supabase
      .channel('orders-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchOrders()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchOrders, supabase])

  async function updateOrderStatus(orderId: string, newStatus: string) {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus } as never)
      .eq('id', orderId)

    if (error) {
      console.error('Error updating order status:', error)
      alert('Erro ao atualizar status do pedido')
    }
    // Realtime will trigger refresh
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-brown-500">Carregando pedidos...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-semibold text-brown-800">
          Painel de Pedidos
        </h1>
        <p className="text-brown-600">
          Arraste os pedidos entre as colunas para atualizar o status
        </p>
      </div>

      <KanbanBoard
        columns={columns}
        orders={orders}
        onStatusChange={updateOrderStatus}
      />
    </div>
  )
}
