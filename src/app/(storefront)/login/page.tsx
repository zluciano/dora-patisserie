'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    identifier: '', // phone or email
    password: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()

      // Determine if identifier is email or phone
      const isEmail = formData.identifier.includes('@')

      const { error } = await supabase.auth.signInWithPassword({
        ...(isEmail
          ? { email: formData.identifier }
          : { phone: formData.identifier }),
        password: formData.password,
      })

      if (error) throw error
      router.push(redirect)
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao entrar'
      setError(message === 'Invalid login credentials' ? 'Credenciais invalidas' : message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h1 className="font-serif text-2xl font-semibold text-brown-800 mb-6 text-center">
        Entrar
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Telefone ou Email</label>
          <input
            type="text"
            className="input"
            value={formData.identifier}
            onChange={e => setFormData({ ...formData, identifier: e.target.value })}
            placeholder="(11) 99999-9999 ou email@exemplo.com"
            required
          />
        </div>

        <div>
          <label className="label">Senha</label>
          <input
            type="password"
            className="input"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-brown-600">
        Nao tem conta?{' '}
        <Link href="/signup" className="text-rose-600 hover:text-rose-700 font-medium">
          Criar conta
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-12">
      <Suspense fallback={<div className="card animate-pulse h-80" />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
