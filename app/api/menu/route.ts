import { NextResponse } from "next/server"
import prisma from "@/lib/db"

interface MenuItem {
  week: number
  fileName: string | null
  filePath: string | null
}

interface DatabaseError extends Error {
  code?: string
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    console.log("Attempting to fetch menu files...")
    
    let menus: any[] = []
    try {
      // Try to fetch from database
      menus = await prisma.menuFile.findMany({
        orderBy: { week: 'asc' },
      })
      console.log("Fetched menus from database:", menus)
    } catch (error) {
      const dbError = error as DatabaseError
      console.error("Database error:", dbError)
      // Continue with empty array if database is not available
      menus = []
    }

    // Ensure we always return both weeks, with null for missing ones
    const result: MenuItem[] = [1, 2].map(week => ({
      week,
      fileName: menus.find(m => m.week === week)?.fileName || null,
      filePath: menus.find(m => m.week === week)?.filePath || null,
    }))

    return NextResponse.json({ success: true, data: result })
  } catch (error: unknown) {
    console.error("Error in menu API route:", error)
    
    // Return default menu structure for any error
    console.log("Using default menu structure due to error")
    return NextResponse.json({
      success: true,
      data: [
        { week: 1, fileName: null, filePath: null },
        { week: 2, fileName: null, filePath: null }
      ]
    })
  }
}
