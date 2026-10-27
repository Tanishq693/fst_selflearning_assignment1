"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cartItemSchema, CartItemInput } from "@/schemas/cart-schema";
import { submitCartItem } from "@/actions/cart-actions";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddToCartForm() {
  const addItem = useCartStore((state) => state.addItem);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CartItemInput>({
    resolver: zodResolver(cartItemSchema),
    defaultValues: {
      id: "prod_" + Math.floor(Math.random() * 10000),
      name: "",
      price: 0,
    },
  });

  const onSubmit = (data: CartItemInput) => {
    // Optimistic Update
    addItem(data);
    
    // Simulate optimistic toast
    console.log("Optimistic update: Added to cart locally, syncing with server...");

    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", data.id);
      formData.append("name", data.name);
      formData.append("price", data.price.toString());

      const result = await submitCartItem(null, formData);

      if (result.success && result.data) {
        alert("Success: " + result.message);
        form.reset({
          id: "prod_" + Math.floor(Math.random() * 10000),
          name: "",
          price: 0,
        });
      } else {
        alert("Error: " + (result.message || "Failed to add item."));
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
      <div className="space-y-2">
        <Label htmlFor="id">Product ID</Label>
        <Input id="id" {...form.register("id")} readOnly className="bg-muted" />
        {form.formState.errors.id && (
          <p className="text-sm text-destructive">{form.formState.errors.id.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input id="name" {...form.register("name")} placeholder="Wireless Headphones" />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Price ($)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          {...form.register("price")}
          placeholder="99.99"
        />
        {form.formState.errors.price && (
          <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Adding..." : "Add to Cart"}
      </Button>
    </form>
  );
}
