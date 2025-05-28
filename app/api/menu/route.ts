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
    const result: MenuItem[] = [1, 2].map(week => {
      const menuItem = menus.find(m => m.week === week);
      let filePath = menuItem?.filePath || null;
      
      // For production environment, ensure we use the default file path if needed
      // since we can't actually store uploaded files on Vercel's filesystem
      if (process.env.NODE_ENV === 'production' && menuItem?.fileName) {
        // Use default file path with a query parameter to force refresh
        filePath = `/menu/week${week}.pdf?name=${encodeURIComponent(menuItem.fileName)}&t=${Date.now()}`;
      }
      
      return {
        week,
        fileName: menuItem?.fileName || null,
        filePath: filePath,
      };
    })

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
