/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode
  reactStrictMode: true,
  
  // Enable server actions (if you're using them)
  experimental: {
    serverActions: true,
  },
  
  // Set the output to 'standalone' for better deployment
  output: 'standalone',
  
  // Configure images if you're using Next.js Image component
  images: {
    domains: ['localhost'],
  },
  
  // Environment variables that should be available to the client
  env: {
    // Add any client-side environment variables here
  },
}

module.exports = nextConfig
