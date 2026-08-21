import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { LegalPolicySection, type LegalPage } from '@/components/sections/LegalPolicySection'

export const metadata = {
  title: 'Privacy Policy | Brandnest',
  description: 'Privacy Policy for Brandnest covering information collection, data usage, protection, third-party services, and contact details.',
}

const page = {
  eyebrow: 'Privacy Policy',
  title: 'Privacy Policy',
  subtitle: 'Your privacy and data security are important to us.',
  updated: 'June 13, 2026',
  accent: 'privacy' as const,
  sections: [
    {
      id: 'information-we-collect',
      title: 'Information We Collect',
      body: 'We may collect the information required to understand your project, communicate clearly, and improve our digital services.',
      items: [
        'Name',
        'Email Address',
        'Phone Number',
        'Company Information',
        'Project Requirements',
        'Website Usage Analytics',
      ],
      icon: 'user',
    },
    {
      id: 'how-we-use-information',
      title: 'How We Use Information',
      body: 'We use your information only for legitimate business, support, and service improvement purposes.',
      items: [
        'Respond to inquiries',
        'Deliver services',
        'Improve user experience',
        'Provide customer support',
        'Send project updates',
        'Improve website performance',
      ],
      icon: 'mail-question',
    },
    {
      id: 'data-protection',
      title: 'Data Protection',
      body: 'We implement security measures to protect your personal information against unauthorized access and misuse.',
      icon: 'lock',
    },
    {
      id: 'third-party-services',
      title: 'Third Party Services',
      body: 'Our website may use trusted third-party services. These services may collect limited information according to their own privacy policies.',
      items: ['Google Analytics', 'WhatsApp Integration', 'Email Services', 'Hosting Providers'],
      icon: 'bar-chart',
    },
    {
      id: 'contact-us',
      title: 'Contact Us',
      body: 'For privacy-related concerns, contact us using the details below.',
      icon: 'headphones',
    },
  ],
  contact: {
    email: 'devdharrshan421@gmail.com',
    phone: '9363534589',
  },
} satisfies LegalPage

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <LegalPolicySection page={page} />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
