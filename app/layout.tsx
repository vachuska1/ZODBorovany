import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LanguageProvider } from "@/lib/language-context"
import { MobileNavigation } from "@/components/mobile-navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ZOD Borovany - Zemědělské obchodní družstvo",
  description: "Zemědělské obchodní družstvo Borovany - rostlinná výroba, živočišná výroba, závodní kuchyně",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <body className={inter.className}>
        <LanguageProvider>
          <Navbar />
          {children}
          <Footer />
          <MobileNavigation />
        </LanguageProvider>
      </body>
    </html>
  )
}
