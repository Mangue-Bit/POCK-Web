'use client'

import { use } from 'react'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  SignalIcon,
  StarIcon,
  BoltIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUser } from '@/lib/user-context'
import { useInference } from '@/hooks/use-inference'
import { useLiveMatches } from '@/hooks/use-live-matches'
import { cn } from '@/lib/utils'
import { parseScore } from '@/lib/api'

interface PageProps {
  params: Promise<{ id: string }>
}

function StatBar({ label, home, away }: { label: string; home: number; away: number }) {
  const total = home + away || 1
  const homePct = Math.round((home / total) * 100)
  const awayPct = 100 - homePct
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[10px] font-black uppercase text-neutral-500 tracking-widest">
        <span>{home}</span>
        <span>{label}</span>
        <span>{away}</span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-neutral-800">
        <div className="bg-primary transition-all duration-500" style={{ width: `${homePct}%` }} />
        <div className="bg-neutral-600 transition-all duration-500" style={{ width: `${awayPct}%` }} />
      </div>
    </div>
  )
}

function PressureBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px] font-black uppercase">
        <span className="text-neutral-500 tracking-widest">{label}</span>
        <span className="text-primary">{Math.round(value * 100)}%</span>
      </div>
      <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-600 to-primary rounded-full transition-all duration-700"
          style={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  )
}

export default function MatchPage({ params }: PageProps) {
  const { id } = use(params)
  const { isFollowingMatch, followMatch, unfollowMatch } = useUser()
  const { matches } = useLiveMatches()
  const { data: inference, loading } = useInference(id)

  const isFollowing = isFollowingMatch(id)

  // Try to get basic match info from live matches list
  const liveMatch = matches.find(m => m.match_id === id)

  // If no inference available yet
  if (loading && !liveMatch) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground animate-pulse">
          Carregando análise IA...
        </p>
      </div>
    )
  }

  if (!inference && !liveMatch) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-foreground">Jogo não encontrado</h1>
        <p className="mt-2 text-sm text-muted-foreground">Aguarde o próximo ciclo do radar ou verifique se o jogo ainda está ao vivo.</p>
        <Link href="/">
          <Button variant="outline" className="mt-4 gap-2">
            <ArrowLeftIcon className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>
    )
  }

  // Use inference context if available, else fall back to liveMatch
  const home = inference?.snapshot_context.home ?? liveMatch?.home ?? '—'
  const away = inference?.snapshot_context.away ?? liveMatch?.away ?? '—'
  const score = inference?.snapshot_context.score ?? liveMatch?.score ?? '0:0'
  const minute = inference?.snapshot_context.minute ?? liveMatch?.minute ?? 0
  const league = inference?.snapshot_context.league ?? liveMatch?.league ?? ''

  const { home: homeScore, away: awayScore } = parseScore(score)
  const homeWinning = homeScore > awayScore
  const awayWinning = awayScore > homeScore


  const decision = inference?.decision
  const engine = inference?.decision_engine
  const model = inference?.model_outputs?.model_predict
  const drift = inference?.drift

  // Try all SHAP sources in priority order:
  // 1. shap.expanded.reasons (full SHAP)
  // 2. shap.predict_reasons (compact version)
  // 3. model_outputs.model_predict.shap_reasons (fallback)
  const shapReasons =
    (inference?.shap?.expanded?.reasons?.length ?? 0) > 0
      ? inference!.shap.expanded!.reasons
      : (inference?.shap?.predict_reasons?.length ?? 0) > 0
      ? inference!.shap.predict_reasons
      : (model?.shap_reasons?.length ?? 0) > 0
      ? model!.shap_reasons!
      : []
  const shapAvailable = shapReasons.length > 0

  const stats = liveMatch?.stats

  function getInitials(name: string) {
    return name.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 md:py-8 transition-all">
      {/* Back Button */}
      <Link href="/" className="mb-4 md:mb-6 inline-flex">
        <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground h-9 font-bold text-xs uppercase tracking-widest leading-none">
          <ArrowLeftIcon className="h-4 w-4" />
          Voltar
        </Button>
      </Link>

      {/* Match Header */}
      <Card className="mb-6 md:mb-8 overflow-hidden border-border bg-card shadow-xl rounded-2xl md:rounded-3xl">
        <CardContent className="p-0">
          {/* Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border bg-secondary/30 px-4 md:px-6 py-3 gap-3">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
              </span>
              <Badge className="text-[10px] md:text-sm font-black italic uppercase tracking-widest bg-primary text-primary-foreground">
                {minute}&apos;
              </Badge>
              <div className="flex items-center gap-1 text-[10px] md:text-sm font-black text-primary uppercase italic">
                <SignalIcon className="h-4 w-4 animate-pulse" />
                <span>Ao Vivo</span>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 text-[10px] md:text-sm font-bold text-muted-foreground uppercase tracking-tight">
                <span>{league}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'gap-2 h-9 md:h-10 font-bold text-xs uppercase tracking-widest transition-all active:scale-95',
                  isFollowing && 'border-primary text-primary bg-primary/5 shadow-[0_0_10px_rgba(var(--primary),0.1)]',
                )}
                onClick={() => isFollowing ? unfollowMatch(id) : followMatch(id)}
              >
                {isFollowing ? (
                  <>
                    <StarIconSolid className="h-4 w-4 text-primary" />
                    <span className="hidden min-[400px]:inline">Seguindo</span>
                  </>
                ) : (
                  <>
                    <StarIcon className="h-4 w-4" />
                    <span className="hidden min-[400px]:inline">Seguir</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Score Section */}
          <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-8 md:py-10 gap-8 md:gap-4">
            {/* Home Team */}
            <div className="flex flex-row md:flex-col items-center gap-4 flex-1 w-full md:w-auto justify-center md:justify-start">
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-secondary/40 border-2 border-white/5 flex items-center justify-center text-xl font-black text-foreground">
                {getInitials(home)}
              </div>
              <div className="text-left md:text-center w-full md:w-auto">
                <h2 className="text-lg md:text-2xl font-black text-foreground uppercase italic tracking-tighter line-clamp-1">{home}</h2>
                <p className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-widest">Mandante</p>
              </div>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center gap-2 md:gap-4 px-4 md:px-12 order-first md:order-none w-full md:w-auto">
              <div className="flex items-center gap-4 md:gap-8 bg-neutral-900/50 md:bg-transparent px-8 py-4 md:p-0 rounded-2xl border border-white/5 md:border-none shadow-inner md:shadow-none">
                <span className={cn('text-5xl md:text-7xl font-black tabular-nums italic tracking-tighter leading-none', homeWinning ? 'text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.3)]' : 'text-foreground')}>
                  {homeScore}
                </span>
                <span className="text-2xl md:text-4xl font-light text-muted-foreground opacity-30 italic">/</span>
                <span className={cn('text-5xl md:text-7xl font-black tabular-nums italic tracking-tighter leading-none', awayWinning ? 'text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.3)]' : 'text-foreground')}>
                  {awayScore}
                </span>
              </div>
              <div className="rounded-full bg-primary/10 px-4 py-1.5 text-[10px] md:text-xs font-black text-primary uppercase italic tracking-widest border border-primary/20 animate-pulse">
                {minute}&apos; MINUTO
              </div>
            </div>

            {/* Away Team */}
            <div className="flex flex-row-reverse md:flex-col items-center gap-4 flex-1 w-full md:w-auto justify-center md:justify-start">
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-secondary/40 border-2 border-white/5 flex items-center justify-center text-xl font-black text-foreground">
                {getInitials(away)}
              </div>
              <div className="text-right md:text-center w-full md:w-auto">
                <h2 className="text-lg md:text-2xl font-black text-foreground uppercase italic tracking-tighter line-clamp-1">{away}</h2>
                <p className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-widest">Visitante</p>
              </div>
            </div>
          </div>

          {/* Decision Trigger Banner */}
          {decision?.trigger && (
            <div className="mx-4 mb-4 rounded-xl border border-primary/30 bg-primary/5 p-3 flex items-center gap-3">
              <BoltIcon className="h-5 w-5 text-primary fill-current shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black uppercase tracking-widest text-primary">
                  {decision.triggered_by_qte
                    ? engine?.qte_events?.[0]
                      ? engine.qte_events[0].type === 'GOAL_IMMINENT'
                        ? 'Chance de Gol Iminente'
                        : engine.qte_events[0].type === 'OFFENSIVE_SURGE'
                        ? 'Surge Ofensivo Detectado'
                        : 'Caos no Fim de Jogo'
                      : 'Evento Tático Detectado'
                    : 'Momento Relevante Detectado pelo Modelo'}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-600 to-primary rounded-full transition-all" style={{ width: `${(decision.score / 1) * 100}%` }} />
                  </div>
                  <span className="text-[10px] font-black text-primary tabular-nums">{Math.round(decision.score * 100)}%</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="stats" className="space-y-6">
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <TabsList className="flex w-full min-w-[400px] h-12 bg-secondary/50 border border-white/5 p-1 rounded-xl">
            <TabsTrigger value="stats" className="flex-1 font-bold text-xs uppercase tracking-widest">Estatísticas</TabsTrigger>
            <TabsTrigger value="analysis" className="flex-1 font-bold text-xs uppercase tracking-widest">Raio-X da IA</TabsTrigger>
            <TabsTrigger value="shap" className="flex-1 font-bold text-xs uppercase tracking-widest">Por que a IA?</TabsTrigger>
          </TabsList>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            <TabsContent value="stats" className="mt-0 outline-none">
              <Card className="border-border bg-card rounded-2xl overflow-hidden shadow-lg shadow-black/20">
                <CardHeader className="border-b border-white/5 pb-4">
                  <CardTitle className="text-base md:text-lg font-black uppercase text-foreground italic tracking-tight">
                    Estatísticas da Partida
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  {stats ? (
                    <>
                      <StatBar label="Posse de Bola (%)" home={stats.possession[0]} away={stats.possession[1]} />
                      <StatBar label="Ataques" home={stats.attacks[0]} away={stats.attacks[1]} />
                      <StatBar label="Ataques Perigosos" home={stats.dangerous_attacks[0]} away={stats.dangerous_attacks[1]} />
                      <StatBar label="Chutes no Gol" home={stats.shots_on_target[0]} away={stats.shots_on_target[1]} />
                    </>
                  ) : (
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground text-center py-8 animate-pulse">
                      Aguardando dados do jogo...
                    </p>
                  )}

                  {engine?.indicators && (
                    <div className="mt-6 pt-5 border-t border-white/5 space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Controle do Jogo — Visão da IA</h4>
                      <PressureBar label={`Pressão de Ataque — ${home}`} value={engine.indicators.offensive_pressure.home} />
                      <PressureBar label={`Pressão de Ataque — ${away}`} value={engine.indicators.offensive_pressure.away} />
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="rounded-xl bg-secondary/40 p-3 border border-white/5">
                          <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Quem está dominando</p>
                          <p className="text-sm font-black text-primary tabular-nums mt-0.5">
                            {engine.indicators.momentum_index > 0.5 ? home : away}
                            <span className="text-[9px] text-neutral-500 ml-1 font-bold normal-case">no controle</span>
                          </p>
                        </div>
                        <div className="rounded-xl bg-secondary/40 p-3 border border-white/5">
                          <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Jogo Aberto</p>
                          <p className="text-sm font-black text-foreground tabular-nums mt-0.5">
                            {Math.round(engine.indicators.game_openness * 100)}%
                            <span className="text-[9px] text-neutral-500 ml-1 font-bold normal-case">imprevisível</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="mt-0 outline-none">
              <Card className="border-border bg-card rounded-2xl overflow-hidden shadow-lg shadow-black/20">
                <CardHeader className="border-b border-white/5 pb-4">
                  <CardTitle className="text-base md:text-lg font-black uppercase text-foreground italic tracking-tight">
                    Raio-X da Partida
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  {model ? (
                    <>
                      {[
                        { label: 'Chance de Gol', value: model.goal_prob, color: 'from-red-700 to-red-500' },
                        { label: 'Chance de Escanteio', value: model.corner_prob, color: 'from-orange-700 to-orange-500' },
                        { label: 'Nível de Pressão', value: model.pressure_index, color: 'from-emerald-700 to-primary' },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-black uppercase">
                            <span className="text-neutral-500 tracking-widest">{label}</span>
                            <span className="text-foreground">{Math.round(value * 100)}%</span>
                          </div>
                          <div className="h-2.5 rounded-full bg-neutral-800 overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-700`} style={{ width: `${value * 100}%` }} />
                          </div>
                        </div>
                      ))}

                      {engine?.qte_events && engine.qte_events.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Alertas detectados pela IA</h4>
                          {engine.qte_events.map((qte, i) => {
                            const colorMap = {
                              GOAL_IMMINENT: 'border-red-700/40 bg-red-900/10 text-red-400',
                              OFFENSIVE_SURGE: 'border-orange-700/40 bg-orange-900/10 text-orange-400',
                              LATE_GAME_CHAOS: 'border-yellow-700/40 bg-yellow-900/10 text-yellow-400',
                            }
                            const c = colorMap[qte.type as keyof typeof colorMap] ?? 'border-primary/40 bg-primary/10 text-primary'
                            return (
                              <div key={i} className={cn('rounded-xl border p-3 space-y-2', c)}>
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black uppercase tracking-widest">
                                    {qte.type === 'GOAL_IMMINENT' ? '🔴 Gol a caminho' : qte.type === 'OFFENSIVE_SURGE' ? '🟠 Time pressionando forte' : '🟡 Jogo imprevisível no final'}
                                    {qte.team_name ? ` — ${qte.team_name}` : ''}
                                  </span>
                                  <span className="text-[10px] font-black">Certeza: {Math.round(qte.confidence * 100)}%</span>
                                </div>
                                <div className="space-y-1">
                                  {qte.reasons.map((r, ri) => (
                                    <p key={ri} className="text-[10px] font-bold text-neutral-400 flex items-start gap-1.5">
                                      <span className="mt-0.5 shrink-0">›</span> {r}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground text-center py-8 animate-pulse">
                      Coletando dados da partida...
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shap" className="mt-0 outline-none">
              <Card className="border-border bg-card rounded-2xl overflow-hidden shadow-lg shadow-black/20">
                <CardHeader className="border-b border-white/5 pb-4">
                  <CardTitle className="text-base md:text-lg font-black uppercase text-foreground italic tracking-tight">
                    Por que a IA tomou essa decisão?
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {shapAvailable ? (
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                        Principais motivos que levaram a IA a emitir esse alerta
                      </p>
                      {shapReasons.map((r, i) => {
                        const positive = r.direction.toLowerCase().includes('aumenta')
                        return (
                          <div key={i} className="flex items-center gap-3 rounded-xl bg-secondary/30 p-3 border border-white/5">
                            <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full border', positive ? 'border-primary/30 bg-primary/10' : 'border-red-700/30 bg-red-900/10')}>
                              {i === 0 && <ArrowTrendingUpIcon className={cn('h-4 w-4', positive ? 'text-primary' : 'text-red-400')} />}
                              {i === 1 && <ChartBarIcon className={cn('h-4 w-4', positive ? 'text-primary' : 'text-red-400')} />}
                              {i >= 2 && <FireIcon className={cn('h-4 w-4', positive ? 'text-primary' : 'text-red-400')} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-black text-foreground uppercase tracking-tight">{r.label}</p>
                              <p className="text-[10px] font-bold text-neutral-500">{r.direction}</p>
                            </div>
                            <span className={cn('text-[11px] font-black tabular-nums', positive ? 'text-primary' : 'text-red-400')}>
                              {r.contribution_pct}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                      <div className="rounded-full border border-primary/20 bg-primary/5 p-4">
                        <ChartBarIcon className="h-8 w-8 text-primary/40" />
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                          {!inference ? 'Carregando análise...' : 'A IA ainda está analisando'}
                        </p>
                        <p className="text-[10px] font-bold text-neutral-600 max-w-[260px] leading-relaxed">
                          {inference
                            ? 'A IA precisa de alguns minutos acompanhando o jogo antes de explicar os motivos das suas decisões. Continue monitorando e as razões aparecerão em breve.'
                            : 'A IA está coletando informações sobre essa partida pela primeira vez.'}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Decision Score */}
            {decision && (
              <Card className="border-border bg-card rounded-2xl shadow-lg overflow-hidden">
                <CardHeader className="border-b border-white/5 pb-3">
                  <CardTitle className="text-[10px] md:text-xs font-black uppercase text-muted-foreground tracking-widest">
                    Nível de Alerta da IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">Intensidade</span>
                    <span className="font-mono text-sm font-bold text-foreground">{Math.round(decision.score * 100)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">Mínimo para alertar</span>
                    <span className="font-mono text-sm font-bold text-foreground">{Math.round(decision.threshold * 100)}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-neutral-800 overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-700', decision.trigger ? 'bg-gradient-to-r from-emerald-600 to-primary' : 'bg-neutral-600')}
                      style={{ width: `${Math.min(decision.score * 100, 100)}%` }}
                    />
                  </div>
                  <Badge className={cn('w-full justify-center font-black uppercase italic tracking-widest text-[10px]', decision.trigger ? 'bg-primary/20 text-primary border-primary/30' : 'bg-neutral-800 text-neutral-400 border-white/5')}>
                    {decision.trigger ? '⚡ MOMENTO QUENTE' : 'Monitorando...'}
                  </Badge>
                </CardContent>
              </Card>
            )}

            {/* Model Probabilities */}
            {model && (
              <Card className="border-border bg-card rounded-2xl shadow-lg">
                <CardHeader className="border-b border-white/5 pb-3">
                  <CardTitle className="text-[10px] md:text-xs font-black uppercase text-muted-foreground tracking-widest">
                    Previsões da IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  {[
                    { label: '⚽ Chance de Gol', val: model.goal_prob },
                    { label: '🚩 Chance de Escanteio', val: model.corner_prob },
                    { label: '🔥 Pressão no Jogo', val: model.pressure_index },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex items-center justify-between rounded-xl bg-secondary/40 p-3 border border-white/5">
                      <span className="text-[10px] font-black uppercase text-neutral-500 tracking-tighter">{label}</span>
                      <Badge className="bg-primary/10 text-primary font-mono border-0 w-fit text-[11px]">
                        {Math.round(val * 100)}%
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Drift */}
            {drift !== null && drift !== undefined && (
              <Card className="border-border bg-card rounded-2xl shadow-lg">
                <CardHeader className="border-b border-white/5 pb-3">
                  <CardTitle className="text-[10px] md:text-xs font-black uppercase text-muted-foreground tracking-widest">
                    Variação (Drift)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {drift.has_previous ? (
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">Δ Features</p>
                      <p className="text-lg font-black text-foreground tabular-nums">{drift.l1_sum_abs_delta.toFixed(4)}</p>
                      <p className="text-[9px] font-bold text-neutral-600">Variação total das features nos últimos 60s</p>
                    </div>
                  ) : (
                    <p className="text-[10px] font-bold text-neutral-600 italic">Primeira chamada — sem referência anterior</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  )
}
