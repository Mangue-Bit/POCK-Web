'use client'

import { useState } from 'react'
import {
  UserIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  HeartIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  RocketLaunchIcon,
  CalendarIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUser } from '@/lib/user-context'
import { bundesligaTeams } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import type { BettingProfile } from '@/lib/types'

const bettingProfiles: {
  value: BettingProfile
  label: string
  description: string
  icon: typeof ArrowTrendingUpIcon
  color: string
}[] = [
  {
    value: 'conservador',
    label: 'Conservador',
    description: 'Prefere apostas seguras com odds menores',
    icon: ShieldCheckIcon,
    color: 'text-info',
  },
  {
    value: 'moderado',
    label: 'Moderado',
    description: 'Equilibra risco e retorno nas apostas',
    icon: RocketLaunchIcon,
    color: 'text-primary',
  },
  {
    value: 'agressivo',
    label: 'Agressivo',
    description: 'Busca odds altas mesmo com maior risco',
    icon: ArrowTrendingUpIcon,
    color: 'text-warning',
  },
]

export default function ProfilePage() {
  const { user, updateProfile, setBettingProfile, setFavoriteTeam } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(user.name)
  const [editEmail, setEditEmail] = useState(user.email)

  const currentProfile = bettingProfiles.find(p => p.value === user.bettingProfile)
  const favoriteTeam = bundesligaTeams.find(t => t.id === user.favoriteTeam)

  const handleSave = () => {
    updateProfile({ name: editName, email: editEmail })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditName(user.name)
    setEditEmail(user.email)
    setIsEditing(false)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:py-8 transition-all">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-foreground italic uppercase tracking-tight">
          Meu <span className="text-primary italic">Perfil</span>
        </h1>
        <p className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-widest leading-none mt-1">
          Gestão de Experiência e IA
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Info Card */}
        <Card className="border-border bg-card rounded-2xl md:rounded-3xl shadow-lg border-white/5">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg font-black uppercase text-foreground italic">
              <UserIcon className="h-5 w-5 text-primary" />
              Informações
            </CardTitle>
            {!isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all"
              >
                <PencilIcon className="h-3.5 w-3.5" />
                Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="h-8 text-neutral-500 hover:text-foreground"
                >
                  <XMarkIcon className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="h-8 gap-1 bg-primary text-primary-foreground font-black text-[10px] px-3 border-none"
                >
                  <CheckIcon className="h-3.5 w-3.5" />
                  SALVAR
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/30 border-2 border-primary/20 text-2xl font-black text-primary shadow-[0_0_20px_rgba(var(--primary),0.1)] italic">
                {user.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .substring(0, 2)}
              </div>
              <div className="space-y-0.5">
                {isEditing ? (
                  <Input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="h-10 bg-secondary border-border text-foreground font-bold"
                  />
                ) : (
                  <p className="text-lg font-black text-foreground uppercase tracking-tight italic">
                    {user.name}
                  </p>
                )}
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  MEMBRO DESDE{' '}
                  <span className="text-neutral-300">
                    {user.createdAt.toLocaleDateString('pt-BR', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <EnvelopeIcon className="h-3.5 w-3.5" />
                E-mail de Contato
              </Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="h-10 bg-secondary border-border text-foreground font-bold"
                />
              ) : (
                <p className="text-sm font-bold text-foreground">{user.email}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Favorite Team Card */}
        <Card className="border-border bg-card rounded-2xl md:rounded-3xl shadow-lg border-white/5">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg font-black uppercase text-foreground italic">
              <HeartIcon className="h-5 w-5 text-destructive animate-pulse" />
              Time do Coração
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-secondary/20 p-4 transition-all hover:bg-secondary/30">
              {favoriteTeam && (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-background/50 border border-white/5 shadow-sm overflow-hidden p-2 transition-transform hover:scale-105">
                    <img 
                      src={favoriteTeam.logo} 
                      alt="" 
                      className="h-full w-full object-contain filter drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]" 
                    />
                  </div>
                  <div>
                    <p className="text-sm md:text-base font-black text-foreground uppercase italic tracking-tight">
                      {favoriteTeam.name}
                    </p>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Bundesliga Pro</p>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Trocar Fideicomisso</Label>
              <Select
                value={user.favoriteTeam}
                onValueChange={setFavoriteTeam}
              >
                <SelectTrigger className="h-11 bg-secondary border-border text-foreground font-bold">
                  <SelectValue placeholder="Selecione um time" />
                </SelectTrigger>
                <SelectContent className="bg-[#0c0c0c] border-white/10 text-white max-h-[300px]">
                  {bundesligaTeams.map(team => (
                    <SelectItem
                      key={team.id}
                      value={team.id}
                      className="text-white focus:bg-primary focus:text-primary-foreground font-bold text-xs py-2.5 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-white/10 p-1">
                          <img src={team.logo} alt="" className="h-full w-full object-contain" />
                        </div>
                        <span className="uppercase italic tracking-tight">{team.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Betting Profile Card */}
        <Card className="border-border bg-card md:col-span-2 rounded-2xl md:rounded-3xl shadow-xl border-white/5">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg font-black uppercase text-foreground italic">
              <RocketLaunchIcon className="h-5 w-5 text-primary" />
              Perfil de Apostador Inteligente
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-3 sm:grid-cols-3">
              {bettingProfiles.map(profile => {
                const Icon = profile.icon
                const isSelected = user.bettingProfile === profile.value

                return (
                  <button
                    key={profile.value}
                    onClick={() => setBettingProfile(profile.value)}
                    className={cn(
                      'flex flex-col items-center gap-4 rounded-2xl border-2 p-6 md:p-8 text-center transition-all min-h-[160px] relative overflow-hidden group',
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.1)] scale-100'
                        : 'border-white/5 bg-secondary/20 hover:bg-secondary/40 scale-95 opacity-80'
                    )}
                  >
                    {isSelected && <div className="absolute top-0 inset-x-0 h-1 bg-primary" />}
                    
                    <div
                      className={cn(
                        'flex h-14 w-14 items-center justify-center rounded-full transition-transform group-hover:scale-110 duration-500',
                        isSelected ? 'bg-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.3)]' : 'bg-secondary'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-7 w-7 transition-all',
                          isSelected ? profile.color : 'text-neutral-600'
                        )}
                      />
                    </div>
                    <div>
                      <p
                        className={cn(
                          'text-sm font-black uppercase italic tracking-tighter',
                          isSelected ? 'text-primary' : 'text-foreground'
                        )}
                      >
                        {profile.label}
                      </p>
                      <p className="mt-2 text-[10px] font-bold text-neutral-500 uppercase leading-relaxed tracking-wider">
                        {profile.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="mt-auto pt-2">
                        <Badge className="bg-primary text-primary-foreground font-black text-[9px] uppercase tracking-widest h-6">
                          ATIVO
                        </Badge>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Profile Info */}
            {currentProfile && (
              <div className="mt-8 rounded-2xl border-2 border-primary/20 bg-primary/5 p-5 relative overflow-hidden">
                 <div className="absolute -right-8 -top-8 h-24 w-24 bg-primary/10 blur-[40px]" />
                <div className="flex items-start gap-4 relative z-10">
                  <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-primary/10 border border-primary/30">
                    <ExclamationTriangleIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-foreground uppercase italic tracking-widest">
                      Configuração da POCK-IA
                    </h4>
                    <p className="mt-1 text-[11px] md:text-xs font-bold text-neutral-400 uppercase leading-relaxed tracking-wide">
                      {currentProfile.value === 'conservador' &&
                        'O ALGORITMO FILTRARÁ APENAS MERCADOS DE EXTREMA SEGURANÇA (>75%) E ODDS MODESTAS.'}
                      {currentProfile.value === 'moderado' &&
                        'ALERTA BALANCEADO. EQUILIBRIO ENTRE VALOR ESPERADO E PROBABILIDADE DE ACERTO.'}
                      {currentProfile.value === 'agressivo' &&
                        'VOCÊ RECEBERÁ TODO O FLUXO DE OPORTUNIDADES, INCLUINDO ALAVANCAGEM E ODDS ALTAS.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="border-border bg-card md:col-span-2 rounded-2xl md:rounded-3xl shadow-xl border-white/5">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg font-black uppercase text-foreground italic">
              <ArrowTrendingUpIcon className="h-5 w-5 text-primary" />
              Estatísticas de Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="rounded-2xl border border-white/5 bg-secondary/20 p-5 text-center transition-all hover:bg-secondary/40">
                <p className="text-3xl md:text-4xl font-black italic text-primary leading-none">
                  {user.followedMatches.length}
                </p>
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mt-2">Seguidos</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-secondary/20 p-5 text-center transition-all hover:bg-secondary/40">
                <p className="text-3xl md:text-4xl font-black italic text-white leading-none">47</p>
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mt-2">Insights</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-secondary/20 p-5 text-center transition-all hover:bg-secondary/40">
                <p className="text-3xl md:text-4xl font-black italic text-white leading-none">23</p>
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mt-2">Dias</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-secondary/20 p-5 text-center transition-all hover:bg-secondary/40">
                <p className="text-3xl md:text-4xl font-black italic text-primary leading-none shadow-[0_0_10px_rgba(var(--primary),0.2)]">68%</p>
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mt-2">Win Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
