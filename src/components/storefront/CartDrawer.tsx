'use client'

import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/utils'

interface Props {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: Props) {
  const { items, updateQuantity, removeItem, total } = useCart()

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-cream-200">
          <h2 className="font-serif text-xl font-semibold text-brown-800">
            Seu Carrinho
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-brown-500 hover:text-brown-700"
            aria-label="Fechar carrinho"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-brown-500 mb-4">Seu carrinho esta vazio</p>
              <Link
                href="/menu"
                onClick={onClose}
                className="text-rose-600 hover:text-rose-700 font-medium"
              >
                Ver cardapio
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-4 p-3 bg-cream-50 rounded-lg">
                  <div className="w-16 h-16 bg-cream-200 rounded-lg flex items-center justify-center text-2xl shrink-0">
                    🧁
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-brown-800 truncate">{product.name}</h3>
                    <p className="text-sm text-rose-600">{formatPrice(product.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-7 h-7 rounded bg-cream-200 hover:bg-cream-300 text-brown-700 text-sm font-medium"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-7 h-7 rounded bg-cream-200 hover:bg-cream-300 text-brown-700 text-sm font-medium"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="ml-auto text-xs text-red-500 hover:text-red-700"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-cream-200 space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <span className="text-brown-800">Total</span>
              <span className="text-rose-600">{formatPrice(total)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="btn-primary w-full text-center block"
            >
              Finalizar Pedido
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
