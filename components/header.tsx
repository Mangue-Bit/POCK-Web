'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { BellIcon, UserIcon, TrophyIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useNotifications } from '@/lib/notification-context'
import { NotificationPanel } from './notification-panel'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'

const navItems = [
  { href: '/', label: 'Jogos', icon: TrophyIcon },
  { href: '/perfil', label: 'Perfil', icon: UserIcon },
]

export function Header() {
  const pathname = usePathname()
  const { unreadCount } = useNotifications()
  const [showDesktopNotifications, setShowDesktopNotifications] = useState(false)
  const [showMobileNotifications, setShowMobileNotifications] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/esportes-da-sorte-white-logo-4.svg" alt="Logo" width={123} height={123} />
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
          {/* Notification Button (Desktop Dropdown) */}
          <div className="relative hidden md:block">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground hover:bg-secondary"
              onClick={() => setShowDesktopNotifications(!showDesktopNotifications)}
            >
              <BellIcon className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
            {showDesktopNotifications && (
              <div className="absolute right-0 top-full mt-2 w-96 z-[100] shadow-2xl">
                 <NotificationPanel onClose={() => setShowDesktopNotifications(false)} isDesktop />
              </div>
            )}
          </div>

          {/* Notification Button (Mobile Sidebar) */}
          <div className="md:hidden">
            <Dialog open={showMobileNotifications} onOpenChange={setShowMobileNotifications}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-muted-foreground hover:text-foreground hover:bg-secondary"
                >
                  <BellIcon className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </DialogTrigger>
              
              <DialogContent 
                className="p-0 border-none bg-transparent shadow-none w-full max-w-none h-full"
                showCloseButton={false}
              >
                <DialogHeader className="sr-only">
                  <DialogTitle>Notificações</DialogTitle>
                  <DialogDescription>Feed de IA em tempo real</DialogDescription>
                </DialogHeader>
                <NotificationPanel onClose={() => setShowMobileNotifications(false)} />
              </DialogContent>
            </Dialog>
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
