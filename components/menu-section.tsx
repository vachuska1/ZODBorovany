"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { PDFPreview } from "./pdf-preview"

interface MenuCardProps {
  week: number
  title: string
}

function MenuCard({ week, title }: MenuCardProps) {
  const [refreshKey, setRefreshKey] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [pdfUrl, setPdfUrl] = useState('')
  
  // Set the PDF URL on the client side to prevent hydration mismatch
  useEffect(() => {
    const timestamp = Date.now()
    setPdfUrl(`/week${week}.pdf?t=${timestamp}&v=${refreshKey}`)
  }, [week, refreshKey])
  
  const refreshPdf = () => {
    setIsLoading(true)
    setRefreshKey(prev => prev + 1)
  }

  return (
    <Card className="border-2 hover:shadow-lg transition-shadow w-full flex flex-col">
      <CardHeader className="text-center bg-gray-900 text-white relative">
        <CardTitle className="text-xl">{title}</CardTitle>
        <button 
          onClick={refreshPdf}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-1"
          title="Aktualizovat menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="flex-1 relative" style={{ minHeight: '800px' }}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}
          <object 
            key={refreshKey}
            data={`/menu${pdfUrl}#toolbar=0&navpanes=0&view=FitH`}
            type="application/pdf"
            className={`w-full h-full min-h-[800px] ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setIsLoading(false)}
          >
            <p>Váš prohlížeč nepodporuje zobrazení PDF. <a href={`/menu${pdfUrl}`} target="_blank" rel="noopener noreferrer">Klikněte zde pro stažení souboru</a>.</p>
          </object>
        </div>
        <div className="p-4 border-t border-gray-200 text-center">
          <a 
            href={`/menu${pdfUrl}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
            download
          >
            Stáhnout menu
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

export function MenuSection() {
  const { t } = useLanguage()

  return (
    <section id="menu" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-16">{t("currentMenu")}</h2>

          <div className="grid lg:grid-cols-2 gap-8">
            <MenuCard week={1} title={t("menuWeek1")} />
            <MenuCard week={2} title={t("menuWeek2")} />
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
