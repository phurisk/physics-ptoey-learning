/** @type {import('next').NextConfig} */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://e-learning-weld-gamma.vercel.app'

const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    const toExt = (group) => ({ source: `/api/${group}/:path*`, destination: `${API_BASE}/api/${group}/:path*` })
    return [
      // Public namespaces
      toExt('posts'),
      toExt('ebooks'),
      toExt('ebook-categories'),
      toExt('courses'),
      toExt('exams'),
      toExt('exam-categories'),
      toExt('orders'),
      toExt('payments'),
      toExt('upload'),
      toExt('my-courses'),
      toExt('users'),
      toExt('user'),
      toExt('coupons'),
      toExt('enrollments'),
      // Admin namespace
      { source: '/api/admin/:path*', destination: `${API_BASE}/api/admin/:path*` },
    ]
  },
}

export default nextConfig
