import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/storefront/ProductCard'
import { Product } from '@/lib/database.types'

export default async function MenuPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('available', true)
    .order('category')
    .order('name') as { data: Product[] | null }

  // Group by category
  const categories = products?.reduce((acc, product) => {
    const cat = product.category || 'Outros'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(product)
    return acc
  }, {} as Record<string, typeof products>) || {}

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-semibold text-brown-800">
          Nosso Cardapio
        </h1>
        <p className="text-brown-600 mt-2">
          Delicias artesanais feitas com amor
        </p>
      </div>

      {Object.keys(categories).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-brown-500">Nenhum produto disponivel no momento.</p>
        </div>
      ) : (
        Object.entries(categories).map(([category, items]) => (
          <section key={category}>
            <h2 className="font-serif text-xl font-medium text-brown-700 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-rose-400 rounded-full" />
              {category}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  )
}
