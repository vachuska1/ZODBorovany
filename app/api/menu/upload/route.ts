import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir, unlink } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { prisma } from "@/lib/db"

// Directory where menu files will be stored
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'menu-uploads')

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
  try {
    const data = await request.formData()
    const file: File | null = data.get("file") as unknown as File
    const weekNumber = parseInt(data.get("week") as string)

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Nebyl nahrán žádný soubor" },
        { status: 400 }
      )
    }

    if (isNaN(weekNumber) || weekNumber < 1 || weekNumber > 2) {
      return NextResponse.json(
        { success: false, message: "Neplatný parametr týdne. Použijte 1 nebo 2." },
        { status: 400 }
      )
    }

    // Check file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, message: "Nepodporovaný typ souboru. Povoleny jsou pouze PDF soubory." },
        { status: 400 }
      )
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "Soubor je příliš velký. Maximální velikost je 10 MB." },
        { status: 400 }
      )
    }

    // Ensure upload directory exists
    await ensureUploadDir()

    // Generate unique filename
    const uniqueFilename = generateUniqueFilename(file.name)
    const filePath = path.join(UPLOAD_DIR, uniqueFilename)
    const publicPath = `/menu-uploads/${uniqueFilename}`

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Get existing menu file for this week if it exists
    const existingMenu = await prisma.menuFile.findUnique({
      where: { week: weekNumber }
    })

    // If there's an existing file, delete it
    if (existingMenu) {
      try {
        const oldFilePath = path.join(process.cwd(), 'public', existingMenu.filePath)
        if (existsSync(oldFilePath)) {
          await unlink(oldFilePath)
        }
      } catch (error) {
        console.error("Error deleting old file:", error)
        // Continue even if deletion fails
      }
    }

    // Update or create menu file in database
    await prisma.menuFile.upsert({
      where: { week: weekNumber },
      update: {
        fileName: file.name,
        filePath: publicPath,
      },
      create: {
        week: weekNumber,
        fileName: file.name,
        filePath: publicPath,
      },
    })

    return NextResponse.json({
      success: true,
      message: `Menu pro týden ${weekNumber} bylo úspěšně nahráno`,
      filePath: publicPath,
    })

  } catch (error) {
    console.error("Error uploading file:", error)
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
    const result = [1, 2].map(week => ({
      week,
      ...menus.find((m: { week: number }) => m.week === week)
    }))

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error fetching menu files:", error)
    return NextResponse.json(
      { success: false, message: "Nepodařilo se načíst seznam menu." },
      { status: 500 }
    )
  }
}
