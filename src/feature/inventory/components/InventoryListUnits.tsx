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

interface UnitBreakdown {
  id: string;
  unitType: string;
  convRatio: number;
  cost: number;
  price: number;
  inStock: number;
}

const unitBreakdowns: UnitBreakdown[] = [
  {
    id: "1",
    unitType: "Box",
    convRatio: 24,
    cost: 120.0,
    price: 180.0,
    inStock: 45,
  },
  {
    id: "2",
    unitType: "Pack",
    convRatio: 6,
    cost: 32.0,
    price: 48.0,
    inStock: 30,
  },
  {
    id: "3",
    unitType: "Unit",
    convRatio: 1,
    cost: 6.0,
    price: 9.5,
    inStock: 190,
  },
];

export const InventoryListUnits = () => {
  const totalBaseUnits = unitBreakdowns.reduce(
    (sum, unit) => sum + unit.inStock * unit.convRatio,
    0,
  );

  return (
    <Card className="mx-auto">
      <CardHeader className="flex flex-row items-center justify-between bg-zinc-50 border-b border-border">
        <CardTitle className="text-xl font-semibold text-foreground">
          Unit Breakdown
        </CardTitle>
        <CardDescription className="text-sm font-medium text-muted-foreground">
          PRD-9021
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        <h3 className="text-xl font-semibold text-foreground pt-1">
          Industrial Sealant Pro
        </h3>

        <Table className="border-t border-border">
          <TableHeader>
            <TableRow className="border-b-0 hover:bg-transparent">
              <TableHead className="text-sm font-normal text-muted-foreground w-32.5">
                Unit Type
              </TableHead>
              <TableHead className="text-sm font-normal text-muted-foreground text-center">
                Conv. Ratio
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
            {unitBreakdowns.map((unit) => (
              <TableRow
                key={unit.id}
                className="border-b border-dotted border-border last:border-b-0 hover:bg-zinc-50/50"
              >
                <TableCell className="text-sm font-semibold text-zinc-900 py-3">
                  {unit.unitType}
                </TableCell>
                <TableCell className="text-sm font-normal text-zinc-600 text-center">
                  {unit.convRatio} units
                </TableCell>
                <TableCell className="text-sm font-semibold text-zinc-900 text-right">
                  ${unit.cost.toFixed(2)}
                </TableCell>
                <TableCell className="text-sm font-semibold text-zinc-900 text-right">
                  ${unit.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-sm font-semibold text-primary-600 text-right">
                  {unit.inStock}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-end pt-3 text-zinc-900">
          <span className="text-sm font-medium text-muted-foreground pr-2">
            Total Base Units:
          </span>
          <span className="text-xl font-bold tracking-tight">
            {totalBaseUnits.toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
