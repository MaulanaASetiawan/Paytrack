import About from "@/components/About";
import Card from "@/components/Card";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="flex w-full flex-col">
      <section id="home" className="flex min-h-[calc(100vh-60px)] flex-col items-center justify-center px-6 py-20 md:px-16 lg:px-24">
        <div className="w-full max-w-6xl space-y-20">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12">
            <div className="space-y-8 md:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-300">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                Paytrack 2.0 is live
              </div>
              
              <h1 className="text-4xl font-medium tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
                Track every payment. <br />
                <span className="text-neutral-400">Master your cash flow.</span>
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
                Manage invoices, monitor incoming payments, automate overdue reminders, and get real-time financial insights—all in one place.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button className="rounded-md bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-neutral-200">
                  Get started
                </button>
                <button className="rounded-md border border-neutral-800 bg-transparent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-900">
                  Request a demo
                </button>
              </div>
            </div>

            <div className="md:col-span-5 flex justify-center">
               <div className="relative w-full max-w-sm aspect-square rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden flex items-center justify-center p-8">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800 to-neutral-900 opacity-50"></div>
                  <div className="relative z-10 w-full space-y-4">
                    <div className="h-2 w-1/3 bg-neutral-800 rounded"></div>
                    <div className="h-16 w-full bg-neutral-800 rounded-lg flex items-center px-4">
                       <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                         <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                       </div>
                       <div className="ml-4 space-y-2 flex-1">
                         <div className="h-2 w-1/2 bg-neutral-700 rounded"></div>
                         <div className="h-2 w-1/4 bg-neutral-700 rounded"></div>
                       </div>
                    </div>
                    <div className="h-16 w-full bg-neutral-800 rounded-lg opacity-50"></div>
                    <div className="h-16 w-full bg-neutral-800 rounded-lg opacity-20"></div>
                  </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8 border-t border-neutral-800 pt-16">
            <Card
              title="Invoice Tracking"
              description="Track incoming and outgoing payment status automatically."
              link="/docs/invoice-tracking"
            />
            <Card
              title="Cash Flow Reports"
              description="Get detailed monthly summaries of your income and expenses."
              link="/docs/cashflow-reports"
            />
            <Card
              title="Automated Reminders"
              description="Send payment notifications to clients before due dates."
              link="/docs/payment-reminders"
            />
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-20">
        <About />
      </section>
      <section id="contact" className="scroll-mt-20">
        <Contact />
      </section>
    </main>
  );
}