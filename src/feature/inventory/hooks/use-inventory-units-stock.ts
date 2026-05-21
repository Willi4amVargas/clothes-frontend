import { useCallback, useState } from "react";
import type { ProductUnit } from "../models/ProductsUnits";
import type { Product } from "../models/Product";
import { apiClient } from "@/shared/lib/api";
import type { ProductStock } from "../models/ProductStock";

interface InventoryWithUnitsAndStock extends Product {
  units: ProductUnit[];
  stock: ProductStock[];
}

export function useInventoryUnitsStock() {
  const [inventoryWithUnitsAndStock, setInventoryWithUnitsAndStock] = useState<
    InventoryWithUnitsAndStock | undefined
  >(undefined);

  const getProductWithUnitsAndStock = useCallback(async (product_id: number) => {
    try {
      const productsUnits = await apiClient.get<InventoryWithUnitsAndStock>(
        "/products/" + product_id,
        {
          withAuth: true,
        },
      );
      setInventoryWithUnitsAndStock(productsUnits);
    } catch (error: any) {
      throw new Error(error);
    }
  }, []);

  return {
    inventoryWithUnitsAndStock,
    getProductWithUnitsAndStock,
  };
}
