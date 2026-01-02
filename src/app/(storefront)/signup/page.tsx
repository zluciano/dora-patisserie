'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas nao coincidem')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()

      // Sign up with email or phone
      const signUpData = formData.email
        ? { email: formData.email, password: formData.password }
        : { phone: formData.phone, password: formData.password }

      const { error } = await supabase.auth.signUp({
        ...signUpData,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
          }
        }
      })

      if (error) throw error
      router.push('/account')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="card">
        <h1 className="font-serif text-2xl font-semibold text-brown-800 mb-6 text-center">
          Criar Conta
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Nome *</label>
            <input
              type="text"
              className="input"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label">Telefone *</label>
            <input
              type="tel"
              className="input"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(11) 99999-9999"
              required
            />
          </div>

          <div>
            <label className="label">Email (opcional)</label>
            <input
              type="email"
              className="input"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="label">Senha *</label>
            <input
              type="password"
              className="input"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              minLength={6}
              required
            />
          </div>

          <div>
            <label className="label">Confirmar Senha *</label>
            <input
              type="password"
              className="input"
              value={formData.confirmPassword}
              onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Criando...' : 'Criar Conta'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-brown-600">
          Ja tem conta?{' '}
          <Link href="/login" className="text-rose-600 hover:text-rose-700 font-medium">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
