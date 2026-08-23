'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  BadgeCheck,
  Banknote,
  Briefcase,
  CalendarDays,
  Clock3,
  Crown,
  LayoutDashboard,
  Loader2,
  RefreshCw,
  Trophy,
  UsersRound,
  Wallet,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { isDeveloperEmail } from '@/lib/developers'
import {
  DashboardShell,
  DashboardHeader,
  StatCard,
  Tabs,
  StatusBadge,
  EmptyState,
  LoadingState,
} from '@/components/dashboard'

type Project = {
  id: string
  developer_email: string
  title: string
  description: string
  client: string
  amount: string
  status: 'Assigned' | 'In Progress' | 'Completed'
  deadline: string | null
  created_at: string
}

type Earning = {
  id: string
  developer_email: string
  project_title: string
  amount_earned: string
  paid: boolean
  paid_at: string | null
  description: string
  created_at: string
}

type Team = {
  id: string
  name: string
  color: string
  members: { id: string; name: string; points: number }[]
}

function formatDate(iso: string | null) {
  if (!iso) return 'No deadline'
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function parseAmount(amount: string) {
  const num = parseFloat(String(amount).replace(/[^0-9.-]/g, ''))
  return isNaN(num) ? 0 : num
}

export default function DeveloperDashboard() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [userName, setUserName] = useState('')
  const [activeView, setActiveView] = useState<'projects' | 'earnings' | 'teams'>('projects')
  const [projects, setProjects] = useState<Project[]>([])
  const [earnings, setEarnings] = useState<Earning[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [loadingEarnings, setLoadingEarnings] = useState(false)
  const [loadingTeams, setLoadingTeams] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user || !isDeveloperEmail(user.email)) {
        router.replace('/login')
        return
      }

      setUserName((user.user_metadata?.full_name as string) || user.email?.split('@')[0] || 'Developer')
      setAuthorized(true)
      setChecking(false)
    }

    checkAuth()
  }, [router])

  const loadProjects = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.email) return

    const { data, error } = await supabase
      .from('developer_projects')
      .select('*')
      .eq('developer_email', user.email.toLowerCase())
      .order('created_at', { ascending: false })

    if (!error && data) {
      setProjects(data as Project[])
    }
  }

  const loadEarnings = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.email) return
    const { data, error } = await supabase
      .from('developer_earnings')
      .select('*')
      .eq('developer_email', user.email.toLowerCase())
      .order('created_at', { ascending: false })

    if (!error && data) {
      setEarnings(data as Earning[])
    }
  }

  const loadTeams = async () => {
    const { data, error } = await supabase.from('teams').select('*')
    if (!error && data && data.length > 0) {
      setTeams(data as Team[])
    }
  }

  useEffect(() => {
    if (!authorized) return
    let cancelled = false

    ;(async () => {
      await Promise.all([loadProjects(), loadEarnings(), loadTeams()])
      if (!cancelled) {
        setLoadingProjects(false)
        setLoadingEarnings(false)
        setLoadingTeams(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [authorized])

  const handleRefresh = async () => {
    setRefreshing(true)
    setLoadingProjects(true)
    setLoadingEarnings(true)
    setLoadingTeams(true)
    await Promise.all([loadProjects(), loadEarnings(), loadTeams()])
    setLoadingProjects(false)
    setLoadingEarnings(false)
    setLoadingTeams(false)
    setRefreshing(false)
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <div className="flex items-center gap-3 text-white/70">
          <Loader2 className="h-6 w-6 animate-spin text-red-400" />
          Verifying developer access...
        </div>
      </main>
    )
  }

  if (!authorized) return null

  const totalEarnings = earnings.reduce((sum, e) => sum + parseAmount(e.amount_earned), 0)
  const paidEarnings = earnings.filter((e) => e.paid).reduce((sum, e) => sum + parseAmount(e.amount_earned), 0)
  const inProgressProjects = projects.filter((p) => p.status === 'In Progress').length
  const completedProjects = projects.filter((p) => p.status === 'Completed').length

  const statCards = [
    { label: 'Assigned Projects', value: projects.length, icon: Briefcase, accent: 'text-blue-400 bg-blue-500/10' },
    { label: 'In Progress', value: inProgressProjects, icon: Clock3, accent: 'text-amber-400 bg-amber-500/10' },
    { label: 'Completed', value: completedProjects, icon: BadgeCheck, accent: 'text-emerald-400 bg-emerald-500/10' },
    { label: 'Total Earnings', value: `₹${totalEarnings.toLocaleString('en-IN')}`, icon: Banknote, accent: 'text-red-400 bg-red-500/10' },
  ]

  const sortedTeams = teams.map((team) => ({
    ...team,
    members: [...team.members].sort((a, b) => b.points - a.points),
  }))

  const tabs = [
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'earnings', label: 'Earnings', icon: Wallet },
    { id: 'teams', label: 'Team Points', icon: Trophy },
  ] as const

  return (
    <DashboardShell>
      <DashboardHeader
        brandLabel="Brandnest Developer"
        title="Your Workspace"
        userName={userName}
        roleLabel="Full Stack Developer"
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome banner */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-red-950/60 via-[#0a0a0a] to-red-950/40 p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(220,38,38,0.18),transparent_50%)]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-300">Welcome back</p>
            <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">Full Stack Developer Dashboard</h2>
            <p className="mt-2 max-w-2xl text-white/70">
              Track your assigned projects, view your earnings, and check team standings all in one place.
            </p>
          </div>
        </section>

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map(({ label, value, icon, accent }) => (
            <StatCard key={label} label={label} value={value} icon={icon} accent={accent} />
          ))}
        </div>

        {/* View tabs */}
        <Tabs tabs={tabs} activeTab={activeView} onChange={(id) => setActiveView(id as typeof activeView)} className="grid-cols-3 sm:max-w-md" />

        {/* Projects view */}
        {activeView === 'projects' && (
          <section className="mt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <LayoutDashboard className="h-5 w-5 text-red-400" />
                <h2 className="text-xl font-black text-white">My Assigned Projects</h2>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/80">
                {projects.length} total
              </span>
            </div>

            {loadingProjects ? (
              <LoadingState label="Loading projects..." />
            ) : projects.length === 0 ? (
              <EmptyState icon={Briefcase} title="No projects assigned yet" description="Projects assigned to you will appear here." />
            ) : (
              <div className="mt-6 space-y-4">
                {projects.map((project) => (
                  <article key={project.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-bold text-white">{project.title}</h3>
                          <StatusBadge status={project.status} />
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-white/80">
                          {project.client && (
                            <span className="inline-flex items-center gap-1.5">
                              <UsersRound className="h-3.5 w-3.5 text-red-400" />
                              {project.client}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5 text-red-400" />
                            Deadline: {formatDate(project.deadline)}
                          </span>
                          <span className="font-semibold text-white">
                            {project.amount}
                          </span>
                        </div>
                        {project.description && (
                          <p className="mt-3 rounded-xl border border-white/5 bg-black/25 px-4 py-3 text-sm leading-6 text-white/85">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Earnings view */}
        {activeView === 'earnings' && (
          <section className="mt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-red-400" />
                <h2 className="text-xl font-black text-white">Amount Earned</h2>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/80">
                {earnings.length} payments
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <article className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-300">Total Earnings</p>
                <p className="mt-2 text-3xl font-black text-white">₹{totalEarnings.toLocaleString('en-IN')}</p>
              </article>
              <article className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Paid</p>
                <p className="mt-2 text-3xl font-black text-white">₹{paidEarnings.toLocaleString('en-IN')}</p>
              </article>
              <article className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">Pending</p>
                <p className="mt-2 text-3xl font-black text-white">₹{(totalEarnings - paidEarnings).toLocaleString('en-IN')}</p>
              </article>
            </div>

            {loadingEarnings ? (
              <LoadingState label="Loading earnings..." />
            ) : earnings.length === 0 ? (
              <EmptyState icon={Banknote} title="No earnings yet" description="Your payment records will appear here." />
            ) : (
              <div className="mt-6 space-y-4">
                {earnings.map((earning) => (
                  <article key={earning.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-bold text-white">{earning.project_title || 'Project Payment'}</h3>
                          <StatusBadge status={earning.paid ? 'Paid' : 'Pending'} />
                        </div>
                        {earning.description && (
                          <p className="mt-2 text-sm leading-6 text-white/70">{earning.description}</p>
                        )}
                        <p className="mt-2 text-xs text-white/50">
                          {formatDate(earning.created_at)}
                          {earning.paid_at ? ` · Paid on ${formatDate(earning.paid_at)}` : ''}
                        </p>
                      </div>
                      <div className="shrink-0 text-left sm:text-right">
                        <p className="text-2xl font-black text-white">₹{parseAmount(earning.amount_earned).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Team points view */}
        {activeView === 'teams' && (
          <section className="mt-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-red-400" />
              <h2 className="text-xl font-black text-white">Team Points</h2>
            </div>

            {loadingTeams ? (
              <LoadingState label="Loading teams..." />
            ) : sortedTeams.length === 0 ? (
              <EmptyState icon={Trophy} title="No team data yet" description="Team points will appear here." />
            ) : (
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {sortedTeams.map((team, teamIndex) => {
                  const isTeam1 = teamIndex === 0
                  const teamTotal = team.members.reduce((sum, m) => sum + m.points, 0)
                  const accentText = isTeam1 ? 'text-red-400' : 'text-blue-400'
                  const accentBg = isTeam1 ? 'bg-red-500/10' : 'bg-blue-500/10'
                  const accentBorder = isTeam1 ? 'border-red-500/30' : 'border-blue-500/30'

                  return (
                    <section key={team.id} className={`rounded-3xl border ${accentBorder} bg-white/[0.03] p-6`}>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accentBg} ${accentText}`}>
                            <UsersRound className="h-6 w-6" />
                          </div>
                          <div>
                            <h2 className={`text-2xl font-black uppercase tracking-wide ${accentText}`}>{team.name}</h2>
                            <p className="text-sm text-white/70">{team.members.length} members</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-3xl font-black ${accentText}`}>{teamTotal}</p>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Points</p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-2">
                        {team.members.map((member, memberIndex) => {
                          const isTop = memberIndex === 0 && member.points > 0
                          return (
                            <div
                              key={member.id}
                              className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
                                isTop
                                  ? 'border-amber-400/40 bg-amber-500/10 shadow-[0_0_25px_rgba(251,191,36,0.08)]'
                                  : 'border-white/5 bg-black/25'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isTop ? 'bg-amber-400 text-black' : `${accentBg} ${accentText}`}`}>
                                  {memberIndex + 1}
                                </span>
                                <div>
                                  <p className={`font-semibold ${isTop ? 'text-amber-300' : 'text-white'}`}>
                                    {member.name}
                                    {isTop && <Crown className="ml-1.5 inline h-4 w-4" />}
                                  </p>
                                  <p className="text-xs text-white/70">{member.points} pts</p>
                                </div>
                              </div>
                              {isTop && (
                                <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                                  Leader
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </section>
                  )
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </DashboardShell>
  )
}