import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatDate } from '@/lib/utils'
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

export default async function CustomerOrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="card text-center py-12">
        <p className="text-brown-500">Voce precisa estar logado para ver seus pedidos.</p>
      </div>
    )
  }

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }) as { data: Order[] | null }

  return (
    <div className="card">
      <h2 className="font-serif text-lg font-medium text-brown-800 mb-4">
        Meus Pedidos
      </h2>

      {!orders?.length ? (
        <p className="text-brown-500 text-center py-8">
          Voce ainda nao fez nenhum pedido.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="p-4 bg-cream-50 rounded-lg">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <p className="font-medium text-brown-800">
                    Pedido #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-sm text-brown-500">
                    Entrega: {formatDate(order.delivery_date)}
                  </p>
                  {order.delivery_address && (
                    <p className="text-sm text-brown-500 mt-1">
                      {order.delivery_address}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                  <p className="text-lg font-semibold text-rose-600 mt-1">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>
              {order.notes && (
                <p className="text-sm text-brown-500 mt-2 pt-2 border-t border-cream-200">
                  Obs: {order.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
