'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  BadgeCheck,
  Briefcase,
  CalendarDays,
  Clock3,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogIn,
  Mail,
  Phone,
  RefreshCw,
  Trophy,
  UsersRound,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

const ADMIN_EMAIL = 'devdharrshans.23csd@kongu.edu'

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

const statusStyles: Record<Order['status'], string> = {
  New: 'bg-blue-500/15 text-blue-300 border-blue-400/30',
  'In Progress': 'bg-amber-500/15 text-amber-300 border-amber-400/30',
  Completed: 'bg-green-500/15 text-green-300 border-green-400/30',
}

function formatDate(iso: string) {
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

export default function AdminPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

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

  const fetchOrders = async () => {
    setLoadingOrders(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setOrders(data as Order[])
    }
    setLoadingOrders(false)
  }

  useEffect(() => {
    if (authorized) {
      fetchOrders()
    }
  }, [authorized])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchOrders()
    setRefreshing(false)
  }

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
    if (!error) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
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

  const totalOrders = orders.length
  const newOrders = orders.filter((o) => o.status === 'New').length
  const inProgress = orders.filter((o) => o.status === 'In Progress').length
  const completed = orders.filter((o) => o.status === 'Completed').length

  const statCards = [
    { label: 'Total Orders', value: totalOrders, icon: Inbox, accent: 'text-red-400 bg-red-500/10' },
    { label: 'New Orders', value: newOrders, icon: Clock3, accent: 'text-blue-400 bg-blue-500/10' },
    { label: 'In Progress', value: inProgress, icon: Briefcase, accent: 'text-amber-400 bg-amber-500/10' },
    { label: 'Completed', value: completed, icon: BadgeCheck, accent: 'text-green-400 bg-green-500/10' },
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
              <h1 className="text-xl font-black leading-tight text-white">Order Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/teams"
              className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/20"
            >
              <Trophy className="h-4 w-4" />
              Teams
            </Link>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
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

        {/* Orders */}
        <section className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-5 w-5 text-red-400" />
              <h2 className="text-xl font-black text-white">Customer Orders</h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/80">
              {totalOrders} total
            </span>
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
              <p className="mt-1 text-sm text-white/45">Customer orders will appear here.</p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {orders.map((order) => (
                <article key={order.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold text-white">{order.service}</h3>
                        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyles[order.status]}`}>
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
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                        className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm font-semibold text-white outline-none transition focus:border-red-400"
                      >
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}