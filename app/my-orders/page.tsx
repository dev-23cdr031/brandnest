'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Inbox,
  Loader2,
  Package,
  ShieldCheck,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

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

export default function MyOrdersPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace('/login')
        return
      }

      const email = user.email ?? ''
      setUserEmail(email)
      setChecking(false)

      // Only fetch orders belonging to this user (by email or user_id)
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`user_id.eq.${user.id},email.eq.${email}`)
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
      } else if (data) {
        setOrders(data as Order[])
      }
      setLoading(false)
    }

    load()
  }, [router])

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <div className="flex items-center gap-3 text-white/70">
          <Loader2 className="h-6 w-6 animate-spin text-red-400" />
          Checking your account...
        </div>
      </main>
    )
  }

  const newCount = orders.filter((o) => o.status === 'New').length
  const inProgressCount = orders.filter((o) => o.status === 'In Progress').length
  const completedCount = orders.filter((o) => o.status === 'Completed').length

  const statCards = [
    { label: 'Total Orders', value: orders.length, icon: Package, accent: 'text-red-400 bg-red-500/10' },
    { label: 'New', value: newCount, icon: Inbox, accent: 'text-blue-400 bg-blue-500/10' },
    { label: 'In Progress', value: inProgressCount, icon: ClipboardList, accent: 'text-amber-400 bg-amber-500/10' },
    { label: 'Completed', value: completedCount, icon: CheckCircle2, accent: 'text-green-400 bg-green-500/10' },
  ]

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Image src="/brandnest-logo.png" alt="Brandnest logo" width={44} height={44} className="h-11 w-11 rounded-full object-cover shadow-[0_0_30px_rgba(220,38,38,0.35)]" />
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-red-400">Brandnest</p>
              <h1 className="text-xl font-black leading-tight text-white">My Orders</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Services
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
            >
              Logout
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome + Stats */}
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-red-950/40 via-[#0a0a0a] to-[#0a0a0a] p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-red-300">
            <ShieldCheck className="h-4 w-4" />
            {userEmail}
          </div>
          <h2 className="clear-heading mt-4 text-3xl font-black text-white sm:text-4xl">Your Project Orders</h2>
          <p className="mt-2 max-w-2xl text-white/70">
            Track the status of every service you have ordered. Our team updates the status as your project moves forward.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
        </section>

        {/* Orders list */}
        <section className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-red-400" />
              <h2 className="text-xl font-black text-white">Order History</h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/80">
              {orders.length} total
            </span>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="mt-6 flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] py-20 text-white/60">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-red-400" />
              Loading your orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] py-20 text-center">
              <Inbox className="mx-auto h-10 w-10 text-white/30" />
              <p className="mt-4 text-lg font-semibold text-white/70">No orders yet</p>
              <p className="mt-1 text-sm text-white/45">When you place an order, it will appear here.</p>
              <Link
                href="/services"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:from-red-500 hover:to-red-400"
              >
                Browse Services
              </Link>
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
                          <CalendarDays className="h-3.5 w-3.5 text-red-400" />
                          {formatDate(order.created_at)}
                        </span>
                        <span className="font-semibold text-white">{order.price}</span>
                        {order.budget && <span>Budget: {order.budget}</span>}
                      </div>
                      {order.details && (
                        <p className="mt-3 rounded-xl border border-white/5 bg-black/25 px-4 py-3 text-sm leading-6 text-white/85">
                          {order.details}
                        </p>
                      )}
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