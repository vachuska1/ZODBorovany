"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wheat, MilkIcon as Cow, ChefHat } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function About() {
  const { t } = useLanguage()

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-16">{t("whatWeDo")}</h2>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Rostlinná výroba */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Wheat className="h-12 w-12 mx-auto mb-4 text-gray-700" />
                <CardTitle className="text-xl font-bold">{t("cropProduction")}</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 text-sm leading-relaxed">
                <p>
                  Naše družstvo obhospodařuje celkem 2600 hektarů zemědělské půdy, z toho tvoří 1575 hektarů orná půda a
                  1025 hektarů louky a pastviny. Družstvo se specializuje na výrobu obilovin, především pšenice, ječmene
                  a tritikale.
                </p>
                <p className="mt-4">
                  Vzhledem k rozsáhlé živočišné výrobě se zaměřujeme na pěstování krmných plodin, hlavně jetelotrav a
                  kukuřice na siláž. Tržní plodinou je řepka olejná, kterou pěstujeme na 240 hektarech půdy.
                </p>
              </CardContent>
            </Card>

            {/* Živočišná výroba */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Cow className="h-12 w-12 mx-auto mb-4 text-gray-700" />
                <CardTitle className="text-xl font-bold">{t("animalProduction")}</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 text-sm leading-relaxed">
                <p>
                  Družstvo se zabývá chovem skotu a drůbeže. Hlavní činností je výroba mléka, v moderních stájích
                  chováme 600 ks dojnic s roční produkcí 4,5 mil. litrů. Na pastvinách máme 200 krav bez tržní produkce
                  mléka.
                </p>
                <p className="mt-4">
                  Ve čtyřech odchovnách realizujeme výkrm kuřat. V areálu Borovany provozujeme malou porážku drůbeže,
                  díky které můžeme zájemcům nabídnout kuchaná chlazená kuřata přímo od chovatele.
                </p>
              </CardContent>
            </Card>

            {/* Závodní kuchyně */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <ChefHat className="h-12 w-12 mx-auto mb-4 text-gray-700" />
                <CardTitle className="text-xl font-bold">{t("canteen")}</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 text-sm leading-relaxed">
                <p>
                  Provozujeme závodní kuchyni, která slouží jak zaměstnancům, tak široké veřejnosti. Zaměřujeme se na
                  tradiční českou kuchyni. Cena oběda je 115,- Kč včetně polévky.
                </p>
                <p className="mt-4">
                  Oběd je možné konzumovat v závodní jídelně či si ho ve vlastních nádobách odnést s sebou. V závodní
                  kuchyni také vyrábíme houskové knedlíky, které dodáváme do místních restaurací. Cena 1 ks knedlíku o
                  hmotnosti 600g je 40,- Kč.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
