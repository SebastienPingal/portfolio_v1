/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'media.licdn.com' },
      { hostname: 'upload.wikimedia.org' },
      { hostname: 'uoeohmz1cojcdmtr.public.blob.vercel-storage.com' },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['pdf-img-convert'],
    outputFileTracingIncludes: {
      '/api/convert-to-img': [
        './node_modules/.pnpm/pdfjs-dist*/node_modules/pdfjs-dist/legacy/build/pdf.worker.js',
        './node_modules/.pnpm/pdfjs-dist*/node_modules/pdfjs-dist/legacy/build/pdf.js',
      ],
    },
  },
}

export default nextConfig