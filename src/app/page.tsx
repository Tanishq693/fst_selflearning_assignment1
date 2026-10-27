import { AddToCartForm } from "@/components/add-to-cart-form";
import { CartDrawer } from "@/components/cart-drawer";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  return (
    <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8">
      <header className="flex items-center justify-between pb-8 border-b mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignment 1</h1>
          <p className="text-muted-foreground">Fullstack Development with Next.js</p>
        </div>
        <ThemeToggle />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Add Product</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Demonstrating Type-Safe Server Action Form Mutation with optimistic UI updates.
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
            <AddToCartForm />
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Shopping Cart</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Demonstrating Decoupled Client State Management with Zustand, avoiding hydration mismatch.
            </p>
          </div>
          <div className="h-[400px]">
            <CartDrawer />
          </div>
        </section>
      </div>
    </main>
  );
}
