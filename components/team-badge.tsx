'use client'

import { cn } from '@/lib/utils'
import type { Team } from '@/lib/types'
import { getTeamInitials } from '@/lib/mock-data'

interface TeamBadgeProps {
  team: Team
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showName?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-16 w-16 text-base',
  xl: 'h-24 w-24 text-xl',
}

export function TeamBadge({ team, size = 'md', showName = false, className }: TeamBadgeProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          'flex items-center justify-center rounded-full font-bold',
          'bg-gradient-to-br from-secondary to-muted',
          'border-2 border-border shadow-lg',
          'transition-transform hover:scale-105',
          sizeClasses[size],
          className
        )}
        style={{
          background: `linear-gradient(135deg, ${team.primaryColor}20, ${team.primaryColor}40)`,
          borderColor: `${team.primaryColor}60`,
        }}
      >
        <img
          src={team.logo}
          alt={team.name}
          className="object-contain w-3/4 h-3/4"
          style={{ maxWidth: '80%', maxHeight: '80%' }}
        />
      </div>
      {showName && (
        <span className="text-center text-sm font-medium text-foreground">
          {team.name}
        </span>
      )}
    </div>
  )
}
