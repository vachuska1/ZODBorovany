import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync, mkdirSync } from "fs"
import path from "path"
import { tmpdir } from "os"

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get("file") as unknown as File
    const week: string | null = data.get("week") as string

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" })
    }

    if (!week || !["week1", "week2"].includes(week)) {
      return NextResponse.json({ success: false, message: "Invalid week parameter" })
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    const bytes = await file.arrayBuffer()
    
    if (bytes.byteLength > maxSize) {
      return NextResponse.json({ 
        success: false, 
        message: "Soubor je příliš velký. Maximální velikost je 10 MB." 
      }, { status: 400 })
    }

    const buffer = Buffer.from(bytes)

    // Use a temporary directory for uploads to avoid path encoding issues
    const tempDir = path.join(process.cwd(), 'public', 'menu')
    const filename = `${week}.pdf`
    
    try {
      // Ensure the directory exists
      console.log('Upload directory:', tempDir)
      
      if (!existsSync(tempDir)) {
        console.log('Creating directory:', tempDir)
        await mkdir(tempDir, { recursive: true })
        console.log('Directory created successfully')
      }
      
      // Create the full file path
      const filePath = path.join(tempDir, filename)
      console.log('Saving file to:', filePath)
      
      // Write the file using the absolute path with UTF-8 encoding
      await writeFile(filePath, buffer, { encoding: 'binary' })
      console.log('File saved successfully')
      
      // Verify file was written
      if (existsSync(filePath)) {
        const stats = await import('fs/promises').then(fs => fs.stat(filePath))
        console.log('File verification:', {
          size: stats.size,
          modified: stats.mtime,
          exists: true
        })
      } else {
        console.error('ERROR: File was not written to disk')
      }
    } catch (error: any) {
      console.error('Error details:')
      console.error('- Error code:', error.code)
      console.error('- Error message:', error.message)
      console.error('- Error path:', error.path)
      
      let errorMessage = 'Chyba při ukládání souboru. Zkontrolujte oprávnění adresáře.'
      
      if (error.code === 'EACCES') {
        errorMessage = 'Nedostatečná oprávnění pro zápis do adresáře.'
      } else if (error.code === 'ENOENT') {
        errorMessage = 'Cesta k adresáři neexistuje a nelze ji vytvořit.'
      } else if (error.code === 'ENOSPC') {
        errorMessage = 'Na disku není dostatek místa.'
      }
      
      return NextResponse.json({ 
        success: false, 
        message: errorMessage,
        error: {
          code: error.code,
          message: error.message,
          path: error.path
        }
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Menu for ${week} uploaded successfully`,
      filename,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error uploading file",
      },
      { status: 500 },
    )
  }
}
