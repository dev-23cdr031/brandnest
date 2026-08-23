'use client'

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import {
  Banknote,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Handshake,
  LayoutDashboard,
  Loader2,
  Plus,
  Trash2,
  Trophy,
  UsersRound,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { isCRMEmail, isAdminEmail, CRM_EMAILS } from '@/lib/roles'
import {
  DashboardShell,
  DashboardHeader,
  WelcomeBanner,
  StatCard,
  Tabs,
  StatusBadge,
  EmptyState,
  LoadingState,
} from '@/components/dashboard'

type Client = {
  id: string
  client_name: string
  client_email: string
  company: string
  project: string
  assigned_to: string
  assigned_to_email: string
  status: 'Assigned' | 'In Progress' | 'Completed' | 'On Hold'
  assigned_at: string
  notes: string
  created_at: string
}

type Earning = {
  id: string
  client_name: string
  project: string
  amount_earned: string
  source: string
  assigned_to_email: string
  earned_date: string | null
  notes: string
  created_at: string
}

type TeamMember = {
  id: string
  name: string
  points: number
}

type Team = {
  id: string
  name: string
  color: string
  members: TeamMember[]
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
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

const inputClass =
  'mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-red-400'

export default function CRMPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [activeTab, setActiveTab] = useState<'clients' | 'earnings' | 'teams'>('clients')

  // Data
  const [clients, setClients] = useState<Client[]>([])
  const [earnings, setEarnings] = useState<Earning[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingTeams, setSavingTeams] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Client form
  const [clientForm, setClientForm] = useState({
    client_name: '',
    client_email: '',
    company: '',
    project: '',
    assigned_to: '',
    assigned_to_email: '',
    status: 'Assigned' as Client['status'],
    notes: '',
  })

  // Earning form
  const [earningForm, setEarningForm] = useState({
    client_name: '',
    project: '',
    amount_earned: '',
    source: '',
    assigned_to_email: '',
    earned_date: '',
    notes: '',
  })

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user || !isCRMEmail(user.email)) {
        router.replace('/login')
        return
      }

      const admin = isAdminEmail(user.email)
      setIsAdmin(admin)
      setUserEmail(user.email?.toLowerCase() || '')
      setUserName((user.user_metadata?.full_name as string) || user.email?.split('@')[0] || 'CRM Manager')
      setAuthorized(true)
      setChecking(false)
    }

    checkAuth()
  }, [router])

  const loadData = async () => {
    setLoading(true)

    const isManager = !isAdmin && userEmail

    const [clientsRes, earningsRes, teamsRes] = await Promise.all([
      isManager
        ? supabase.from('crm_clients').select('*').eq('assigned_to_email', userEmail).order('created_at', { ascending: false })
        : supabase.from('crm_clients').select('*').order('created_at', { ascending: false }),
      isManager
        ? supabase.from('crm_earnings').select('*').eq('assigned_to_email', userEmail).order('created_at', { ascending: false })
        : supabase.from('crm_earnings').select('*').order('created_at', { ascending: false }),
      supabase.from('teams').select('*'),
    ])

    if (!clientsRes.error && clientsRes.data) setClients(clientsRes.data as Client[])
    if (!earningsRes.error && earningsRes.data) setEarnings(earningsRes.data as Earning[])
    if (!teamsRes.error && teamsRes.data && teamsRes.data.length > 0) setTeams(teamsRes.data as Team[])
    setLoading(false)
  }

  useEffect(() => {
    if (!authorized) return
    let cancelled = false

    ;(async () => {
      setLoading(true)
      const isManager = !isAdmin && userEmail

      const [clientsRes, earningsRes, teamsRes] = await Promise.all([
        isManager
          ? supabase.from('crm_clients').select('*').eq('assigned_to_email', userEmail).order('created_at', { ascending: false })
          : supabase.from('crm_clients').select('*').order('created_at', { ascending: false }),
        isManager
          ? supabase.from('crm_earnings').select('*').eq('assigned_to_email', userEmail).order('created_at', { ascending: false })
          : supabase.from('crm_earnings').select('*').order('created_at', { ascending: false }),
        supabase.from('teams').select('*'),
      ])

      if (!cancelled) {
        if (!clientsRes.error && clientsRes.data) setClients(clientsRes.data as Client[])
        if (!earningsRes.error && earningsRes.data) setEarnings(earningsRes.data as Earning[])
        if (!teamsRes.error && teamsRes.data && teamsRes.data.length > 0) setTeams(teamsRes.data as Team[])
        setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [authorized])

  const handleAddClient = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    const { error } = await supabase.from('crm_clients').insert({
      client_name: clientForm.client_name,
      client_email: clientForm.client_email,
      company: clientForm.company,
      project: clientForm.project,
      assigned_to: clientForm.assigned_to,
      assigned_to_email: clientForm.assigned_to_email.toLowerCase(),
      status: clientForm.status,
      notes: clientForm.notes,
    })

    setSaving(false)
    if (error) {
      setError(`Failed to assign client: ${error.message}`)
      return
    }

    setMessage(`${clientForm.client_name} assigned to ${clientForm.assigned_to}`)
    setClientForm((prev) => ({ ...prev, client_name: '', client_email: '', company: '', project: '', assigned_to: '', notes: '' }))
    loadData()
  }

  const handleAddEarning = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    const { error } = await supabase.from('crm_earnings').insert({
      client_name: earningForm.client_name,
      project: earningForm.project,
      amount_earned: earningForm.amount_earned,
      source: earningForm.source,
      assigned_to_email: earningForm.assigned_to_email.toLowerCase(),
      earned_date: earningForm.earned_date || null,
      notes: earningForm.notes,
    })

    setSaving(false)
    if (error) {
      setError(`Failed to add earning: ${error.message}`)
      return
    }

    setMessage(`₹${earningForm.amount_earned} added for ${earningForm.client_name || 'client'}`)
    setEarningForm((prev) => ({ ...prev, client_name: '', project: '', amount_earned: '', source: '', earned_date: '', notes: '' }))
    loadData()
  }

  const handleClientStatusChange = async (client: Client, status: Client['status']) => {
    const { error } = await supabase.from('crm_clients').update({ status }).eq('id', client.id)
    if (!error) {
      setClients((prev) => prev.map((c) => (c.id === client.id ? { ...c, status } : c)))
    }
  }

  const handleDeleteClient = async (client: Client) => {
    const { error } = await supabase.from('crm_clients').delete().eq('id', client.id)
    if (!error) {
      setClients((prev) => prev.filter((c) => c.id !== client.id))
      setMessage(`Assignment for ${client.client_name} deleted`)
    }
  }

  const handleDeleteEarning = async (earning: Earning) => {
    const { error } = await supabase.from('crm_earnings').delete().eq('id', earning.id)
    if (!error) {
      setEarnings((prev) => prev.filter((x) => x.id !== earning.id))
      setMessage('Earning record deleted')
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

  const saveTeams = async () => {
    setSavingTeams(true)
    const { error } = await supabase.from('teams').upsert(teams)
    setSavingTeams(false)
    if (error) {
      setError(`Failed to save teams: ${error.message}`)
    } else {
      setMessage('Teams & points saved successfully!')
    }
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <div className="flex items-center gap-3 text-white/70">
          <Loader2 className="h-6 w-6 animate-spin text-red-400" />
          Verifying CRM Manager access...
        </div>
      </main>
    )
  }

  if (!authorized) return null

  const totalClients = clients.length
  const inProgressClients = clients.filter((c) => c.status === 'In Progress').length
  const completedClients = clients.filter((c) => c.status === 'Completed').length
  const totalEarned = earnings.reduce((sum, e) => sum + parseAmount(e.amount_earned), 0)

  const statCards = [
    { label: 'Clients Assigned', value: totalClients, icon: UsersRound, accent: 'text-blue-400 bg-blue-500/10' },
    { label: 'In Progress', value: inProgressClients, icon: Briefcase, accent: 'text-amber-400 bg-amber-500/10' },
    { label: 'Completed', value: completedClients, icon: CheckCircle2, accent: 'text-green-400 bg-green-500/10' },
    { label: 'Amount Earned', value: `₹${totalEarned.toLocaleString('en-IN')}`, icon: Banknote, accent: 'text-red-400 bg-red-500/10' },
  ]

  const tabs = [
    { id: 'clients', label: 'Client Assigned', icon: UsersRound },
    { id: 'earnings', label: 'Amount Earned', icon: Banknote },
    { id: 'teams', label: 'Team Points', icon: Trophy },
  ] as const

  return (
    <DashboardShell>
      <DashboardHeader
        brandLabel="Brandnest CRM"
        title={isAdmin ? 'Admin CRM Dashboard' : 'CRM Manager Dashboard'}
        userName={userName}
        roleLabel={isAdmin ? 'Admin' : 'CRM Manager'}
        showAdminLink={isAdmin}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <WelcomeBanner
          eyebrow={isAdmin ? 'Admin Control Center' : 'CRM Manager Workspace'}
          title={`Welcome back, ${userName}!`}
          description={
            isAdmin
              ? 'Manage client relationships, assign clients, track earnings, and monitor team performance from one place.'
              : 'Track your assigned clients and monitor the amount earned for your projects.'
          }
          statValue={`₹${totalEarned.toLocaleString('en-IN')}`}
          statLabel="Total Earned"
        />

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map(({ label, value, icon, accent }) => (
            <StatCard key={label} label={label} value={value} icon={icon} accent={accent} />
          ))}
        </div>

        {/* Message / Error */}
        {message && (
          <p className="mt-6 rounded-xl border border-green-400/30 bg-green-500/10 px-4 py-3 text-sm text-green-200">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        {/* Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id as typeof activeTab)} className="grid-cols-3 sm:max-w-lg" />

        {/* ============ CLIENTS TAB ============ */}
        {activeTab === 'clients' && (
          <section className="mt-6">
            {isAdmin && (
              <form onSubmit={handleAddClient} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <div className="flex items-center gap-3">
                  <Plus className="h-5 w-5 text-red-400" />
                  <h2 className="text-xl font-black text-white">Assign a Client</h2>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Client Name *</span>
                    <input
                      required
                      type="text"
                      value={clientForm.client_name}
                      onChange={(e) => setClientForm((prev) => ({ ...prev, client_name: e.target.value }))}
                      placeholder="e.g. John Doe"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Client Email</span>
                    <input
                      type="email"
                      value={clientForm.client_email}
                      onChange={(e) => setClientForm((prev) => ({ ...prev, client_email: e.target.value }))}
                      placeholder="client@email.com"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Company</span>
                    <input
                      type="text"
                      value={clientForm.company}
                      onChange={(e) => setClientForm((prev) => ({ ...prev, company: e.target.value }))}
                      placeholder="e.g. Acme Corp"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Project</span>
                    <input
                      type="text"
                      value={clientForm.project}
                      onChange={(e) => setClientForm((prev) => ({ ...prev, project: e.target.value }))}
                      placeholder="e.g. Brandnest Website"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Assigned To *</span>
                    <input
                      required
                      type="text"
                      value={clientForm.assigned_to}
                      onChange={(e) => setClientForm((prev) => ({ ...prev, assigned_to: e.target.value }))}
                      placeholder="e.g. Aishwarya"
                      className={inputClass}
                    />
                  </label>
                  {isAdmin && (
                    <label className="block">
                      <span className="text-sm font-semibold text-white/75">Assigned To Email *</span>
                      <select
                        required
                        value={clientForm.assigned_to_email}
                        onChange={(e) => setClientForm((prev) => ({ ...prev, assigned_to_email: e.target.value }))}
                        className={inputClass}
                      >
                        <option value="">Select CRM Manager...</option>
                        {CRM_EMAILS.map((email) => (
                          <option key={email} value={email}>
                            {email}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Status</span>
                    <select
                      value={clientForm.status}
                      onChange={(e) => setClientForm((prev) => ({ ...prev, status: e.target.value as Client['status'] }))}
                      className={inputClass}
                    >
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-sm font-semibold text-white/75">Notes</span>
                    <textarea
                      rows={3}
                      value={clientForm.notes}
                      onChange={(e) => setClientForm((prev) => ({ ...prev, notes: e.target.value }))}
                      placeholder="Assignment notes..."
                      className={inputClass}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 font-bold text-white shadow-[0_20px_60px_rgba(220,38,38,0.3)] transition hover:from-red-500 hover:to-red-400 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Handshake className="h-4 w-4" />}
                  {saving ? 'Assigning...' : 'Assign Client'}
                </button>
              </form>
            )}

            {/* All clients list */}
            <div className="mt-10">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <UsersRound className="h-5 w-5 text-red-400" />
                  <h2 className="text-xl font-black text-white">All Assigned Clients</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/80">
                  {clients.length} total
                </span>
              </div>

              {loading ? (
                <LoadingState label="Loading clients..." />
              ) : clients.length === 0 ? (
                <EmptyState icon={UsersRound} title="No clients assigned yet" />
              ) : (
                <div className="mt-6 space-y-4">
                  {clients.map((client) => (
                    <article key={client.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-bold text-white">{client.client_name}</h3>
                            <StatusBadge status={client.status} />
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-white/80">
                            {client.company && (
                              <span className="inline-flex items-center gap-1.5">
                                <Briefcase className="h-3.5 w-3.5 text-red-400" />
                                {client.company}
                              </span>
                            )}
                            {client.assigned_to && (
                              <span className="inline-flex items-center gap-1.5">
                                <UsersRound className="h-3.5 w-3.5 text-red-400" />
                                {client.assigned_to}
                              </span>
                            )}
                            {client.project && (
                              <span className="inline-flex items-center gap-1.5">
                                <LayoutDashboard className="h-3.5 w-3.5 text-red-400" />
                                {client.project}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-white/80">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays className="h-3.5 w-3.5 text-red-400" />
                              Assigned: {formatDate(client.assigned_at)}
                            </span>
                          </div>
                          {client.notes && (
                            <p className="mt-3 rounded-xl border border-white/5 bg-black/25 px-4 py-3 text-sm leading-6 text-white/85">
                              {client.notes}
                            </p>
                          )}
                        </div>
                        {isAdmin && (
                          <div className="flex shrink-0 items-center gap-2">
                            <select
                              value={client.status}
                              onChange={(e) => handleClientStatusChange(client, e.target.value as Client['status'])}
                              className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm font-semibold text-white outline-none transition focus:border-red-400"
                            >
                              <option value="Assigned">Assigned</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="On Hold">On Hold</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => handleDeleteClient(client)}
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                              aria-label={`Delete assignment for ${client.client_name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ============ AMOUNT EARNED TAB ============ */}
        {activeTab === 'earnings' && (
          <section className="mt-6">
            {isAdmin && (
              <form onSubmit={handleAddEarning} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <div className="flex items-center gap-3">
                  <Plus className="h-5 w-5 text-red-400" />
                  <h2 className="text-xl font-black text-white">Add Amount Earned</h2>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Client Name</span>
                    <input
                      type="text"
                      value={earningForm.client_name}
                      onChange={(e) => setEarningForm((prev) => ({ ...prev, client_name: e.target.value }))}
                      placeholder="e.g. John Doe"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Project</span>
                    <input
                      type="text"
                      value={earningForm.project}
                      onChange={(e) => setEarningForm((prev) => ({ ...prev, project: e.target.value }))}
                      placeholder="e.g. Brandnest Website"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Amount Earned (₹) *</span>
                    <input
                      required
                      type="text"
                      value={earningForm.amount_earned}
                      onChange={(e) => setEarningForm((prev) => ({ ...prev, amount_earned: e.target.value }))}
                      placeholder="e.g. 15000"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Source</span>
                    <input
                      type="text"
                      value={earningForm.source}
                      onChange={(e) => setEarningForm((prev) => ({ ...prev, source: e.target.value }))}
                      placeholder="e.g. Client Payment"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Earned Date</span>
                    <input
                      type="date"
                      value={earningForm.earned_date}
                      onChange={(e) => setEarningForm((prev) => ({ ...prev, earned_date: e.target.value }))}
                      className={inputClass}
                    />
                  </label>
                  {isAdmin && (
                    <label className="block sm:col-span-2">
                      <span className="text-sm font-semibold text-white/75">Assigned To Email *</span>
                      <select
                        required
                        value={earningForm.assigned_to_email}
                        onChange={(e) => setEarningForm((prev) => ({ ...prev, assigned_to_email: e.target.value }))}
                        className={inputClass}
                      >
                        <option value="">Select CRM Manager...</option>
                        {CRM_EMAILS.map((email) => (
                          <option key={email} value={email}>
                            {email}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  <label className="block sm:col-span-2">
                    <span className="text-sm font-semibold text-white/75">Notes</span>
                    <textarea
                      rows={2}
                      value={earningForm.notes}
                      onChange={(e) => setEarningForm((prev) => ({ ...prev, notes: e.target.value }))}
                      placeholder="Earning notes..."
                      className={inputClass}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 font-bold text-white shadow-[0_20px_60px_rgba(220,38,38,0.3)] transition hover:from-red-500 hover:to-red-400 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Banknote className="h-4 w-4" />}
                  {saving ? 'Adding...' : 'Add Earning'}
                </button>
              </form>
            )}

            {/* All earnings list */}
            <div className="mt-10">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Banknote className="h-5 w-5 text-red-400" />
                  <h2 className="text-xl font-black text-white">All Earnings</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/80">
                  ₹{totalEarned.toLocaleString('en-IN')} total
                </span>
              </div>

              {loading ? (
                <LoadingState label="Loading earnings..." />
              ) : earnings.length === 0 ? (
                <EmptyState icon={Banknote} title="No earnings recorded yet" />
              ) : (
                <div className="mt-6 space-y-4">
                  {earnings.map((earning) => (
                    <article key={earning.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-bold text-white">{earning.client_name || 'Client'}</h3>
                            {earning.project && (
                              <span className="inline-flex items-center gap-1.5 text-sm text-white/70">
                                <LayoutDashboard className="h-3.5 w-3.5 text-red-400" />
                                {earning.project}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-white/80">
                            {earning.source && (
                              <span className="inline-flex items-center gap-1.5">
                                <Briefcase className="h-3.5 w-3.5 text-red-400" />
                                {earning.source}
                              </span>
                            )}
                            <span className="text-white/50">{formatDate(earning.earned_date || earning.created_at)}</span>
                          </div>
                          {earning.notes && (
                            <p className="mt-2 text-sm leading-6 text-white/70">{earning.notes}</p>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <p className="text-2xl font-black text-white">₹{parseAmount(earning.amount_earned).toLocaleString('en-IN')}</p>
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => handleDeleteEarning(earning)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                              aria-label="Delete earning"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ============ TEAM POINTS TAB ============ */}
        {activeTab === 'teams' && (
          <section className="mt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-red-400" />
                <h2 className="text-xl font-black text-white">Team Points</h2>
              </div>
              {isAdmin && (
                <button
                  type="button"
                  onClick={saveTeams}
                  disabled={savingTeams}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-6 py-2.5 text-sm font-bold text-white shadow-[0_20px_60px_rgba(220,38,38,0.3)] transition hover:from-red-500 hover:to-red-400 disabled:opacity-60"
                >
                  {savingTeams ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trophy className="h-4 w-4" />}
                  {savingTeams ? 'Saving...' : 'Save Teams & Points'}
                </button>
              )}
            </div>

            {loading ? (
              <LoadingState label="Loading teams..." />
            ) : teams.length === 0 ? (
              <EmptyState icon={Trophy} title="No teams found" description="Teams will appear here once created by the admin." />
            ) : (
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {teams.map((team, teamIndex) => {
                  const isTeam1 = teamIndex === 0
                  const teamTotal = team.members.reduce((sum, m) => sum + m.points, 0)
                  const accentText = isTeam1 ? 'text-red-400' : 'text-blue-400'
                  const accentBg = isTeam1 ? 'bg-red-500/10' : 'bg-blue-500/10'
                  const accentBorder = isTeam1 ? 'border-red-500/30' : 'border-blue-500/30'
                  const accentButton = isTeam1 ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'
                  const sortedMembers = [...team.members].sort((a, b) => b.points - a.points)
                  const teamTop = sortedMembers[0]

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

                      {teamTop && teamTop.points > 0 && (
                        <div className={`mt-4 flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold ${isTeam1 ? 'border-red-400/30 bg-red-500/10 text-red-300' : 'border-blue-400/30 bg-blue-500/10 text-blue-300'}`}>
                          <Trophy className="h-4 w-4" />
                          {teamTop.name} is leading {team.name}
                        </div>
                      )}

                      <div className="mt-6 space-y-2">
                        {sortedMembers.map((member, memberIndex) => {
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
                                    {isTop && <Trophy className="ml-1.5 inline h-4 w-4" />}
                                  </p>
                                  <p className="text-xs text-white/70">{member.points} pts</p>
                                </div>
                              </div>
                              {isAdmin && (
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
                                </div>
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