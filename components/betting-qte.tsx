'use client'

import { useEffect, useState } from 'react'
import { Zap, X, Timer, TrendingUp, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useQte } from '@/lib/qte-context'
import { cn } from '@/lib/utils'

export function BettingQte() {
  const { activeQte, dismissQte } = useQte()
  const [timeLeft, setTimeLeft] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (activeQte) {
      setTimeLeft(activeQte.duration)
      setIsExiting(false)
      
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0.1) {
            clearInterval(timer)
            handleDismiss()
            return 0
          }
          return prev - 0.1
        })
      }, 100)

      return () => clearInterval(timer)
    }
  }, [activeQte])

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(() => {
      dismissQte()
      setIsExiting(false)
    }, 300)
  }

  if (!activeQte) return null

  const progress = (timeLeft / activeQte.duration) * 100
  const isGoal = activeQte.type === 'goal'

  return (
    <div 
      className={cn(
        "fixed bottom-4 left-4 z-50 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-2xl transition-all duration-300",
        isExiting ? "qte-exit" : "qte-enter",
        !activeQte && "pointer-events-none"
      )}
    >
      {/* Header with Background Glow */}
      <div className={cn(
        "relative p-4 pb-2",
        isGoal ? "bg-primary/10" : "bg-warning/10"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full animate-pulse",
              isGoal ? "bg-primary text-primary-foreground" : "bg-warning text-warning-foreground"
            )}>
              <Zap className="h-4 w-4 fill-current" />
            </div>
            <span className="text-sm font-bold uppercase tracking-wider text-foreground">
              {activeQte.title}
            </span>
          </div>
          <button 
            onClick={handleDismiss}
            className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3 p-4 pt-2">
        <p className="text-sm text-foreground/90 leading-relaxed font-medium">
          {activeQte.message}
        </p>

        {/* Confidence Meter */}
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${activeQte.confidence}%` }}
              />
            </div>
          </div>
          <span className="text-[10px] font-bold text-primary">
            {activeQte.confidence}% CONF
          </span>
        </div>

        {/* Actions */}
        <div className="grid gap-2">
          {activeQte.actions.map((action, idx) => (
            <Button
              key={idx}
              size="sm"
              className={cn(
                "group relative h-10 w-full overflow-hidden font-bold transition-all hover:scale-[1.02] active:scale-[0.98]",
                isGoal ? "bg-primary text-primary-foreground" : "bg-warning text-warning-foreground"
              )}
              onClick={() => {
                console.log('Bet placed:', action.action)
                handleDismiss()
              }}
            >
              <span className="relative z-10 flex items-center justify-between w-full px-2">
                <span>{action.label}</span>
                <span className="rounded bg-black/20 px-1.5 py-0.5 text-xs">
                  @{action.odds?.toFixed(2)}
                </span>
              </span>
              <div className="absolute inset-0 translate-x-[-100%] bg-white/20 transition-transform group-hover:translate-x-0 duration-300" />
            </Button>
          ))}
        </div>

        {/* Countdown Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-tighter text-muted-foreground font-bold">
            <span className="flex items-center gap-1">
              <Timer className="h-3 w-3" />
              Tempo Restante
            </span>
            <span>{timeLeft.toFixed(1)}s</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
            <div 
              className={cn(
                "h-full transition-all duration-100 ease-linear",
                timeLeft < 3 ? "bg-destructive" : isGoal ? "bg-primary" : "bg-warning"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Profile specific badge */}
      <div className="bg-secondary/50 px-4 py-1.5">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase">
          <AlertCircle className="h-3 w-3" />
          Sugestão Baseada no seu perfil
        </div>
      </div>
    </div>
  )
}
