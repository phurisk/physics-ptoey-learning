/** @type {import('next').NextConfig} */
const PORT = process.env.PORT ?? 3000

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
  experimental: {
    allowedDevOrigins: [
      `http://localhost:${PORT}`,
      `http://127.0.0.1:${PORT}`,
    ],
  },
}

export default nextConfig

