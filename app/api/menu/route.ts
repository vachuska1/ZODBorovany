import { NextResponse } from "next/server"
import { existsSync } from "fs"
import path from "path"

interface MenuItem {
  week: number
  fileName: string | null
  filePath: string | null
}

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const MENU_DIR = path.join(process.cwd(), 'public', 'menu')
    const timestamp = Date.now()
    
    // Check which menu files exist and return their paths
    const result = [1, 2].map(week => {
      const filename = `week${week}.pdf`
      const filePath = path.join(MENU_DIR, filename)
      const exists = existsSync(filePath)
      
      return {
        week,
        fileName: exists ? filename : null,
        filePath: exists ? `/menu/${filename}?t=${timestamp}` : null
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      data: result 
    });
    
  } catch (error) {
    console.error("Error in GET /api/menu:", error);
    
    // Return empty structure if there's an error
    return NextResponse.json({
      success: false,
      data: [
        { week: 1, fileName: null, filePath: "/menu/week1.pdf" },
        { week: 2, fileName: null, filePath: "/menu/week2.pdf" }
      ]
    });
  }
}
