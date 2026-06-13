"use client"

import Link from 'next/link'
import { services } from '../../lib/services'
import { motion } from 'framer-motion'
import { ArrowUpRight, Palette, Code, Smartphone, Search, TrendingUp, Users, Zap, ShieldCheck } from 'lucide-react'

export function ServicesSection() {
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  }

  const item = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const extras = [
    { icon: Palette, label: 'Brand Design' },
    { icon: Code, label: 'Engineering' },
    { icon: Smartphone, label: 'Mobile Apps' },
    { icon: Search, label: 'SEO & Content' },
    { icon: TrendingUp, label: 'Growth' },
    { icon: Users, label: 'UX Research' },
    { icon: Zap, label: 'Performance' },
    { icon: ShieldCheck, label: 'Security' },
  ]

  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <p className="text-red-600 font-semibold uppercase tracking-widest mb-2">Services</p>
          <h2 className="text-4xl md:text-5xl font-extrabold">Services That Move Business Forward</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">End-to-end product design, engineering and growth services — tailored, measurable, exceptional.</p>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" variants={container} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {services.map((s) => (
            <motion.article key={s.slug} variants={item} className="rounded-2xl p-6 relative overflow-hidden border border-gray-100 hover:shadow-xl transition">
              <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient ?? 'from-gray-100 to-white'} opacity-0 group-hover:opacity-10 transition`} />
              <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{s.summary}</p>

              <ul className="text-sm text-gray-700 mb-6 space-y-1">
                {s.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="w-2 h-2 mt-2 rounded-full bg-red-600" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">{s.price}</span>
                <Link href={`/services/${s.slug}`} className="inline-flex items-center gap-2 text-red-600 font-semibold">
                  Learn More <ArrowUpRight size={16} />
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl p-8 bg-gradient-to-br from-gray-50 to-white border border-gray-100">
            <h4 className="text-lg font-bold mb-3">How we work</h4>
            <p className="text-gray-700">Discovery, strategy, design, and iterative delivery — backed by clear milestones and outcome-driven metrics.</p>
          </div>

          <div className="rounded-2xl p-8 border border-gray-100">
            <h4 className="text-lg font-bold mb-3">Custom engagements</h4>
            <p className="text-gray-700 mb-4">We tailor teams and roadmaps to meet the scale and timeline of your initiative.</p>
            <Link href="/contact" className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg font-semibold">
              Get a Quote
            </Link>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-6">Capabilities</h3>
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" initial="hidden" whileInView="visible" variants={container} viewport={{ once: true }}>
            {extras.map((e, idx) => {
              const Icon = e.icon
              return (
                <motion.div key={idx} variants={item} className="flex items-center gap-3 p-4 rounded-lg border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{e.label}</div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <details className="p-4 border rounded-lg">
              <summary className="font-semibold">How long does a typical project take?</summary>
              <p className="mt-2 text-gray-700">Small projects: 4–6 weeks. Medium: 8–16 weeks. Large: multi-month programs.</p>
            </details>
            <details className="p-4 border rounded-lg">
              <summary className="font-semibold">What does pricing include?</summary>
              <p className="mt-2 text-gray-700">Estimates include design, development, QA, and a handoff/warranty period unless stated otherwise.</p>
            </details>
          </div>
        </div>
      </div>
    </section>
  )
}
