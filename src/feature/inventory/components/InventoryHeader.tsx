import { Button } from "@/components/ui/button";
import { ExportIcon, PlusIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router";

export function InventoryHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between ">
      <div>
        <h1 className="text-3xl">Products & Multi-Unit Stock</h1>
        <h4 className="text-slate-600">
          Manage inventory levels and pricing per unit
        </h4>
      </div>
      <div className="my-auto grid grid-cols-2 gap-x-6 mx-5">
        <Button variant={"ghost"}>
          <ExportIcon />
          Export
        </Button>
        <Button className="hover:bg-primary bg-primary/80" onClick={() => navigate("/inventory/new")}>
          <PlusIcon /> New Product
        </Button>
      </div>
    </div>
  );
}
