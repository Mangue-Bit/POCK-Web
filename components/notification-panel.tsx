'use client'

import { useEffect, useRef } from 'react'
import { 
  XMarkIcon, 
  InformationCircleIcon,
  ArrowTrendingUpIcon 
} from '@heroicons/react/24/solid'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNotifications } from '@/lib/notification-context'
import { cn } from '@/lib/utils'
import type { InsightType } from '@/lib/types'

interface NotificationPanelProps {
  onClose: () => void
  isDesktop?: boolean
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

export function NotificationPanel({ onClose, isDesktop }: NotificationPanelProps) {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isDesktop && panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose, isDesktop])

  return (
    <div
      ref={panelRef}
      className={cn(
        "z-[100] bg-[#0c0c0c]/95 backdrop-blur-xl shadow-2xl transition-all duration-300 ease-out flex flex-col overflow-hidden",
        isDesktop 
          ? "relative w-full h-[450px] rounded-2xl border border-white/10" 
          : "fixed inset-y-0 right-0 w-[85%] max-w-[380px] border-l border-white/10 h-full animate-in slide-in-from-right"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 p-4 shrink-0">
        <div className="flex flex-col">
          <h3 className="text-sm font-black italic uppercase tracking-tight text-foreground">
            Feed de <span className="text-primary italic">IA</span>
          </h3>
          {unreadCount > 0 && (
            <p className="text-[10px] font-black text-primary uppercase tracking-widest animate-pulse">
              {unreadCount} novas
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary px-2"
              onClick={markAllAsRead}
            >
              LIMPAR
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full border border-white/5 bg-white/5 text-neutral-400 hover:text-white"
            onClick={onClose}
          >
            <XMarkIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0 w-full overflow-hidden">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30 border border-white/5">
              <InformationCircleIcon className="h-8 w-8 text-neutral-600 opacity-30" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
              SEM NOVIDADES
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5 pb-10">
            {notifications.map(notification => {
              const colorClasses = getNotificationColor(notification.type)

              return (
                <button
                  key={notification.id}
                  className={cn(
                    'w-full p-4 text-left transition-all duration-300 relative group border-l-[3px] border-transparent',
                    !notification.read ? 'bg-primary/5 border-l-primary' : 'hover:bg-white/5'
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            'text-[12px] font-black uppercase italic tracking-tight leading-tight',
                            notification.read ? 'text-neutral-400' : 'text-primary'
                          )}
                        >
                          {notification.title}
                        </p>
                      </div>
                      
                      <p className="text-[10px] font-bold text-neutral-500 line-clamp-2 leading-snug">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center gap-3 pt-1">
                        <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-neutral-600">
                          {formatTime(notification.timestamp)}
                        </div>
                        
                        {notification.confidence && (
                          <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-primary italic">
                            <ArrowTrendingUpIcon className="h-2.5 w-2.5" />
                            {notification.confidence}% IA
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </ScrollArea>
      
      {/* Footer (Mobile Only) */}
      {!isDesktop && (
        <div className="border-t border-white/5 p-6 bg-black/20">
           <Button 
              className="w-full h-11 bg-primary text-primary-foreground font-black uppercase tracking-widest italic rounded-xl shadow-[0_0_15px_rgba(var(--primary),0.2)]" 
              onClick={onClose}
            >
             FECHAR PAINEL
           </Button>
        </div>
      )}
    </div>
  )
}
