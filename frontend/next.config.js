/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'pleasant-card-4dcaa4dd10.media.strapiapp.com',
        pathname: '/**',
      },
    ],
    minimumCacheTTL: 60,
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [50, 75, 100],
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production',
  },
}

module.exports = nextConfig
