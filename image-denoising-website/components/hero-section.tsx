import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-teal-50 to-white dark:from-slate-900 dark:to-background py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Transform Noisy Images into Crystal Clear Masterpieces
              </h1>
              <p className="max-w-[600px] text-slate-600 dark:text-slate-400 md:text-xl">
                Our advanced AI-powered denoising technology removes unwanted noise while preserving important details
                in your images.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/denoise">
                <Button size="lg" className="gap-1.5">
                  Upload Your Image
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-[500px] aspect-[4/3] overflow-hidden rounded-xl shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 flex">
                    <div className="w-1/2 bg-slate-300 dark:bg-slate-700 flex items-center justify-center">
                      <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Noisy Image</span>
                    </div>
                    <div className="w-1/2 bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center">
                      <span className="text-teal-600 dark:text-teal-400 text-sm font-medium">Denoised Image</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-semibold text-slate-600 dark:text-slate-300">Before / After</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
