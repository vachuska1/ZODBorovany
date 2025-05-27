import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function JobsPage() {
  return (
    <main className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-16">Nabídka práce</h1>

          <Card className="border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Aktuální pracovní pozice</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-gray-600 text-xs">PDF dokument</span>
                  </div>
                  <p className="text-gray-600 mb-4">Nabídka práce - aktuální pozice</p>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Stáhnout PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
