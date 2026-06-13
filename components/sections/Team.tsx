'use client'

import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Crown,
  Globe2,
  Lightbulb,
  Mail,
  Palette,
  Rocket,
  Sparkles,
  Users,
} from 'lucide-react'

const teamMembers = [
  {
    name: 'DR.R.THANGARAJAN',
    role: 'Advisor',
    title: 'Senior Technical Advisor',
    skills: ['Mentorship', 'Technical Guidance', 'Innovation Strategy'],
    bio: 'Guiding the team with practical experience, clear direction, and strong technical judgment.',
    email: 'rt.cse@kongu.edu',
    linkedin: 'https://www.linkedin.com/in/thangarajan-ramasamy-thangs68/',
    image: '/team/photos/team-mentor.png',
    accent: 'from-white to-red-300',
  },
  {
    name: 'Dev Dharrshan S',
    role: 'CEO',
    title: 'Head of Innovation & Technology',
    age: 22,
    skills: ['Web Development', 'AI Solutions', 'Project Management'],
    bio: 'Leading innovative digital projects and transforming ideas into impactful solutions.',
    email: 'devdharrshan421@gmail.com',
    linkedin: 'https://www.linkedin.com/in/devdharrshans/',
    image: '/team/photos/dev-dharrshan-s.jpg',
    accent: 'from-red-500 to-white',
  },
  {
    name: 'Avaneesh R',
    role: 'CTO',
    title: 'Lead Mobile Application Architect',
    age: 22,
    skills: ['Android Development', 'Flutter', 'API Integration'],
    bio: 'Passionate about building high-performance mobile applications.',
    email: 'avaneeshr.23csd@kongu.edu',
    linkedin: 'https://www.linkedin.com/in/avaneesh-ravi-7387062a6/',
    image: '/team/photos/avaneesh-r.jpg',
    accent: 'from-red-400 to-zinc-100',
  },
  {
    name: 'Arvind',
    role: 'CDO',
    title: 'Head of UI/UX & Product Design',
    age: 22,
    skills: ['Figma', 'UI Design', 'User Experience'],
    bio: 'Creating intuitive and visually appealing digital experiences.',
    email: 'arvindr.23cse@kongu.edu',
    linkedin: 'https://www.linkedin.com/in/arvindravi05/',
    image: '/team/photos/arvind-r.jpg',
    accent: 'from-white to-red-300',
  },
  {
    name: 'Karupuchaamy Aishwarya',
    role: 'CCO',
    title: 'Brand Strategy & Creative Director',
    age: 22,
    skills: ['Branding', 'Poster Design', 'Logo Design'],
    bio: 'Building memorable brand identities through creative design.',
    email: 'karuppuchamyaishwarya.22cse@kongu.edu',
    linkedin: 'https://www.linkedin.com/in/aishwarya-karuppuchamy/',
    image: '/team/photos/karupachamy-aishwarya.jpg',
    accent: 'from-red-500 to-rose-100',
  },
  {
    name: 'Anusree D',
    role: 'CAIO',
    title: 'Head of AI Research & Automation',
    age: 22,
    skills: ['Generative AI', 'Automation', 'Prompt Engineering'],
    bio: 'Developing intelligent AI-powered solutions for modern businesses.',
    email: 'anusreed.23csd@kongu.edu',
    linkedin: 'https://www.linkedin.com/in/anu-sree-974ab6370/',
    image: '/team/photos/anusree-d.jpg',
    accent: 'from-red-300 to-white',
  },
  {
    name: 'Divya Dharshini S',
    role: 'CMO',
    title: 'Head of Digital Growth & Client Relations',
    age: 22,
    skills: ['SEO', 'Social Media Marketing', 'Content Strategy'],
    bio: 'Helping brands grow through data-driven marketing strategies.',
    email: 'divyadharshinis.23csd@kongu.edu',
    linkedin: 'https://www.linkedin.com/in/divyadharshini-subramanian-16a447370/',
    image: '/team/photos/divya-dharshini.jpg',
    accent: 'from-red-500 to-zinc-50',
  },
]

const cultureCards = [
  {
    title: 'Teamwork',
    text: 'Disciplined collaboration across strategy, design, engineering, and launch.',
    icon: Users,
  },
  {
    title: 'Innovation',
    text: 'We test bold ideas quickly and turn the strongest ones into real business value.',
    icon: Lightbulb,
  },
  {
    title: 'Creativity',
    text: 'Every interface, campaign, and brand moment is shaped to feel memorable.',
    icon: Palette,
  },
  {
    title: 'Leadership',
    text: 'Clear ownership, confident communication, and high standards from day one.',
    icon: Crown,
  },
]

const clientLove = [
  'Fast Delivery',
  'Professional Communication',
  'Creative Solutions',
  'Affordable Pricing',
  'Modern Technologies',
  'Long-Term Support',
]

const counters = [
  { value: 7, suffix: '', label: 'Core Specialists' },
  { value: 18, suffix: '+', label: 'Skill Domains' },
  { value: 100, suffix: '%', label: 'Team Energy' },
]

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const inView = useInView(ref, { once: true, amount: 0.7 })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return

    const start = performance.now()
    const duration = 1300
    let frame = 0

    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(value * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, value])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <motion.div
      className="mx-auto max-w-3xl text-center"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-300 sm:text-sm">{eyebrow}</p>
      <h2 className="clear-heading mt-4 bg-gradient-to-r from-white via-red-100 to-red-300 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-8 text-white/70 sm:text-lg">{subtitle}</p>
    </motion.div>
  )
}

function FloatingParticles({ reactiveX, reactiveY }: { reactiveX?: MotionValue<number>; reactiveY?: MotionValue<number> }) {
  return (
    <motion.div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={{ x: reactiveX, y: reactiveY }}>
      {Array.from({ length: 28 }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full bg-red-300/70 shadow-[0_0_24px_rgba(248,113,113,0.85)]"
          style={{
            left: `${4 + ((index * 11) % 92)}%`,
            top: `${5 + ((index * 17) % 88)}%`,
            width: `${3 + (index % 3) * 2}px`,
            height: `${3 + (index % 3) * 2}px`,
          }}
          animate={{
            x: [0, index % 2 ? 14 : -14, 0],
            y: [0, -22 - (index % 5) * 4, 0],
            opacity: [0.18, 0.9, 0.18],
            scale: [1, 1.45, 1],
          }}
          transition={{ duration: 4 + (index % 6), repeat: Infinity, ease: 'easeInOut', delay: index * 0.08 }}
        />
      ))}
    </motion.div>
  )
}

function TeamCard({ member, index }: { member: (typeof teamMembers)[number]; index: number }) {
  return (
    <motion.article
      className="group relative overflow-hidden rounded-[1.4rem] border border-red-500/20 bg-white/[0.055] p-3 shadow-[0_24px_90px_rgba(0,0,0,0.34)] backdrop-blur-2xl"
      initial={{ opacity: 0, y: 38, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: 'easeOut' }}
      whileHover={{ y: -12, scale: 1.015 }}
    >
      <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-red-300 to-transparent" />
        <div className="absolute -right-12 top-16 h-32 w-32 rounded-full bg-red-500/25 blur-3xl" />
        <div className="absolute -bottom-10 left-8 h-28 w-28 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative overflow-hidden rounded-[1rem] border border-white/10 bg-black/50">
        <Image
          src={member.image}
          alt={`${member.name} professional portrait`}
          width={800}
          height={920}
          className="h-80 w-full object-cover transition duration-700 group-hover:scale-110 sm:h-96 lg:h-80 xl:h-96"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/12 to-transparent" />
        {'age' in member && member.age ? (
          <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md">
            Age {member.age}
          </div>
        ) : null}
        <div className="absolute right-4 top-4 rounded-full border border-red-300/40 bg-red-600/90 px-4 py-1.5 text-sm font-black tracking-[0.18em] text-white shadow-[0_8px_30px_rgba(220,38,38,0.45)] backdrop-blur-md">
          {member.role}
        </div>
      </div>

      <div className="relative px-3 pb-3 pt-5">
        <div className={`h-1 w-20 rounded-full bg-gradient-to-r ${member.accent}`} />
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black leading-tight text-white">{member.name}</h3>
            <p className="mt-2 text-sm font-bold leading-6 text-red-300">{member.title}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <a
              href={member.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label={`${member.name} LinkedIn`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white transition hover:border-red-300/50 hover:bg-red-500/20 hover:text-white"
            >
              <Globe2 className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${member.email}`}
              aria-label={`Email ${member.name}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white transition hover:border-red-300/50 hover:bg-red-500/20 hover:text-white"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        <p className="mt-4 min-h-14 text-sm leading-6 text-white/70">{member.bio}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {member.skills.map((skill, skillIndex) => (
            <motion.span
              key={skill}
              className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-100"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.18 + skillIndex * 0.08 }}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.article>
  )
}

export function TeamSection() {
  const heroRef = useRef<HTMLElement | null>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const cursorX = useSpring(mouseX, { stiffness: 120, damping: 24 })
  const cursorY = useSpring(mouseY, { stiffness: 120, damping: 24 })
  const reactiveX = useTransform(cursorX, (value) => (value - 0.5) * 38)
  const reactiveY = useTransform(cursorY, (value) => (value - 0.5) * 26)
  const glowX = useTransform(cursorX, (value) => `${value * 100}%`)
  const glowY = useTransform(cursorY, (value) => `${value * 100}%`)
  const heroGlow = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(248,113,113,0.28), transparent 26%)`,
  )
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 135])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.16])

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    mouseX.set((event.clientX - bounds.left) / bounds.width)
    mouseY.set((event.clientY - bounds.top) / bounds.height)
  }

  return (
    <div className="overflow-hidden bg-[#050505] text-white">
      <motion.div
        aria-hidden
        className="pointer-events-none fixed z-[60] hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-300/40 mix-blend-screen shadow-[0_0_38px_rgba(239,68,68,0.55)] lg:block"
        style={{ left: glowX, top: glowY }}
      />

      <section
        ref={heroRef}
        onPointerMove={handlePointerMove}
        className="relative flex min-h-screen items-center px-4 py-28 sm:px-6 lg:px-8"
      >
        <motion.div className="absolute inset-0" style={{ y: heroY, scale: heroScale }}>
          <Image src="/team/photos/premium-team.jpg" alt="Premium team group background" fill priority className="object-cover opacity-58" />
        </motion.div>
        <div className="absolute inset-0 animate-[premiumPulse_10s_ease-in-out_infinite] bg-[radial-gradient(circle_at_18%_16%,rgba(239,68,68,0.4),transparent_26%),radial-gradient(circle_at_82%_22%,rgba(185,28,28,0.36),transparent_30%),linear-gradient(135deg,rgba(5,5,5,0.7)_0%,rgba(25,3,3,0.54)_34%,rgba(96,9,9,0.38)_63%,rgba(5,5,5,0.82)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.86),rgba(0,0,0,0.48),rgba(0,0,0,0.78)),linear-gradient(180deg,rgba(0,0,0,0.2),rgba(0,0,0,0.9))]" />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: heroGlow }}
        />
        <FloatingParticles reactiveX={reactiveX} reactiveY={reactiveY} />

        <div className="relative mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 44 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-red-100 backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5" />
              Premium Team
            </div>
            <h1 className="clear-heading mt-6 max-w-5xl bg-gradient-to-r from-white via-red-100 to-red-400 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-6xl lg:text-7xl xl:text-8xl">
              Meet The Minds Behind The Innovation
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/78 sm:text-xl">
              Our strength lies in our people. A team of passionate innovators, developers, designers, and problem-solvers dedicated to delivering exceptional digital solutions.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="#team-showcase"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-700 via-red-600 to-red-500 px-8 py-4 font-semibold text-white shadow-[0_20px_70px_rgba(220,38,38,0.42)] transition hover:-translate-y-1 hover:from-red-600 hover:to-red-400"
              >
                Meet Our Team
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="relative hidden min-h-[34rem] lg:block"
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
          />
        </div>
      </section>

      <section id="team-showcase" className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.16),transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Leadership Team"
            title="Clear Leadership. One Premium Standard."
            subtitle="Meet the leaders responsible for innovation, technology, design, AI, creative strategy, and digital growth."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {teamMembers.map((member, index) => (
              <TeamCard key={member.name} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[92rem] gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
          >
            <div className="absolute -left-8 top-8 h-32 w-32 rounded-full bg-red-500/25 blur-3xl" />
            <div className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.055] p-3 shadow-[0_25px_100px_rgba(0,0,0,0.36)] backdrop-blur-2xl">
              <div className="rounded-[1.15rem] bg-black/70 p-2">
                <Image
                  src="/team/photos/team-culture.jpg"
                  alt="Team culture group photo"
                  width={1400}
                  height={900}
                  className="h-auto max-h-[46rem] w-full rounded-[0.9rem] object-contain"
                />
              </div>
            </div>
          </motion.div>

          <div>
            <SectionHeading
              eyebrow="Our Culture"
              title="More Than A Team, We Are A Family"
              subtitle="We believe in collaboration, innovation, continuous learning, and delivering excellence in every project we undertake."
            />

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {cultureCards.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.article
                    key={item.title}
                    className="rounded-[1.25rem] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-xl"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.48, delay: index * 0.07 }}
                    whileHover={{ y: -6, boxShadow: '0 0 45px rgba(220,38,38,0.16)' }}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/12 text-red-200 ring-1 ring-red-400/20">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-xl font-bold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/68">{item.text}</p>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Client Trust"
            title="Why Clients Love Working With Us"
            subtitle="Visitors should feel the operating rhythm immediately: fast, clear, creative, affordable, modern, and supportive."
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {clientLove.map((item, index) => (
              <motion.article
                key={item}
                className="rounded-[1.2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.075),rgba(255,255,255,0.025))] p-6 backdrop-blur-xl"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                whileHover={{ y: -6, boxShadow: '0 0 48px rgba(220,38,38,0.15)' }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/14 text-red-200 ring-1 ring-red-400/20">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{item}</h3>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {counters.map((counter, index) => (
              <motion.div
                key={counter.label}
                className="rounded-[1.2rem] border border-red-500/15 bg-white/[0.055] p-6 text-center backdrop-blur-xl"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
              >
                <div className="text-4xl font-black text-white">
                  <AnimatedCounter value={counter.value} suffix={counter.suffix} />
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.26em] text-white/55">{counter.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.16),transparent_24%),linear-gradient(135deg,#7f0505_0%,#dc2626_45%,#160202_100%)]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.13)_1px,transparent_1px)] [background-size:72px_72px]" />
        <motion.div
          aria-hidden
          className="absolute left-8 top-8 h-24 w-24 rounded-[2rem] border border-white/15 bg-white/10 backdrop-blur-xl"
          animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="absolute bottom-10 right-10 h-20 w-20 rounded-full bg-black/20"
          animate={{ y: [0, 16, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative mx-auto max-w-5xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/80">Final CTA</p>
          <h2 className="clear-heading mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Ready To Work With Our Team?
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-white/88">
            Let&apos;s bring your ideas to life with innovation, creativity, and technology.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-black transition hover:-translate-y-1 hover:bg-red-50"
            >
              Start Your Project
              <Rocket className="h-4 w-4" />
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-black/20 px-8 py-4 font-semibold text-white backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/10"
            >
              Contact Our Team
              <Mail className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
