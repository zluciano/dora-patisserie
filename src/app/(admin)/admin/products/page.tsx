'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Product } from '@/lib/database.types'
import { formatPrice } from '@/lib/utils'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return

    setDeleting(id)
    try {
      const res = await fetch('/api/products/' + id, { method: 'DELETE' })
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id))
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    } finally {
      setDeleting(null)
    }
  }

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || 'Outros'
    if (!acc[category]) acc[category] = []
    acc[category].push(product)
    return acc
  }, {} as Record<string, Product[]>)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-brown-500">Carregando produtos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-brown-800">Produtos</h1>
          <p className="text-brown-600">Gerencie seu catalogo de produtos</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          + Novo Produto
        </Link>
      </div>

      {/* Products list */}
      {products.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-brown-500 mb-4">Nenhum produto cadastrado ainda.</p>
          <Link href="/admin/products/new" className="btn-primary">
            Adicionar primeiro produto
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
            <div key={category}>
              <h2 className="font-serif text-lg font-medium text-brown-700 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-rose-400 rounded-full"></span>
                {category}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryProducts.map((product) => (
                  <div key={product.id} className="card hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-brown-800">{product.name}</h3>
                        <p className="text-sm text-brown-500 line-clamp-2">
                          {product.description || 'Sem descricao'}
                        </p>
                      </div>
                      <span className={product.available
                          ? 'px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700'
                          : 'px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500'
                      }>
                        {product.available ? 'Disponivel' : 'Indisponivel'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-rose-600">
                        {formatPrice(product.price)}
                      </span>
                      <div className="flex gap-2">
                        <Link
                          href={'/admin/products/' + product.id + '/edit'}
                          className="text-sm text-brown-600 hover:text-brown-800"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deleting === product.id}
                          className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
                        >
                          {deleting === product.id ? 'Excluindo...' : 'Excluir'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
