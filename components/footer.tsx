"use client"

import Link from "next/link"
import { Facebook } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function Footer() {
  const { t } = useLanguage()

  const navigationItems = [
    { key: "home" as const, href: "#home" },
    { key: "menu" as const, href: "#menu" },
    { key: "jobs" as const, href: "/jobs" },
    { key: "grants" as const, href: "/grants" },
    { key: "statutes" as const, href: "/statutes" },
    { key: "reporting" as const, href: "/reporting" },
    { key: "contact" as const, href: "#contact" },
  ]

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo a základní info */}
            <div>
              <div className="flex items-center mb-4">
                <span className="font-bold text-xl">ZOD Borovany</span>
              </div>
              <p className="text-gray-400 text-sm">Zemědělské obchodní družstvo Borovany</p>
            </div>

            {/* Navigace */}
            <div>
              <h3 className="font-bold mb-4">{t("menu")}</h3>
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {t(item.key)}
                  </Link>
                ))}
              </div>
            </div>

            {/* Kontakt */}
            <div>
              <h3 className="font-bold mb-4">{t("contact")}</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Vodárenská 97, 373 12 Borovany</p>
                <p>
                  Tel:{" "}
                  <a href="tel:+420387023511" className="hover:text-white transition-colors">
                    387 023 511
                  </a>
                </p>
                <p>
                  Email:{" "}
                  <a href="mailto:info@zodborovany.cz" className="hover:text-white transition-colors">
                    info@zodborovany.cz
                  </a>
                </p>
                <p>IČO: 00109207</p>
              </div>
            </div>

            {/* Sociální sítě */}
            <div>
              <h3 className="font-bold mb-4">{t("followUs")}</h3>
              <Link
                href="https://www.facebook.com/zodborovany"
                target="_blank"
                className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="text-sm">Facebook</span>
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Zemědělské obchodní družstvo Borovany. {t("allRightsReserved")}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
