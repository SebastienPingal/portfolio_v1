/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'media.licdn.com' },
      { hostname: 'upload.wikimedia.org' },
      { hostname: 'uoeohmz1cojcdmtr.public.blob.vercel-storage.com' },
    ],
  },
}

export default nextConfig