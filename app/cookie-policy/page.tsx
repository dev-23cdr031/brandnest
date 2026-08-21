import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { LegalPolicySection, type LegalPage } from '@/components/sections/LegalPolicySection'

export const metadata = {
  title: 'Cookie Policy | Brandnest',
  description: 'Cookie Policy for Brandnest explaining what cookies are, how they are used, cookie types, browser controls, updates, and contact information.',
}

const page = {
  eyebrow: 'Cookie Policy',
  title: 'Cookie Policy',
  subtitle: 'Understanding how we use cookies to improve your experience.',
  accent: 'cookies' as const,
  sections: [
    {
      id: 'what-are-cookies',
      title: 'What Are Cookies?',
      body: 'Cookies are small text files stored on your device that help websites function properly and improve user experience.',
      icon: 'cookie',
    },
    {
      id: 'how-we-use-cookies',
      title: 'How We Use Cookies',
      body: 'We use cookies to keep the website reliable, useful, secure, and easier to navigate.',
      items: ['Website Performance', 'Analytics', 'User Preferences', 'Security', 'Session Management'],
      icon: 'zap',
    },
    {
      id: 'essential-cookies',
      title: 'Essential Cookies',
      body: 'Required for website functionality.',
      icon: 'shield',
    },
    {
      id: 'analytics-cookies',
      title: 'Analytics Cookies',
      body: 'Help us understand visitor behavior.',
      icon: 'bar-chart',
    },
    {
      id: 'functional-cookies',
      title: 'Functional Cookies',
      body: 'Remember user preferences.',
      icon: 'settings',
    },
    {
      id: 'managing-cookies',
      title: 'Managing Cookies',
      body: 'Users can disable cookies through their browser settings. Please note that disabling cookies may affect certain website features.',
      icon: 'sliders',
    },
    {
      id: 'updates-to-this-policy',
      title: 'Updates to This Policy',
      body: 'We may update this Cookie Policy periodically.',
      icon: 'cookie',
    },
    {
      id: 'contact',
      title: 'Contact',
      body: 'For cookie-related questions, contact us using the email below.',
      icon: 'mail',
    },
  ],
  contact: {
    email: 'devdharrshan421@gmail.com',
  },
} satisfies LegalPage

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <LegalPolicySection page={page} />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
