import {
  BarcodeIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LineItem {
  id: string;
  productName: string;
  sku: string;
  qty: number;
  unitPrice: number;
  taxPercent: number;
  total: number;
}

const initialItems: LineItem[] = [
  {
    id: "1",
    productName: "ThinkPad T14 Gen 3",
    sku: "LNV-T14-001",
    qty: 2,
    unitPrice: 1299.0,
    taxPercent: 8.5,
    total: 2818.83,
  },
  {
    id: "2",
    productName: "Ergonomic Keyboard MK500",
    sku: "LOG-MK500-BLK",
    qty: 5,
    unitPrice: 49.95,
    taxPercent: 8.5,
    total: 271.72,
  },
  {
    id: "3",
    productName: "USB-C Docking Station",
    sku: "DEL-DOCK-USB-C",
    qty: 1,
    unitPrice: 189.0,
    taxPercent: 8.5,
    total: 205.07,
  },
];

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
};

export function TransactionArea() {
  const [items, setItems] = useState<LineItem[]>(initialItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [clientSearch, setClientSearch] = useState("");

  const handleQtyChange = (id: string, qty: string) => {
    const parsedQty = parseInt(qty, 10) || 0;
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const newTotal = parsedQty * item.unitPrice * (1 + item.taxPercent / 100);
          return { ...item, qty: parsedQty, total: parseFloat(newTotal.toFixed(2)) };
        }
        return item;
      }),
    );
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl font-semibold text-slate-900">
              New Sale #SO-2491
            </h1>
            <Badge
              variant="secondary"
              className="bg-[#D1FAE5] text-[#166534] font-semibold text-[10px] uppercase tracking-wider px-2 py-0 hover:bg-[#D1FAE5]/80"
            >
              Sale
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500">Oct 24, 2023 - 10:42 AM</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-3">
        <Label htmlFor="client-select" className="text-xs font-medium text-gray-600">
          Client
        </Label>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            id="client-select"
            className="pl-8 h-8 text-xs"
            placeholder="Search client..."
            value={clientSearch}
            onChange={(e) => setClientSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1.5 bg-[#FEF2F2] border border-[#FCA5A5]">
          <WarningIcon className="h-3.5 w-3.5 text-[#DC2626] shrink-0" />
          <p className="text-[11px] font-medium text-[#DC2626]">
            Credit Limit Exceeded ({formatCurrency(15000)} / {formatCurrency(10000)})
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-3">
        <Label htmlFor="product-search" className="text-xs font-medium text-gray-600">
          Fast Product Search / Barcode
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <BarcodeIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input
              id="product-search"
              className="pl-8 h-8 text-xs"
              placeholder="Scan barcode or type SKU/Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="secondary" size="sm" className="h-8 shrink-0">
            Browse
          </Button>
        </div>
      </div>

      <div className="flex-1 ring-1 ring-foreground/10 bg-white overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-600 w-10 text-center">
                  #
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Item / Description
                </TableHead>
                <TableHead className="font-semibold text-gray-600 text-center w-16">
                  Qty
                </TableHead>
                <TableHead className="font-semibold text-gray-600 text-right w-24">
                  Unit Price
                </TableHead>
                <TableHead className="font-semibold text-gray-600 text-right w-16">
                  Tax (%)
                </TableHead>
                <TableHead className="font-semibold text-gray-600 text-right w-24">
                  Total
                </TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item.id} className="group/row">
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-gray-100 text-[10px] font-medium text-gray-500">
                      {index + 1}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-900">
                        {item.productName}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {item.sku}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      className="h-6 w-14 text-center text-xs px-1 mx-auto"
                      value={item.qty}
                      onChange={(e) => handleQtyChange(item.id, e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="text-right text-xs text-gray-700 font-mono">
                    {formatCurrency(item.unitPrice)}
                  </TableCell>
                  <TableCell className="text-right text-xs text-gray-600 font-mono">
                    {item.taxPercent}%
                  </TableCell>
                  <TableCell className="text-right text-xs font-bold text-gray-900 font-mono">
                    {formatCurrency(item.total)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="h-6 w-6 text-gray-400 hover:text-[#DC2626] opacity-0 group-hover/row:opacity-100 transition-opacity"
                      onClick={() => handleDelete(item.id)}
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
