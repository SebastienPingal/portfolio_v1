/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'media.licdn.com' },
      { hostname: 'upload.wikimedia.org' },
    ],
  },
}

export default nextConfig