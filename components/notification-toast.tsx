'use client'

import { XMarkIcon } from '@heroicons/react/24/solid'
import { Button } from '@/components/ui/button'
import { useNotifications } from '@/lib/notification-context'
import { cn } from '@/lib/utils'
import type { InsightType } from '@/lib/types'

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

  const borderColor = getNotificationBorder(latestNotification.type)

  const handleDismiss = () => {
    markAsRead(latestNotification.id)
    dismissLatest()
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 notification-enter">
      <div
        className={cn(
          'w-80 md:w-96 rounded-xl border border-border bg-card shadow-2xl transition-all duration-300',
          'border-l-4',
          borderColor,
        )}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1 space-y-1">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  {latestNotification.matchId && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary/50 italic">
                      Partida #{latestNotification.matchId}
                    </span>
                  )}
                  <p className="text-base font-bold text-foreground tracking-tight">
                    {latestNotification.title}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 -mt-1 -mr-1 text-muted-foreground hover:text-foreground"
                  onClick={handleDismiss}
                >
                  <XMarkIcon className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
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
