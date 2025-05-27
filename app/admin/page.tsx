"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload, CheckCircle, AlertCircle, LogOut } from "lucide-react"

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check')
        if (response.ok) {
          setIsAuthenticated(true)
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
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
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

  const handleFileUpload = async (week: "week1" | "week2", file: File) => {
    setUploading(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("week", week)

      const response = await fetch("/api/menu/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: "success", text: result.message })
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Chyba při nahrávání souboru" })
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (week: "week1" | "week2") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      handleFileUpload(week, file)
    } else {
      setMessage({ type: "error", text: "Prosím vyberte PDF soubor" })
    }
  }

  return (
    <main className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Administrace - Nahrávání jídelních lístků
            </h1>
            <Button variant="outline" onClick={handleLogout} className="flex items-center">
              <LogOut className="h-4 w-4 mr-2" />
              Odhlásit se
            </Button>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center ${
                message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              {message.text}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Týden 1 */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Jídelní lístek - 1. týden
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label htmlFor="week1-file">Vyberte PDF soubor pro 1. týden</Label>
                  <Input
                    id="week1-file"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange("week1")}
                    disabled={uploading}
                  />
                  <p className="text-sm text-gray-600">
                    Nahrajte PDF soubor s jídelním lístkem pro první týden. Soubor bude dostupný ke stažení na hlavní
                    stránce.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Týden 2 */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Jídelní lístek - 2. týden
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label htmlFor="week2-file">Vyberte PDF soubor pro 2. týden</Label>
                  <Input
                    id="week2-file"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange("week2")}
                    disabled={uploading}
                  />
                  <p className="text-sm text-gray-600">
                    Nahrajte PDF soubor s jídelním lístkem pro druhý týden. Soubor bude dostupný ke stažení na hlavní
                    stránce.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-blue-900 mb-4">Instrukce pro nahrávání</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Podporované formáty: pouze PDF soubory</li>
              <li>• Maximální velikost souboru: 10 MB</li>
              <li>• Soubory se automaticky přepíší při nahrání nového souboru pro stejný týden</li>
              <li>• Po úspěšném nahrání bude soubor okamžitě dostupný na hlavní stránce</li>
              <li>• Doporučujeme pojmenovat soubory jasně (např. "Jídelní lístek týden 1")</li>
            </ul>
          </div>

          {uploading && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-blue-800">Nahrávání souboru...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
