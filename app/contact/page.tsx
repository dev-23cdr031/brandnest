import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { ContactSection } from '@/components/sections/Contact'

export const metadata = {
  title: 'Contact Brandnest | Futuristic Project Inquiry',
  description:
    'Start a premium website, mobile app, AI, branding, marketing, or custom innovation project with Brandnest.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
