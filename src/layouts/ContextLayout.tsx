import { InventoryProvider } from "@/feature/inventory/context/inventory-context";
import type { ReactNode } from "react";

export function ContextLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <InventoryProvider>{children}</InventoryProvider>
    </>
  );
}
