'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'James Anderson',
      role: 'CEO, TechCorp',
      quote:
        'Studio transformed our digital presence completely. Their innovative approach and attention to detail exceeded all our expectations.',
      rating: 5,
    },
    {
      name: 'Michelle Chen',
      role: 'Marketing Director, BrandPro',
      quote:
        'Working with Studio was seamless. They understood our vision and delivered a solution that drove 300% increase in engagement.',
      rating: 5,
    },
    {
      name: 'David Wilson',
      role: 'Founder, StartupHub',
      quote:
        'Exceptional team. They not only built our platform but became true strategic partners in our growth journey.',
      rating: 5,
    },
    {
      name: 'Sarah Parker',
      role: 'VP Product, InnovateLabs',
      quote:
        'From concept to launch, Studio delivered excellence at every step. Their expertise and professionalism are unmatched.',
      rating: 5,
    },
  ]

  const [current, setCurrent] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [autoPlay, testimonials.length])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <section className="py-24 bg-gray-50">
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
            What Clients Say
          </p>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Loved by Leading Brands
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real feedback from clients whose businesses we&apos;ve transformed.
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div
            className="relative bg-white rounded-2xl p-8 lg:p-12 border-2 border-gray-200 shadow-premium"
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
          >
            {/* Testimonial Content */}
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Rating */}
              <div className="flex justify-center gap-2 mb-6">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={24}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-8 leading-tight">
                &ldquo;{testimonials[current].quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {testimonials[current].name}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {testimonials[current].role}
                </p>
              </div>
            </motion.div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrent(index)
                    setAutoPlay(false)
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === current
                      ? 'bg-red-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 pointer-events-none">
              <button
                onClick={() => {
                  setCurrent((prev) =>
                    prev === 0 ? testimonials.length - 1 : prev - 1
                  )
                  setAutoPlay(false)
                }}
                className="pointer-events-auto w-10 h-10 rounded-full bg-white border-2 border-gray-200 hover:border-red-600 flex items-center justify-center shadow-lg hover:shadow-premium transition-all"
                aria-label="Previous testimonial"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() => {
                  setCurrent((prev) => (prev + 1) % testimonials.length)
                  setAutoPlay(false)
                }}
                className="pointer-events-auto w-10 h-10 rounded-full bg-white border-2 border-gray-200 hover:border-red-600 flex items-center justify-center shadow-lg hover:shadow-premium transition-all"
                aria-label="Next testimonial"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
