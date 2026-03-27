'use client'

import { useEffect, useRef } from 'react'
import { 
  XMarkIcon, 
  CheckIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  BoltIcon, 
  ArrowTrendingUpIcon 
} from '@heroicons/react/24/solid'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNotifications } from '@/lib/notification-context'
import { cn } from '@/lib/utils'
import type { InsightType } from '@/lib/types'

interface NotificationPanelProps {
  onClose: () => void
}

function getNotificationIcon(type: InsightType) {
  switch (type) {
    case 'opportunity':
      return ArrowTrendingUpIcon
    case 'warning':
      return ExclamationTriangleIcon
    case 'momentum':
      return BoltIcon
    default:
      return InformationCircleIcon
  }
}

function getNotificationColor(type: InsightType) {
  switch (type) {
    case 'opportunity':
      return 'text-primary bg-primary/10 border-primary/20'
    case 'warning':
      return 'text-warning bg-warning/10 border-warning/20'
    case 'momentum':
      return 'text-chart-5 bg-chart-5/10 border-chart-5/20'
    default:
      return 'text-info bg-info/10 border-info/20'
  }
}

function formatTime(date: Date) {
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60)
  
  if (diff < 1) return 'Agora'
  if (diff < 60) return `${diff}min atrás`
  if (diff < 1440) return `${Math.floor(diff / 60)}h atrás`
  return date.toLocaleDateString('pt-BR')
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-96 rounded-lg border border-border bg-card shadow-xl"
    >
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">Notificações</h3>
          {unreadCount > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
              {unreadCount} novas
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={markAllAsRead}
            >
              <CheckIcon className="mr-1 h-3 w-3" />
              Marcar todas
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            <XMarkIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[400px]">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <InformationCircleIcon className="mb-2 h-10 w-10 opacity-30" />
            <p>Nenhuma notificação</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map(notification => {
              const Icon = getNotificationIcon(notification.type)
              const colorClasses = getNotificationColor(notification.type)

              return (
                <button
                  key={notification.id}
                  className={cn(
                    'w-full p-4 text-left transition-colors hover:bg-secondary/50',
                    !notification.read && 'bg-secondary/30'
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border',
                        colorClasses
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            'text-sm font-medium',
                            notification.read ? 'text-foreground' : 'text-primary'
                          )}
                        >
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatTime(notification.timestamp)}</span>
                        {notification.confidence && (
                          <>
                            <span>•</span>
                            <span className="text-primary">
                              {notification.confidence}% probabilidade
                            </span>
                          </>
                        )}
                      </div>
                      {notification.suggestedAction && (
                        <div className="mt-2 rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          {notification.suggestedAction}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
