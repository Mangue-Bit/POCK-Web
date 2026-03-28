'use client'

import { use } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, SignalIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
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
            <ArrowLeftIcon className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>
    )
  }

  const isLive = match.status === 'live' || match.status === 'halftime'

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 md:py-8 transition-all">
      {/* Back Button */}
      <Link href="/" className="mb-4 md:mb-6 inline-flex">
        <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground h-9 font-bold text-xs uppercase tracking-widest leading-none">
          <ArrowLeftIcon className="h-4 w-4" />
          Voltar
        </Button>
      </Link>

      {/* Match Header */}
      <Card className="mb-6 md:mb-8 overflow-hidden border-border bg-card shadow-xl rounded-2xl md:rounded-3xl">
        <CardContent className="p-0">
          {/* Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border bg-secondary/30 px-4 md:px-6 py-3 gap-3">
            <div className="flex items-center gap-3">
              {isLive && (
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
                </span>
              )}
              <Badge
                className={cn(
                  'text-[10px] md:text-sm font-black italic uppercase tracking-widest',
                  isLive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                )}
              >
                {getStatusLabel(match.status, match.minute)}
              </Badge>
              {isLive && (
                <div className="flex items-center gap-1 text-[10px] md:text-sm font-black text-primary uppercase italic">
                  <SignalIcon className="h-4 w-4 animate-pulse" />
                  <span>Ao Vivo</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 text-[10px] md:text-sm font-bold text-muted-foreground uppercase tracking-tight">
                <ClockIcon className="h-4 w-4 shrink-0" />
                <span>Bundesliga · Rodada {match.round}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'gap-2 h-9 md:h-10 font-bold text-xs uppercase tracking-widest transition-all active:scale-95',
                  isFollowing && 'border-primary text-primary bg-primary/5 shadow-[0_0_10px_rgba(var(--primary),0.1)]'
                )}
                onClick={() =>
                  isFollowing ? unfollowMatch(id) : followMatch(id)
                }
              >
                {isFollowing ? (
                  <>
                    <StarIconSolid className="h-4 w-4 text-primary" />
                    <span className="hidden min-[400px]:inline">Seguindo</span>
                  </>
                ) : (
                  <>
                    <StarIcon className="h-4 w-4" />
                    <span className="hidden min-[400px]:inline">Seguir</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Score Section */}
          <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-8 md:py-10 gap-8 md:gap-4">
            {/* Home Team */}
            <div className="flex flex-row md:flex-col items-center gap-4 flex-1 w-full md:w-auto justify-center md:justify-start">
              <TeamBadge team={match.homeTeam} size="lg" className="md:w-24 md:h-24" />
              <div className="text-left md:text-center w-full md:w-auto">
                <h2 className="text-lg md:text-2xl font-black text-foreground uppercase italic tracking-tighter line-clamp-1">
                  {match.homeTeam.name}
                </h2>
                <p className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-widest">Mandante</p>
              </div>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center gap-2 md:gap-4 px-4 md:px-12 order-first md:order-none w-full md:w-auto">
              <div className="flex items-center gap-4 md:gap-8 bg-neutral-900/50 md:bg-transparent px-8 py-4 md:p-0 rounded-2xl border border-white/5 md:border-none shadow-inner md:shadow-none">
                <span
                  className={cn(
                    'text-5xl md:text-7xl font-black tabular-nums italic tracking-tighter leading-none',
                    match.homeScore > match.awayScore
                      ? 'text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.3)]'
                      : 'text-foreground'
                  )}
                >
                  {match.homeScore}
                </span>
                <span className="text-2xl md:text-4xl font-light text-muted-foreground opacity-30 italic">/</span>
                <span
                  className={cn(
                    'text-5xl md:text-7xl font-black tabular-nums italic tracking-tighter leading-none',
                    match.awayScore > match.homeScore
                      ? 'text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.3)]'
                      : 'text-foreground'
                  )}
                >
                  {match.awayScore}
                </span>
              </div>
              {isLive && (
                <div className="rounded-full bg-primary/10 px-4 py-1.5 text-[10px] md:text-xs font-black text-primary uppercase italic tracking-widest border border-primary/20 animate-pulse">
                  {match.minute}&apos; MINUTO
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex flex-row-reverse md:flex-col items-center gap-4 flex-1 w-full md:w-auto justify-center md:justify-start">
              <TeamBadge team={match.awayTeam} size="lg" className="md:w-24 md:h-24" />
              <div className="text-right md:text-center w-full md:w-auto">
                <h2 className="text-lg md:text-2xl font-black text-foreground uppercase italic tracking-tighter line-clamp-1">
                  {match.awayTeam.name}
                </h2>
                <p className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-widest">Visitante</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="stats" className="space-y-6">
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <TabsList className="flex w-full min-w-[400px] h-12 bg-secondary/50 border border-white/5 p-1 rounded-xl">
            <TabsTrigger value="stats" className="flex-1 font-bold text-xs uppercase tracking-widest">Estatísticas</TabsTrigger>
            <TabsTrigger value="timeline" className="flex-1 font-bold text-xs uppercase tracking-widest">Timeline</TabsTrigger>
            <TabsTrigger value="odds" className="flex-1 font-bold text-xs uppercase tracking-widest">Odds</TabsTrigger>
            <TabsTrigger value="insights" className="flex-1 font-bold text-xs uppercase tracking-widest">Análise IA</TabsTrigger>
          </TabsList>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <TabsContent value="stats" className="mt-0 outline-none">
              <Card className="border-border bg-card rounded-2xl overflow-hidden shadow-lg shadow-black/20">
                <CardHeader className="border-b border-white/5 pb-4">
                  <CardTitle className="text-base md:text-lg font-black uppercase text-foreground italic tracking-tight">
                    Estatísticas da Partida
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <MatchStats
                    stats={match.stats}
                    homeColor={match.homeTeam.primaryColor}
                    awayColor={match.awayTeam.primaryColor}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="mt-0 outline-none">
              <Card className="border-border bg-card rounded-2xl overflow-hidden shadow-lg shadow-black/20">
                <CardHeader className="border-b border-white/5 pb-4">
                  <CardTitle className="text-base md:text-lg font-black uppercase text-foreground italic tracking-tight">
                    Timeline de Eventos
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <MatchTimeline events={match.events} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="odds" className="mt-0 outline-none">
              <Card className="border-border bg-card rounded-2xl overflow-hidden shadow-lg shadow-black/20">
                <CardHeader className="border-b border-white/5 pb-4">
                  <CardTitle className="text-base md:text-lg font-black uppercase text-foreground italic tracking-tight">
                    Principais Odds
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <OddsPanel
                    odds={match.odds}
                    homeTeamName={match.homeTeam.shortName}
                    awayTeamName={match.awayTeam.shortName}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="mt-0 outline-none">
              <Card className="border-border bg-card rounded-2xl overflow-hidden shadow-lg shadow-black/20">
                <CardHeader className="border-b border-white/5 pb-4">
                  <CardTitle className="text-base md:text-lg font-black uppercase text-foreground italic tracking-tight">
                    Análise POCK-IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {insight ? (
                    <MatchInsights insight={insight} />
                  ) : (
                    <div className="py-12 text-center">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground animate-pulse">
                        Insights sendo processados...
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Odds */}
            <Card className="border-border bg-card rounded-2xl shadow-lg">
              <CardHeader className="border-b border-white/5 pb-3">
                <CardTitle className="text-[10px] md:text-xs font-black uppercase text-muted-foreground tracking-widest">
                  Quick Odds
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="flex items-center justify-between rounded-xl bg-secondary/40 p-3 border border-white/5 group transition-all hover:bg-secondary/60">
                  <span className="text-[10px] font-black uppercase text-neutral-500 tracking-tighter">Resultado Final</span>
                  <div className="flex gap-1.5">
                    <Badge variant="outline" className="font-mono text-xs bg-black/20 border-white/5 py-1 px-2">
                      {match.odds.homeWin.toFixed(2)}
                    </Badge>
                    <Badge variant="outline" className="font-mono text-xs bg-black/20 border-white/5 py-1 px-2">
                      {match.odds.draw.toFixed(2)}
                    </Badge>
                    <Badge variant="outline" className="font-mono text-xs bg-black/20 border-white/5 py-1 px-2">
                      {match.odds.awayWin.toFixed(2)}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1.5 rounded-xl bg-secondary/40 p-3 border border-white/5 group hover:bg-secondary/60">
                    <span className="text-[10px] font-black uppercase text-neutral-500 tracking-tighter">Over 2.5</span>
                    <Badge className="bg-primary/10 text-primary font-mono border-0 w-fit text-[11px]">
                      {match.odds.over25.toFixed(2)}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1.5 rounded-xl bg-secondary/40 p-3 border border-white/5 group hover:bg-secondary/60">
                    <span className="text-[10px] font-black uppercase text-neutral-500 tracking-tighter">BTTS</span>
                    <Badge className="bg-primary/10 text-primary font-mono border-0 w-fit text-[11px]">
                      {match.odds.btts.toFixed(2)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Insight Card */}
            {insight && (
              <Card className="border-primary/30 bg-primary/5 rounded-2xl shadow-[0_0_30px_rgba(var(--primary),0.1)] overflow-hidden relative group">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-[10px] font-black uppercase text-primary italic tracking-widest leading-none">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-primary shadow-[0_0_8px_theme(colors.primary)]" />
                    Insight em Tempo Real
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs md:text-sm font-bold text-foreground leading-relaxed">
                    {insight.prediction}
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-primary/10 border border-primary/20">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-primary shadow-[0_0_10px_theme(colors.primary)]"
                        style={{ width: `${insight.probability * 100}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-black text-primary italic leading-none">
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
