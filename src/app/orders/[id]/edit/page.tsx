'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Product, Order, OrderItem } from '@/lib/database.types'

interface OrderItemForm {
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  subtotal: number
}

const statusLabels: Record<string, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  in_progress: 'Em Preparo',
  ready: 'Pronto',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
}

export default function EditOrderPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [items, setItems] = useState<OrderItemForm[]>([])
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    delivery_address: '',
    delivery_date: '',
    notes: '',
    status: 'pending' as Order['status'],
  })

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }, [])

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch('/api/orders/' + id)
      if (res.ok) {
        const data = await res.json()
        setFormData({
          customer_name: data.customer_name,
          customer_phone: data.customer_phone || '',
          customer_email: data.customer_email || '',
          delivery_address: data.delivery_address || '',
          delivery_date: data.delivery_date,
          notes: data.notes || '',
          status: data.status,
        })
        setItems(data.items?.map((item: OrderItem) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.subtotal,
        })) || [])
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchProducts()
    fetchOrder()
  }, [fetchProducts, fetchOrder])

  function addItem(product: Product) {
    const existing = items.find(i => i.product_id === product.id)
    if (existing) {
      setItems(items.map(i => 
        i.product_id === product.id 
          ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.unit_price }
          : i
      ))
    } else {
      setItems([...items, {
        product_id: product.id,
        product_name: product.name,
        quantity: 1,
        unit_price: product.price,
        subtotal: product.price,
      }])
    }
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      setItems(items.filter(i => i.product_id !== productId))
    } else {
      setItems(items.map(i => 
        i.product_id === productId 
          ? { ...i, quantity, subtotal: quantity * i.unit_price }
          : i
      ))
    }
  }

  function removeItem(productId: string) {
    setItems(items.filter(i => i.product_id !== productId))
  }

  const total = items.reduce((sum, item) => sum + item.subtotal, 0)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (items.length === 0) {
      alert('Adicione pelo menos um item ao pedido')
      return
    }
    
    setSaving(true)
    try {
      const res = await fetch('/api/orders/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, items }),
      })

      if (res.ok) {
        router.push('/orders')
      } else {
        alert('Erro ao atualizar pedido')
      }
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Erro ao atualizar pedido')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Tem certeza que deseja excluir este pedido?')) return
    
    setDeleting(true)
    try {
      const res = await fetch('/api/orders/' + id, { method: 'DELETE' })
      if (res.ok) {
        router.push('/orders')
      } else {
        alert('Erro ao excluir pedido')
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      alert('Erro ao excluir pedido')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-brown-500">Carregando pedido...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/orders" className="text-brown-600 hover:text-brown-800">
          &larr; Voltar para pedidos
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="btn-danger"
        >
          {deleting ? 'Excluindo...' : 'Excluir Pedido'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Status */}
        <div className="card">
          <h2 className="font-serif text-xl font-semibold text-brown-800 mb-4">
            Status do Pedido
          </h2>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Order['status'] })}
            className="input w-auto"
          >
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* Customer info */}
        <div className="card">
          <h2 className="font-serif text-xl font-semibold text-brown-800 mb-4">
            Informacoes do Cliente
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Nome do Cliente *</label>
              <input
                type="text"
                className="input"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Telefone</label>
              <input
                type="tel"
                className="input"
                value={formData.customer_phone}
                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Data de Entrega *</label>
              <input
                type="date"
                className="input"
                value={formData.delivery_date}
                onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Endereco de Entrega</label>
              <input
                type="text"
                className="input"
                value={formData.delivery_address}
                onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Observacoes</label>
              <textarea
                className="input min-h-[80px]"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Products selection */}
        <div className="card">
          <h2 className="font-serif text-xl font-semibold text-brown-800 mb-4">
            Adicionar Produtos
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {products.filter(p => p.available).map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => addItem(product)}
                className="text-left p-3 rounded-lg border border-cream-200 hover:border-rose-300 hover:bg-rose-50 transition-colors"
              >
                <div className="font-medium text-brown-800">{product.name}</div>
                <div className="text-sm text-rose-600">{formatPrice(product.price)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Order items */}
        {items.length > 0 && (
          <div className="card">
            <h2 className="font-serif text-xl font-semibold text-brown-800 mb-4">
              Itens do Pedido
            </h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.product_id} className="flex items-center justify-between py-2 border-b border-cream-100 last:border-0">
                  <div className="flex-1">
                    <div className="font-medium text-brown-800">{item.product_name}</div>
                    <div className="text-sm text-brown-500">{formatPrice(item.unit_price)} cada</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 text-brown-700 font-medium"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 text-brown-700 font-medium"
                      >
                        +
                      </button>
                    </div>
                    <div className="w-24 text-right font-medium text-brown-800">
                      {formatPrice(item.subtotal)}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.product_id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 border-t border-cream-200">
                <span className="font-serif text-lg font-semibold text-brown-800">Total</span>
                <span className="text-xl font-bold text-rose-600">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={saving || items.length === 0}>
            {saving ? 'Salvando...' : 'Salvar Alteracoes'}
          </button>
          <Link href="/orders" className="btn-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
