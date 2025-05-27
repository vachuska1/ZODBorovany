'use client'

import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export function PDFPreview({ pdfUrl, title }: { pdfUrl: string; title: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const [viewerUrl, setViewerUrl] = useState('')
  const [fullPdfUrl, setFullPdfUrl] = useState('')
  const iframeRef = useRef<HTMLIFrameElement>(null)
  
  // Initialize URLs on client side only
  useEffect(() => {
    const loadPdf = () => {
      // Add a timestamp to bust cache
      const timestamp = Date.now()
      // Add both v and t parameters to ensure cache busting
      const fullUrl = `${pdfUrl}?v=${timestamp}&t=${timestamp}`
      const viewer = `/pdfjs/web/viewer.html?file=${encodeURIComponent(fullUrl)}#zoom=page-fit`
      
      setFullPdfUrl(fullUrl)
      setViewerUrl(viewer)
      setIsLoading(false)
    }

    loadPdf()

    // Add a refresh interval to check for updates (every 5 minutes)
    const interval = setInterval(loadPdf, 5 * 60 * 1000)
    
    // Clean up interval on component unmount
    return () => clearInterval(interval)
  }, [pdfUrl])
  
  // Handle iframe load
  const handleIframeLoad = () => {
    setIsLoading(false)
    
    // Hide the PDF.js toolbar and other UI elements
    const iframe = iframeRef.current
    if (iframe) {
      const hideElements = () => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
          if (iframeDoc) {
            // Hide toolbar, secondary toolbar, and other UI elements
            const style = iframeDoc.createElement('style')
            style.textContent = `
              #toolbarContainer, 
              #secondaryToolbar, 
              #toolbarViewerRight, 
              #toolbarViewerLeft,
              #secondaryToolbarToggle,
              #findbar,
              #viewFind,
              .toolbar {
                display: none !important;
              }
              #viewerContainer {
                top: 0 !important;
              }
              #viewer {
                margin-top: 0 !important;
              }
            `
            iframeDoc.head.appendChild(style)
          }
        } catch (e) {
          console.error('Error customizing PDF.js viewer:', e)
        }
      }
      
      // Try to apply styles immediately and on load
      hideElements()
      iframe.onload = hideElements
    }
  }
  
  return (
    <div className="w-full flex flex-col flex-1">
      {/* PDF Container */}
      <div className="relative w-full flex-1">
        {isLoading || !viewerUrl ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : null}
        
        {viewerUrl && (
          <iframe
            ref={iframeRef}
            key={viewerUrl}
            src={viewerUrl}
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            title={`Náhled: ${title}`}
            style={{ minHeight: '800px' }}
            allowFullScreen
          />
        )}
      </div>
      
      {/* Download Button */}
      {fullPdfUrl && (
        <div className="p-4 border-t border-gray-200">
          <a href={fullPdfUrl} download>
            <Button variant="outline" size="sm" className="w-full flex items-center justify-center">
              <Download className="h-4 w-4 mr-2" />
              Stáhnout PDF
            </Button>
          </a>
        </div>
      )}
    </div>
  )
}
