'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react'

export default function LoginPage() {
  const [mode, setMode] = useState<'admin' | 'customer'>('admin')
  const isAdmin = mode === 'admin'

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
            Admins can manage incoming orders, while customers can access their project requests and updates.
          </p>
        </section>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8">
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-black/35 p-2">
            <button
              type="button"
              onClick={() => setMode('admin')}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${isAdmin ? 'bg-red-600 text-white shadow-[0_0_35px_rgba(220,38,38,0.35)]' : 'text-white/65 hover:bg-white/8'}`}
            >
              <ShieldCheck className="h-4 w-4" />
              Admin
            </button>
            <button
              type="button"
              onClick={() => setMode('customer')}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${!isAdmin ? 'bg-red-600 text-white shadow-[0_0_35px_rgba(220,38,38,0.35)]' : 'text-white/65 hover:bg-white/8'}`}
            >
              <UserRound className="h-4 w-4" />
              Customer
            </button>
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-300">
              {isAdmin ? 'Admin Access' : 'Customer Access'}
            </p>
            <h2 className="mt-3 text-3xl font-black text-white">
              {isAdmin ? 'Manage Brandnest orders' : 'View your project account'}
            </h2>
          </div>

          <form className="mt-7 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-white/75">Email address</span>
              <input
                type="email"
                placeholder={isAdmin ? 'admin@brandnest.com' : 'you@example.com'}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-red-400"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-white/75">Password</span>
              <input
                type="password"
                placeholder="Enter password"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-red-400"
              />
            </label>
          </form>

          <Link
            href={isAdmin ? '/admin' : '/services'}
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-700 to-red-500 px-5 py-3.5 font-semibold text-white shadow-[0_20px_70px_rgba(220,38,38,0.32)] transition hover:from-red-600 hover:to-red-400"
          >
            <LockKeyhole className="h-4 w-4" />
            {isAdmin ? 'Open Admin Page' : 'Continue as Customer'}
            <ArrowRight className="h-4 w-4" />
          </Link>

          <p className="mt-6 text-center text-sm text-white/60">
            New to Brandnest?{' '}
            <Link href="/signup" className="font-semibold text-red-300 hover:text-red-200">
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}
