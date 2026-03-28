// ────────────────────────────────────────────────────────────────
// POCK Mock Simulation Engine (Presentation Mode - Stable Notifs)
// ────────────────────────────────────────────────────────────────

export interface ApiMatch {
  match_id: string
  minute: number
  score: string
  home: string
  away: string
  league: string
  homeLogo?: string
  awayLogo?: string
  stats: {
    attacks: [number, number]
    dangerous_attacks: [number, number]
    possession: [number, number]
    shots_on_target: [number, number]
  }
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
  drift: {
    has_previous: boolean
    l1_sum_abs_delta: number
  } | null
}

export interface ApiNotification {
  id: string
  type: 'goal_alert' | 'pressure_alert' | 'chaos_alert' | 'match_alert'
  message: string
  confidence: number
  timestamp: string
  match_id: string
  triggered_by_qte: boolean
  triggered_by_score: boolean
  qte_events?: ApiQteEvent[]
}

// ─── Internal Mock State ────────────────────────────────────────

const MOCK_START_TIME = Date.now()

function getMinute(offset = 0) {
  const elapsedMinutes = Math.floor((Date.now() - MOCK_START_TIME) / (1000 * 10)) // 10s = 1 min
  return Math.min(89, (23 + offset + elapsedMinutes) % 90)
}

function getMockMatches(): ApiMatch[] {
  const min = getMinute()
  return [
    {
      match_id: 'bay-dor',
      minute: min,
      score: min > 40 ? '1-0' : '0-0',
      home: 'FC Bayern',
      away: 'Borussia Dortmund',
      league: 'Bundesliga',
      homeLogo: '/teams/FC-Bayern.png',
      awayLogo: '/teams/Borussia-Dortmund.png',
      stats: {
        attacks: [88, 72],
        dangerous_attacks: [45, 31],
        possession: [56, 44],
        shots_on_target: [6, 4],
      },
    },
    {
      match_id: 'lev-rbl',
      minute: getMinute(15),
      score: '1-1',
      home: 'Bayer Leverkusen',
      away: 'RB Leipzig',
      league: 'Bundesliga',
      homeLogo: '/teams/Bayer-Leverkusen.png',
      awayLogo: '/teams/RB-Leipzig.png',
      stats: {
        attacks: [110, 95],
        dangerous_attacks: [62, 58],
        possession: [52, 48],
        shots_on_target: [9, 7],
      },
    },
    {
      match_id: 'stu-fra',
      minute: getMinute(42),
      score: '0-2',
      home: 'VfB Stuttgart',
      away: 'Eintracht Frankfurt',
      league: 'Bundesliga',
      homeLogo: '/teams/VfB-Stuttgart.png',
      awayLogo: '/teams/Eintracht-Frankfurt.png',
      stats: {
        attacks: [45, 52],
        dangerous_attacks: [22, 38],
        possession: [48, 52],
        shots_on_target: [2, 5],
      },
    },
    {
      match_id: 'aug-kol',
      minute: getMinute(10),
      score: '1-0',
      home: 'FC Augsburg',
      away: 'FC Köln',
      league: 'Bundesliga',
      homeLogo: '/teams/FC-Augsburg.png',
      awayLogo: '/teams/FC-Koln.png',
      stats: {
        attacks: [65, 60],
        dangerous_attacks: [35, 28],
        possession: [51, 49],
        shots_on_target: [4, 2],
      },
    },
    {
      match_id: 'bre-wol',
      minute: getMinute(60),
      score: '0-0',
      home: 'Werder Bremen',
      away: 'VfL Wolfsburg',
      league: 'Bundesliga',
      homeLogo: '/teams/SV-Werder-Bremen.png',
      awayLogo: '/teams/VfL-Wolfsburg.png',
      stats: {
        attacks: [92, 88],
        dangerous_attacks: [44, 46],
        possession: [50, 50],
        shots_on_target: [5, 5],
      },
    },
    {
      match_id: 'fre-mg',
      minute: getMinute(75),
      score: '2-1',
      home: 'SC Freiburg',
      away: 'Borussia M.',
      league: 'Bundesliga',
      homeLogo: '/teams/SC-Freiburg.png',
      awayLogo: '/teams/Borussia-Mönchengladbach.png',
      stats: {
        attacks: [105, 112],
        dangerous_attacks: [58, 62],
        possession: [46, 54],
        shots_on_target: [7, 8],
      },
    },
  ]
}

// ─── Public API (100% Mocked) ───────────────────────────────────

export async function fetchMatches(): Promise<ApiMatch[]> {
  return getMockMatches()
}

const lastTriggerTime: Record<string, number> = {}

export async function fetchInference(
  eventId: string,
  profile: 'moderate' | 'aggressive' | 'conservative' = 'moderate'
): Promise<ApiInference | null> {
  const match = getMockMatches().find(m => m.match_id === eventId)
  if (!match) return null

  const now = Date.now()
  const lastTime = lastTriggerTime[eventId] ?? 0
  const baseProb = 0.6 + (Math.random() * 0.12) 
  
  // Throttle QTE to only trigger once every 25s
  const shouldTrigger = (now - lastTime > 25000) && (Math.random() < 0.3)
  
  if (shouldTrigger) {
    lastTriggerTime[eventId] = now
  }

  const qteTypes: Array<ApiQteEvent['type']> = ['GOAL_IMMINENT', 'OFFENSIVE_SURGE', 'LATE_GAME_CHAOS']
  const randomType = qteTypes[Math.floor(Math.random() * qteTypes.length)]

  return {
    snapshot_context: {
      home: match.home,
      away: match.away,
      score: match.score,
      minute: match.minute,
      league: match.league,
    },
    decision: {
      trigger: shouldTrigger,
      triggered_by_score: false,
      triggered_by_qte: shouldTrigger,
      score: baseProb,
      threshold: 0.60,
    },
    decision_engine: {
      qte_events: shouldTrigger ? [{
        type: randomType,
        team_name: match.home,
        team_side: 'home',
        confidence: baseProb,
        valid_for_seconds: 45,
        reasons: [
          `O ${match.home} está controlando o jogo com posse agressiva`,
          'Houve um aumento claro nas finalizações de perigo',
          'A defesa agressiva está dando sinais de superioridade'
        ]
      }] : [],
      indicators: {
        offensive_pressure: { home: 0.65, away: 0.34 },
        momentum_index: 0.68,
        game_openness: 0.55,
        deltas: {},
      },
    },
    model_outputs: {
      model_predict: {
        goal_prob: baseProb,
        corner_prob: 0.45,
        pressure_index: 0.68,
        shap_reasons: [
          { label: 'Volume de Ataque', direction: 'Aumenta Chance', contribution_pct: '+15%' },
          { label: 'Posse Ofensiva', direction: 'Aumenta Chance', contribution_pct: '+10%' },
        ]
      },
    },
    shap: {
      predict_has_reasons: true,
      predict_reasons: [
        { label: 'Domínio de campo', direction: 'Aumenta Chance', contribution_pct: '+12%' },
      ],
      expanded: {
        available: true,
        error: null,
        reasons: [
          { label: 'Domínio de campo', direction: 'Aumenta Chance', contribution_pct: '+12%' },
          { label: 'Recuo adversário', direction: 'Aumenta Chance', contribution_pct: '+8%' },
        ]
      }
    },
    drift: null,
  }
}

// Scripted notifications based on mock minutes
const SCRIPTED_NOTIFICATIONS: Array<{ triggerMin: number; data: ApiNotification }> = [
  {
    triggerMin: 23,
    data: {
      id: 'notif-start',
      type: 'match_alert',
      message: 'Olá! Acompanhe os jogos da Bundesliga e receba insights em tempo real com nossa IA.',
      confidence: 0.85,
      timestamp: new Date(MOCK_START_TIME).toISOString(),
      match_id: 'all',
      triggered_by_qte: false,
      triggered_by_score: false,
    }
  },
  {
    triggerMin: 28,
    data: {
      id: 'notif-goal-prob-bayern',
      type: 'goal_alert',
      message: 'Boa chance de gol para o Bayern! O time está pressionando e o volume de finalizações indica uma boa possibilidade de balançar as redes.',
      confidence: 0.71,
      timestamp: new Date(MOCK_START_TIME + 50000).toISOString(),
      match_id: 'bay-dor',
      triggered_by_qte: true,
      triggered_by_score: false,
    }
  },
  {
    triggerMin: 35,
    data: {
      id: 'notif-lev-pressure',
      type: 'pressure_alert',
      message: 'O Leverkusen está com ótimo volume de jogo. Há uma boa possibilidade de escanteios nos próximos minutos devido à pressão constante.',
      confidence: 0.68,
      timestamp: new Date(MOCK_START_TIME + 120000).toISOString(),
      match_id: 'lev-rbl',
      triggered_by_qte: true,
      triggered_by_score: false,
    }
  },
  {
    triggerMin: 55,
    data: {
      id: 'notif-stu-chaos',
      type: 'chaos_alert',
      message: 'Jogo muito aberto em Stuttgart. As falhas defensivas sugerem uma boa chance de gols para quem busca emoção no final da partida.',
      confidence: 0.64,
      timestamp: new Date(MOCK_START_TIME + 320000).toISOString(),
      match_id: 'stu-fra',
      triggered_by_qte: true,
      triggered_by_score: false,
    }
  }
]

export async function fetchNotifications(limit = 20): Promise<ApiNotification[]> {
  const currentMin = getMinute()
  // Only return notifications whose trigger minute has passed
  return SCRIPTED_NOTIFICATIONS
    .filter(n => n.triggerMin <= currentMin)
    .map(n => n.data)
    .reverse() // Newest first
    .slice(0, limit)
}

/** "1:1" or "1-1" → { home: 1, away: 1 } */
export function parseScore(score: string): { home: number; away: number } {
  if (!score) return { home: 0, away: 0 }
  const sep = score.includes(':') ? ':' : '-'
  const [h, a] = score.split(sep).map(s => Number(s.trim()))
  return { home: isNaN(h) ? 0 : h, away: isNaN(a) ? 0 : a }
}
