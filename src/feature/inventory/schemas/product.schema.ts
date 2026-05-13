import z from "zod";

export const ProductUnitSchema = z.object({
  id: z.number().optional(),
  unit: z.string().max(100),
  cost: z.number().min(1),
  price: z.number().min(1),
});

export const ProductSchema = z.object({
  code: z.string().min(2),
  description: z.string().min(2).max(255),
  mark: z.string().max(100),
  model: z.string().max(100),
  referenc: z.string().max(100),
  discount: z.number().min(0),
  status: z.boolean(),
  origin: z.string().max(100),
  buy_tax: z.number().min(0),
  sale_tax: z.number().min(0),
  products_units: z.array(ProductUnitSchema).min(1),
});

export type ProductInputType = z.infer<typeof ProductSchema>;
