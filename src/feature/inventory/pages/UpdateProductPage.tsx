import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeftIcon,
  FloppyDiskIcon,
  TrashIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useInventory } from "../hooks/use-inventory";
import { useInventoryUnitsStock } from "../hooks/use-inventory-units-stock";
import {
  ProductSchema,
  type ProductInputType,
} from "../schemas/product.schema";
import { NewProductForm } from "../components/NewProductForm";
import { NewProductSidebar } from "../components/NewProductSidebar";

export function UpdateProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateInventory, deleteInventory } = useInventory();
  const { inventoryWithUnitsAndStock, getProductWithUnitsAndStock } =
    useInventoryUnitsStock();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProductInputType>({
    resolver: zodResolver(ProductSchema),
  });

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          await getProductWithUnitsAndStock(Number(id));
        } catch (error) {
          console.error("Failed to fetch product", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (inventoryWithUnitsAndStock) {
      reset({
        ...inventoryWithUnitsAndStock,
        products_units: inventoryWithUnitsAndStock.units.map((u) => ({
          id: u.id,
          unit: u.unit,
          cost: u.cost,
          price: u.price,
        })),
      });
    }
  }, [inventoryWithUnitsAndStock, reset]);

  const onSubmit = async (data: ProductInputType) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      console.log(data);
      await updateInventory(Number(id), data);
      navigate("/inventory");
    } catch (error) {
      console.error("Failed to update product", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (
      window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone.",
      )
    ) {
      setIsDeleting(true);
      try {
        await deleteInventory(Number(id));
        navigate("/inventory");
      } catch (error) {
        console.error("Failed to delete product", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground animate-pulse">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (!inventoryWithUnitsAndStock) {
    return (
      <div className="mx-5 py-10">
        <Alert variant="destructive">
          <WarningCircleIcon className="h-4 w-4" weight="bold" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Product not found or failed to load.
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/inventory")}
        >
          <ArrowLeftIcon weight="bold" />
          Back to Inventory
        </Button>
      </div>
    );
  }

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
          <span className="text-foreground font-medium">Update Product</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">
            Update Product: {inventoryWithUnitsAndStock.code}
          </h1>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting || isSubmitting}
            >
              <TrashIcon weight="bold" />
              Delete
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/inventory")}
              disabled={isSubmitting || isDeleting}
            >
              <ArrowLeftIcon weight="bold" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
              disabled={isSubmitting || isDeleting}
            >
              <FloppyDiskIcon weight="bold" />
              {isSubmitting ? "Updating..." : "Update Product"}
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
