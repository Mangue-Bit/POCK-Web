'use client'

import { useState, useEffect } from 'react'
import { fetchInference, type ApiInference } from '@/lib/api'

/**
 * Polls /inference/{eventId} every 10 seconds.
 * Returns null while loading or when no snapshot exists yet (404).
 */
export function useInference(eventId: string | null, profile: 'moderate' | 'aggressive' | 'conservative' = 'moderate') {
  const [data, setData] = useState<ApiInference | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!eventId) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function poll() {
      try {
        const result = await fetchInference(eventId!, profile)
        if (!cancelled) {
          setData(result)
          setError(null)
        }
      } catch (e) {
        if (!cancelled) setError('Erro ao carregar análise')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    poll()
    const interval = setInterval(poll, 10000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [eventId, profile])

  return { data, loading, error }
}
