'use client'

import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, useMotionValue, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BrainCircuit,
  Crown,
  Globe2,
  HeartHandshake,
  Layers3,
  Palette,
  Rocket,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trophy,
  Users,
  Wand2,
  Zap,
  Video,
  Megaphone,
  Server,
} from 'lucide-react'

const achievements = [
  'Smart India Hackathon (SIH) Finalist',
  'KPIT Sparkle – Top 23 Global Rank',
  'KPIT Sparkle – World Rank 72',
  'Gen AI Buildathon – 5th Prize Winner',
  'NxtWave Academy Hackathon – 8th Prize Winner',
  'Hyrup Hackathon – Finalist',
  'Gen AI Buildathon – State Level Selected Team',
  'IIT Bhubaneswar Hackathon – 5th Prize Winner',
]

const stats = [
  { value: 16, suffix: '+', label: 'Projects Completed' },
  { value: 8, suffix: '+', label: 'Major Hackathon Achievements' },
  { value: 6, suffix: '', label: 'Expert Team Members' },
  { value: 100, suffix: '%', label: 'Client Satisfaction' },
]

const expertise = [
  { icon: Globe2, label: 'Web Development' },
  { icon: Smartphone, label: 'Mobile App Development' },
  { icon: BrainCircuit, label: 'Artificial Intelligence' },
  { icon: Video, label: 'AI Video Creation' },
  { icon: Palette, label: 'Poster Design' },
  { icon: Wand2, label: 'Logo Design' },
  { icon: Megaphone, label: 'Digital Marketing' },
  { icon: Server, label: 'Web Hosting' },
]

const timeline = [
  { year: '2023', title: 'Started Our Journey' },
  { year: '2024', title: 'National Hackathon Recognition' },
  { year: '2025', title: 'International Competition Achievements' },
  { year: '2026', title: 'Building Powerful Digital Solutions Worldwide' },
]

const trustCards = [
  'Innovative Solutions',
  'Fast Delivery',
  'Affordable Pricing',
  'Dedicated Support',
  'Modern Technology',
  'Proven Results',
]

const principles = [
  {
    icon: Crown,
    title: 'Strategy-first execution',
    description:
      'We combine design, engineering, and AI thinking so every project creates measurable momentum.',
  },
  {
    icon: HeartHandshake,
    title: 'Partnership mindset',
    description:
      'We work closely with clients, keeping the process collaborative, clear, and dependable.',
  },
  {
    icon: Zap,
    title: 'Speed with precision',
    description:
      'Premium delivery means moving quickly without losing the quality, polish, or trust signal.',
  },
]

function useCount(target: number, active: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return

    let frame = 0
    const start = performance.now()
    const duration = 1200

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(target * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, target])

  return count
}

function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const isInView = useInView(ref, { once: true, amount: 0.7 })
  const count = useCount(target, isInView)

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-300">{eyebrow}</p>
      <h2 className="clear-heading mt-4 bg-gradient-to-r from-white via-red-100 to-red-300 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-lg leading-8 text-white/70">{subtitle}</p>
    </div>
  )
}

export function AboutPremiumSection() {
  const heroRef = useRef<HTMLElement | null>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.22])
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const glowX = useTransform(mouseX, [-1, 1], [-42, 42])
  const glowY = useTransform(mouseY, [-1, 1], [-28, 28])

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    mouseX.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1)
    mouseY.set(((event.clientY - bounds.top) / bounds.height) * 2 - 1)
  }

  return (
    <div className="overflow-hidden bg-[#050505] text-white">
      <section
        ref={heroRef}
        onPointerMove={handlePointerMove}
        className="relative left-1/2 flex h-screen min-h-[100svh] w-screen -translate-x-1/2 items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8"
      >
        <motion.div className="absolute inset-0 will-change-transform" style={{ scale: heroScale, y: heroY }}>
          <Image
            src="/team/photos/about-hero-award.jpg"
            alt="Smart India Hackathon award winning team"
            fill
            priority
            sizes="100vw"
            className="about-hero-kenburns object-cover object-center"
          />
        </motion.div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(248,113,113,0.28),transparent_24%),radial-gradient(circle_at_86%_16%,rgba(185,28,28,0.24),transparent_28%),linear-gradient(90deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.1)_42%,rgba(0,0,0,0.38)_100%),linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.12)_46%,rgba(5,5,5,0.82)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(127,29,29,0.18)_0%,transparent_35%,rgba(220,38,38,0.12)_68%,transparent_100%)] mix-blend-screen" />
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.68)]" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#050505] via-[#050505]/62 to-transparent" />

        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ x: glowX, y: glowY }}
        >
          {Array.from({ length: 26 }).map((_, index) => (
            <motion.span
              key={index}
              className="absolute h-1.5 w-1.5 rounded-full bg-red-200/90 shadow-[0_0_24px_rgba(248,113,113,0.95)]"
              style={{ left: `${5 + ((index * 11) % 90)}%`, top: `${8 + ((index * 17) % 82)}%` }}
              animate={{ y: [0, -24, 0], x: [0, 10, -6, 0], opacity: [0.12, 0.95, 0.18] }}
              transition={{ duration: 4.8 + (index % 5), repeat: Infinity, ease: 'easeInOut', delay: index * 0.08 }}
            />
          ))}
          <motion.div
            className="absolute left-[8%] top-[18%] h-52 w-52 rounded-full bg-red-500/25 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.75, 0.35] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute right-[6%] top-[14%] h-[30rem] w-[30rem] rounded-full bg-red-600/20 blur-3xl"
            animate={{ scale: [1, 1.16, 1], opacity: [0.25, 0.66, 0.25] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-[10%] left-[38%] h-36 w-36 rounded-full bg-white/10 blur-2xl"
            animate={{ x: [0, 24, 0], opacity: [0.18, 0.42, 0.18] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl items-end pb-2 sm:pb-3 lg:pb-4">
          <motion.div className="max-w-2xl" initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
            <h1 className="clear-heading max-w-2xl bg-gradient-to-r from-white via-red-100 to-red-300 bg-clip-text text-2xl font-black tracking-tight text-transparent drop-shadow-[0_18px_60px_rgba(0,0,0,0.9)] sm:text-3xl lg:text-4xl xl:text-5xl">
              We Don&apos;t Just Build Projects. We Build Success Stories.
            </h1>

            <p className="mt-2 max-w-xl text-xs leading-5 text-white/82 drop-shadow-[0_12px_35px_rgba(0,0,0,0.75)] sm:text-sm lg:text-base">
              A passionate team of innovators, developers, designers, and AI creators helping businesses transform ideas into digital excellence.
            </p>

            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <Link
                href="#journey"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-xs font-semibold text-white shadow-[0_20px_60px_rgba(220,38,38,0.35)] transition-transform hover:scale-[1.02] hover:from-red-500 hover:to-red-400 sm:text-sm"
              >
                Explore Our Journey
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#achievements"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-black/20 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:border-red-400/50 hover:bg-white/10 sm:text-sm"
              >
                View Achievements
              </Link>
            </div>

          </motion.div>
        </div>
      </section>

      <section id="journey" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.7 }} className="relative">
            <div className="absolute -left-6 top-10 h-28 w-28 rounded-full bg-red-500/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-[0_25px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              <Image src="/team/photos/our-story.jpg" alt="Our story" width={1200} height={1400} className="h-[34rem] w-full rounded-[1.5rem] object-cover" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.7 }}>
            <SectionHeading
              eyebrow="Our Story"
              title="Our Journey"
              subtitle="We started with a simple mission — to create innovative digital solutions that make a real impact. Today, our team delivers web development, mobile applications, AI-powered solutions, branding, and creative marketing services for clients worldwide."
            />

            <div className="mt-10 space-y-5">
              {[
                'A clear mission built around measurable value',
                'A team that blends creativity with technical discipline',
                'A process designed for speed, clarity, and trust',
              ].map((item, index) => (
                <motion.div key={item} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.45, delay: index * 0.08 }}>
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-300">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <p className="text-white/80">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="achievements" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Recognition"
            title="Our Achievements & Recognition"
            subtitle="Turning innovation into success through competitions, hackathons, and national-level challenges."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {achievements.map((item, index) => (
              <motion.article key={item} className="group rounded-[1.6rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl" initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.5, delay: index * 0.08 }} whileHover={{ y: -6, scale: 1.02 }}>
                <motion.div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-200" animate={{ rotate: [0, -8, 8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
                  <Trophy className="h-7 w-7" />
                </motion.div>
                <div className="mt-5 flex items-center gap-2 text-red-300">
                  <Award className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.3em]">Achievement</span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">{item}</h3>
                <p className="mt-3 text-sm leading-6 text-white/68">Premium execution, recognized on competitive stages with tangible outcomes.</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Impact"
            title="Numbers That Define Us"
            subtitle="Our work is measured by what ships, what scales, and what clients keep coming back for."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
            {stats.map((stat) => (
              <motion.div key={stat.label} className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 text-center backdrop-blur-xl" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.45 }}>
                <div className="text-4xl font-black text-white">
                  <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="mt-3 text-sm uppercase tracking-[0.28em] text-white/60">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Expertise"
            title="Our Expertise"
            subtitle="The skills below shape how we build, launch, and grow digital brands."
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {expertise.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.article key={item.label} className="group rounded-[1.5rem] border border-red-500/15 bg-white/5 p-5 shadow-[0_16px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl transition hover:scale-[1.02]" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.4, delay: index * 0.05 }} whileHover={{ y: -6, scale: 1.02 }}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300 transition group-hover:shadow-[0_0_35px_rgba(220,38,38,0.35)]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <motion.div className="text-red-300" animate={{ y: [0, -5, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>
                      <Sparkles className="h-5 w-5" />
                    </motion.div>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-white">{item.label}</h3>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Timeline"
            title="Journey Timeline"
            subtitle="A clear path of growth, recognition, and expansion."
          />

          <div className="mt-14 grid gap-4 lg:grid-cols-4">
            {timeline.map((entry, index) => (
              <motion.div key={entry.year} className="relative rounded-[1.5rem] border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl" initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.45, delay: index * 0.08 }}>
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.6rem] bg-gradient-to-br from-red-600 to-red-400 text-2xl font-black text-white shadow-[0_0_40px_rgba(220,38,38,0.25)]">
                  {entry.year}
                </div>
                <h3 className="mt-5 text-lg font-bold text-white">{entry.title}</h3>
                {index < timeline.length - 1 && <div className="absolute right-[-1.2rem] top-1/2 hidden h-px w-6 bg-red-500/60 lg:block" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Trust"
            title="Why Clients Trust Us"
            subtitle="Premium delivery backed by practical communication and consistent outcomes."
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trustCards.map((item, index) => (
              <motion.div key={item} className="rounded-[1.4rem] border border-red-500/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-[0_15px_70px_rgba(220,38,38,0.08)] backdrop-blur-xl" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.4, delay: index * 0.05 }} whileHover={{ y: -5, boxShadow: '0 0 45px rgba(220,38,38,0.15)' }}>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <p className="mt-5 text-lg font-semibold text-white">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div className="relative" initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.7 }}>
            <div className="absolute -left-10 top-10 h-28 w-28 rounded-full bg-red-500/20 blur-3xl" />
            <div className="absolute -right-8 bottom-8 h-24 w-24 rounded-full bg-white/10 blur-3xl" />
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl">
              <Image src="/team/photos/team-spirit.jpg" alt="Team spirit" width={1200} height={1000} className="h-[28rem] w-full rounded-[1.5rem] object-cover" />
            </div>
            <motion.div className="absolute left-6 top-6 h-14 w-14 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl" animate={{ rotate: [0, 12, 0], y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.div className="absolute right-6 top-20 h-10 w-10 rounded-full bg-red-500/20" animate={{ scale: [1, 1.2, 1], y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }} />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.7 }}>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-300">Team Spirit</p>
            <h2 className="clear-heading mt-4 bg-gradient-to-r from-white via-red-100 to-red-300 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl">
              A Team That Dreams Big
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/75">
              Behind every successful project is a team driven by creativity, innovation, and a commitment to excellence.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {principles.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div key={item.title} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.45, delay: index * 0.08 }}>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/70">{item.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.36),transparent_36%),linear-gradient(135deg,#b91c1c_0%,#7f1d1d_48%,#0b0b0b_100%)] px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:80px_80px]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-white/80">Final Call To Action</p>
          <h2 className="clear-heading mx-auto max-w-4xl bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl lg:text-6xl">
            Ready To Build Something Extraordinary?
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-white/90">
            Let&apos;s transform your vision into a powerful digital experience.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/#contact" className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 font-semibold text-black transition-transform hover:-translate-y-0.5">
              Contact Us
            </Link>
            <Link href="/services" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white/10">
              Start Your Project
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
