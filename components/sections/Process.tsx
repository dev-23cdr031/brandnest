'use client'

import { motion } from 'framer-motion'
import {
  Lightbulb,
  Pencil,
  Code,
  CheckCircle,
  Rocket,
} from 'lucide-react'

export function ProcessSection() {
  const steps = [
    {
      number: '01',
      icon: Lightbulb,
      title: 'Discovery',
      description: 'We dive deep into understanding your vision, goals, and target audience.',
    },
    {
      number: '02',
      icon: Pencil,
      title: 'Strategy & Design',
      description: 'Crafting comprehensive strategies and stunning visual designs.',
    },
    {
      number: '03',
      icon: Code,
      title: 'Development',
      description: 'Building scalable, performant solutions with cutting-edge technology.',
    },
    {
      number: '04',
      icon: CheckCircle,
      title: 'Testing & QA',
      description: 'Rigorous testing ensuring perfection across all devices and browsers.',
    },
    {
      number: '05',
      icon: Rocket,
      title: 'Launch & Support',
      description: 'Seamless deployment and ongoing support for sustained success.',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const stepVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-red-600 font-semibold uppercase tracking-widest mb-4">
            Our Approach
          </p>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            A Proven Process for Success
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From initial concept to post-launch support, we follow a structured
            methodology to ensure exceptional results.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Vertical line for desktop */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-red-600/0 via-red-600/50 to-red-600/0 -translate-x-1/2" />

          <div className="space-y-12 lg:space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isEven = index % 2 === 0

              return (
                <motion.div
                  key={index}
                  variants={stepVariants}
                  className={`flex flex-col ${
                    isEven
                      ? 'lg:flex-row'
                      : 'lg:flex-row-reverse'
                  } gap-8 lg:gap-12 items-center`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${isEven ? 'lg:text-right' : 'lg:text-left'}`}>
                    <div className="inline-flex items-center gap-3 mb-4">
                      <div className="text-4xl font-bold gradient-text">
                        {step.number}
                      </div>
                      <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center text-white shadow-lg">
                        <Icon size={24} />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Timeline dot */}
                  <div className="hidden lg:flex items-center justify-center">
                    <div className="w-6 h-6 bg-red-600 rounded-full border-4 border-white shadow-lg relative z-10" />
                  </div>

                  {/* Spacer for layout */}
                  <div className="hidden lg:block flex-1" />
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
