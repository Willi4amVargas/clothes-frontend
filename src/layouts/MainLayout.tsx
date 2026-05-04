import { SideMenu } from "@/components/SideMenu";
import { MainHeader } from "@/components/MainHeader";
import { Outlet } from "react-router";

export function MainLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <SideMenu />
      <div className="flex min-w-0 flex-1 flex-col">
        <MainHeader />
        <Outlet />
      </div>
    </div>
  );
}
