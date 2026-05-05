import { FloppyDiskIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { CreateClientForm } from "../components/CreateClientForm";
import { CreateClientSidebar } from "../components/CreateClientSidebar";
import { useNavigate } from "react-router";

export function CreateClientPage() {
  const navigate = useNavigate();
  return (
    <div className="mx-5">
      <div className="flex justify-between items-end pb-4 border-b mb-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <button
            onClick={() => navigate("/clients")}
            className="hover:text-foreground transition-colors"
          >
            Modulo de Clientes
          </button>
          <span>/</span>
          <span className="text-foreground font-medium">New Client</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Cancelar
          </Button>
          <Button variant="default" size="sm" className="gap-1.5">
            <FloppyDiskIcon className="h-3.5 w-3.5" />
            Guardar Cliente
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-8">
          <CreateClientForm />
        </div>
        <div className="col-span-4">
          <CreateClientSidebar />
        </div>
      </div>
    </div>
  );
}
