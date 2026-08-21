import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { AboutPremiumSection } from '@/components/sections/AboutPremiumSection'

export const metadata = {
  title: 'About Us | Premium Red Luxury Agency',
  description:
    'A cinematic About Us page for a premium digital freelancer agency showcasing team story, achievements, expertise, and trust.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <AboutPremiumSection />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}