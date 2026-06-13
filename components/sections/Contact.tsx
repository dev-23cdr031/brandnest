'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import {
  ArrowRight,
  Bot,
  Building2,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Code2,
  FileUp,
  Globe2,
  Lightbulb,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Rocket,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Users,
  Video,
  WalletCards,
  Zap,
} from 'lucide-react'

const audienceOptions = ['Startup', 'Business Owner', 'Student', 'Company', 'Government Organization', 'Investor']

const serviceOptions = [
  'Website Development',
  'Mobile App Development',
  'AI Video Ads',
  'Logo Design',
  'Poster Design',
  'Web Hosting',
  'Digital Marketing',
  'Custom Project',
]

const contactCards = [
  { icon: MapPin, label: 'Location', value: 'Erode, Tamil Nadu', href: 'https://maps.google.com' },
  { icon: Globe2, label: 'Available Worldwide', value: 'Remote delivery across time zones', href: '/contact' },
  { icon: Phone, label: 'Phone', value: '9363534589', href: 'tel:9363534589' },
  { icon: Mail, label: 'Email', value: 'devdharrshan421@gmail.com', href: 'mailto:devdharrshan421@gmail.com' },
  { icon: MessageCircle, label: 'WhatsApp', value: 'Instant project discussion', href: 'https://wa.me/919363534589' },
]

const reasons = [
  { icon: Zap, title: 'Fast Delivery', copy: 'Lean execution cycles that move from brief to launch with momentum.' },
  { icon: Sparkles, title: 'Creative Solutions', copy: 'Distinctive interfaces, campaigns, and product ideas built for recall.' },
  { icon: Code2, title: 'Modern Technology', copy: 'Next.js, mobile, AI workflows, automation, and scalable digital systems.' },
  { icon: ShieldCheck, title: 'Dedicated Support', copy: 'Clear communication before, during, and after your project goes live.' },
  { icon: Star, title: 'Award-Winning Team', copy: 'Competitive hackathon experience and polished delivery standards.' },
  { icon: Lightbulb, title: 'Innovative Thinking', copy: 'We turn unusual ideas into practical, revenue-ready experiences.' },
]

const testimonials = [
  'Amazing service',
  'Highly professional',
  'Fast and affordable',
  'Exceeded expectations',
  'Sharp design thinking',
  'Clear communication',
]

const connectionCards = [
  { icon: MessageCircle, title: 'WhatsApp Chat', copy: 'Start instantly with a focused project brief.' },
  { icon: Mail, title: 'Email Support', copy: 'Send files, goals, and project context anytime.' },
  { icon: Video, title: 'Video Consultation', copy: 'Talk through scope, roadmap, and launch plan.' },
  { icon: Users, title: 'Project Discussion', copy: 'Align on users, features, timeline, and budget.' },
  { icon: WalletCards, title: 'Instant Quote', copy: 'Get a practical estimate for your idea.' },
]

const mapPoints = [
  { city: 'New York', x: '26%', y: '39%' },
  { city: 'London', x: '46%', y: '33%' },
  { city: 'Dubai', x: '58%', y: '49%' },
  { city: 'India', x: '65%', y: '57%' },
  { city: 'Singapore', x: '72%', y: '67%' },
  { city: 'Sydney', x: '82%', y: '77%' },
]

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min((now - start) / 1400, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(value * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value])

  return (
    <span>
      {count}
      {suffix}
    </span>
  )
}

function MagneticButton({
  children,
  variant = 'primary',
  href,
}: {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  href: string
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 220, damping: 18 })
  const springY = useSpring(y, { stiffness: 220, damping: 18 })

  return (
    <motion.a
      href={href}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        x.set((event.clientX - rect.left - rect.width / 2) * 0.18)
        y.set((event.clientY - rect.top - rect.height / 2) * 0.18)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      className={`group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition sm:px-8 ${
        variant === 'primary'
          ? 'bg-white text-black shadow-[0_24px_90px_rgba(255,255,255,0.16)] hover:bg-red-50'
          : 'border border-white/20 bg-white/[0.06] text-white backdrop-blur-xl hover:border-red-300/60 hover:bg-red-500/12'
      }`}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
    </motion.a>
  )
}

function FloatingField({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={`rounded-[1.35rem] border border-white/10 bg-white/[0.065] shadow-[0_24px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl ${className}`}
      whileHover={{ y: -8, rotateX: 4, rotateY: -4, boxShadow: '0 30px 110px rgba(220,38,38,0.28)' }}
      transition={{ type: 'spring', stiffness: 160, damping: 18 }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedBackdrop({ reactiveX, reactiveY }: { reactiveX?: ReturnType<typeof useSpring>; reactiveY?: ReturnType<typeof useSpring> }) {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(239,68,68,0.34),transparent_26%),radial-gradient(circle_at_80%_18%,rgba(255,255,255,0.13),transparent_24%),linear-gradient(135deg,#050505_0%,#150202_36%,#6f0505_68%,#050505_100%)]" />
      <motion.div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{ x: reactiveX, y: reactiveY }}
      >
        <div className="absolute left-[12%] top-[14%] h-52 w-52 rounded-full bg-red-500/25 blur-3xl" />
        <div className="absolute right-[8%] top-[28%] h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-[12%] left-[42%] h-64 w-64 rounded-full bg-red-700/24 blur-3xl" />
      </motion.div>
      <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:72px_72px]" />
      <motion.div
        aria-hidden
        className="absolute inset-0"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 18, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
        style={{
          backgroundImage:
            'linear-gradient(110deg, transparent 0%, rgba(248,113,113,0.18) 45%, transparent 58%), linear-gradient(30deg, transparent 0%, rgba(255,255,255,0.12) 48%, transparent 55%)',
          backgroundSize: '220% 220%',
        }}
      />
      {Array.from({ length: 38 }).map((_, index) => (
        <motion.span
          key={index}
          aria-hidden
          className="absolute rounded-full bg-red-200/80 shadow-[0_0_24px_rgba(248,113,113,0.95)]"
          style={{
            left: `${3 + ((index * 13) % 94)}%`,
            top: `${4 + ((index * 17) % 88)}%`,
            width: `${2 + (index % 4)}px`,
            height: `${2 + (index % 4)}px`,
          }}
          animate={{ y: [0, -28 - (index % 6) * 3, 0], opacity: [0.16, 0.92, 0.16], scale: [1, 1.7, 1] }}
          transition={{ duration: 4 + (index % 7), repeat: Infinity, ease: 'easeInOut', delay: index * 0.07 }}
        />
      ))}
    </>
  )
}

function InquiryWizard() {
  const [step, setStep] = useState(0)
  const [budget, setBudget] = useState(25000)
  const [selectedAudience, setSelectedAudience] = useState('Startup')
  const [selectedService, setSelectedService] = useState('Website Development')
  const steps = ['Who Are You?', 'What Service Do You Need?', 'Budget Selection', 'Project Description', 'Contact Information']

  return (
    <FloatingField className="p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-red-200">Interactive Inquiry</p>
          <h2 className="clear-heading mt-2 text-3xl font-black text-white sm:text-4xl">Project Launch Wizard</h2>
        </div>
        <div className="rounded-full border border-red-300/25 bg-red-500/12 px-4 py-2 text-sm font-bold text-red-50">
          Step {step + 1} / {steps.length}
        </div>
      </div>

      <div className="mt-7 h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-red-600 via-red-300 to-white"
          animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 28, filter: 'blur(8px)' }}
        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, x: -28 }}
        transition={{ duration: 0.42 }}
        className="min-h-[25rem] pt-8"
      >
        <h3 className="text-2xl font-black text-white">{steps[step]}</h3>

        {step === 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {audienceOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedAudience(option)}
                className={`rounded-2xl border p-4 text-left font-semibold transition ${
                  selectedAudience === option
                    ? 'border-red-300/70 bg-red-500/18 text-white shadow-[0_0_40px_rgba(220,38,38,0.18)]'
                    : 'border-white/10 bg-white/[0.04] text-white/70 hover:border-red-300/40 hover:text-white'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {serviceOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedService(option)}
                className={`rounded-2xl border p-4 text-left font-semibold transition ${
                  selectedService === option
                    ? 'border-red-300/70 bg-red-500/18 text-white shadow-[0_0_40px_rgba(220,38,38,0.18)]'
                    : 'border-white/10 bg-white/[0.04] text-white/70 hover:border-red-300/40 hover:text-white'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="mt-8 rounded-[1.4rem] border border-white/10 bg-black/30 p-6">
            <div className="flex items-end justify-between gap-4">
              <p className="text-white/62">Estimated budget</p>
              <p className="text-3xl font-black text-white">₹{budget.toLocaleString('en-IN')}+</p>
            </div>
            <input
              aria-label="Budget"
              type="range"
              min={500}
              max={100000}
              step={500}
              value={budget}
              onChange={(event) => setBudget(Number(event.target.value))}
              className="mt-7 h-2 w-full cursor-pointer accent-red-500"
            />
            <div className="mt-3 flex justify-between text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
              <span>₹500</span>
              <span>₹1,00,000+</span>
            </div>
          </div>
        )}

        {step === 3 && (
          <textarea
            rows={8}
            className="mt-6 w-full resize-none rounded-[1.4rem] border border-red-300/20 bg-black/35 p-5 text-white outline-none transition placeholder:text-white/35 focus:border-red-300/60 focus:shadow-[0_0_50px_rgba(220,38,38,0.18)]"
            placeholder="Describe your idea, users, features, launch goals, and any references..."
          />
        )}

        {step === 4 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {['Name', 'Email', 'Phone Number'].map((label) => (
              <input
                key={label}
                className="rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-white outline-none transition placeholder:text-white/35 focus:border-red-300/60"
                placeholder={label}
                type={label === 'Email' ? 'email' : label === 'Phone Number' ? 'tel' : 'text'}
              />
            ))}
            <button className="group rounded-2xl bg-white px-5 py-4 font-black text-black transition hover:bg-red-50 sm:col-span-2">
              Submit Project Request <Rocket className="ml-2 inline h-4 w-4 transition group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </motion.div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setStep((value) => Math.max(value - 1, 0))}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-white/80 transition hover:border-red-300/40 hover:text-white disabled:opacity-35"
          disabled={step === 0}
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="button"
          onClick={() => setStep((value) => Math.min(value + 1, steps.length - 1))}
          className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-[0_18px_60px_rgba(220,38,38,0.36)] transition hover:bg-red-500 disabled:opacity-35"
          disabled={step === steps.length - 1}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </FloatingField>
  )
}

export function ContactSection() {
  const heroRef = useRef<HTMLElement | null>(null)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const springX = useSpring(mouseX, { stiffness: 100, damping: 24 })
  const springY = useSpring(mouseY, { stiffness: 100, damping: 24 })
  const glowX = useTransform(springX, (value) => `${value * 100}%`)
  const glowY = useTransform(springY, (value) => `${value * 100}%`)
  const reactiveX = useTransform(springX, (value) => (value - 0.5) * 34)
  const reactiveY = useTransform(springY, (value) => (value - 0.5) * 26)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroLift = useTransform(scrollYProgress, [0, 1], [0, 120])

  const calendarDays = useMemo(() => Array.from({ length: 21 }, (_, index) => index + 1), [])

  return (
    <div id="contact" className="overflow-hidden bg-[#050505] text-white">
      <section
        ref={heroRef}
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect()
          mouseX.set((event.clientX - rect.left) / rect.width)
          mouseY.set((event.clientY - rect.top) / rect.height)
        }}
        className="relative flex min-h-screen items-center px-4 py-28 sm:px-6 lg:px-8"
      >
        <AnimatedBackdrop reactiveX={reactiveX} reactiveY={reactiveY} />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(248,113,113,0.32), transparent 30%)`,
            ),
          }}
        />

        <div className="relative mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 38 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.07] px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-red-100 backdrop-blur-2xl">
              <Sparkles className="h-3.5 w-3.5" />
              Future Contact Interface
            </div>
            <h1 className="clear-heading mt-6 max-w-5xl bg-gradient-to-r from-white via-red-100 to-red-400 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-6xl lg:text-7xl xl:text-8xl">
              Let&apos;s Build Something Extraordinary Together
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/75 sm:text-xl">
              Whether you need a website, mobile app, AI solution, branding, marketing, or a custom innovation, we&apos;re ready to turn your vision into reality.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <MagneticButton href="#project-wizard">Start Your Project</MagneticButton>
              <MagneticButton href="#strategy-call" variant="secondary">Schedule Free Consultation</MagneticButton>
            </div>
          </motion.div>

          <motion.div className="relative min-h-[31rem]" style={{ y: heroLift }}>
            {[
              { icon: Bot, label: 'AI', pos: 'left-4 top-8' },
              { icon: Code2, label: 'Web', pos: 'right-8 top-20' },
              { icon: Rocket, label: 'Launch', pos: 'left-16 bottom-12' },
              { icon: MessageCircle, label: 'Chat', pos: 'right-4 bottom-20' },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.label}
                  className={`absolute ${item.pos} rounded-[1.4rem] border border-white/12 bg-white/[0.075] p-4 backdrop-blur-2xl`}
                  animate={{ y: [0, -18, 0], rotate: [0, index % 2 ? -4 : 4, 0] }}
                  transition={{ duration: 4.2 + index, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Icon className="h-8 w-8 text-red-200" />
                  <p className="mt-3 text-sm font-bold text-white">{item.label}</p>
                </motion.div>
              )
            })}
            <div className="absolute inset-12 rounded-full border border-red-300/20 bg-[radial-gradient(circle,rgba(220,38,38,0.24),transparent_58%)] shadow-[0_0_120px_rgba(220,38,38,0.22)]" />
            <motion.div
              className="absolute inset-20 rounded-full border border-white/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        </div>
      </section>

      <section id="project-wizard" className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.16),transparent_34%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-red-300">Interactive Contact Experience</p>
            <h2 className="clear-heading mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">No boring form. Just a guided launch path.</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ['16+', 'Projects Completed'],
                ['100%', 'Client Satisfaction'],
                ['24h', 'Quick Response'],
                ['5x', 'Premium Polish'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-[1.4rem] border border-white/10 bg-white/[0.055] p-6 text-center backdrop-blur-xl">
                  <p className="text-4xl font-black text-white">{value}</p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.32em] text-white/50">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <InquiryWizard />
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-sm font-bold uppercase tracking-[0.35em] text-red-300">Meet Us</p>
          <h2 className="clear-heading mx-auto mt-4 max-w-4xl text-center text-4xl font-black text-white sm:text-5xl">Reach the team from anywhere in the world.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {contactCards.map((card) => {
              const Icon = card.icon
              return (
                <motion.a
                  key={card.label}
                  href={card.href}
                  className="group rounded-[1.25rem] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-xl transition hover:border-red-300/45 hover:bg-red-500/10"
                  whileHover={{ y: -8, rotateX: 5, rotateY: -5, boxShadow: '0 0 55px rgba(220,38,38,0.22)' }}
                >
                  <Icon className="h-7 w-7 text-red-200" />
                  <h3 className="mt-5 text-lg font-black text-white">{card.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/62">{card.value}</p>
                </motion.a>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-red-300">Why Clients Contact Us</p>
          <h2 className="clear-heading mt-4 max-w-4xl text-4xl font-black text-white sm:text-5xl">Premium execution before the first call even ends.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {reasons.map((item) => {
              const Icon = item.icon
              return (
                <motion.article
                  key={item.title}
                  className="rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.075),rgba(255,255,255,0.025))] p-6 backdrop-blur-xl"
                  whileHover={{ y: -10, rotateX: 5, rotateY: -4, boxShadow: '0 0 70px rgba(220,38,38,0.2)' }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/14 text-red-200 ring-1 ring-red-400/20">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-black text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/64">{item.copy}</p>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      <section id="strategy-call" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-red-300">Book A Free Strategy Call</p>
            <h2 className="clear-heading mt-4 text-4xl font-black text-white sm:text-5xl">Get a free consultation and project roadmap from our experts.</h2>
            <div className="mt-8">
              <MagneticButton href="tel:9363534589">Schedule Free Call</MagneticButton>
            </div>
          </div>
          <FloatingField className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-red-200">June 2026</p>
                <h3 className="mt-2 text-2xl font-black text-white">Strategy Calendar</h3>
              </div>
              <CalendarDays className="h-9 w-9 text-red-200" />
            </div>
            <div className="mt-6 grid grid-cols-7 gap-2">
              {calendarDays.map((day) => (
                <motion.div
                  key={day}
                  className={`flex aspect-square items-center justify-center rounded-xl border text-sm font-bold ${
                    [6, 13, 20].includes(day) ? 'border-red-300/50 bg-red-500/20 text-white' : 'border-white/10 bg-white/[0.04] text-white/52'
                  }`}
                  whileHover={{ scale: 1.08, backgroundColor: 'rgba(220,38,38,0.24)' }}
                >
                  {day}
                </motion.div>
              ))}
            </div>
          </FloatingField>
        </div>
      </section>

      <section className="py-20">
        <p className="text-center text-sm font-bold uppercase tracking-[0.35em] text-red-300">Client Success Wall</p>
        <div className="mt-10 flex overflow-hidden">
          <motion.div
            className="flex min-w-max gap-4 px-4"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          >
            {[...testimonials, ...testimonials, ...testimonials].map((text, index) => (
              <div key={`${text}-${index}`} className="w-72 rounded-[1.2rem] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-xl">
                <p className="text-red-200">★★★★★</p>
                <p className="mt-3 text-lg font-black text-white">{text}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-red-300">Send A Message To Our Team</p>
          <h2 className="clear-heading mt-4 max-w-4xl text-4xl font-black text-white sm:text-5xl">Launch your project request through a premium command center.</h2>
          <form className="mt-10 grid gap-4 rounded-[1.7rem] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-2xl sm:grid-cols-2 lg:p-8">
            {['Full Name', 'Email', 'Phone', 'Company Name', 'Service Required', 'Preferred Budget', 'Deadline'].map((label) => (
              <input
                key={label}
                type={label === 'Email' ? 'email' : label === 'Phone' ? 'tel' : 'text'}
                placeholder={label}
                className="rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-white outline-none transition placeholder:text-white/35 focus:border-red-300/60"
              />
            ))}
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-red-300/30 bg-red-500/8 px-4 py-4 font-semibold text-white/70 transition hover:border-red-300/60 hover:text-white">
              <FileUp className="h-5 w-5 text-red-200" />
              File Upload Option
              <input type="file" className="hidden" />
            </label>
            <textarea
              rows={6}
              placeholder="Project Description"
              className="rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-white outline-none transition placeholder:text-white/35 focus:border-red-300/60 sm:col-span-2"
            />
            <button className="rounded-full bg-white px-7 py-4 font-black text-black transition hover:bg-red-50 sm:col-span-2">
              Launch My Project 🚀
            </button>
          </form>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-red-300">Real-Time Connection</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {connectionCards.map((item) => {
              const Icon = item.icon
              return (
                <motion.article
                  key={item.title}
                  className="rounded-[1.3rem] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-xl"
                  whileHover={{ y: -10, scale: 1.025, boxShadow: '0 0 60px rgba(220,38,38,0.2)' }}
                >
                  <Icon className="h-7 w-7 text-red-200" />
                  <h3 className="mt-5 text-lg font-black text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/60">{item.copy}</p>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-red-300">World Map</p>
          <h2 className="clear-heading mx-auto mt-4 max-w-4xl text-4xl font-black text-white sm:text-5xl">We Work With Clients Worldwide</h2>
          <div className="relative mt-12 min-h-[24rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.28),rgba(255,255,255,0.04)_38%,rgba(0,0,0,0.35)_72%)] p-6 backdrop-blur-xl">
            <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:48px_48px]" />
            <svg viewBox="0 0 1000 430" className="absolute inset-0 h-full w-full opacity-40">
              <path d="M95 185 C180 95 300 145 390 110 C490 72 560 142 650 118 C760 88 835 150 905 105" fill="none" stroke="rgba(248,113,113,.55)" strokeWidth="2" strokeDasharray="8 10" />
              <path d="M130 285 C250 210 340 260 455 220 C570 178 640 275 780 225 C850 198 890 250 935 238" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="2" strokeDasharray="6 12" />
            </svg>
            {mapPoints.map((point) => (
              <motion.div
                key={point.city}
                className="absolute"
                style={{ left: point.x, top: point.y }}
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="block h-4 w-4 rounded-full bg-red-300 shadow-[0_0_30px_rgba(248,113,113,1)]" />
                <span className="mt-2 block -translate-x-1/2 whitespace-nowrap text-xs font-bold uppercase tracking-[0.2em] text-white/70">{point.city}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-28 text-center sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_28%,rgba(255,255,255,0.18),transparent_24%),linear-gradient(135deg,#7f0505_0%,#dc2626_46%,#120101_100%)]" />
        <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:80px_80px]" />
        <motion.div className="absolute left-12 top-12 h-28 w-28 rounded-[2rem] border border-white/15 bg-white/10" animate={{ y: [0, -20, 0], rotate: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity }} />
        <motion.div className="absolute bottom-12 right-12 h-24 w-24 rounded-full bg-black/20" animate={{ y: [0, 18, 0], scale: [1, 1.12, 1] }} transition={{ duration: 4.6, repeat: Infinity }} />
        <div className="relative mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-white/80">Final Wow Section</p>
          <h2 className="clear-heading mt-5 text-4xl font-black text-white sm:text-5xl lg:text-6xl">Ready To Turn Your Idea Into Reality?</h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-white/88">
            Let&apos;s create something innovative, impactful, and unforgettable together.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <MagneticButton href="tel:9363534589">Contact Us Now</MagneticButton>
            <MagneticButton href="#project-wizard" variant="secondary">Get Free Quote</MagneticButton>
          </div>
        </div>
      </section>
    </div>
  )
}
