'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Trophy } from 'lucide-react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/team', label: 'Team' },
    { href: '/contact', label: 'Contact' },
    { href: '/products', label: 'Products' },
    { href: '/hackathon-winners', label: 'Hackathon Winners', highlight: true },
    { href: '/my-orders', label: 'My Orders' },
  ]

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/brandnest-logo.png" alt="Brandnest logo" width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
            <span className="text-2xl font-bold gradient-text">Brandnest</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  link.highlight
                    ? 'inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-amber-600 font-bold hover:bg-amber-500/20'
                    : isScrolled
                      ? 'text-gray-700 hover:text-red-600'
                      : 'text-white hover:text-primary-300'
                }`}
              >
                {link.highlight && <Trophy className="h-3.5 w-3.5" />}
                {link.label}
              </Link>
            ))}
            <Link
              href="/signup"
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-red-700 hover:shadow-premium"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isScrolled
                  ? 'text-gray-900 hover:bg-gray-100'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 animate-slideInDown">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 rounded-lg transition-colors ${
                    link.highlight
                      ? 'bg-amber-50 text-amber-700 font-bold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.highlight && <Trophy className="mr-1.5 inline h-4 w-4" />}
                  {link.label}
                </Link>
              ))}
              <div className="px-3 py-2">
                <Link
                  href="/signup"
                  className="block w-full rounded-lg bg-red-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-red-700"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}