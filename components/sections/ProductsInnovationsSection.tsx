'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useMotionValue, useScroll, useTransform, type Variants } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  CalendarClock,
  ChevronRight,
  Cpu,
  Gauge,
  Globe2,
  Handshake,
  Layers3,
  LockKeyhole,
  Mail,
  MapPinned,
  Rocket,
  Satellite,
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

type Product = {
  name: string
  category: string
  image: string
  description: string
  problem: string
  features: string[]
  stack: string[]
  status: string
  badge: string
  icon: typeof ShieldAlert
}

const products: Product[] = [
  {
    name: 'Smart Tourist Safety Platform',
    category: 'Travel Technology',
    image: '/products/smart-tourist-safety.png',
    description:
      'An intelligent tourist safety system that enhances traveler security through real-time monitoring, emergency assistance, location tracking, risk alerts, and AI-powered safety recommendations.',
    problem: 'Tourists and destination operators need faster emergency response, location-aware alerts, and reliable safety intelligence across unfamiliar environments.',
    features: ['Live Tracking', 'Emergency Alerts', 'AI Safety Prediction', 'Location Sharing', 'Smart Notifications'],
    stack: ['AI/ML', 'Realtime Maps', 'Geo-fencing', 'Cloud APIs'],
    status: 'Research Published',
    badge: 'Available for Licensing',
    icon: ShieldAlert,
  },
  {
    name: 'Cosmic Watch Platform',
    category: 'Space Technology',
    image: '/products/cosmic-watch.jpg',
    description:
      'An advanced asteroid monitoring and tracking platform providing real-time data visualization and alerts for celestial object observation and analysis.',
    problem: 'Research teams need a clear operational interface for monitoring celestial objects, comparing live signals, and sharing alerts with stakeholders.',
    features: ['Asteroid Tracking', 'Live Data Dashboard', 'Predictive Analysis', 'Space Object Monitoring'],
    stack: ['Data Viz', 'Prediction Models', 'Alert Engine', 'Space APIs'],
    status: 'Prototype Ready',
    badge: 'Available for Custom Development',
    icon: Satellite,
  },
  {
    name: 'Hybrid Renewable Energy System',
    category: 'Green Energy',
    image: '/products/hybrid-renewable-energy.jpg',
    description:
      'An intelligent energy management platform integrating multiple renewable energy sources for efficient power generation and monitoring.',
    problem: 'Energy operators need better visibility across renewable sources, storage, distribution, and performance to improve uptime and commercial viability.',
    features: ['Solar Monitoring', 'Energy Analytics', 'Smart Distribution', 'Performance Reports'],
    stack: ['IoT', 'Energy Analytics', 'Automation', 'Cloud Dashboard'],
    status: 'Development Ready',
    badge: 'Available for Commercialization',
    icon: Zap,
  },
]

const proofPoints = [
  { value: '03', label: 'Flagship innovation tracks' },
  { value: '12+', label: 'Research and prototype modules' },
  { value: '5x', label: 'Licensing and build models' },
]

const reasons = [
  { title: 'Award-Winning Solutions', icon: BadgeCheck, copy: 'Built from hackathon pressure, research discipline, and product-market thinking.' },
  { title: 'Real-World Problem Solving', icon: Globe2, copy: 'Each concept targets operational pain for travel, space data, energy, and public systems.' },
  { title: 'Scalable Architecture', icon: Layers3, copy: 'Designed for pilots, enterprise customization, licensing, and managed rollout.' },
  { title: 'Research-Based Innovation', icon: Cpu, copy: 'Evidence-led product thinking with publishable methods and measurable outcomes.' },
  { title: 'Industry Ready', icon: Building2, copy: 'Dashboards, alerts, analytics, and integrations shaped for serious stakeholders.' },
  { title: 'Expert Team Support', icon: Handshake, copy: 'Implementation, customization, and partnership support from a focused digital team.' },
]

const showcase = [
  {
    title: 'Hybrid Renewable Energy',
    tag: 'Green Energy',
    product: 'Field research and renewable power monitoring system',
    image: '/products/project-hybrid-renewable-energy.jpg',
  },
  {
    title: 'AI Resume Checker',
    tag: 'AI Product',
    product: 'Resume screening and AI-generated content analysis platform',
    image: '/products/project-ai-resume-checker.webp',
  },
  {
    title: 'Smart Tourist Safety',
    tag: 'Travel Safety',
    product: 'Tourist safety monitoring, alerts, and location intelligence',
    image: '/products/project-smart-tourist-safety.jpg',
  },
  {
    title: 'HackConnect',
    tag: 'Hackathon Platform',
    product: 'Innovation discovery and team collaboration concept',
    image: '/products/project-hackconnect.jpg',
  },
  {
    title: 'Mesh Networking',
    tag: 'Connectivity Research',
    product: 'Resilient communication research for distributed environments',
    image: '/products/project-mesh-networking.jpg',
  },
  {
    title: 'Cosmic Watch Platform',
    tag: 'Space Technology',
    product: 'Celestial monitoring and asteroid observation product track',
    image: '/products/project-cosmic-watch.jpg',
  },
  {
    title: 'ShaadiSpot',
    tag: 'Event Tech',
    product: 'Premium wedding venue and celebration discovery experience',
    image: '/products/project-shaadispot.jpg',
  },
  {
    title: '8+ Company Projects',
    tag: 'Client Delivery',
    product: 'Commercial websites, digital systems, and custom company solutions delivered',
    image: '/products/project-company-work.webp',
  },
]

const timeline = [
  { phase: 'Research', detail: 'Problem validation, papers, datasets, and feasibility mapping.' },
  { phase: 'Prototype', detail: 'Clickable dashboards, core algorithms, alerts, and user flows.' },
  { phase: 'Pilot', detail: 'Partner-ready deployments for institutions, startups, and agencies.' },
  { phase: 'Scale', detail: 'Licensing, acquisition, commercialization, or custom productization.' },
]

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.08 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } },
}

function ParticleField() {
  const particles = useMemo(
    () =>
      Array.from({ length: 46 }, (_, index) => ({
        id: index,
        left: `${(index * 37) % 100}%`,
        top: `${(index * 61) % 100}%`,
        duration: 7 + (index % 8),
        delay: (index % 9) * 0.4,
        size: 2 + (index % 3),
      })),
    [],
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-red-400/70 shadow-[0_0_18px_rgba(248,113,113,0.75)]"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
          }}
          animate={{ y: [-18, 18, -18], opacity: [0.22, 0.9, 0.22], scale: [1, 1.8, 1] }}
          transition={{ duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

function MouseGlow() {
  const x = useMotionValue(-300)
  const y = useMotionValue(-300)

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [x, y])

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-30 hidden h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/15 blur-3xl lg:block"
      style={{ x, y }}
    />
  )
}

function HeroProductCard({ product, index }: { product: Product; index: number }) {
  const Icon = product.icon

  return (
    <motion.div
      className="absolute hidden w-64 rounded-lg border border-white/15 bg-white/[0.08] p-4 shadow-[0_24px_80px_rgba(220,38,38,0.22)] backdrop-blur-2xl lg:block"
      style={{
        right: index === 0 ? '7%' : index === 1 ? '19%' : '4%',
        top: index === 0 ? '24%' : index === 1 ? '48%' : '69%',
      }}
      initial={{ opacity: 0, x: 60, rotate: index === 1 ? -4 : 4 }}
      animate={{ opacity: 1, x: 0, y: [0, -14, 0], rotate: index === 1 ? [-4, -1, -4] : [4, 1, 4] }}
      transition={{ opacity: { duration: 0.8, delay: 0.5 + index * 0.13 }, x: { duration: 0.8 }, y: { duration: 5 + index, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 5 + index, repeat: Infinity, ease: 'easeInOut' } }}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-100">
          {product.category}
        </span>
        <Icon className="h-5 w-5 text-red-300" />
      </div>
      <h3 className="text-base font-semibold text-white">{product.name}</h3>
      <p className="mt-2 text-xs leading-5 text-white/60">{product.badge}</p>
    </motion.div>
  )
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <motion.div
      className="mx-auto mb-12 max-w-3xl text-center"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7 }}
    >
      <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-red-200">
        <Sparkles className="h-3.5 w-3.5" />
        {eyebrow}
      </span>
      <h2 className="text-3xl font-semibold tracking-normal text-white md:text-5xl">{title}</h2>
      <p className="mt-5 text-base text-white/62 md:text-lg">{subtitle}</p>
    </motion.div>
  )
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const Icon = product.icon

  return (
    <motion.article
      className="group relative overflow-hidden rounded-lg border border-white/12 bg-white/[0.055] shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-90px' }}
      transition={{ duration: 0.65, delay: index * 0.08 }}
      whileHover={{ y: -10, rotateX: 1.2, rotateY: -1.2 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(239,68,68,0.25),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_45%)] opacity-80" />
      <div className="relative grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative min-h-[320px] overflow-hidden border-b border-white/10 bg-black/40 lg:border-b-0 lg:border-r">
          <Image
            src={product.image}
            alt={`${product.name} product visual`}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
          <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/45 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
            {product.badge}
          </div>
          <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-lg border border-red-400/25 bg-red-600/18 px-4 py-3 text-sm font-semibold text-red-50 backdrop-blur-xl">
            <Icon className="h-4 w-4" />
            {product.status}
          </div>
        </div>
        <div className="relative p-6 md:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-black">
              {product.category}
            </span>
            <span className="rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-100">
              Commercial Track
            </span>
          </div>
          <h3 className="text-2xl font-semibold tracking-normal text-white md:text-3xl">{product.name}</h3>
          <p className="mt-4 text-sm leading-7 text-white/68 md:text-base">{product.description}</p>

          <div className="mt-6 rounded-lg border border-white/10 bg-black/28 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
              <LockKeyhole className="h-4 w-4 text-red-300" />
              Problem Solved
            </div>
            <p className="text-sm leading-6 text-white/58">{product.problem}</p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-red-200">Key Features</p>
              <div className="flex flex-wrap gap-2">
                {product.features.map((feature) => (
                  <span key={feature} className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-xs text-white/76">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-red-200">Technology Stack</p>
              <div className="flex flex-wrap gap-2">
                {product.stack.map((tech) => (
                  <span key={tech} className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-50">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="#showcase" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-red-50">
              View Details <ChevronRight className="h-4 w-4" />
            </Link>
            <Link href="#request-demo" className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-400/40 bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-[0_16px_44px_rgba(220,38,38,0.36)] transition hover:bg-red-500">
              Request Demo <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="#request-demo" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">
              Get Pricing
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function ShowcaseCarousel() {
  const slides = [...showcase, ...showcase]

  return (
    <div id="showcase" className="overflow-hidden">
      <motion.div
        className="flex w-max flex-nowrap gap-5 px-4 sm:px-6 lg:px-8"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 52, repeat: Infinity, ease: 'linear' }}
      >
        {slides.map((slide, index) => (
          <motion.div
            key={`${slide.title}-${index}`}
            className="group relative h-[430px] w-[82vw] max-w-[460px] shrink-0 overflow-hidden rounded-lg border border-white/12 bg-white/[0.06] shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:w-[390px] md:w-[460px]"
            whileHover={{ scale: 1.035, rotateY: 4, z: 20 }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(239,68,68,0.28),transparent_34%),linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
            <div className="relative h-64 overflow-hidden border-b border-white/10 bg-black/40">
              <Image
                src={slide.image}
                alt={`${slide.title} project`}
                fill
                className="object-cover transition duration-700 group-hover:scale-[1.08]"
                sizes="(min-width: 768px) 460px, 310px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/18 to-transparent" />
              <span className="absolute left-5 top-5 rounded-full border border-red-300/25 bg-black/42 px-3 py-1 text-xs font-semibold text-red-100 backdrop-blur-xl">
                {slide.tag}
              </span>
            </div>
            <div className="relative flex h-[166px] flex-col justify-between p-5">
              <div>
                <h3 className="text-2xl font-semibold text-white">{slide.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/62">{slide.product}</p>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs font-bold uppercase tracking-[0.18em] text-white/46">
                <span>Completed Work</span>
                <Gauge className="h-4 w-4 text-red-200" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export function ProductsInnovationsSection() {
  const heroRef = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -90])
  const [selectedProduct, setSelectedProduct] = useState(products[0].name)

  return (
    <div className="relative overflow-hidden bg-[#050505] text-white">
      <MouseGlow />

      <section ref={heroRef} className="relative min-h-screen overflow-hidden pt-16">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image src="/products/ai-city.svg" alt="Futuristic AI city background" fill priority className="object-cover opacity-72" sizes="100vw" />
        </motion.div>
        <motion.div
          style={{ y: gridY }}
          className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.12)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35"
        />
        <ParticleField />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_30%,rgba(220,38,38,0.34),transparent_30%),radial-gradient(circle_at_82%_34%,rgba(248,113,113,0.24),transparent_26%),linear-gradient(90deg,rgba(5,5,5,0.92),rgba(5,5,5,0.42),rgba(5,5,5,0.9))]" />

        {products.map((product, index) => (
          <HeroProductCard key={product.name} product={product} index={index} />
        ))}

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl">
            <motion.div variants={item} className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-300/25 bg-white/[0.07] px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-red-100 backdrop-blur-xl">
              <Rocket className="h-4 w-4" />
              Products, research and investable innovation
            </motion.div>
            <motion.h1 variants={item} className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-normal text-white sm:text-6xl lg:text-8xl">
              Building Tomorrow&apos;s Solutions Today
            </motion.h1>
            <motion.p variants={item} className="mt-7 max-w-2xl text-base leading-8 text-white/72 md:text-xl">
              Our award-winning innovations are transforming industries through AI, automation, safety systems, smart platforms, and next-generation digital technologies.
            </motion.p>
            <motion.div variants={item} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="#portfolio" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-4 text-sm font-bold text-black shadow-[0_18px_70px_rgba(255,255,255,0.14)] transition hover:bg-red-50">
                Explore Products <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#request-demo" className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-4 text-sm font-bold text-white shadow-[0_18px_70px_rgba(220,38,38,0.42)] transition hover:bg-red-500">
                Request Demo <CalendarClock className="h-4 w-4" />
              </Link>
              <Link href="#request-demo" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/16 bg-white/[0.06] px-6 py-4 text-sm font-bold text-white backdrop-blur-xl transition hover:bg-white/10">
                Schedule Meeting <Handshake className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div variants={item} className="mt-12 grid max-w-3xl gap-3 sm:grid-cols-3">
              {proofPoints.map((point) => (
                <div key={point.label} className="rounded-lg border border-white/12 bg-white/[0.07] p-4 backdrop-blur-xl">
                  <div className="text-3xl font-semibold text-white">{point.value}</div>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/52">{point.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="portfolio" className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-red-950/28 to-transparent" />
        <div className="relative mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Our Flagship Products"
            title="Innovation Portfolio"
            subtitle="Real-world solutions developed through hackathons, research, and industry-focused innovation."
          />
          <div className="space-y-8">
            {products.map((product, index) => (
              <ProductCard key={product.name} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Projects We Have Done"
            title="Built Products, Research Work And Company Projects"
            subtitle="A premium showcase of real innovation work including Hybrid Renewable Energy, AI Resume Checker, Smart Tourist Safety, HackConnect, Mesh Networking, Cosmic Watch Platform, ShaadiSpot, and 8+ company projects delivered."
          />
        </div>
        <ShowcaseCarousel />
      </section>

      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Why Invest"
            title="Built For Licensing, Pilots And Scale"
            subtitle="The portfolio is structured for companies, startups, government organizations, and investors who want deployable innovation without starting from zero."
          />
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason) => {
              const Icon = reason.icon
              return (
                <motion.div key={reason.title} variants={item} whileHover={{ y: -8 }} className="rounded-lg border border-white/12 bg-white/[0.06] p-6 backdrop-blur-xl">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-red-600 text-white shadow-[0_0_40px_rgba(220,38,38,0.45)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{reason.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/58">{reason.copy}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-lg border border-white/12 bg-white/[0.055] p-6 backdrop-blur-2xl md:p-10">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-red-200">Development Timeline</span>
              <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">From research concept to commercial rollout</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-white/58">A transparent path for organizations evaluating acquisition, licensing, custom development, or partnership.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {timeline.map((step, index) => (
              <motion.div
                key={step.phase}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative rounded-lg border border-white/10 bg-black/32 p-5"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">{index + 1}</span>
                  <BarChart3 className="h-5 w-5 text-red-200" />
                </div>
                <h3 className="text-lg font-semibold text-white">{step.phase}</h3>
                <p className="mt-2 text-sm leading-6 text-white/56">{step.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="request-demo" className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(220,38,38,0.18),transparent_34%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-lg border border-white/12 bg-white/[0.06] p-8 backdrop-blur-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-red-200">Request A Demo</span>
            <h2 className="mt-4 text-3xl font-semibold text-white md:text-5xl">Enterprise-grade product inquiry</h2>
            <p className="mt-5 text-white/62">Tell us what you want to evaluate. We can discuss demos, pilots, licensing, custom development, government deployment, or acquisition conversations.</p>
            <div className="mt-8 space-y-4">
              {products.map((product) => (
                <button
                  key={product.name}
                  type="button"
                  onClick={() => setSelectedProduct(product.name)}
                  className={`flex w-full items-center justify-between rounded-lg border p-4 text-left transition ${
                    selectedProduct === product.name
                      ? 'border-red-400/50 bg-red-600/18 text-white'
                      : 'border-white/10 bg-black/25 text-white/68 hover:bg-white/[0.06]'
                  }`}
                >
                  <span className="text-sm font-semibold">{product.name}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ))}
            </div>
          </motion.div>

          <motion.form initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-lg border border-white/12 bg-white/[0.075] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              <input className="rounded-lg border border-white/12 bg-black/35 px-4 py-3 text-sm text-white outline-none ring-red-500/40 placeholder:text-white/36 focus:ring-2" placeholder="Company Name" />
              <input className="rounded-lg border border-white/12 bg-black/35 px-4 py-3 text-sm text-white outline-none ring-red-500/40 placeholder:text-white/36 focus:ring-2" placeholder="Contact Person" />
              <input className="rounded-lg border border-white/12 bg-black/35 px-4 py-3 text-sm text-white outline-none ring-red-500/40 placeholder:text-white/36 focus:ring-2" placeholder="Email" type="email" />
              <input className="rounded-lg border border-white/12 bg-black/35 px-4 py-3 text-sm text-white outline-none ring-red-500/40 placeholder:text-white/36 focus:ring-2" placeholder="Phone" />
              <select value={selectedProduct} onChange={(event) => setSelectedProduct(event.target.value)} className="rounded-lg border border-white/12 bg-black/35 px-4 py-3 text-sm text-white outline-none ring-red-500/40 focus:ring-2">
                {products.map((product) => (
                  <option key={product.name}>{product.name}</option>
                ))}
              </select>
              <select className="rounded-lg border border-white/12 bg-black/35 px-4 py-3 text-sm text-white outline-none ring-red-500/40 focus:ring-2" defaultValue="">
                <option value="" disabled>Organization Type</option>
                <option>Company</option>
                <option>Startup</option>
                <option>Government Organization</option>
                <option>Investor</option>
                <option>Research Institution</option>
              </select>
              <select className="rounded-lg border border-white/12 bg-black/35 px-4 py-3 text-sm text-white outline-none ring-red-500/40 focus:ring-2 md:col-span-2" defaultValue="">
                <option value="" disabled>Budget Range</option>
                <option>Discovery / Consultation</option>
                <option>Prototype Pilot</option>
                <option>Licensing Discussion</option>
                <option>Enterprise Customization</option>
                <option>Acquisition / Investment</option>
              </select>
              <textarea className="min-h-36 rounded-lg border border-white/12 bg-black/35 px-4 py-3 text-sm text-white outline-none ring-red-500/40 placeholder:text-white/36 focus:ring-2 md:col-span-2" placeholder="Project Requirements" />
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button type="button" className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-4 text-sm font-bold text-white shadow-[0_18px_70px_rgba(220,38,38,0.36)] hover:bg-red-500">
                Request Demo <Mail className="h-4 w-4" />
              </button>
              <Link href="#investor-cta" className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white px-6 py-4 text-sm font-bold text-black hover:bg-red-50">
                Schedule Consultation <CalendarClock className="h-4 w-4" />
              </Link>
            </div>
          </motion.form>
        </div>
      </section>

      <section id="investor-cta" className="relative px-4 pb-28 pt-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-lg border border-red-300/18 bg-white text-black"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_30%,rgba(220,38,38,0.26),transparent_32%),linear-gradient(135deg,#ffffff,#f5f5f5)]" />
          <div className="relative grid gap-8 p-8 md:p-12 lg:grid-cols-[1fr_0.72fr] lg:p-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white">
                <MapPinned className="h-3.5 w-3.5 text-red-400" />
                Investor and company CTA
              </span>
              <h2 className="mt-7 max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-black md:text-6xl">
                Interested In Acquiring Or Scaling Our Innovation?
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-black/64">
                Whether you&apos;re a company looking to implement our solutions, an investor seeking innovative products, or an organization looking for technology partnerships, we&apos;d love to connect.
              </p>
            </div>
            <div className="flex flex-col justify-end gap-4">
              <Link href="#request-demo" className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-7 py-4 text-sm font-bold text-white transition hover:bg-red-700">
                Let&apos;s Discuss <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#request-demo" className="inline-flex items-center justify-center gap-2 rounded-lg border border-black/12 bg-red-600 px-7 py-4 text-sm font-bold text-white shadow-[0_18px_60px_rgba(220,38,38,0.28)] transition hover:bg-red-500">
                Book A Meeting <CalendarClock className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
