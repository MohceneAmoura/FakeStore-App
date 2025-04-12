// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      appDir: true,
    },
    images: {
      domains: ['fakestoreapi.com'],
    },
  }
  
  export default nextConfig