'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [createAccount, setCreateAccount] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    deliveryDate: '',
    notes: '',
    password: '',
    confirmPassword: '',
  })

  // Pre-fill form if user is logged in
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        name: profile.name || '',
        phone: profile.phone || '',
        email: profile.email || '',
        address: profile.address || '',
      }))
    }
  }, [profile])

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/menu')
    }
  }, [items, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      let userId = user?.id

      // Create account if requested
      if (!user && createAccount) {
        if (formData.password !== formData.confirmPassword) {
          alert('As senhas nao coincidem')
          setLoading(false)
          return
        }

        if (formData.password.length < 6) {
          alert('A senha deve ter pelo menos 6 caracteres')
          setLoading(false)
          return
        }

        // Sign up with email or phone
        const signUpData = formData.email
          ? { email: formData.email, password: formData.password }
          : { phone: formData.phone, password: formData.password }

        const { data: authData, error: authError } = await supabase.auth.signUp({
          ...signUpData,
          options: {
            data: {
              name: formData.name,
              phone: formData.phone,
              email: formData.email,
            }
          }
        })

        if (authError) {
          alert('Erro ao criar conta: ' + authError.message)
          setLoading(false)
          return
        }
        userId = authData.user?.id
      }

      // Create order items
      const orderItems = items.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
        subtotal: item.product.price * item.quantity,
      }))

      // Create order via API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_email: formData.email || null,
          delivery_address: formData.address,
          delivery_date: formData.deliveryDate,
          notes: formData.notes,
          user_id: userId,
          items: orderItems,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create order')
      }

      clearCart()

      // Redirect based on auth status
      if (user || createAccount) {
        router.push('/account/orders')
      } else {
        router.push('/menu?success=true')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Erro ao finalizar pedido. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return null
  }

  // Get minimum delivery date (tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-serif text-2xl font-semibold text-brown-800 mb-6">
        Finalizar Pedido
      </h1>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        {/* Customer Info */}
        <div className="card space-y-4">
          <h2 className="font-serif text-lg font-medium text-brown-800">
            Seus Dados
          </h2>

          <div>
            <label className="label">Nome *</label>
            <input
              type="text"
              className="input"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label">Telefone *</label>
            <input
              type="tel"
              className="input"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(11) 99999-9999"
              required
            />
          </div>

          <div>
            <label className="label">Email (opcional)</label>
            <input
              type="email"
              className="input"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="label">Endereco de Entrega *</label>
            <textarea
              className="input min-h-[80px]"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              placeholder="Rua, numero, bairro, cidade..."
              required
            />
          </div>

          <div>
            <label className="label">Data de Entrega *</label>
            <input
              type="date"
              className="input"
              value={formData.deliveryDate}
              onChange={e => setFormData({ ...formData, deliveryDate: e.target.value })}
              min={minDate}
              required
            />
          </div>

          <div>
            <label className="label">Observacoes</label>
            <textarea
              className="input min-h-[60px]"
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Instrucoes especiais, alergias..."
            />
          </div>

          {/* Create account option */}
          {!user && (
            <div className="pt-4 border-t border-cream-200">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={createAccount}
                  onChange={e => setCreateAccount(e.target.checked)}
                  className="w-4 h-4 text-rose-500 rounded"
                />
                <span className="text-brown-700">Criar conta para acompanhar pedidos</span>
              </label>

              {createAccount && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="label">Senha *</label>
                    <input
                      type="password"
                      className="input"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      required={createAccount}
                      minLength={6}
                    />
                  </div>
                  <div>
                    <label className="label">Confirmar Senha *</label>
                    <input
                      type="password"
                      className="input"
                      value={formData.confirmPassword}
                      onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required={createAccount}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="card h-fit space-y-4">
          <h2 className="font-serif text-lg font-medium text-brown-800">
            Resumo do Pedido
          </h2>

          <div className="divide-y divide-cream-200">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="py-3 flex justify-between">
                <div>
                  <p className="font-medium text-brown-800">{product.name}</p>
                  <p className="text-sm text-brown-500">
                    {quantity}x {formatPrice(product.price)}
                  </p>
                </div>
                <span className="font-medium text-brown-800">
                  {formatPrice(product.price * quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-cream-200 flex justify-between text-lg font-semibold">
            <span className="text-brown-800">Total</span>
            <span className="text-rose-600">{formatPrice(total)}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? 'Finalizando...' : 'Confirmar Pedido'}
          </button>

          <Link
            href="/menu"
            className="block text-center text-sm text-brown-600 hover:text-brown-800"
          >
            Continuar comprando
          </Link>
        </div>
      </form>
    </div>
  )
}
