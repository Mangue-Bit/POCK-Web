'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import type { Notification, InsightType } from './types'
import { fetchNotifications, type ApiNotification } from './api'

// ─── Map API notification type → UI InsightType ────────────────

function mapType(apiType: ApiNotification['type']): InsightType {
  switch (apiType) {
    case 'goal_alert':
      return 'opportunity'
    case 'pressure_alert':
      return 'momentum'
    case 'chaos_alert':
      return 'warning'
    default:
      return 'info'
  }
}

function buildTitle(n: ApiNotification): string {
  switch (n.type) {
    case 'goal_alert':
      return n.triggered_by_qte && n.qte_events?.[0]?.team_name
        ? `${n.qte_events[0].team_name} — Chance de Gol!`
        : 'Alta Chance de Gol'
    case 'pressure_alert':
      return 'Pressão Total do Time!'
    case 'chaos_alert':
      return 'Jogo Perigoso e Aberto!'
    default:
      return 'Alerta da Partida'
  }
}

function apiNotifToUi(n: ApiNotification, idx: number): Notification {
  return {
    id: n.id ?? `api-notif-${idx}-${n.timestamp}`,
    matchId: n.match_id,
    type: mapType(n.type),
    title: buildTitle(n),
    message: n.message,
    timestamp: new Date(n.timestamp),
    read: false,
    confidence: Math.round(n.confidence * 100),
  }
}

// ─── Context ───────────────────────────────────────────────────

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotification: (id: string) => void
  latestNotification: Notification | null
  dismissLatest: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [latestNotification, setLatestNotification] = useState<Notification | null>(null)
  // Store IDs already ingested from the API to avoid duplicates
  const seenIds = useRef<Set<string>>(new Set())

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)))
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

  // ── Poll /notifications every 7s ──────────────────────────
  useEffect(() => {
    let cancelled = false

    async function pollNotifications() {
      try {
        const raw = await fetchNotifications(20)
        if (cancelled) return

        const newOnes: Notification[] = []
        for (let i = 0; i < raw.length; i++) {
          const n = raw[i]
          const ui = apiNotifToUi(n, i)
          if (!seenIds.current.has(ui.id)) {
            seenIds.current.add(ui.id)
            newOnes.push(ui)
          }
        }

        if (newOnes.length > 0) {
          setNotifications(prev => [...newOnes, ...prev])
          // Show the most recent as toast
          setLatestNotification(newOnes[0])
        }
      } catch {
        // API unavailable — keep current list
      }
    }

    pollNotifications()
    const interval = setInterval(pollNotifications, 7000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  // Auto-dismiss latest toast after 8s
  useEffect(() => {
    if (latestNotification) {
      const timeout = setTimeout(() => setLatestNotification(null), 8000)
      return () => clearTimeout(timeout)
    }
  }, [latestNotification])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
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
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider')
  return context
}
