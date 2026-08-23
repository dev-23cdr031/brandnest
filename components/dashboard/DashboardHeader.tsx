import Image from 'next/image'
import Link from 'next/link'
import { LayoutDashboard, LogIn, RefreshCw } from 'lucide-react'

type DashboardHeaderProps = {
  brandLabel: string
  title: string
  userName: string
  roleLabel: string
  onRefresh?: () => void
  refreshing?: boolean
  showAdminLink?: boolean
}

export function DashboardHeader({
  brandLabel,
  title,
  userName,
  roleLabel,
  onRefresh,
  refreshing = false,
  showAdminLink = false,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
        {/* Brand + title */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Image
            src="/brandnest-logo.png"
            alt="Brandnest logo"
            width={44}
            height={44}
            className="h-9 w-9 shrink-0 rounded-full object-cover shadow-[0_0_30px_rgba(220,38,38,0.35)] sm:h-11 sm:w-11"
          />
          <div className="min-w-0">
            <p className="truncate text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-red-400 sm:text-[0.65rem] sm:tracking-[0.3em]">
              {brandLabel}
            </p>
            <h1 className="truncate text-base font-black leading-tight text-white sm:text-xl">{title}</h1>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          {/* User chip - name always visible, role on desktop */}
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-2 py-1 sm:px-4 sm:py-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700 text-xs font-black text-white sm:h-8 sm:w-8 sm:text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 leading-tight">
              <p className="max-w-[80px] truncate text-xs font-bold text-white sm:max-w-none sm:text-sm">{userName}</p>
              <p className="hidden text-[0.65rem] font-semibold uppercase tracking-wider text-white/50 sm:block">{roleLabel}</p>
            </div>
          </div>

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              aria-label="Refresh"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 disabled:opacity-50 sm:px-4"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          )}

          {showAdminLink && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-2.5 py-2 text-sm font-semibold text-purple-300 transition hover:bg-purple-500/20 sm:px-4"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Admin Dashboard</span>
            </Link>
          )}

          <Link
            href="/login"
            aria-label="Logout"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 sm:px-4"
          >
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Link>
        </div>
      </div>
    </header>
  )
}