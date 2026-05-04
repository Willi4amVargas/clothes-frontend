import { ArrowRightIcon, PercentIcon, UploadSimpleIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";

const stockLevels = [
  { label: "Single Units", value: 245 },
  { label: "Boxes (Unopened)", value: 18 },
  { label: "Reserved (Pending)", value: 32 },
];

export function NewProductSidebar() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Tax Configuration</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="purchase-tax">Purchase Tax (%)</Label>
              <InputGroup>
                <InputGroupInput id="purchase-tax" placeholder="0.00" />
                <InputGroupAddon align="inline-end">
                  <PercentIcon className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sales-tax">Sales Tax (%)</Label>
              <InputGroup>
                <InputGroupInput id="sales-tax" placeholder="0.00" />
                <InputGroupAddon align="inline-end">
                  <PercentIcon className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Current Stock</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-3">
            {stockLevels.map((level) => (
              <div
                key={level.label}
                className="flex items-center justify-between border-b border-dashed pb-3 last:border-0 last:pb-0"
              >
                <span className="text-xs text-muted-foreground">{level.label}</span>
                <span className="text-sm font-bold text-foreground">{level.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 border-t pt-3">
          <div className="flex w-full items-center justify-between text-xs">
            <span className="text-muted-foreground">Last Inventory Update</span>
            <span className="font-medium">Jan 15, 2026</span>
          </div>
          <Button variant="outline" size="sm" className="w-full text-xs">
            View Stock History
            <ArrowRightIcon weight="bold" />
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Product Image</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex aspect-square w-full flex-col items-center justify-center rounded-none border-2 border-dashed border-muted-foreground/25 bg-muted/30 text-center transition-colors hover:bg-muted/50">
            <UploadSimpleIcon className="mb-2 size-8 text-muted-foreground/50" weight="light" />
            <p className="text-xs font-medium text-muted-foreground">Click to upload image</p>
            <p className="mt-1 text-[10px] text-muted-foreground/70">PNG, JPG up to 5MB</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
