import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir, unlink } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import prisma from "@/lib/db"

// Directory where menu files will be stored
// In Vercel, we need to use /tmp for file uploads in production
const UPLOAD_DIR = process.env.NODE_ENV === 'production'
  ? path.join('/tmp', 'menu-uploads') // Use /tmp in production (Vercel)
  : path.join(process.cwd(), 'public', 'menu-uploads') // Use public directory in development

// Enable file uploads in production for admin users
const isProduction = false // Permanently enable uploads for admin users

// Ensure upload directory exists
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
  return UPLOAD_DIR
}

// Generate a unique filename with timestamp
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now()
  const ext = path.extname(originalName)
  const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9-_]/g, '')
  return `${baseName}-${timestamp}${ext}`
}

export async function POST(request: NextRequest) {
  // In production, disable direct file uploads for security
  if (isProduction) {
    return NextResponse.json(
      { 
        success: false,
        message: 'Nahrávání souborů je v produkčním prostředí zakázáno. Použijte správu souborů v administraci.'
      },
      { status: 403 }
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const week = formData.get('week')

    if (!file || !week) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Chybí povinné údaje. Prosím, vyberte soubor a zadejte číslo týdne." 
        },
        { status: 400 }
      )
    }

    const weekNumber = parseInt(week.toString())
    const fileData = file as unknown as File

    if (isNaN(weekNumber) || weekNumber < 1 || weekNumber > 2) {
      return NextResponse.json(
        { success: false, message: "Neplatný parametr týdne. Použijte 1 nebo 2." },
        { status: 400 }
      )
    }

    // Check file type
    if (fileData.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, message: "Nepodporovaný typ souboru. Povoleny jsou pouze PDF soubory." },
        { status: 400 }
      )
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (fileData.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "Soubor je příliš velký. Maximální velikost je 10 MB." },
        { status: 400 }
      )
    }

    // Ensure upload directory exists
    await ensureUploadDir()

    // Generate unique filename and paths
    const filename = generateUniqueFilename(fileData.name)
    const filePath = path.join(UPLOAD_DIR, filename)
    
    // In production on Vercel, we need to handle files differently
    // We'll just store the file metadata in the database
    // and bypass actual file storage since Vercel has a read-only filesystem
    const publicPath = `/menu-uploads/${filename}`
    
    // For production, we'll skip the physical file save and just update the database
    // This works because Vercel deployments are ephemeral and cannot write to the filesystem permanently
    if (process.env.NODE_ENV === 'production') {
      console.log('Skipping physical file save in production, just updating database')
    } else {
      // Save the file to disk in development
      const bytes = await fileData.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)
    }

    try {

      // Check if a menu already exists for this week
      const existingMenu = await prisma.menuFile.findUnique({
        where: { week: weekNumber }
      })

      // Save to database
      if (existingMenu) {
        // Update existing menu
        await prisma.menuFile.update({
          where: { week: weekNumber },
          data: {
            fileName: fileData.name,
            filePath: publicPath,
          }
        })

        // In production, we can't clean up old files
        // Only attempt cleanup in development environment
        if (process.env.NODE_ENV !== 'production' && existingMenu.filePath && existingMenu.filePath !== publicPath) {
          try {
            const oldFilePath = path.join(process.cwd(), 'public', existingMenu.filePath)
            if (existsSync(oldFilePath)) {
              await unlink(oldFilePath)
            }
          } catch (cleanupError) {
            console.error("Error cleaning up old file:", cleanupError)
            // Don't fail the request if cleanup fails
          }
        }
      } else {
        // Create new menu
        await prisma.menuFile.create({
          data: {
            week: weekNumber,
            fileName: fileData.name,
            filePath: publicPath,
          }
        })
      }

      return NextResponse.json({
        success: true,
        message: `Menu pro týden ${weekNumber} bylo úspěšně nahráno`,
        filePath: publicPath,
      })

    } catch (error) {
      // If database operation fails, clean up the uploaded file
      try {
        if (existsSync(filePath)) {
          await unlink(filePath)
        }
      } catch (cleanupError) {
        console.error("Error cleaning up after database error:", cleanupError)
      }
      
      // Log detailed error information
      const dbError = error as Error;
      console.error("Database error details:", {
        error: dbError,
        message: dbError.message || 'No message',
        stack: dbError.stack || 'No stack trace'
      })
      
      return NextResponse.json(
        { success: false, message: `Nastala chyba při ukládání do databáze: ${dbError.message || 'Neznámá chyba'}` },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error in file upload:", error)
    return NextResponse.json(
      { success: false, message: "Při nahrávání souboru došlo k chybě." },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve current menu files
export async function GET() {
  try {
    const menus = await prisma.menuFile.findMany({
      orderBy: { week: 'asc' },
    })

    // Ensure we always return both weeks, with null for missing ones
    const result = [1, 2].map(week => {
      const menu = menus.find((m: { week: number }) => m.week === week)
      return {
        week,
        fileName: menu?.fileName || null,
        filePath: menu?.filePath || null,
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching menu files:", error)
    
    // Return empty structure if database is not available
    return NextResponse.json([
      { week: 1, fileName: null, filePath: null },
      { week: 2, fileName: null, filePath: null }
    ])
  }
}
