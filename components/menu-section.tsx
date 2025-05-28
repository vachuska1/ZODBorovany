"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"

interface MenuFile {
  week: number
  fileName: string | null
  filePath: string | null
}

interface MenuCardProps {
  week: number
  title: string
  menuFile: MenuFile | null
  onRefresh: () => void
  isLoading: boolean
}

function MenuCard({ week, title, menuFile, onRefresh, isLoading: parentIsLoading }: MenuCardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [pdfUrl, setPdfUrl] = useState('')
  const [error, setError] = useState('')
  
  // Set the PDF URL on the client side to prevent hydration mismatch
  useEffect(() => {
    if (menuFile?.filePath) {
      // Use the uploaded file if available
      const timestamp = Date.now()
      setPdfUrl(`${menuFile.filePath}?t=${timestamp}`)
      setIsLoading(true)
    } else {
      // Fallback to default file
      const timestamp = Date.now()
      setPdfUrl(`/menu/week${week}.pdf?t=${timestamp}`)
      setIsLoading(true)
    }
    setError('')
  }, [menuFile, week])

  const handleLoad = () => {
    setIsLoading(false)
    setError('')
  }

  const handleError = () => {
    setIsLoading(false)
    setError('Nepodařilo se načíst menu. Zkuste to prosím znovu.')
  }

  const handleRefresh = () => {
    setIsLoading(true)
    onRefresh()
  }

  const displayUrl = menuFile?.filePath || `/menu/week${week}.pdf`
  const isDefaultFile = !menuFile?.filePath

  return (
    <Card className="border-2 hover:shadow-lg transition-shadow w-full flex flex-col">
      <CardHeader className="text-center bg-gray-900 text-white relative">
        <CardTitle className="text-xl">{title}</CardTitle>
        <button 
          onClick={handleRefresh}
          disabled={parentIsLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-1 disabled:opacity-50"
          title="Aktualizovat menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="flex-1 relative" style={{ minHeight: '800px' }}>
          {(isLoading || parentIsLoading) && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}
          
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
              <div className="text-red-600">
                <p>{error}</p>
                <button 
                  onClick={handleRefresh}
                  className="mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
                  disabled={parentIsLoading}
                >
                  Zkusit znovu
                </button>
              </div>
            </div>
          ) : (
            <object 
              key={pdfUrl}
              data={`${pdfUrl}#toolbar=0&navpanes=0&view=FitH`}
              type="application/pdf"
              className={`w-full h-full min-h-[800px] ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={handleLoad}
              onError={handleError}
            >
              <p>Váš prohlížeč nepodporuje zobrazení PDF. <a href={displayUrl} target="_blank" rel="noopener noreferrer">Klikněte zde pro stažení souboru</a>.</p>
            </object>
          )}
        </div>
        <div className="p-4 border-t border-gray-200 text-center">
          <a 
            href={displayUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
            download
          >
            Stáhnout menu {isDefaultFile && '(výchozí)'}
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

export function MenuSection() {
  const { t } = useLanguage()
  const [menuFiles, setMenuFiles] = useState<MenuFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchMenuFiles = async () => {
    try {
      setIsLoading(true)
      setError('')
      const response = await fetch('/api/menu')
      
      if (!response.ok) {
        throw new Error('Failed to fetch menu files')
      }
      
      const data = await response.json()
      if (data.success && data.data) {
        setMenuFiles(data.data)
      }
    } catch (err) {
      console.error('Error fetching menu files:', err)
      setError('Nepodařilo se načíst aktuální menu. Zkuste to prosím znovu.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMenuFiles()
  }, [])

  const getMenuForWeek = (week: number) => {
    return menuFiles.find(menu => menu.week === week) || null
  }

  return (
    <section id="menu" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-16">{t("currentMenu")}</h2>

          {error && (
            <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-lg text-center">
              {error}
              <button 
                onClick={fetchMenuFiles}
                className="ml-2 px-4 py-1 bg-red-200 hover:bg-red-300 rounded-md text-sm"
                disabled={isLoading}
              >
                {isLoading ? 'Načítám...' : 'Zkusit znovu'}
              </button>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            <MenuCard 
              week={1} 
              title={t("menuWeek1")} 
              menuFile={getMenuForWeek(1)}
              onRefresh={fetchMenuFiles}
              isLoading={isLoading}
            />
            <MenuCard 
              week={2} 
              title={t("menuWeek2")} 
              menuFile={getMenuForWeek(2)}
              onRefresh={fetchMenuFiles}
              isLoading={isLoading}
            />
          </div>

          <div className="text-center mt-12">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t("cateringInfo")}</h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
                <div>
                  <p className="mb-2">
                    <strong>{t("lunchPrice")}</strong> {t("lunchPriceValue")}
                  </p>
                </div>
                <div>
                  <p className="mb-2">
                    <strong>{t("dumplings")}</strong> {t("dumplingsValue")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
