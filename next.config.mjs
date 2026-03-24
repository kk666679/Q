/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  typescript: {
    // Allow builds even if type errors exist (not recommended for prod)
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  allowedDevOrigins: ['127.0.0.1', 'localhost'],

  // Empty turbopack config to silence the error when using webpack config
  turbopack: {},

  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
      fs: false,
      net: false,
      tls: false,
    }

    return config
  },
}

export default nextConfig
