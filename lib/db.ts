import { PrismaClient } from '@prisma/client'

// This prevents multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create a function to get the database URL
function getDatabaseUrl() {
  // Always use DATABASE_URL from environment variables if it exists
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }
  
  // Fallback to SQLite for local development if no DATABASE_URL is set
  return 'file:./prisma/dev.db'
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      // Use the connection URL with ?pgbouncer=true for Neon's connection pooling
      url: getDatabaseUrl().includes('?') 
        ? `${getDatabaseUrl()}&connection_limit=1&pool_timeout=10`
        : `${getDatabaseUrl()}?connection_limit=1&pool_timeout=10`
    },
  },
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error']
})

// Enable Prisma Client's connection pooling in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Export the Prisma Client for use in your application
export default prisma
