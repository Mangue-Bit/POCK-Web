'use client'

import { Trophy, Plus, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MatchCard } from '@/components/match-card'
import { useUser } from '@/lib/user-context'
import { mockMatches } from '@/lib/mock-data'

export default function HomePage() {
  const { user } = useUser()

  const followedMatches = mockMatches.filter(match =>
    user.followedMatches.includes(match.id)
  )

  const liveCount = followedMatches.filter(
    m => m.status === 'live' || m.status === 'halftime'
  ).length

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Jogos Seguindo
            </h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe seus jogos em tempo real com insights inteligentes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {liveCount > 0 && (
            <Badge className="bg-primary/10 text-primary border border-primary/20">
              <span className="relative mr-2 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              {liveCount} ao vivo
            </Badge>
          )}
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtrar
          </Button>
          <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Seguir Jogo
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Seguindo</p>
          <p className="text-2xl font-bold text-foreground">{followedMatches.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Ao Vivo</p>
          <p className="text-2xl font-bold text-primary">{liveCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Gols Hoje</p>
          <p className="text-2xl font-bold text-foreground">
            {followedMatches.reduce((acc, m) => acc + m.homeScore + m.awayScore, 0)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Insights Hoje</p>
          <p className="text-2xl font-bold text-chart-5">12</p>
        </div>
      </div>

      {/* Matches Grid */}
      {followedMatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 py-16">
          <Trophy className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Nenhum jogo seguido
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Comece a seguir jogos para receber insights em tempo real
          </p>
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Explorar Jogos
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {followedMatches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}

      {/* Info Section */}
      <div className="mt-12 rounded-lg border border-primary/20 bg-primary/5 p-6">
        <h3 className="mb-2 font-semibold text-foreground">
          Como funcionam os insights?
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Nossa inteligência artificial analisa dados em tempo real das partidas,
          incluindo estatísticas, histórico, odds e padrões de jogo. Quando
          detectamos uma oportunidade ou mudança significativa, você recebe uma
          notificação com a análise e o nível de confiança do modelo. Tudo baseado
          em machine learning e explicabilidade SHAP.
        </p>
      </div>
    </div>
  )
}
