'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User, BettingProfile } from './types'
import { mockUser } from './mock-data'

interface UserContextType {
  user: User
  updateProfile: (updates: Partial<User>) => void
  followMatch: (matchId: string) => void
  unfollowMatch: (matchId: string) => void
  isFollowingMatch: (matchId: string) => boolean
  setBettingProfile: (profile: BettingProfile) => void
  setFavoriteTeam: (teamId: string) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(mockUser)

  const updateProfile = useCallback((updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }))
  }, [])

  const followMatch = useCallback((matchId: string) => {
    setUser(prev => ({
      ...prev,
      followedMatches: prev.followedMatches.includes(matchId)
        ? prev.followedMatches
        : [...prev.followedMatches, matchId],
    }))
  }, [])

  const unfollowMatch = useCallback((matchId: string) => {
    setUser(prev => ({
      ...prev,
      followedMatches: prev.followedMatches.filter(id => id !== matchId),
    }))
  }, [])

  const isFollowingMatch = useCallback(
    (matchId: string) => user.followedMatches.includes(matchId),
    [user.followedMatches]
  )

  const setBettingProfile = useCallback((profile: BettingProfile) => {
    setUser(prev => ({ ...prev, bettingProfile: profile }))
  }, [])

  const setFavoriteTeam = useCallback((teamId: string) => {
    setUser(prev => ({ ...prev, favoriteTeam: teamId }))
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        updateProfile,
        followMatch,
        unfollowMatch,
        isFollowingMatch,
        setBettingProfile,
        setFavoriteTeam,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
