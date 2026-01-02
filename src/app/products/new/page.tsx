'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const categories = ['Macarons', 'Bolos', 'Tortas', 'Paes', 'Doces', 'Bebidas', 'Outros']

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Macarons',
    available: true,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      })

      if (res.ok) {
        router.push('/products')
      } else {
        alert('Erro ao criar produto')
      }
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Erro ao criar produto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/products" className="text-brown-600 hover:text-brown-800">
          &larr; Voltar para produtos
        </Link>
      </div>

      <div className="card">
        <h1 className="font-serif text-2xl font-semibold text-brown-800 mb-6">
          Novo Produto
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Nome do Produto *</label>
            <input
              type="text"
              className="input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Macaron de Framboesa"
              required
            />
          </div>

          <div>
            <label className="label">Descricao</label>
            <textarea
              className="input min-h-[100px]"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva o produto..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Preco (R$) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="input"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="label">Categoria *</label>
              <select
                className="input"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="available"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              className="w-4 h-4 text-rose-500 rounded border-cream-300 focus:ring-rose-400"
            />
            <label htmlFor="available" className="text-brown-700">
              Produto disponivel para venda
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Criar Produto'}
            </button>
            <Link href="/products" className="btn-secondary">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
