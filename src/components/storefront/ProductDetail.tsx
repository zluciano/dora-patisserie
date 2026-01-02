'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Product } from '@/lib/database.types'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/utils'

interface Props {
  product: Product
}

export default function ProductDetail({ product }: Props) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  function handleAddToCart() {
    addItem(product, quantity)
    setQuantity(1)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/menu" className="text-brown-600 hover:text-brown-800">
          &larr; Voltar ao cardapio
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-80 md:h-96 object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-80 md:h-96 bg-cream-100 rounded-xl flex items-center justify-center text-8xl">
              🧁
            </div>
          )}
        </div>

        {/* Details */}
        <div className="card h-fit">
          <span className="text-sm text-rose-600 font-medium">{product.category}</span>
          <h1 className="font-serif text-3xl font-semibold text-brown-800 mt-1">
            {product.name}
          </h1>

          <p className="text-brown-600 mt-4">
            {product.description || 'Uma delicia artesanal feita com ingredientes selecionados.'}
          </p>

          <div className="mt-6">
            <span className="text-3xl font-bold text-rose-600">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <label className="label">Quantidade</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg bg-cream-100 hover:bg-cream-200 text-brown-700 font-medium text-lg"
              >
                -
              </button>
              <span className="w-12 text-center text-lg font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg bg-cream-100 hover:bg-cream-200 text-brown-700 font-medium text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className="btn-primary w-full mt-6 py-3 text-lg"
          >
            Adicionar ao Carrinho - {formatPrice(product.price * quantity)}
          </button>
        </div>
      </div>
    </div>
  )
}
