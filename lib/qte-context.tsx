'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { QteEvent, BettingProfile } from './types'
import { useUser } from './user-context'
import { mockMatches } from './mock-data'

interface QteContextType {
  activeQte: QteEvent | null
  triggerQte: (type: 'goal' | 'card' | 'corner' | 'foul') => void
  dismissQte: () => void
}

const QteContext = createContext<QteContextType | undefined>(undefined)

export function QteProvider({ children }: { children: ReactNode }) {
  const { user } = useUser()
  const [activeQte, setActiveQte] = useState<QteEvent | null>(null)

  const dismissQte = useCallback(() => {
    setActiveQte(null)
  }, [])

    const triggerQte = useCallback((type: 'goal' | 'card' | 'corner' | 'foul') => {
    const profile = user.bettingProfile
    
    // Config based on profile
    const config = ({
      conservador: {
        minConfidence: 75,
        duration: 15,
        goalLabel: 'Aposta Segura',
        cardLabel: 'Analisar Jogo',
        cornerLabel: 'Mais de 8.5 Cantos',
        foulLabel: 'Menos de 20 Faltas',
      },
      moderado: {
        minConfidence: 65,
        duration: 10,
        goalLabel: 'GOL AGORA!',
        cardLabel: 'Cartão Iminente',
        cornerLabel: 'Canto nos próximos 5m',
        foulLabel: 'Próxima falta será casa',
      },
      agressivo: {
        minConfidence: 55,
        duration: 6,
        goalLabel: 'ALL IN GOL',
        cardLabel: 'PREDIÇÃO VERMELHO',
        cornerLabel: 'COMBO ESCANTEIOS',
        foulLabel: 'EXPULSÃO POR FALTA',
      }
    }[profile] || {
      minConfidence: 65,
      duration: 10,
      goalLabel: 'GOL AGORA!',
      cardLabel: 'Cartão Iminente',
      cornerLabel: 'Canto nos próximos 5m',
      foulLabel: 'Próxima falta será casa',
    })

    const confidence = Math.floor(Math.random() * (100 - config.minConfidence + 1)) + config.minConfidence
    
    const randomMatch = mockMatches[Math.floor(Math.random() * mockMatches.length)]
    const matchId = randomMatch.id
    
    const id = `qte-${Date.now()}`
    const event: QteEvent = {
      id,
      matchId,
      type,
      title: {
        goal: 'Quick Bet: GOAL',
        card: 'Quick Bet: CARD',
        corner: 'Quick Bet: CORNER',
        foul: 'Quick Bet: FOUL'
      }[type],
      message: {
        goal: `Pressão total no ataque! ${confidence}% de chance de gol nos próximos 3 minutos.`,
        card: `Clima quente em campo! ${confidence}% de chance de cartão nos próximos 5 minutos.`,
        corner: `Muitos cruzamentos na área! ${confidence}% de chance de escanteio agora.`,
        foul: `Jogo truncado no meio-campo! ${confidence}% de chance de falta em breve.`
      }[type],
      duration: config.duration,
      confidence,
      actions: {
        goal: [{ label: config.goalLabel, action: 'bet_goal', odds: profile === 'agressivo' ? 3.5 : 1.8 }],
        card: [{ label: config.cardLabel, action: 'bet_card', odds: profile === 'agressivo' ? 4.2 : 2.1 }],
        corner: [{ label: config.cornerLabel, action: 'bet_corner', odds: profile === 'agressivo' ? 2.5 : 1.4 }],
        foul: [{ label: config.foulLabel, action: 'bet_foul', odds: profile === 'agressivo' ? 5.8 : 2.8 }]
      }[type],
      timestamp: new Date(),
    }

    setActiveQte(event)
  }, [user.bettingProfile])

  // Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const shouldTrigger = Math.random() > 0.6 // Slightly more frequent for demo
      if (shouldTrigger && !activeQte) {
        const types: ('goal' | 'card' | 'corner' | 'foul')[] = ['goal', 'card', 'corner', 'foul']
        const randomType = types[Math.floor(Math.random() * types.length)]
        triggerQte(randomType)
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
