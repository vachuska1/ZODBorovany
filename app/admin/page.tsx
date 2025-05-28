"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, LogOut } from "lucide-react"

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null)
  const isProduction = process.env.NODE_ENV === 'production'

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check')
        if (response.ok) {
          setIsAuthenticated(true)
          if (isProduction) {
            setMessage({
              type: 'info',
              text: 'Nahrávání souborů je v produkčním prostředí zakázáno. Pro správu souborů použijte administrační rozhraní.'
            })
          }
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, isProduction])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleMenuUpload = async (week: number, file: File) => {
    if (!file) return
    
    if (isProduction) {
      setMessage({
        type: 'info',
        text: 'Nahrávání souborů je v produkčním prostředí zakázáno. Pro správu souborů použijte administrační rozhraní.'
      })
      return
    }
    
    setUploading(true)
    setMessage(null)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('week', week.toString())
      
      const response = await fetch('/api/menu/upload', {
        method: 'POST',
        body: formData,
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setMessage({
          type: 'success',
          text: `Menu pro týden ${week} bylo úspěšně nahráno`,
        })
      } else {
        throw new Error(result.message || 'Nastala chyba při nahrávání souboru')
      }
    } catch (error: any) {
      console.error('Upload failed:', error)
      setMessage({
        type: 'error',
        text: error.message || 'Nastala chyba při nahrávání souboru',
      })
    } finally {
      setUploading(false)
    }
  }
  
  const handleFileChange = (week: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleMenuUpload(week, file)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Administrace</h1>
          <Button variant="outline" onClick={handleLogout} disabled={uploading}>
            <LogOut className="mr-2 h-4 w-4" />
            Odhlásit se
          </Button>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Nahrát nové menu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {!isProduction ? (
                <>
                  <div>
                    <Label htmlFor="week1">Menu pro 1. týden</Label>
                    <div className="mt-2 flex items-center">
                      <Input
                        id="week1"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileChange(1, e)}
                        disabled={uploading}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="week2">Menu pro 2. týden</Label>
                    <div className="mt-2 flex items-center">
                      <Input
                        id="week2"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileChange(2, e)}
                        disabled={uploading}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-4 bg-blue-50 text-blue-800 rounded-md">
                  <p className="font-medium">Nahrávání souborů je v produkčním prostředí zakázáno.</p>
                  <p className="mt-2 text-sm">Pro správu souborů použijte administrační rozhraní.</p>
                </div>
              )}
              
              {message && (
                <div className={`p-4 rounded-md ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-800' 
                    : message.type === 'error'
                    ? 'bg-red-50 text-red-800'
                    : 'bg-blue-50 text-blue-800'
                }`}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {message.type === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : message.type === 'error' ? (
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-blue-400" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{message.text}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="text-sm text-gray-500">
                <p>Maximální velikost souboru: 10 MB</p>
                <p>Podporovaný formát: PDF</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
