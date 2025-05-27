"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import Image from "next/image"

export function Hero() {
  const { t } = useLanguage()

  return (
    <section id="home" className="relative bg-white">
      {/* Full-width title */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-2">{t("companyName")}</h1>
          </div>
        </div>
      </div>

      {/* Full-width hero image */}
      <div className="w-full h-64 sm:h-80 lg:h-[32rem] bg-gray-200 relative overflow-hidden">
        <Image
          src="/images/ZOD.png"
          alt="ZOD Borovany - zemědělské družstvo"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_25%] sm:object-center lg:object-[center_30%]"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Company info cards */}
      <div className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Logo nad informacemi */}
            <div className="text-center mb-8">
              <div className="relative w-[400px] h-[280px] mx-auto">
                <Image
                  src="/images/logo_zod.png"
                  alt="ZOD Borovany Logo"
                  fill
                  sizes="(max-width: 768px) 400px, 400px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
              <div className="grid md:grid-cols-2 gap-8 text-lg text-gray-700">
                <div className="space-y-4">
                  <p className="mb-3">
                    <strong className="text-gray-900">Adresa:</strong>{" "}
                    <span>Vodárenská 97, 373 12 Borovany</span>
                  </p>
                  <p className="mb-3">
                    <strong className="text-gray-900">IČO:</strong> 00109207
                  </p>
                  <p className="mb-3">
                    <strong className="text-gray-900">DIČ:</strong> CZ00109207
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="mb-3">
                    <strong className="text-gray-900">Tel:</strong>{" "}
                    <a href="tel:+420387023511" className="hover:text-gray-900 transition-colors hover:underline">
                      387 023 511
                    </a>
                  </p>
                  <p className="mb-3">
                    <strong className="text-gray-900">Email:</strong>{" "}
                    <a href="mailto:info@zodborovany.cz" className="hover:text-gray-900 transition-colors hover:underline">
                      info@zodborovany.cz
                    </a>
                  </p>
                  <p className="mb-3">
                    <strong className="text-gray-900">Datová schránka:</strong>{" "}
                    <span>r5tcx53</span>
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-lg">
                  <strong className="text-gray-900">Otevírací doba:</strong>{" "}
                  <span>Po–Pá: 7:00–15:30, So–Ne: zavřeno</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800" asChild>
                <a href="#menu">{t("menuButton")}</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#contact">{t("contactButton")}</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
