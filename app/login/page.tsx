'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { ArrowRight, Loader2, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getRole, getDashboardPath } from '@/lib/roles'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const signupSuccess = searchParams.get('signup') === 'success'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    if (data.user) {
      // Dynamically determine the user's role and redirect to their dashboard
      const role = getRole(data.user.email)
      const dashboardPath = getDashboardPath(data.user.email)
      router.push(dashboardPath)
    }
  }

  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15 text-red-400">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-300">Secure Access</p>
          <h2 className="text-2xl font-black text-white">Sign in to Brandnest</h2>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-white/60">
        Enter your credentials and we'll automatically route you to your role's dashboard — whether you're an admin, HR manager, CRM manager, tester, developer, or customer.
      </p>

      {signupSuccess && (
        <p className="mt-5 rounded-xl border border-green-400/30 bg-green-500/10 px-4 py-3 text-sm text-green-200">
          Account created successfully! Please log in.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold text-white/75">Email address</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-red-400"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-white/75">Password</span>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-red-400"
          />
        </label>

        {error && (
          <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-700 to-red-500 px-5 py-3.5 font-semibold text-white shadow-[0_20px_70px_rgba(220,38,38,0.32)] transition hover:from-red-600 hover:to-red-400 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}
          {loading ? 'Signing In...' : 'Sign In'}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-red-400" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Role-based access</p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-white/60 sm:grid-cols-3">
          <span className="rounded-lg bg-white/[0.05] px-2 py-1.5 text-center font-semibold">👑 Admin</span>
          <span className="rounded-lg bg-white/[0.05] px-2 py-1.5 text-center font-semibold">👥 HR Manager</span>
          <span className="rounded-lg bg-white/[0.05] px-2 py-1.5 text-center font-semibold">🤝 CRM Manager</span>
          <span className="rounded-lg bg-white/[0.05] px-2 py-1.5 text-center font-semibold">🐛 Tester</span>
          <span className="rounded-lg bg-white/[0.05] px-2 py-1.5 text-center font-semibold">💻 Developer</span>
          <span className="rounded-lg bg-white/[0.05] px-2 py-1.5 text-center font-semibold">🛒 Customer</span>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-white/60">
        New to Brandnest?{' '}
        <Link href="/signup" className="font-semibold text-red-300 hover:text-red-200">
          Create an account
        </Link>
      </p>
    </section>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-4 py-24 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_20%_10%,rgba(220,38,38,0.34),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(127,29,29,0.28),transparent_28%),linear-gradient(135deg,#050505_0%,#180202_48%,#050505_100%)]" />
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-12rem)] max-w-6xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <section>
          <Link href="/" className="inline-flex items-center gap-3">
            <Image src="/brandnest-logo.png" alt="Brandnest logo" width={64} height={64} className="h-16 w-16 rounded-full object-cover shadow-[0_0_45px_rgba(220,38,38,0.4)]" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-300">Brandnest</p>
              <h1 className="text-3xl font-black text-white">Secure Login</h1>
            </div>
          </Link>

          <h2 className="mt-10 max-w-2xl bg-gradient-to-r from-white via-red-100 to-red-400 bg-clip-text text-5xl font-black leading-tight text-transparent sm:text-6xl">
            Welcome back to your freelance sanctuary.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/70">
            One login for everyone. We automatically detect your role and route you to the right dashboard — admins manage orders, HR managers track candidates, CRM managers handle clients, testers manage projects, developers track earnings, and customers view their orders.
          </p>
        </section>

        <Suspense fallback={<div className="text-white/60">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  )
}