"use server";

import { cartItemSchema, CartItemInput } from "@/schemas/cart-schema";
import { revalidatePath } from "next/cache";

export type ActionState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: CartItemInput;
};

export async function submitCartItem(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  // Simulate network delay for loading skeletons/Suspense
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const payload = {
    id: formData.get("id"),
    name: formData.get("name"),
    price: formData.get("price"),
  };

  const parsed = cartItemSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      message: "Invalid fields provided.",
    };
  }

  // At this point, payload is sanitized and validated.
  // In a real app, you would mutate backend state here.

  // Revalidate current path if necessary to reflect new server state
  revalidatePath("/");

  return {
    success: true,
    message: "Item successfully added to cart!",
    data: parsed.data,
  };
}
