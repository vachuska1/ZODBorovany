/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode
  reactStrictMode: true,
  
  // Enable server actions (if you're using them)
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // Set the output to 'standalone' for better deployment
  output: 'standalone',
  
  // Configure images if you're using Next.js Image component
  images: {
    domains: ['res.cloudinary.com', 'localhost'],
  },
  
  // Configure CORS for development
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },
  
  // Environment variables that should be available to the client
  env: {
    // Add any client-side environment variables here
  },
}

module.exports = nextConfig
