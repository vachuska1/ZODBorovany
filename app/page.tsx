import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { MenuSection } from "@/components/menu-section"
import { Contact } from "@/components/contact"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <MenuSection />
      <Contact />
    </main>
  )
}
