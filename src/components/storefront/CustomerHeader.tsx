'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import CartDrawer from './CartDrawer'

export default function CustomerHeader() {
  const pathname = usePathname()
  const { user, profile, signOut, loading } = useAuth()
  const { itemCount } = useCart()
  const [cartOpen, setCartOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  return (
    <>
      <header className="bg-white shadow-sm border-b border-cream-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🧁</span>
              <span className="font-serif text-xl font-semibold text-brown-800">
                Dora Patisserie
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex gap-6">
              <Link
                href="/menu"
                className={isActive('/menu')
                  ? 'text-rose-600 font-medium'
                  : 'text-brown-600 hover:text-brown-800'
                }
              >
                Cardapio
              </Link>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Cart button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-brown-600 hover:text-brown-800"
                aria-label="Carrinho"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>

              {/* Auth */}
              {loading ? (
                <div className="w-20 h-8 bg-cream-100 rounded animate-pulse" />
              ) : user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/account"
                    className="text-sm text-brown-600 hover:text-brown-800"
                  >
                    Minha Conta
                  </Link>
                  {profile?.role === 'owner' && (
                    <Link
                      href="/admin"
                      className="text-sm text-rose-600 hover:text-rose-700 font-medium"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={signOut}
                    className="text-sm text-brown-500 hover:text-brown-700"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="text-sm text-brown-600 hover:text-brown-800"
                  >
                    Entrar
                  </Link>
                  <Link href="/signup" className="btn-primary text-sm py-1.5 px-3">
                    Criar Conta
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
