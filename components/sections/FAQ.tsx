'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      question: 'How long does a typical project take?',
      answer:
        "Project timelines vary based on scope and complexity. Starter projects typically take 4-6 weeks, while larger projects may take 3-6 months. We'll provide a detailed timeline during our initial consultation.",
    },
    {
      question: 'What is your process for client communication?',
      answer:
        'We maintain regular communication through scheduled calls, email updates, and a project management portal. You&apos;ll have a dedicated team member as your primary point of contact throughout the project.',
    },
    {
      question: 'Do you offer post-launch support?',
      answer:
        'Yes! All our plans include ongoing support. We provide maintenance, updates, and optimization services to ensure your digital solution continues to perform at its best.',
    },
    {
      question: 'Can you integrate with existing systems?',
      answer:
        'Absolutely. We specialize in integrating with various platforms and APIs. Whether it&apos;s CRM systems, payment gateways, or analytics tools, we can connect your solution to your existing tech stack.',
    },
    {
      question: 'What if I need changes after launch?',
      answer:
        'We offer flexible support packages to accommodate post-launch changes. Minor updates are often included in your ongoing support, while larger changes can be discussed and quoted separately.',
    },
    {
      question: 'How do you ensure quality?',
      answer:
        'Quality is paramount to us. We follow industry best practices, conduct rigorous testing, perform code reviews, and maintain high standards for performance, security, and accessibility.',
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-red-600 font-semibold uppercase tracking-widest mb-4">
            FAQs
          </p>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Common Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about working with Studio.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden hover:border-red-600 transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-red-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Answer */}
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200 px-6 py-4 bg-gray-50"
                >
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          className="mt-16 text-center p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-red-600 hover:shadow-premium transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Didn&apos;t find what you&apos;re looking for?
          </h3>
          <p className="text-gray-600 mb-6">
            Our team is here to answer any questions you have.
          </p>
          <button className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-premium transition-all duration-300">
            Contact Us
          </button>
        </motion.div>
      </div>
    </section>
  )
}
