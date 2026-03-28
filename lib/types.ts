export type BettingProfile = 'conservador' | 'moderado' | 'agressivo'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  bettingProfile: BettingProfile
  favoriteTeam: string
  followedMatches: string[]
  createdAt: Date
}

export interface Team {
  id: string
  name: string
  shortName: string
  logo: string
  primaryColor: string
}

export interface MatchStats {
  possession: [number, number]
  shots: [number, number]
  shotsOnTarget: [number, number]
  corners: [number, number]
  fouls: [number, number]
  yellowCards: [number, number]
  redCards: [number, number]
  passes: [number, number]
  passAccuracy: [number, number]
}

export interface Odds {
  homeWin: number
  draw: number
  awayWin: number
  over25: number
  under25: number
  btts: number
  bttsNo: number
}

export interface MatchEvent {
  id: string
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'var'
  minute: number
  team: 'home' | 'away'
  player: string
  description?: string
}

export interface Match {
  id: string
  homeTeam: Team
  awayTeam: Team
  status: 'scheduled' | 'live' | 'finished' | 'halftime'
  minute?: number
  homeScore: number
  awayScore: number
  stats: MatchStats
  odds: Odds
  events: MatchEvent[]
  startTime: Date
  round: number
}

export type InsightType = 'opportunity' | 'warning' | 'info' | 'momentum'

export interface Notification {
  id: string
  matchId: string
  type: InsightType
  title: string
  message: string
  timestamp: Date
  read: boolean
  confidence?: number
  suggestedAction?: string
}

export interface InsightFeature {
  name: string
  value: number
  impact: 'positive' | 'negative' | 'neutral'
  contribution: number
}

export interface MatchInsight {
  matchId: string
  prediction: string
  probability: number
  features: InsightFeature[]
  timestamp: Date
}
export interface QteAction {
  label: string
  action: string
  odds?: number
}

/** Legacy internal QTE type (kept for compatibility) */
export interface QteEvent {
  id: string
  matchId: string
  type: 'goal' | 'card' | 'corner' | 'foul'
  title: string
  message: string
  duration: number
  confidence: number
  actions: QteAction[]
  timestamp: Date
  reasons?: string[]
}

/** QTE type produced by the real EDScript decision engine */
export type ApiQteType = 'GOAL_IMMINENT' | 'OFFENSIVE_SURGE' | 'LATE_GAME_CHAOS'

/** Enriched QTE event built from a real /inference response */
export interface LiveQteEvent {
  id: string
  matchId: string
  apiType: ApiQteType
  teamName: string | null
  teamSide: 'home' | 'away' | null
  confidence: number            // 0–1
  validForSeconds: number
  reasons: string[]
  /** Derived display fields */
  title: string
  message: string
  color: 'red' | 'orange' | 'yellow' | 'green'
  duration: number              // same as validForSeconds, capped for UI
  /** Full inference snapshot (for match display) */
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
}

