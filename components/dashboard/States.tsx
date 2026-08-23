import type { LucideIcon } from 'lucide-react'
import { Loader2 } from 'lucide-react'

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description?: string
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] py-20 text-center">
      <Icon className="mx-auto h-10 w-10 text-white/30" />
      <p className="mt-4 text-lg font-semibold text-white/70">{title}</p>
      {description && <p className="mt-1 text-sm text-white/45">{description}</p>}
    </div>
  )
}

type LoadingStateProps = {
  label?: string
}

export function LoadingState({ label = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="mt-6 flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] py-20 text-white/60">
      <Loader2 className="mr-2 h-5 w-5 animate-spin text-red-400" />
      {label}
    </div>
  )
}