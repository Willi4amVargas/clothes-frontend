import { TransactionArea } from "../components/TransactionArea";
import { CheckoutSidebar } from "../components/CheckoutSidebar";
import { useApp } from "@/hooks/use-app";
import { useEffect } from "react";

export function PosTerminalPage() {
  const { fullscreen, toggleFullscreen } = useApp();
  useEffect(() => {
    toggleFullscreen(true);
    return () => {
      toggleFullscreen(false);
    };
  }, [fullscreen]);
  return (
    <div className="mx-5 mt-5 h-[calc(100vh-6rem)]">
      <div className="flex gap-3 h-full">
        <div className="w-[70%]">
          <TransactionArea />
        </div>
        <div className="w-[30%]">
          <CheckoutSidebar />
        </div>
      </div>
    </div>
  );
}
