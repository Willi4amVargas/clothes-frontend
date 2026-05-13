import {
  ArrowClockwiseIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";

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
import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useInventory } from "../hooks/use-inventory";
import type { Product } from "../models/Product";

// Formateador de números (para añadir comas)
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export function InventoryList({
  setSelectedProduct,
}: {
  setSelectedProduct: Dispatch<SetStateAction<Product | undefined>>;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const { inventory, getInventory } = useInventory();

  // Lógica de filtrado
  const filteredData = useMemo(() => {
    return inventory?.filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [searchTerm]);

  useEffect(() => {
    if (!inventory) {
      getInventory();
    }
  }, []);

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
        <Button variant={"outline"} onClick={async () => await getInventory()}>
          Reload Products
          <ArrowClockwiseIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="relative h-[45vh] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-900 w-30">
                Code
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Product Name
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Category
              </TableHead>
              <TableHead className="font-semibold text-gray-900 text-right">
                Discount
              </TableHead>
              <TableHead className="font-semibold text-gray-900 text-right">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData &&
              filteredData.map((item) => (
                <TableRow
                  key={item.id}
                  onClick={() => setSelectedProduct(item)}
                  className="hover:cursor-pointer"
                >
                  <TableCell className="font-medium text-gray-700">
                    {item.code}
                  </TableCell>
                  <TableCell className="text-gray-900 truncate max-w-xs w-1/6">
                    {item.description}
                  </TableCell>
                  <TableCell className="text-gray-600">{item.model}</TableCell>
                  <TableCell>% {formatNumber(+item.discount)}</TableCell>
                  <TableCell className=" text-right ">
                    {item.status ? (
                      <Badge variant={"default"}>ACTIVE</Badge>
                    ) : (
                      <Badge variant={"destructive"}>DISABLED</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
