import { getServiceBySlug } from '../../../lib/services'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

type Props = { params: { slug: string } }

export default function ServiceDetail({ params }: Props) {
  const service = getServiceBySlug(params.slug)
  if (!service) return notFound()

  return (
    <main className="min-h-screen py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/services" className="inline-flex items-center gap-2 text-gray-700 mb-6">
          <ArrowLeft /> Back to Services
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl font-extrabold">{service.title}</h1>
          <p className="text-gray-600 mt-3">{service.summary}</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold mb-3">What we deliver</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {service.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold mb-3">Pricing</h3>
            <p className="text-gray-700 mb-4">{service.price}</p>
            <Link href="/admin" className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg font-semibold">
              Start a Project
            </Link>
          </div>
        </section>

        <section className="mt-10">
          <h3 className="text-2xl font-bold mb-4">Process</h3>
          <ol className="list-decimal pl-6 space-y-3 text-gray-700">
            <li>Discovery & research</li>
            <li>Concepts & design</li>
            <li>Implementation & testing</li>
            <li>Launch & iterate</li>
          </ol>
        </section>
      </div>
    </main>
  )
}
