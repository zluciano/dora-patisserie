import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import CustomerHeader from '@/components/storefront/CustomerHeader'

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-cream-50">
          <CustomerHeader />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
      </CartProvider>
    </AuthProvider>
  )
}
