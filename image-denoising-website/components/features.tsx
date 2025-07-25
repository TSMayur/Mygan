import { Zap, Sliders, Download, Shield, Smartphone, ImageIcon } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: <Zap className="h-10 w-10 text-teal-600" />,
      title: "Fast Processing",
      description: "Our optimized algorithms process your images quickly, even at high resolutions.",
    },
    {
      icon: <Sliders className="h-10 w-10 text-teal-600" />,
      title: "Customizable Settings",
      description: "Fine-tune denoising parameters to achieve the perfect balance for your images.",
    },
    {
      icon: <Download className="h-10 w-10 text-teal-600" />,
      title: "Multiple Export Formats",
      description: "Download your denoised images in various formats including PNG, JPEG, and WEBP.",
    },
    {
      icon: <Shield className="h-10 w-10 text-teal-600" />,
      title: "Secure Processing",
      description: "Your images are processed securely and never stored permanently on our servers.",
    },
    {
      icon: <Smartphone className="h-10 w-10 text-teal-600" />,
      title: "Mobile Friendly",
      description: "Use our denoising tool on any device with our responsive design.",
    },
    {
      icon: <ImageIcon className="h-10 w-10 text-teal-600" />,
      title: "Batch Processing",
      description: "Process multiple images at once to save time on large projects.",
    },
  ]

  return (
    <section className="py-16 bg-white dark:bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Advanced Features for Perfect Results</h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Our image denoising service offers powerful tools to help you achieve professional-quality results with
            ease.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
