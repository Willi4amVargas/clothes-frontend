import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useEffect } from "react";
import type { Product } from "../models/Product";
import { useInventoryUnitsStock } from "../hooks/use-inventory-units-stock";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@phosphor-icons/react";

export const InventoryListUnits = ({
  selectedProduct,
}: {
  selectedProduct: Product | undefined;
}) => {
  const { inventoryWithUnitsAndStock, getProductWithUnitsAndStock } =
    useInventoryUnitsStock();

  useEffect(() => {
    if (!selectedProduct) return;
    getProductWithUnitsAndStock(selectedProduct.id);
  }, [selectedProduct]);

  return (
    <Card className="mx-auto">
      <CardHeader className="flex flex-row items-center justify-between bg-zinc-50 border-b border-border">
        <CardTitle className="text-xl font-semibold text-foreground">
          {selectedProduct?.referenc}
        </CardTitle>
        <CardDescription className="text-sm font-medium text-muted-foreground">
          {selectedProduct?.code}
        </CardDescription>
        {selectedProduct && (
          <Button asChild variant={"link"} className="w-1/4">
            <Link to={`/inventory/update/${selectedProduct.id}`}>
              Details <ArrowRightIcon />
            </Link>
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        <h3 className="text-xl font-semibold text-foreground pt-1">
          {selectedProduct?.description}
        </h3>

        <Table className="border-t border-border">
          <TableHeader>
            <TableRow className="border-b-0 hover:bg-transparent">
              <TableHead className="text-sm font-normal text-muted-foreground w-32.5">
                Unit Type
              </TableHead>
              <TableHead className="text-sm font-normal text-muted-foreground text-right">
                Cost
              </TableHead>
              <TableHead className="text-sm font-normal text-muted-foreground text-right">
                Price
              </TableHead>
              <TableHead className="text-sm font-normal text-primary-500 text-right">
                In Stock
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryWithUnitsAndStock &&
              inventoryWithUnitsAndStock.units.map((unit) => (
                <TableRow
                  key={unit.id}
                  className="border-b border-dotted border-border last:border-b-0 hover:bg-zinc-50/50"
                >
                  <TableCell className="text-sm font-semibold text-zinc-900 py-3">
                    {unit.unit}
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-zinc-900 text-right">
                    ${unit.cost.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-zinc-900 text-right">
                    ${unit.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-primary-600 text-right">
                    {
                      inventoryWithUnitsAndStock.stock.find(
                        (stock) => stock.unit === unit.id,
                      )?.stock
                    }
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
