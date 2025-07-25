export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About ImageCleanse</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-lg mb-6">
            ImageCleanse is a cutting-edge image denoising service that uses advanced AI algorithms to remove noise and
            enhance the quality of your images.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p>
            Our mission is to provide photographers, designers, and everyday users with professional-grade tools to
            restore and enhance their images without requiring technical expertise.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Technology</h2>
          <p>
            We use state-of-the-art deep learning models specifically trained on diverse image datasets to identify and
            remove various types of noise while preserving important details and textures.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Why Choose Us</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Advanced AI-powered denoising algorithms</li>
            <li>User-friendly interface with real-time previews</li>
            <li>Customizable denoising settings for perfect results</li>
            <li>Fast processing even for high-resolution images</li>
            <li>Secure handling of your images</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
