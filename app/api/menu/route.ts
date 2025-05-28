import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    console.log("Attempting to fetch menu files...")
    
    // Test the database connection first
    await prisma.$connect()
    console.log("Database connection successful")
    
    const menus = await prisma.menuFile.findMany({
      orderBy: { week: 'asc' },
    })
    
    console.log("Fetched menus:", menus)

    // Ensure we always return both weeks, with null for missing ones
    const result = [1, 2].map(week => {
      const menu = menus.find((m: { week: number }) => m.week === week)
      return {
        week,
        fileName: menu?.fileName || null,
        filePath: menu?.filePath || null,
      }
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error in menu API route:", error)
    
    // More detailed error information
    const errorInfo = {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'UnknownError',
    }
    
    console.error("Error details:", errorInfo)
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Nepodařilo se načíst seznam menu.",
        error: process.env.NODE_ENV === 'development' ? errorInfo : undefined
      },
      { status: 500 }
    )
  }
}
