'use client'

import Link from 'next/link'
import { ClockIcon, SignalIcon } from '@heroicons/react/24/outline'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Match } from '@/lib/types'
import { TeamBadge } from './team-badge'

interface MatchCardProps {
  match: Match
}

function getStatusLabel(status: Match['status'], minute?: number) {
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

function getStatusColor(status: Match['status']) {
  switch (status) {
    case 'live':
      return 'bg-primary text-primary-foreground'
    case 'halftime':
      return 'bg-warning text-primary-foreground'
    case 'finished':
      return 'bg-muted text-muted-foreground'
    default:
      return 'bg-secondary text-secondary-foreground'
  }
}

export function MatchCard({ match }: MatchCardProps) {
  const isLive = match.status === 'live' || match.status === 'halftime'

  return (
    <Link href={`/jogo/${match.id}`}>
      <Card className="group cursor-pointer overflow-hidden border-border bg-card transition-all hover:border-primary/50 hover:bg-card/80 rounded-2xl md:rounded-3xl shadow-lg border-white/5 active:scale-[0.98]">
        <CardContent className="p-0">
          {/* Status Bar */}
          <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-4 py-2">
            <div className="flex items-center gap-2">
              {isLive && (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
              )}
              <Badge className={cn('text-[10px] uppercase font-black italic tracking-widest', getStatusColor(match.status))}>
                {getStatusLabel(match.status, match.minute)}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
              <ClockIcon className="h-3 w-3" />
              <span>Rodada {match.round}</span>
            </div>
          </div>

          {/* Match Content */}
          <div className="flex items-center justify-between p-4 md:p-6 gap-2">
            {/* Home Team */}
            <div className="flex flex-1 flex-col items-center gap-2">
              <TeamBadge team={match.homeTeam} size="md" className="md:w-16 md:h-16" />
              <span className="text-center text-[10px] md:text-xs font-black text-foreground uppercase italic tracking-tighter">
                {match.homeTeam.shortName}
              </span>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center gap-1.5 px-2 md:px-4">
              <div className="flex items-center gap-2 md:gap-4 bg-neutral-900/40 px-3 py-1.5 md:px-5 md:py-2 rounded-xl border border-white/5 inner-shadow">
                <span
                  className={cn(
                    'text-3xl md:text-5xl font-black tabular-nums italic tracking-tighter leading-none',
                    match.homeScore > match.awayScore
                      ? 'text-primary'
                      : 'text-foreground'
                  )}
                >
                  {match.homeScore}
                </span>
                <span className="text-xl md:text-3xl font-light text-neutral-700 opacity-50 italic">/</span>
                <span
                  className={cn(
                    'text-3xl md:text-5xl font-black tabular-nums italic tracking-tighter leading-none',
                    match.awayScore > match.homeScore
                      ? 'text-primary'
                      : 'text-foreground'
                  )}
                >
                  {match.awayScore}
                </span>
              </div>
              {isLive && (
                <div className="flex items-center gap-1 text-[9px] md:text-[10px] font-black text-primary uppercase italic tracking-widest animate-pulse">
                  <SignalIcon className="h-3 w-3" />
                  <span>Ao Vivo</span>
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex flex-1 flex-col items-center gap-2">
              <TeamBadge team={match.awayTeam} size="md" className="md:w-16 md:h-16" />
              <span className="text-center text-[10px] md:text-xs font-black text-foreground uppercase italic tracking-tighter">
                {match.awayTeam.shortName}
              </span>
            </div>
          </div>

          {/* Quick Odds */}
          <div className="grid grid-cols-3 gap-px border-t border-border bg-border/50">
            <div className="flex flex-col items-center bg-secondary/20 p-2 md:p-3 transition-colors group-hover:bg-secondary/40">
              <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Casa</span>
              <span className="font-mono text-xs md:text-sm font-bold text-foreground">
                {match.odds.homeWin.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col items-center bg-secondary/20 p-2 md:p-3 transition-colors group-hover:bg-secondary/40 border-x border-white/5">
              <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Empate</span>
              <span className="font-mono text-xs md:text-sm font-bold text-foreground">
                {match.odds.draw.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col items-center bg-secondary/20 p-2 md:p-3 transition-colors group-hover:bg-secondary/40">
              <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Fora</span>
              <span className="font-mono text-xs md:text-sm font-bold text-foreground">
                {match.odds.awayWin.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
