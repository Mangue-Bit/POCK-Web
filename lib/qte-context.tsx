'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { QteEvent, BettingProfile } from './types'
import { useUser } from './user-context'

interface QteContextType {
  activeQte: QteEvent | null
  triggerQte: (type: 'goal' | 'card') => void
  dismissQte: () => void
}

const QteContext = createContext<QteContextType | undefined>(undefined)

export function QteProvider({ children }: { children: ReactNode }) {
  const { user } = useUser()
  const [activeQte, setActiveQte] = useState<QteEvent | null>(null)

  const dismissQte = useCallback(() => {
    setActiveQte(null)
  }, [])

  const triggerQte = useCallback((type: 'goal' | 'card') => {
    const profile = user.bettingProfile
    
    // Config based on profile
    const config = ({
      conservador: {
        minConfidence: 75,
        duration: 15,
        goalLabel: 'Aposta Segura',
        cardLabel: 'Analisar Jogo',
      },
      moderado: {
        minConfidence: 65,
        duration: 10,
        goalLabel: 'GOL AGORA!',
        cardLabel: 'Cartão Iminente',
      },
      agressivo: {
        minConfidence: 55,
        duration: 6,
        goalLabel: 'ALL IN GOL',
        cardLabel: 'PREDIÇÃO VERMELHO',
      }
    }[profile] || {
      minConfidence: 65,
      duration: 10,
      goalLabel: 'GOL AGORA!',
      cardLabel: 'Cartão Iminente',
    })

    const confidence = Math.floor(Math.random() * (100 - config.minConfidence + 1)) + config.minConfidence
    
    const id = `qte-${Date.now()}`
    const event: QteEvent = {
      id,
      matchId: 'match-1', // Mock
      type,
      title: type === 'goal' ? 'Quick Bet: GOAL' : 'Quick Bet: CARD',
      message: type === 'goal' 
        ? `Pressão total no ataque! ${confidence}% de chance de gol nos próximos 3 minutos.`
        : `Clima quente em campo! ${confidence}% de chance de cartão nos próximos 5 minutos.`,
      duration: config.duration,
      confidence,
      actions: type === 'goal' ? [
        { label: config.goalLabel, action: 'bet_goal', odds: profile === 'agressivo' ? 3.5 : 1.8 },
      ] : [
        { label: config.cardLabel, action: 'bet_card', odds: profile === 'agressivo' ? 4.2 : 2.1 },
      ],
      timestamp: new Date(),
    }

    setActiveQte(event)
  }, [user.bettingProfile])

  // Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const shouldTrigger = Math.random() > 0.6 // Slightly more frequent for demo
      if (shouldTrigger && !activeQte) {
        triggerQte(Math.random() > 0.5 ? 'goal' : 'card')
      }
    }, 20000)

    return () => clearInterval(interval)
  }, [activeQte, triggerQte])

  return (
    <QteContext.Provider value={{ activeQte, triggerQte, dismissQte }}>
      {children}
    </QteContext.Provider>
  )
}

export function useQte() {
  const context = useContext(QteContext)
  if (!context) {
    throw new Error('useQte must be used within a QteProvider')
  }
  return context
}
