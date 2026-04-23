/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/roadmap',
        destination: '/about',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
