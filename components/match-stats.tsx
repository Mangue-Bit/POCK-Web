'use client'

import { cn } from '@/lib/utils'
import type { MatchStats as MatchStatsType } from '@/lib/types'

interface MatchStatsProps {
  stats: MatchStatsType
  homeColor?: string
  awayColor?: string
}

interface StatBarProps {
  label: string
  homeValue: number
  awayValue: number
  format?: 'number' | 'percent'
  homeColor?: string
  awayColor?: string
}

function StatBar({ label, homeValue, awayValue, format = 'number', homeColor, awayColor }: StatBarProps) {
  const total = homeValue + awayValue
  const homePercent = total > 0 ? (homeValue / total) * 100 : 50
  const awayPercent = total > 0 ? (awayValue / total) * 100 : 50

  const formatValue = (value: number) => {
    if (format === 'percent') return `${value}%`
    return value.toString()
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-foreground">{formatValue(homeValue)}</span>
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">{formatValue(awayValue)}</span>
      </div>
      <div className="flex h-2 gap-1 overflow-hidden rounded-full">
        <div
          className={cn('h-full rounded-l-full transition-all duration-500')}
          style={{
            width: `${homePercent}%`,
            backgroundColor: homeColor || 'var(--primary)',
          }}
        />
        <div
          className={cn('h-full rounded-r-full transition-all duration-500')}
          style={{
            width: `${awayPercent}%`,
            backgroundColor: awayColor || 'var(--muted-foreground)',
          }}
        />
      </div>
    </div>
  )
}

export function MatchStats({ stats, homeColor, awayColor }: MatchStatsProps) {
  return (
    <div className="space-y-5">
      <StatBar
        label="Posse de Bola"
        homeValue={stats.possession[0]}
        awayValue={stats.possession[1]}
        format="percent"
        homeColor={homeColor}
        awayColor={awayColor}
      />
      <StatBar
        label="Chutes"
        homeValue={stats.shots[0]}
        awayValue={stats.shots[1]}
        homeColor={homeColor}
        awayColor={awayColor}
      />
      <StatBar
        label="Chutes no Gol"
        homeValue={stats.shotsOnTarget[0]}
        awayValue={stats.shotsOnTarget[1]}
        homeColor={homeColor}
        awayColor={awayColor}
      />
      <StatBar
        label="Escanteios"
        homeValue={stats.corners[0]}
        awayValue={stats.corners[1]}
        homeColor={homeColor}
        awayColor={awayColor}
      />
      <StatBar
        label="Faltas"
        homeValue={stats.fouls[0]}
        awayValue={stats.fouls[1]}
        homeColor={homeColor}
        awayColor={awayColor}
      />
      <StatBar
        label="Cartões Amarelos"
        homeValue={stats.yellowCards[0]}
        awayValue={stats.yellowCards[1]}
        homeColor={homeColor}
        awayColor={awayColor}
      />
      <StatBar
        label="Passes"
        homeValue={stats.passes[0]}
        awayValue={stats.passes[1]}
        homeColor={homeColor}
        awayColor={awayColor}
      />
      <StatBar
        label="Precisão Passes"
        homeValue={stats.passAccuracy[0]}
        awayValue={stats.passAccuracy[1]}
        format="percent"
        homeColor={homeColor}
        awayColor={awayColor}
      />
    </div>
  )
}
