'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Award,
  Flame,
  Rocket,
  Sparkles,
  Star,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'

type Winner = {
  rank: number
  prize: string
  teamName: string
  members: string[]
  emoji: string
}

const winners: Winner[] = [
  { rank: 1, prize: '₹10,000', teamName: 'Yurt', members: ['Sanjay T', 'Santhosh A', 'Miralani R'], emoji: '🥇' },
  { rank: 2, prize: '₹5,000', teamName: 'The Giants', members: ['Vaishnavi M', 'Likitha G'], emoji: '🥈' },
  { rank: 3, prize: '₹3,000', teamName: 'The Fighters', members: ['Samyuktha K', 'Nithin', 'Tarun K'], emoji: '🥉' },
  { rank: 4, prize: '₹1,500', teamName: 'Vector Dubs', members: ['Vijay Tharun', 'Vikas', 'Nishaliya K'], emoji: '🎖️' },
  { rank: 5, prize: '₹1,000', teamName: 'Infiners', members: ['Gokul M', 'Sharan K'], emoji: '🎖️' },
  { rank: 6, prize: 'Certificate of Recognition', teamName: 'Ctrl Freaks', members: ['Ridhesha', 'Ranjith'], emoji: '🎖️' },
  { rank: 7, prize: 'Certificate of Recognition', teamName: 'Trinity', members: ['Prashana S', 'Priyadharshini S', 'Hanshikaa S'], emoji: '🎖️' },
  { rank: 8, prize: 'Certificate of Recognition', teamName: 'Tech Vibe', members: ['Bhavana Sri G', 'Ashwitha R'], emoji: '🎖️' },
  { rank: 9, prize: 'Certificate of Recognition', teamName: 'Algnite', members: ['Nadhin P', 'Rhea R', 'Pranavdhanh C'], emoji: '🎖️' },
  { rank: 10, prize: 'Certificate of Recognition', teamName: 'Brain Spark', members: ['Shavishna A', 'Srinickitha S', 'Shivasakthi M'], emoji: '🎖️' },
]

const particles = Array.from({ length: 20 }, (_, index) => ({
  left: `${(index * 37 + 11) % 100}%`,
  top: `${(index * 53 + 7) % 100}%`,
  size: `${(index % 6) + 2}px`,
  duration: `${(index % 6) + 4}s`,
  delay: `${index % 5}s`,
}))

export default function HackathonWinnersPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const rest = winners.slice(3)

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* ============ BACKGROUND EFFECTS ============ */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/2 top-[-20%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute left-[10%] top-[40%] h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[100px]" />
        <div className="absolute right-[10%] top-[60%] h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="absolute left-1/2 bottom-[-10%] h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-amber-600/5 blur-[120px]" />
      </div>

      {/* Floating particles */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {particles.map((particle, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-amber-400/20"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              animation: `float ${particle.duration} infinite ease-in-out ${particle.delay}`,
            }}
          />
        ))}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
            50% { transform: translateY(-30px) translateX(15px); opacity: 1; }
          }
          @keyframes shine {
            0%, 100% { background-position: 200% center; }
            50% { background-position: -200% center; }
          }
          @keyframes glowPulse {
            0%, 100% { box-shadow: 0 0 60px rgba(251, 191, 36, 0.3); }
            50% { box-shadow: 0 0 100px rgba(251, 191, 36, 0.6); }
          }
          .gold-text {
            background: linear-gradient(90deg, #fbbf24, #fef3c7, #f59e0b, #fbbf24);
            background-size: 200% auto;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shine 4s linear infinite;
          }
          .podium-glow {
            animation: glowPulse 3s ease-in-out infinite;
          }
        `}</style>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        {/* ============ TOP BAR ============ */}
        <header className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
            <Sparkles className="h-4 w-4" />
            2026 Hackathon
          </div>
        </header>

        {/* ============ HERO ============ */}
        <section className="relative mt-14 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.35em] text-amber-300">
            <Trophy className="h-4 w-4" />
            Winners Announcement
          </div>

          <h1 className="gold-text mx-auto mt-8 text-5xl font-black leading-tight sm:text-7xl lg:text-8xl">
            Hackathon 2026
          </h1>
          <p className="mx-auto mt-2 max-w-3xl text-lg font-black text-white sm:text-2xl">
            🏆 The Champions of Innovation
          </p>

          <div className="mx-auto mt-6 flex max-w-xl items-center justify-center gap-6 text-white/70">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-400" />
              <span className="text-2xl font-black text-white">27</span>
              <span className="text-sm">Participants</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" />
              <span className="text-2xl font-black text-white">10</span>
              <span className="text-sm">Winning Teams</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-amber-400" />
              <span className="text-sm">2026</span>
            </div>
          </div>

          <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-500/5 px-4 py-1.5 text-xs font-semibold text-amber-200/80">
              <Zap className="h-3.5 w-3.5" /> Build
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/20 bg-purple-500/5 px-4 py-1.5 text-xs font-semibold text-purple-200/80">
              <Rocket className="h-3.5 w-3.5" /> Compete
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-500/5 px-4 py-1.5 text-xs font-semibold text-blue-200/80">
              <Star className="h-3.5 w-3.5" /> Win
            </span>
          </div>
        </section>

        {/* ============ TOP 3 PODIUM ============ */}
        <section className="mt-20">
          <h2 className="text-center text-3xl font-black text-white sm:text-4xl">
            🏆 Top 3 <span className="gold-text">Champions</span>
          </h2>
          <p className="mt-2 text-center text-white/50">The brightest minds who conquered the challenge</p>

          <div className={`mt-12 grid items-end gap-6 sm:grid-cols-3 ${mounted ? 'opacity-100 transition-opacity duration-700' : 'opacity-0'}`}>
            {/* 2nd place - left */}
            <div className="order-2 sm:order-1">
              <PodiumCard winner={winners[1]} height="h-56" />
            </div>

            {/* 1st place - center (bigger) */}
            <div className="order-1 sm:order-2">
              <div className="podium-glow relative rounded-3xl border-2 border-amber-400/40 bg-gradient-to-b from-amber-950/30 via-black/40 to-black/60 p-6 sm:p-8">
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 text-6xl drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]">👑</div>
                <div className="mt-10 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 text-4xl shadow-[0_0_30px_rgba(251,191,36,0.4)]">🥇</div>
                  <div className="gold-text mt-5 text-4xl font-black sm:text-5xl">1st Prize</div>
                  <h3 className="mt-2 text-3xl font-black text-white sm:text-4xl">{winners[0].teamName}</h3>
                  <p className="mt-1 text-lg font-bold text-amber-300">{winners[0].prize}</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {winners[0].members.map((member) => (
                      <span key={member} className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-sm font-semibold text-amber-200">
                        {member}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mx-auto h-8 w-48 rounded-t-none rounded-b-2xl bg-gradient-to-b from-amber-600/40 to-amber-900/20" />
            </div>

            {/* 3rd place - right */}
            <div className="order-3">
              <PodiumCard winner={winners[2]} height="h-48" />
            </div>
          </div>
        </section>

        {/* ============ RANKS 4-10 ============ */}
        <section className="mt-16">
          <h2 className="text-center text-3xl font-black text-white sm:text-4xl">
            🎉 All <span className="gold-text">Winners</span>
          </h2>
          <p className="mt-2 text-center text-white/50">Congratulations to every team that made it!</p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((winner, index) => (
              <div
                key={winner.rank}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition duration-300 hover:-translate-y-1 hover:border-amber-400/30 hover:bg-white/[0.06] ${
                  mounted ? 'opacity-100 transition-all duration-700' : 'opacity-0'
                }`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-500/5 blur-2xl transition group-hover:bg-amber-500/15" />
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 text-2xl font-black text-white">
                      #{winner.rank}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">{winner.teamName}</h3>
                      <p className="text-sm font-bold text-amber-300/90">{winner.prize}</p>
                    </div>
                  </div>
                  <span className="text-2xl">{winner.emoji}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {winner.members.map((member) => (
                    <span
                      key={member}
                      className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-xs font-semibold text-white/70 transition group-hover:border-amber-400/20 group-hover:text-white/90"
                    >
                      {member}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ FOOTER CTA ============ */}
        <section className="mt-20 rounded-3xl border border-white/10 bg-gradient-to-br from-red-950/30 to-black/40 p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
            <Trophy className="h-8 w-8 text-amber-400" />
          </div>
          <h3 className="mt-6 text-3xl font-black text-white">Congratulations 🎉</h3>
          <p className="mx-auto mt-3 max-w-2xl text-white/60">
            Every team showed incredible creativity and hard work. This is just the beginning — keep building, keep innovating, and keep winning!
          </p>
        </section>
      </div>
    </main>
  )
}

function PodiumCard({ winner, height }: { winner: Winner; height: string }) {
  const isSecond = winner.rank === 2
  const accent = isSecond
    ? { border: 'border-gray-300/40', bg: 'bg-gradient-to-b from-slate-400/10 to-black/40', text: 'text-slate-200', prize: 'text-slate-300', badge: 'bg-slate-400/10', member: 'border-slate-300/20 bg-slate-400/10 text-slate-200' }
    : { border: 'border-orange-400/40', bg: 'bg-gradient-to-b from-orange-500/10 to-black/40', text: 'text-orange-200', prize: 'text-orange-300', badge: 'bg-orange-500/10', member: 'border-orange-400/20 bg-orange-500/10 text-orange-200' }

  return (
    <div className={`${height} flex flex-col justify-end`}>
      <div className={`rounded-3xl border-2 ${accent.border} ${accent.bg} p-6`}>
        <div className="text-center">
          <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${accent.badge} text-3xl`}>
            {winner.rank === 2 ? '🥈' : '🥉'}
          </div>
          <div className={`mt-3 text-2xl font-black ${accent.text}`}>
            {winner.rank === 2 ? '2nd Prize' : '3rd Prize'}
          </div>
          <h3 className="mt-1 text-xl font-black text-white sm:text-2xl">{winner.teamName}</h3>
          <p className={`mt-0.5 font-bold ${accent.prize}`}>{winner.prize}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {winner.members.map((member) => (
              <span key={member} className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${accent.member}`}>
                {member}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className={`mx-auto h-6 w-2/3 rounded-t-none rounded-b-2xl ${isSecond ? 'bg-slate-500/20' : 'bg-orange-600/20'}`} />
    </div>
  )
}
