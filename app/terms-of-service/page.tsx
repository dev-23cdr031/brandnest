import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { LegalPolicySection, type LegalPage } from '@/components/sections/LegalPolicySection'

export const metadata = {
  title: 'Terms of Service | Brandnest',
  description: 'Terms of Service for Brandnest covering services, project agreements, payments, intellectual property, liability, and termination.',
}

const page = {
  eyebrow: 'Terms of Service',
  title: 'Terms of Service',
  subtitle: 'Please read these terms carefully before using our services.',
  accent: 'terms' as const,
  sections: [
    {
      id: 'services',
      title: 'Services',
      body: 'We provide professional creative, technical, and digital growth services for businesses, startups, and organizations.',
      items: [
        'Website Development',
        'Mobile App Development',
        'AI Video Advertisement Creation',
        'Poster Design',
        'Logo Design',
        'Web Hosting',
        'Digital Marketing',
      ],
      icon: 'file-check',
    },
    {
      id: 'project-agreement',
      title: 'Project Agreement',
      body: 'A clear project agreement helps both teams move faster and avoid confusion during delivery.',
      items: [
        'Project work begins after confirmation.',
        'Requirements must be clearly communicated.',
        'Delivery timelines depend on project complexity.',
        'Additional changes beyond scope may incur extra charges.',
      ],
      icon: 'file-check',
    },
    {
      id: 'payments',
      title: 'Payments',
      body: 'Payment terms may vary depending on project size, timeline, and customization requirements.',
      items: [
        'Advance payment may be required.',
        'Remaining payment due before final delivery.',
        'Custom pricing depends on project requirements.',
      ],
      icon: 'badge-dollar',
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      body: 'Upon full payment, ownership of the final deliverables transfers to the client unless otherwise agreed.',
      icon: 'scale',
    },
    {
      id: 'limitation-of-liability',
      title: 'Limitation of Liability',
      body: 'We are not responsible for issues caused by external platforms, providers, or improper use after delivery.',
      items: [
        'Third-party service failures',
        'Hosting outages',
        'Domain registration issues',
        'Client-side misuse of deliverables',
      ],
      icon: 'shield-alert',
    },
    {
      id: 'termination',
      title: 'Termination',
      body: 'We reserve the right to terminate services if terms are violated.',
      icon: 'x-circle',
    },
    {
      id: 'contact-information',
      title: 'Contact Information',
      body: 'For questions about these Terms of Service, contact us using the email below.',
      icon: 'mail',
    },
  ],
  contact: {
    email: 'devdharrshan421@gmail.com',
  },
} satisfies LegalPage

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <LegalPolicySection page={page} />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
