import { Card, CardContent } from "@/components/ui/card"

export function Gallery() {
  const examples = [
    {
      title: "Night Photography",
      description: "Removing grain from low-light photos",
    },
    {
      title: "Portrait Enhancement",
      description: "Smoothing skin while preserving details",
    },
    {
      title: "Document Scanning",
      description: "Cleaning up scanned documents and text",
    },
    {
      title: "Wildlife Photography",
      description: "Enhancing details in high-ISO wildlife shots",
    },
  ]

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">See the Difference</h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Browse our gallery of before and after examples to see how our denoising technology can transform your
            images.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {examples.map((example, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-[16/9] w-full">
                  <div className="absolute inset-0 flex">
                    <div className="w-1/2 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                      <div className="text-center p-4">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Before</span>
                      </div>
                    </div>
                    <div className="w-1/2 bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      <div className="text-center p-4">
                        <span className="text-sm font-medium text-teal-600 dark:text-teal-400">After</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{example.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{example.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
