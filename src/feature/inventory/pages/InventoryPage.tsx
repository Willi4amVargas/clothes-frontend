import { useState } from "react";
import { InventoryHeader } from "../components/InventoryHeader";
import { InventoryList } from "../components/InventoryList";
import { InventoryListUnits } from "../components/InventoryListUnits";
import {
  InventoryStatsCard,
  type InventoryStatsCardProps,
} from "../components/InventoryStatsCard";
import type { Product } from "../models/Product";

const inventoryStats: InventoryStatsCardProps[] = [
  {
    title: "Total SKUs",
    value: "4,281",
    trendLabel: "",
    trendTone: "neutral",
  },
  {
    title: "Low Stock Alerts",
    value: "24",
    trendLabel: "items need attention",
    trendTone: "negative",
  },
  {
    title: "Total Inventory Value",
    value: "$1.2M",
    trendLabel: "",
    trendTone: "neutral",
  },
  {
    title: "Recent Operations",
    value: "142",
    trendLabel: "today",
    trendTone: "neutral",
  },
];

export function InventoryPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined,
  );
  return (
    <div className="mx-5">
      <InventoryHeader />
      <div className="grid grid-cols-4 gap-3 mt-4">
        {inventoryStats.map((i) => (
          <InventoryStatsCard
            title={i.title}
            trendLabel={i.trendLabel}
            trendTone={i.trendTone}
            value={i.value}
          />
        ))}
      </div>
      <div className="grid grid-cols-5 gap-x-2 mt-4">
        <div className="col-span-3">
          <InventoryList setSelectedProduct={setSelectedProduct} />
        </div>
        <div className="col-span-2">
          <InventoryListUnits selectedProduct={selectedProduct} />
        </div>
      </div>
    </div>
  );
}
