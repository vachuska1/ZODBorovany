import { PrismaClient } from '@prisma/client'

// This prevents multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create a function to get the database URL
function getDatabaseUrl() {
  // In production, use the pooled connection URL
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required in production')
    }
    return process.env.DATABASE_URL
  }
  
  // In development, use the direct URL if available, otherwise fallback to SQLite
  if (process.env.DIRECT_URL) {
    return process.env.DIRECT_URL
  }
  
  // Fallback to SQLite for local development
  return 'file:./prisma/dev.db'
}

// Create a single Prisma Client instance
const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl()
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
