'use client'

import { cn } from '@/lib/utils'
import type { MatchEvent } from '@/lib/types'

interface MatchTimelineProps {
  events: MatchEvent[]
}

function getEventIcon(type: MatchEvent['type']) {
  switch (type) {
    case 'goal':
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </div>
      )
    case 'yellow_card':
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning/20">
          <div className="h-5 w-3.5 rounded-sm bg-warning" />
        </div>
      )
    case 'red_card':
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/20">
          <div className="h-5 w-3.5 rounded-sm bg-destructive" />
        </div>
      )
    case 'substitution':
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-info/20">
          <svg className="h-4 w-4 text-info" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </div>
      )
    case 'var':
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-5/20 text-chart-5 text-xs font-bold">
          VAR
        </div>
      )
    default:
      return null
  }
}

function getEventLabel(type: MatchEvent['type']) {
  switch (type) {
    case 'goal':
      return 'Gol'
    case 'yellow_card':
      return 'Cartão Amarelo'
    case 'red_card':
      return 'Cartão Vermelho'
    case 'substitution':
      return 'Substituição'
    case 'var':
      return 'Revisão VAR'
    default:
      return ''
  }
}

export function MatchTimeline({ events }: MatchTimelineProps) {
  const sortedEvents = [...events].sort((a, b) => b.minute - a.minute)

  return (
    <div className="space-y-4">
      {sortedEvents.map((event, index) => (
        <div
          key={event.id}
          className={cn(
            'flex items-start gap-4',
            event.team === 'away' && 'flex-row-reverse'
          )}
        >
          <div
            className={cn(
              'flex min-w-[60px] items-center gap-2',
              event.team === 'away' && 'flex-row-reverse'
            )}
          >
            <span className="text-sm font-semibold text-primary">{event.minute}&apos;</span>
          </div>

          {getEventIcon(event.type)}

          <div
            className={cn(
              'flex-1 rounded-lg border border-border bg-secondary/30 p-3',
              event.team === 'away' && 'text-right'
            )}
          >
            <p className="text-sm font-medium text-foreground">{event.player}</p>
            <p className="text-xs text-muted-foreground">{getEventLabel(event.type)}</p>
            {event.description && (
              <p className="mt-1 text-xs text-muted-foreground">{event.description}</p>
            )}
          </div>
        </div>
      ))}

      {events.length === 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Nenhum evento registrado ainda
        </div>
      )}
    </div>
  )
}
