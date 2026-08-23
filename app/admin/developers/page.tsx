'use client'

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Banknote,
  Briefcase,
  CheckCircle2,
  LayoutDashboard,
  Loader2,
  LogIn,
  Plus,
  Trash2,
  Trophy,
  UserRound,
  UsersRound,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { DEVELOPER_EMAILS } from '@/lib/developers'

const ADMIN_EMAIL = 'devdharrshans.23csd@kongu.edu'

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

const statusStyles: Record<Project['status'], string> = {
  Assigned: 'bg-blue-500/15 text-blue-300 border-blue-400/30',
  'In Progress': 'bg-amber-500/15 text-amber-300 border-amber-400/30',
  Completed: 'bg-green-500/15 text-green-300 border-green-400/30',
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

export default function AdminDevelopersPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [earnings, setEarnings] = useState<Earning[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'projects' | 'earnings'>('projects')

  // New project form
  const [projectForm, setProjectForm] = useState<{
    developer_email: string
    title: string
    description: string
    client: string
    amount: string
    status: Project['status']
    deadline: string
  }>({
    developer_email: DEVELOPER_EMAILS[0] as string,
    title: '',
    description: '',
    client: '',
    amount: '',
    status: 'Assigned',
    deadline: '',
  })

  // New earning form
  const [earningForm, setEarningForm] = useState<{
    developer_email: string
    project_title: string
    amount_earned: string
    paid: boolean
    description: string
  }>({
    developer_email: DEVELOPER_EMAILS[0] as string,
    project_title: '',
    amount_earned: '',
    paid: false,
    description: '',
  })

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

  const loadData = async () => {
    setLoading(true)
    const [projectsRes, earningsRes] = await Promise.all([
      supabase.from('developer_projects').select('*').order('created_at', { ascending: false }),
      supabase.from('developer_earnings').select('*').order('created_at', { ascending: false }),
    ])

    if (!projectsRes.error && projectsRes.data) {
      setProjects(projectsRes.data as Project[])
    }
    if (!earningsRes.error && earningsRes.data) {
      setEarnings(earningsRes.data as Earning[])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!authorized) return
    let cancelled = false

    ;(async () => {
      setLoading(true)
      const [projectsRes, earningsRes] = await Promise.all([
        supabase.from('developer_projects').select('*').order('created_at', { ascending: false }),
        supabase.from('developer_earnings').select('*').order('created_at', { ascending: false }),
      ])

      if (!cancelled) {
        if (!projectsRes.error && projectsRes.data) {
          setProjects(projectsRes.data as Project[])
        }
        if (!earningsRes.error && earningsRes.data) {
          setEarnings(earningsRes.data as Earning[])
        }
        setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [authorized])

  const handleAddProject = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    const { error } = await supabase.from('developer_projects').insert({
      developer_email: projectForm.developer_email.toLowerCase(),
      title: projectForm.title,
      description: projectForm.description,
      client: projectForm.client,
      amount: projectForm.amount,
      status: projectForm.status,
      deadline: projectForm.deadline || null,
    })

    setSaving(false)
    if (error) {
      setError(`Failed to assign project: ${error.message}`)
      return
    }

    setMessage(`Project "${projectForm.title}" assigned to ${projectForm.developer_email}`)
    setProjectForm((prev) => ({ ...prev, title: '', description: '', client: '', amount: '', deadline: '' }))
    loadData()
  }

  const handleAddEarning = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    const { error } = await supabase.from('developer_earnings').insert({
      developer_email: earningForm.developer_email.toLowerCase(),
      project_title: earningForm.project_title,
      amount_earned: earningForm.amount_earned,
      paid: earningForm.paid,
      paid_at: earningForm.paid ? new Date().toISOString() : null,
      description: earningForm.description,
    })

    setSaving(false)
    if (error) {
      setError(`Failed to add payment: ${error.message}`)
      return
    }

    setMessage(`₹${earningForm.amount_earned} added to ${earningForm.developer_email}`)
    setEarningForm((prev) => ({ ...prev, project_title: '', amount_earned: '', description: '' }))
    loadData()
  }

  const handleToggleProjectStatus = async (project: Project) => {
    const nextStatus: Project['status'] =
      project.status === 'Assigned' ? 'In Progress' : project.status === 'In Progress' ? 'Completed' : 'Assigned'

    const { error } = await supabase
      .from('developer_projects')
      .update({ status: nextStatus })
      .eq('id', project.id)

    if (!error) {
      setProjects((prev) => prev.map((p) => (p.id === project.id ? { ...p, status: nextStatus } : p)))
    }
  }

  const handleTogglePaid = async (earning: Earning) => {
    const nextPaid = !earning.paid
    const { error } = await supabase
      .from('developer_earnings')
      .update({
        paid: nextPaid,
        paid_at: nextPaid ? new Date().toISOString() : null,
      })
      .eq('id', earning.id)

    if (!error) {
      setEarnings((prev) =>
        prev.map((x) => (x.id === earning.id ? { ...x, paid: nextPaid, paid_at: nextPaid ? new Date().toISOString() : null } : x))
      )
    }
  }

  const handleDeleteProject = async (project: Project) => {
    const { error } = await supabase.from('developer_projects').delete().eq('id', project.id)
    if (!error) {
      setProjects((prev) => prev.filter((p) => p.id !== project.id))
      setMessage(`Project "${project.title}" deleted`)
    }
  }

  const handleDeleteEarning = async (earning: Earning) => {
    const { error } = await supabase.from('developer_earnings').delete().eq('id', earning.id)
    if (!error) {
      setEarnings((prev) => prev.filter((x) => x.id !== earning.id))
      setMessage('Payment record deleted')
    }
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

  const totalAssigned = projects.length
  const totalPaidOut = earnings.filter((e) => e.paid).reduce((sum, e) => sum + parseAmount(e.amount_earned), 0)
  const totalPending = earnings.filter((e) => !e.paid).reduce((sum, e) => sum + parseAmount(e.amount_earned), 0)

  const statCards = [
    { label: 'Developers', value: DEVELOPER_EMAILS.length, icon: UsersRound, accent: 'text-purple-400 bg-purple-500/10' },
    { label: 'Assigned Projects', value: totalAssigned, icon: Briefcase, accent: 'text-blue-400 bg-blue-500/10' },
    { label: 'Paid Out', value: `₹${totalPaidOut.toLocaleString('en-IN')}`, icon: CheckCircle2, accent: 'text-green-400 bg-green-500/10' },
    { label: 'Pending Payments', value: `₹${totalPending.toLocaleString('en-IN')}`, icon: Banknote, accent: 'text-amber-400 bg-amber-500/10' },
  ]

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Image src="/brandnest-logo.png" alt="Brandnest logo" width={44} height={44} className="h-11 w-11 rounded-full object-cover shadow-[0_0_30px_rgba(220,38,38,0.35)]" />
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-red-400">Brandnest Admin</p>
              <h1 className="text-xl font-black leading-tight text-white">Developer Management</h1>
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
              href="/admin/teams"
              className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/20"
            >
              <Trophy className="h-4 w-4" />
              Teams
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
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map(({ label, value, icon: Icon, accent }) => (
            <article key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-3xl font-black text-white">{value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">{label}</p>
            </article>
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
        <div className="mt-8 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-black/30 p-2 sm:max-w-sm">
          {(
            [
              { id: 'projects', label: 'Assign Projects', icon: Briefcase },
              { id: 'earnings', label: 'Add Money', icon: Banknote },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                activeTab === id ? 'bg-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.3)]' : 'text-white/65 hover:bg-white/8'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Assign Project form */}
        {activeTab === 'projects' && (
          <section className="mt-6">
            <form onSubmit={handleAddProject} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div className="flex items-center gap-3">
                <Plus className="h-5 w-5 text-red-400" />
                <h2 className="text-xl font-black text-white">Assign a New Project</h2>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-white/75">Assigned To Email *</span>
                  <select
                    required
                    value={projectForm.developer_email}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, developer_email: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-red-400"
                  >
                    <option value="">Select Developer...</option>
                    {DEVELOPER_EMAILS.map((email) => (
                      <option key={email} value={email}>
                        {email}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-white/75">Project Title *</span>
                  <input
                    required
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. E-Commerce Website"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-red-400"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-white/75">Client / Company</span>
                  <input
                    type="text"
                    value={projectForm.client}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, client: e.target.value }))}
                    placeholder="e.g. Acme Corp"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-red-400"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-white/75">Amount</span>
                  <input
                    type="text"
                    value={projectForm.amount}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, amount: e.target.value }))}
                    placeholder="e.g. ₹25,000"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-red-400"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-white/75">Status</span>
                  <select
                    value={projectForm.status}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, status: e.target.value as Project['status'] }))}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-red-400"
                  >
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-white/75">Deadline</span>
                  <input
                    type="date"
                    value={projectForm.deadline}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, deadline: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-red-400"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm font-semibold text-white/75">Description</span>
                  <textarea
                    rows={3}
                    value={projectForm.description}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Project requirements, scope, notes..."
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-red-400"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 font-bold text-white shadow-[0_20px_60px_rgba(220,38,38,0.3)] transition hover:from-red-500 hover:to-red-400 disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Briefcase className="h-4 w-4" />}
                {saving ? 'Assigning...' : 'Assign Project'}
              </button>
            </form>

            {/* All projects list */}
            <div className="mt-10">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="h-5 w-5 text-red-400" />
                  <h2 className="text-xl font-black text-white">All Assigned Projects</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/80">
                  {projects.length} total
                </span>
              </div>

              {loading ? (
                <div className="mt-6 flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] py-20 text-white/60">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin text-red-400" />
                  Loading projects...
                </div>
              ) : projects.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] py-20 text-center">
                  <Briefcase className="mx-auto h-10 w-10 text-white/30" />
                  <p className="mt-4 text-lg font-semibold text-white/70">No projects assigned yet</p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {projects.map((project) => (
                    <article key={project.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-bold text-white">{project.title}</h3>
                            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyles[project.status]}`}>
                              {project.status}
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-white/80">
                            <span className="inline-flex items-center gap-1.5">
                              <UserRound className="h-3.5 w-3.5 text-red-400" />
                              {project.developer_email}
                            </span>
                            {project.client && (
                              <span className="inline-flex items-center gap-1.5">
                                <Briefcase className="h-3.5 w-3.5 text-red-400" />
                                {project.client}
                              </span>
                            )}
                            <span className="font-semibold text-white">{project.amount}</span>
                            <span className="text-white/50">Deadline: {formatDate(project.deadline)}</span>
                          </div>
                          {project.description && (
                            <p className="mt-3 rounded-xl border border-white/5 bg-black/25 px-4 py-3 text-sm leading-6 text-white/85">
                              {project.description}
                            </p>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleProjectStatus(project)}
                            className="rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                          >
                            Next Status →
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProject(project)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                            aria-label={`Delete ${project.title}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Add Money form */}
        {activeTab === 'earnings' && (
          <section className="mt-6">
            <form onSubmit={handleAddEarning} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div className="flex items-center gap-3">
                <Banknote className="h-5 w-5 text-red-400" />
                <h2 className="text-xl font-black text-white">Add Money / Payment to Developer</h2>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-white/75">Assigned To Email *</span>
                  <select
                    required
                    value={earningForm.developer_email}
                    onChange={(e) => setEarningForm((prev) => ({ ...prev, developer_email: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-red-400"
                  >
                    <option value="">Select Developer...</option>
                    {DEVELOPER_EMAILS.map((email) => (
                      <option key={email} value={email}>
                        {email}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-white/75">Project / Purpose</span>
                  <input
                    type="text"
                    value={earningForm.project_title}
                    onChange={(e) => setEarningForm((prev) => ({ ...prev, project_title: e.target.value }))}
                    placeholder="e.g. Brandnest Landing Page"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-red-400"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-white/75">Amount (₹) *</span>
                  <input
                    required
                    type="text"
                    value={earningForm.amount_earned}
                    onChange={(e) => setEarningForm((prev) => ({ ...prev, amount_earned: e.target.value }))}
                    placeholder="e.g. 15000"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-red-400"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-white/75">Payment Status</span>
                  <div className="mt-2 flex items-center gap-3">
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={earningForm.paid}
                        onChange={(e) => setEarningForm((prev) => ({ ...prev, paid: e.target.checked }))}
                        className="h-4 w-4 accent-red-600"
                      />
                      <span className="text-sm font-semibold text-white/80">Mark as Paid</span>
                    </label>
                  </div>
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm font-semibold text-white/75">Description</span>
                  <textarea
                    rows={2}
                    value={earningForm.description}
                    onChange={(e) => setEarningForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Payment notes..."
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-red-400"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 font-bold text-white shadow-[0_20px_60px_rgba(220,38,38,0.3)] transition hover:from-red-500 hover:to-red-400 disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Banknote className="h-4 w-4" />}
                {saving ? 'Adding...' : 'Add Payment'}
              </button>
            </form>

            {/* All earnings list */}
            <div className="mt-10">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Banknote className="h-5 w-5 text-red-400" />
                  <h2 className="text-xl font-black text-white">All Payment Records</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/80">
                  {earnings.length} payments
                </span>
              </div>

              {loading ? (
                <div className="mt-6 flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] py-20 text-white/60">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin text-red-400" />
                  Loading earnings...
                </div>
              ) : earnings.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] py-20 text-center">
                  <Banknote className="mx-auto h-10 w-10 text-white/30" />
                  <p className="mt-4 text-lg font-semibold text-white/70">No payments recorded yet</p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {earnings.map((earning) => (
                    <article key={earning.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-bold text-white">{earning.project_title || 'Project Payment'}</h3>
                            <button
                              type="button"
                              onClick={() => handleTogglePaid(earning)}
                              className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold transition ${
                                earning.paid
                                  ? 'border-green-400/30 bg-green-500/15 text-green-300 hover:bg-green-500/25'
                                  : 'border-amber-400/30 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25'
                              }`}
                            >
                              {earning.paid ? 'Paid ✓' : 'Pending — click to mark paid'}
                            </button>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-white/80">
                            <span className="inline-flex items-center gap-1.5">
                              <UserRound className="h-3.5 w-3.5 text-red-400" />
                              {earning.developer_email}
                            </span>
                            <span className="text-white/50">{formatDate(earning.created_at)}</span>
                          </div>
                          {earning.description && (
                            <p className="mt-2 text-sm leading-6 text-white/70">{earning.description}</p>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <p className="text-2xl font-black text-white">₹{parseAmount(earning.amount_earned).toLocaleString('en-IN')}</p>
                          <button
                            type="button"
                            onClick={() => handleDeleteEarning(earning)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                            aria-label="Delete payment"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}