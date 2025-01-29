/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      moduleIdStrategy: 'deterministic',
      resolveExtensions: [
        '.mdx',
        '.tsx', 
        '.ts',
        '.jsx',
        '.js',
        '.mjs',
        '.json'
      ]
    }
  },
  images: {
    remotePatterns: [
      { hostname: 'media.licdn.com' },
      { hostname: 'upload.wikimedia.org' },
      { hostname: 'uoeohmz1cojcdmtr.public.blob.vercel-storage.com' },
    ],
  },
  transpilePackages: ['@react-pdf/renderer'],
  serverExternalPackages: ['pdf-img-convert'],
  outputFileTracingIncludes: {
    '/api/convert-to-img': [
      './node_modules/.pnpm/pdfjs-dist*/node_modules/pdfjs-dist/legacy/build/pdf.worker.js',
      './node_modules/.pnpm/pdfjs-dist*/node_modules/pdfjs-dist/legacy/build/pdf.js',
    ],
  },
  webpack: (config) => {
    config.externals = [...config.externals, "jsdom"]
    return config
  },
}

export default nextConfig