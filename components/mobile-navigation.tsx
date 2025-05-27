"use client"

import Link from "next/link"
import { Home, MenuIcon, Briefcase, FileText, Phone } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function MobileNavigation() {
  const { t } = useLanguage()

  const mobileNavItems = [
    { key: "home" as const, href: "#home", icon: Home },
    { key: "menu" as const, href: "#menu", icon: MenuIcon },
    { key: "jobs" as const, href: "/jobs", icon: Briefcase },
    { key: "statutes" as const, href: "/statutes", icon: FileText },
    { key: "contact" as const, href: "#contact", icon: Phone },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden">
      <div className="flex justify-around items-center py-2">
        {mobileNavItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{t(item.key)}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
