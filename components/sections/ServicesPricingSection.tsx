'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Code2,
  Crown,
  Layers3,
  Megaphone,
  MonitorSmartphone,
  Palette,
  Rocket,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Video,
  Globe2,
} from 'lucide-react'

const services = [
  {
    icon: Globe2,
    name: 'Website Development',
    description:
      'Professional, responsive, SEO-friendly websites for businesses, portfolios, and startups.',
    price: '₹3,000',
    features: ['Responsive Design', 'SEO Optimization', 'Fast Loading', 'Modern UI/UX'],
    action: 'Order Website',
  },
  {
    icon: Smartphone,
    name: 'Mobile App Development',
    description:
      'Custom Android and iOS applications built for performance and scalability.',
    price: '₹4,000',
    features: ['Android Apps', 'iOS Apps', 'API Integration', 'Modern UI'],
    action: 'Order Mobile App',
  },
  {
    icon: Video,
    name: 'AI Video Advertisement',
    description:
      'Professional AI-generated advertisements for products, brands, and businesses.',
    price: '₹400',
    features: ['AI Avatars', 'AI Voiceovers', 'Social Media Ads', 'Product Promotions'],
    action: 'Order AI Video',
  },
  {
    icon: Palette,
    name: 'Poster Design',
    description:
      'Creative posters for marketing, promotions, events, and social media campaigns.',
    price: '₹100',
    features: ['Business Posters', 'Social Media Creatives', 'Promotional Graphics'],
    action: 'Order Poster Design',
  },
  {
    icon: Sparkles,
    name: 'Logo Design',
    description:
      'Unique and professional logo designs to establish a strong brand identity.',
    price: '₹70',
    features: ['Custom Logo', 'Brand Colors', 'Multiple Concepts'],
    action: 'Order Logo Design',
  },
  {
    icon: Layers3,
    name: 'Web Hosting & Domain Setup',
    description: 'Complete website hosting and deployment solutions.',
    price: '₹300',
    features: ['Hosting Setup', 'Domain Configuration', 'SSL Installation', 'Website Deployment'],
    action: 'Setup Hosting',
  },
  {
    icon: Megaphone,
    name: 'Digital Marketing',
    description: 'Grow your business with data-driven marketing campaigns and lead generation.',
    price: 'Custom',
    features: ['Social Media Marketing', 'Google Ads', 'Lead Generation', 'Performance Marketing'],
    action: 'Grow My Business',
  },
]

const maintenanceIncludes = [
  'Security Updates',
  'Bug Fixes',
  'Performance Monitoring',
  'Technical Support',
  'Backup Management',
]

const whyChooseUs = [
  'Affordable Pricing',
  'Fast Delivery',
  'Professional Team',
  'Unlimited Support',
  'Quality Assurance',
  'Modern Technologies',
]

const stats = [
  { label: 'Services', value: 7, suffix: '+' },
  { label: 'Fast Turnaround', value: 24, suffix: 'h' },
  { label: 'Annual Support', value: 899, prefix: '₹', suffix: '/yr' },
]

function useCount(target: number, active: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return

    let frame = 0
    const duration = 1100
    const start = performance.now()

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

function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const isInView = useInView(ref, { once: true, amount: 0.7 })
  const count = useCount(value, isInView)

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}

export function ServicesPricingSection() {
  const heroRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const heroGlow = useTransform(scrollYProgress, [0, 1], [0.92, 1.08])

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="relative overflow-hidden bg-[#080808] text-white">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ scale: heroGlow }}
      >
        <motion.div
          className="absolute left-[-6rem] top-24 h-72 w-72 rounded-full bg-red-600/20 blur-3xl"
          animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-[-5rem] top-40 h-80 w-80 rounded-full bg-white/10 blur-3xl"
          animate={{ y: [0, 22, 0], x: [0, -12, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <section ref={heroRef} className="relative border-b border-white/10 px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-red-200 backdrop-blur-md">
              <Crown className="h-3.5 w-3.5" />
              Luxury Services
            </div>
            <h1 className="clear-heading mt-6 max-w-[14ch] bg-gradient-to-r from-white via-red-100 to-red-300 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:max-w-3xl sm:text-5xl lg:text-6xl xl:text-7xl">
              Our Services & Pricing
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75 sm:text-xl">
              Affordable, high-quality digital solutions for businesses, startups, creators, and entrepreneurs.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="#services"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-7 py-3.5 font-semibold text-white shadow-[0_20px_65px_rgba(220,38,38,0.35)] transition hover:scale-[1.02] hover:from-red-500 hover:to-red-400"
              >
                Get Free Consultation
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#services"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3.5 font-semibold text-white backdrop-blur-md transition hover:border-red-400/50 hover:bg-white/10"
              >
                Explore Pricing
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.7 }}
                  transition={{ duration: 0.45 }}
                >
                  <div className="text-2xl font-black text-white">
                    <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  </div>
                  <p className="mt-1 text-sm text-white/65">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative"
            style={{ y: heroY }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
              <div className="rounded-[1.5rem] border border-red-500/20 bg-black/50 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-red-300">Premium delivery</p>
                    <h2 className="mt-2 bg-gradient-to-r from-white via-red-100 to-red-300 bg-clip-text text-2xl font-bold text-transparent">
                      Built for trust and fast decisions
                    </h2>
                  </div>
                  <motion.div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 text-red-300"
                    animate={{ rotate: [0, -3, 3, 0], y: [0, -4, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Sparkles className="h-7 w-7" />
                  </motion.div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    'Service clarity from the first glance',
                    'Pricing that feels approachable and premium',
                    'Glassmorphism cards with subtle motion',
                    'Call-to-action flow focused on orders',
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/75">
                      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 text-red-300">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <motion.div
              aria-hidden
              className="absolute -bottom-6 left-8 h-24 w-24 rounded-full border border-red-500/20 bg-red-500/10 blur-[1px]"
              animate={{ y: [0, -14, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>
      </section>

      <section id="services" className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-300">Service Cards</p>
            <h2 className="clear-heading mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Order the right solution immediately
            </h2>
            <p className="mt-4 text-lg text-white/70">
              Each service is designed as a clear offer with a starting price, benefits, and a direct order button.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <motion.article
                  key={service.name}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: index * 0.04 }}
                  whileHover={{ y: -8, scale: 1.01 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.18),transparent_40%),linear-gradient(135deg,rgba(255,255,255,0.03),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <div className="relative">
                    <div className="flex items-start justify-between gap-4">
                      <motion.div
                        className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-red-300 shadow-[0_0_0_rgba(220,38,38,0)]"
                        whileHover={{ scale: 1.06, boxShadow: '0 0 35px rgba(220,38,38,0.28)' }}
                        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                      >
                        <Icon className="h-7 w-7" />
                      </motion.div>
                      <div className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-sm font-semibold text-red-100">
                        Starting at {service.price}
                      </div>
                    </div>

                    <h3 className="mt-6 text-2xl font-bold text-white">{service.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/70">{service.description}</p>

                    <ul className="mt-6 space-y-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-sm text-white/80">
                          <BadgeCheck className="h-4 w-4 shrink-0 text-red-300" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-7 flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/50">Order Now</p>
                      <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_15px_45px_rgba(220,38,38,0.28)] transition hover:scale-[1.02] hover:from-red-500 hover:to-red-400"
                      >
                        {service.action}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="grid gap-6 lg:grid-cols-[1fr_1.1fr]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65 }}
          >
            <article className="rounded-[2rem] border border-red-500/20 bg-gradient-to-br from-red-600/20 via-white/5 to-black p-8 shadow-[0_25px_90px_rgba(220,38,38,0.15)] backdrop-blur-xl">
              <div className="flex items-center gap-3 text-red-200">
                <Rocket className="h-5 w-5" />
                <p className="text-sm font-semibold uppercase tracking-[0.3em]">Maintenance Plans</p>
              </div>
              <h3 className="mt-5 bg-gradient-to-r from-white via-red-100 to-red-200 bg-clip-text text-3xl font-black text-transparent">
                Website & Mobile App Maintenance
              </h3>
              <p className="mt-4 max-w-2xl text-white/75">
                Keep your website and mobile application secure, updated, and running smoothly throughout the year.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {maintenanceIncludes.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                    <ShieldCheck className="h-4 w-4 text-red-300" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-7 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 p-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/50">Price</p>
                  <p className="mt-2 text-3xl font-black text-white">₹899 Per Year</p>
                </div>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
                >
                  Get Maintenance Plan
                </Link>
              </div>
            </article>

            <article className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 shadow-[0_20px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl">
              <div className="flex items-center gap-3 text-red-200">
                <Star className="h-5 w-5" />
                <p className="text-sm font-semibold uppercase tracking-[0.3em]">Why Choose Us</p>
              </div>
              <h3 className="mt-5 bg-gradient-to-r from-white via-red-100 to-red-200 bg-clip-text text-3xl font-black text-transparent">
                Built to feel premium and close the sale
              </h3>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {whyChooseUs.map((item, index) => (
                  <motion.div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-300">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <p className="mt-4 font-semibold text-white">{item}</p>
                  </motion.div>
                ))}
              </div>
            </article>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
