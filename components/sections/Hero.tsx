'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { AnimatedCounter } from '@/components/AnimatedCounter'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black pt-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Content */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <motion.p
                className="text-red-400 text-sm font-semibold uppercase tracking-widest mb-4"
                variants={itemVariants}
              >
                Welcome to Brandnest
              </motion.p>
              <motion.h1
                className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
                variants={itemVariants}
              >
                Transform Your <span className="gradient-text">Digital</span> Presence
              </motion.h1>
              <motion.p
                className="text-xl text-gray-300 leading-relaxed mb-8"
                variants={itemVariants}
              >
                We create award-winning digital experiences that elevate brands and drive real business results. From concept to launch, we&apos;re your partner in excellence.
              </motion.p>
            </div>

            <motion.div className="flex flex-col sm:flex-row gap-4" variants={itemVariants}>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-red-700 hover:shadow-premium"
              >
                Get Started <ArrowRight size={20} />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-gray-900"
              >
                View Services
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              className="flex flex-wrap gap-8 pt-8 border-t border-gray-700"
              variants={itemVariants}
            >
              <AnimatedCounter end={16} suffix="+" label="Projects Completed" />
              <AnimatedCounter end={100} suffix="%" label="Client Satisfaction" />
              <AnimatedCounter end={50} suffix="+" label="Team Members" />
            </motion.div>
          </motion.div>

          {/* Right Content - Decorative Elements */}
          <motion.div
            className="relative hidden lg:block"
            variants={itemVariants}
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Large animated box */}
              <motion.div
                className="absolute inset-0 bg-gradient-primary rounded-3xl opacity-10 blur-2xl"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              {/* Glass card effect */}
              <div className="absolute inset-0 glass rounded-3xl border border-white/20 p-8">
                <div className="grid grid-cols-2 gap-4 h-full">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl opacity-20"
                      animate={{ y: [0, -10, 0] }}
                      transition={{
                        duration: 3,
                        delay: i * 0.2,
                        repeat: Infinity,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Orbiting elements */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity }}
              >
                <div className="w-96 h-96 rounded-full border border-red-600/20" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-400 text-sm">Scroll to explore</p>
            <div className="w-1 h-6 border border-gray-400 rounded-full" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
