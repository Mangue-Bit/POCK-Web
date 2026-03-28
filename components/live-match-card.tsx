'use client'

import Link from 'next/link'
import { SignalIcon } from '@heroicons/react/24/outline'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { LiveMatch } from '@/hooks/use-live-matches'

interface LiveMatchCardProps {
  match: LiveMatch
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .substring(0, 3)
    .toUpperCase()
}

export function LiveMatchCard({ match }: LiveMatchCardProps) {
  const homeWinning = match.homeScore > match.awayScore
  const awayWinning = match.awayScore > match.homeScore

  return (
    <Link href={`/jogo/${match.match_id}`}>
      <Card className="group cursor-pointer overflow-hidden border-border bg-card transition-all hover:border-primary/50 hover:bg-card/80 rounded-2xl md:rounded-3xl shadow-lg border-white/5 active:scale-[0.98]">
        <CardContent className="p-0">
          {/* Status Bar */}
          <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <Badge className="text-[10px] uppercase font-black italic tracking-widest bg-primary text-primary-foreground">
                {match.minute}&apos;
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-tight truncate max-w-[120px]">
              {match.league}
            </div>
          </div>

          {/* Match Content */}
          <div className="flex items-center justify-between p-4 md:p-6 gap-2">
            {/* Home Team */}
            <div className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-secondary/40 border border-white/5 overflow-hidden">
                {match.homeLogo ? (
                  <img src={match.homeLogo} alt={match.home} className="h-full w-full object-contain p-2" />
                ) : (
                  <span className="text-xs font-black text-foreground">{getInitials(match.home)}</span>
                )}
              </div>
              <span className="text-center text-[10px] md:text-xs font-black text-foreground uppercase italic tracking-tighter">
                {match.homeShort}
              </span>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center gap-1.5 px-2 md:px-4">
              <div className="flex items-center gap-2 md:gap-4 bg-neutral-900/40 px-3 py-1.5 md:px-5 md:py-2 rounded-xl border border-white/5">
                <span
                  className={`text-3xl md:text-5xl font-black tabular-nums italic tracking-tighter leading-none ${
                    homeWinning ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {match.homeScore}
                </span>
                <span className="text-xl md:text-3xl font-light text-neutral-700 opacity-50 italic">/</span>
                <span
                  className={`text-3xl md:text-5xl font-black tabular-nums italic tracking-tighter leading-none ${
                    awayWinning ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {match.awayScore}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[9px] md:text-[10px] font-black text-primary uppercase italic tracking-widest animate-pulse">
                <SignalIcon className="h-3 w-3" />
                <span>Ao Vivo</span>
              </div>
            </div>

            {/* Away Team */}
            <div className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-secondary/40 border border-white/5 overflow-hidden">
                {match.awayLogo ? (
                  <img src={match.awayLogo} alt={match.away} className="h-full w-full object-contain p-2" />
                ) : (
                  <span className="text-xs font-black text-foreground">{getInitials(match.away)}</span>
                )}
              </div>
              <span className="text-center text-[10px] md:text-xs font-black text-foreground uppercase italic tracking-tighter">
                {match.awayShort}
              </span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-px border-t border-border bg-border/50">
            <div className="flex flex-col items-center bg-secondary/20 p-2 md:p-3 transition-colors group-hover:bg-secondary/40">
              <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Posse</span>
              <span className="font-mono text-xs md:text-sm font-bold text-foreground">
                {match.stats.possession[0]}%
              </span>
            </div>
            <div className="flex flex-col items-center bg-secondary/20 p-2 md:p-3 transition-colors group-hover:bg-secondary/40 border-x border-white/5">
              <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Ataques</span>
              <span className="font-mono text-xs md:text-sm font-bold text-foreground">
                {match.stats.attacks[0]}/{match.stats.attacks[1]}
              </span>
            </div>
            <div className="flex flex-col items-center bg-secondary/20 p-2 md:p-3 transition-colors group-hover:bg-secondary/40">
              <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Gol %</span>
              <span className="font-mono text-xs md:text-sm font-bold text-foreground">—</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
