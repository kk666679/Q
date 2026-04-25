/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 16 - React Compiler support (stable)
  reactCompiler: true,
  
  // Strict mode for better React practices
  reactStrictMode: true,

  // TypeScript configuration
  typescript: {
    // Allow builds even if type errors exist (not recommended for prod)
    ignoreBuildErrors: true,
  },

  // Image optimization
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Development origins
  allowedDevOrigins: ['127.0.0.1', 'localhost'],

  // Experimental features for Next.js 16
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Optimize package imports
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'recharts',
      'framer-motion',
    ],
  },

  // Turbopack is now stable in Next.js 16 and used by default with `next dev --turbopack`
  // No configuration needed

  // Webpack configuration for edge cases
  webpack: (config, { isServer }) => {
    // Handle Node.js modules that shouldn't be bundled client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }
    
    // Handle ES modules
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return config
  },

  // When using a custom webpack config with Next.js 16 Turbopack,
  // an explicit empty turbopack config avoids the ambiguous build failure.
  turbopack: {},
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },
}

export default nextConfig
