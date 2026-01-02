'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Order } from '@/lib/database.types'

const statusLabels: Record<string, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  in_progress: 'Em Preparo',
  ready: 'Pronto',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-purple-100 text-purple-700',
  ready: 'bg-green-100 text-green-700',
  delivered: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders')
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch('/api/orders/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, status: status as Order['status'] } : o))
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
    })
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-brown-500">Carregando pedidos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-brown-800">Pedidos</h1>
          <p className="text-brown-600">Gerencie os pedidos da sua patisserie</p>
        </div>
        <Link href="/orders/new" className="btn-primary">
          + Novo Pedido
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'px-3 py-1.5 rounded-full text-sm font-medium bg-rose-100 text-rose-700' : 'px-3 py-1.5 rounded-full text-sm font-medium bg-cream-100 text-brown-600 hover:bg-cream-200'}
        >
          Todos ({orders.length})
        </button>
        {Object.entries(statusLabels).map(([key, label]) => {
          const count = orders.filter(o => o.status === key).length
          if (count === 0) return null
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={filter === key ? 'px-3 py-1.5 rounded-full text-sm font-medium bg-rose-100 text-rose-700' : 'px-3 py-1.5 rounded-full text-sm font-medium bg-cream-100 text-brown-600 hover:bg-cream-200'}
            >
              {label} ({count})
            </button>
          )
        })}
      </div>

      {/* Orders list */}
      {orders.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-brown-500 mb-4">Nenhum pedido cadastrado ainda.</p>
          <Link href="/orders/new" className="btn-primary">
            Criar primeiro pedido
          </Link>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-brown-500">Nenhum pedido com este status.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="card hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-brown-800">{order.customer_name}</h3>
                    <span className={'px-2 py-1 rounded-full text-xs font-medium ' + (statusColors[order.status] || 'bg-gray-100 text-gray-600')}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-brown-500">
                    <span>Entrega: {formatDate(order.delivery_date)}</span>
                    {order.customer_phone && <span>Tel: {order.customer_phone}</span>}
                    <span className="font-medium text-rose-600">{formatPrice(order.total)}</span>
                  </div>
                  {order.notes && (
                    <p className="mt-2 text-sm text-brown-600 italic">&ldquo;{order.notes}&rdquo;</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="input py-1 text-sm w-auto"
                  >
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  <Link 
                    href={'/orders/' + order.id + '/edit'}
                    className="text-sm text-brown-600 hover:text-brown-800 px-2"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
