import { DenoiseForm } from "@/components/denoise-form"

export default function DenoisePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Image Denoising Tool</h1>
      <div className="max-w-4xl mx-auto">
        <DenoiseForm />
      </div>
    </div>
  )
}
