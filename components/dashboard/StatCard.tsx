import type { LucideIcon } from 'lucide-react'

type StatCardProps = {
  label: string
  value: string | number
  icon: LucideIcon
  accent?: string
  hint?: string
}

const defaultAccent = 'text-red-400 bg-red-500/10'

export function StatCard({ label, value, icon: Icon, accent = defaultAccent, hint }: StatCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20 hover:bg-white/[0.06]">
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/[0.03] blur-2xl transition group-hover:bg-white/[0.06]" />
      <div className={`relative flex h-11 w-11 items-center justify-center rounded-xl ${accent} transition group-hover:scale-110`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="relative mt-4 text-3xl font-black text-white">{value}</p>
      <p className="relative mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">{label}</p>
      {hint && <p className="relative mt-1 text-xs text-white/40">{hint}</p>}
    </article>
  )
}