'use client'

import { useEffect, useState } from 'react'
import {
  XMarkIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  BoltIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid'
import { Button } from '@/components/ui/button'
import { TeamBadge } from '@/components/team-badge'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useQte } from '@/lib/qte-context'
import { cn } from '@/lib/utils'
import { mockMatches } from '@/lib/mock-data'

interface CompletedQuickBetSuggestion {
  qteId: string
  matchId: string
  actionLabel: string
  odds?: number
  confidence: number
  minute?: number
  homeTeamShortName?: string
  awayTeamShortName?: string
}

export function BettingQte() {
  const { activeQte, dismissQte } = useQte()
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isMinified, setIsMinified] = useState(false)
  const [isReducing, setIsReducing] = useState(false)
  const [activeQteRefId, setActiveQteRefId] = useState<string | null>(null)
  const [hasTimedOut, setHasTimedOut] = useState(false)
  const [minifiedFireResetKey, setMinifiedFireResetKey] = useState(0)
  const [completedSuggestion, setCompletedSuggestion] = useState<CompletedQuickBetSuggestion | null>(null)
  const [isCompletedSuggestionOpen, setIsCompletedSuggestionOpen] = useState(false)

  const activeMatch = activeQte ? mockMatches.find((match) => match.id === activeQte.matchId) : null
  const primaryAction = activeQte?.actions[0]
  const highlightedOdds = primaryAction?.odds?.toFixed(2) ?? '--'
  const overallProgress = activeQte && timeLeft !== null ? (timeLeft / activeQte.duration) * 100 : 0
  const focusedProgress = activeQte && timeLeft !== null
    ? Math.min(100, Math.max(0, ((timeLeft - 20) / 10) * 100))
    : 0
  const fullViewSecondsLeft = timeLeft !== null ? Math.max(0, Math.ceil(timeLeft - 20)) : 0
  const minifiedSecondsLeft = timeLeft !== null ? Math.max(0, Math.ceil(timeLeft)) : 0

  const handleDismiss = (reason: 'timeout' | 'dismiss' | 'bet' = 'dismiss') => {
    if (reason === 'timeout' && activeQte) {
      const match = mockMatches.find((item) => item.id === activeQte.matchId)
      setCompletedSuggestion({
        qteId: activeQte.id,
        matchId: activeQte.matchId,
        actionLabel: activeQte.actions[0]?.label || 'Sugestao de aposta',
        odds: activeQte.actions[0]?.odds,
        confidence: activeQte.confidence,
        minute: match?.minute,
        homeTeamShortName: match?.homeTeam.shortName,
        awayTeamShortName: match?.awayTeam.shortName,
      })
      setIsCompletedSuggestionOpen(false)
    }

    setTimeout(() => dismissQte(), 0)
  }

  useEffect(() => {
    if (!activeQte) return

    // Reinitialize state for each new quick bet event.
    if (timeLeft === null || activeQte.id !== activeQteRefId) {
      setIsMinified(false)
      setTimeLeft(activeQte.duration)
      setActiveQteRefId(activeQte.id)
      setHasTimedOut(false)
      setIsCompletedSuggestionOpen(false)
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous === null) return null
        const next = Math.max(0, previous - 0.1)

        // Switch to compact mode after 10 seconds from the event start.
        if (activeQte.duration - next >= 10 && !isMinified && !isReducing) {
          setIsReducing(true)
          setTimeout(() => {
            setIsMinified(true)
            setIsReducing(false)
          }, 320)
        }

        return next
      })
    }, 100)

    return () => clearInterval(timer)
  }, [activeQte, isMinified])

  useEffect(() => {
    if (isMinified) {
      setMinifiedFireResetKey((previous) => previous + 1)
    }
  }, [isMinified])

  useEffect(() => {
    if (activeQte && timeLeft !== null && timeLeft <= 0 && !hasTimedOut) {
      setHasTimedOut(true)
      const match = mockMatches.find((item) => item.id === activeQte.matchId)
      setCompletedSuggestion({
        qteId: activeQte.id,
        matchId: activeQte.matchId,
        actionLabel: activeQte.actions[0]?.label || 'Sugestao de aposta',
        odds: activeQte.actions[0]?.odds,
        confidence: activeQte.confidence,
        minute: match?.minute,
        homeTeamShortName: match?.homeTeam.shortName,
        awayTeamShortName: match?.awayTeam.shortName,
      })
      setIsCompletedSuggestionOpen(false)
      setTimeout(() => dismissQte(), 0)
    }
  }, [timeLeft, activeQte, hasTimedOut, dismissQte])

  const completedQuickBetLauncher = !activeQte && completedSuggestion && (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
      {isCompletedSuggestionOpen && (
        <div className="w-[280px] rounded-2xl border border-primary/30 bg-[#0a0a0a]/95 p-4 backdrop-blur-xl shadow-[0_0_40px_rgba(var(--primary),0.2)] animate-in fade-in slide-in-from-left-4 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-primary/80">Sugestao Rapida</p>
              <h4 className="mt-1 text-sm font-black uppercase italic tracking-tight text-white">
                {completedSuggestion.actionLabel}
              </h4>
            </div>
            <button
              onClick={() => setIsCompletedSuggestionOpen(false)}
              className="rounded-full p-1 text-neutral-500 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Fechar sugestao de quick bet"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2">
              <p className="text-[9px] font-black uppercase tracking-widest text-primary/80">Odd</p>
              <p className="text-xl font-black italic tracking-tight text-primary">
                {completedSuggestion.odds?.toFixed(2) ?? '--'}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Confianca</p>
              <p className="text-3xl font-black italic tracking-tight text-white leading-none">
                {completedSuggestion.confidence}%
              </p>
            </div>
          </div>

          <p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-neutral-400">
            {(completedSuggestion.homeTeamShortName && completedSuggestion.awayTeamShortName)
              ? `${completedSuggestion.homeTeamShortName} x ${completedSuggestion.awayTeamShortName}`
              : 'Partida ao vivo'
            }
            {completedSuggestion.minute ? ` · ${completedSuggestion.minute}'` : ''}
          </p>

          <Button
            size="sm"
            className="mt-3 h-10 w-full bg-gradient-to-r from-emerald-600 to-primary text-primary-foreground font-black uppercase tracking-widest hover:opacity-90"
            onClick={() => {
              console.log('Betting from completed quick bet suggestion...')
              setIsCompletedSuggestionOpen(false)
            }}
          >
            Apostar nessa sugestao
          </Button>
        </div>
      )}

      <button
        onClick={() => setIsCompletedSuggestionOpen((previous) => !previous)}
        className={cn(
          'relative h-16 w-16 rounded-2xl border border-primary/35 bg-[#0f0f0f]/95 shadow-[0_0_30px_rgba(var(--primary),0.2)] transition-all',
          'flex flex-col items-center justify-center gap-0.5 backdrop-blur-xl hover:scale-105 hover:border-primary/60 active:scale-95',
          isCompletedSuggestionOpen && 'ring-2 ring-primary/40'
        )}
        aria-label="Abrir sugestao minimizada do quick bet"
      >
        <BoltIcon className="h-5 w-5 text-primary" />
        <span className="text-[8px] font-black uppercase tracking-widest text-primary">QB</span>
      </button>
    </div>
  )

  if (!activeQte || timeLeft === null) {
    return <>{completedQuickBetLauncher}</>
  }

  return (
    <>
      {/* MINIFIED NOTIFICATION (Phase 2: After 10s) */}
      {isMinified && (
        <div className="fixed bottom-4 inset-x-4 md:bottom-6 md:left-6 md:right-auto z-[100] animate-in slide-in-from-bottom-full duration-500 ease-out">
          <div className="group relative flex h-[96px] md:h-28 w-full md:w-[460px] overflow-hidden rounded-2xl md:rounded-3xl border-2 border-primary/20 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-[0_0_35px_rgba(var(--primary),0.12)] ring-1 ring-white/5">
            {/* Pulsing Glow Effect */}
            <div className="absolute -left-10 top-0 h-full w-20 bg-primary/20 blur-[40px] animate-pulse" />

            {/* Burning Fuse Progress Bar at the bottom */}
            <div
              className="absolute bottom-0 left-0 h-2 md:h-2.5 transition-all duration-100 ease-linear bg-gradient-to-r from-red-600 via-red-500 to-red-600 animate-aura-pulse"
              style={{ width: `${overallProgress}%` }}
            >
              <div className="absolute inset-0 overflow-hidden shimmer-effect rounded-r-full" />

              <div
                key={`${activeQte.id}-minified-fire-${minifiedFireResetKey}`}
                className="absolute right-0 bottom-[-6px] translate-x-[4px]"
              >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full animate-aura-pulse pointer-events-none" />
                <FireIcon className="h-5 w-5 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.9)]" />
              </div>
            </div>

            <div className="flex w-full items-center gap-3 p-3 md:p-4">
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className="flex items-center gap-1 rounded bg-primary/10 px-1 py-0.5 border border-primary/20">
                    <span className="text-[7px] md:text-[9px] font-black text-primary uppercase tracking-tighter">Live</span>
                  </div>
                  <span className="text-[8px] md:text-[10px] font-black uppercase text-neutral-500 italic tracking-widest truncate">
                    Minuto {activeMatch?.minute ?? '--'}'
                  </span>
                  <span className="text-[9px] md:text-[10px] font-black uppercase text-primary/90 tracking-wider">
                    {activeQte.confidence}% confianca
                  </span>
                </div>

                <h3 className="text-sm md:text-base font-black italic uppercase tracking-tight text-white line-clamp-1">
                  {primaryAction?.label || 'Oportunidade'}
                </h3>

                {activeMatch && (
                  <div className="flex items-center gap-2 mt-0.5 px-1 py-0.5 rounded-lg bg-white/5 border border-white/5 w-fit">
                    <TeamBadge team={activeMatch.homeTeam} size="sm" />
                    <span className="text-[10px] font-black text-neutral-600 italic">X</span>
                    <TeamBadge team={activeMatch.awayTeam} size="sm" />
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end gap-1.5 md:gap-2">
                <div className="rounded-lg border border-primary/25 bg-primary/10 px-2.5 py-1 text-right">
                  <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-primary/70">Odd</p>
                  <p className="text-base md:text-lg font-black italic leading-none text-primary">{highlightedOdds}</p>
                </div>

                <div className="flex items-center gap-1.5 md:gap-2">
                  <span className="hidden min-[420px]:inline text-[10px] font-black text-primary italic uppercase tracking-widest">
                    {minifiedSecondsLeft}s
                  </span>
                  <Button
                    size="sm"
                    className="h-9 md:h-10 gap-1.5 bg-gradient-to-r from-emerald-600 to-primary px-3 md:px-4 font-black text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:opacity-90 active:scale-95 border-none text-[10px] md:text-xs"
                    onClick={() => {
                      console.log('Instant bet from minified quick bet...')
                      handleDismiss('bet')
                    }}
                  >
                    Apostar <ChevronRightIcon className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>

                  <button
                    onClick={() => handleDismiss('dismiss')}
                    className="rounded-full p-1.5 md:p-2 text-neutral-500 hover:bg-white/10 hover:text-white transition-all"
                    aria-label="Dispensar quick bet"
                  >
                    <XMarkIcon className="h-4 w-4 md:h-5 md:w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIALOG VIEW (Full Alert) */}
      <Dialog
        open={!isMinified}
        onOpenChange={(open) => {
          if (!open && !isMinified) handleDismiss('dismiss')
        }}
      >
        <DialogContent
          className={cn(
            'p-0 overflow-hidden border-2 border-primary/20 w-[calc(100%-1rem)] max-w-[430px] md:max-w-[500px] max-h-[88vh] bg-[#0c0c0c] text-white rounded-2xl',
            isReducing ? 'animate-out fade-out zoom-out-95 duration-300' : 'animate-in fade-in zoom-in-95 duration-300'
          )}
          showCloseButton={false}
        >
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-600 via-primary to-emerald-400 opacity-80" />

          <div className="p-3.5 md:p-5 space-y-4 md:space-y-5 max-h-[calc(88vh-2px)] overflow-y-auto">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-lg md:text-xl font-black uppercase tracking-tight italic">Quick Bet</DialogTitle>
                <div className="hidden min-[400px]:flex ml-1 md:ml-2 items-center gap-1.5 rounded-full bg-primary/10 border border-primary/30 px-2 py-0.5">
                  <div className="h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-primary shadow-[0_0_5px_theme(colors.primary)]" />
                  <span className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-wider">Live</span>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <span className="text-[10px] md:text-sm font-black text-primary tabular-nums uppercase">
                  {fullViewSecondsLeft}s restam
                </span>
                <button
                  onClick={() => handleDismiss('dismiss')}
                  className="text-muted-foreground hover:text-white transition-colors"
                  aria-label="Fechar quick bet"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <DialogDescription className="sr-only">
              Evento em tempo real detectado para {activeMatch?.homeTeam.name} vs {activeMatch?.awayTeam.name}
            </DialogDescription>

            {activeMatch && (
              <div className="flex items-center justify-center gap-3 md:gap-6 py-1.5">
                <div className="flex flex-col items-center gap-1 min-w-[72px]">
                  <TeamBadge team={activeMatch.homeTeam} size="md" />
                  <span className="text-[10px] font-black uppercase text-neutral-400 truncate max-w-[72px]">{activeMatch.homeTeam.shortName}</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2.5 rounded-xl bg-neutral-800/80 px-3 py-1.5 text-xl font-black italic shadow-inner">
                    <span className="text-white">{activeMatch.homeScore}</span>
                    <span className="text-neutral-600">-</span>
                    <span className="text-white">{activeMatch.awayScore}</span>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">{activeMatch.minute}'</span>
                </div>

                <div className="flex flex-col items-center gap-1 min-w-[72px]">
                  <TeamBadge team={activeMatch.awayTeam} size="md" />
                  <span className="text-[10px] font-black uppercase text-neutral-400 truncate max-w-[72px]">{activeMatch.awayTeam.shortName}</span>
                </div>
              </div>
            )}

            <div className="space-y-2 md:space-y-3 pb-6">
              <div className="relative h-3 md:h-4 w-full rounded-full bg-neutral-900 overflow-visible">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-100 ease-linear shadow-[0_0_30px_rgba(239,68,68,0.6)] bg-gradient-to-r from-red-700 via-red-500 to-red-600 animate-aura-flash"
                  style={{ width: `${focusedProgress}%` }}
                >
                  <div className="absolute inset-0 rounded-full overflow-hidden shimmer-effect" />

                  <div className="absolute right-0 bottom-[-6px] translate-x-[12px]">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-20 rounded-full animate-aura-pulse pointer-events-none" />
                    <FireIcon className="h-10 w-10 text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,1)]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[#141414] p-3.5 md:p-5 border border-white/5 space-y-4">
              <h3 className="text-base md:text-lg font-black leading-snug text-white">
                Alta probabilidade de {activeQte.type === 'goal' ? 'gol' : activeQte.type} nos proximos minutos
              </h3>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-center">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500">Confianca prevista</p>
                  <p className="text-5xl md:text-6xl font-black italic tracking-tight text-white leading-none">
                    {activeQte.confidence}%
                  </p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-primary/80">
                    Sinal forte para acao
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 space-y-2">
                  <div className="flex items-center justify-between text-[10px] md:text-xs font-bold">
                    <span className="text-neutral-500 uppercase tracking-wider">Mercado</span>
                    {primaryAction?.label || 'Aposta sugerida'}
                  </div>
                  <div className="flex items-center justify-between text-[10px] md:text-xs font-bold">
                    <span className="text-neutral-500 uppercase tracking-wider">Minuto</span>
                    <span className="text-neutral-200">{activeMatch?.minute || '58'}'</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] md:text-xs font-bold">
                    <span className="text-neutral-500 uppercase tracking-wider">Evento</span>
                    <span className="text-primary uppercase">{activeQte.type}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-black/20 px-2.5 py-2 text-[10px] font-black uppercase tracking-wider text-neutral-300">
                    <span>Odd</span>
                    <span className="text-primary text-sm">{highlightedOdds}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4 rounded-xl border border-primary/20 bg-primary/[0.03] p-3 md:p-4">
              <h4 className="text-[9px] md:text-[10px] font-black uppercase text-neutral-500 tracking-[0.2em]">Por que este alerta foi gerado</h4>
              <div className="space-y-3 md:space-y-4">
                {activeQte.reasons?.map((reason, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex h-7 w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/5">
                      {index === 0 && <ArrowTrendingUpIcon className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />}
                      {index === 1 && <ChartBarIcon className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />}
                      {index === 2 && <BoltIcon className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary fill-current" />}
                    </div>
                    <p className="text-[10px] md:text-[11px] font-bold text-neutral-300 leading-tight">
                      {reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 md:space-y-3 pt-2 md:pt-4">
              <Button
                size="lg"
                className="group relative h-14 md:h-16 w-full overflow-hidden bg-gradient-to-r from-emerald-600 to-primary text-base md:text-lg font-black text-primary-foreground hover:opacity-90 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-95 border-none"
                onClick={() => {
                  console.log('Betting sequence from full quick bet...')
                  handleDismiss('bet')
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 tracking-widest uppercase italic">
                  Apostar agora <ChevronRightIcon className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white/5 blur-xl pointer-events-none" />
              </Button>

              <Button
                variant="ghost"
                className="h-10 md:h-12 w-full text-neutral-500 hover:text-primary hover:bg-primary/5 font-bold uppercase tracking-[0.3em] text-[9px] md:text-[10px]"
                onClick={() => handleDismiss('dismiss')}
              >
                Dispensar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {completedQuickBetLauncher}
    </>
  )
}
