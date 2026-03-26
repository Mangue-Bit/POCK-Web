import type { Team, Match, User, Notification, MatchInsight } from './types'

export const bundesligaTeams: Team[] = [
  { id: 'bay', name: 'Bayern München', shortName: 'BAY', logo: '/teams/bayern.png', primaryColor: '#DC052D' },
  { id: 'bvb', name: 'Borussia Dortmund', shortName: 'BVB', logo: '/teams/dortmund.png', primaryColor: '#FDE100' },
  { id: 'rbl', name: 'RB Leipzig', shortName: 'RBL', logo: '/teams/leipzig.png', primaryColor: '#DD0741' },
  { id: 'b04', name: 'Bayer Leverkusen', shortName: 'B04', logo: '/teams/leverkusen.png', primaryColor: '#E32221' },
  { id: 'sge', name: 'Eintracht Frankfurt', shortName: 'SGE', logo: '/teams/frankfurt.png', primaryColor: '#E1000F' },
  { id: 'wob', name: 'VfL Wolfsburg', shortName: 'WOB', logo: '/teams/wolfsburg.png', primaryColor: '#65B32E' },
  { id: 'bmg', name: 'Borussia Mönchengladbach', shortName: 'BMG', logo: '/teams/gladbach.png', primaryColor: '#000000' },
  { id: 'scf', name: 'SC Freiburg', shortName: 'SCF', logo: '/teams/freiburg.png', primaryColor: '#000000' },
  { id: 'tsg', name: 'TSG Hoffenheim', shortName: 'TSG', logo: '/teams/hoffenheim.png', primaryColor: '#1961B5' },
  { id: 'fcu', name: 'Union Berlin', shortName: 'FCU', logo: '/teams/union.png', primaryColor: '#EB1923' },
]

export const mockMatches: Match[] = [
  {
    id: 'match-1',
    homeTeam: bundesligaTeams[0],
    awayTeam: bundesligaTeams[1],
    status: 'live',
    minute: 67,
    homeScore: 2,
    awayScore: 1,
    startTime: new Date(),
    round: 28,
    stats: {
      possession: [58, 42],
      shots: [14, 8],
      shotsOnTarget: [6, 3],
      corners: [7, 4],
      fouls: [9, 12],
      yellowCards: [1, 2],
      redCards: [0, 0],
      passes: [456, 312],
      passAccuracy: [89, 82],
    },
    odds: {
      homeWin: 1.45,
      draw: 4.50,
      awayWin: 6.00,
      over25: 1.35,
      under25: 3.10,
      btts: 1.65,
      bttsNo: 2.20,
    },
    events: [
      { id: 'e1', type: 'goal', minute: 12, team: 'home', player: 'H. Kane' },
      { id: 'e2', type: 'goal', minute: 34, team: 'away', player: 'J. Brandt' },
      { id: 'e3', type: 'yellow_card', minute: 45, team: 'away', player: 'E. Can' },
      { id: 'e4', type: 'goal', minute: 58, team: 'home', player: 'J. Musiala' },
    ],
  },
  {
    id: 'match-2',
    homeTeam: bundesligaTeams[2],
    awayTeam: bundesligaTeams[3],
    status: 'live',
    minute: 23,
    homeScore: 0,
    awayScore: 0,
    startTime: new Date(),
    round: 28,
    stats: {
      possession: [52, 48],
      shots: [5, 6],
      shotsOnTarget: [2, 2],
      corners: [3, 2],
      fouls: [6, 5],
      yellowCards: [0, 1],
      redCards: [0, 0],
      passes: [189, 175],
      passAccuracy: [86, 84],
    },
    odds: {
      homeWin: 2.10,
      draw: 3.40,
      awayWin: 3.20,
      over25: 1.75,
      under25: 2.05,
      btts: 1.80,
      bttsNo: 1.95,
    },
    events: [
      { id: 'e5', type: 'yellow_card', minute: 18, team: 'away', player: 'J. Tah' },
    ],
  },
  {
    id: 'match-3',
    homeTeam: bundesligaTeams[4],
    awayTeam: bundesligaTeams[5],
    status: 'halftime',
    minute: 45,
    homeScore: 1,
    awayScore: 1,
    startTime: new Date(),
    round: 28,
    stats: {
      possession: [49, 51],
      shots: [8, 7],
      shotsOnTarget: [3, 4],
      corners: [4, 5],
      fouls: [8, 7],
      yellowCards: [1, 1],
      redCards: [0, 0],
      passes: [234, 241],
      passAccuracy: [83, 85],
    },
    odds: {
      homeWin: 2.80,
      draw: 3.20,
      awayWin: 2.60,
      over25: 1.55,
      under25: 2.40,
      btts: 1.50,
      bttsNo: 2.50,
    },
    events: [
      { id: 'e6', type: 'goal', minute: 22, team: 'home', player: 'O. Marmoush' },
      { id: 'e7', type: 'yellow_card', minute: 31, team: 'home', player: 'M. Götze' },
      { id: 'e8', type: 'goal', minute: 38, team: 'away', player: 'L. Nmecha' },
      { id: 'e9', type: 'yellow_card', minute: 42, team: 'away', player: 'M. Arnold' },
    ],
  },
]

export const mockUser: User = {
  id: 'user-1',
  name: 'João Silva',
  email: 'joao.silva@email.com',
  bettingProfile: 'moderado',
  favoriteTeam: 'bay',
  followedMatches: ['match-1', 'match-2', 'match-3'],
  createdAt: new Date('2024-01-15'),
}

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    matchId: 'match-1',
    type: 'opportunity',
    title: 'Alta Probabilidade de Gol',
    message: 'Bayern München com 78% de chance de marcar nos próximos 15 minutos. xG acumulado: 2.4 vs 0.8',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    read: false,
    confidence: 78,
    suggestedAction: 'Considere Over 3.5 gols @ 2.10',
  },
  {
    id: 'notif-2',
    matchId: 'match-2',
    type: 'warning',
    title: 'Pressão do Leverkusen',
    message: 'Bayer Leverkusen dominando a posse nos últimos 10 min. Modelo indica mudança de momentum.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    confidence: 65,
  },
  {
    id: 'notif-3',
    matchId: 'match-3',
    type: 'info',
    title: 'Intervalo - Frankfurt vs Wolfsburg',
    message: 'Estatísticas equilibradas. BTTS já confirmado. Probabilidade de mais gols no 2º tempo: 72%',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    read: true,
    confidence: 72,
  },
  {
    id: 'notif-4',
    matchId: 'match-1',
    type: 'momentum',
    title: 'Momentum Shift Detectado',
    message: 'Dortmund aumentando intensidade. Últimos 5 min: 3 finalizações, 65% posse.',
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    read: true,
    confidence: 58,
  },
  {
    id: 'notif-5',
    matchId: 'match-1',
    type: 'opportunity',
    title: 'Escanteios em Alta',
    message: 'Modelo prevê alta probabilidade de escanteios. Over 10.5 corners @ 1.90 com 71% de confiança.',
    timestamp: new Date(Date.now() - 18 * 60 * 1000),
    read: true,
    confidence: 71,
    suggestedAction: 'Over 10.5 corners @ 1.90',
  },
]

export const mockInsights: MatchInsight[] = [
  {
    matchId: 'match-1',
    prediction: 'Bayern München vence com mais de 2.5 gols',
    probability: 0.73,
    timestamp: new Date(),
    features: [
      { name: 'Chutes no Gol', value: 6, impact: 'positive', contribution: 0.25 },
      { name: 'Posse de Bola', value: 58, impact: 'positive', contribution: 0.18 },
      { name: 'xG Acumulado', value: 2.4, impact: 'positive', contribution: 0.32 },
      { name: 'Histórico H2H', value: 75, impact: 'positive', contribution: 0.15 },
      { name: 'Forma Recente', value: 12, impact: 'positive', contribution: 0.10 },
    ],
  },
]

export function getTeamInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 3)
    .toUpperCase()
}

export function formatOdds(value: number): string {
  return value.toFixed(2)
}

export function getInsightTypeColor(type: string): string {
  switch (type) {
    case 'opportunity':
      return 'bg-primary text-primary-foreground'
    case 'warning':
      return 'bg-warning text-primary-foreground'
    case 'info':
      return 'bg-info text-foreground'
    case 'momentum':
      return 'bg-chart-5 text-foreground'
    default:
      return 'bg-muted text-muted-foreground'
  }
}
