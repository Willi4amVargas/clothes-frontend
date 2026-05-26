import { MainHeader } from '#/components/MainHeader'
import { SideMenu } from '#/components/SideMenu'
import { protectedLoader } from '#/loaders/loaders'
import { createFileRoute, Outlet } from '@tanstack/react-router'


export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
  loader: protectedLoader,
})

function RouteComponent() {

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <SideMenu />
      <div className="flex min-w-0 flex-1 flex-col">
        <MainHeader />
        <Outlet />
      </div>
    </div>
  )
}
