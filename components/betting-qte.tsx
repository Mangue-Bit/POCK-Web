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
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useQte } from '@/lib/qte-context'
import { cn } from '@/lib/utils'
import type { LiveQteEvent } from '@/lib/types'

// ─── Color maps ────────────────────────────────────────────────

function getGradient(color: LiveQteEvent['color']) {
  switch (color) {
    case 'red':
      return 'from-red-700 via-red-500 to-red-600'
    case 'orange':
      return 'from-orange-700 via-orange-500 to-orange-600'
    case 'yellow':
      return 'from-yellow-700 via-yellow-500 to-yellow-600'
    case 'green':
    default:
      return 'from-emerald-700 via-emerald-500 to-primary'
  }
}

function getFireColor(color: LiveQteEvent['color']) {
  switch (color) {
    case 'red':
      return 'text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,1)]'
    case 'orange':
      return 'text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,1)]'
    case 'yellow':
      return 'text-yellow-500 drop-shadow-[0_0_20px_rgba(234,179,8,1)]'
    case 'green':
    default:
      return 'text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,1)]'
  }
}

function getTopBorderGradient(color: LiveQteEvent['color']) {
  switch (color) {
    case 'red':
      return 'from-red-700 via-red-500 to-red-300'
    case 'orange':
      return 'from-orange-700 via-orange-500 to-orange-300'
    case 'yellow':
      return 'from-yellow-700 via-yellow-500 to-yellow-300'
    case 'green':
    default:
      return 'from-emerald-600 via-primary to-emerald-400'
  }
}

// ─── Component ─────────────────────────────────────────────────

export function BettingQte() {
  const { activeLiveQte, dismissLiveQte } = useQte()
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isMinified, setIsMinified] = useState(false)
  const [activeQteRefId, setActiveQteRefId] = useState<string | null>(null)

  const activeQte = activeLiveQte

  useEffect(() => {
    if (!activeQte) return

    if (timeLeft === null || activeQte.id !== activeQteRefId) {
      setIsMinified(false)
      setTimeLeft(activeQte.duration)
      setActiveQteRefId(activeQte.id)
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null) return null
        const next = Math.max(0, prev - 0.1)
        if (activeQte.duration - next >= 10 && !isMinified) setIsMinified(true)
        return next
      })
    }, 100)

    return () => clearInterval(timer)
  }, [activeQte, isMinified])

  useEffect(() => {
    if (activeQte && timeLeft !== null && timeLeft <= 0) handleDismiss()
  }, [timeLeft, activeQte])

  const handleDismiss = () => {
    setTimeout(() => dismissLiveQte(), 0)
  }

  if (!activeQte || timeLeft === null) return null

  const progress = (timeLeft / activeQte.duration) * 100
  const confidencePct = Math.round(activeQte.confidence * 100)
  const gradient = getGradient(activeQte.color)
  const fireColor = getFireColor(activeQte.color)
  const topBorder = getTopBorderGradient(activeQte.color)

  function initials(name: string) {
    return name.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase()
  }

  return (
    <>
      {/* MINIFIED NOTIFICATION (Phase 2: After 10s) */}
      {isMinified && activeQte && (
        <div className="fixed top-4 bottom-auto inset-x-4 md:top-auto md:bottom-6 md:left-6 md:right-auto z-[100] animate-in slide-in-from-top-full md:slide-in-from-left-full duration-700 ease-out">
          <div className="group relative flex h-24 md:h-28 w-full md:w-[480px] overflow-hidden rounded-2xl md:rounded-3xl border-2 border-primary/20 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-[0_0_50px_rgba(var(--primary),0.15)] ring-1 ring-white/5">
            {/* Glow */}
            <div className="absolute -left-10 top-0 h-full w-20 bg-primary/20 blur-[40px] animate-pulse" />

            {/* Burning Fuse Progress Bar */}
            <div
              className={cn('absolute bottom-0 left-0 h-2 md:h-2.5 transition-all duration-100 ease-linear bg-gradient-to-r animate-aura-pulse', gradient)}
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 overflow-hidden shimmer-effect rounded-r-full" />
              <div className="absolute right-0 bottom-[-3px] translate-x-[6px]">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-10 w-10 rounded-full animate-aura-pulse pointer-events-none" />
                <div className="animate-fire-float">
                  <FireIcon className={cn('h-6 w-6', fireColor)} />
                </div>
              </div>
            </div>

            <div className="flex w-full items-center p-3 md:p-5 pl-2 md:pl-4 pr-2 md:pr-3 gap-3 md:gap-5">
              {/* Confidence */}
              <div className="flex flex-col items-center justify-center gap-0.5 md:gap-1 min-w-[60px] md:min-w-[70px]">
                <span className="text-lg md:text-xl font-black italic tracking-tighter text-primary leading-none">
                  {confidencePct}%
                </span>
                <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-neutral-500 leading-none">Confiança</span>
              </div>

              {/* Match & Content */}
              <div className="flex flex-1 flex-col justify-center min-w-0">
                <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1">
                  <div className="flex items-center gap-1 rounded bg-primary/10 px-1 py-0.5 border border-primary/20">
                    <span className="text-[7px] md:text-[9px] font-black text-primary uppercase tracking-tighter">LIVE</span>
                  </div>
                  <span className="text-[8px] md:text-[10px] font-black uppercase text-neutral-500 italic tracking-widest truncate">
                    {activeQte.minute}&apos; · {activeQte.league}
                  </span>
                </div>
                <h3 className="text-sm md:text-base font-black italic uppercase tracking-tight text-white line-clamp-1">
                  {activeQte.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 px-1 py-0.5 rounded-lg bg-white/5 border border-white/5 w-fit">
                  <span className="text-[9px] font-black text-neutral-300 italic truncate max-w-[140px]">
                    {activeQte.home} × {activeQte.away}
                  </span>
                </div>
              </div>

              {/* Action + Dismiss */}
              <div className="flex flex-col items-end gap-2 md:gap-3 justify-center min-w-[100px] md:min-w-[120px]">
                <div className="text-[8px] md:text-[10px] font-black text-primary italic uppercase tracking-widest animate-pulse whitespace-nowrap">
                  {Math.ceil(timeLeft)}s RESTANTES
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Button
                    size="sm"
                    className="h-9 md:h-11 gap-1.5 md:gap-2 bg-gradient-to-r from-emerald-600 to-primary px-3 md:px-5 font-black text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:opacity-90 active:scale-95 border-none text-[10px] md:text-sm"
                    onClick={handleDismiss}
                  >
                    APOSTAR <ChevronRightIcon className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                  <button
                    onClick={handleDismiss}
                    className="rounded-full p-1.5 md:p-2 text-neutral-500 hover:bg-white/10 hover:text-white transition-all"
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
      <Dialog open={!!activeQte && !isMinified} onOpenChange={open => { if (!open && activeQte && !isMinified) handleDismiss() }}>
        <DialogContent
          className="p-0 overflow-hidden border-2 border-primary/20 w-[95%] sm:max-w-[480px] bg-[#0c0c0c] text-white rounded-2xl md:rounded-3xl"
          showCloseButton={false}
        >
          {/* Top Glow Border */}
          <div className={cn('absolute top-0 inset-x-0 h-1 bg-gradient-to-r opacity-80', topBorder)} />

          <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-lg md:text-xl font-black uppercase tracking-tight italic">QUICK BET</DialogTitle>
                <div className="hidden min-[400px]:flex ml-1 md:ml-2 items-center gap-1.5 rounded-full bg-primary/10 border border-primary/30 px-2 py-0.5">
                  <div className="h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-primary shadow-[0_0_5px_theme(colors.primary)]" />
                  <span className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-wider">LIVE</span>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <span className="text-[10px] md:text-sm font-black text-primary tabular-nums uppercase">
                  {Math.ceil(timeLeft - (activeQte.duration - 10))}s restam
                </span>
                <button onClick={handleDismiss} className="text-muted-foreground hover:text-white transition-colors">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <DialogDescription className="sr-only">
              Evento detectado: {activeQte.title} — {activeQte.home} vs {activeQte.away}
            </DialogDescription>

            {/* Match Info */}
            <div className="flex items-center justify-center gap-4 md:gap-8 py-2">
              <div className="flex flex-col items-center gap-1 min-w-[80px]">
                <div className="h-14 w-14 rounded-full bg-secondary/40 border border-white/5 flex items-center justify-center text-sm font-black">
                  {initials(activeQte.home)}
                </div>
                <span className="text-[10px] font-black uppercase text-neutral-400 truncate max-w-[80px]">
                  {activeQte.home.split(' ')[0]}
                </span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-3 rounded-xl bg-neutral-800/80 px-4 py-2 text-2xl font-black italic shadow-inner">
                  <span className="text-white">{activeQte.score?.split(':')[0] ?? '0'}</span>
                  <span className="text-neutral-600">—</span>
                  <span className="text-white">{activeQte.score?.split(':')[1] ?? '0'}</span>
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">{activeQte.minute}&apos;</span>
              </div>

              <div className="flex flex-col items-center gap-1 min-w-[80px]">
                <div className="h-14 w-14 rounded-full bg-secondary/40 border border-white/5 flex items-center justify-center text-sm font-black">
                  {initials(activeQte.away)}
                </div>
                <span className="text-[10px] font-black uppercase text-neutral-400 truncate max-w-[80px]">
                  {activeQte.away.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Burning Bar */}
            <div className="space-y-2 md:space-y-3 pb-6">
              <div className="relative h-3 md:h-4 w-full rounded-full bg-neutral-900 overflow-visible">
                <div
                  className={cn('absolute inset-y-0 left-0 rounded-full transition-all duration-100 ease-linear shadow-[0_0_30px_rgba(239,68,68,0.6)] bg-gradient-to-r animate-aura-flash', gradient)}
                  style={{ width: `${((timeLeft - (activeQte.duration - 10)) / 10) * 100}%` }}
                >
                  <div className="absolute inset-0 rounded-full overflow-hidden shimmer-effect" />
                  <div className="absolute right-0 bottom-[-6px] translate-x-[12px]">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-20 rounded-full animate-aura-pulse pointer-events-none" />
                    <div className="animate-fire-float">
                      <FireIcon className={cn('h-10 w-10', fireColor)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Card */}
            <div className="rounded-xl md:rounded-2xl bg-[#141414] p-4 md:p-6 border border-white/5 space-y-4 md:space-y-6">
              <h3 className="text-base md:text-lg font-black leading-snug text-white">{activeQte.message}</h3>

              <div className="flex flex-col min-[450px]:flex-row items-center gap-4 md:gap-8 text-center min-[450px]:text-left">
                <div className="space-y-0 md:space-y-1">
                  <div className="text-5xl md:text-6xl font-black italic tracking-tighter bg-gradient-to-br from-primary to-emerald-400 bg-clip-text text-transparent leading-none">
                    {confidencePct}%
                  </div>
                  <div className="text-[8px] md:text-[10px] font-black uppercase text-neutral-500 tracking-[0.2em]">PROBABILIDADE</div>
                </div>

                <div className="flex-1 w-full space-y-1.5 md:space-y-2">
                  <div className="flex items-center justify-between text-[10px] md:text-xs font-bold">
                    <span className="text-neutral-500 uppercase tracking-wider">TIPO</span>
                    <span className="text-neutral-200">
                      {activeQte.apiType === 'GOAL_IMMINENT'
                        ? '🔴 Gol Iminente'
                        : activeQte.apiType === 'OFFENSIVE_SURGE'
                        ? '🟠 Surge Ofensivo'
                        : '🟡 Caos Final'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] md:text-xs font-bold">
                    <span className="text-neutral-500 uppercase tracking-wider">GOL PROB</span>
                    <span className="text-primary">{Math.round(activeQte.goalProb * 100)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] md:text-xs font-bold">
                    <span className="text-neutral-500 uppercase tracking-wider">MINUTO</span>
                    <span className="text-neutral-200">{activeQte.minute}&apos;</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Generated */}
            {activeQte.reasons.length > 0 && (
              <div className="space-y-3 md:space-y-4">
                <h4 className="text-[9px] md:text-[10px] font-black uppercase text-neutral-500 tracking-[0.2em]">
                  POR QUE ESTE ALERTA FOI GERADO
                </h4>
                <div className="space-y-3 md:space-y-4">
                  {activeQte.reasons.slice(0, 3).map((reason, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex h-7 w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/5">
                        {i === 0 && <ArrowTrendingUpIcon className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />}
                        {i === 1 && <ChartBarIcon className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />}
                        {i === 2 && <BoltIcon className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary fill-current" />}
                      </div>
                      <p className="text-[10px] md:text-[11px] font-bold text-neutral-300 leading-tight">{reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-2 md:space-y-3 pt-2 md:pt-4">
              <Button
                size="lg"
                className="group relative h-14 md:h-16 w-full overflow-hidden bg-gradient-to-r from-emerald-600 to-primary text-base md:text-lg font-black text-primary-foreground hover:opacity-90 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-95 border-none"
                onClick={handleDismiss}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 tracking-widest uppercase italic">
                  APOSTAR AGORA <ChevronRightIcon className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white/5 blur-xl pointer-events-none" />
              </Button>

              <Button
                variant="ghost"
                className="h-10 md:h-12 w-full text-neutral-500 hover:text-primary hover:bg-primary/5 font-bold uppercase tracking-[0.3em] text-[9px] md:text-[10px]"
                onClick={handleDismiss}
              >
                DISPENSAR
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
