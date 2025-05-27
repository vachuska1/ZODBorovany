"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/language-context"

const navigationItems = [
  { key: "home" as const, href: "#home" },
  { key: "menu" as const, href: "#menu" },
  { key: "jobs" as const, href: "/jobs" },
  { key: "grants" as const, href: "/grants" },
  { key: "statutes" as const, href: "/statutes" },
  { key: "reporting" as const, href: "/reporting" },
  { key: "contact" as const, href: "#contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-bold text-xl text-gray-900">ZOD Borovany</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                {t(item.key)}
              </Link>
            ))}
          </div>

          {/* Language Switcher & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-10 h-10 p-0">
                  <img 
                    src={`/images/flags/${language === 'cz' ? 'czech-republic' : language === 'en' ? 'united-kingdom' : 'germany'}.png`}
                    alt={language.toUpperCase()}
                    className="w-6 h-6 object-contain"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => setLanguage("cz")}
                  className="flex items-center gap-2 text-base"
                >
                  <img src="/images/flags/czech-republic.png" alt="CZ" className="w-5 h-5" />
                  <span>Čeština</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setLanguage("en")}
                  className="flex items-center gap-2 text-base"
                >
                  <img src="/images/flags/united-kingdom.png" alt="EN" className="w-5 h-5" />
                  <span>English</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setLanguage("de")}
                  className="flex items-center gap-2 text-base"
                >
                  <img src="/images/flags/germany.png" alt="DE" className="w-5 h-5" />
                  <span>Deutsch</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link href="/" className="flex items-center mb-8">
                    <span className="font-bold text-xl text-gray-900">ZOD Borovany</span>
                  </Link>

                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {t(item.key)}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
