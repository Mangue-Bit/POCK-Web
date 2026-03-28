'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import type { LiveQteEvent, ApiQteType } from './types'
import { useUser } from './user-context'
import { fetchMatches, fetchInference, type ApiQteEvent } from './api'

// ─── Helpers ───────────────────────────────────────────────────

function buildLiveQteEvent(
  matchId: string,
  qte: ApiQteEvent,
  ctx: {
    home: string
    away: string
    score: string
    minute: number
    league: string
    goalProb: number
    pressureIndex: number
    decisionScore: number
    triggeredByScore: boolean
    triggeredByQte: boolean
  },
): LiveQteEvent {
  const teamLabel = qte.team_name ?? ''

  const titles: Record<ApiQteType, string> = {
    GOAL_IMMINENT: teamLabel ? `${teamLabel} — Chance de Gol!` : 'Chance de Gol!',
    OFFENSIVE_SURGE: teamLabel ? `${teamLabel} no Ataque!` : 'Ataque Perigoso!',
    LATE_GAME_CHAOS: 'Final Alucinante — Jogo Aberto',
  }

  const messages: Record<ApiQteType, string> = {
    GOAL_IMMINENT: `BOA CHANCE DE GOL! A IA detectou as linhas muito altas e a defesa sob pressão. Há uma boa probabilidade de gol nos próximos lances.`,
    OFFENSIVE_SURGE: `TIME NO ATAQUE! O volume ofensivo subiu e o time está finalizando com perigo. É um ótimo momento para acompanhar este lance.`,
    LATE_GAME_CHAOS: `JOGO ABERTO! As defesas estão cansadas e o jogo ficou lá e cá. Existe uma boa chance de gols rápidos nesse final de partida.`,
  }

  const colors: Record<ApiQteType, LiveQteEvent['color']> = {
    GOAL_IMMINENT: 'red',
    OFFENSIVE_SURGE: 'orange',
    LATE_GAME_CHAOS: 'yellow',
  }

  const duration = Math.min(Math.max(qte.valid_for_seconds, 20), 120)

  return {
    id: `live-qte-${matchId}-${qte.type}-${Date.now()}`,
    matchId,
    apiType: qte.type as ApiQteType,
    teamName: qte.team_name,
    teamSide: qte.team_side,
    confidence: qte.confidence,
    validForSeconds: qte.valid_for_seconds,
    reasons: qte.reasons,
    title: titles[qte.type as ApiQteType],
    message: messages[qte.type as ApiQteType],
    color: colors[qte.type as ApiQteType],
    duration,
    ...ctx,
  }
}

// ─── Context ───────────────────────────────────────────────────

interface QteContextType {
  activeLiveQte: LiveQteEvent | null
  dismissLiveQte: () => void
  /** Live match IDs from /matches (refreshed every 5s) */
  liveMatchIds: string[]
}

const QteContext = createContext<QteContextType | undefined>(undefined)

export function QteProvider({ children }: { children: ReactNode }) {
  const { user } = useUser()
  const [activeLiveQte, setActiveLiveQte] = useState<LiveQteEvent | null>(null)
  const [liveMatchIds, setLiveMatchIds] = useState<string[]>([])

  // Track which QTE keys have already been shown so we don't re-fire duplicates
  const seenQteKeys = useRef<Set<string>>(new Set())
  // Track whether a QTE is currently active (ref for closure safety)
  const activeRef = useRef<LiveQteEvent | null>(null)

  const dismissLiveQte = useCallback(() => {
    setActiveLiveQte(null)
    activeRef.current = null
  }, [])

  // ── Poll /matches every 5s ─────────────────────────────────
  useEffect(() => {
    let cancelled = false

    async function pollMatches() {
      try {
        const matches = await fetchMatches()
        if (!cancelled) {
          setLiveMatchIds(matches.map(m => m.match_id))
        }
      } catch {
        // API not reachable — keep previous list
      }
    }

    pollMatches()
    const interval = setInterval(pollMatches, 5000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  // ── Poll /inference every 10s for followed live matches ────
  useEffect(() => {
    if (liveMatchIds.length === 0) return

    const targets = liveMatchIds.filter(id => user.followedMatches.includes(id))
    if (targets.length === 0) return

    let cancelled = false

    const profileMap: Record<string, 'moderate' | 'aggressive' | 'conservative'> = {
      moderado: 'moderate',
      agressivo: 'aggressive',
      conservador: 'conservative',
    }
    const profile = profileMap[user.bettingProfile] ?? 'moderate'

    async function pollInference() {
      for (const matchId of targets) {
        if (cancelled) break
        try {
          const data = await fetchInference(matchId, profile)
          if (!data || cancelled) continue

          const { decision, decision_engine, snapshot_context, model_outputs } = data

          if (!decision.trigger) continue

          const qteEvents = decision_engine?.qte_events ?? []

          if (qteEvents.length > 0) {
            for (const qte of qteEvents) {
              const key = `${matchId}-${qte.type}-${snapshot_context.minute}`
              if (seenQteKeys.current.has(key)) continue
              seenQteKeys.current.add(key)

              if (activeRef.current) continue

              const event = buildLiveQteEvent(matchId, qte, {
                home: snapshot_context.home,
                away: snapshot_context.away,
                score: snapshot_context.score,
                minute: snapshot_context.minute,
                league: snapshot_context.league,
                goalProb: model_outputs?.model_predict?.goal_prob ?? 0,
                pressureIndex: model_outputs?.model_predict?.pressure_index ?? 0,
                decisionScore: decision.score,
                triggeredByScore: decision.triggered_by_score,
                triggeredByQte: decision.triggered_by_qte,
              })

              setActiveLiveQte(event)
              activeRef.current = event
              break
            }
          } else if (decision.triggered_by_score && !activeRef.current) {
            const key = `${matchId}-score-${snapshot_context.minute}`
            if (!seenQteKeys.current.has(key)) {
              seenQteKeys.current.add(key)

              const syntheticQte: ApiQteEvent = {
                type: 'GOAL_IMMINENT',
                team_name: null,
                team_side: null,
                confidence: decision.score,
                valid_for_seconds: 60,
                reasons: ['Nossa IA detectou um momento importante no jogo', `Força do lance: ${Math.round(decision.score * 100)}%`],
              }

              const event = buildLiveQteEvent(matchId, syntheticQte, {
                home: snapshot_context.home,
                away: snapshot_context.away,
                score: snapshot_context.score,
                minute: snapshot_context.minute,
                league: snapshot_context.league,
                goalProb: model_outputs?.model_predict?.goal_prob ?? 0,
                pressureIndex: model_outputs?.model_predict?.pressure_index ?? 0,
                decisionScore: decision.score,
                triggeredByScore: true,
                triggeredByQte: false,
              })

              const greenEvent: LiveQteEvent = { ...event, color: 'green', title: 'Lance Importante Detectado' }
              setActiveLiveQte(greenEvent)
              activeRef.current = greenEvent
            }
          }
        } catch {
          // ignore per-match errors
        }
      }
    }

    pollInference()
    const interval = setInterval(pollInference, 10000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [liveMatchIds, user.followedMatches, user.bettingProfile])

  return (
    <QteContext.Provider value={{ activeLiveQte, dismissLiveQte, liveMatchIds }}>
      {children}
    </QteContext.Provider>
  )
}

export function useQte() {
  const context = useContext(QteContext)
  if (!context) throw new Error('useQte must be used within a QteProvider')
  return context
}
