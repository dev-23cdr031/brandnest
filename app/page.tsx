import { Navbar } from '@/components/Navbar'
import { HeroSection } from '@/components/sections/Hero'
import { TrustSection } from '@/components/sections/Trust'
import { TeamSection } from '@/components/sections/Team'
import { ProcessSection } from '@/components/sections/Process'
import { TestimonialsSection } from '@/components/sections/Testimonials'
import { PricingSection } from '@/components/sections/Pricing'
import { FAQSection } from '@/components/sections/FAQ'
import { ContactSection } from '@/components/sections/Contact'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <TrustSection />
      <TeamSection />
      <ProcessSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
