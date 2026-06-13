import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { TeamSection } from '@/components/sections/Team'
import { WhatsAppButton } from '@/components/WhatsAppButton'

export const metadata = {
  title: 'Meet Our Team | Premium Agency',
  description:
    'Meet the premium digital agency team behind innovative web, mobile, AI, design, and marketing solutions.',
}

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <TeamSection />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
