'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle, Printer } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function MenuSection() {
  const handlePrint = (week: number) => {
    window.open(`/menu/week${week}.pdf`, '_blank')
  }

  return (
    <div className="container mx-auto px-4">
      {/* Main Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold mb-2 uppercase">JÍDELNÍ LÍSTEK</h2>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Current Week */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Tento týden</CardTitle>
              <Button onClick={() => handlePrint(1)} className="ml-2">
                <Printer className="mr-2 h-4 w-4" />
                Tisknout
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-[60vh] relative">
                <iframe
                  src={`/menu/week1.pdf#toolbar=0&navpanes=0&view=FitH&zoom=100`}
                  className="w-full h-full border-0"
                  onError={() => {
                    console.error('Error loading PDF')
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Next Week */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Příští týden</CardTitle>
              <Button onClick={() => handlePrint(2)} className="ml-2">
                <Printer className="mr-2 h-4 w-4" />
                Tisknout
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-[60vh] relative">
                <iframe
                  src={`/menu/week2.pdf#toolbar=0&navpanes=0&view=FitH&zoom=100`}
                  className="w-full h-full border-0"
                  onError={() => {
                    console.error('Error loading PDF')
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
