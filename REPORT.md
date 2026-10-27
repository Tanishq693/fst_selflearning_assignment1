# Technical Report: Next.js Architecture & State Management

## 1. RSC vs. Client Component Render Trees & Hydration Optimization

### Server vs. Client Boundary
In the App Router, Next.js defaults to React Server Components (RSC). This allows us to keep heavy dependencies and data-fetching securely on the server. The boundary is explicitly defined using the `'use client'` directive.
- **Server Components:** `page.tsx` and `layout.tsx` handle layout orchestration and SEO out-of-the-box. They do not ship JavaScript to the client.
- **Client Components:** Components needing interactivity, state, or browser APIs (like `CartDrawer`, `AddToCartForm`, and `ThemeToggle`) are isolated to keep the client bundle small.

### Hydration Optimization
Hydration mismatch is a common issue when rendering UI that relies on browser APIs (e.g., `localStorage` for theme or cart data).
- **Theme Switching:** We use `next-themes` with `suppressHydrationWarning` on the `<html>` tag to prevent React from throwing errors during initial HTML rendering. The `ThemeToggle` component defers rendering its icon until the client has mounted (`useEffect`), rendering a disabled placeholder on the server to prevent CLS.
- **Zustand Persist:** We configured `skipHydration: true` in the Zustand persist middleware. Hydration is manually triggered in a decoupled `StoreHydration` client component. The `CartDrawer` shows a loading skeleton until hydration completes, preventing mismatch warnings.

## 2. Server State Handling vs. Zustand Client State Caching

### Zustand Client State Caching
Zustand is used for highly interactive, synchronous client state (e.g., shopping cart items, filter panels). 
- **Benefits:** It avoids React Context re-renders (no Provider wrapping required for the whole layout), updating only the components that select specific state slices.
- **Persistence:** Local Storage syncs the state, ensuring a persistent cart across reloads without requiring roundtrips to the database.

### Server State Handling (Server Actions)
For form mutations (e.g., validating a checkout, adding a secure item), we rely on Next.js Server Actions.
- **Benefits:** Server Actions enable type-safe, backend data mutations without needing to expose REST API endpoints.
- **Integration:** Using `react-hook-form`, we perform inline client-side validation with Zod. Once valid, we invoke the Server Action which uses the *same* shared Zod schema to sanitize the payload on the server.
- **Optimistic UI:** We combine Zustand with Server Actions to update the cart immediately upon form submission, providing instantaneous feedback while the Server Action resolves in the background.

## 3. Core Web Vitals Focus (LCP, CLS, INP)

- **LCP (Largest Contentful Paint):** Server components pre-render HTML. Since our forms and critical UI are lightweight and leverage Server Actions for submission, the time to paint the largest element is minimized.
- **CLS (Cumulative Layout Shift):** Loading skeletons (in `CartDrawer`) reserve the exact height of the UI elements before the client mounts, avoiding jarring layout shifts once hydration completes.
- **INP (Interaction to Next Paint):** By using optimistic UI updates via Zustand and decoupling state from high-level React Context providers, we ensure the UI responds instantaneously to user interactions (like adding to cart) without being blocked by React rendering cycles or network latency.
