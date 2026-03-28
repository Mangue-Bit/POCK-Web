'use client'

import { 
  TrophyIcon, 
  PlusIcon, 
  FunnelIcon, 
  CheckIcon, 
  XMarkIcon, 
  MagnifyingGlassIcon,
  BoltIcon
} from '@heroicons/react/24/outline'
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { MatchCard } from '@/components/match-card'
import { FollowMatchDialog } from '@/components/follow-match-dialog'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu'
import { useUser } from '@/lib/user-context'
import { useQte } from '@/lib/qte-context'
import { mockMatches } from '@/lib/mock-data'

type MatchStatus = 'all' | 'live' | 'halftime' | 'scheduled' | 'finished'

export default function HomePage() {
  const { user } = useUser()
  const { triggerQte } = useQte()
  const [statusFilter, setStatusFilter] = useState<MatchStatus>('all')
  const [search, setSearch] = useState('')

  const filteredMatches = useMemo(() => {
    let matches = mockMatches.filter(match =>
      user.followedMatches.includes(match.id)
    )

    if (statusFilter !== 'all') {
      matches = matches.filter(m => m.status === statusFilter)
    }
    
    if (search.trim()) {
      matches = matches.filter(m => 
        m.homeTeam.name.toLowerCase().includes(search.toLowerCase()) ||
        m.awayTeam.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    return matches
  }, [user.followedMatches, statusFilter, search])

  const liveCount = useMemo(() => {
    return mockMatches.filter(match => 
      user.followedMatches.includes(match.id) && 
      (match.status === 'live' || match.status === 'halftime')
    ).length
  }, [user.followedMatches])

  const filterLabels: Record<MatchStatus, string> = {
    all: 'Todos os Jogos',
    live: 'Ao Vivo',
    halftime: 'Intervalo',
    scheduled: 'Agendados',
    finished: 'Finalizados'
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8 transition-all">
      {/* Header Section */}
      <div className="mb-6 md:mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight italic uppercase">
            Jogos <span className="text-primary italic">Seguidos</span>
          </h1>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-2">
            {liveCount > 0 && (
              <Badge className="bg-primary/10 text-primary border border-primary/20 h-10 px-3 flex-shrink-0">
                <span className="relative mr-2 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <span className="font-black italic text-[11px] uppercase">{liveCount} AGORA</span>
              </Badge>
            )}
            
            <div className="relative flex-1 md:w-64 min-w-[200px]">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar partida..." 
                className="pl-10 h-10 md:h-9 bg-card border-border/50 focus-visible:ring-primary/20 font-bold text-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 lg:flex lg:items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 h-10 md:h-9 font-bold text-xs uppercase tracking-widest">
                  <FunnelIcon className="h-4 w-4" />
                  {statusFilter === 'all' ? 'Filtrar' : filterLabels[statusFilter]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border-border shadow-xl">
                <DropdownMenuLabel className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">Status da Partida</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(Object.keys(filterLabels) as MatchStatus[]).map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter === status}
                    onCheckedChange={() => setStatusFilter(status)}
                    className="font-bold text-xs"
                  >
                    {filterLabels[status]}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              size="sm" 
              variant="outline"
              className="gap-2 h-10 md:h-9 border-primary/50 text-primary hover:bg-primary/10 font-bold text-xs uppercase tracking-widest transition-all active:scale-95"
              onClick={() => {
                const types: ('goal' | 'card' | 'corner' | 'foul')[] = ['goal', 'card', 'corner', 'foul']
                const randomType = types[Math.floor(Math.random() * types.length)]
                triggerQte(randomType)
              }}
            >
              <BoltIcon className="h-4 w-4 fill-current" />
              Simular
            </Button>

            <FollowMatchDialog>
              <Button size="sm" className="col-span-2 lg:col-auto lg:w-auto gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 md:h-9 font-black uppercase tracking-tighter italic shadow-[0_4px_15px_rgba(var(--primary),0.2)]">
                <PlusIcon className="h-4 w-4" />
                Seguir Novo Jogo
              </Button>
            </FollowMatchDialog>
          </div>
        </div>
      </div>

      {(statusFilter !== 'all' || search.trim()) && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {statusFilter !== 'all' && (
            <Badge variant="secondary" className="gap-1 pl-2 pr-1 h-7">
              Status: {filterLabels[statusFilter]}
              <button 
                onClick={() => setStatusFilter('all')}
                className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {search.trim() && (
            <Badge variant="secondary" className="gap-1 pl-2 pr-1 h-7">
              Busca: "{search}"
              <button 
                onClick={() => setSearch('')}
                className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setStatusFilter('all')
              setSearch('')
            }}
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
          >
            Limpar tudo
          </Button>
        </div>
      )}
      
      {/* Matches Grid */}
      {filteredMatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 py-16">
          <TrophyIcon className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            {statusFilter === 'all' && !search ? 'Nenhum jogo seguido' : 'Nenhum jogo encontrado'}
          </h2>
          <p className="mb-4 text-sm text-muted-foreground text-center px-4">
            {statusFilter === 'all' && !search
              ? 'Comece a seguir jogos para receber insights em tempo real'
              : `Não foram encontrados jogos para os critérios selecionados.`}
          </p>
          {statusFilter !== 'all' || search ? (
            <Button 
              variant="outline" 
              onClick={() => {
                setStatusFilter('all')
                setSearch('')
              }}
            >
              Limpar filtros e busca
            </Button>
          ) : (
            <FollowMatchDialog>
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <PlusIcon className="h-4 w-4" />
                Explorar Jogos
              </Button>
            </FollowMatchDialog>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMatches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  )
}
