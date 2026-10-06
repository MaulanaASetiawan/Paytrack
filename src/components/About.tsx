export default function About() {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-16 md:px-16 lg:px-24 border-t border-neutral-800">
      <div className="w-full max-w-6xl space-y-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-300">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              About Paytrack
            </div>

            <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl lg:text-5xl">
              Empowering your financial <br />
              <span className="text-neutral-400">clarity and growth</span>
            </h2>

            <div className="space-y-4 text-base leading-relaxed text-neutral-400">
              <p>
                Paytrack is a comprehensive payment tracking and cash flow management platform designed to help businesses streamline their financial operations. With features like invoice tracking, cash flow reports, and automated reminders, Paytrack empowers businesses to stay on top of their finances and make informed decisions.
              </p>
              <p>
                Our mission is to simplify financial management for businesses of all sizes, providing them with the tools they need to monitor incoming payments, automate overdue reminders, and gain real-time insights into their cash flow.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
              <p className="text-sm leading-relaxed text-neutral-300">
                At Paytrack, we believe effective financial management is the key to business sustainability. Our platform enables businesses to take control, reduce admin burdens, and focus on growth.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
                <div className="text-2xl font-medium text-white">$10M+</div>
                <div className="mt-1 text-xs font-medium text-neutral-500 uppercase tracking-wider">Transactions</div>
              </div>
              <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
                <div className="text-2xl font-medium text-orange-500">99.9%</div>
                <div className="mt-1 text-xs font-medium text-neutral-500 uppercase tracking-wider">Uptime</div>
              </div>
              <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
                <div className="text-2xl font-medium text-orange-500">50k+</div>
                <div className="mt-1 text-xs font-medium text-neutral-500 uppercase tracking-wider">Invoices</div>
              </div>
              <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
                <div className="text-2xl font-medium text-white">24/7</div>
                <div className="mt-1 text-xs font-medium text-neutral-500 uppercase tracking-wider">Reminders</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}