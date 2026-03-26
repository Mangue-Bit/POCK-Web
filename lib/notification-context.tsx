'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { Notification } from './types'
import { mockNotifications } from './mock-data'

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotification: (id: string) => void
  latestNotification: Notification | null
  dismissLatest: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [latestNotification, setLatestNotification] = useState<Notification | null>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      read: false,
    }
    setNotifications(prev => [newNotification, ...prev])
    setLatestNotification(newNotification)
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const dismissLatest = useCallback(() => {
    setLatestNotification(null)
  }, [])

  // Simulate real-time notifications
  useEffect(() => {
    const insightMessages = [
      {
        type: 'opportunity' as const,
        title: 'Oportunidade Detectada',
        message: 'Alta probabilidade de gol nos próximos 10 minutos baseado em xG e pressão ofensiva.',
        matchId: 'match-1',
        confidence: 72,
      },
      {
        type: 'warning' as const,
        title: 'Mudança de Padrão',
        message: 'Time visitante aumentando intensidade. Considere ajustar estratégia.',
        matchId: 'match-2',
        confidence: 65,
      },
      {
        type: 'momentum' as const,
        title: 'Momentum Shift',
        message: 'Modelo SHAP indica mudança significativa no fluxo do jogo.',
        matchId: 'match-1',
        confidence: 68,
      },
      {
        type: 'info' as const,
        title: 'Estatística Relevante',
        message: 'Histórico mostra 80% dos jogos com essas características terminam com mais de 2.5 gols.',
        matchId: 'match-3',
        confidence: 80,
      },
    ]

    const interval = setInterval(() => {
      const randomInsight = insightMessages[Math.floor(Math.random() * insightMessages.length)]
      addNotification(randomInsight)
    }, 45000) // New notification every 45 seconds

    return () => clearInterval(interval)
  }, [addNotification])

  // Auto-dismiss latest notification after 8 seconds
  useEffect(() => {
    if (latestNotification) {
      const timeout = setTimeout(() => {
        setLatestNotification(null)
      }, 8000)
      return () => clearTimeout(timeout)
    }
  }, [latestNotification])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        latestNotification,
        dismissLatest,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
