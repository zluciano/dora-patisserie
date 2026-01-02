'use client'

import { useState } from 'react'
import { Order } from '@/lib/database.types'
import { formatPrice, formatDate } from '@/lib/utils'

interface Column {
  id: string
  title: string
  color: string
}

interface Props {
  columns: Column[]
  orders: Order[]
  onStatusChange: (orderId: string, newStatus: string) => void
}

const colorClasses: Record<string, string> = {
  yellow: 'bg-yellow-50 border-yellow-200',
  blue: 'bg-blue-50 border-blue-200',
  purple: 'bg-purple-50 border-purple-200',
  green: 'bg-green-50 border-green-200',
  gray: 'bg-gray-50 border-gray-200',
  red: 'bg-red-50 border-red-200',
}

export default function KanbanBoard({ columns, orders, onStatusChange }: Props) {
  const [draggedOrder, setDraggedOrder] = useState<string | null>(null)

  function handleDragStart(e: React.DragEvent, orderId: string) {
    setDraggedOrder(orderId)
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function handleDrop(e: React.DragEvent, columnId: string) {
    e.preventDefault()
    if (draggedOrder) {
      const order = orders.find(o => o.id === draggedOrder)
      if (order && order.status !== columnId) {
        onStatusChange(draggedOrder, columnId)
      }
      setDraggedOrder(null)
    }
  }

  function handleDragEnd() {
    setDraggedOrder(null)
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map(column => {
        const columnOrders = orders.filter(o => o.status === column.id)
        return (
          <div
            key={column.id}
            className={`w-72 shrink-0 rounded-lg border-2 ${colorClasses[column.color]} p-3 min-h-[400px]`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <h3 className="font-medium text-brown-800 mb-3 flex items-center justify-between">
              {column.title}
              <span className="text-sm text-brown-500 bg-white px-2 py-0.5 rounded-full">
                {columnOrders.length}
              </span>
            </h3>

            <div className="space-y-2">
              {columnOrders.map(order => (
                <div
                  key={order.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, order.id)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white rounded-lg shadow-sm p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
                    draggedOrder === order.id ? 'opacity-50' : ''
                  }`}
                >
                  <p className="font-medium text-brown-800 text-sm">
                    {order.customer_name}
                  </p>
                  <p className="text-xs text-brown-500 mt-1">
                    📅 {formatDate(order.delivery_date)}
                  </p>
                  {order.customer_phone && (
                    <p className="text-xs text-brown-500">
                      📞 {order.customer_phone}
                    </p>
                  )}
                  <p className="text-sm font-semibold text-rose-600 mt-2">
                    {formatPrice(order.total)}
                  </p>
                </div>
              ))}

              {columnOrders.length === 0 && (
                <div className="text-center py-8 text-brown-400 text-sm">
                  Nenhum pedido
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
