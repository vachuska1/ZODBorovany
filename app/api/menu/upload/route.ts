import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

// Directory where menu files will be stored
const MENU_DIR = path.join(process.cwd(), 'public', 'menu')

// Ensure menu directory exists
async function ensureMenuDir() {
  if (!existsSync(MENU_DIR)) {
    await mkdir(MENU_DIR, { recursive: true })
  }
  return MENU_DIR
}

export async function POST(request: NextRequest) {
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

    // Ensure menu directory exists
    await ensureMenuDir()

    // Save file to public/menu directory
    const filename = `week${weekNumber}.pdf`
    const filePath = path.join(MENU_DIR, filename)
    
    // Convert file to buffer and save
    const bytes = await fileData.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))
    
    return NextResponse.json({
      success: true,
      message: `Menu pro týden ${weekNumber} bylo úspěšně nahráno`,
      filePath: `/menu/${filename}`,
    })
  } catch (error) {
    console.error("Error in file upload:", error)
    return NextResponse.json(
      { success: false, message: "Při nahrávání souboru došlo k chybě." },
      { status: 500 }
    )
  }
}

// GET endpoint to check if menu files exist
export async function GET() {
  try {
    // Check which menu files exist
    const result = [1, 2].map(week => {
      const filename = `week${week}.pdf`
      const filePath = path.join(MENU_DIR, filename)
      const exists = existsSync(filePath)
      
      return {
        week,
        fileName: exists ? filename : null,
        filePath: exists ? `/menu/${filename}?t=${Date.now()}` : null,
        updatedAt: exists ? new Date().toISOString() : null
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error checking menu files:", error);
    
    // Return empty structure if there's an error
    return NextResponse.json([
      { week: 1, fileName: null, filePath: null, updatedAt: null },
      { week: 2, fileName: null, filePath: null, updatedAt: null }
    ]);
  }
}
