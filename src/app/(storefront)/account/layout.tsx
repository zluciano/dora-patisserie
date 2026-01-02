'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const accountNav = [
  { name: 'Meus Pedidos', href: '/account/orders' },
  { name: 'Meu Perfil', href: '/account/profile' },
]

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-serif text-2xl font-semibold text-brown-800 mb-6">
        Minha Conta
      </h1>
      <div className="flex flex-col md:flex-row gap-6">
        <nav className="md:w-48 shrink-0">
          <div className="card space-y-1">
            {accountNav.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-rose-100 text-rose-700 font-medium'
                    : 'text-brown-600 hover:bg-cream-100'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
