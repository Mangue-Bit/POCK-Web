'use client'

import { cn } from '@/lib/utils'
import type { Team } from '@/lib/types'
import { getTeamInitials } from '@/lib/mock-data'

interface TeamBadgeProps {
  team: Team
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showName?: boolean
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-16 w-16 text-base',
  xl: 'h-24 w-24 text-xl',
}

export function TeamBadge({ team, size = 'md', showName = false }: TeamBadgeProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          'flex items-center justify-center rounded-full font-bold',
          'bg-gradient-to-br from-secondary to-muted',
          'border-2 border-border shadow-lg',
          'transition-transform hover:scale-105',
          sizeClasses[size]
        )}
        style={{
          background: `linear-gradient(135deg, ${team.primaryColor}20, ${team.primaryColor}40)`,
          borderColor: `${team.primaryColor}60`,
        }}
      >
        <span
          className="font-bold"
          style={{ color: team.primaryColor }}
        >
          {getTeamInitials(team.name)}
        </span>
      </div>
      {showName && (
        <span className="text-center text-sm font-medium text-foreground">
          {team.name}
        </span>
      )}
    </div>
  )
}
