export default function Contact() {
  return (
    <div className="flex w-full flex-col items-center justify-center py-20 border-t border-neutral-800">
      
      <div className="w-full max-w-5xl space-y-12 px-6 md:px-16 lg:px-24">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-medium text-white sm:text-4xl">
            Get in <span className="text-neutral-400">touch</span>
          </h2>
          <p className="text-neutral-400">
            Have a question or want to see a demo? Drop us a message!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          
          <div className="flex flex-col justify-center space-y-8 rounded-xl border border-neutral-800 bg-neutral-900 p-8">
            <h3 className="text-xl font-medium text-white">Contact Information</h3>
            <div className="space-y-6 text-sm text-neutral-300">
                
              <div className="flex items-center space-x-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-neutral-800 text-neutral-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span>hello@paytrack.com</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-neutral-800 text-neutral-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span>+1 (555) 123-4567</span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-neutral-800 text-neutral-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span>123 Finance Street, NY 10001</span>
              </div>
            </div>
          </div>

          <form className="space-y-6 rounded-xl border border-neutral-800 bg-neutral-900 p-8">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-neutral-300">Name</label>
              <input 
                type="text" 
                id="name"
                placeholder="John Doe"
                className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-neutral-300">Email</label>
              <input 
                type="email" 
                id="email"
                placeholder="john@example.com"
                className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-neutral-300">Message</label>
              <textarea 
                id="message"
                rows={4}
                placeholder="How can we help you?"
                className="w-full resize-none rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600"
              />
            </div>

            <button 
              type="submit"
              className="w-full rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-900 mt-2"
            >
              Send Message
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}