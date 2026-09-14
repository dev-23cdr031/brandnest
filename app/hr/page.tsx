'use client'

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { TeamMemberAvatar } from '@/components/TeamMemberAvatar'
import { mergeTeamOneDefaults } from '@/lib/team-points'
import {
  Banknote,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Crown,
  LayoutDashboard,
  Loader2,
  MessageCircle,
  Plus,
  Trash2,
  Trophy,
  UserRound,
  UsersRound,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { isAdminEmail, isHREmail } from '@/lib/hr'
import { HR_EMAILS } from '@/lib/roles'
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
import MessageCenter from '@/components/messages/MessageCenter'

type Interview = {
  id: string
  candidate_name: string
  candidate_email: string
  position: string
  interview_date: string | null
  interview_time: string
  interviewer: string
  assigned_to_email: string
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Rejected' | 'Selected'
  notes: string
  created_at: string
}

type Candidate = {
  id: string
  candidate_name: string
  candidate_email: string
  assigned_role: string
  assigned_to: string
  assigned_to_email: string
  project: string
  status: 'Assigned' | 'In Progress' | 'Completed' | 'On Hold'
  assigned_at: string
  notes: string
  created_at: string
}

type Earning = {
  id: string
  candidate_name: string
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
  isTeamLead?: boolean
}

type Team = {
  id: string
  name: string
  color: string
  members: TeamMember[]
}

type JobApplication = {
  id: string
  created_at: string
  full_name: string
  email: string
  phone: string
  college_company: string
  qualification: string
  graduation_year: string
  experience_level: string
  years_experience: string
  skills: string
  position: string
  job_type: string
  work_location: string
  resume_url: string
  portfolio_url: string
  github_url: string
  linkedin_url: string
  available_from: string | null
  cover_letter: string
  heard_from: string
  status: string
  notes: string
}

const applicationStatusOptions = ['New', 'Screening', 'Task Round', 'Interview', 'Offered', 'Hired', 'Rejected']

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

export default function HRPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [activeTab, setActiveTab] = useState<
    'interviews' | 'completed' | 'candidates' | 'applications' | 'earnings' | 'teams' | 'messages'
  >('candidates')

  // Data
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [earnings, setEarnings] = useState<Earning[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingTeams, setSavingTeams] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Interview form
  const [interviewForm, setInterviewForm] = useState({
    candidate_name: '',
    candidate_email: '',
    position: '',
    interview_date: '',
    interview_time: '',
    interviewer: '',
    assigned_to_email: userEmail || '',
    status: 'Scheduled' as Interview['status'],
    notes: '',
  })

  // Candidate form
  const [candidateForm, setCandidateForm] = useState({
    candidate_name: '',
    candidate_email: '',
    assigned_role: '',
    assigned_to: '',
    assigned_to_email: '',
    project: '',
    status: 'Assigned' as Candidate['status'],
    notes: '',
  })

  // Earning form
  const [earningForm, setEarningForm] = useState({
    candidate_name: '',
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

      if (!user || !isHREmail(user.email)) {
        router.replace('/login')
        return
      }

      const admin = isAdminEmail(user.email)
      setIsAdmin(admin)
      setUserEmail(user.email?.toLowerCase().trim() || '')
      setUserName((user.user_metadata?.full_name as string) || user.email?.split('@')[0] || 'HR Manager')
      setActiveTab(admin ? 'interviews' : 'candidates')
      setAuthorized(true)
      setChecking(false)
    }

    checkAuth()
  }, [router])

  const loadData = async () => {
    setLoading(true)

    const isManager = !isAdmin && userEmail
    const userEmailNormalized = userEmail.toLowerCase().trim()

    console.log('LOGGED IN HR EMAIL:', userEmailNormalized)
    console.log('IS MANAGER (non-admin):', isManager)

    const [interviewsRes, candidatesRes, earningsRes, teamsRes, applicationsRes] = await Promise.all([
      isManager
        ? supabase.from('hr_interviews').select('*').eq('assigned_to_email', userEmailNormalized).order('created_at', { ascending: false })
        : supabase.from('hr_interviews').select('*').order('created_at', { ascending: false }),
      isManager
        ? supabase.from('hr_candidates').select('*').eq('assigned_to_email', userEmailNormalized).order('created_at', { ascending: false })
        : supabase.from('hr_candidates').select('*').order('created_at', { ascending: false }),
      isManager
        ? supabase.from('hr_earnings').select('*').eq('assigned_to_email', userEmailNormalized).order('created_at', { ascending: false })
        : supabase.from('hr_earnings').select('*').order('created_at', { ascending: false }),
      supabase.from('teams').select('*'),
      supabase.from('job_applications').select('*').order('created_at', { ascending: false }),
    ])

    console.log('FOUND INTERVIEWS:', interviewsRes.data)
    console.log('FOUND CANDIDATES:', candidatesRes.data)
    console.log('CANDIDATES ERROR:', candidatesRes.error)
    console.log('FOUND EARNINGS:', earningsRes.data)

    if (!interviewsRes.error && interviewsRes.data) setInterviews(interviewsRes.data as Interview[])
    if (!candidatesRes.error && candidatesRes.data) setCandidates(candidatesRes.data as Candidate[])
    if (!earningsRes.error && earningsRes.data) setEarnings(earningsRes.data as Earning[])
    if (!teamsRes.error && teamsRes.data && teamsRes.data.length > 0) setTeams(mergeTeamOneDefaults(teamsRes.data as Team[]))
    if (!applicationsRes.error && applicationsRes.data) setApplications(applicationsRes.data as JobApplication[])
    setLoading(false)
  }

  useEffect(() => {
    if (!authorized) return
    let cancelled = false

    ;(async () => {
      setLoading(true)
      const isManager = !isAdmin && userEmail
      const userEmailNormalized = userEmail.toLowerCase().trim()

      console.log('PAGE LOAD - LOGGED IN HR EMAIL:', userEmailNormalized)
      console.log('PAGE LOAD - IS MANAGER (non-admin):', isManager)

      const [interviewsRes, candidatesRes, earningsRes, teamsRes, applicationsRes] = await Promise.all([
        isManager
          ? supabase.from('hr_interviews').select('*').eq('assigned_to_email', userEmailNormalized).order('created_at', { ascending: false })
          : supabase.from('hr_interviews').select('*').order('created_at', { ascending: false }),
        isManager
          ? supabase.from('hr_candidates').select('*').eq('assigned_to_email', userEmailNormalized).order('created_at', { ascending: false })
          : supabase.from('hr_candidates').select('*').order('created_at', { ascending: false }),
        isManager
          ? supabase.from('hr_earnings').select('*').eq('assigned_to_email', userEmailNormalized).order('created_at', { ascending: false })
          : supabase.from('hr_earnings').select('*').order('created_at', { ascending: false }),
        supabase.from('teams').select('*'),
        supabase.from('job_applications').select('*').order('created_at', { ascending: false }),
      ])

      console.log('PAGE LOAD - FOUND CANDIDATES:', candidatesRes.data)
      console.log('PAGE LOAD - CANDIDATES ERROR:', candidatesRes.error)

      if (!cancelled) {
        if (!interviewsRes.error && interviewsRes.data) setInterviews(interviewsRes.data as Interview[])
        if (!candidatesRes.error && candidatesRes.data) setCandidates(candidatesRes.data as Candidate[])
        if (!earningsRes.error && earningsRes.data) setEarnings(earningsRes.data as Earning[])
        if (!teamsRes.error && teamsRes.data && teamsRes.data.length > 0) setTeams(mergeTeamOneDefaults(teamsRes.data as Team[]))
        if (!applicationsRes.error && applicationsRes.data) setApplications(applicationsRes.data as JobApplication[])
        setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [authorized])

  const handleAddInterview = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    const { error } = await supabase.from('hr_interviews').insert({
      candidate_name: interviewForm.candidate_name,
      candidate_email: interviewForm.candidate_email,
      position: interviewForm.position,
      interview_date: interviewForm.interview_date || null,
      interview_time: interviewForm.interview_time,
      interviewer: interviewForm.interviewer,
      assigned_to_email: (interviewForm.assigned_to_email || userEmail).toLowerCase(),
      status: interviewForm.status,
      notes: interviewForm.notes,
    })

    setSaving(false)
    if (error) {
      setError(`Failed to schedule interview: ${error.message}`)
      return
    }

    setMessage(`Interview scheduled for ${interviewForm.candidate_name}`)
    setInterviewForm((prev) => ({ ...prev, candidate_name: '', candidate_email: '', position: '', interview_date: '', interview_time: '', interviewer: '', assigned_to_email: isAdmin ? '' : userEmail, notes: '' }))
    loadData()
  }

  const handleAddCandidate = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    // Non-admin HR managers automatically assign to themselves
    const targetEmail = (candidateForm.assigned_to_email || userEmail).toLowerCase().trim()

    const { error } = await supabase.from('hr_candidates').insert({
      candidate_name: candidateForm.candidate_name,
      candidate_email: candidateForm.candidate_email,
      assigned_role: candidateForm.assigned_role,
      assigned_to: candidateForm.assigned_to,
      assigned_to_email: targetEmail,
      project: candidateForm.project,
      status: candidateForm.status,
      notes: candidateForm.notes,
    })

    setSaving(false)
    if (error) {
      setError(`Failed to assign candidate: ${error.message}`)
      return
    }

    setMessage(`${candidateForm.candidate_name} assigned to ${candidateForm.assigned_to}`)
    setCandidateForm((prev) => ({ ...prev, candidate_name: '', candidate_email: '', assigned_role: '', assigned_to: '', assigned_to_email: '', project: '', notes: '' }))
    loadData()
  }

  const handleAddEarning = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    // Non-admin HR managers automatically assign to themselves
    const targetEmail = (earningForm.assigned_to_email || userEmail).toLowerCase().trim()

    const { error } = await supabase.from('hr_earnings').insert({
      candidate_name: earningForm.candidate_name,
      project: earningForm.project,
      amount_earned: earningForm.amount_earned,
      source: earningForm.source,
      assigned_to_email: targetEmail,
      earned_date: earningForm.earned_date || null,
      notes: earningForm.notes,
    })

    setSaving(false)
    if (error) {
      setError(`Failed to add earning: ${error.message}`)
      return
    }

    setMessage(`₹${earningForm.amount_earned} added for ${earningForm.candidate_name || 'candidate'}`)
    setEarningForm((prev) => ({ ...prev, candidate_name: '', project: '', amount_earned: '', source: '', earned_date: '', notes: '' }))
    loadData()
  }

  const handleInterviewStatusChange = async (interview: Interview, status: Interview['status']) => {
    const { error } = await supabase.from('hr_interviews').update({ status }).eq('id', interview.id)
    if (!error) {
      setInterviews((prev) => prev.map((i) => (i.id === interview.id ? { ...i, status } : i)))
    }
  }

  const handleCandidateStatusChange = async (candidate: Candidate, status: Candidate['status']) => {
    const { error } = await supabase.from('hr_candidates').update({ status }).eq('id', candidate.id)
    if (!error) {
      setCandidates((prev) => prev.map((c) => (c.id === candidate.id ? { ...c, status } : c)))
    }
  }

  const handleDeleteInterview = async (interview: Interview) => {
    const { error } = await supabase.from('hr_interviews').delete().eq('id', interview.id)
    if (!error) {
      setInterviews((prev) => prev.filter((i) => i.id !== interview.id))
      setMessage(`Interview for ${interview.candidate_name} deleted`)
    }
  }

  const handleDeleteCandidate = async (candidate: Candidate) => {
    const { error } = await supabase.from('hr_candidates').delete().eq('id', candidate.id)
    if (!error) {
      setCandidates((prev) => prev.filter((c) => c.id !== candidate.id))
      setMessage(`Assignment for ${candidate.candidate_name} deleted`)
    }
  }

  // ============ JOB APPLICATION HANDLERS ============
  const handleUpdateApplicationStatus = async (applicationId: string, status: string) => {
    const { error } = await supabase.from('job_applications').update({ status }).eq('id', applicationId)
    if (!error) {
      setApplications((prev) => prev.map((a) => (a.id === applicationId ? { ...a, status } : a)))
      setMessage('Application status updated')
    } else {
      setError(`Failed to update application: ${error.message}`)
    }
  }

  const handleDeleteApplication = async (application: JobApplication) => {
    if (!window.confirm(`Delete application from ${application.full_name} for "${application.position}"? This cannot be undone.`)) return
    const { error, count } = await supabase.from('job_applications').delete({ count: 'exact' }).eq('id', application.id)
    if (error) {
      setError(`Failed to delete application: ${error.message}`)
      return
    }
    if (count === 0) {
      setError('Delete blocked by database permissions (RLS). Run the job-applications SQL migration, then try again.')
      return
    }
    setApplications((prev) => prev.filter((a) => a.id !== application.id))
    setMessage(`Application from ${application.full_name} deleted`)
  }

  const handleDeleteEarning = async (earning: Earning) => {
    const { error } = await supabase.from('hr_earnings').delete().eq('id', earning.id)
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
          Verifying HR Manager access...
        </div>
      </main>
    )
  }

  if (!authorized) return null

  const totalInterviews = interviews.length
  const scheduledInterviews = interviews.filter((i) => i.status === 'Scheduled').length
  const selectedCandidates = interviews.filter((i) => i.status === 'Selected').length
  const totalEarned = earnings.reduce((sum, e) => sum + parseAmount(e.amount_earned), 0)
  const totalAssigned = candidates.length

  const statCards = isAdmin
    ? [
        { label: 'Total Interviews', value: totalInterviews, icon: ClipboardList, accent: 'text-blue-400 bg-blue-500/10' },
        { label: 'Scheduled', value: scheduledInterviews, icon: CalendarDays, accent: 'text-amber-400 bg-amber-500/10' },
        { label: 'Selected', value: selectedCandidates, icon: CheckCircle2, accent: 'text-emerald-400 bg-emerald-500/10' },
        { label: 'Amount Earned', value: `₹${totalEarned.toLocaleString('en-IN')}`, icon: Banknote, accent: 'text-red-400 bg-red-500/10' },
      ]
    : [
        { label: 'Candidates Assigned', value: totalAssigned, icon: UsersRound, accent: 'text-blue-400 bg-blue-500/10' },
        { label: 'Amount Earned', value: `₹${totalEarned.toLocaleString('en-IN')}`, icon: Banknote, accent: 'text-red-400 bg-red-500/10' },
      ]

  const completedInterviews = interviews.filter((i) => i.status === 'Completed')

  const tabs = isAdmin
    ? ([
        { id: 'interviews', label: 'Interviews', icon: ClipboardList },
        { id: 'completed', label: 'Completed', icon: CheckCircle2 },
        { id: 'candidates', label: 'Candidate Assigned', icon: UsersRound },
        { id: 'applications', label: 'Applications', icon: ClipboardList },
        { id: 'earnings', label: 'Amount Earned', icon: Banknote },
        { id: 'teams', label: 'Team Points', icon: Trophy },
        { id: 'messages', label: 'Messages', icon: MessageCircle },
      ] as const)
    : ([
        { id: 'candidates', label: 'Candidate Assigned', icon: UsersRound },
        { id: 'applications', label: 'Applications', icon: ClipboardList },
        { id: 'earnings', label: 'Amount Earned', icon: Banknote },
        { id: 'teams', label: 'Team Points', icon: Trophy },
        { id: 'messages', label: 'Messages', icon: MessageCircle },
      ] as const)

  return (
    <DashboardShell>
      <DashboardHeader
        brandLabel="Brandnest HR"
        title={isAdmin ? 'Admin HR Dashboard' : 'HR Manager Dashboard'}
        userName={userName}
        roleLabel={isAdmin ? 'Admin' : 'HR Manager'}
        showAdminLink={isAdmin}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <WelcomeBanner
          eyebrow={isAdmin ? 'Admin Control Center' : 'HR Manager Workspace'}
          title={`Welcome back, ${userName}!`}
          description={
            isAdmin
              ? 'Manage interviews, assign candidates, track earnings, and monitor team performance from one place.'
              : 'Track your assigned candidates and monitor the amount earned for your projects.'
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
          <p className="mt-6 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        {/* Tabs */}
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as typeof activeTab)}
          className={`grid-cols-2 ${isAdmin ? 'sm:grid-cols-7' : 'sm:grid-cols-5'}`}
        />

        {/* ============ INTERVIEWS TAB ============ */}
        {activeTab === 'interviews' && (
          <section className="mt-6">
            <form onSubmit={handleAddInterview} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div className="flex items-center gap-3">
                <Plus className="h-5 w-5 text-red-400" />
                <h2 className="text-xl font-black text-white">Schedule a New Interview</h2>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-white/75">Candidate Name *</span>
                  <input
                    required
                    type="text"
                    value={interviewForm.candidate_name}
                    onChange={(e) => setInterviewForm((prev) => ({ ...prev, candidate_name: e.target.value }))}
                    placeholder="e.g. John Doe"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-white/75">Candidate Email</span>
                  <input
                    type="email"
                    value={interviewForm.candidate_email}
                    onChange={(e) => setInterviewForm((prev) => ({ ...prev, candidate_email: e.target.value }))}
                    placeholder="candidate@email.com"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-white/75">Position</span>
                  <input
                    type="text"
                    value={interviewForm.position}
                    onChange={(e) => setInterviewForm((prev) => ({ ...prev, position: e.target.value }))}
                    placeholder="e.g. Full Stack Developer"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-white/75">Interviewer</span>
                  <input
                    type="text"
                    value={interviewForm.interviewer}
                    onChange={(e) => setInterviewForm((prev) => ({ ...prev, interviewer: e.target.value }))}
                    placeholder="e.g. HR Team"
                    className={inputClass}
                  />
                </label>
                {isAdmin && (
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Assigned To Email *</span>
                    <select
                      required
                      value={interviewForm.assigned_to_email}
                      onChange={(e) => setInterviewForm((prev) => ({ ...prev, assigned_to_email: e.target.value }))}
                      className={inputClass}
                    >
                      <option value="">Select HR Manager...</option>
                      {HR_EMAILS.map((email) => (
                        <option key={email} value={email}>
                          {email}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <label className="block">
                  <span className="text-sm font-semibold text-white/75">Interview Date</span>
                  <input
                    type="date"
                    value={interviewForm.interview_date}
                    onChange={(e) => setInterviewForm((prev) => ({ ...prev, interview_date: e.target.value }))}
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-white/75">Interview Time</span>
                  <input
                    type="time"
                    value={interviewForm.interview_time}
                    onChange={(e) => setInterviewForm((prev) => ({ ...prev, interview_time: e.target.value }))}
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-white/75">Status</span>
                  <select
                    value={interviewForm.status}
                    onChange={(e) => setInterviewForm((prev) => ({ ...prev, status: e.target.value as Interview['status'] }))}
                    className={inputClass}
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Selected">Selected</option>
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm font-semibold text-white/75">Notes</span>
                  <textarea
                    rows={3}
                    value={interviewForm.notes}
                    onChange={(e) => setInterviewForm((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Interview notes, feedback..."
                    className={inputClass}
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 font-bold text-white shadow-[0_20px_60px_rgba(220,38,38,0.3)] transition hover:from-red-500 hover:to-red-400 disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ClipboardList className="h-4 w-4" />}
                {saving ? 'Scheduling...' : 'Schedule Interview'}
              </button>
            </form>

            {/* All interviews list */}
            <div className="mt-10">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ClipboardList className="h-5 w-5 text-red-400" />
                  <h2 className="text-xl font-black text-white">All Interviews</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/80">
                  {interviews.length} total
                </span>
              </div>

              {loading ? (
                <LoadingState label="Loading interviews..." />
              ) : interviews.length === 0 ? (
                <EmptyState icon={ClipboardList} title="No interviews scheduled yet" />
              ) : (
                <div className="mt-6 space-y-4">
                  {interviews.map((interview) => (
                    <article key={interview.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-bold text-white">{interview.candidate_name}</h3>
                            <StatusBadge status={interview.status} />
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-white/80">
                            {interview.position && (
                              <span className="inline-flex items-center gap-1.5">
                                <Briefcase className="h-3.5 w-3.5 text-red-400" />
                                {interview.position}
                              </span>
                            )}
                            {interview.candidate_email && (
                              <span className="inline-flex items-center gap-1.5">
                                <UserRound className="h-3.5 w-3.5 text-red-400" />
                                {interview.candidate_email}
                              </span>
                            )}
                            {interview.interviewer && (
                              <span className="inline-flex items-center gap-1.5">
                                <UsersRound className="h-3.5 w-3.5 text-red-400" />
                                {interview.interviewer}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-white/80">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays className="h-3.5 w-3.5 text-red-400" />
                              {formatDate(interview.interview_date)}
                              {interview.interview_time && ` at ${interview.interview_time}`}
                            </span>
                          </div>
                          {interview.notes && (
                            <p className="mt-3 rounded-xl border border-white/5 bg-black/25 px-4 py-3 text-sm leading-6 text-white/85">
                              {interview.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <select
                            value={interview.status}
                            onChange={(e) => handleInterviewStatusChange(interview, e.target.value as Interview['status'])}
                            className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm font-semibold text-white outline-none transition focus:border-red-400"
                          >
                            <option value="Scheduled">Scheduled</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Selected">Selected</option>
                          </select>
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => handleDeleteInterview(interview)}
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                              aria-label={`Delete interview for ${interview.candidate_name}`}
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

        {/* ============ COMPLETED INTERVIEWS TAB (ADMIN ONLY) ============ */}
        {activeTab === 'completed' && isAdmin && (
          <section className="mt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <h2 className="text-xl font-black text-white">Completed Interviews</h2>
              </div>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                {completedInterviews.length} completed
              </span>
            </div>

            {loading ? (
              <LoadingState label="Loading completed interviews..." />
            ) : completedInterviews.length === 0 ? (
              <EmptyState icon={CheckCircle2} title="No completed interviews yet" description="Interviews marked as Completed will appear here." />
            ) : (
              <div className="mt-6 space-y-4">
                {completedInterviews.map((interview) => (
                  <article key={interview.id} className="rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.04] p-5 transition hover:border-emerald-400/40">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-bold text-white">{interview.candidate_name}</h3>
                          <StatusBadge status="Completed" />
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-white/80">
                          {interview.position && (
                            <span className="inline-flex items-center gap-1.5">
                              <Briefcase className="h-3.5 w-3.5 text-emerald-400" />
                              {interview.position}
                            </span>
                          )}
                          {interview.candidate_email && (
                            <span className="inline-flex items-center gap-1.5">
                              <UserRound className="h-3.5 w-3.5 text-emerald-400" />
                              {interview.candidate_email}
                            </span>
                          )}
                          {interview.interviewer && (
                            <span className="inline-flex items-center gap-1.5">
                              <UsersRound className="h-3.5 w-3.5 text-emerald-400" />
                              {interview.interviewer}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-white/80">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5 text-emerald-400" />
                            {formatDate(interview.interview_date)}
                            {interview.interview_time && ` at ${interview.interview_time}`}
                          </span>
                        </div>
                        {interview.notes && (
                          <p className="mt-3 rounded-xl border border-white/5 bg-black/25 px-4 py-3 text-sm leading-6 text-white/85">
                            {interview.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteInterview(interview)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                          aria-label={`Delete completed interview for ${interview.candidate_name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ============ CANDIDATE ASSIGNED TAB ============ */}
        {activeTab === 'candidates' && (
          <section className="mt-6">
            {isAdmin && (
              <form onSubmit={handleAddCandidate} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <div className="flex items-center gap-3">
                  <Plus className="h-5 w-5 text-red-400" />
                  <h2 className="text-xl font-black text-white">Assign a Candidate</h2>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Candidate Name *</span>
                    <input
                      required
                      type="text"
                      value={candidateForm.candidate_name}
                      onChange={(e) => setCandidateForm((prev) => ({ ...prev, candidate_name: e.target.value }))}
                      placeholder="e.g. Jane Smith"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Candidate Email</span>
                    <input
                      type="email"
                      value={candidateForm.candidate_email}
                      onChange={(e) => setCandidateForm((prev) => ({ ...prev, candidate_email: e.target.value }))}
                      placeholder="candidate@email.com"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Assigned Role</span>
                    <input
                      type="text"
                      value={candidateForm.assigned_role}
                      onChange={(e) => setCandidateForm((prev) => ({ ...prev, assigned_role: e.target.value }))}
                      placeholder="e.g. UI/UX Designer"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Assigned To *</span>
                    <input
                      required
                      type="text"
                      value={candidateForm.assigned_to}
                      onChange={(e) => setCandidateForm((prev) => ({ ...prev, assigned_to: e.target.value }))}
                      placeholder="e.g. Team 1 / Dev Dharrshan"
                      className={inputClass}
                    />
                  </label>
                  {isAdmin && (
                    <label className="block sm:col-span-2">
                      <span className="text-sm font-semibold text-white/75">Assigned To Email *</span>
                      <select
                        required
                        value={candidateForm.assigned_to_email}
                        onChange={(e) => setCandidateForm((prev) => ({ ...prev, assigned_to_email: e.target.value }))}
                        className={inputClass}
                      >
                        <option value="">Select HR Manager...</option>
                        {HR_EMAILS.map((email) => (
                          <option key={email} value={email}>
                            {email}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Project</span>
                    <input
                      type="text"
                      value={candidateForm.project}
                      onChange={(e) => setCandidateForm((prev) => ({ ...prev, project: e.target.value }))}
                      placeholder="e.g. Brandnest Website"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Status</span>
                    <select
                      value={candidateForm.status}
                      onChange={(e) => setCandidateForm((prev) => ({ ...prev, status: e.target.value as Candidate['status'] }))}
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
                      value={candidateForm.notes}
                      onChange={(e) => setCandidateForm((prev) => ({ ...prev, notes: e.target.value }))}
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
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <UsersRound className="h-4 w-4" />}
                  {saving ? 'Assigning...' : 'Assign Candidate'}
                </button>
              </form>
            )}

            {/* All candidates list */}
            <div className="mt-10">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <UsersRound className="h-5 w-5 text-red-400" />
                  <h2 className="text-xl font-black text-white">All Assigned Candidates</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/80">
                  {candidates.length} total
                </span>
              </div>

              {loading ? (
                <LoadingState label="Loading candidates..." />
              ) : candidates.length === 0 ? (
                <EmptyState icon={UsersRound} title="No candidates assigned yet" />
              ) : (
                <div className="mt-6 space-y-4">
                  {candidates.map((candidate) => (
                    <article key={candidate.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-bold text-white">{candidate.candidate_name}</h3>
                            <StatusBadge status={candidate.status} />
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-white/80">
                            {candidate.assigned_role && (
                              <span className="inline-flex items-center gap-1.5">
                                <Briefcase className="h-3.5 w-3.5 text-red-400" />
                                {candidate.assigned_role}
                              </span>
                            )}
                            {candidate.assigned_to && (
                              <span className="inline-flex items-center gap-1.5">
                                <UsersRound className="h-3.5 w-3.5 text-red-400" />
                                {candidate.assigned_to}
                              </span>
                            )}
                            {candidate.project && (
                              <span className="inline-flex items-center gap-1.5">
                                <LayoutDashboard className="h-3.5 w-3.5 text-red-400" />
                                {candidate.project}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-white/80">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays className="h-3.5 w-3.5 text-red-400" />
                              Assigned: {formatDate(candidate.assigned_at)}
                            </span>
                          </div>
                          {candidate.notes && (
                            <p className="mt-3 rounded-xl border border-white/5 bg-black/25 px-4 py-3 text-sm leading-6 text-white/85">
                              {candidate.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <select
                            value={candidate.status}
                            onChange={(e) => handleCandidateStatusChange(candidate, e.target.value as Candidate['status'])}
                            className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm font-semibold text-white outline-none transition focus:border-red-400"
                          >
                            <option value="Assigned">Assigned</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="On Hold">On Hold</option>
                          </select>
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => handleDeleteCandidate(candidate)}
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                              aria-label={`Delete assignment for ${candidate.candidate_name}`}
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
                    <span className="text-sm font-semibold text-white/75">Candidate Name</span>
                    <input
                      type="text"
                      value={earningForm.candidate_name}
                      onChange={(e) => setEarningForm((prev) => ({ ...prev, candidate_name: e.target.value }))}
                      placeholder="e.g. Jane Smith"
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
                  {isAdmin && (
                    <label className="block">
                      <span className="text-sm font-semibold text-white/75">Assign To Email *</span>
                      <select
                        required
                        value={earningForm.assigned_to_email}
                        onChange={(e) => setEarningForm((prev) => ({ ...prev, assigned_to_email: e.target.value }))}
                        className={inputClass}
                      >
                        <option value="">Select HR Manager...</option>
                        {HR_EMAILS.map((email) => (
                          <option key={email} value={email}>
                            {email}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Earned Date</span>
                    <input
                      type="date"
                      value={earningForm.earned_date}
                      onChange={(e) => setEarningForm((prev) => ({ ...prev, earned_date: e.target.value }))}
                      className={inputClass}
                    />
                  </label>
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
                            <h3 className="text-lg font-bold text-white">{earning.candidate_name || 'Candidate'}</h3>
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

        {/* ============ JOB APPLICATIONS TAB ============ */}
        {activeTab === 'applications' && (
          <section className="mt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ClipboardList className="h-5 w-5 text-orange-400" />
                <h2 className="text-xl font-black text-white">Job Applications</h2>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/80">
                {applications.length} total
              </span>
            </div>

            {loading ? (
              <LoadingState label="Loading applications..." />
            ) : applications.length === 0 ? (
              <EmptyState icon={ClipboardList} title="No applications yet" description="Applications submitted from the /careers page will appear here." />
            ) : (
              <div className="mt-6 space-y-4">
                {applications.map((app) => (
                  <article key={app.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-white">{app.full_name}</h3>
                          <span className="rounded-full border border-orange-400/30 bg-orange-500/10 px-2.5 py-0.5 text-xs font-semibold text-orange-300">
                            {app.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-orange-300">{app.position || 'Position not specified'}</p>

                        <div className="mt-3 grid gap-x-6 gap-y-1.5 text-sm text-white/70 sm:grid-cols-2">
                          <span>Email: {app.email}</span>
                          <span>Phone: {app.phone || '—'}</span>
                          <span>College/Company: {app.college_company || '—'}</span>
                          <span>Qualification: {app.qualification || '—'} ({app.graduation_year || '—'})</span>
                          <span>Experience: {app.experience_level}{app.years_experience && app.years_experience !== '0' ? ` · ${app.years_experience} yrs` : ''}</span>
                          <span>Job type: {app.job_type} · {app.work_location}</span>
                          <span className="sm:col-span-2">Skills: {app.skills || '—'}</span>
                          <span>Heard from: {app.heard_from || '—'}</span>
                          {app.available_from && <span>Available from: {formatDate(app.available_from)}</span>}
                          <span>Applied: {formatDate(app.created_at)}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {app.resume_url && (
                            <a href={app.resume_url} target="_blank" rel="noreferrer" className="rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-300 transition hover:bg-orange-500/20">
                              Resume ↗
                            </a>
                          )}
                          {app.portfolio_url && (
                            <a href={app.portfolio_url} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/70 transition hover:bg-white/10">
                              Portfolio ↗
                            </a>
                          )}
                          {app.github_url && (
                            <a href={app.github_url} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/70 transition hover:bg-white/10">
                              GitHub ↗
                            </a>
                          )}
                          {app.linkedin_url && (
                            <a href={app.linkedin_url} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/70 transition hover:bg-white/10">
                              LinkedIn ↗
                            </a>
                          )}
                        </div>

                        {app.cover_letter && (
                          <p className="mt-3 whitespace-pre-wrap rounded-xl border border-white/10 bg-black/25 p-3 text-sm leading-6 text-white/75">
                            {app.cover_letter}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 flex-row items-center gap-2 lg:w-44 lg:flex-col lg:items-stretch">
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value)}
                          className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-orange-400 lg:flex-none"
                        >
                          {applicationStatusOptions.map((s) => (
                            <option key={s} value={s} className="bg-[#0c0c0c]">
                              {s}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => handleDeleteApplication(app)}
                          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-red-400/20 bg-red-500/10 px-3 text-xs font-semibold text-red-300 transition hover:bg-red-500/20"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
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
                {[...teams]
                  .sort(
                    (a, b) =>
                      Number(b.id === 'team1' || b.name.toLowerCase().includes('1')) -
                        Number(a.id === 'team1' || a.name.toLowerCase().includes('1')) ||
                      a.id.localeCompare(b.id),
                  )
                  .map((team) => {
                  const isTeam1 = team.id === 'team1' || team.name.toLowerCase().includes('1')
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
                              key={`${member.id || member.name}-${memberIndex}`}
                              className={`group flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition ${
                                isTop
                                  ? 'border-amber-400/40 bg-amber-500/10 shadow-[0_0_25px_rgba(251,191,36,0.08)]'
                                  : 'border-white/5 bg-black/25 hover:border-white/15'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <TeamMemberAvatar name={member.name} />
                                <div>
                                  <p className={`font-semibold ${isTop ? 'text-amber-300' : 'text-white'}`}>
                                    {member.name}
                                    {isTop && <Trophy className="ml-1.5 inline h-4 w-4" />}
                                    {member.isTeamLead && (
                                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[0.65rem] font-bold text-amber-300">
                                        <Crown className="inline h-3 w-3" />
                                        Team Lead
                                      </span>
                                    )}
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

        {/* Messages */}
        {activeTab === 'messages' && (
          <section className="mt-6">
            <MessageCenter />
          </section>
        )}
      </div>
    </DashboardShell>
  )
}
