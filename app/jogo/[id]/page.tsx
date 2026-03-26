'use client'

import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Radio, Clock, Star, StarOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TeamBadge } from '@/components/team-badge'
import { MatchStats } from '@/components/match-stats'
import { MatchTimeline } from '@/components/match-timeline'
import { OddsPanel } from '@/components/odds-panel'
import { MatchInsights } from '@/components/match-insights'
import { useUser } from '@/lib/user-context'
import { mockMatches, mockInsights } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface PageProps {
  params: Promise<{ id: string }>
}

function getStatusLabel(status: string, minute?: number) {
  switch (status) {
    case 'live':
      return `${minute}'`
    case 'halftime':
      return 'Intervalo'
    case 'finished':
      return 'Encerrado'
    default:
      return 'Agendado'
  }
}

export default function MatchPage({ params }: PageProps) {
  const { id } = use(params)
  const { isFollowingMatch, followMatch, unfollowMatch } = useUser()

  const match = mockMatches.find(m => m.id === id)
  const insight = mockInsights.find(i => i.matchId === id)
  const isFollowing = isFollowingMatch(id)

  if (!match) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-foreground">Jogo não encontrado</h1>
        <Link href="/">
          <Button variant="outline" className="mt-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>
    )
  }

  const isLive = match.status === 'live' || match.status === 'halftime'

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Back Button */}
      <Link href="/" className="mb-6 inline-flex">
        <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Voltar aos Jogos
        </Button>
      </Link>

      {/* Match Header */}
      <Card className="mb-8 overflow-hidden border-border bg-card">
        <CardContent className="p-0">
          {/* Status Bar */}
          <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-6 py-3">
            <div className="flex items-center gap-3">
              {isLive && (
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
                </span>
              )}
              <Badge
                className={cn(
                  'text-sm',
                  isLive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                )}
              >
                {getStatusLabel(match.status, match.minute)}
              </Badge>
              {isLive && (
                <div className="flex items-center gap-1 text-sm text-primary">
                  <Radio className="h-4 w-4 animate-pulse-live" />
                  <span>Ao Vivo</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Bundesliga - Rodada {match.round}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'gap-2',
                  isFollowing && 'border-primary text-primary'
                )}
                onClick={() =>
                  isFollowing ? unfollowMatch(id) : followMatch(id)
                }
              >
                {isFollowing ? (
                  <>
                    <Star className="h-4 w-4 fill-current" />
                    Seguindo
                  </>
                ) : (
                  <>
                    <StarOff className="h-4 w-4" />
                    Seguir
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Score Section */}
          <div className="flex items-center justify-between px-8 py-10">
            {/* Home Team */}
            <div className="flex flex-1 flex-col items-center gap-4">
              <TeamBadge team={match.homeTeam} size="xl" />
              <div className="text-center">
                <h2 className="text-xl font-bold text-foreground">
                  {match.homeTeam.name}
                </h2>
                <p className="text-sm text-muted-foreground">Casa</p>
              </div>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center gap-4 px-12">
              <div className="flex items-center gap-6">
                <span
                  className={cn(
                    'text-6xl font-bold tabular-nums',
                    match.homeScore > match.awayScore
                      ? 'text-primary'
                      : 'text-foreground'
                  )}
                >
                  {match.homeScore}
                </span>
                <span className="text-4xl font-light text-muted-foreground">-</span>
                <span
                  className={cn(
                    'text-6xl font-bold tabular-nums',
                    match.awayScore > match.homeScore
                      ? 'text-primary'
                      : 'text-foreground'
                  )}
                >
                  {match.awayScore}
                </span>
              </div>
              {isLive && (
                <div className="rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
                  {match.minute}&apos; minuto
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex flex-1 flex-col items-center gap-4">
              <TeamBadge team={match.awayTeam} size="xl" />
              <div className="text-center">
                <h2 className="text-xl font-bold text-foreground">
                  {match.awayTeam.name}
                </h2>
                <p className="text-sm text-muted-foreground">Fora</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="stats" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-secondary">
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="odds">Odds</TabsTrigger>
          <TabsTrigger value="insights">Insights IA</TabsTrigger>
        </TabsList>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <TabsContent value="stats" className="mt-0">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Estatísticas da Partida
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MatchStats
                    stats={match.stats}
                    homeColor={match.homeTeam.primaryColor}
                    awayColor={match.awayTeam.primaryColor}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="mt-0">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Eventos da Partida
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MatchTimeline events={match.events} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="odds" className="mt-0">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Principais Odds
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <OddsPanel
                    odds={match.odds}
                    homeTeamName={match.homeTeam.shortName}
                    awayTeamName={match.awayTeam.shortName}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="mt-0">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Análise Inteligente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {insight ? (
                    <MatchInsights insight={insight} />
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      Insights ainda não disponíveis para esta partida
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Odds */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm text-foreground">
                  Odds Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                  <span className="text-sm text-muted-foreground">Resultado</span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="font-mono">
                      {match.odds.homeWin.toFixed(2)}
                    </Badge>
                    <Badge variant="outline" className="font-mono">
                      {match.odds.draw.toFixed(2)}
                    </Badge>
                    <Badge variant="outline" className="font-mono">
                      {match.odds.awayWin.toFixed(2)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                  <span className="text-sm text-muted-foreground">Over 2.5</span>
                  <Badge className="bg-primary/10 text-primary font-mono border-0">
                    {match.odds.over25.toFixed(2)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                  <span className="text-sm text-muted-foreground">BTTS</span>
                  <Badge className="bg-primary/10 text-primary font-mono border-0">
                    {match.odds.btts.toFixed(2)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* AI Insight Card */}
            {insight && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm text-primary">
                    <div className="h-2 w-2 animate-pulse-live rounded-full bg-primary" />
                    Insight em Tempo Real
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground leading-relaxed">
                    {insight.prediction}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${insight.probability * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-primary">
                      {Math.round(insight.probability * 100)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  )
}
