import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="grid min-h-screen md:grid-cols-2">
      <section className="hidden flex-col justify-end bg-primary p-12 text-white md:flex">
        <h1 className="text-4xl font-semibold">Enterprise Core ERP</h1>
        <p className="mt-3 max-w-md text-base text-primary/10">
          Secure, scalable resource management for modern enterprises.
          Delivering precision and control at scale.
        </p>
      </section>

      <section className="flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md">
          <Outlet />
          <footer className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
            <span>© 2026 Corporate Systems International</span>
            <a href="#" className="hover:text-slate-700">
              Privacy
            </a>
            <a href="#" className="hover:text-slate-700">
              Terms
            </a>
            <a href="#" className="hover:text-slate-700">
              Status
            </a>
          </footer>
        </div>
      </section>
    </main>
  )
}
