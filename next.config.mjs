/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
  },  // Server Actions are enabled by default in Next.js 14
  experimental: {},
  typescript: {
    ignoreBuildErrors: false,
  },
  // Disable static exports as we need server-side features
  output: 'standalone',
  // Enable more verbose build output for debugging deployment issues
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
