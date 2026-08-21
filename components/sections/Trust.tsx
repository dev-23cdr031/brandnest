'use client'

import { motion } from 'framer-motion'

export function TrustSection() {
  const clients = [
    { name: 'TechCorp' },
    { name: 'DesignHub' },
    { name: 'InnovateLabs' },
    { name: 'FutureScale' },
    { name: 'BrandPro' },
    { name: 'CloudFirst' },
  ]

  const benefits = [
    {
      number: '24/7',
      label: 'Support',
      description: 'Round-the-clock assistance for all your needs',
    },
    {
      number: '10+',
      label: 'Years Experience',
      description: 'Trusted by brands worldwide since 2014',
    },
    {
      number: '$50M+',
      label: 'Revenue Generated',
      description: 'For our clients through digital solutions',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 },
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
            Trusted By Leading Brands
          </p>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Join 150+ Companies Transforming Their Digital Future
          </h2>
        </motion.div>

        {/* Client Logos */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-20 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {clients.map((client, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex items-center justify-center h-20 bg-white rounded-lg border border-gray-200 hover:shadow-lg hover:border-red-600 transition-all duration-300"
            >
              <span className="text-gray-600 font-semibold text-center px-4">
                {client.name}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-red-600 hover:shadow-premium transition-all duration-300"
            >
              <div className="text-4xl font-bold gradient-text mb-2">
                {benefit.number}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {benefit.label}
              </h3>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
