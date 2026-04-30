import { LogoutButton } from "@/feature/auth/components/LogoutButton";

export function DashboardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <section className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Signed in as
          <span className="font-medium">{"Authenticated user"}</span>.
        </p>
        <div className="mt-6">
          <LogoutButton>Logout</LogoutButton>
        </div>
      </section>
    </main>
  );
}
