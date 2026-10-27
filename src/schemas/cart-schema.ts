import { z } from 'zod';

export const cartItemSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters").max(100),
  price: z.coerce.number().positive("Price must be a positive number"),
  id: z.string().min(1, "Product ID is required"),
});

export type CartItemInput = z.infer<typeof cartItemSchema>;
