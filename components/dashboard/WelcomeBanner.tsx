import { BadgeCheck, Sparkles } from 'lucide-react'

type WelcomeBannerProps = {
  eyebrow: string
  title: string
  description: string
  statValue: string
  statLabel: string
}

export function WelcomeBanner({ eyebrow, title, description, statValue, statLabel }: WelcomeBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-red-950/60 via-black/40 to-black/60 p-6 sm:p-8">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-red-600/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-red-500/10 blur-3xl" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-red-400" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-300">{eyebrow}</p>
          </div>
          <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">{title}</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">{description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-5 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/15 text-red-300">
            <BadgeCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{statValue}</p>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">{statLabel}</p>
          </div>
        </div>
      </div>
    </div>
  )
}