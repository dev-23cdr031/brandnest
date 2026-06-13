import Image from 'next/image'
import Link from 'next/link'
import { BadgeCheck, Clock3, Inbox, LayoutDashboard, LogIn, UsersRound } from 'lucide-react'

const orders = [
  { name: 'Website order', client: 'New customer', status: 'New', budget: 'From $999' },
  { name: 'Logo design', client: 'Brand inquiry', status: 'Review', budget: 'From $299' },
  { name: 'AI video request', client: 'Marketing lead', status: 'Queued', budget: 'From $499' },
]

const stats = [
  { label: 'Total Orders', value: '24', icon: Inbox },
  { label: 'Active Clients', value: '12', icon: UsersRound },
  { label: 'Completed', value: '18', icon: BadgeCheck },
]

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-4 py-24 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_18%_10%,rgba(220,38,38,0.28),transparent_30%),linear-gradient(135deg,#050505,#160202_52%,#050505)]" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Image src="/brandnest-logo.png" alt="Brandnest logo" width={68} height={68} className="h-16 w-16 rounded-full object-cover shadow-[0_0_45px_rgba(220,38,38,0.4)]" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-300">Brandnest Admin</p>
              <h1 className="mt-1 text-4xl font-black text-white">Order Dashboard</h1>
            </div>
          </div>
          <Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.055] px-5 py-3 text-sm font-semibold text-white backdrop-blur-xl hover:bg-white/10">
            <LogIn className="h-4 w-4" />
            Back to Login
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {stats.map(({ label, value, icon: Icon }) => (
            <article key={label} className="rounded-[1.3rem] border border-white/10 bg-white/[0.055] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              <Icon className="h-7 w-7 text-red-300" />
              <p className="mt-5 text-4xl font-black text-white">{value}</p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.25em] text-white/55">{label}</p>
            </article>
          ))}
        </div>

        <section className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-[0_25px_90px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-8">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-6 w-6 text-red-300" />
            <h2 className="text-2xl font-black text-white">Incoming Orders</h2>
          </div>

          <div className="mt-6 grid gap-4">
            {orders.map((order) => (
              <article key={order.name} className="grid gap-4 rounded-2xl border border-white/10 bg-black/28 p-5 sm:grid-cols-[1.1fr_0.9fr_0.7fr_0.7fr] sm:items-center">
                <div>
                  <p className="text-lg font-bold text-white">{order.name}</p>
                  <p className="mt-1 text-sm text-white/55">{order.client}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Clock3 className="h-4 w-4 text-red-300" />
                  Waiting for admin action
                </div>
                <span className="w-fit rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-100">{order.status}</span>
                <p className="font-semibold text-white">{order.budget}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
