import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { CareersSection } from '@/components/sections/Careers'

export const metadata = {
  title: 'Apply Now | Join Brandnest',
  description:
    'Apply for Full Stack Developer, Flutter Developer, UI/UX Designer, AI Engineer, Digital Marketing, QA, HR, and CRM roles at Brandnest. Internships and full-time positions with mentorship, certificates, and pre-placement offers.',
}

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <CareersSection />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}