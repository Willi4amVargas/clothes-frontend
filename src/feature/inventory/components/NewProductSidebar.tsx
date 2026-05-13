import { PercentIcon } from "@phosphor-icons/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { ProductInputType } from "../schemas/product.schema";

export function NewProductSidebar({
  register,
  errors,
}: {
  register: UseFormRegister<ProductInputType>;
  errors: FieldErrors<ProductInputType>;
}) {
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
                <InputGroupInput 
                  id="purchase-tax" 
                  placeholder="0.00" 
                  type="number"
                  step="0.01"
                  {...register("buy_tax", { valueAsNumber: true })} 
                />
                <InputGroupAddon align="inline-end">
                  <PercentIcon className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
              {errors.buy_tax && (
                <span className="text-xs text-destructive">{errors.buy_tax.message}</span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sales-tax">Sales Tax (%)</Label>
              <InputGroup>
                <InputGroupInput 
                  id="sales-tax" 
                  placeholder="0.00" 
                  type="number"
                  step="0.01"
                  {...register("sale_tax", { valueAsNumber: true })} 
                />
                <InputGroupAddon align="inline-end">
                  <PercentIcon className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
              {errors.sale_tax && (
                <span className="text-xs text-destructive">{errors.sale_tax.message}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
