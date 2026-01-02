'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Stats {
  totalOrders: number
  pendingOrders: number
  todayOrders: number
  totalProducts: number
  totalRevenue: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    pendingOrders: 0,
    todayOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const res = await fetch('/api/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { 
      title: 'Pedidos Hoje', 
      value: stats.todayOrders, 
      icon: '📅',
      color: 'bg-rose-100 text-rose-700'
    },
    { 
      title: 'Pedidos Pendentes', 
      value: stats.pendingOrders, 
      icon: '⏳',
      color: 'bg-gold-100 text-gold-700'
    },
    { 
      title: 'Total de Pedidos', 
      value: stats.totalOrders, 
      icon: '📦',
      color: 'bg-cream-200 text-brown-700'
    },
    { 
      title: 'Produtos Cadastrados', 
      value: stats.totalProducts, 
      icon: '🧁',
      color: 'bg-rose-100 text-rose-700'
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="card">
        <h1 className="font-serif text-2xl font-semibold text-brown-800 mb-2">
          Bem-vinda ao Dora Patisserie!
        </h1>
        <p className="text-brown-600">
          Gerencie seus pedidos e produtos de forma simples e organizada.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.title} className="card">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-brown-500">{stat.title}</p>
                <p className="text-2xl font-semibold text-brown-800">
                  {loading ? '...' : stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="card">
        <h2 className="font-serif text-lg font-semibold text-brown-800 mb-4">
          Acoes Rapidas
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/orders/new" className="btn-primary">
            + Novo Pedido
          </Link>
          <Link href="/products/new" className="btn-secondary">
            + Novo Produto
          </Link>
          <Link href="/orders" className="btn-secondary">
            Ver Pedidos
          </Link>
          <Link href="/products" className="btn-secondary">
            Ver Produtos
          </Link>
        </div>
      </div>
    </div>
  )
}
