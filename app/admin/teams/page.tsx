'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Crown,
  LayoutDashboard,
  Loader2,
  LogIn,
  Plus,
  Trophy,
  Users,
  X,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

const ADMIN_EMAIL = 'devdharrshans.23csd@kongu.edu'

type Member = {
  id: string
  name: string
  points: number
  isTeamLead?: boolean
  onBreak?: boolean
  breakReturnDays?: number
  breakReturnDate?: string
  breakDuration?: string
}

type Team = {
  id: string
  name: string
  color: string
  members: Member[]
  weeksWins: number
}

const initialTeams: Team[] = [
  {
    id: 'team1',
    name: 'Team 1',
    color: 'red',
    weeksWins: 3,
    members: [
      { id: 't1m1', name: 'Ranjith', points: 0 },
      { id: 't1m2', name: 'Manju Shri', points: 0 },
      { id: 't1m3', name: 'Gokul Shankar', points: 0 },
      { id: 't1m4', name: 'Priyanka', points: 0, isTeamLead: true },
    ],
  },
  {
    id: 'team2',
    name: 'Team 2',
    color: 'blue',
    weeksWins: 0,
    members: [
      { id: 't2m1', name: 'Prakalya', points: 0 },
      { id: 't2m2', name: 'Roshini', points: 0, onBreak: true, breakDuration: '1 month', breakReturnDate: '2026-09-30T00:00:00' },
      { id: 't2m3', name: 'Dhavanithi', points: 0 },
      { id: 't2m4', name: 'Pushparajan', points: 0 },
      { id: 't2m5', name: 'gokulavarshini', points: 0 },
      { id: 't2m6', name: 'Devv Sharann', points: 0 },
      { id: 't2m7', name: 'Nadhin', points: 0, isTeamLead: true },
    ],
  },
]

export default function AdminTeamsPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [teams, setTeams] = useState<Team[]>(initialTeams)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [addMemberTeam, setAddMemberTeam] = useState<string | null>(null)
  const [newMemberName, setNewMemberName] = useState('')
  const [countdown, setCountdown] = useState<{[key: string]: string}>({})

  // Live countdown timer for members on break
  useEffect(() => {
    const updateCountdowns = () => {
      const newCountdowns: {[key: string]: string} = {}
      const now = new Date().getTime()
      teams.forEach(team => {
        team.members.forEach(member => {
          if (!member.onBreak) return
          const returnTime = member.breakReturnDate
            ? new Date(member.breakReturnDate).getTime()
            : member.breakReturnDays
              ? now + member.breakReturnDays * 24 * 60 * 60 * 1000
              : null
          if (returnTime === null) return
          const diff = Math.max(0, returnTime - now)
          const days = Math.floor(diff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((diff % (1000 * 60)) / 1000)
          newCountdowns[member.id] = `${days}d ${hours}h ${minutes}m ${seconds}s`
        })
      })
      setCountdown(newCountdowns)
    }

    updateCountdowns()
    // Tick every second for a live countdown
    const interval = setInterval(updateCountdowns, 1000)
    return () => clearInterval(interval)
  }, [teams])

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL) {
        router.replace('/login')
        return
      }

      setAuthorized(true)
      setChecking(false)
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    if (!authorized) return

    const loadTeams = async () => {
      const { data, error } = await supabase.from('teams').select('*')
      if (!error && data && data.length > 0) {
        // Fall back to default week wins if the column/value is missing in the DB,
        // and remove any duplicate members (by name) defensively
        const merged = (data as Team[]).map((t) => {
          const seenNames = new Set<string>()
          const seenIds = new Set<string>()
          return {
            ...t,
            members: (t.members || []).filter((m) => {
              const key = m.name.trim().toLowerCase()
              if (seenNames.has(key)) return false
              seenNames.add(key)
              return true
            }).map((m, i) => {
              let id = m.id
              if (!id || seenIds.has(id)) id = `${t.id}-m${i}`
              seenIds.add(id)
              return { ...m, id }
            }),
            weeksWins: t.weeksWins ?? (t.name === 'Team 1' ? 3 : 0),
          }
        })
        setTeams(merged)
      }
      setLoading(false)
    }

    loadTeams()
  }, [authorized])

  const saveTeams = async () => {
    setSaving(true)
    // Try saving with weeksWins; if the column doesn't exist yet in the DB, retry without it
    let { error } = await supabase.from('teams').upsert(teams)
    if (error) {
      const stripped = teams.map(({ weeksWins, ...rest }) => rest)
      const retry = await supabase.from('teams').upsert(stripped)
      error = retry.error
    }
    setSaving(false)
    if (error) {
      console.error('Failed to save teams:', error)
    }
  }

  const updatePoints = (teamId: string, memberId: string, delta: number) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? {
              ...team,
              members: team.members.map((m) =>
                m.id === memberId ? { ...m, points: Math.max(0, m.points + delta) } : m
              ),
            }
          : team
      )
    )
  }

  const addMember = (teamId: string) => {
    if (!newMemberName.trim()) return
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? {
              ...team,
              members: [
                ...team.members,
                { id: `${teamId}-${Date.now()}`, name: newMemberName.trim(), points: 0 },
              ],
            }
          : team
      )
    )
    setNewMemberName('')
    setAddMemberTeam(null)
  }

  const removeMember = (teamId: string, memberId: string) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? { ...team, members: team.members.filter((m) => m.id !== memberId) }
          : team
      )
    )
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <div className="flex items-center gap-3 text-white/70">
          <Loader2 className="h-6 w-6 animate-spin text-red-400" />
          Verifying admin access...
        </div>
      </main>
    )
  }

  if (!authorized) return null

  // Sort members within each team by points descending so the top scorer is at the top
  const sortedTeams = teams.map((team) => ({
    ...team,
    members: [...team.members].sort((a, b) => b.points - a.points),
  }))

  const team1 = sortedTeams[0]
  const team2 = sortedTeams[1]
  const team1Total = team1?.members.reduce((sum, m) => sum + m.points, 0) ?? 0
  const team2Total = team2?.members.reduce((sum, m) => sum + m.points, 0) ?? 0
  const leader = team1Total > team2Total ? 'Team 1' : team2Total > team1Total ? 'Team 2' : 'Tie'
  const totalPoints = team1Total + team2Total
  const team1Percent = totalPoints > 0 ? (team1Total / totalPoints) * 100 : 50

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Image src="/brandnest-logo.png" alt="Brandnest logo" width={44} height={44} className="h-11 w-11 rounded-full object-cover shadow-[0_0_30px_rgba(220,38,38,0.35)]" />
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-red-400">Brandnest Admin</p>
              <h1 className="text-xl font-black leading-tight text-white">Teams Competition</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
            >
              <LogIn className="h-4 w-4" />
              Logout
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* VS Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-red-950/60 via-[#0a0a0a] to-blue-950/60 p-8 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.15),transparent_50%)]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-amber-300">
              <Trophy className="h-4 w-4" />
              {leader === 'Tie' ? 'It\'s a Tie!' : `${leader} is Leading`}
            </div>
            <div className="mt-6 flex items-center justify-center gap-6 sm:gap-12">
              <div className="text-center">
                <p className="text-4xl font-black text-red-400 sm:text-6xl">{team1Total}</p>
                <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em] text-white/70">Team 1</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/20 bg-black/50 text-2xl font-black text-white/80 sm:h-20 sm:w-20 sm:text-3xl">
                VS
              </div>
              <div className="text-center">
                <p className="text-4xl font-black text-blue-400 sm:text-6xl">{team2Total}</p>
                <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em] text-white/70">Team 2</p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mx-auto mt-8 max-w-2xl">
              <div className="flex h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500"
                  style={{ width: `${team1Percent}%` }}
                />
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                  style={{ width: `${100 - team1Percent}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs font-semibold text-white/50">
                <span>Team 1 · {team1Total} pts</span>
                <span>Team 2 · {team2Total} pts</span>
              </div>
            </div>
          </div>
        </section>

        {/* Teams Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {sortedTeams.map((team, teamIndex) => {
            const isTeam1 = teamIndex === 0
            const teamTotal = team.members.reduce((sum, m) => sum + m.points, 0)
            const accentText = isTeam1 ? 'text-red-400' : 'text-blue-400'
            const accentBg = isTeam1 ? 'bg-red-500/10' : 'bg-blue-500/10'
            const accentBorder = isTeam1 ? 'border-red-500/30' : 'border-blue-500/30'
            const accentButton = isTeam1
              ? 'bg-red-600 hover:bg-red-500'
              : 'bg-blue-600 hover:bg-blue-500'
            const teamTop = team.members[0]

            return (
              <section key={team.id} className={`rounded-3xl border ${accentBorder} bg-white/[0.03] p-6`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accentBg} ${accentText}`}>
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className={`text-2xl font-black uppercase tracking-wide ${accentText}`}>{team.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-white/70">{team.members.length} members</p>
                        <span className={`inline-flex items-center gap-1 rounded-full ${accentBg} ${accentText} px-2 py-0.5 text-xs font-bold`}>
                          <Trophy className="h-3 w-3" />
                          {team.weeksWins} week{team.weeksWins !== 1 ? 's' : ''} win
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-black ${accentText}`}>{teamTotal}</p>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Points</p>
                  </div>
                </div>

                {teamTop && teamTop.points > 0 && (
                  <div className={`mt-4 flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold ${isTeam1 ? 'border-red-400/30 bg-red-500/10 text-red-300' : 'border-blue-400/30 bg-blue-500/10 text-blue-300'}`}>
                    <Crown className="h-4 w-4" />
                    {teamTop.name} is leading {team.name}
                  </div>
                )}

                <div className="mt-6 space-y-2">
                  {team.members.map((member, memberIndex) => {
                    const isTop = memberIndex === 0 && member.points > 0
                    return (
                      <div
                        key={member.id}
                        className={`group flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition ${
                          isTop
                            ? 'border-amber-400/40 bg-amber-500/10 shadow-[0_0_25px_rgba(251,191,36,0.08)]'
                            : 'border-white/5 bg-black/25 hover:border-white/15'
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
                              {member.isTeamLead && (
                                <span className={`ml-2 inline-flex items-center gap-1 rounded-full ${accentBg} ${accentText} px-2 py-0.5 text-xs font-bold`}>
                                  Team Lead
                                </span>
                              )}
                              {member.onBreak && (
                                <>
                                  {member.breakDuration && (
                                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-yellow-500/10 text-yellow-400 px-2 py-0.5 text-xs font-bold">
                                      {member.breakDuration} Break
                                    </span>
                                  )}
                                  <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-orange-500/10 text-orange-400 px-2 py-0.5 text-xs font-bold tabular-nums">
                                    {countdown[member.id] ?? '—'} left to rejoin
                                  </span>
                                </>
                              )}
                            </p>
                            <p className="text-xs text-white/70">{member.points} pts</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updatePoints(team.id, member.id, -1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-white/70 transition hover:bg-white/10"
                            aria-label={`Decrease ${member.name} points`}
                          >
                            −
                          </button>
                          <span className={`w-10 text-center text-lg font-black ${accentText}`}>
                            {member.points}
                          </span>
                          <button
                            type="button"
                            onClick={() => updatePoints(team.id, member.id, 1)}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg text-white transition ${accentButton}`}
                            aria-label={`Increase ${member.name} points`}
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => removeMember(team.id, member.id)}
                            className="ml-1 flex h-7 w-7 items-center justify-center rounded-lg text-white/30 transition hover:bg-red-500/10 hover:text-red-400"
                            aria-label={`Remove ${member.name}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {addMemberTeam === team.id ? (
                  <div className="mt-4 flex gap-2">
                    <input
                      autoFocus
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addMember(team.id)}
                      placeholder="Member name"
                      className="flex-1 rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-red-400"
                    />
                    <button
                      type="button"
                      onClick={() => addMember(team.id)}
                      className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddMemberTeam(null)}
                      className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/60 transition hover:bg-white/5"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAddMemberTeam(team.id)}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 py-2.5 text-sm font-semibold text-white/60 transition hover:border-white/30 hover:text-white"
                  >
                    <Plus className="h-4 w-4" />
                    Add Member
                  </button>
                )}
              </section>
            )
          })}
        </div>

        {/* Save button */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={saveTeams}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-8 py-3.5 font-bold text-white shadow-[0_20px_60px_rgba(220,38,38,0.3)] transition hover:scale-[1.02] hover:from-red-500 hover:to-red-400 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trophy className="h-5 w-5" />}
            {saving ? 'Saving...' : 'Save Teams & Points'}
          </button>
        </div>
      </div>
    </main>
  )
}