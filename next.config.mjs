import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    resolveExtensions: [
      '.mdx',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.mjs',
      '.json'
    ]
  },
  images: {
    remotePatterns: [
      { hostname: 'media.licdn.com' },
      { hostname: 'upload.wikimedia.org' },
      { hostname: 'uoeohmz1cojcdmtr.public.blob.vercel-storage.com' },
    ],
  },
  transpilePackages: ['@react-pdf/renderer'],
  webpack: (config) => {
    config.externals = [...config.externals, "jsdom"]
    config.resolve.alias.canvas = false
    return config
  },
}

export default withNextIntl(nextConfig)
