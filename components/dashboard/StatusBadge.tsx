'use client'

type StatusBadgeProps = {
  status: string
  className?: string
}

const statusColorMap: Record<string, string> = {
  // Common
  Assigned: 'bg-sky-500/10 text-sky-300 border-sky-400/30',
  'In Progress': 'bg-amber-500/10 text-amber-300 border-amber-400/30',
  Completed: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/30',
  'On Hold': 'bg-violet-500/10 text-violet-300 border-violet-400/30',
  New: 'bg-sky-500/10 text-sky-300 border-sky-400/30',
  Testing: 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-400/30',

  // HR
  Scheduled: 'bg-sky-500/10 text-sky-300 border-sky-400/30',
  Rejected: 'bg-rose-500/10 text-rose-300 border-rose-400/30',
  Selected: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/30',

  // Developer
  Paid: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/30',
  Pending: 'bg-amber-500/10 text-amber-300 border-amber-400/30',
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const color = statusColorMap[status] ?? 'bg-white/5 text-white/70 border-white/15'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${color} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  )
}