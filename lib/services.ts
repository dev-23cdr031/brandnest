export type Service = {
  title: string
  slug: string
  summary: string
  features: string[]
  price?: string
  gradient?: string
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const raw = [
  {
    title: 'Product Design & UX',
    summary: 'User-focused design and research to craft intuitive, beautiful interfaces.',
    features: ['User research', 'Wireframing', 'Prototyping', 'Design systems'],
    price: 'From $5,000',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    title: 'Web & Mobile Development',
    summary: 'High-performance, maintainable apps using modern web and mobile stacks.',
    features: ['React/Next.js', 'TypeScript', 'API design', 'Mobile apps'],
    price: 'From $10,000',
    gradient: 'from-blue-600 to-indigo-700',
  },
  {
    title: 'Brand Strategy & Identity',
    summary: 'Positioning, voice, and visual identity that resonate with your audience.',
    features: ['Brand workshops', 'Naming', 'Logo & identity', 'Guidelines'],
    price: 'From $7,500',
    gradient: 'from-purple-600 to-violet-700',
  },
  {
    title: 'Growth & Marketing',
    summary: 'Data-driven acquisition and retention strategies for scalable growth.',
    features: ['Performance ads', 'SEO', 'Content strategy', 'Funnel optimization'],
    price: 'Custom pricing',
    gradient: 'from-green-500 to-teal-600',
  },
]

export const services: Service[] = raw.map((s) => ({ ...s, slug: slugify(s.title) }))

export function getAllServices() {
  return services
}

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug) || null
}

export { slugify }
