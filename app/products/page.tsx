import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { ProductsInnovationsSection } from '@/components/sections/ProductsInnovationsSection'

export const metadata = {
  title: 'Products & Innovations | Brandnest',
  description:
    'Explore Brandnest innovation portfolio: AI safety systems, space technology dashboards, renewable energy platforms, and scalable products available for demos, licensing, and commercialization.',
}

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <ProductsInnovationsSection />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
