'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Link from 'next/link'

export function PricingSection() {
  const plans = [
    {
      name: 'Starter',
      price: '2,999',
      period: 'per month',
      description: 'Perfect for small projects and startups',
      features: [
        'Up to 5 pages',
        'Basic SEO optimization',
        'Mobile responsive design',
        'Email support',
        '1 revision round',
        'Basic analytics setup',
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Professional',
      price: '7,999',
      period: 'per month',
      description: 'Ideal for growing businesses',
      features: [
        'Up to 20 pages',
        'Advanced SEO optimization',
        'Mobile & tablet responsive',
        'Priority email & chat support',
        'Unlimited revisions',
        'Advanced analytics',
        'Blog functionality',
        'Contact forms & CRM integration',
        'Performance optimization',
      ],
      cta: 'Get Started',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'tailored solution',
      description: 'For large-scale projects',
      features: [
        'Unlimited pages',
        'Custom functionality',
        'API integrations',
        '24/7 dedicated support',
        'Custom analytics',
        'E-commerce capabilities',
        'Multi-language support',
        'White-label options',
        'Ongoing optimization',
      ],
      cta: 'Contact Us',
      highlighted: false,
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
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
            Flexible Pricing
          </p>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Plans for Every Budget
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your business and scale as you grow.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className={`relative rounded-2xl transition-all duration-300 ${
                plan.highlighted
                  ? 'md:scale-105 md:z-10'
                  : ''
              }`}
            >
              {/* Background */}
              <div
                className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-gradient-primary shadow-premium'
                    : 'bg-white border-2 border-gray-200 hover:border-red-600 hover:shadow-premium'
                }`}
              />

              {/* Content */}
              <div
                className={`relative p-8 h-full flex flex-col ${
                  plan.highlighted ? 'text-white' : 'text-gray-900'
                }`}
              >
                {/* Badge */}
                {plan.highlighted && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-white text-red-600 px-4 py-1 rounded-full font-bold text-sm">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${
                    plan.highlighted ? 'text-white' : 'text-gray-900'
                  }`}>
                    {plan.name}
                  </h3>
                  <p className={plan.highlighted ? 'text-white/80' : 'text-gray-600'}>
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-5xl font-bold ${
                      plan.highlighted ? 'text-white' : 'text-gray-900'
                    }`}>
                      {plan.price === 'Custom' ? (
                        plan.price
                      ) : (
                        <>
                          <span className="text-2xl">$</span>
                          {plan.price}
                        </>
                      )}
                    </span>
                    {plan.price !== 'Custom' && (
                      <span className={plan.highlighted ? 'text-white/80' : 'text-gray-600'}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href="/admin"
                  className={`mb-8 inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold transition ${
                    plan.highlighted
                      ? 'bg-white text-red-600 hover:bg-gray-100'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {plan.cta}
                </Link>

                {/* Features */}
                <div className="space-y-4 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex gap-3">
                      <Check
                        className={`w-5 h-5 flex-shrink-0 ${
                          plan.highlighted
                            ? 'text-white'
                            : 'text-red-600'
                        }`}
                      />
                      <span className={`text-sm ${
                        plan.highlighted ? 'text-white/90' : 'text-gray-600'
                      }`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
