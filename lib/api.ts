// ────────────────────────────────────────────────────────────────
// EDScript API Client
// Base URL: http://127.0.0.1:8000   CORS enabled for all origins
// ────────────────────────────────────────────────────────────────

const BASE = 'http://127.0.0.1:8000'

// ─── Raw API shapes ────────────────────────────────────────────

export interface ApiMatch {
  match_id: string
  minute: number
  score: string          // "1:1"
  home: string
  away: string
  league: string
  stats: {
    attacks: [number, number]
    dangerous_attacks: [number, number]
    possession: [number, number]
    shots_on_target: [number, number]
  }
}

export interface ApiMatchesResponse {
  count: number
  data: ApiMatch[]
}

export interface ApiQteEvent {
  type: 'GOAL_IMMINENT' | 'OFFENSIVE_SURGE' | 'LATE_GAME_CHAOS'
  team_name: string | null
  team_side: 'home' | 'away' | null
  confidence: number
  valid_for_seconds: number
  reasons: string[]
}

export interface ApiInference {
  snapshot_context: {
    home: string
    away: string
    score: string
    minute: number
    league: string
  }
  decision: {
    trigger: boolean
    triggered_by_score: boolean
    triggered_by_qte: boolean
    score: number
    threshold: number
  }
  decision_engine: {
    qte_events: ApiQteEvent[]
    indicators: {
      offensive_pressure: { home: number; away: number }
      momentum_index: number
      game_openness: number
      deltas: Record<string, number>
    }
  }
  model_outputs: {
    model_predict: {
      goal_prob: number
      corner_prob: number
      pressure_index: number
      shap_reasons?: Array<{
        label: string
        direction: string
        contribution_pct: string
      }>
    }
  }
  shap: {
    predict_reasons: Array<{
      label: string
      direction: string
      contribution_pct: string
    }>
    predict_has_reasons: boolean
    expanded?: {
      available: boolean
      error: string | null
      reasons: Array<{
        label: string
        direction: string
        contribution_pct: string
      }>
    }
  }
  normalized_event: {
    stats: {
      attacks: [number, number]
      dangerous_attacks: [number, number]
      possession: [number, number]
      shots_on_target: [number, number]
    }
  }
  drift: {
    has_previous: boolean
    l1_sum_abs_delta: number
  } | null
}

export interface ApiNotification {
  id?: string
  type: 'goal_alert' | 'pressure_alert' | 'chaos_alert' | 'match_alert'
  message: string
  confidence: number
  timestamp: string
  match_id: string
  triggered_by_qte: boolean
  triggered_by_score: boolean
  qte_events: ApiQteEvent[]
  probabilities?: {
    goal_prob?: number
    corner_prob?: number
    pressure_index?: number
  }
}

export interface ApiNotificationsResponse {
  notifications: ApiNotification[]
}

// ─── Fetch helpers ─────────────────────────────────────────────

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`)
  return res.json() as Promise<T>
}

// ─── Public API ────────────────────────────────────────────────

/** GET /matches — returns live matches (only those >= 10 min) */
export async function fetchMatches(): Promise<ApiMatch[]> {
  const data = await get<ApiMatchesResponse>('/matches')
  return data.data ?? []
}

/**
 * GET /inference/{event_id}
 * Returns null if the match doesn't have a snapshot yet (404).
 */
export async function fetchInference(
  eventId: string,
  profile: 'moderate' | 'aggressive' | 'conservative' = 'moderate',
): Promise<ApiInference | null> {
  try {
    const res = await fetch(
      `${BASE}/inference/${eventId}?profile=${profile}&shap_top_n=5`,
      { cache: 'no-store' },
    )
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`inference ${eventId} → ${res.status}`)
    return res.json() as Promise<ApiInference>
  } catch {
    return null
  }
}

/** GET /notifications?limit=20 */
export async function fetchNotifications(limit = 20): Promise<ApiNotification[]> {
  try {
    const data = await get<ApiNotificationsResponse | ApiNotification[]>(
      `/notifications?limit=${limit}`,
    )
    // Backend may return { notifications: [] } or directly []
    if (Array.isArray(data)) return data
    return (data as ApiNotificationsResponse).notifications ?? []
  } catch {
    return []
  }
}

// ─── Parsing helpers ───────────────────────────────────────────

/** "1:1" or "1-1" → { home: 1, away: 1 } — handles both separators */
export function parseScore(score: string): { home: number; away: number } {
  if (!score) return { home: 0, away: 0 }
  // Try ':' first, then '-' (some BetsAPI responses use dashes)
  const sep = score.includes(':') ? ':' : '-'
  const [h, a] = score.split(sep).map(s => Number(s.trim()))
  return { home: isNaN(h) ? 0 : h, away: isNaN(a) ? 0 : a }
}
