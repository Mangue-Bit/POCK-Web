'use client'

import { useState, useEffect } from 'react'
import { fetchMatches, parseScore, type ApiMatch } from '@/lib/api'

/** UI-ready representation of an API match */
export interface LiveMatch {
  match_id: string
  home: string
  away: string
  homeShort: string
  awayShort: string
  score: string
  homeScore: number
  awayScore: number
  minute: number
  league: string
  status: 'live'
  stats: ApiMatch['stats']
  homeLogo?: string
  awayLogo?: string
}

function toShort(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .substring(0, 3)
    .toUpperCase()
}

function toUi(m: ApiMatch): LiveMatch {
  const { home, away } = parseScore(m.score)
  return {
    match_id: m.match_id,
    home: m.home,
    away: m.away,
    homeShort: toShort(m.home),
    awayShort: toShort(m.away),
    score: m.score,
    homeScore: home,
    awayScore: away,
    minute: m.minute,
    league: m.league,
    status: 'live',
    stats: m.stats,
    homeLogo: m.homeLogo,
    awayLogo: m.awayLogo,
  }
}

/**
 * Polls /matches every 5 seconds and returns the live match list.
 * Returns an empty array while loading or when the API is unreachable.
 */
export function useLiveMatches() {
  const [matches, setMatches] = useState<LiveMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function poll() {
      try {
        const raw = await fetchMatches()
        if (!cancelled) {
          setMatches(raw.map(toUi))
          setError(null)
        }
      } catch (e) {
        if (!cancelled) setError('API indisponível')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    poll()
    const interval = setInterval(poll, 5000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  return { matches, loading, error }
}
