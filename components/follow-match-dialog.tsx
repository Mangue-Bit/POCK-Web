'use client'

import { useState } from 'react'
import { 
  TrophyIcon, 
  CheckIcon, 
  PlusIcon, 
  ExclamationCircleIcon, 
  ClockIcon, 
  XMarkIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon 
} from '@heroicons/react/24/outline'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { mockMatches } from '@/lib/mock-data'
import { useUser } from '@/lib/user-context'
import { cn } from '@/lib/utils'
import type { Match } from '@/lib/types'

function getStatusLabel(status: string, minute?: number) {
  switch (status) {
    case 'live':
      return minute && minute > 45 ? '2º Tempo' : '1º Tempo'
    case 'halftime':
      return 'Intervalo'
    case 'scheduled':
      return 'Em breve'
    case 'finished':
      return 'Finalizado'
    case 'extra_time':
      return 'Prorrogação'
    case 'penalties':
      return 'Pênaltis'
    default:
      return status
  }
}

export function FollowMatchDialog({ children }: { children: React.ReactNode }) {
  const { followMatch, unfollowMatch, isFollowingMatch } = useUser()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredMatches = mockMatches.filter((match) => {
    const matchesSearch = 
      match.homeTeam.name.toLowerCase().includes(search.toLowerCase()) ||
      match.awayTeam.name.toLowerCase().includes(search.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || match.status === statusFilter
    
    return matchesSearch && matchesStatus
  }).sort((a, b) => {
    // Live matches first
    const isLive = (s: string) => s === 'live' || s === 'halftime' || s === 'extra_time' || s === 'penalties'
    if (isLive(a.status) && !isLive(b.status)) return -1
    if (!isLive(a.status) && isLive(b.status)) return 1
    return 0
  })

  const filterOptions = [
    { label: 'Todos', value: 'all' },
    { label: 'Ao Vivo', value: 'live' },
    { label: 'Em Breve', value: 'scheduled' },
    { label: 'Finalizados', value: 'finished' },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-[850px] p-0 overflow-hidden border-none shadow-[0_0_50px_rgba(0,0,0,0.3)] bg-background rounded-2xl"
        showCloseButton={false}
      >
        <DialogHeader className="p-6 pb-4 bg-primary/5 border-b border-border">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                <TrophyIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black uppercase tracking-tight">Explorar Jogos</DialogTitle>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                  Siga novas partidas para receber insights
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="rounded-full">
              <XMarkIcon className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Search & Filters */}
        <div className="px-6 py-4 border-b border-border/40 bg-muted/5 space-y-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por time..." 
              className="pl-10 h-10 bg-background border-border/50 focus-visible:ring-primary/30 font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {filterOptions.map((opt) => (
              <Button
                key={opt.value}
                variant={statusFilter === opt.value ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-8 px-3 text-[10px] font-black uppercase tracking-wider rounded-full border-border/40 transition-all",
                  statusFilter === opt.value ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-accent/50"
                )}
                onClick={() => setStatusFilter(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        <ScrollArea className="h-[430px] px-6 py-4">
          <div className="space-y-3">
            {filteredMatches.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-20 text-center">
                 <MagnifyingGlassIcon className="h-10 w-10 text-muted-foreground/30 mb-4" />
                 <p className="text-sm font-bold text-muted-foreground uppercase">Nenhum jogo encontrado</p>
                 <p className="text-xs text-muted-foreground/60 mt-1">Tente ajustar seus filtros ou busca.</p>
               </div>
            ) : filteredMatches.map((match) => {
              const following = isFollowingMatch(match.id)
              const statusLabel = getStatusLabel(match.status, match.minute)
              
              return (
                <div 
                  key={match.id}
                  className={cn(
                    "group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:bg-accent/5",
                    following && "border-primary/30 bg-primary/[0.03]"
                  )}
                >
                  <div className="flex items-center justify-between gap-6">
                    {/* Status & Time */}
                    <div className="flex w-24 flex-col items-center justify-center gap-1 border-r border-border/50 pr-4">
                      <Badge 
                        variant={match.status === 'live' || match.status === 'halftime' ? 'default' : 'secondary'}
                        className={cn(
                           "text-[9px] uppercase font-black px-2 py-0.5",
                           match.status === 'live' && "bg-destructive text-destructive-foreground animate-pulse"
                        )}
                      >
                        {statusLabel}
                      </Badge>
                      {match.status === 'live' && (
                        <span className="text-sm font-black text-foreground tabular-nums">{match.minute}'</span>
                      )}
                      {match.status === 'scheduled' && (
                        <span className="text-[11px] font-black text-muted-foreground flex items-center gap-1">
                          <ClockIcon className="h-3 w-3" />
                          {match.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>

                    {/* Teams & Score */}
                    <div className="flex flex-1 items-center justify-center gap-4">
                       {/* Home Team */}
                       <div className="flex flex-1 flex-col items-center gap-1.5 overflow-hidden">
                         <img src={match.homeTeam.logo} alt="" className="h-10 w-10 object-contain drop-shadow-md" />
                         <span className="text-[10px] font-black uppercase text-foreground/70 text-center truncate w-full">
                           {match.homeTeam.name}
                         </span>
                       </div>

                       {/* Score */}
                       <div className="flex items-center gap-3 px-4 py-1.5 rounded-lg bg-background border border-border/50 shadow-inner">
                         <span className={cn(
                           "text-2xl font-black tabular-nums tracking-tighter",
                           match.status === 'live' ? "text-foreground" : "text-muted-foreground/60"
                         )}>
                           {match.homeScore}
                         </span>
                         <span className="text-xl font-black text-muted-foreground/30 italic">-</span>
                         <span className={cn(
                           "text-2xl font-black tabular-nums tracking-tighter",
                           match.status === 'live' ? "text-foreground" : "text-muted-foreground/60"
                         )}>
                           {match.awayScore}
                         </span>
                       </div>

                       {/* Away Team */}
                       <div className="flex flex-1 flex-col items-center gap-1.5 overflow-hidden">
                         <img src={match.awayTeam.logo} alt="" className="h-10 w-10 object-contain drop-shadow-md" />
                         <span className="text-[10px] font-black uppercase text-foreground/70 text-center truncate w-full">
                           {match.awayTeam.name}
                         </span>
                       </div>
                    </div>

                    {/* Follow Action */}
                    <div className="pl-2">
                      <Button
                        size="sm"
                        variant={following ? "secondary" : "default"}
                        className={cn(
                          "h-10 w-28 gap-2 font-black transition-all hover:scale-105 active:scale-95 group/btn",
                          following ? "bg-secondary text-primary hover:bg-destructive/10 hover:text-destructive" : "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        )}
                        onClick={() => following ? unfollowMatch(match.id) : followMatch(match.id)}
                      >
                        {following ? (
                          <>
                            <CheckIcon className="h-4 w-4 group-hover/btn:hidden" />
                            <PlusIcon className="h-4 w-4 hidden group-hover/btn:block rotate-45" />
                            <span className="group-hover/btn:hidden text-xs">Seguindo</span>
                            <span className="hidden group-hover/btn:inline text-[9px] uppercase">Parar Siga</span>
                          </>
                        ) : (
                          <>
                            <PlusIcon className="h-4 w-4" />
                            <span className="text-xs">Seguir</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
        
        <div className="p-4 bg-muted/20 border-t flex items-center justify-between">
           <span className="text-[10px] text-muted-foreground font-black uppercase flex items-center gap-1.5">
             <ExclamationCircleIcon className="h-3.5 w-3.5" />
             Selecione os jogos para obter insights
           </span>
           <Button variant="outline" size="sm" className="font-bold border-border/50" onClick={() => setOpen(false)}>
             Fechar
           </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
