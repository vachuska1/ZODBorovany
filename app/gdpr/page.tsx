import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: 'Ochrana osobních údajů | ZOD Borovany',
  description: 'Informace o zpracování osobních údajů společností ZOD Borovany',
}

export default function GdprPage() {
  return (
    <main className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Zásady ochrany osobních údajů
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-4">Správce osobních údajů</h2>
                <p className="mb-4">
                  Správcem Vašich osobních údajů je společnost ZOD Borovany, IČ: 00109207, se sídlem Vodárenská 97, 373 12 Borovany.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">Účel zpracování osobních údajů</h2>
                <p className="mb-4">
                  Vaše osobní údaje zpracováváme za účelem vyřízení Vašeho dotazu zaslaného prostřednictvím kontaktního formuláře na našich webových stránkách.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">Doba zpracování</h2>
                <p className="mb-4">
                  Osobní údaje zpracováváme po dobu nezbytnou k vyřízení Vašeho dotazu, maximálně však po dobu 1 roku od jeho odeslání, pokud se s námi nedohodneme na delší době.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">Vaše práva</h2>
                <p className="mb-4">V souvislosti se zpracováním Vašich osobních údajů máte následující práva:</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Právo na přístup k osobním údajům</li>
                  <li>Právo na opravu nepřesných údajů</li>
                  <li>Právo na výmaz (být zapomenut)</li>
                  <li>Právo na omezení zpracování</li>
                  <li>Právo na přenositelnost údajů</li>
                  <li>Právo vznést námitku</li>
                  <li>Právo podat stížnost u dozorového úřadu (Úřad pro ochranu osobních údajů)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">Kontaktní údaje</h2>
                <p className="mb-4">
                  V případě dotazů ohledně zpracování Vašich osobních údajů nás můžete kontaktovat na e-mailové adrese: info@zodborovany.cz
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">Změny v zásadách ochrany osobních údajů</h2>
                <p>
                  Tyto zásady ochrany osobních údajů mohou být aktualizovány. Aktuální verze je vždy zveřejněna na těchto webových stránkách.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
