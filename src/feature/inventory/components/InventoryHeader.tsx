import { Button } from "@/components/ui/button";
import { ExportIcon, PlusIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router";

export function InventoryHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between ">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Products & Multi-Unit Stock</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage inventory levels and pricing per unit
        </p>
      </div>
      <div className="my-auto grid grid-cols-2 ">
        <Button variant={"ghost"}>
          <ExportIcon />
          Export
        </Button>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => navigate("/inventory/new")}>
          <PlusIcon /> New Product
        </Button>
      </div>
    </div>
  );
}
