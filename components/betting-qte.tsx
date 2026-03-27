'use client'

import { useEffect, useState } from 'react'
import { 
  BoltIcon, 
  XMarkIcon, 
  ArrowTrendingUpIcon, 
  ExclamationCircleIcon, 
  FlagIcon, 
  NoSymbolIcon, 
  FireIcon 
} from '@heroicons/react/24/solid'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useQte } from '@/lib/qte-context'
import { cn } from '@/lib/utils'
import { mockMatches } from '@/lib/mock-data'

export function BettingQte() {
  const { activeQte, dismissQte } = useQte()
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  useEffect(() => {
    if (activeQte) {
      setTimeLeft(activeQte.duration)
      
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev !== null ? Math.max(0, prev - 0.1) : null))
      }, 100)

      return () => clearInterval(timer)
    }
  }, [activeQte])

  // Handle auto-dismiss when time reaches zero
  useEffect(() => {
    if (activeQte && timeLeft !== null && timeLeft <= 0) {
      handleDismiss()
    }
  }, [timeLeft, activeQte])

  const handleDismiss = () => {
    setTimeout(() => dismissQte(), 0)
  }

  if (!activeQte || timeLeft === null) return null

  const progress = (timeLeft / activeQte.duration) * 100
  
  const getQteStyles = (type: string) => {
    switch (type) {
      case 'goal':
        return { 
          color: 'bg-primary', 
          foreground: 'text-primary-foreground', 
          bg: 'bg-primary/5', 
          icon: BoltIcon 
        }
      case 'card':
        return { 
          color: 'bg-orange-500', 
          foreground: 'text-white', 
          bg: 'bg-orange-500/10', 
          icon: ExclamationCircleIcon 
        }
      case 'corner':
        return { 
          color: 'bg-blue-500', 
          foreground: 'text-white', 
          bg: 'bg-blue-500/10', 
          icon: FlagIcon 
        }
      case 'foul':
        return { 
          color: 'bg-destructive', 
          foreground: 'text-destructive-foreground', 
          bg: 'bg-destructive/10', 
          icon: NoSymbolIcon 
        }
      default:
        return { 
          color: 'bg-primary', 
          foreground: 'text-primary-foreground', 
          bg: 'bg-primary/5', 
          icon: BoltIcon 
        }
    }
  }

  const styles = getQteStyles(activeQte.type)
  const Icon = styles.icon
  
  const match = mockMatches.find(m => m.id === activeQte.matchId)

  return (
    <Dialog open={!!activeQte} onOpenChange={(open) => {
      if (!open && activeQte) {
        handleDismiss()
      }
    }}>
      <DialogContent 
        className="p-0 overflow-hidden border-none sm:max-w-[750px] shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        showCloseButton={false}
      >
        <div className={cn(
          "w-full transition-all duration-300 bg-card",
          !activeQte && "pointer-events-none"
        )}>
          {/* Header with Background Glow */}
          <div className={cn(
            "relative p-6 pb-4 border-b border-border/50",
            styles.bg
          )}>
            <div className="flex items-center">
              <div className="flex items-center justify-start w-full gap-8 py-2">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full animate-pulse shadow-lg",
                    styles.color,
                    styles.foreground
                  )}>
                    <Icon className="h-6 w-6 fill-current" />
                  </div>
                  <DialogHeader className="flex flex-col items-start gap-0">
                    <DialogTitle className="text-4xl font-black uppercase tracking-tighter text-foreground leading-none">
                      {activeQte.title}
                    </DialogTitle>
                  </DialogHeader>
                </div>

                <div className="h-10 w-px bg-border/50 hidden sm:block" />

                {match && (
                  <div className="flex items-center gap-4">
                    <img src={match.homeTeam.logo} alt="" className="h-12 w-12 object-contain drop-shadow-md" />
                    <span className="text-lg font-black text-primary/30 italic">VS</span>
                    <img src={match.awayTeam.logo} alt="" className="h-12 w-12 object-contain drop-shadow-md" />
                  </div>
                )}
              </div>
              <button 
                onClick={handleDismiss}
                className="absolute top-4 right-4 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-6 p-6 pt-4">
            <DialogDescription className="text-lg text-foreground/90 leading-snug font-bold border-none">
              {activeQte.message}
            </DialogDescription>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-primary" />
                  <span className="text-xs font-black uppercase tracking-widest text-primary">
                    Nível de Confiança
                  </span>
                </div>
                <span className="text-sm font-black text-primary">
                  {activeQte.confidence}%
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
                <div 
                  className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                  style={{ width: `${activeQte.confidence}%` }}
                />
              </div>
            </div>

            <div className="grid gap-3">
              {activeQte.actions.map((action, idx) => (
                <Button
                  key={idx}
                  size="lg"
                  className={cn(
                    "group relative h-16 w-full overflow-hidden text-lg font-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl",
                    styles.color,
                    styles.foreground
                  )}
                  onClick={() => {
                    console.log('Bet placed:', action.action)
                    handleDismiss()
                  }}
                >
                  <span className="relative z-10 flex items-center justify-between w-full px-4">
                    <span>{action.label}</span>
                    <span className="rounded-lg bg-black/30 px-3 py-1 text-sm font-black backdrop-blur-sm">
                      @{action.odds?.toFixed(2)}
                    </span>
                  </span>
                  <div className="absolute inset-0 translate-x-[-100%] bg-white/20 transition-transform group-hover:translate-x-0 duration-500" />
                </Button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1 text-[10px] font-black uppercase text-secondary-foreground/60 tracking-widest">
                  <FireIcon className="h-3 w-3 text-orange-500 animate-pulse" />
                  Tempo Restante
                </div>
                <span className="text-xs font-black tabular-nums text-foreground">{timeLeft.toFixed(1)}s</span>
              </div>
              <div className="relative h-2.5 w-full overflow-visible rounded-full bg-secondary/30">
                <div 
                  className="h-full rounded-full transition-all duration-100 ease-linear shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                  style={{ 
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #F97316 0%, #EA580C 50%, #DC2626 100%)',
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)'
                  }}
                />
                {/* Burning Spark/Flame at the edge */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-100 ease-linear"
                  style={{ 
                    left: `${progress}%`,
                    transform: 'translate(-50%, -50%)',
                    filter: 'drop-shadow(0 0 10px #F97316)'
                  }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-orange-500 rounded-full blur-[8px] animate-ping opacity-50" />
                    <FireIcon className="h-6 w-6 text-orange-400 fill-orange-500 animate-bounce transition-transform duration-75" />
                    <div className="absolute top-0 -left-1 h-1.5 w-1.5 bg-yellow-300 rounded-full blur-[1px] animate-pulse" />
                  </div>
                </div>
                {/* Smoke/Burn trail */}
                <div 
                  className="absolute top-0 bottom-0 left-0 bg-black/10 blur-[2px] transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            
            {/* Profile specific badge */}
            <div className="rounded-lg bg-secondary/50 px-4 py-2 border border-border/50">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase">
                <ExclamationCircleIcon className="h-4 w-4 text-warning" />
                Sugestão baseada no seu perfil
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
