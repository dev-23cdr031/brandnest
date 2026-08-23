import type { ReactNode } from 'react'

type DashboardShellProps = {
  children: ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {children}
    </main>
  )
}