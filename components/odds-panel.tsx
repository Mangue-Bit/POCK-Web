'use client'

import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon } from '@heroicons/react/20/solid'
import { cn } from '@/lib/utils'
import type { Odds } from '@/lib/types'

interface OddsPanelProps {
  odds: Odds
  homeTeamName: string
  awayTeamName: string
}

interface OddCardProps {
  label: string
  value: number
  trend?: 'up' | 'down' | 'neutral'
  highlight?: boolean
}

function OddCard({ label, value, trend = 'neutral', highlight = false }: OddCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border p-3 transition-colors',
        highlight
          ? 'border-primary bg-primary/10'
          : 'border-border bg-secondary/30 hover:bg-secondary/50'
      )}
    >
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1">
        <span
          className={cn(
            'font-mono text-lg font-bold',
            highlight ? 'text-primary' : 'text-foreground'
          )}
        >
          {value.toFixed(2)}
        </span>
        {trend === 'up' && <ArrowTrendingUpIcon className="h-3 w-3 text-primary" />}
        {trend === 'down' && <ArrowTrendingDownIcon className="h-3 w-3 text-destructive" />}
        {trend === 'neutral' && <MinusIcon className="h-3 w-3 text-muted-foreground" />}
      </div>
    </div>
  )
}

export function OddsPanel({ odds, homeTeamName, awayTeamName }: OddsPanelProps) {
  return (
    <div className="space-y-6">
      {/* Result Odds */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-muted-foreground">Resultado Final</h4>
        <div className="grid grid-cols-3 gap-3">
          <OddCard
            label={homeTeamName}
            value={odds.homeWin}
            trend={odds.homeWin < 2 ? 'down' : 'neutral'}
            highlight={odds.homeWin < odds.awayWin}
          />
          <OddCard label="Empate" value={odds.draw} />
          <OddCard
            label={awayTeamName}
            value={odds.awayWin}
            trend={odds.awayWin < 2 ? 'down' : 'neutral'}
            highlight={odds.awayWin < odds.homeWin}
          />
        </div>
      </div>

      {/* Goals Odds */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-muted-foreground">Total de Gols</h4>
        <div className="grid grid-cols-2 gap-3">
          <OddCard
            label="Mais de 2.5"
            value={odds.over25}
            trend={odds.over25 < 1.5 ? 'down' : 'neutral'}
            highlight={odds.over25 < 1.6}
          />
          <OddCard
            label="Menos de 2.5"
            value={odds.under25}
            trend={odds.under25 < 1.5 ? 'down' : 'neutral'}
          />
        </div>
      </div>

      {/* BTTS Odds */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-muted-foreground">Ambos Marcam</h4>
        <div className="grid grid-cols-2 gap-3">
          <OddCard
            label="Sim"
            value={odds.btts}
            highlight={odds.btts < 1.7}
          />
          <OddCard label="Não" value={odds.bttsNo} />
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-muted-foreground">
        Odds sujeitas a alterações. Aposte com responsabilidade.
      </p>
    </div>
  )
}
