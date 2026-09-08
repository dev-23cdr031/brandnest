'use client'

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Activity,
  Banknote,
  Briefcase,
  Bug,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Crown,
  Handshake,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogIn,
  Mail,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  Trophy,
  UserRound,
  UsersRound,
  Wallet,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { DEVELOPER_EMAILS } from '@/lib/developers'
import { HR_EMAILS, CRM_EMAILS, TESTER_EMAILS, isAdminEmail } from '@/lib/roles'

// ============ TYPES ============
type Order = {
  id: string
  created_at: string
  service: string
  price: string
  name: string
  company: string
  email: string
  phone: string
  budget: string
  details: string
  status: 'New' | 'In Progress' | 'Completed'
}

type Interview = {
  id: string
  candidate_name: string
  candidate_email: string
  position: string
  interview_date: string | null
  interview_time: string
  interviewer: string
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
  project: string
  status: 'Assigned' | 'In Progress' | 'Completed' | 'On Hold'
  assigned_at: string
  notes: string
  created_at: string
}

type HREarning = {
  id: string
  candidate_name: string
  project: string
  amount_earned: string
  source: string
  earned_date: string | null
  notes: string
  created_at: string
}

type Client = {
  id: string
  client_name: string
  client_email: string
  company: string
  project: string
  assigned_to: string
  status: 'Assigned' | 'In Progress' | 'Completed' | 'On Hold'
  assigned_at: string
  notes: string
  created_at: string
}

type CRMEarning = {
  id: string
  client_name: string
  project: string
  amount_earned: string
  source: string
  earned_date: string | null
  notes: string
  created_at: string
}

type TesterProject = {
  id: string
  project_name: string
  project_type: string
  assigned_to: string
  client: string
  status: 'Assigned' | 'In Progress' | 'Testing' | 'Completed' | 'On Hold'
  assigned_at: string
  notes: string
  created_at: string
}

type TesterEarning = {
  id: string
  project_name: string
  amount_earned: string
  source: string
  earned_date: string | null
  notes: string
  created_at: string
}

type DevProject = {
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

type DevEarning = {
  id: string
  developer_email: string
  project_title: string
  amount_earned: string
  paid: boolean
  paid_at: string | null
  description: string
  created_at: string
}

type TeamMember = {
  id: string
  name: string
  points: number
  isTeamLead?: boolean
  onBreak?: boolean
  breakReturnDate?: string
  breakDuration?: string
}

type Team = {
  id: string
  name: string
  color: string
  members: TeamMember[]
  weeksWins: number
}

// Fall back to default week wins if the value is missing in the DB, and
// defensively remove any duplicate members (by name) so lists can never render twice
const mergeTeamDefaults = (data: Team[]): Team[] =>
  data.map((t) => {
    const seenNames = new Set<string>()
    const seenIds = new Set<string>()
    const members = (t.members || []).filter((m) => {
      const key = m.name.trim().toLowerCase()
      if (seenNames.has(key)) return false
      seenNames.add(key)
      return true
    }).map((m, i) => {
      let id = m.id
      if (!id || seenIds.has(id)) id = `${t.id}-m${i}`
      seenIds.add(id)
      return { ...m, id }
    })
    return {
      ...t,
      members,
      weeksWins: t.weeksWins ?? (t.name === 'Team 1' ? 3 : 0),
    }
  })

// Live countdown for members on break
function BreakCountdown({ member }: { member: TeamMember }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const returnTime = member.breakReturnDate ? new Date(member.breakReturnDate).getTime() : null
  if (returnTime === null) return null
  const diff = Math.max(0, returnTime - now)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return (
    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-0.5 text-xs font-bold tabular-nums text-orange-400">
      {`${days}d ${hours}h ${minutes}m ${seconds}s`} left to rejoin
    </span>
  )
}

// ============ STYLES ============
const orderStatusStyles: Record<Order['status'], string> = {
  New: 'bg-blue-500/15 text-blue-300 border-blue-400/30',
  'In Progress': 'bg-amber-500/15 text-amber-300 border-amber-400/30',
  Completed: 'bg-green-500/15 text-green-300 border-green-400/30',
}

const interviewStatusStyles: Record<Interview['status'], string> = {
  Scheduled: 'bg-blue-500/15 text-blue-300 border-blue-400/30',
  'In Progress': 'bg-amber-500/15 text-amber-300 border-amber-400/30',
  Completed: 'bg-green-500/15 text-green-300 border-green-400/30',
  Rejected: 'bg-red-500/15 text-red-300 border-red-400/30',
  Selected: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
}

const candidateStatusStyles: Record<Candidate['status'], string> = {
  Assigned: 'bg-blue-500/15 text-blue-300 border-blue-400/30',
  'In Progress': 'bg-amber-500/15 text-amber-300 border-amber-400/30',
  Completed: 'bg-green-500/15 text-green-300 border-green-400/30',
  'On Hold': 'bg-purple-500/15 text-purple-300 border-purple-400/30',
}

const clientStatusStyles: Record<Client['status'], string> = {
  Assigned: 'bg-blue-500/15 text-blue-300 border-blue-400/30',
  'In Progress': 'bg-amber-500/15 text-amber-300 border-amber-400/30',
  Completed: 'bg-green-500/15 text-green-300 border-green-400/30',
  'On Hold': 'bg-purple-500/15 text-purple-300 border-purple-400/30',
}

const testerStatusStyles: Record<TesterProject['status'], string> = {
  Assigned: 'bg-blue-500/15 text-blue-300 border-blue-400/30',
  'In Progress': 'bg-amber-500/15 text-amber-300 border-amber-400/30',
  Testing: 'bg-purple-500/15 text-purple-300 border-purple-400/30',
  Completed: 'bg-green-500/15 text-green-300 border-green-400/30',
  'On Hold': 'bg-red-500/15 text-red-300 border-red-400/30',
}

const devStatusStyles: Record<DevProject['status'], string> = {
  Assigned: 'bg-blue-500/15 text-blue-300 border-blue-400/30',
  'In Progress': 'bg-amber-500/15 text-amber-300 border-amber-400/30',
  Completed: 'bg-green-500/15 text-green-300 border-green-400/30',
}

// ============ HELPERS ============
function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function parseAmount(amount: string) {
  const num = parseFloat(String(amount).replace(/[^0-9.-]/g, ''))
  return isNaN(num) ? 0 : num
}

const inputClass =
  'mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-red-400'

// ============ MAIN COMPONENT ============
export default function AdminPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [userName, setUserName] = useState('')
  const [activeSection, setActiveSection] = useState<'overview' | 'orders' | 'hr' | 'crm' | 'tester' | 'developers' | 'teams'>('overview')
  const [refreshing, setRefreshing] = useState(false)

  // Orders
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  // HR
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [hrEarnings, setHrEarnings] = useState<HREarning[]>([])

  // CRM
  const [clients, setClients] = useState<Client[]>([])
  const [crmEarnings, setCrmEarnings] = useState<CRMEarning[]>([])

  // Tester
  const [testerProjects, setTesterProjects] = useState<TesterProject[]>([])
  const [testerEarnings, setTesterEarnings] = useState<TesterEarning[]>([])

  // Developers
  const [devProjects, setDevProjects] = useState<DevProject[]>([])
  const [devEarnings, setDevEarnings] = useState<DevEarning[]>([])

  // Teams
  const [teams, setTeams] = useState<Team[]>([])

  // Forms
  const [saving, setSaving] = useState(false)
  const [savingTeams, setSavingTeams] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Edit states
  const [editingDevProject, setEditingDevProject] = useState<DevProject | null>(null)
  const [editingDevEarning, setEditingDevEarning] = useState<DevEarning | null>(null)
  const [editDevProjectForm, setEditDevProjectForm] = useState({
    title: '',
    description: '',
    client: '',
    amount: '',
    status: 'Assigned' as DevProject['status'],
    deadline: '',
  })
  const [editDevEarningForm, setEditDevEarningForm] = useState({
    project_title: '',
    amount_earned: '',
    paid: false,
    description: '',
  })

  // Form states
  const [interviewForm, setInterviewForm] = useState({
    candidate_name: '',
    candidate_email: '',
    position: '',
    interview_date: '',
    interview_time: '',
    interviewer: '',
    assigned_to_email: '',
    status: 'Scheduled' as Interview['status'],
    notes: '',
  })

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

  const [hrEarningForm, setHrEarningForm] = useState({
    candidate_name: '',
    project: '',
    amount_earned: '',
    source: '',
    assigned_to_email: '',
    earned_date: '',
    notes: '',
  })

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

  const [crmEarningForm, setCrmEarningForm] = useState({
    client_name: '',
    project: '',
    amount_earned: '',
    source: '',
    assigned_to_email: '',
    earned_date: '',
    notes: '',
  })

  const [testerForm, setTesterForm] = useState({
    project_name: '',
    project_type: '',
    assigned_to: '',
    assigned_to_email: '',
    client: '',
    status: 'Assigned' as TesterProject['status'],
    notes: '',
  })

  const [testerEarningForm, setTesterEarningForm] = useState({
    project_name: '',
    amount_earned: '',
    source: '',
    assigned_to_email: '',
    earned_date: '',
    notes: '',
  })

  const [devProjectForm, setDevProjectForm] = useState({
    developer_email: '',
    title: '',
    description: '',
    client: '',
    amount: '',
    status: 'Assigned' as DevProject['status'],
    deadline: '',
  })

  const [devEarningForm, setDevEarningForm] = useState({
    developer_email: '',
    project_title: '',
    amount_earned: '',
    paid: false,
    description: '',
  })

  // ============ AUTH ============
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user || !isAdminEmail(user.email)) {
        router.replace('/login')
        return
      }

      setUserName((user.user_metadata?.full_name as string) || user.email?.split('@')[0] || 'Admin')
      setAuthorized(true)
      setChecking(false)
    }

    checkAuth()
  }, [router])

  // ============ DATA LOADING ============
  const loadAllData = async () => {
    setLoadingOrders(true)
    const [
      ordersRes,
      interviewsRes,
      candidatesRes,
      hrEarningsRes,
      clientsRes,
      crmEarningsRes,
      testerProjectsRes,
      testerEarningsRes,
      devProjectsRes,
      devEarningsRes,
      teamsRes,
    ] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('hr_interviews').select('*').order('created_at', { ascending: false }),
      supabase.from('hr_candidates').select('*').order('created_at', { ascending: false }),
      supabase.from('hr_earnings').select('*').order('created_at', { ascending: false }),
      supabase.from('crm_clients').select('*').order('created_at', { ascending: false }),
      supabase.from('crm_earnings').select('*').order('created_at', { ascending: false }),
      supabase.from('tester_projects').select('*').order('created_at', { ascending: false }),
      supabase.from('tester_earnings').select('*').order('created_at', { ascending: false }),
      supabase.from('developer_projects').select('*').order('created_at', { ascending: false }),
      supabase.from('developer_earnings').select('*').order('created_at', { ascending: false }),
      supabase.from('teams').select('*'),
    ])

    if (!ordersRes.error && ordersRes.data) setOrders(ordersRes.data as Order[])
    if (!interviewsRes.error && interviewsRes.data) setInterviews(interviewsRes.data as Interview[])
    if (!candidatesRes.error && candidatesRes.data) setCandidates(candidatesRes.data as Candidate[])
    if (!hrEarningsRes.error && hrEarningsRes.data) setHrEarnings(hrEarningsRes.data as HREarning[])
    if (!clientsRes.error && clientsRes.data) setClients(clientsRes.data as Client[])
    if (!crmEarningsRes.error && crmEarningsRes.data) setCrmEarnings(crmEarningsRes.data as CRMEarning[])
    if (!testerProjectsRes.error && testerProjectsRes.data) setTesterProjects(testerProjectsRes.data as TesterProject[])
    if (!testerEarningsRes.error && testerEarningsRes.data) setTesterEarnings(testerEarningsRes.data as TesterEarning[])
    if (!devProjectsRes.error && devProjectsRes.data) setDevProjects(devProjectsRes.data as DevProject[])
    if (!devEarningsRes.error && devEarningsRes.data) setDevEarnings(devEarningsRes.data as DevEarning[])
    if (!teamsRes.error && teamsRes.data && teamsRes.data.length > 0) setTeams(mergeTeamDefaults(teamsRes.data as Team[]))

    setLoadingOrders(false)
  }

  useEffect(() => {
    if (!authorized) return
    let cancelled = false

    ;(async () => {
      setLoadingOrders(true)
      const [
        ordersRes,
        interviewsRes,
        candidatesRes,
        hrEarningsRes,
        clientsRes,
        crmEarningsRes,
        testerProjectsRes,
        testerEarningsRes,
        devProjectsRes,
        devEarningsRes,
        teamsRes,
      ] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('hr_interviews').select('*').order('created_at', { ascending: false }),
        supabase.from('hr_candidates').select('*').order('created_at', { ascending: false }),
        supabase.from('hr_earnings').select('*').order('created_at', { ascending: false }),
        supabase.from('crm_clients').select('*').order('created_at', { ascending: false }),
        supabase.from('crm_earnings').select('*').order('created_at', { ascending: false }),
        supabase.from('tester_projects').select('*').order('created_at', { ascending: false }),
        supabase.from('tester_earnings').select('*').order('created_at', { ascending: false }),
        supabase.from('developer_projects').select('*').order('created_at', { ascending: false }),
        supabase.from('developer_earnings').select('*').order('created_at', { ascending: false }),
        supabase.from('teams').select('*'),
      ])

      if (!cancelled) {
        if (!ordersRes.error && ordersRes.data) setOrders(ordersRes.data as Order[])
        if (!interviewsRes.error && interviewsRes.data) setInterviews(interviewsRes.data as Interview[])
        if (!candidatesRes.error && candidatesRes.data) setCandidates(candidatesRes.data as Candidate[])
        if (!hrEarningsRes.error && hrEarningsRes.data) setHrEarnings(hrEarningsRes.data as HREarning[])
        if (!clientsRes.error && clientsRes.data) setClients(clientsRes.data as Client[])
        if (!crmEarningsRes.error && crmEarningsRes.data) setCrmEarnings(crmEarningsRes.data as CRMEarning[])
        if (!testerProjectsRes.error && testerProjectsRes.data) setTesterProjects(testerProjectsRes.data as TesterProject[])
        if (!testerEarningsRes.error && testerEarningsRes.data) setTesterEarnings(testerEarningsRes.data as TesterEarning[])
        if (!devProjectsRes.error && devProjectsRes.data) setDevProjects(devProjectsRes.data as DevProject[])
        if (!devEarningsRes.error && devEarningsRes.data) setDevEarnings(devEarningsRes.data as DevEarning[])
        if (!teamsRes.error && teamsRes.data && teamsRes.data.length > 0) setTeams(mergeTeamDefaults(teamsRes.data as Team[]))
        setLoadingOrders(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [authorized])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadAllData()
    setRefreshing(false)
  }

  // ============ ORDER HANDLERS ============
  const handleOrderStatusChange = async (orderId: string, status: Order['status']) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
    if (!error) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
    }
  }

  const handleDeleteOrder = async (order: Order) => {
    const { error } = await supabase.from('orders').delete().eq('id', order.id)
    if (!error) {
      setOrders((prev) => prev.filter((o) => o.id !== order.id))
      setMessage(`Order "${order.service}" deleted`)
    } else {
      setError(`Failed to delete order: ${error.message}`)
    }
  }

  // ============ HR HANDLERS ============
  const handleAddInterview = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    // Normalize the target HR email before persisting (lowercase + trim)
    const targetEmail = interviewForm.assigned_to_email.toLowerCase().trim()

    const { error } = await supabase.from('hr_interviews').insert({
      candidate_name: interviewForm.candidate_name,
      candidate_email: interviewForm.candidate_email,
      position: interviewForm.position,
      interview_date: interviewForm.interview_date || null,
      interview_time: interviewForm.interview_time,
      interviewer: interviewForm.interviewer,
      assigned_to_email: targetEmail,
      status: interviewForm.status,
      notes: interviewForm.notes,
    })

    setSaving(false)
    if (error) {
      setError(`Failed to schedule interview: ${error.message}`)
      return
    }

    setMessage(`Interview scheduled for ${interviewForm.candidate_name}`)
    setInterviewForm((prev) => ({ ...prev, candidate_name: '', candidate_email: '', position: '', interview_date: '', interview_time: '', interviewer: '', assigned_to_email: '', notes: '' }))
    loadAllData()
  }

  const handleAddCandidate = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    const payload = {
      candidate_name: candidateForm.candidate_name,
      candidate_email: candidateForm.candidate_email,
      assigned_role: candidateForm.assigned_role,
      assigned_to: candidateForm.assigned_to,
      assigned_to_email: candidateForm.assigned_to_email.toLowerCase().trim(),
      project: candidateForm.project,
      status: candidateForm.status,
      notes: candidateForm.notes,
    }
    console.log('SAVED CANDIDATE PAYLOAD:', payload)

    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    const res = await fetch('/api/admin/assign-candidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    })
    const result = await res.json()
    const insertedData = result.data
    const error = res.ok ? null : { message: result.error || 'Unknown error' }

    console.log('INSERT RESULT:', { insertedData, error })

    setSaving(false)
    if (error) {
      setError(`Failed to assign candidate: ${error.message}`)
      return
    }

    setMessage(`${candidateForm.candidate_name} assigned to ${candidateForm.assigned_to}`)
    setCandidateForm((prev) => ({ ...prev, candidate_name: '', candidate_email: '', assigned_role: '', assigned_to: '', project: '', notes: '' }))
    loadAllData()
  }

  const handleAddHrEarning = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    const { error } = await supabase.from('hr_earnings').insert({
      candidate_name: hrEarningForm.candidate_name,
      project: hrEarningForm.project,
      amount_earned: hrEarningForm.amount_earned,
      source: hrEarningForm.source,
      assigned_to_email: hrEarningForm.assigned_to_email.toLowerCase(),
      earned_date: hrEarningForm.earned_date || null,
      notes: hrEarningForm.notes,
    })

    setSaving(false)
    if (error) {
      setError(`Failed to add earning: ${error.message}`)
      return
    }

    setMessage(`₹${hrEarningForm.amount_earned} added for ${hrEarningForm.candidate_name || 'candidate'}`)
    setHrEarningForm((prev) => ({ ...prev, candidate_name: '', project: '', amount_earned: '', source: '', earned_date: '', notes: '' }))
    loadAllData()
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

  const handleDeleteHrEarning = async (earning: HREarning) => {
    const { error } = await supabase.from('hr_earnings').delete().eq('id', earning.id)
    if (!error) {
      setHrEarnings((prev) => prev.filter((x) => x.id !== earning.id))
      setMessage('Earning record deleted')
    }
  }

  // ============ CRM HANDLERS ============
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
    loadAllData()
  }

  const handleAddCrmEarning = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    const { error } = await supabase.from('crm_earnings').insert({
      client_name: crmEarningForm.client_name,
      project: crmEarningForm.project,
      amount_earned: crmEarningForm.amount_earned,
      source: crmEarningForm.source,
      assigned_to_email: crmEarningForm.assigned_to_email.toLowerCase(),
      earned_date: crmEarningForm.earned_date || null,
      notes: crmEarningForm.notes,
    })

    setSaving(false)
    if (error) {
      setError(`Failed to add earning: ${error.message}`)
      return
    }

    setMessage(`₹${crmEarningForm.amount_earned} added for ${crmEarningForm.client_name || 'client'}`)
    setCrmEarningForm((prev) => ({ ...prev, client_name: '', project: '', amount_earned: '', source: '', earned_date: '', notes: '' }))
    loadAllData()
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

  const handleDeleteCrmEarning = async (earning: CRMEarning) => {
    const { error } = await supabase.from('crm_earnings').delete().eq('id', earning.id)
    if (!error) {
      setCrmEarnings((prev) => prev.filter((x) => x.id !== earning.id))
      setMessage('Earning record deleted')
    }
  }

  // ============ TESTER HANDLERS ============
  const handleAddTesterProject = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    const { error } = await supabase.from('tester_projects').insert({
      project_name: testerForm.project_name,
      project_type: testerForm.project_type,
      assigned_to: testerForm.assigned_to,
      assigned_to_email: testerForm.assigned_to_email.toLowerCase(),
      client: testerForm.client,
      status: testerForm.status,
      notes: testerForm.notes,
    })

    setSaving(false)
    if (error) {
      setError(`Failed to assign project: ${error.message}`)
      return
    }

    setMessage(`${testerForm.project_name} assigned to ${testerForm.assigned_to}`)
    setTesterForm((prev) => ({ ...prev, project_name: '', project_type: '', assigned_to: '', client: '', notes: '' }))
    loadAllData()
  }

  const handleAddTesterEarning = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    const { error } = await supabase.from('tester_earnings').insert({
      project_name: testerEarningForm.project_name,
      amount_earned: testerEarningForm.amount_earned,
      source: testerEarningForm.source,
      assigned_to_email: testerEarningForm.assigned_to_email.toLowerCase(),
      earned_date: testerEarningForm.earned_date || null,
      notes: testerEarningForm.notes,
    })

    setSaving(false)
    if (error) {
      setError(`Failed to add earning: ${error.message}`)
      return
    }

    setMessage(`₹${testerEarningForm.amount_earned} added for ${testerEarningForm.project_name || 'project'}`)
    setTesterEarningForm((prev) => ({ ...prev, project_name: '', amount_earned: '', source: '', earned_date: '', notes: '' }))
    loadAllData()
  }

  const handleTesterStatusChange = async (project: TesterProject, status: TesterProject['status']) => {
    const { error } = await supabase.from('tester_projects').update({ status }).eq('id', project.id)
    if (!error) {
      setTesterProjects((prev) => prev.map((p) => (p.id === project.id ? { ...p, status } : p)))
    }
  }

  const handleDeleteTesterProject = async (project: TesterProject) => {
    const { error } = await supabase.from('tester_projects').delete().eq('id', project.id)
    if (!error) {
      setTesterProjects((prev) => prev.filter((p) => p.id !== project.id))
      setMessage(`Assignment for ${project.project_name} deleted`)
    }
  }

  const handleDeleteTesterEarning = async (earning: TesterEarning) => {
    const { error } = await supabase.from('tester_earnings').delete().eq('id', earning.id)
    if (!error) {
      setTesterEarnings((prev) => prev.filter((x) => x.id !== earning.id))
      setMessage('Earning record deleted')
    }
  }

  // ============ DEVELOPER HANDLERS ============
  const handleAddDevProject = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    const { error } = await supabase.from('developer_projects').insert({
      developer_email: devProjectForm.developer_email.toLowerCase(),
      title: devProjectForm.title,
      description: devProjectForm.description,
      client: devProjectForm.client,
      amount: devProjectForm.amount,
      status: devProjectForm.status,
      deadline: devProjectForm.deadline || null,
    })

    setSaving(false)
    if (error) {
      setError(`Failed to assign project: ${error.message}`)
      return
    }

    setMessage(`Project "${devProjectForm.title}" assigned to ${devProjectForm.developer_email}`)
    setDevProjectForm((prev) => ({ ...prev, title: '', description: '', client: '', amount: '', deadline: '' }))
    loadAllData()
  }

  const handleAddDevEarning = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    const { error } = await supabase.from('developer_earnings').insert({
      developer_email: devEarningForm.developer_email.toLowerCase(),
      project_title: devEarningForm.project_title,
      amount_earned: devEarningForm.amount_earned,
      paid: devEarningForm.paid,
      paid_at: devEarningForm.paid ? new Date().toISOString() : null,
      description: devEarningForm.description,
    })

    setSaving(false)
    if (error) {
      setError(`Failed to add payment: ${error.message}`)
      return
    }

    setMessage(`₹${devEarningForm.amount_earned} added to ${devEarningForm.developer_email}`)
    setDevEarningForm((prev) => ({ ...prev, project_title: '', amount_earned: '', description: '' }))
    loadAllData()
  }

  const handleToggleDevStatus = async (project: DevProject) => {
    const nextStatus: DevProject['status'] =
      project.status === 'Assigned' ? 'In Progress' : project.status === 'In Progress' ? 'Completed' : 'Assigned'

    const { error } = await supabase.from('developer_projects').update({ status: nextStatus }).eq('id', project.id)
    if (!error) {
      setDevProjects((prev) => prev.map((p) => (p.id === project.id ? { ...p, status: nextStatus } : p)))
    }
  }

  const handleToggleDevPaid = async (earning: DevEarning) => {
    const nextPaid = !earning.paid
    const { error } = await supabase
      .from('developer_earnings')
      .update({ paid: nextPaid, paid_at: nextPaid ? new Date().toISOString() : null })
      .eq('id', earning.id)

    if (!error) {
      setDevEarnings((prev) =>
        prev.map((x) => (x.id === earning.id ? { ...x, paid: nextPaid, paid_at: nextPaid ? new Date().toISOString() : null } : x))
      )
    }
  }

  const handleDeleteDevProject = async (project: DevProject) => {
    const { error } = await supabase.from('developer_projects').delete().eq('id', project.id)
    if (!error) {
      setDevProjects((prev) => prev.filter((p) => p.id !== project.id))
      setMessage(`Project "${project.title}" deleted`)
    }
  }

  const handleDeleteDevEarning = async (earning: DevEarning) => {
    const { error } = await supabase.from('developer_earnings').delete().eq('id', earning.id)
    if (!error) {
      setDevEarnings((prev) => prev.filter((x) => x.id !== earning.id))
      setMessage('Payment record deleted')
    }
  }

  // Edit Dev Project
  const startEditDevProject = (project: DevProject) => {
    setEditingDevProject(project)
    setEditDevProjectForm({
      title: project.title,
      description: project.description,
      client: project.client,
      amount: project.amount,
      status: project.status,
      deadline: project.deadline ? project.deadline.slice(0, 10) : '',
    })
  }

  const handleSaveDevProject = async (e: FormEvent) => {
    e.preventDefault()
    if (!editingDevProject) return
    setSaving(true)
    setError('')
    setMessage('')

    const { error } = await supabase
      .from('developer_projects')
      .update({
        title: editDevProjectForm.title,
        description: editDevProjectForm.description,
        client: editDevProjectForm.client,
        amount: editDevProjectForm.amount,
        status: editDevProjectForm.status,
        deadline: editDevProjectForm.deadline || null,
      })
      .eq('id', editingDevProject.id)

    setSaving(false)
    if (error) {
      setError(`Failed to update project: ${error.message}`)
      return
    }

    setMessage(`Project "${editDevProjectForm.title}" updated`)
    setEditingDevProject(null)
    loadAllData()
  }

  // Edit Dev Earning
  const startEditDevEarning = (earning: DevEarning) => {
    setEditingDevEarning(earning)
    setEditDevEarningForm({
      project_title: earning.project_title,
      amount_earned: earning.amount_earned,
      paid: earning.paid,
      description: earning.description,
    })
  }

  const handleSaveDevEarning = async (e: FormEvent) => {
    e.preventDefault()
    if (!editingDevEarning) return
    setSaving(true)
    setError('')
    setMessage('')

    const { error } = await supabase
      .from('developer_earnings')
      .update({
        project_title: editDevEarningForm.project_title,
        amount_earned: editDevEarningForm.amount_earned,
        paid: editDevEarningForm.paid,
        paid_at: editDevEarningForm.paid ? new Date().toISOString() : null,
        description: editDevEarningForm.description,
      })
      .eq('id', editingDevEarning.id)

    setSaving(false)
    if (error) {
      setError(`Failed to update payment: ${error.message}`)
      return
    }

    setMessage('Payment record updated')
    setEditingDevEarning(null)
    loadAllData()
  }

  // ============ TEAM HANDLERS ============
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
    // Try saving with weeksWins; if the column doesn't exist yet in the DB, retry without it
    let { error } = await supabase.from('teams').upsert(teams)
    if (error) {
      const stripped = teams.map(({ weeksWins, ...rest }) => rest)
      const retry = await supabase.from('teams').upsert(stripped)
      error = retry.error
    }
    setSavingTeams(false)
    if (error) {
      setError(`Failed to save teams: ${error.message}`)
    } else {
      setMessage('Teams & points saved successfully!')
    }
  }

  // ============ RENDER ============
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

  // ============ COMPUTED STATS ============
  const totalOrders = orders.length
  const newOrders = orders.filter((o) => o.status === 'New').length
  const inProgressOrders = orders.filter((o) => o.status === 'In Progress').length
  const completedOrders = orders.filter((o) => o.status === 'Completed').length

  const totalInterviews = interviews.length
  const selectedCandidates = interviews.filter((i) => i.status === 'Selected').length
  const totalHrEarned = hrEarnings.reduce((sum, e) => sum + parseAmount(e.amount_earned), 0)

  const totalClients = clients.length
  const totalCrmEarned = crmEarnings.reduce((sum, e) => sum + parseAmount(e.amount_earned), 0)

  const totalTesterProjects = testerProjects.length
  const totalTesterEarned = testerEarnings.reduce((sum, e) => sum + parseAmount(e.amount_earned), 0)

  const totalDevProjects = devProjects.length
  const totalDevPaid = devEarnings.filter((e) => e.paid).reduce((sum, e) => sum + parseAmount(e.amount_earned), 0)
  const totalDevPending = devEarnings.filter((e) => !e.paid).reduce((sum, e) => sum + parseAmount(e.amount_earned), 0)

  const totalEarnedAll = totalHrEarned + totalCrmEarned + totalTesterEarned + totalDevPaid

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

  // ============ NAV ITEMS ============
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, color: 'text-red-400', active: 'bg-red-600' },
    { id: 'orders', label: 'Orders', icon: Inbox, color: 'text-blue-400', active: 'bg-blue-600' },
    { id: 'hr', label: 'HR Management', icon: UsersRound, color: 'text-red-400', active: 'bg-red-600' },
    { id: 'crm', label: 'CRM Management', icon: Handshake, color: 'text-emerald-400', active: 'bg-emerald-600' },
    { id: 'tester', label: 'Tester Management', icon: Bug, color: 'text-cyan-400', active: 'bg-cyan-600' },
    { id: 'developers', label: 'Developers', icon: Briefcase, color: 'text-purple-400', active: 'bg-purple-600' },
    { id: 'teams', label: 'Team Points', icon: Trophy, color: 'text-amber-400', active: 'bg-amber-600' },
  ] as const

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ============ TOP BAR ============ */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Image src="/brandnest-logo.png" alt="Brandnest logo" width={44} height={44} className="h-9 w-9 shrink-0 rounded-full object-cover shadow-[0_0_30px_rgba(220,38,38,0.35)] sm:h-11 sm:w-11" />
            <div className="min-w-0">
              <p className="truncate text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-red-400 sm:text-[0.65rem] sm:tracking-[0.3em]">Brandnest Admin</p>
              <h1 className="truncate text-base font-black leading-tight text-white sm:text-xl">Full Stack Admin Dashboard</h1>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-2 py-1 sm:px-4 sm:py-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700 text-xs font-black text-white sm:h-8 sm:w-8 sm:text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden leading-tight sm:block">
                <p className="text-sm font-bold text-white">{userName}</p>
                <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-white/50">Admin</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              aria-label="Refresh"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 disabled:opacity-50 sm:px-4"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <Link
              href="/login"
              aria-label="Logout"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 sm:px-4"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
        {/* ============ SIDEBAR ============ */}
        <aside className="lg:w-64 lg:shrink-0">
          <nav className="rounded-3xl border border-white/10 bg-white/[0.03] p-3">
            <p className="hidden px-3 pb-2 pt-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white/40 lg:block">Navigation</p>
            <div className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
              {navItems.map(({ id, label, icon: Icon, color, active }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveSection(id)}
                  className={`flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    activeSection === id
                      ? `${active} text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)]`
                      : 'text-white/65 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${activeSection === id ? 'text-white' : color}`} />
                  {label}
                </button>
              ))}
            </div>
          </nav>

          {/* Quick stats sidebar */}
          <div className="mt-4 rounded-3xl border border-white/10 bg-gradient-to-br from-red-950/40 to-black/40 p-5">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-red-400" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Total Revenue</p>
            </div>
            <p className="mt-2 text-3xl font-black text-white">₹{totalEarnedAll.toLocaleString('en-IN')}</p>
            <p className="mt-1 text-xs text-white/50">Across all departments</p>
            <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">HR</span>
                <span className="font-bold text-red-300">₹{totalHrEarned.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">CRM</span>
                <span className="font-bold text-emerald-300">₹{totalCrmEarned.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Testers</span>
                <span className="font-bold text-cyan-300">₹{totalTesterEarned.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Developers</span>
                <span className="font-bold text-purple-300">₹{totalDevPaid.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ============ MAIN CONTENT ============ */}
        <div className="min-w-0 flex-1">
          {/* Message / Error */}
          {message && (
            <p className="mb-6 rounded-xl border border-green-400/30 bg-green-500/10 px-4 py-3 text-sm text-green-200">
              {message}
            </p>
          )}
          {error && (
            <p className="mb-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}

          {/* ============ OVERVIEW ============ */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Welcome banner */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-red-950/60 via-black/40 to-black/60 p-6 sm:p-8">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-red-600/20 blur-3xl" />
                <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-red-500/10 blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-red-400" />
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-300">Admin Control Center</p>
                  </div>
                  <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                    Welcome back, {userName}!
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
                    Manage orders, HR, CRM, testers, developers, and team performance all from one powerful dashboard.
                  </p>
                </div>
              </div>

              {/* Department stats */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <article className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20 hover:bg-white/[0.06]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition group-hover:scale-110">
                    <Inbox className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-3xl font-black text-white">{totalOrders}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Total Orders</p>
                  <div className="mt-3 flex gap-2 text-xs">
                    <span className="rounded-full bg-blue-500/15 px-2 py-0.5 font-semibold text-blue-300">{newOrders} New</span>
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-semibold text-amber-300">{inProgressOrders} In Progress</span>
                    <span className="rounded-full bg-green-500/15 px-2 py-0.5 font-semibold text-green-300">{completedOrders} Done</span>
                  </div>
                </article>

                <article className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20 hover:bg-white/[0.06]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400 transition group-hover:scale-110">
                    <UsersRound className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-3xl font-black text-white">{totalInterviews}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">HR Interviews</p>
                  <div className="mt-3 flex gap-2 text-xs">
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-semibold text-emerald-300">{selectedCandidates} Selected</span>
                    <span className="rounded-full bg-red-500/15 px-2 py-0.5 font-semibold text-red-300">₹{totalHrEarned.toLocaleString('en-IN')}</span>
                  </div>
                </article>

                <article className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20 hover:bg-white/[0.06]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition group-hover:scale-110">
                    <Handshake className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-3xl font-black text-white">{totalClients}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">CRM Clients</p>
                  <div className="mt-3 flex gap-2 text-xs">
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-semibold text-emerald-300">₹{totalCrmEarned.toLocaleString('en-IN')}</span>
                  </div>
                </article>

                <article className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20 hover:bg-white/[0.06]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 transition group-hover:scale-110">
                    <Bug className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-3xl font-black text-white">{totalTesterProjects}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Tester Projects</p>
                  <div className="mt-3 flex gap-2 text-xs">
                    <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 font-semibold text-cyan-300">₹{totalTesterEarned.toLocaleString('en-IN')}</span>
                  </div>
                </article>
              </div>

              {/* Developer + Team stats */}
              <div className="grid gap-4 lg:grid-cols-2">
                <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-3xl font-black text-white">{totalDevProjects}</p>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Developer Projects</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-300">₹{totalDevPaid.toLocaleString('en-IN')} paid</p>
                      <p className="text-sm font-bold text-amber-300">₹{totalDevPending.toLocaleString('en-IN')} pending</p>
                    </div>
                  </div>
                </article>

                <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                        <Trophy className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-3xl font-black text-white">{totalPoints}</p>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Total Team Points</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-amber-300">{leader === 'Tie' ? 'It\'s a Tie!' : `${leader} Leading`}</p>
                      <p className="text-xs text-white/50">Team 1: {team1Total} · Team 2: {team2Total}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500" style={{ width: `${team1Percent}%` }} />
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500" style={{ width: `${100 - team1Percent}%` }} />
                  </div>
                </article>
              </div>

              {/* Recent orders preview */}
              <section>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Inbox className="h-5 w-5 text-red-400" />
                    <h2 className="text-xl font-black text-white">Recent Orders</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveSection('orders')}
                    className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                  >
                    View All →
                  </button>
                </div>

                {loadingOrders ? (
                  <div className="mt-4 flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] py-12 text-white/60">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin text-red-400" />
                    Loading orders...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] py-12 text-center">
                    <Inbox className="mx-auto h-10 w-10 text-white/30" />
                    <p className="mt-4 text-lg font-semibold text-white/70">No orders yet</p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <article key={order.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-white/20">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-bold text-white">{order.service}</h3>
                              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${orderStatusStyles[order.status]}`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/70">
                              <span className="inline-flex items-center gap-1.5">
                                <UsersRound className="h-3.5 w-3.5 text-red-400" />
                                {order.name}
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5 text-red-400" />
                                {order.email}
                              </span>
                              <span className="font-semibold text-white">{order.price}</span>
                            </div>
                          </div>
                          <span className="text-xs text-white/50">{formatDate(order.created_at)}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* ============ ORDERS ============ */}
          {activeSection === 'orders' && (
            <section>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Inbox className="h-5 w-5 text-red-400" />
                  <h2 className="text-xl font-black text-white">Customer Orders</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/80">
                  {totalOrders} total
                </span>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Total</p>
                  <p className="mt-1 text-2xl font-black text-white">{totalOrders}</p>
                </article>
                <article className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">New</p>
                  <p className="mt-1 text-2xl font-black text-white">{newOrders}</p>
                </article>
                <article className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">In Progress</p>
                  <p className="mt-1 text-2xl font-black text-white">{inProgressOrders}</p>
                </article>
                <article className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-300">Completed</p>
                  <p className="mt-1 text-2xl font-black text-white">{completedOrders}</p>
                </article>
              </div>

              {loadingOrders ? (
                <div className="mt-6 flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] py-20 text-white/60">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin text-red-400" />
                  Loading orders...
                </div>
              ) : orders.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] py-20 text-center">
                  <Inbox className="mx-auto h-10 w-10 text-white/30" />
                  <p className="mt-4 text-lg font-semibold text-white/70">No orders yet</p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {orders.map((order) => (
                    <article key={order.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-bold text-white">{order.service}</h3>
                            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${orderStatusStyles[order.status]}`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-white/80">
                            <span className="inline-flex items-center gap-1.5">
                              <UsersRound className="h-3.5 w-3.5 text-red-400" />
                              {order.name}
                            </span>
                            {order.company && (
                              <span className="inline-flex items-center gap-1.5">
                                <Briefcase className="h-3.5 w-3.5 text-red-400" />
                                {order.company}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1.5">
                              <Mail className="h-3.5 w-3.5 text-red-400" />
                              {order.email}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Phone className="h-3.5 w-3.5 text-red-400" />
                              {order.phone}
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-white/80">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays className="h-3.5 w-3.5 text-red-400" />
                              {formatDate(order.created_at)} at {formatTime(order.created_at)}
                            </span>
                            <span className="font-semibold text-white">
                              {order.price}
                              {order.budget ? ` · Budget: ${order.budget}` : ''}
                            </span>
                          </div>
                          {order.details && (
                            <p className="mt-3 rounded-xl border border-white/5 bg-black/25 px-4 py-3 text-sm leading-6 text-white/85">
                              {order.details}
                            </p>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <select
                            value={order.status}
                            onChange={(e) => handleOrderStatusChange(order.id, e.target.value as Order['status'])}
                            className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm font-semibold text-white outline-none transition focus:border-red-400"
                          >
                            <option value="New">New</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(order)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                            aria-label={`Delete order ${order.service}`}
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

          {/* ============ HR MANAGEMENT ============ */}
          {activeSection === 'hr' && (
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <UsersRound className="h-5 w-5 text-red-400" />
                <h2 className="text-xl font-black text-white">HR Management</h2>
              </div>

              {/* Schedule Interview */}
              <form onSubmit={handleAddInterview} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <div className="flex items-center gap-3">
                  <Plus className="h-5 w-5 text-red-400" />
                  <h3 className="text-lg font-black text-white">Schedule a New Interview</h3>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
                      rows={2}
                      value={interviewForm.notes}
                      onChange={(e) => setInterviewForm((prev) => ({ ...prev, notes: e.target.value }))}
                      placeholder="Interview notes..."
                      className={inputClass}
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 font-bold text-white shadow-[0_20px_60px_rgba(220,38,38,0.3)] transition hover:from-red-500 hover:to-red-400 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ClipboardList className="h-4 w-4" />}
                  {saving ? 'Scheduling...' : 'Schedule Interview'}
                </button>
              </form>

              {/* Assign Candidate */}
              <form onSubmit={handleAddCandidate} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <div className="flex items-center gap-3">
                  <Plus className="h-5 w-5 text-red-400" />
                  <h3 className="text-lg font-black text-white">Assign a Candidate</h3>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
                  <label className="block">
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
                      rows={2}
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
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 font-bold text-white shadow-[0_20px_60px_rgba(220,38,38,0.3)] transition hover:from-red-500 hover:to-red-400 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <UsersRound className="h-4 w-4" />}
                  {saving ? 'Assigning...' : 'Assign Candidate'}
                </button>
              </form>

              {/* Add HR Earning */}
              <form onSubmit={handleAddHrEarning} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <div className="flex items-center gap-3">
                  <Banknote className="h-5 w-5 text-red-400" />
                  <h3 className="text-lg font-black text-white">Add Amount Earned (HR)</h3>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Candidate Name</span>
                    <input
                      type="text"
                      value={hrEarningForm.candidate_name}
                      onChange={(e) => setHrEarningForm((prev) => ({ ...prev, candidate_name: e.target.value }))}
                      placeholder="e.g. Jane Smith"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Project</span>
                    <input
                      type="text"
                      value={hrEarningForm.project}
                      onChange={(e) => setHrEarningForm((prev) => ({ ...prev, project: e.target.value }))}
                      placeholder="e.g. Brandnest Website"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Amount (₹) *</span>
                    <input
                      required
                      type="text"
                      value={hrEarningForm.amount_earned}
                      onChange={(e) => setHrEarningForm((prev) => ({ ...prev, amount_earned: e.target.value }))}
                      placeholder="e.g. 15000"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Source</span>
                    <input
                      type="text"
                      value={hrEarningForm.source}
                      onChange={(e) => setHrEarningForm((prev) => ({ ...prev, source: e.target.value }))}
                      placeholder="e.g. Client Payment"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Assign To Email *</span>
                    <select
                      required
                      value={hrEarningForm.assigned_to_email}
                      onChange={(e) => setHrEarningForm((prev) => ({ ...prev, assigned_to_email: e.target.value }))}
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
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Earned Date</span>
                    <input
                      type="date"
                      value={hrEarningForm.earned_date}
                      onChange={(e) => setHrEarningForm((prev) => ({ ...prev, earned_date: e.target.value }))}
                      className={inputClass}
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-sm font-semibold text-white/75">Notes</span>
                    <textarea
                      rows={2}
                      value={hrEarningForm.notes}
                      onChange={(e) => setHrEarningForm((prev) => ({ ...prev, notes: e.target.value }))}
                      placeholder="Earning notes..."
                      className={inputClass}
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 font-bold text-white shadow-[0_20px_60px_rgba(220,38,38,0.3)] transition hover:from-red-500 hover:to-red-400 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Banknote className="h-4 w-4" />}
                  {saving ? 'Adding...' : 'Add Earning'}
                </button>
              </form>

              {/* Interviews list */}
              <section>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <ClipboardList className="h-5 w-5 text-red-400" />
                    <h3 className="text-lg font-black text-white">All Interviews</h3>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/80">
                    {interviews.length} total
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {interviews.map((interview) => (
                    <article key={interview.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-white/20">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-white">{interview.candidate_name}</h4>
                            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${interviewStatusStyles[interview.status]}`}>
                              {interview.status}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/70">
                            {interview.position && (
                              <span className="inline-flex items-center gap-1.5">
                                <Briefcase className="h-3.5 w-3.5 text-red-400" />
                                {interview.position}
                              </span>
                            )}
                            {interview.candidate_email && (
                              <span className="inline-flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5 text-red-400" />
                                {interview.candidate_email}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays className="h-3.5 w-3.5 text-red-400" />
                              {formatDate(interview.interview_date)}
                              {interview.interview_time && ` at ${interview.interview_time}`}
                            </span>
                          </div>
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
                          <button
                            type="button"
                            onClick={() => handleDeleteInterview(interview)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                            aria-label={`Delete interview for ${interview.candidate_name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* Candidates list */}
              <section>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <UsersRound className="h-5 w-5 text-red-400" />
                    <h3 className="text-lg font-black text-white">Assigned Candidates</h3>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/80">
                    {candidates.length} total
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {candidates.map((candidate) => (
                    <article key={candidate.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-white/20">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-white">{candidate.candidate_name}</h4>
                            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${candidateStatusStyles[candidate.status]}`}>
                              {candidate.status}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/70">
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
                          <button
                            type="button"
                            onClick={() => handleDeleteCandidate(candidate)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                            aria-label={`Delete assignment for ${candidate.candidate_name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* HR Earnings list */}
              <section>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Banknote className="h-5 w-5 text-red-400" />
                    <h3 className="text-lg font-black text-white">HR Earnings</h3>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/80">
                    ₹{totalHrEarned.toLocaleString('en-IN')} total
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {hrEarnings.map((earning) => (
                    <article key={earning.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-white/20">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-white">{earning.candidate_name || 'Candidate'}</h4>
                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/70">
                            {earning.project && (
                              <span className="inline-flex items-center gap-1.5">
                                <LayoutDashboard className="h-3.5 w-3.5 text-red-400" />
                                {earning.project}
                              </span>
                            )}
                            {earning.source && (
                              <span className="inline-flex items-center gap-1.5">
                                <Briefcase className="h-3.5 w-3.5 text-red-400" />
                                {earning.source}
                              </span>
                            )}
                            <span className="text-white/50">{formatDate(earning.earned_date || earning.created_at)}</span>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <p className="text-xl font-black text-white">₹{parseAmount(earning.amount_earned).toLocaleString('en-IN')}</p>
                          <button
                            type="button"
                            onClick={() => handleDeleteHrEarning(earning)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                            aria-label="Delete earning"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* ============ CRM MANAGEMENT ============ */}
          {activeSection === 'crm' && (
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <Handshake className="h-5 w-5 text-emerald-400" />
                <h2 className="text-xl font-black text-white">CRM Management</h2>
              </div>

              {/* Assign Client */}
              <form onSubmit={handleAddClient} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <div className="flex items-center gap-3">
                  <Plus className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-lg font-black text-white">Assign a Client</h3>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
                      rows={2}
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
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3 font-bold text-white shadow-[0_20px_60px_rgba(16,185,129,0.3)] transition hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Handshake className="h-4 w-4" />}
                  {saving ? 'Assigning...' : 'Assign Client'}
                </button>
              </form>

              {/* Add CRM Earning */}
              <form onSubmit={handleAddCrmEarning} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <div className="flex items-center gap-3">
                  <Banknote className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-lg font-black text-white">Add Amount Earned (CRM)</h3>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Client Name</span>
                    <input
                      type="text"
                      value={crmEarningForm.client_name}
                      onChange={(e) => setCrmEarningForm((prev) => ({ ...prev, client_name: e.target.value }))}
                      placeholder="e.g. John Doe"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Project</span>
                    <input
                      type="text"
                      value={crmEarningForm.project}
                      onChange={(e) => setCrmEarningForm((prev) => ({ ...prev, project: e.target.value }))}
                      placeholder="e.g. Brandnest Website"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Amount (₹) *</span>
                    <input
                      required
                      type="text"
                      value={crmEarningForm.amount_earned}
                      onChange={(e) => setCrmEarningForm((prev) => ({ ...prev, amount_earned: e.target.value }))}
                      placeholder="e.g. 15000"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Source</span>
                    <input
                      type="text"
                      value={crmEarningForm.source}
                      onChange={(e) => setCrmEarningForm((prev) => ({ ...prev, source: e.target.value }))}
                      placeholder="e.g. Client Payment"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Assign To Email *</span>
                    <select
                      required
                      value={crmEarningForm.assigned_to_email}
                      onChange={(e) => setCrmEarningForm((prev) => ({ ...prev, assigned_to_email: e.target.value }))}
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
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Earned Date</span>
                    <input
                      type="date"
                      value={crmEarningForm.earned_date}
                      onChange={(e) => setCrmEarningForm((prev) => ({ ...prev, earned_date: e.target.value }))}
                      className={inputClass}
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-sm font-semibold text-white/75">Notes</span>
                    <textarea
                      rows={2}
                      value={crmEarningForm.notes}
                      onChange={(e) => setCrmEarningForm((prev) => ({ ...prev, notes: e.target.value }))}
                      placeholder="Earning notes..."
                      className={inputClass}
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3 font-bold text-white shadow-[0_20px_60px_rgba(16,185,129,0.3)] transition hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Banknote className="h-4 w-4" />}
                  {saving ? 'Adding...' : 'Add Earning'}
                </button>
              </form>

              {/* Clients list */}
              <section>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Handshake className="h-5 w-5 text-emerald-400" />
                    <h3 className="text-lg font-black text-white">Assigned Clients</h3>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/80">
                    {clients.length} total
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {clients.map((client) => (
                    <article key={client.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-white/20">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-white">{client.client_name}</h4>
                            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${clientStatusStyles[client.status]}`}>
                              {client.status}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/70">
                            {client.company && (
                              <span className="inline-flex items-center gap-1.5">
                                <Briefcase className="h-3.5 w-3.5 text-emerald-400" />
                                {client.company}
                              </span>
                            )}
                            {client.assigned_to && (
                              <span className="inline-flex items-center gap-1.5">
                                <UsersRound className="h-3.5 w-3.5 text-emerald-400" />
                                {client.assigned_to}
                              </span>
                            )}
                            {client.project && (
                              <span className="inline-flex items-center gap-1.5">
                                <LayoutDashboard className="h-3.5 w-3.5 text-emerald-400" />
                                {client.project}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <select
                            value={client.status}
                            onChange={(e) => handleClientStatusChange(client, e.target.value as Client['status'])}
                            className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm font-semibold text-white outline-none transition focus:border-emerald-400"
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
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* CRM Earnings list */}
              <section>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Banknote className="h-5 w-5 text-emerald-400" />
                    <h3 className="text-lg font-black text-white">CRM Earnings</h3>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/80">
                    ₹{totalCrmEarned.toLocaleString('en-IN')} total
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {crmEarnings.map((earning) => (
                    <article key={earning.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-white/20">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-white">{earning.client_name || 'Client'}</h4>
                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/70">
                            {earning.project && (
                              <span className="inline-flex items-center gap-1.5">
                                <LayoutDashboard className="h-3.5 w-3.5 text-emerald-400" />
                                {earning.project}
                              </span>
                            )}
                            {earning.source && (
                              <span className="inline-flex items-center gap-1.5">
                                <Briefcase className="h-3.5 w-3.5 text-emerald-400" />
                                {earning.source}
                              </span>
                            )}
                            <span className="text-white/50">{formatDate(earning.earned_date || earning.created_at)}</span>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <p className="text-xl font-black text-white">₹{parseAmount(earning.amount_earned).toLocaleString('en-IN')}</p>
                          <button
                            type="button"
                            onClick={() => handleDeleteCrmEarning(earning)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                            aria-label="Delete earning"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* ============ TESTER MANAGEMENT ============ */}
          {activeSection === 'tester' && (
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <Bug className="h-5 w-5 text-cyan-400" />
                <h2 className="text-xl font-black text-white">Tester Management</h2>
              </div>

              {/* Assign Testing Project */}
              <form onSubmit={handleAddTesterProject} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <div className="flex items-center gap-3">
                  <Plus className="h-5 w-5 text-cyan-400" />
                  <h3 className="text-lg font-black text-white">Assign a Testing Project</h3>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Project Name *</span>
                    <input
                      required
                      type="text"
                      value={testerForm.project_name}
                      onChange={(e) => setTesterForm((prev) => ({ ...prev, project_name: e.target.value }))}
                      placeholder="e.g. Brandnest Website"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Project Type</span>
                    <input
                      type="text"
                      value={testerForm.project_type}
                      onChange={(e) => setTesterForm((prev) => ({ ...prev, project_type: e.target.value }))}
                      placeholder="e.g. Web App / Mobile App"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Assigned To *</span>
                    <input
                      required
                      type="text"
                      value={testerForm.assigned_to}
                      onChange={(e) => setTesterForm((prev) => ({ ...prev, assigned_to: e.target.value }))}
                      placeholder="e.g. Arvind"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Assigned To Email *</span>
                    <select
                      required
                      value={testerForm.assigned_to_email}
                      onChange={(e) => setTesterForm((prev) => ({ ...prev, assigned_to_email: e.target.value }))}
                      className={inputClass}
                    >
                      <option value="">Select Tester...</option>
                      {TESTER_EMAILS.map((email) => (
                        <option key={email} value={email}>
                          {email}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Client</span>
                    <input
                      type="text"
                      value={testerForm.client}
                      onChange={(e) => setTesterForm((prev) => ({ ...prev, client: e.target.value }))}
                      placeholder="e.g. Acme Corp"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Status</span>
                    <select
                      value={testerForm.status}
                      onChange={(e) => setTesterForm((prev) => ({ ...prev, status: e.target.value as TesterProject['status'] }))}
                      className={inputClass}
                    >
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Testing">Testing</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-sm font-semibold text-white/75">Notes</span>
                    <textarea
                      rows={2}
                      value={testerForm.notes}
                      onChange={(e) => setTesterForm((prev) => ({ ...prev, notes: e.target.value }))}
                      placeholder="Assignment notes..."
                      className={inputClass}
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 px-6 py-3 font-bold text-white shadow-[0_20px_60px_rgba(6,182,212,0.3)] transition hover:from-cyan-500 hover:to-cyan-400 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bug className="h-4 w-4" />}
                  {saving ? 'Assigning...' : 'Assign Project'}
                </button>
              </form>

              {/* Add Tester Earning */}
              <form onSubmit={handleAddTesterEarning} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <div className="flex items-center gap-3">
                  <Banknote className="h-5 w-5 text-cyan-400" />
                  <h3 className="text-lg font-black text-white">Add Amount Earned (Tester)</h3>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Project Name</span>
                    <input
                      type="text"
                      value={testerEarningForm.project_name}
                      onChange={(e) => setTesterEarningForm((prev) => ({ ...prev, project_name: e.target.value }))}
                      placeholder="e.g. Brandnest Website"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Amount (₹) *</span>
                    <input
                      required
                      type="text"
                      value={testerEarningForm.amount_earned}
                      onChange={(e) => setTesterEarningForm((prev) => ({ ...prev, amount_earned: e.target.value }))}
                      placeholder="e.g. 15000"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Source</span>
                    <input
                      type="text"
                      value={testerEarningForm.source}
                      onChange={(e) => setTesterEarningForm((prev) => ({ ...prev, source: e.target.value }))}
                      placeholder="e.g. Testing Payment"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Assign To Email *</span>
                    <select
                      required
                      value={testerEarningForm.assigned_to_email}
                      onChange={(e) => setTesterEarningForm((prev) => ({ ...prev, assigned_to_email: e.target.value }))}
                      className={inputClass}
                    >
                      <option value="">Select Tester...</option>
                      {TESTER_EMAILS.map((email) => (
                        <option key={email} value={email}>
                          {email}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Earned Date</span>
                    <input
                      type="date"
                      value={testerEarningForm.earned_date}
                      onChange={(e) => setTesterEarningForm((prev) => ({ ...prev, earned_date: e.target.value }))}
                      className={inputClass}
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-sm font-semibold text-white/75">Notes</span>
                    <textarea
                      rows={2}
                      value={testerEarningForm.notes}
                      onChange={(e) => setTesterEarningForm((prev) => ({ ...prev, notes: e.target.value }))}
                      placeholder="Earning notes..."
                      className={inputClass}
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 px-6 py-3 font-bold text-white shadow-[0_20px_60px_rgba(6,182,212,0.3)] transition hover:from-cyan-500 hover:to-cyan-400 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Banknote className="h-4 w-4" />}
                  {saving ? 'Adding...' : 'Add Earning'}
                </button>
              </form>

              {/* Tester Projects list */}
              <section>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Bug className="h-5 w-5 text-cyan-400" />
                    <h3 className="text-lg font-black text-white">Assigned Testing Projects</h3>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/80">
                    {testerProjects.length} total
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {testerProjects.map((project) => (
                    <article key={project.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-white/20">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-white">{project.project_name}</h4>
                            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${testerStatusStyles[project.status]}`}>
                              {project.status}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/70">
                            {project.project_type && (
                              <span className="inline-flex items-center gap-1.5">
                                <Briefcase className="h-3.5 w-3.5 text-cyan-400" />
                                {project.project_type}
                              </span>
                            )}
                            {project.assigned_to && (
                              <span className="inline-flex items-center gap-1.5">
                                <UsersRound className="h-3.5 w-3.5 text-cyan-400" />
                                {project.assigned_to}
                              </span>
                            )}
                            {project.client && (
                              <span className="inline-flex items-center gap-1.5">
                                <LayoutDashboard className="h-3.5 w-3.5 text-cyan-400" />
                                {project.client}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <select
                            value={project.status}
                            onChange={(e) => handleTesterStatusChange(project, e.target.value as TesterProject['status'])}
                            className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm font-semibold text-white outline-none transition focus:border-cyan-400"
                          >
                            <option value="Assigned">Assigned</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Testing">Testing</option>
                            <option value="Completed">Completed</option>
                            <option value="On Hold">On Hold</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => handleDeleteTesterProject(project)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                            aria-label={`Delete assignment for ${project.project_name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* Tester Earnings list */}
              <section>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Banknote className="h-5 w-5 text-cyan-400" />
                    <h3 className="text-lg font-black text-white">Tester Earnings</h3>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/80">
                    ₹{totalTesterEarned.toLocaleString('en-IN')} total
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {testerEarnings.map((earning) => (
                    <article key={earning.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-white/20">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-white">{earning.project_name || 'Project'}</h4>
                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/70">
                            {earning.source && (
                              <span className="inline-flex items-center gap-1.5">
                                <Briefcase className="h-3.5 w-3.5 text-cyan-400" />
                                {earning.source}
                              </span>
                            )}
                            <span className="text-white/50">{formatDate(earning.earned_date || earning.created_at)}</span>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <p className="text-xl font-black text-white">₹{parseAmount(earning.amount_earned).toLocaleString('en-IN')}</p>
                          <button
                            type="button"
                            onClick={() => handleDeleteTesterEarning(earning)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                            aria-label="Delete earning"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* ============ DEVELOPERS ============ */}
          {activeSection === 'developers' && (
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-purple-400" />
                <h2 className="text-xl font-black text-white">Developer Management</h2>
              </div>

              {/* Assign Dev Project */}
              <form onSubmit={handleAddDevProject} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <div className="flex items-center gap-3">
                  <Plus className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-black text-white">Assign a New Project</h3>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Assigned To Email *</span>
                    <select
                      required
                      value={devProjectForm.developer_email}
                      onChange={(e) => setDevProjectForm((prev) => ({ ...prev, developer_email: e.target.value }))}
                      className={inputClass}
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
                      value={devProjectForm.title}
                      onChange={(e) => setDevProjectForm((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. E-Commerce Website"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Client / Company</span>
                    <input
                      type="text"
                      value={devProjectForm.client}
                      onChange={(e) => setDevProjectForm((prev) => ({ ...prev, client: e.target.value }))}
                      placeholder="e.g. Acme Corp"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Amount</span>
                    <input
                      type="text"
                      value={devProjectForm.amount}
                      onChange={(e) => setDevProjectForm((prev) => ({ ...prev, amount: e.target.value }))}
                      placeholder="e.g. ₹25,000"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Status</span>
                    <select
                      value={devProjectForm.status}
                      onChange={(e) => setDevProjectForm((prev) => ({ ...prev, status: e.target.value as DevProject['status'] }))}
                      className={inputClass}
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
                      value={devProjectForm.deadline}
                      onChange={(e) => setDevProjectForm((prev) => ({ ...prev, deadline: e.target.value }))}
                      className={inputClass}
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-sm font-semibold text-white/75">Description</span>
                    <textarea
                      rows={2}
                      value={devProjectForm.description}
                      onChange={(e) => setDevProjectForm((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Project requirements, scope, notes..."
                      className={inputClass}
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-3 font-bold text-white shadow-[0_20px_60px_rgba(147,51,234,0.3)] transition hover:from-purple-500 hover:to-purple-400 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Briefcase className="h-4 w-4" />}
                  {saving ? 'Assigning...' : 'Assign Project'}
                </button>
              </form>

              {/* Add Dev Payment */}
              <form onSubmit={handleAddDevEarning} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <div className="flex items-center gap-3">
                  <Wallet className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-black text-white">Add Money / Payment to Developer</h3>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Assigned To Email *</span>
                    <select
                      required
                      value={devEarningForm.developer_email}
                      onChange={(e) => setDevEarningForm((prev) => ({ ...prev, developer_email: e.target.value }))}
                      className={inputClass}
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
                      value={devEarningForm.project_title}
                      onChange={(e) => setDevEarningForm((prev) => ({ ...prev, project_title: e.target.value }))}
                      placeholder="e.g. Brandnest Landing Page"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Amount (₹) *</span>
                    <input
                      required
                      type="text"
                      value={devEarningForm.amount_earned}
                      onChange={(e) => setDevEarningForm((prev) => ({ ...prev, amount_earned: e.target.value }))}
                      placeholder="e.g. 15000"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/75">Payment Status</span>
                    <div className="mt-2 flex items-center gap-3">
                      <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={devEarningForm.paid}
                          onChange={(e) => setDevEarningForm((prev) => ({ ...prev, paid: e.target.checked }))}
                          className="h-4 w-4 accent-purple-600"
                        />
                        <span className="text-sm font-semibold text-white/80">Mark as Paid</span>
                      </label>
                    </div>
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-sm font-semibold text-white/75">Description</span>
                    <textarea
                      rows={2}
                      value={devEarningForm.description}
                      onChange={(e) => setDevEarningForm((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Payment notes..."
                      className={inputClass}
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-3 font-bold text-white shadow-[0_20px_60px_rgba(147,51,234,0.3)] transition hover:from-purple-500 hover:to-purple-400 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
                  {saving ? 'Adding...' : 'Add Payment'}
                </button>
              </form>

              {/* Edit Dev Project Modal */}
              {editingDevProject && (
                <form onSubmit={handleSaveDevProject} className="rounded-3xl border border-purple-400/30 bg-purple-500/[0.05] p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Pencil className="h-5 w-5 text-purple-400" />
                      <h3 className="text-lg font-black text-white">Edit Project</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingDevProject(null)}
                      className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-semibold text-white/75">Project Title *</span>
                      <input
                        required
                        type="text"
                        value={editDevProjectForm.title}
                        onChange={(e) => setEditDevProjectForm((prev) => ({ ...prev, title: e.target.value }))}
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-white/75">Client / Company</span>
                      <input
                        type="text"
                        value={editDevProjectForm.client}
                        onChange={(e) => setEditDevProjectForm((prev) => ({ ...prev, client: e.target.value }))}
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-white/75">Amount</span>
                      <input
                        type="text"
                        value={editDevProjectForm.amount}
                        onChange={(e) => setEditDevProjectForm((prev) => ({ ...prev, amount: e.target.value }))}
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-white/75">Status</span>
                      <select
                        value={editDevProjectForm.status}
                        onChange={(e) => setEditDevProjectForm((prev) => ({ ...prev, status: e.target.value as DevProject['status'] }))}
                        className={inputClass}
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
                        value={editDevProjectForm.deadline}
                        onChange={(e) => setEditDevProjectForm((prev) => ({ ...prev, deadline: e.target.value }))}
                        className={inputClass}
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="text-sm font-semibold text-white/75">Description</span>
                      <textarea
                        rows={2}
                        value={editDevProjectForm.description}
                        onChange={(e) => setEditDevProjectForm((prev) => ({ ...prev, description: e.target.value }))}
                        className={inputClass}
                      />
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-3 font-bold text-white shadow-[0_20px_60px_rgba(147,51,234,0.3)] transition hover:from-purple-500 hover:to-purple-400 disabled:opacity-60"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              )}

              {/* Edit Dev Earning Modal */}
              {editingDevEarning && (
                <form onSubmit={handleSaveDevEarning} className="rounded-3xl border border-purple-400/30 bg-purple-500/[0.05] p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Pencil className="h-5 w-5 text-purple-400" />
                      <h3 className="text-lg font-black text-white">Edit Payment</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingDevEarning(null)}
                      className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-semibold text-white/75">Project / Purpose</span>
                      <input
                        type="text"
                        value={editDevEarningForm.project_title}
                        onChange={(e) => setEditDevEarningForm((prev) => ({ ...prev, project_title: e.target.value }))}
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-white/75">Amount (₹) *</span>
                      <input
                        required
                        type="text"
                        value={editDevEarningForm.amount_earned}
                        onChange={(e) => setEditDevEarningForm((prev) => ({ ...prev, amount_earned: e.target.value }))}
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-white/75">Payment Status</span>
                      <div className="mt-2 flex items-center gap-3">
                        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                          <input
                            type="checkbox"
                            checked={editDevEarningForm.paid}
                            onChange={(e) => setEditDevEarningForm((prev) => ({ ...prev, paid: e.target.checked }))}
                            className="h-4 w-4 accent-purple-600"
                          />
                          <span className="text-sm font-semibold text-white/80">Mark as Paid</span>
                        </label>
                      </div>
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="text-sm font-semibold text-white/75">Description</span>
                      <textarea
                        rows={2}
                        value={editDevEarningForm.description}
                        onChange={(e) => setEditDevEarningForm((prev) => ({ ...prev, description: e.target.value }))}
                        className={inputClass}
                      />
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-3 font-bold text-white shadow-[0_20px_60px_rgba(147,51,234,0.3)] transition hover:from-purple-500 hover:to-purple-400 disabled:opacity-60"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              )}

              {/* Dev Projects list */}
              <section>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-purple-400" />
                    <h3 className="text-lg font-black text-white">All Assigned Projects</h3>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/80">
                    {devProjects.length} total
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {devProjects.map((project) => (
                    <article key={project.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-white/20">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-white">{project.title}</h4>
                            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${devStatusStyles[project.status]}`}>
                              {project.status}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/70">
                            <span className="inline-flex items-center gap-1.5">
                              <UserRound className="h-3.5 w-3.5 text-purple-400" />
                              {project.developer_email}
                            </span>
                            {project.client && (
                              <span className="inline-flex items-center gap-1.5">
                                <Briefcase className="h-3.5 w-3.5 text-purple-400" />
                                {project.client}
                              </span>
                            )}
                            <span className="font-semibold text-white">{project.amount}</span>
                            <span className="text-white/50">Deadline: {formatDate(project.deadline)}</span>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleDevStatus(project)}
                            className="rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                          >
                            Next Status →
                          </button>
                          <button
                            type="button"
                            onClick={() => startEditDevProject(project)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10 text-purple-300 transition hover:bg-purple-500/20"
                            aria-label={`Edit ${project.title}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDevProject(project)}
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
              </section>

              {/* Dev Payments list */}
              <section>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Wallet className="h-5 w-5 text-purple-400" />
                    <h3 className="text-lg font-black text-white">All Payment Records</h3>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/80">
                    {devEarnings.length} payments
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {devEarnings.map((earning) => (
                    <article key={earning.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-white/20">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-white">{earning.project_title || 'Project Payment'}</h4>
                            <button
                              type="button"
                              onClick={() => handleToggleDevPaid(earning)}
                              className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold transition ${
                                earning.paid
                                  ? 'border-green-400/30 bg-green-500/15 text-green-300 hover:bg-green-500/25'
                                  : 'border-amber-400/30 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25'
                              }`}
                            >
                              {earning.paid ? 'Paid ✓' : 'Pending — click to mark paid'}
                            </button>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/70">
                            <span className="inline-flex items-center gap-1.5">
                              <UserRound className="h-3.5 w-3.5 text-purple-400" />
                              {earning.developer_email}
                            </span>
                            <span className="text-white/50">{formatDate(earning.created_at)}</span>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <p className="text-xl font-black text-white">₹{parseAmount(earning.amount_earned).toLocaleString('en-IN')}</p>
                          <button
                            type="button"
                            onClick={() => startEditDevEarning(earning)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10 text-purple-300 transition hover:bg-purple-500/20"
                            aria-label="Edit payment"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDevEarning(earning)}
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
              </section>
            </div>
          )}

          {/* ============ TEAM POINTS ============ */}
          {activeSection === 'teams' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-amber-400" />
                  <h2 className="text-xl font-black text-white">Team Points</h2>
                </div>
                <button
                  type="button"
                  onClick={saveTeams}
                  disabled={savingTeams}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-2.5 text-sm font-bold text-white shadow-[0_20px_60px_rgba(245,158,11,0.3)] transition hover:from-amber-500 hover:to-amber-400 disabled:opacity-60"
                >
                  {savingTeams ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trophy className="h-4 w-4" />}
                  {savingTeams ? 'Saving...' : 'Save Teams & Points'}
                </button>
              </div>

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
                  <div className="mx-auto mt-8 max-w-2xl">
                    <div className="flex h-3 overflow-hidden rounded-full bg-white/10">
                      <div className="bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500" style={{ width: `${team1Percent}%` }} />
                      <div className="bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500" style={{ width: `${100 - team1Percent}%` }} />
                    </div>
                    <div className="mt-2 flex justify-between text-xs font-semibold text-white/50">
                      <span>Team 1 · {team1Total} pts</span>
                      <span>Team 2 · {team2Total} pts</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Teams Grid */}
              <div className="grid gap-6 lg:grid-cols-2">
                {sortedTeams.map((team, teamIndex) => {
                  const isTeam1 = teamIndex === 0
                  const teamTotal = team.members.reduce((sum, m) => sum + m.points, 0)
                  const accentText = isTeam1 ? 'text-red-400' : 'text-blue-400'
                  const accentBg = isTeam1 ? 'bg-red-500/10' : 'bg-blue-500/10'
                  const accentBorder = isTeam1 ? 'border-red-500/30' : 'border-blue-500/30'
                  const accentButton = isTeam1 ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'
                  const teamTop = team.members[0]

                  return (
                    <section key={team.id} className={`rounded-3xl border ${accentBorder} bg-white/[0.03] p-6`}>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accentBg} ${accentText}`}>
                            <UsersRound className="h-6 w-6" />
                          </div>
                          <div>
                            <h2 className={`text-2xl font-black uppercase tracking-wide ${accentText}`}>{team.name}</h2>
                            <div className="mt-1 flex items-center gap-2">
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
                                    {member.onBreak && member.breakDuration && (
                                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs font-bold text-yellow-400">
                                        {member.breakDuration} Break
                                      </span>
                                    )}
                                  </p>
                                  <p className="flex flex-wrap items-center gap-1 text-xs text-white/70">
                                    <span>{member.points} pts</span>
                                    {member.onBreak && <BreakCountdown member={member} />}
                                  </p>
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
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </section>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}