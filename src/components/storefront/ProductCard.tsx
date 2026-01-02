'use client'

import Link from 'next/link'
import { Product } from '@/lib/database.types'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/utils'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart()

  return (
    <div className="card group hover:shadow-md transition-shadow">
      {/* Image placeholder */}
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-40 object-cover rounded-lg mb-3"
        />
      ) : (
        <div className="w-full h-40 bg-cream-100 rounded-lg mb-3 flex items-center justify-center text-4xl">
          🧁
        </div>
      )}

      <Link href={`/menu/${product.id}`}>
        <h3 className="font-medium text-brown-800 group-hover:text-rose-600 transition-colors">
          {product.name}
        </h3>
      </Link>

      <p className="text-sm text-brown-500 line-clamp-2 mt-1 min-h-[2.5rem]">
        {product.description || 'Delicia artesanal'}
      </p>

      <div className="flex justify-between items-center mt-3">
        <span className="text-lg font-semibold text-rose-600">
          {formatPrice(product.price)}
        </span>
        <button
          onClick={() => addItem(product)}
          className="p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors"
          aria-label={`Adicionar ${product.name} ao carrinho`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  )
}
