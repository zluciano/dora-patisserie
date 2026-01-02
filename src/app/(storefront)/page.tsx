import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="text-center py-12">
      <h1 className="font-serif text-4xl md:text-5xl font-semibold text-brown-800 mb-4">
        Bem-vindo a Dora Patisserie
      </h1>
      <p className="text-lg text-brown-600 mb-8 max-w-2xl mx-auto">
        Delicias artesanais feitas com amor. Macarons, bolos, tortas e muito mais.
      </p>
      <Link href="/menu" className="btn-primary text-lg px-8 py-3">
        Ver Cardapio
      </Link>
    </div>
  )
}
