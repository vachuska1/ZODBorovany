'use client';

import { useEffect, useState } from 'react';

interface PdfViewerProps {
  fileUrl: string;
  className?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

// Helper function to check if a string is a valid URL
const isValidUrl = (urlString: string): boolean => {
  try {
    // Check if it's a relative URL (starts with /)
    if (urlString.startsWith('/')) {
      return true;
    }
    
    // Try to create a URL object (for absolute URLs)
    const url = new URL(urlString);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
};

// Helper to get full URL (handles relative URLs)
const getFullUrl = (url: string): string => {
  if (url.startsWith('http')) {
    return url;
  }
  // For relative URLs, prepend the current origin
  return `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
};

export function PdfViewer({ fileUrl, className = '', onLoad, onError }: PdfViewerProps) {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [finalUrl, setFinalUrl] = useState('');

  useEffect(() => {
    const setupPdf = async () => {
      try {
        console.log('Setting up PDF with URL:', fileUrl);
        
        if (!fileUrl) {
          throw new Error('Není zadána žádná URL adresa jídelního lístku');
        }

        // Check if URL is valid
        if (!isValidUrl(fileUrl)) {
          throw new Error('Neplatný formát URL adresy');
        }

        const fullUrl = getFullUrl(fileUrl);
        setFinalUrl(fullUrl);
        
        // Don't validate the URL if it's a relative path (avoids CORS issues)
        if (fileUrl.startsWith('/')) {
          console.log('Using relative URL, skipping validation');
          if (onLoad) onLoad();
          setIsLoading(false);
          return;
        }

        // For absolute URLs, we can try to validate them
        try {
          const response = await fetch(fullUrl, { 
            method: 'HEAD',
            // Add cache-busting to prevent cached responses
            cache: 'no-cache',
            // Add credentials if needed for CORS
            credentials: 'same-origin'
          });
          
          if (!response.ok) {
            console.warn('PDF URL returned non-OK status, but will still try to use it:', response.status);
          }
        } catch (fetchError) {
          console.warn('Could not validate PDF URL, but will still try to use it:', fetchError);
        }
        
        if (onLoad) onLoad();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Neznámá chyba při načítání PDF');
        console.error('Error setting up PDF:', error);
        setError(error);
        if (onError) onError(error);
      } finally {
        setIsLoading(false);
      }
    };

    setupPdf();
  }, [fileUrl, onLoad, onError]);

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!finalUrl) return;
    
    try {
      console.log('Attempting to open PDF:', finalUrl);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = finalUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Try to force download with a nice filename
      const filename = finalUrl.split('/').pop() || 'jidelni-listek.pdf';
      link.download = filename;
      
      // Append to body, click and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Nepodařilo se otevřít PDF');
      console.error('Error opening PDF:', error);
      setError(error);
      if (onError) onError(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Připravuji jídelní lístek...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-8 text-center">
        <div className="bg-red-50 p-6 rounded-lg max-w-md w-full">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="mt-3 text-lg font-medium text-red-800">Chyba při načítání</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>Nepodařilo se načíst jídelní lístek.</p>
            <p className="mt-2 text-sm">{error.message}</p>
            {fileUrl && (
              <p className="mt-2 text-xs break-all">
                URL: <span className="text-gray-600">{fileUrl}</span>
              </p>
            )}
          </div>
          {finalUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Zkuste toto řešení:</p>
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none"
              >
                Klikněte pravým tlačítkem a zvolte "Uložit odkaz jako..."
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center w-full h-full p-4 text-center ${className}`}>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-md w-full">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
          <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="mt-3 text-lg font-medium text-gray-900">Jídelní lístek je připraven</h3>
        <p className="mt-2 text-sm text-gray-500">
          Pro zobrazení jídelního lístku klikněte na tlačítko níže.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Zobrazit jídelní lístek
          </button>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          Pokud se jídelní lístek nenačte, zkuste kliknout pravým tlačítkem a vybrat "Uložit odkaz jako..."
        </p>
        {process.env.NODE_ENV === 'development' && finalUrl && (
          <div className="mt-4 p-2 bg-gray-50 rounded text-left">
            <p className="text-xs text-gray-500 mb-1">Vývojářské informace:</p>
            <p className="text-xs break-all font-mono">{finalUrl}</p>
          </div>
        )}
      </div>
    </div>
  );
}
