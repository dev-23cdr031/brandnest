'use client'

import { MessageCircle } from 'lucide-react'

export function WhatsAppButton() {
  const whatsappNumber = '+1234567890' // Replace with actual number
  const whatsappMessage = 'Hi! I would like to discuss our digital strategy.'
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-gradient-primary rounded-full p-4 shadow-lg hover:shadow-premium transition-all duration-300 hover:scale-110 animate-float"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 text-white" />
    </a>
  )
}
