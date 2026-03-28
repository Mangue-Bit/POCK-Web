'use client'

import {
  TrophyIcon,
  PlusIcon,
  FunnelIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  SignalIcon,
} from '@heroicons/react/24/outline'
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { FollowMatchDialog } from '@/components/follow-match-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import { useUser } from '@/lib/user-context'
import { useQte } from '@/lib/qte-context'
import { useLiveMatches } from '@/hooks/use-live-matches'
import { LiveMatchCard } from '@/components/live-match-card'

export default function HomePage() {
  const { user } = useUser()
  const { liveMatchIds } = useQte()
  const { matches, loading, error } = useLiveMatches()
  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(false)

  // Matches the user is following that are also live
  const followedLive = useMemo(
    () => matches.filter(m => user.followedMatches.includes(m.match_id)),
    [matches, user.followedMatches],
  )

  const filtered = useMemo(() => {
    let ms = followedLive
    if (!showAll) {
      // default: live only (all API matches are live >= 10min)
    }
    if (search.trim()) {
      ms = ms.filter(
        m =>
          m.home.toLowerCase().includes(search.toLowerCase()) ||
          m.away.toLowerCase().includes(search.toLowerCase()),
      )
    }
    return ms
  }, [followedLive, showAll, search])

  const liveCount = followedLive.length

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8 transition-all">
      {/* Header Section */}
      <div className="mb-6 md:mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight italic uppercase">
            Jogos <span className="text-primary italic">Seguidos</span>
          </h1>
          {error && (
            <p className="text-[10px] font-black uppercase tracking-widest text-warning animate-pulse">
              ⚠ API indisponível — aguardando conexão
            </p>
          )}
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
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 lg:flex lg:items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 h-10 md:h-9 font-bold text-xs uppercase tracking-widest">
                  <FunnelIcon className="h-4 w-4" />
                  {showAll ? 'Todos' : 'Ao Vivo'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border-border shadow-xl">
                <DropdownMenuLabel className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">Exibir</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={!showAll}
                  onCheckedChange={() => setShowAll(false)}
                  className="font-bold text-xs"
                >
                  Ao Vivo (seguidos)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={showAll}
                  onCheckedChange={() => setShowAll(true)}
                  className="font-bold text-xs"
                >
                  Todos os seguidos
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <FollowMatchDialog>
              <Button size="sm" className="col-span-2 lg:col-auto lg:w-auto gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 md:h-9 font-black uppercase tracking-tighter italic shadow-[0_4px_15px_rgba(var(--primary),0.2)]">
                <PlusIcon className="h-4 w-4" />
                Seguir Novo Jogo
              </Button>
            </FollowMatchDialog>
          </div>
        </div>
      </div>

      {search.trim() && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="gap-1 pl-2 pr-1 h-7">
            Busca: &quot;{search}&quot;
            <button onClick={() => setSearch('')} className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20">
              <XMarkIcon className="h-3 w-3" />
            </button>
          </Badge>
          <Button variant="ghost" size="sm" onClick={() => setSearch('')} className="h-7 text-xs text-muted-foreground hover:text-foreground">
            Limpar
          </Button>
        </div>
      )}

      {/* Matches Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 py-16">
          <SignalIcon className="mb-4 h-12 w-12 text-primary animate-pulse" />
          <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground animate-pulse">
            Conectando ao IA RADAR...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 py-16">
          <TrophyIcon className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            {search ? 'Nenhum jogo encontrado' : 'Nenhum jogo ao vivo seguido'}
          </h2>
          <p className="mb-4 text-sm text-muted-foreground text-center px-4">
            {search
              ? 'Tente outro nome de clube.'
              : 'Siga jogos ao vivo para receber insights da IA em tempo real.'}
          </p>
          {!search && (
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
          {filtered.map(match => (
            <LiveMatchCard key={match.match_id} match={match} />
          ))}
        </div>
      )}
    </div>
  )
}
