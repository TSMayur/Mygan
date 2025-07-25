import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQ() {
  const faqs = [
    {
      question: "What types of images work best with your denoising tool?",
      answer:
        "Our denoising tool works with all types of images, but it's particularly effective for photographs with digital noise, grain, or compression artifacts. It works well with JPG, PNG, and TIFF formats.",
    },
    {
      question: "Will denoising affect the details in my images?",
      answer:
        "Our advanced AI algorithms are designed to preserve important details while removing noise. You can also adjust the strength of the denoising effect to find the perfect balance between noise reduction and detail preservation.",
    },
    {
      question: "Is there a limit to the file size I can upload?",
      answer:
        "Free accounts can upload images up to 5MB in size. Premium accounts can upload images up to 50MB, making it suitable for high-resolution professional photography.",
    },
    {
      question: "How long does the denoising process take?",
      answer:
        "Processing time depends on the image size and server load. Most images are processed within 5-30 seconds. Larger files may take longer, especially during peak usage times.",
    },
    {
      question: "Are my images stored on your servers?",
      answer:
        "We temporarily store your images during processing, but they are automatically deleted after 24 hours. We never use your images for any purpose other than providing the denoising service to you.",
    },
  ]

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Find answers to common questions about our image denoising service.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
