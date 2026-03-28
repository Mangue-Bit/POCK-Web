'use client'

import { useState } from 'react'
import {
  TrophyIcon,
  CheckIcon,
  PlusIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useUser } from '@/lib/user-context'
import { useLiveMatches } from '@/hooks/use-live-matches'
import { cn } from '@/lib/utils'

export function FollowMatchDialog({ children }: { children: React.ReactNode }) {
  const { followMatch, unfollowMatch, isFollowingMatch } = useUser()
  const { matches, loading, error } = useLiveMatches()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = matches
    .filter(m => {
      if (!search.trim()) return true
      return (
        m.home.toLowerCase().includes(search.toLowerCase()) ||
        m.away.toLowerCase().includes(search.toLowerCase()) ||
        m.league.toLowerCase().includes(search.toLowerCase())
      )
    })

  function getInitials(name: string) {
    return name
      .split(' ')
      .map(w => w[0])
      .join('')
      .substring(0, 3)
      .toUpperCase()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="fixed inset-0 z-[100] translate-x-0 translate-y-0 top-0 left-0 w-full h-full max-w-none flex flex-col border-none bg-[#0c0c0c] p-0 sm:top-[50%] sm:left-[50%] sm:right-auto sm:bottom-auto sm:translate-x-[-50%] sm:translate-y-[-50%] sm:w-[95%] sm:max-w-[850px] sm:h-[80vh] sm:rounded-3xl sm:border sm:border-white/5 sm:shadow-[0_0_100px_rgba(0,0,0,0.8)]"
        showCloseButton={false}
      >
        <div className="flex flex-col h-full overflow-hidden bg-[#0c0c0c]">

          {/* Header */}
          <div className="p-4 md:p-6 bg-primary/5 border-b border-white/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                <TrophyIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg md:text-2xl font-black uppercase tracking-tight italic text-white line-clamp-1">
                  EXPLORAR <span className="text-primary italic">IA RADAR</span>
                </DialogTitle>
                <DialogDescription className="text-[9px] text-neutral-500 uppercase tracking-widest font-black italic">
                  {loading
                    ? 'BUSCANDO TRANSMISSÕES AO VIVO...'
                    : error
                    ? 'API INDISPONÍVEL'
                    : `${matches.length} PARTIDAS AO VIVO`}
                </DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="rounded-full bg-white/5 hover:bg-white/10 text-neutral-400">
              <XMarkIcon className="h-5 w-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="p-4 md:p-6 bg-background/50 border-b border-white/5 shrink-0">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input
                placeholder="PROCURAR CLUBE OU LIGA..."
                className="pl-10 h-11 bg-white/5 border-white/5 focus-visible:ring-primary/40 font-black italic text-xs uppercase"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* List */}
          <ScrollArea className="flex-1 min-h-0 bg-background px-4 md:px-6">
            <div className="py-4 space-y-3">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                  <div className="h-10 w-10 mb-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  <p className="text-xs font-black uppercase italic tracking-widest">Conectando ao radar...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                  <MagnifyingGlassIcon className="h-10 w-10 mb-4" />
                  <p className="text-xs font-black uppercase italic tracking-widest">
                    {error ? 'API indisponível' : 'Nenhuma transmissão encontrada'}
                  </p>
                </div>
              ) : (
                filtered.map(match => {
                  const following = isFollowingMatch(match.match_id)
                  const homeWinning = match.homeScore > match.awayScore
                  const awayWinning = match.awayScore > match.homeScore

                  return (
                    <div
                      key={match.match_id}
                      className={cn(
                        'group relative rounded-2xl border transition-all duration-300',
                        following
                          ? 'border-primary/40 bg-primary/[0.03]'
                          : 'border-white/5 bg-neutral-900/40 hover:border-white/10',
                      )}
                    >
                      <div className="flex items-center p-3 md:p-4 gap-3 md:gap-6">
                        {/* Match info */}
                        <div className="flex flex-col gap-2 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-primary/20 text-primary border-none font-black italic text-[8px] px-1.5 uppercase">
                              Ao Vivo
                            </Badge>
                            <span className="text-[10px] font-black text-white italic tracking-tighter tabular-nums animate-pulse">
                              {match.minute}&apos;
                            </span>
                            <span className="text-[9px] font-bold text-neutral-600 uppercase truncate">
                              {match.league}
                            </span>
                          </div>

                          <div className="flex flex-col gap-1.5 font-black italic">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="h-5 w-5 rounded-full bg-secondary/60 flex items-center justify-center text-[8px] font-black shrink-0">
                                  {getInitials(match.home)}
                                </div>
                                <span className="text-[10px] md:text-xs uppercase truncate text-neutral-400">
                                  {match.home}
                                </span>
                              </div>
                              <span className={cn('text-sm md:text-base tabular-nums', homeWinning ? 'text-primary' : 'text-white')}>
                                {match.homeScore}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="h-5 w-5 rounded-full bg-secondary/60 flex items-center justify-center text-[8px] font-black shrink-0">
                                  {getInitials(match.away)}
                                </div>
                                <span className="text-[10px] md:text-xs uppercase truncate text-neutral-400">
                                  {match.away}
                                </span>
                              </div>
                              <span className={cn('text-sm md:text-base tabular-nums', awayWinning ? 'text-primary' : 'text-white')}>
                                {match.awayScore}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action */}
                        <div className="shrink-0">
                          <Button
                            size="sm"
                            variant={following ? 'secondary' : 'default'}
                            className={cn(
                              'h-12 w-12 md:w-32 md:h-12 rounded-2xl transition-all shadow-lg active:scale-90',
                              following
                                ? 'bg-neutral-800 text-primary border border-white/5'
                                : 'bg-primary text-primary-foreground shadow-primary/20',
                            )}
                            onClick={() =>
                              following ? unfollowMatch(match.match_id) : followMatch(match.match_id)
                            }
                          >
                            {following ? (
                              <div className="flex items-center justify-center">
                                <CheckIcon className="h-5 w-5" />
                                <span className="hidden md:inline ml-2 text-[10px] font-black uppercase italic">SEGUIDO</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center">
                                <PlusIcon className="h-5 w-5" />
                                <span className="hidden md:inline ml-2 text-[10px] font-black uppercase italic">SEGUIR</span>
                              </div>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 md:p-6 bg-[#0c0c0c] border-t border-white/5 shrink-0 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-neutral-600">
              <ExclamationCircleIcon className="h-4 w-4" />
              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest italic">
                SISTEMA DE RADAR IA ATIVO
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-10 md:h-11 px-6 font-black uppercase italic text-xs border-white/10 hover:bg-white/5 text-neutral-400 rounded-xl"
              onClick={() => setOpen(false)}
            >
              FECHAR
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
