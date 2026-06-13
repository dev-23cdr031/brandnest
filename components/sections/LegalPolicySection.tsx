'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  BadgeDollarSign,
  BadgeCheck,
  Cookie,
  FileCheck2,
  Fingerprint,
  BarChart3,
  Headphones,
  LockKeyhole,
  Mail,
  MailQuestion,
  Phone,
  Scale,
  ScrollText,
  Settings2,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  SlidersHorizontal,
  UserRound,
  XCircle,
  Zap,
} from 'lucide-react'

type LegalIconName =
  | 'bar-chart'
  | 'badge-dollar'
  | 'cookie'
  | 'file-check'
  | 'headphones'
  | 'lock'
  | 'mail'
  | 'mail-question'
  | 'scale'
  | 'settings'
  | 'shield'
  | 'shield-alert'
  | 'sliders'
  | 'user'
  | 'x-circle'
  | 'zap'

type LegalSection = {
  id: string
  title: string
  body?: string
  items?: readonly string[]
  icon?: LegalIconName
}

export type LegalPage = {
  eyebrow: string
  title: string
  subtitle: string
  updated?: string
  accent: 'privacy' | 'terms' | 'cookies'
  sections: readonly LegalSection[]
  contact?: {
    email?: string
    phone?: string
  }
}

const accentIcon = {
  privacy: ShieldCheck,
  terms: Scale,
  cookies: Cookie,
}

const legalIcons: Record<LegalIconName, typeof ShieldCheck> = {
  'bar-chart': BarChart3,
  'badge-dollar': BadgeDollarSign,
  cookie: Cookie,
  'file-check': FileCheck2,
  headphones: Headphones,
  lock: LockKeyhole,
  mail: Mail,
  'mail-question': MailQuestion,
  scale: Scale,
  settings: Settings2,
  shield: ShieldCheck,
  'shield-alert': ShieldAlert,
  sliders: SlidersHorizontal,
  user: UserRound,
  'x-circle': XCircle,
  zap: Zap,
}

const accentCopy = {
  privacy: 'Data security, transparency, and responsible communication.',
  terms: 'Clear project expectations for professional digital delivery.',
  cookies: 'Simple controls for analytics, preferences, and site performance.',
}

const fadeUp = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.65 },
}

function FloatingLegalIcons() {
  const icons = [LockKeyhole, FileCheck2, Fingerprint, ScrollText, BadgeCheck]

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {icons.map((Icon, index) => (
        <motion.div
          key={index}
          className="absolute hidden h-14 w-14 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-red-100 shadow-[0_20px_80px_rgba(220,38,38,0.2)] backdrop-blur-xl md:flex"
          style={{
            left: `${10 + index * 19}%`,
            top: `${22 + ((index * 17) % 46)}%`,
          }}
          animate={{ y: [0, -18, 0], rotate: [0, index % 2 ? -5 : 5, 0] }}
          transition={{ duration: 5 + index, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Icon className="h-6 w-6" />
        </motion.div>
      ))}
    </div>
  )
}

export function LegalPolicySection({ page }: { page: LegalPage }) {
  const HeroIcon = accentIcon[page.accent]

  return (
    <div className="relative overflow-hidden bg-[#050505] text-white">
      <section className="relative flex min-h-[78vh] items-center overflow-hidden px-4 pt-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(220,38,38,0.42),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.12),transparent_24%),linear-gradient(135deg,#050505_0%,#111111_46%,#050505_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.1)_1px,transparent_1px)] bg-[size:74px_74px] opacity-30" />
        <FloatingLegalIcons />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 py-20 lg:grid-cols-[1fr_0.72fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-red-300/25 bg-white/[0.07] px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-red-100 backdrop-blur-xl">
              <Sparkles className="h-4 w-4" />
              {page.eyebrow}
            </span>
            <h1 className="mt-7 text-5xl font-semibold leading-tight tracking-normal text-white md:text-7xl">
              {page.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68 md:text-xl">
              {page.subtitle}
            </p>
            {page.updated && (
              <p className="mt-5 inline-flex rounded-full border border-white/12 bg-black/30 px-4 py-2 text-sm font-semibold text-white/72 backdrop-blur">
                Last updated: {page.updated}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, x: 28 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="rounded-lg border border-white/12 bg-white/[0.07] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
          >
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-lg bg-red-600 text-white shadow-[0_0_60px_rgba(220,38,38,0.5)]">
              <HeroIcon className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Policy Summary</h2>
            <p className="mt-4 text-sm leading-7 text-white/62">{accentCopy[page.accent]}</p>
            <div className="mt-8 grid gap-3">
              {page.sections.slice(0, 4).map((section) => (
                <Link
                  key={section.id}
                  href={`#${section.id}`}
                  className="group flex items-center justify-between rounded-lg border border-white/10 bg-black/28 px-4 py-3 text-sm font-semibold text-white/72 transition hover:border-red-300/30 hover:bg-red-600/14 hover:text-white"
                >
                  {section.title}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="sticky top-16 z-20 border-y border-white/10 bg-black/70 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto">
          {page.sections.map((section) => (
            <Link
              key={section.id}
              href={`#${section.id}`}
              className="shrink-0 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white/62 transition hover:border-red-300/40 hover:text-red-100"
            >
              {section.title}
            </Link>
          ))}
        </nav>
      </section>

      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-red-950/22 to-transparent" />
        <div className="relative mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          {page.sections.map((section, index) => {
            const Icon = section.icon ? legalIcons[section.icon] : ShieldCheck

            return (
              <motion.article
                key={section.id}
                id={section.id}
                {...fadeUp}
                transition={{ duration: 0.65, delay: index * 0.04 }}
                className="scroll-mt-36 rounded-lg border border-white/12 bg-white/[0.06] p-6 shadow-[0_26px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:p-8"
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-600 text-white shadow-[0_0_42px_rgba(220,38,38,0.42)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-semibold tracking-normal text-white">{section.title}</h2>
                </div>
                {section.body && <p className="text-sm leading-7 text-white/64 md:text-base">{section.body}</p>}
                {section.items && (
                  <div className="mt-5 grid gap-3">
                    {section.items.map((entry) => (
                      <div key={entry} className="flex items-start gap-3 rounded-lg border border-white/10 bg-black/26 p-4">
                        <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
                        <span className="text-sm leading-6 text-white/70">{entry}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.article>
            )
          })}
        </div>
      </section>

      {page.contact && (
        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp}
            className="mx-auto max-w-7xl overflow-hidden rounded-lg border border-red-300/18 bg-white p-8 text-black md:p-12"
          >
            <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                  Contact
                </span>
                <h2 className="mt-6 text-3xl font-semibold tracking-normal text-black md:text-5xl">Questions about this policy?</h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-black/62">
                  Reach out for privacy, legal, or cookie-related questions and our team will respond as soon as possible.
                </p>
              </div>
              <div className="grid gap-3">
                {page.contact.email && (
                  <a href={`mailto:${page.contact.email}`} className="flex items-center gap-3 rounded-lg border border-black/10 bg-black px-5 py-4 text-sm font-bold text-white transition hover:bg-red-700">
                    <Mail className="h-4 w-4" />
                    {page.contact.email}
                  </a>
                )}
                {page.contact.phone && (
                  <a href={`tel:${page.contact.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 rounded-lg border border-black/10 bg-red-600 px-5 py-4 text-sm font-bold text-white transition hover:bg-red-500">
                    <Phone className="h-4 w-4" />
                    {page.contact.phone}
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </section>
      )}
    </div>
  )
}
