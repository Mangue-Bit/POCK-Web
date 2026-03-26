'use client'

import { X, TrendingUp, AlertTriangle, Info, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNotifications } from '@/lib/notification-context'
import { cn } from '@/lib/utils'
import type { InsightType } from '@/lib/types'

function getNotificationIcon(type: InsightType) {
  switch (type) {
    case 'opportunity':
      return TrendingUp
    case 'warning':
      return AlertTriangle
    case 'momentum':
      return Zap
    default:
      return Info
  }
}

function getNotificationBorder(type: InsightType) {
  switch (type) {
    case 'opportunity':
      return 'border-l-primary'
    case 'warning':
      return 'border-l-warning'
    case 'momentum':
      return 'border-l-chart-5'
    default:
      return 'border-l-info'
  }
}

export function NotificationToast() {
  const { latestNotification, dismissLatest, markAsRead } = useNotifications()

  if (!latestNotification) return null

  const Icon = getNotificationIcon(latestNotification.type)
  const borderColor = getNotificationBorder(latestNotification.type)

  const handleDismiss = () => {
    markAsRead(latestNotification.id)
    dismissLatest()
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 notification-enter">
      <div
        className={cn(
          'w-80 rounded-lg border border-border bg-card shadow-2xl',
          'border-l-4',
          borderColor
        )}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-start justify-between">
                <p className="text-sm font-semibold text-primary">
                  {latestNotification.title}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 -mt-1 -mr-1 text-muted-foreground hover:text-foreground"
                  onClick={handleDismiss}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {latestNotification.message}
              </p>
              {latestNotification.confidence && (
                <div className="flex items-center gap-2 pt-1">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${latestNotification.confidence}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-primary">
                    {latestNotification.confidence}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
