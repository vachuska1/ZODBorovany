import { PrismaClient } from '@prisma/client'

// This prevents multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create a function to get the database URL
function getDatabaseUrl() {
  // Always use DATABASE_URL if it's set
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }
  
  // Fallback to SQLite for local development if no DATABASE_URL is set
  if (process.env.NODE_ENV !== 'production') {
    return 'file:./prisma/dev.db'
  }
  
  throw new Error('DATABASE_URL is required in production')
}

// Create a single Prisma Client instance
const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL || getDatabaseUrl()
    }
  }
})

// Enable Prisma Client's connection pooling in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Export the Prisma Client for use in your application
export default prisma
