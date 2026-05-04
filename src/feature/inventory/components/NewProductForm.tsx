import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PricingUnit {
  id: string;
  unitType: string;
  cost: string;
  price: string;
  isDefault: boolean;
}

const initialUnits: PricingUnit[] = [
  { id: "1", unitType: "Single Unit", cost: "12.50", price: "24.99", isDefault: true },
  { id: "2", unitType: "Box (12 pcs)", cost: "135.00", price: "269.88", isDefault: false },
];

const brands = [
  "Nike",
  "Adidas",
  "Puma",
  "Under Armour",
  "Reebok",
  "New Balance",
  "ASICS",
  "Columbia",
];

const countries = [
  "United States",
  "China",
  "Vietnam",
  "India",
  "Bangladesh",
  "Turkey",
  "Italy",
  "Portugal",
];

export function NewProductForm() {
  const [isActive, setIsActive] = useState(true);
  const [units, setUnits] = useState<PricingUnit[]>(initialUnits);

  const handleAddUnit = () => {
    const newUnit: PricingUnit = {
      id: Date.now().toString(),
      unitType: "",
      cost: "",
      price: "",
      isDefault: false,
    };
    setUnits([...units, newUnit]);
  };

  const handleDeleteUnit = (id: string) => {
    setUnits(units.filter((u) => u.id !== id));
  };

  const handleDefaultChange = (id: string) => {
    setUnits(
      units.map((u) => ({
        ...u,
        isDefault: u.id === id,
      }))
    );
  };

  const handleUnitChange = (id: string, field: keyof PricingUnit, value: string) => {
    setUnits(
      units.map((u) => (u.id === id ? { ...u, [field]: value } : u))
    );
  };

  const calculateMarkup = (cost: string, price: string): string => {
    const costNum = parseFloat(cost);
    const priceNum = parseFloat(price);
    if (!costNum || !priceNum) return "--";
    const markup = ((priceNum - costNum) / costNum) * 100;
    return `${markup.toFixed(1)}%`;
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
          <CardTitle>General Information</CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="active-status" className="text-xs text-muted-foreground">
              Active Status
            </Label>
            <Switch
              id="active-status"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="product-code">Product Code</Label>
              <Input id="product-code" placeholder="PRD-0001" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="brand">Brand</Label>
              <Select>
                <SelectTrigger id="brand">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand.toLowerCase()}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="product-description">Product Description</Label>
              <Input
                id="product-description"
                placeholder="Enter product description..."
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="model">Model</Label>
              <Input id="model" placeholder="Model number" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="internal-ref">Internal Reference</Label>
              <Input id="internal-ref" placeholder="INT-REF-001" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="country">Country of Origin</Label>
              <Select>
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country.toLowerCase()}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
          <CardTitle>Multi-unit Pricing</CardTitle>
          <Button variant="outline" size="sm" onClick={handleAddUnit}>
            <PlusIcon weight="bold" />
            Add Unit
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Unit Type</TableHead>
                <TableHead className="font-semibold">Cost (USD)</TableHead>
                <TableHead className="font-semibold">Price (USD)</TableHead>
                <TableHead className="font-semibold">Markup</TableHead>
                <TableHead className="font-semibold text-center">Default</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell>
                    <Input
                      value={unit.unitType}
                      onChange={(e) =>
                        handleUnitChange(unit.id, "unitType", e.target.value)
                      }
                      placeholder="e.g. Single Unit"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={unit.cost}
                      onChange={(e) =>
                        handleUnitChange(unit.id, "cost", e.target.value)
                      }
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={unit.price}
                      onChange={(e) =>
                        handleUnitChange(unit.id, "price", e.target.value)
                      }
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-semibold text-emerald-600">
                      {calculateMarkup(unit.cost, unit.price)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <input
                      type="radio"
                      name="default-unit"
                      checked={unit.isDefault}
                      onChange={() => handleDefaultChange(unit.id)}
                      className="h-4 w-4 accent-primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteUnit(unit.id)}
                    >
                      <TrashIcon weight="bold" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
