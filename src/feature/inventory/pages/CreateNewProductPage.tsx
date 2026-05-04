import { ArrowLeftIcon, FloppyDiskIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { NewProductForm } from "../components/NewProductForm";
import { NewProductSidebar } from "../components/NewProductSidebar";

export function CreateNewProductPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-5">
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <button
            onClick={() => navigate("/inventory")}
            className="hover:text-foreground transition-colors"
          >
            Inventory
          </button>
          <span>/</span>
          <span className="text-foreground font-medium">New Product</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-heading font-medium">Create New Product</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/inventory")}>
              <ArrowLeftIcon weight="bold" />
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <FloppyDiskIcon weight="bold" />
              Save Product
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8">
          <NewProductForm />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <NewProductSidebar />
        </div>
      </div>
    </div>
  );
}
