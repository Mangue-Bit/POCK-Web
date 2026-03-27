'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BellIcon, UserIcon, TrophyIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useNotifications } from '@/lib/notification-context'
import { NotificationPanel } from './notification-panel'
import { useState } from 'react'

const navItems = [
  { href: '/', label: 'Jogos', icon: TrophyIcon },
  { href: '/perfil', label: 'Perfil', icon: UserIcon },
]

export function Header() {
  const pathname = usePathname()
  const { unreadCount } = useNotifications()
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <ArrowTrendingUpIcon className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">
              POC <span className="text-primary">Insights</span>
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={cn(
                    'gap-2',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Notification Button */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground hover:bg-secondary"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <BellIcon className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
            {showNotifications && (
              <NotificationPanel onClose={() => setShowNotifications(false)} />
            )}
          </div>

          {/* Mobile Nav */}
          <div className="flex items-center gap-1 md:hidden">
            {navItems.map(item => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="icon"
                    className={cn(
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}
