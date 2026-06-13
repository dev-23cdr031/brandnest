import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { ServicesPricingSection } from '@/components/sections/ServicesPricingSection'

export const metadata = {
  title: 'Our Services & Pricing | Premium Agency',
  description:
    'Luxury red, black, and white services page with pricing, animations, and a project inquiry form for agencies, startups, and entrepreneurs.',
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <Navbar />
      <ServicesPricingSection />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}