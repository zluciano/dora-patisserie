'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Product } from '@/lib/database.types'

interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  subtotal: number
}

export default function NewOrderPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [items, setItems] = useState<OrderItem[]>([])
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    delivery_address: '',
    delivery_date: '',
    notes: '',
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data.filter((p: Product) => p.available))
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

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
    
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, items }),
      })

      if (res.ok) {
        router.push('/orders')
      } else {
        alert('Erro ao criar pedido')
      }
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Erro ao criar pedido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/orders" className="text-brown-600 hover:text-brown-800">
          &larr; Voltar para pedidos
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Nome completo"
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
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                placeholder="email@exemplo.com"
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
                placeholder="Rua, numero, bairro..."
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Observacoes</label>
              <textarea
                className="input min-h-[80px]"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Instrucoes especiais, alergias, etc..."
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
            {products.map((product) => (
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
          <button type="submit" className="btn-primary" disabled={loading || items.length === 0}>
            {loading ? 'Criando...' : 'Criar Pedido'}
          </button>
          <Link href="/orders" className="btn-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
