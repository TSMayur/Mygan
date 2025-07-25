import { ContactForm } from "@/components/contact-form"

export default function ContactPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <p className="text-lg mb-8">
          Have questions or feedback? We'd love to hear from you. Fill out the form below and we'll get back to you as
          soon as possible.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <ContactForm />

          <div>
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Our Information</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-300">Email</h3>
                  <p>support@imagecleanse.com</p>
                </div>

                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-300">Office Hours</h3>
                  <p>Monday - Friday: 9am - 5pm EST</p>
                </div>

                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-300">Address</h3>
                  <p>
                    123 Denoising Street
                    <br />
                    Tech City, TC 12345
                    <br />
                    United States
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
