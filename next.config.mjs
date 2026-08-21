/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/services',
        permanent: false,
      },
    ]
  },
}

export default nextConfig