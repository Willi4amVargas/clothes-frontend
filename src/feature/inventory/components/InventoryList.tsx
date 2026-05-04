import { FunnelIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo, useState } from "react";

type InventoryItemStatus = "IN STOCK" | "LOW STOCK" | "OUT OF STOCK";

interface InventoryItem {
  id: string;
  sku: string;
  productName: string;
  category: string;
  baseStock: number;
  status: InventoryItemStatus;
}

const data: InventoryItem[] = [
  {
    id: "1",
    sku: "PRD-9021",
    productName: "Industrial Sealant Pro",
    category: "Chemicals",
    baseStock: 1450,
    status: "IN STOCK",
  },
  {
    id: "2",
    sku: "PRD-8834",
    productName: "Heavy Duty Bearings X2",
    category: "Mechanical",
    baseStock: 12,
    status: "LOW STOCK",
  },
  {
    id: "3",
    sku: "PRD-1045",
    productName: "Copper Wiring Bundle 50m",
    category: "Electrical",
    baseStock: 840,
    status: "IN STOCK",
  },
  {
    id: "4",
    sku: "PRD-2290",
    productName: "Safety Goggles Standard",
    category: "PPE",
    baseStock: 0,
    status: "OUT OF STOCK",
  },
];

// Función auxiliar para renderizar el badge de estado
const StatusBadge = ({ status }: { status: InventoryItemStatus }) => {
  switch (status) {
    case "IN STOCK":
      return (
        <Badge
          variant="secondary"
          className="bg-[#D1FAE5] text-[#166534] font-medium text-xs px-3 py-1 hover:bg-[#D1FAE5]/80"
        >
          IN STOCK
        </Badge>
      );
    case "LOW STOCK":
      return (
        <Badge
          variant="destructive"
          className="bg-[#FEE2E2] text-[#991B1B] font-medium text-xs px-3 py-1 hover:bg-[#FEE2E2]/80"
        >
          LOW STOCK
        </Badge>
      );
    case "OUT OF STOCK":
      return (
        <Badge
          variant="outline"
          className="bg-[#F3F4F6] text-[#6B7280] font-medium text-xs px-3 py-1 border-none hover:bg-[#F3F4F6]/80"
        >
          OUT OF STOCK
        </Badge>
      );
    default:
      return null;
  }
};

// Formateador de números (para añadir comas)
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export function InventoryList() {
  const [searchTerm, setSearchTerm] = useState("");

  // Lógica de filtrado
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [searchTerm]);

  return (
    <div className="w-full ring-1 ring-foreground/10 overflow-hidden bg-white">
      <div className="flex items-center gap-2 p-4 border-b bg-gray-50/50">
        <div className="relative grow max-w-sm">
          <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Filter products..."
            className="pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="text-gray-500">
          <MagnifyingGlassIcon className="h-4 w-4" />
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-900 w-30">
              SKU
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              Product Name
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              Category
            </TableHead>
            <TableHead className="font-semibold text-gray-900 text-right">
              Base Stock
            </TableHead>
            <TableHead className="font-semibold text-gray-900 text-right">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium text-gray-700">
                {item.sku}
              </TableCell>
              <TableCell className="text-gray-900">
                {item.productName}
              </TableCell>
              <TableCell className="text-gray-600">{item.category}</TableCell>
              <TableCell
                className={`text-right font-medium ${
                  item.status === "LOW STOCK"
                    ? "text-[#DC2626]"
                    : "text-gray-700"
                }`}
              >
                {formatNumber(item.baseStock)} units
              </TableCell>
              <TableCell className="text-right">
                <StatusBadge status={item.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
