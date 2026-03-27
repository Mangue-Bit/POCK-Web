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
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações e preferências de apostas
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Info Card */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <UserIcon className="h-5 w-5 text-primary" />
              Informações Básicas
            </CardTitle>
            {!isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <PencilIcon className="h-4 w-4" />
                Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <XMarkIcon className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="gap-2 bg-primary text-primary-foreground"
                >
                  <CheckIcon className="h-4 w-4" />
                  Salvar
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/40 text-2xl font-bold text-primary">
                {user.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .substring(0, 2)}
              </div>
              <div>
                {isEditing ? (
                  <Input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="bg-secondary border-border text-foreground"
                  />
                ) : (
                  <p className="text-lg font-semibold text-foreground">
                    {user.name}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Membro desde{' '}
                  {user.createdAt.toLocaleDateString('pt-BR', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <EnvelopeIcon className="h-4 w-4" />
                Email
              </Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="bg-secondary border-border text-foreground"
                />
              ) : (
                <p className="text-foreground">{user.email}</p>
              )}
            </div>

            {/* Member Since */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                Data de Cadastro
              </Label>
              <p className="text-foreground">
                {user.createdAt.toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Favorite Team Card */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <HeartIcon className="h-5 w-5 text-destructive" />
              Time do Coração
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg border border-border bg-secondary/30 p-4">
              {favoriteTeam && (
                <>
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-background border border-border shadow-sm overflow-hidden p-2">
                    <img 
                      src={favoriteTeam.logo} 
                      alt="" 
                      className="h-full w-full object-contain drop-shadow-sm" 
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {favoriteTeam.name}
                    </p>
                    <p className="text-sm text-muted-foreground">Bundesliga</p>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Alterar Time</Label>
              <Select
                value={user.favoriteTeam}
                onValueChange={setFavoriteTeam}
              >
                <SelectTrigger className="bg-secondary border-border text-foreground">
                  <SelectValue placeholder="Selecione um time" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {bundesligaTeams.map(team => (
                    <SelectItem
                      key={team.id}
                      value={team.id}
                      className="text-foreground"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-muted/50 p-1">
                          <img src={team.logo} alt="" className="h-full w-full object-contain" />
                        </div>
                        <span className="font-medium">{team.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Betting Profile Card */}
        <Card className="border-border bg-card md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <RocketLaunchIcon className="h-5 w-5 text-primary" />
              Perfil de Apostador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {bettingProfiles.map(profile => {
                const Icon = profile.icon
                const isSelected = user.bettingProfile === profile.value

                return (
                  <button
                    key={profile.value}
                    onClick={() => setBettingProfile(profile.value)}
                    className={cn(
                      'flex flex-col items-center gap-3 rounded-lg border p-6 text-center transition-all',
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-secondary/30 hover:bg-secondary/50'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-full',
                        isSelected ? 'bg-primary/20' : 'bg-secondary'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-6 w-6',
                          isSelected ? profile.color : 'text-muted-foreground'
                        )}
                      />
                    </div>
                    <div>
                      <p
                        className={cn(
                          'font-semibold',
                          isSelected ? 'text-primary' : 'text-foreground'
                        )}
                      >
                        {profile.label}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {profile.description}
                      </p>
                    </div>
                    {isSelected && (
                      <Badge className="bg-primary text-primary-foreground">
                        Selecionado
                      </Badge>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Profile Info */}
            {currentProfile && (
              <div className="mt-6 rounded-lg border border-border bg-secondary/30 p-4">
                <div className="flex items-start gap-3">
                  <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 text-warning" />
                  <div>
                    <p className="font-medium text-foreground">
                      Configuração de Insights
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {currentProfile.value === 'conservador' &&
                        'Você receberá insights apenas para oportunidades com alta confiança (>70%) e odds mais baixas.'}
                      {currentProfile.value === 'moderado' &&
                        'Você receberá insights balanceados, com confiança média (>60%) e odds variadas.'}
                      {currentProfile.value === 'agressivo' &&
                        'Você receberá todos os insights, incluindo oportunidades de maior risco com odds elevadas.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="border-border bg-card md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <ArrowTrendingUpIcon className="h-5 w-5 text-primary" />
              Estatísticas de Uso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-lg border border-border bg-secondary/30 p-4 text-center">
                <p className="text-3xl font-bold text-primary">
                  {user.followedMatches.length}
                </p>
                <p className="text-sm text-muted-foreground">Jogos Seguindo</p>
              </div>
              <div className="rounded-lg border border-border bg-secondary/30 p-4 text-center">
                <p className="text-3xl font-bold text-foreground">47</p>
                <p className="text-sm text-muted-foreground">Insights Recebidos</p>
              </div>
              <div className="rounded-lg border border-border bg-secondary/30 p-4 text-center">
                <p className="text-3xl font-bold text-foreground">23</p>
                <p className="text-sm text-muted-foreground">Dias Ativos</p>
              </div>
              <div className="rounded-lg border border-border bg-secondary/30 p-4 text-center">
                <p className="text-3xl font-bold text-chart-1">68%</p>
                <p className="text-sm text-muted-foreground">Taxa de Acerto</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
