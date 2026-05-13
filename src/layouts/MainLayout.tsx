import { SideMenu } from "@/components/SideMenu";
import { MainHeader } from "@/components/MainHeader";
import { Outlet } from "react-router";
import { useApp } from "@/hooks/use-app";
import { ContextLayout } from "./ContextLayout";

export function MainLayout() {
  const { fullscreen } = useApp();
  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <SideMenu />
      <div className="flex min-w-0 flex-1 flex-col">
        {!fullscreen && <MainHeader />}
        <ContextLayout>
          <Outlet />
        </ContextLayout>
      </div>
    </div>
  );
}
