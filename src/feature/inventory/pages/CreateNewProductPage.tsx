import {
  ArrowLeftIcon,
  FloppyDiskIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { NewProductForm } from "../components/NewProductForm";
import { NewProductSidebar } from "../components/NewProductSidebar";
import { useForm } from "react-hook-form";
import { ProductSchema, type ProductInputType } from "../schemas/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useInventory } from "../hooks/use-inventory";
import { useState } from "react";

export function CreateNewProductPage() {
  const navigate = useNavigate();
  const { createInventory } = useInventory();
  const [disableBtn, setDisableBtn] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProductInputType>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      discount: 0,
      status: true,
    },
  });

  const onSubmit = async (productInput: ProductInputType) => {
    setDisableBtn(true);
    await createInventory(productInput);
    reset();
    setDisableBtn(false);
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-5 pb-10">
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => navigate("/inventory")}
            className="hover:text-foreground transition-colors"
          >
            Inventory
          </button>
          <span>/</span>
          <span className="text-foreground font-medium">New Product</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">
            Create New Product
          </h1>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/inventory")}
            >
              <ArrowLeftIcon weight="bold" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
              disabled={disableBtn}
            >
              <FloppyDiskIcon weight="bold" />
              Save Product
            </Button>
          </div>
        </div>
      </div>

      {hasErrors && (
        <Alert variant="destructive" className="mb-6">
          <WarningCircleIcon className="h-4 w-4" weight="bold" />
          <AlertTitle>Validation Error</AlertTitle>
          <AlertDescription>
            Please fix the errors in the form before submitting.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8">
          <NewProductForm
            register={register}
            control={control}
            errors={errors}
          />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <NewProductSidebar register={register} errors={errors} />
        </div>
      </div>
    </form>
  );
}
