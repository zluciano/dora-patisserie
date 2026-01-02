'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

const navItems = [
  { name: 'Pedidos', href: '/admin', icon: '📋' },
  { name: 'Produtos', href: '/admin/products', icon: '🧁' },
  { name: 'Horarios', href: '/admin/hours', icon: '🕐' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { profile, signOut } = useAuth()

  return (
    <aside className="w-64 bg-white border-r border-cream-200 flex flex-col shrink-0">
      {/* Header */}
      <div className="p-6 border-b border-cream-200">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-2xl">🧁</span>
          <div>
            <span className="font-serif text-lg font-semibold text-brown-800 block">
              Dora Patisserie
            </span>
            <span className="text-xs text-brown-500">Painel Admin</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => {
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-rose-100 text-rose-700 font-medium'
                  : 'text-brown-600 hover:bg-cream-100'
              }`}
            >
              <span>{item.icon}</span>
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-cream-200 space-y-2">
        {profile && (
          <div className="px-4 py-2 text-sm text-brown-600">
            {profile.name || 'Admin'}
          </div>
        )}
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 text-sm text-brown-600 hover:text-brown-800 rounded-lg hover:bg-cream-100"
        >
          <span>🏠</span>
          Ver Loja
        </Link>
        <button
          onClick={signOut}
          className="flex items-center gap-2 px-4 py-2 text-sm text-brown-500 hover:text-brown-700 rounded-lg hover:bg-cream-100 w-full text-left"
        >
          <span>🚪</span>
          Sair
        </button>
      </div>
    </aside>
  )
}
