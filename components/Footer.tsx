import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone } from 'lucide-react'

const fundingPartners = [
  {
    name: "Scoops N' Smiles Cafe",
    logo: '/funding-partners/scoops-n-smiles-cafe.png',
  },
  {
    name: 'Abis Foods',
    logo: '/funding-partners/abis-foods.jpg',
  },
  {
    name: 'Idhayam',
    logo: '/funding-partners/idhayam.png',
  },
  {
    name: 'Kali Mark',
    logo: '/funding-partners/kali-mark.jpg',
  },
]

export function Footer() {
  const footerLinks = {
    Services: ['Web Design', 'Development', 'Branding', 'Strategy'],
    Company: ['About Us', 'Team', 'Contact'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
  }

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="mb-4 flex items-center gap-3">
              <Image src="/brandnest-logo.png" alt="Brandnest logo" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
              <h3 className="text-2xl font-bold gradient-text">Brandnest</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your freelance sanctuary for premium web, brand, AI, and marketing solutions.
            </p>
          </div>

          {/* Quick Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4 text-white">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href={
                        category === 'Services'
                          ? '/services'
                          : category === 'Legal' && link === 'Privacy Policy'
                            ? '/privacy-policy'
                            : category === 'Legal' && link === 'Terms of Service'
                              ? '/terms-of-service'
                              : category === 'Legal' && link === 'Cookie Policy'
                                ? '/cookie-policy'
                          : category === 'Company' && link === 'About Us'
                            ? '/about'
                            : category === 'Company' && link === 'Team'
                              ? '/team'
                              : category === 'Company' && link === 'Contact'
                                ? '/#contact'
                                : '#'
                      }
                      className="text-gray-400 hover:text-red-400 transition-colors text-sm"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Funding Partners */}
        <div className="mt-14 border-t border-gray-800 pt-12">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-red-400">Backing Our Vision</p>
            <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Our Funding Partners</h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">
              Proudly supported by trusted brands that believe in innovation, creativity, and meaningful growth.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {fundingPartners.map((partner) => (
              <div
                key={partner.name}
                className="group flex min-h-36 items-center justify-center rounded-2xl border border-white/10 bg-white p-5 shadow-[0_14px_40px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:border-red-400/50 hover:shadow-[0_18px_45px_rgba(220,38,38,0.18)]"
              >
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  width={260}
                  height={160}
                  className="h-24 w-full object-contain transition duration-300 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 mt-12 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="flex gap-3">
              <Phone className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-400 text-sm">Phone</p>
                <a href="tel:9363534589" className="text-white font-medium transition hover:text-red-300">9363534589</a>
              </div>
            </div>
            <div className="flex gap-3">
              <Mail className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <a href="mailto:devdharrshan421@gmail.com" className="text-white font-medium transition hover:text-red-300">devdharrshan421@gmail.com</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
          <div className="text-center sm:text-left">
            <p>&copy; 2026 Brandnest. All Rights Reserved.</p>
            <p className="mt-2 text-gray-500">&quot;Innovating Today, Building Tomorrow.&quot;</p>
          </div>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link href="https://www.linkedin.com/in/devdharrshans/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              LinkedIn
            </Link>
            <Link href="https://www.instagram.com/dev_.dharrshan._19?utm_source=qr&igsh=cjhiZWlzNzl3YjBq" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              Instagram
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
