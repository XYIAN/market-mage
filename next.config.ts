import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Optimize images
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },

  // Disable strict mode in development to avoid double rendering
  reactStrictMode: false,

  // Handle static files better
  trailingSlash: false,

  // Improve build performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig
