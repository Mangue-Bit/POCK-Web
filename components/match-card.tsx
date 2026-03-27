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
      <Card className="group cursor-pointer overflow-hidden border-border bg-card transition-all hover:border-primary/50 hover:bg-card/80">
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
              <Badge className={cn('text-xs font-medium', getStatusColor(match.status))}>
                {getStatusLabel(match.status, match.minute)}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ClockIcon className="h-3 w-3" />
              <span>Rodada {match.round}</span>
            </div>
          </div>

          {/* Match Content */}
          <div className="flex items-center justify-between p-6">
            {/* Home Team */}
            <div className="flex flex-1 flex-col items-center gap-3">
              <TeamBadge team={match.homeTeam} size="lg" />
              <span className="text-center text-sm font-medium text-foreground">
                {match.homeTeam.shortName}
              </span>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center gap-2 px-6">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'text-4xl font-bold tabular-nums',
                    match.homeScore > match.awayScore
                      ? 'text-primary'
                      : 'text-foreground'
                  )}
                >
                  {match.homeScore}
                </span>
                <span className="text-2xl font-light text-muted-foreground">-</span>
                <span
                  className={cn(
                    'text-4xl font-bold tabular-nums',
                    match.awayScore > match.homeScore
                      ? 'text-primary'
                      : 'text-foreground'
                  )}
                >
                  {match.awayScore}
                </span>
              </div>
              {isLive && (
                <div className="flex items-center gap-1 text-xs text-primary">
                  <SignalIcon className="h-3 w-3 animate-pulse" /> {/* Replaced Radio with SignalIcon and updated class */}
                  <span>Ao Vivo</span>
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex flex-1 flex-col items-center gap-3">
              <TeamBadge team={match.awayTeam} size="lg" />
              <span className="text-center text-sm font-medium text-foreground">
                {match.awayTeam.shortName}
              </span>
            </div>
          </div>

          {/* Quick Odds */}
          <div className="grid grid-cols-3 gap-px border-t border-border bg-border">
            <div className="flex flex-col items-center bg-secondary/50 p-3 transition-colors group-hover:bg-secondary">
              <span className="text-xs text-muted-foreground">Casa</span>
              <span className="font-mono text-sm font-semibold text-foreground">
                {match.odds.homeWin.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col items-center bg-secondary/50 p-3 transition-colors group-hover:bg-secondary">
              <span className="text-xs text-muted-foreground">Empate</span>
              <span className="font-mono text-sm font-semibold text-foreground">
                {match.odds.draw.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col items-center bg-secondary/50 p-3 transition-colors group-hover:bg-secondary">
              <span className="text-xs text-muted-foreground">Fora</span>
              <span className="font-mono text-sm font-semibold text-foreground">
                {match.odds.awayWin.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
