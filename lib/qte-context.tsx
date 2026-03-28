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
    setActiveQte((currentQte) => {
      if (currentQte) {
        return currentQte
      }

      const profile = user.bettingProfile
    
    // Config based on profile
    const config = ({
      conservador: {
        minConfidence: 75,
        duration: 30,
        goalLabel: 'Aposta Segura',
        cardLabel: 'Analisar Jogo',
        cornerLabel: 'Mais de 8.5 Cantos',
        foulLabel: 'Menos de 20 Faltas',
      },
      moderado: {
        minConfidence: 65,
        duration: 30,
        goalLabel: 'GOL AGORA!',
        cardLabel: 'Cartão Iminente',
        cornerLabel: 'Canto nos próximos 5m',
        foulLabel: 'Próxima falta será casa',
      },
      agressivo: {
        minConfidence: 55,
        duration: 30,
        goalLabel: 'ALL IN GOL',
        cardLabel: 'PREDIÇÃO VERMELHO',
        cornerLabel: 'COMBO ESCANTEIOS',
        foulLabel: 'EXPULSÃO POR FALTA',
      }
    }[profile] || {
      minConfidence: 65,
      duration: 30,
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
          goal: `Pressao total no ataque! ${confidence}% de chance de gol nos proximos 3 minutos.`,
          card: `Clima quente em campo! ${confidence}% de chance de cartao nos proximos 5 minutos.`,
          corner: `Muitos cruzamentos na area! ${confidence}% de chance de escanteio agora.`,
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
        reasons: {
          goal: [
            'Alto numero de ataques perigosos do time da casa',
            'Multiplas finalizacoes no gol nos ultimos minutos',
            'Pressao ofensiva intensa detectada pela IA'
          ],
          card: [
            'Aumento na frequencia de faltas taticas',
            'Clima de tensao entre jogadores detectado',
            'Arbitro com media alta de cartoes por partida'
          ],
          corner: [
            'Time explora as laterais com frequencia',
            'Volume alto de cruzamentos na area',
            'Defesa adversaria priorizando corte pra linha de fundo'
          ],
          foul: [
            'Disputas fisicas intensas no meio-campo',
            'Historico de rivalidade entre as equipes',
            'Estilo de jogo agressivo de ambos os times'
          ]
        }[type]
      }

      return event
    })
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
