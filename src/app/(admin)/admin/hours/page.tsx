'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { WorkingHour } from '@/lib/database.types'

const dayNames = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado']

export default function WorkingHoursPage() {
  const [hours, setHours] = useState<WorkingHour[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<number | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchHours() {
      const { data, error } = await supabase
        .from('working_hours')
        .select('*')
        .order('day_of_week')

      if (error) {
        console.error('Error fetching hours:', error)
      } else if (data) {
        setHours(data)
      }
      setLoading(false)
    }
    fetchHours()
  }, [supabase])

  async function updateHour(id: string, dayOfWeek: number, updates: { is_closed?: boolean; open_time?: string; close_time?: string }) {
    setSaving(dayOfWeek)
    const { error } = await supabase
      .from('working_hours')
      .update(updates as never)
      .eq('id', id)

    if (error) {
      console.error('Error updating hour:', error)
      alert('Erro ao salvar horario')
    } else {
      setHours(hours.map(h => h.id === id ? { ...h, ...updates } : h))
    }
    setSaving(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-brown-500">Carregando horarios...</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-semibold text-brown-800">
          Horarios de Funcionamento
        </h1>
        <p className="text-brown-600">
          Configure os horarios de abertura e fechamento da loja
        </p>
      </div>

      <div className="card space-y-4">
        {hours.map(hour => (
          <div
            key={hour.id}
            className="flex items-center gap-4 py-3 border-b border-cream-100 last:border-0"
          >
            <span className="w-24 font-medium text-brown-800">
              {dayNames[hour.day_of_week]}
            </span>

            <label className="flex items-center gap-2 shrink-0">
              <input
                type="checkbox"
                checked={hour.is_closed}
                onChange={e => updateHour(hour.id, hour.day_of_week, { is_closed: e.target.checked })}
                className="w-4 h-4 text-rose-500 rounded"
              />
              <span className="text-sm text-brown-600">Fechado</span>
            </label>

            {!hour.is_closed && (
              <>
                <input
                  type="time"
                  value={hour.open_time || ''}
                  onChange={e => updateHour(hour.id, hour.day_of_week, { open_time: e.target.value })}
                  className="input w-auto"
                />
                <span className="text-brown-500">ate</span>
                <input
                  type="time"
                  value={hour.close_time || ''}
                  onChange={e => updateHour(hour.id, hour.day_of_week, { close_time: e.target.value })}
                  className="input w-auto"
                />
              </>
            )}

            {saving === hour.day_of_week && (
              <span className="text-xs text-brown-500">Salvando...</span>
            )}
          </div>
        ))}

        {hours.length === 0 && (
          <p className="text-brown-500 text-center py-8">
            Nenhum horario configurado. Execute as migrations primeiro.
          </p>
        )}
      </div>
    </div>
  )
}
