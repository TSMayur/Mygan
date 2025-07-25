import { HeroSection } from "@/components/hero-section"
import { Features } from "@/components/features"
import { Gallery } from "@/components/gallery"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"
import { Newsletter } from "@/components/newsletter"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <Features />
      <Gallery />
      <Testimonials />
      <FAQ />
      <Newsletter />
    </div>
  )
}
