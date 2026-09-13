'use client'

import { useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Briefcase,
  Bug,
  CheckCircle2,
  Code2,
  GraduationCap,
  Handshake,
  Loader2,
  MapPin,
  Megaphone,
  Palette,
  Rocket,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trophy,
  Users,
  Wallet,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Opening = {
  id: string
  title: string
  department: string
  type: string
  location: string
  experience: string
  skills: string[]
  description: string
  icon: typeof Code2
}

const openings: Opening[] = [
  {
    id: 'fullstack-developer',
    title: 'Full Stack Developer',
    department: 'Engineering',
    type: 'Full-time · Internship',
    location: 'Remote · On-site (Virudhunagar / Dindigul)',
    experience: 'Fresher to 3 years',
    skills: ['Next.js / React', 'Node.js', 'Supabase / SQL', 'Tailwind CSS'],
    description: 'Design and build complete web products — from pixel-perfect UI to secure APIs and databases — for real client projects.',
    icon: Code2,
  },
  {
    id: 'mobile-developer',
    title: 'Mobile App Developer (Flutter)',
    department: 'Engineering',
    type: 'Full-time · Internship',
    location: 'Remote · On-site (Virudhunagar / Dindigul)',
    experience: 'Fresher to 3 years',
    skills: ['Flutter', 'Dart', 'REST APIs', 'Firebase'],
    description: 'Craft high-performance cross-platform mobile apps with smooth animations and rock-solid API integration.',
    icon: Smartphone,
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    department: 'Design',
    type: 'Full-time · Internship',
    location: 'Remote',
    experience: 'Fresher to 2 years',
    skills: ['Figma', 'Wireframing', 'Prototyping', 'Design Systems'],
    description: 'Turn complex problems into intuitive, beautiful interfaces and keep the Brandnest design language sharp.',
    icon: Palette,
  },
  {
    id: 'ai-engineer',
    title: 'AI & Automation Engineer',
    department: 'AI',
    type: 'Full-time · Internship',
    location: 'Remote',
    experience: 'Fresher to 3 years',
    skills: ['Generative AI', 'Prompt Engineering', 'Python', 'Automation'],
    description: 'Build AI-powered features and automations that make client businesses smarter and faster.',
    icon: Sparkles,
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Executive',
    department: 'Growth',
    type: 'Full-time · Internship',
    location: 'Remote',
    experience: 'Fresher to 2 years',
    skills: ['SEO', 'Social Media', 'Content Strategy', 'Analytics'],
    description: 'Grow brand reach and generate leads through data-driven SEO, campaigns, and social media.',
    icon: Megaphone,
  },
  {
    id: 'qa-tester',
    title: 'QA / Software Tester',
    department: 'Quality',
    type: 'Full-time · Internship',
    location: 'Remote',
    experience: 'Fresher',
    skills: ['Manual Testing', 'Bug Reporting', 'Attention to Detail'],
    description: 'Break things before clients do — test every release and keep Brandnest products polished and reliable.',
    icon: Bug,
  },
  {
    id: 'hr-executive',
    title: 'HR & Recruitment Executive',
    department: 'People Ops',
    type: 'Full-time · Internship',
    location: 'Remote · On-site (Virudhunagar / Dindigul)',
    experience: 'Fresher to 2 years',
    skills: ['Sourcing', 'Coordination', 'Communication', 'Onboarding'],
    description: 'Find and onboard great talent, coordinate interviews, and keep the team culture strong.',
    icon: Users,
  },
  {
    id: 'crm-executive',
    title: 'Client Relations Executive (CRM)',
    department: 'Client Success',
    type: 'Full-time · Internship',
    location: 'Remote',
    experience: 'Fresher to 2 years',
    skills: ['Communication', 'Client Handling', 'Follow-ups', 'CRM Tools'],
    description: 'Be the bridge between clients and the team — onboard clients and keep every project running smoothly.',
    icon: Handshake,
  },
]

const perks = [
  { title: 'Real Client Projects', text: 'Work on live products used by startups and businesses — not dummy tasks.', icon: Rocket },
  { title: 'Direct Mentorship', text: 'Learn directly from senior developers, designers, and the founding team.', icon: GraduationCap },
  { title: 'Certificate + LOR', text: 'Every internship comes with a certificate and letter of recommendation.', icon: Trophy },
  { title: 'Pre-Placement Offers', text: 'Top performers convert into full-time roles with a proper salary.', icon: Briefcase },
  { title: 'Flexible & Remote-friendly', text: 'Hybrid work, flexible hours, and a results-first culture.', icon: MapPin },
  { title: 'Paid Internships', text: 'Monthly stipends for interns who deliver consistently.', icon: Wallet },
  { title: 'Hackathons & Innovation', text: 'Compete in internal hackathons and ship your own product ideas.', icon: Sparkles },
  { title: 'Fast Growth Path', text: 'Clear ownership, quick responsibility, and visible career growth.', icon: ShieldCheck },
]

const hiringSteps = [
  { step: '1', title: 'Apply', text: 'Fill the application form below with your details and resume link.' },
  { step: '2', title: 'Screening', text: 'Our HR team reviews your profile and reaches out within 3–5 working days.' },
  { step: '3', title: 'Task Round', text: 'A short technical or domain task to showcase your real skills.' },
  { step: '4', title: 'Interview', text: 'A friendly conversation with the team lead about you and your work.' },
  { step: '5', title: 'Offer', text: 'Welcome aboard — you receive your offer letter and onboarding plan!' },
]

const qualifications = ['B.E / B.Tech', 'B.Sc / BCA', 'B.Com / BBA', 'M.E / M.Tech', 'MCA', 'MBA', 'M.Sc', 'Other']
const graduationYears = ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031']
const jobTypes = ['Full-time', 'Internship', 'Part-time']
const experienceLevels = ['Student', 'Fresher', '1–3 years', '3+ years']
const workLocations = ['Remote', 'On-site (Virudhunagar, TN)', 'On-site (Dindigul, TN)', 'Hybrid']
const heardFromOptions = ['LinkedIn', 'Instagram', 'College', 'Friend / Referral', 'Google Search', 'Other']

const inputClass =
  'w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-red-300/60 focus:shadow-[0_0_30px_rgba(220,38,38,0.14)]'
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-white/50'

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  college: '',
  qualification: 'B.E / B.Tech',
  graduationYear: '2026',
  position: '',
  jobType: 'Full-time',
  experienceLevel: 'Fresher',
  yearsExperience: '0',
  skills: '',
  portfolio: '',
  github: '',
  linkedin: '',
  resume: '',
  workLocation: 'Remote',
  availableFrom: '',
  coverLetter: '',
  heardFrom: 'LinkedIn',
  consent: false,
}

export function CareersSection() {
  const formRef = useRef<HTMLDivElement | null>(null)
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [referenceId, setReferenceId] = useState('')
  const [error, setError] = useState('')

  const update =
    (key: keyof typeof form) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const applyForRole = (title: string) => {
    setForm((prev) => ({ ...prev, position: title }))
    setSubmitted(false)
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.consent) {
      setError('Please accept the consent checkbox to submit your application.')
      return
    }
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    const { data, error: insertError } = await supabase
      .from('job_applications')
      .insert([
        {
          full_name: form.fullName,
          email: form.email,
          phone: form.phone,
          college_company: form.college,
          qualification: form.qualification,
          graduation_year: form.graduationYear,
          position: form.position,
          job_type: form.jobType,
          experience_level: form.experienceLevel,
          years_experience: form.yearsExperience,
          skills: form.skills,
          portfolio_url: form.portfolio,
          github_url: form.github,
          linkedin_url: form.linkedin,
          resume_url: form.resume,
          work_location: form.workLocation,
          available_from: form.availableFrom || null,
          cover_letter: form.coverLetter,
          heard_from: form.heardFrom,
          status: 'New',
          user_id: user?.id ?? null,
        },
      ])
      .select('id')

    setLoading(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    const id = (data as { id: string }[] | null)?.[0]?.id
    setReferenceId(id ? `BRN-${id.slice(0, 8).toUpperCase()}` : 'BRN-NEW')
    setSubmitted(true)
  }

  return (
    <div className="overflow-hidden bg-[#050505] text-white">
      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[70vh] items-center px-4 py-28 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,38,38,0.22),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(245,158,11,0.14),transparent_40%),linear-gradient(160deg,#0a0505_0%,#160404_50%,#050505_100%)]" />
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-amber-300">
              <Sparkles className="h-3.5 w-3.5" />
              We are hiring
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Build the future with{' '}
              <span className="bg-gradient-to-r from-red-500 via-red-400 to-amber-400 bg-clip-text text-transparent">
                Brandnest
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/70">
              Join a fast-growing product studio of 18+ makers shipping web, mobile, AI, and design
              solutions for real clients. Learn fast, own real work, and grow with us.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#apply"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-8 py-4 font-bold text-black shadow-[0_20px_60px_rgba(245,158,11,0.35)] transition hover:scale-[1.02]"
              >
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#openings"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-8 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                View Open Roles
              </a>
            </div>
            <div className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-4">
              {[
                { value: '8', label: 'Open Roles' },
                { value: '18+', label: 'Team Members' },
                { value: '10+', label: 'Products Shipped' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-2xl font-black text-amber-300 sm:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/50">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ WHY JOIN ============ */}
      <section id="why-join" className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-400">Why Join Us</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              More than a job — a launchpad
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/60">
              Everything you get as a part of the Brandnest team.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((perk, index) => (
              <motion.article
                key={perk.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-amber-400/40 hover:bg-white/[0.07]"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 transition group-hover:scale-110">
                  <perk.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-white">{perk.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{perk.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ OPEN ROLES ============ */}
      <section id="openings" className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(220,38,38,0.12),transparent_45%)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-400">Open Positions</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Find your role
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/60">
              Pick a role that matches your skills — students and freshers are welcome for every internship track.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {openings.map((opening, index) => (
              <motion.article
                key={opening.id}
                className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-red-400/40 hover:bg-white/[0.06]"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: (index % 2) * 0.08 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400 transition group-hover:scale-110">
                      <opening.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{opening.title}</h3>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                        {opening.department}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300">
                    {opening.type}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-white/60">{opening.description}</p>

                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-white/50">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-red-400" />
                    {opening.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-red-400" />
                    {opening.experience}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {opening.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => applyForRole(opening.title)}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-5 py-3 text-sm font-bold text-amber-300 transition hover:bg-amber-500/20 hover:text-amber-200"
                >
                  Apply for this role
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HIRING PROCESS ============ */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-400">Hiring Process</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              From application to offer in 4 steps
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {hiringSteps.map((step, index) => (
              <motion.div
                key={step.step}
                className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-500 text-sm font-black text-white">
                  {step.step}
                </span>
                <h3 className="mt-3 font-bold text-white">{step.title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-white/55">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ APPLICATION FORM ============ */}
      <section id="apply" ref={formRef} className="relative scroll-mt-20 px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_80%,rgba(245,158,11,0.1),transparent_45%),radial-gradient(circle_at_90%_30%,rgba(220,38,38,0.14),transparent_40%)]" />
        <div className="relative mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400">Apply Now</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Tell us about yourself
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/60">
              Fill in every detail below — the more we know about you, the faster we can move your
              application forward. Fields marked * are required.
            </p>
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
            {submitted ? (
              <div className="rounded-2xl border border-green-400/30 bg-green-500/10 p-8 text-center">
                <CheckCircle2 className="mx-auto h-14 w-14 text-green-400" />
                <h3 className="mt-4 text-2xl font-black text-white">Application Received!</h3>
                <p className="mt-2 text-white/70">
                  Thanks {form.fullName}! Your application for{' '}
                  <span className="font-bold text-green-300">{form.position || 'your chosen role'}</span> has been
                  submitted successfully.
                </p>
                <div className="mx-auto mt-6 max-w-md rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
                  <p>
                    Reference ID: <span className="font-bold text-amber-300">{referenceId}</span>
                  </p>
                  <p className="mt-1">Our HR team will contact you via email or WhatsApp within 3–5 working days.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setForm(initialForm)
                    setSubmitted(false)
                    setReferenceId('')
                  }}
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Submit another application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal details */}
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.25em] text-red-400">Personal Details</h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <label className="block">
                      <span className={labelClass}>Full Name *</span>
                      <input required type="text" value={form.fullName} onChange={update('fullName')} placeholder="Your full name" className={inputClass} />
                    </label>
                    <label className="block">
                      <span className={labelClass}>Email Address *</span>
                      <input required type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" className={inputClass} />
                    </label>
                    <label className="block">
                      <span className={labelClass}>Phone / WhatsApp *</span>
                      <input required type="tel" value={form.phone} onChange={update('phone')} placeholder="+91 98765 43210" className={inputClass} />
                    </label>
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.25em] text-red-400">Education & Background</h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className={labelClass}>College / Company *</span>
                      <input required type="text" value={form.college} onChange={update('college')} placeholder="e.g. Kongu Engineering College" className={inputClass} />
                    </label>
                    <label className="block">
                      <span className={labelClass}>Qualification *</span>
                      <select required value={form.qualification} onChange={update('qualification')} className={inputClass}>
                        {qualifications.map((q) => (
                          <option key={q} value={q} className="bg-[#0c0c0c]">{q}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className={labelClass}>Graduation Year *</span>
                      <select required value={form.graduationYear} onChange={update('graduationYear')} className={inputClass}>
                        {graduationYears.map((y) => (
                          <option key={y} value={y} className="bg-[#0c0c0c]">{y}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className={labelClass}>Experience Level *</span>
                      <select required value={form.experienceLevel} onChange={update('experienceLevel')} className={inputClass}>
                        {experienceLevels.map((lvl) => (
                          <option key={lvl} value={lvl} className="bg-[#0c0c0c]">{lvl}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className={labelClass}>Years of Experience</span>
                      <input type="text" value={form.yearsExperience} onChange={update('yearsExperience')} placeholder="e.g. 1.5" className={inputClass} />
                    </label>
                    <label className="block">
                      <span className={labelClass}>Key Skills *</span>
                      <input required type="text" value={form.skills} onChange={update('skills')} placeholder="e.g. React, Figma, SEO (comma separated)" className={inputClass} />
                    </label>
                  </div>
                </div>

                {/* Role */}
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.25em] text-red-400">Role You Are Applying For</h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <label className="block">
                      <span className={labelClass}>Position *</span>
                      <select required value={form.position} onChange={update('position')} className={inputClass}>
                        <option value="" disabled className="bg-[#0c0c0c]">Select a position</option>
                        {openings.map((o) => (
                          <option key={o.id} value={o.title} className="bg-[#0c0c0c]">{o.title}</option>
                        ))}
                        <option value="Other" className="bg-[#0c0c0c]">Other (tell us in the message)</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className={labelClass}>Job Type *</span>
                      <select required value={form.jobType} onChange={update('jobType')} className={inputClass}>
                        {jobTypes.map((t) => (
                          <option key={t} value={t} className="bg-[#0c0c0c]">{t}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className={labelClass}>Preferred Work Location *</span>
                      <select required value={form.workLocation} onChange={update('workLocation')} className={inputClass}>
                        {workLocations.map((loc) => (
                          <option key={loc} value={loc} className="bg-[#0c0c0c]">{loc}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>

                {/* Links */}
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.25em] text-red-400">Portfolio & Profiles</h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className={labelClass}>Resume Link (Google Drive / Dropbox) *</span>
                      <input required type="url" value={form.resume} onChange={update('resume')} placeholder="https://drive.google.com/..." className={inputClass} />
                    </label>
                    <label className="block">
                      <span className={labelClass}>Portfolio / Website</span>
                      <input type="url" value={form.portfolio} onChange={update('portfolio')} placeholder="https://yourportfolio.com" className={inputClass} />
                    </label>
                    <label className="block">
                      <span className={labelClass}>GitHub</span>
                      <input type="url" value={form.github} onChange={update('github')} placeholder="https://github.com/username" className={inputClass} />
                    </label>
                    <label className="block">
                      <span className={labelClass}>LinkedIn</span>
                      <input type="url" value={form.linkedin} onChange={update('linkedin')} placeholder="https://linkedin.com/in/username" className={inputClass} />
                    </label>
                  </div>
                </div>

                {/* Final details */}
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.25em] text-red-400">Final Details</h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className={labelClass}>Available From</span>
                      <input type="date" value={form.availableFrom} onChange={update('availableFrom')} className={inputClass} />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className={labelClass}>Why do you want to join Brandnest? *</span>
                      <textarea
                        required
                        rows={5}
                        value={form.coverLetter}
                        onChange={update('coverLetter')}
                        placeholder="Tell us about yourself, your projects, achievements, and why you would be a great fit..."
                        className={`${inputClass} resize-none`}
                      />
                    </label>
                    <label className="block">
                      <span className={labelClass}>How did you hear about us? *</span>
                      <select required value={form.heardFrom} onChange={update('heardFrom')} className={inputClass}>
                        {heardFromOptions.map((src) => (
                          <option key={src} value={src} className="bg-[#0c0c0c]">{src}</option>
                        ))}
                      </select>
                    </label>
                    <label className="flex items-start gap-3 self-end rounded-xl border border-white/10 bg-black/40 p-4">
                      <input
                        required
                        type="checkbox"
                        checked={form.consent}
                        onChange={(e) => setForm((prev) => ({ ...prev, consent: e.target.checked }))}
                        className="mt-0.5 h-4 w-4 accent-red-500"
                      />
                      <span className="text-xs leading-5 text-white/60">
                        I confirm the information provided is accurate and I consent to Brandnest storing and
                        processing my application as per the{' '}
                        <a href="/privacy-policy" className="font-semibold text-red-300 underline">Privacy Policy</a>. *
                      </span>
                    </label>
                  </div>
                </div>

                {error && (
                  <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-8 py-4 font-bold text-black shadow-[0_20px_60px_rgba(245,158,11,0.35)] transition hover:scale-[1.01] disabled:opacity-60 sm:w-auto"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
                  {loading ? 'Submitting Application...' : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.2),transparent_55%)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <Trophy className="mx-auto h-10 w-10 text-amber-400" />
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Still have questions?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/60">
            Reach out to our team through the contact page — we&apos;re happy to help you pick the right
            role before you apply.
          </p>
          <a
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-8 py-4 font-semibold text-white transition hover:bg-white/10"
          >
            Contact Our Team
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  )
}