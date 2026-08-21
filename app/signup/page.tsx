'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, BadgeCheck, Loader2, Mail, UserPlus } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    project: '',
  })

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.name,
          phone: form.phone,
          project_need: form.project,
        },
      },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    if (data.user) {
      router.push('/login?signup=success')
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-24 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_15%_20%,rgba(220,38,38,0.32),transparent_28%),radial-gradient(circle_at_88%_16%,rgba(255,255,255,0.09),transparent_24%),linear-gradient(135deg,#050505,#1a0202_48%,#050505)]" />
      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <section>
          <Link href="/" className="inline-flex items-center gap-3">
            <Image src="/brandnest-logo.png" alt="Brandnest logo" width={64} height={64} className="h-16 w-16 rounded-full object-cover shadow-[0_0_45px_rgba(220,38,38,0.4)]" />
            <span className="text-3xl font-black text-white">Brandnest</span>
          </Link>
          <h1 className="mt-10 max-w-2xl bg-gradient-to-r from-white via-red-100 to-red-400 bg-clip-text text-5xl font-black leading-tight text-transparent sm:text-6xl">
            Start your project with Brandnest.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/70">
            Create a customer account and send your project details to the Brandnest admin team.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {['Websites', 'Branding', 'AI Services'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
                <BadgeCheck className="h-5 w-5 text-red-300" />
                <p className="mt-3 text-sm font-semibold text-white">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 text-red-200">
            <UserPlus className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-3xl font-black text-white">Customer Sign Up</h2>
          <p className="mt-2 text-sm leading-6 text-white/62">Fill in your details. Order requests are routed to the admin page.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-white/75">Full name</span>
              <input
                required
                value={form.name}
                onChange={update('name')}
                placeholder="Your name"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-red-400"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-white/75">Email address</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-red-400"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-white/75">Phone number</span>
              <input
                type="tel"
                value={form.phone}
                onChange={update('phone')}
                placeholder="+91 98765 43210"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-red-400"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-white/75">Password</span>
              <input
                required
                type="password"
                value={form.password}
                onChange={update('password')}
                placeholder="Create password"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-red-400"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-white/75">Project need</span>
              <textarea
                value={form.project}
                onChange={update('project')}
                placeholder="Tell us what you want Brandnest to build"
                rows={4}
                className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-red-400"
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
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/60">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-red-300 hover:text-red-200">
              Login
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}