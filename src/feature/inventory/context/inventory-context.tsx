import { createContext, useState, type ReactNode } from "react";
import type { Product } from "../models/Product";
import { apiClient } from "@/shared/lib/api";
import type { ProductUnit } from "../models/ProductsUnits";
import type { ProductStock } from "../models/ProductStock";
import { toast } from "react-toastify";
import type { ProductInputType } from "../schemas/product.schema";

interface InventoryContextValue {
  inventory: Product[] | undefined;
  getInventory: () => Promise<void>;
  createInventory: (product: ProductInputType) => Promise<void>;
  updateInventory: (id: number, product: ProductInputType) => Promise<void>;
  deleteInventory: (id: number) => Promise<void>;
}

export const InventoryContext = createContext<
  undefined | InventoryContextValue
>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<Product[] | undefined>(undefined);

  const getInventory = async () => {
    try {
      const products = await apiClient.get<Product[]>("/products", {
        withAuth: true,
      });
      setInventory(products);
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const createInventory = async (product: ProductInputType) => {
    try {
      const newProduct = await apiClient.post<Product & { units: ProductUnit[]; stock: ProductStock[] }>(
        "/products",
        product,
        {
          withAuth: true,
          dryRun: false,
        },
      );
      toast.success(`Product ${newProduct.code} created successfully!`);
    } catch (error: any) {
      if (error.message) {
        toast.error(error.message);
      }

      throw new Error(error);
    }
  };

  const updateInventory = async (
    id: number,
    product: ProductInputType,
  ) => {
    try {
      const updatedProduct = await apiClient.put<Product & { units: ProductUnit[]; stock: ProductStock[] }>(
        `/products/${id}`,
        product,
        {
          withAuth: true,
          dryRun: false,
        },
      );
      toast.success(`Product ${updatedProduct.code} updated successfully!`);
    } catch (error: any) {
      if (error.message) {
        toast.error(error.message);
      }

      throw new Error(error);
    }
  };

  const deleteInventory = async (id: number) => {
    try {
      await apiClient.delete<null>(`/products/${id}`, null, {
        withAuth: true,
        dryRun: false,
      });
      toast.success(`Product ${id} deleted successfully!`);
    } catch (error: any) {
      if (error.message) {
        toast.error(error.message);
      }

      throw new Error(error);
    }
  };

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        getInventory,
        createInventory,
        updateInventory,
        deleteInventory,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}
