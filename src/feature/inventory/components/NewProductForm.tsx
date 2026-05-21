import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import {
  Controller,
  useFieldArray,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { ProductInputType } from "../schemas/product.schema";

const origins = ["NACIONAL", "IMPORTADO"];

export function NewProductForm({
  register,
  control,
  errors,
}: {
  register: UseFormRegister<ProductInputType>;
  control: Control<ProductInputType>;
  errors: FieldErrors<ProductInputType>;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "products_units",
  });

  const watchedUnits = useWatch({
    control,
    name: "products_units",
  });

  const handleAddUnit = () => {
    append({
      id: 0,
      unit: "UNIDAD",
      cost: 0,
      price: 0,
    });
  };

  const calculateMarkup = (cost?: number, price?: number): string => {
    if (!cost || !price || cost <= 0) return "--";
    const markup = ((price - cost) / cost) * 100;
    return `${markup.toFixed(1)}%`;
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
          <CardTitle>General Information</CardTitle>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="active-status"
              className="text-xs text-muted-foreground"
            >
              Active Status
            </Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Switch
                  id="active-status"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="product-code">Product Code</Label>
              <Input
                id="product-code"
                placeholder="PRD-0001"
                {...register("code")}
              />
              {errors.code && (
                <span className="text-xs text-destructive">
                  {errors.code.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="Mark">Mark</Label>
              <Input
                id="product-mark"
                placeholder="Enter product Mark..."
                {...register("mark")}
              />
              {errors.mark && (
                <span className="text-xs text-destructive">
                  {errors.mark.message}
                </span>
              )}
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="product-description">Product Description</Label>
              <Input
                id="product-description"
                placeholder="Enter product description..."
                {...register("description")}
              />
              {errors.description && (
                <span className="text-xs text-destructive">
                  {errors.description.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                placeholder="Model number"
                {...register("model")}
              />
              {errors.model && (
                <span className="text-xs text-destructive">
                  {errors.model.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="internal-ref">Internal Reference</Label>
              <Input
                id="internal-ref"
                placeholder="INT-REF-001"
                {...register("referenc")}
              />
              {errors.referenc && (
                <span className="text-xs text-destructive">
                  {errors.referenc.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="Origin">Origin</Label>
              <Controller
                control={control}
                name="origin"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="Origin">
                      <SelectValue placeholder="Select Origin" />
                    </SelectTrigger>
                    <SelectContent>
                      {origins.map((origin) => (
                        <SelectItem key={origin} value={origin.toUpperCase()}>
                          {origin}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.origin && (
                <span className="text-xs text-destructive">
                  {errors.origin.message}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
          <CardTitle>Multi-unit Pricing</CardTitle>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={handleAddUnit}
          >
            <PlusIcon weight="bold" />
            Add Unit
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Unit Type</TableHead>
                <TableHead className="font-semibold">Cost</TableHead>
                <TableHead className="font-semibold">Price</TableHead>
                <TableHead className="font-semibold">Markup</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((_, index) => {
                const cost = watchedUnits?.[index]?.cost;
                const price = watchedUnits?.[index]?.price;
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <input
                        type="hidden"
                        {...register(`products_units.${index}.id` as const, {
                          valueAsNumber: true,
                        })}
                      />
                      <Input
                        placeholder="e.g. Single Unit"
                        {...register(`products_units.${index}.unit` as const)}
                      />
                      {errors.products_units?.[index]?.unit && (
                        <span className="text-xs text-destructive block mt-1">
                          {errors.products_units[index]?.unit?.message}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...register(`products_units.${index}.cost` as const, {
                          valueAsNumber: true,
                        })}
                      />
                      {errors.products_units?.[index]?.cost && (
                        <span className="text-xs text-destructive block mt-1">
                          {errors.products_units[index]?.cost?.message}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...register(`products_units.${index}.price` as const, {
                          valueAsNumber: true,
                        })}
                      />
                      {errors.products_units?.[index]?.price && (
                        <span className="text-xs text-destructive block mt-1">
                          {errors.products_units[index]?.price?.message}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold text-emerald-600">
                        {calculateMarkup(cost, price)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        type="button"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => remove(index)}
                      >
                        <TrashIcon weight="bold" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {errors.products_units &&
            typeof errors.products_units.message === "string" && (
              <div className="p-4 text-xs text-destructive">
                {errors.products_units.message}
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
