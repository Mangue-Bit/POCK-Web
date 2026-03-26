'use client'

import { Brain, TrendingUp, ChevronRight } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { MatchInsight } from '@/lib/types'

interface MatchInsightsProps {
  insight: MatchInsight
}

function FeatureBar({
  name,
  contribution,
  impact,
}: {
  name: string
  contribution: number
  impact: 'positive' | 'negative' | 'neutral'
}) {
  const percentage = Math.abs(contribution) * 100

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{name}</span>
        <span
          className={cn(
            'font-medium',
            impact === 'positive' && 'text-primary',
            impact === 'negative' && 'text-destructive',
            impact === 'neutral' && 'text-muted-foreground'
          )}
        >
          {impact === 'positive' ? '+' : impact === 'negative' ? '-' : ''}
          {(contribution * 100).toFixed(0)}%
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            impact === 'positive' && 'bg-primary',
            impact === 'negative' && 'bg-destructive',
            impact === 'neutral' && 'bg-muted-foreground'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export function MatchInsights({ insight }: MatchInsightsProps) {
  const probabilityPercent = Math.round(insight.probability * 100)

  return (
    <div className="space-y-6">
      {/* Main Prediction */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-primary">Previsão do Modelo</span>
        </div>
        <p className="mb-4 text-lg font-semibold text-foreground">
          {insight.prediction}
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Confiança</span>
            <span className="font-semibold text-primary">{probabilityPercent}%</span>
          </div>
          <Progress value={probabilityPercent} className="h-2" />
        </div>
      </div>

      {/* SHAP Features */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
          <h4 className="text-sm font-medium text-foreground">
            Fatores de Decisão (SHAP)
          </h4>
        </div>
        <div className="space-y-4">
          {insight.features.map(feature => (
            <FeatureBar
              key={feature.name}
              name={feature.name}
              contribution={feature.contribution}
              impact={feature.impact}
            />
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="rounded-lg border border-border bg-secondary/30 p-4">
        <button className="flex w-full items-center justify-between text-left">
          <span className="text-sm text-muted-foreground">
            Como o modelo chegou a essa conclusão?
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}
