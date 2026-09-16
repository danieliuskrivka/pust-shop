import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProduct } from "./catalog";

export type CartLine = { slug: string; qty: number };

type ShopState = {
  cart: CartLine[];
  query: string;
  cartOpen: boolean;
  cookieSeen: boolean;
  setQuery: (query: string) => void;
  setCartOpen: (open: boolean) => void;
  dismissCookie: () => void;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

export const useShop = create<ShopState>()(
  persist(
    (set, get) => ({
      cart: [],
      query: "",
      cartOpen: false,
      cookieSeen: false,
      setQuery: (query) => set({ query }),
      setCartOpen: (cartOpen) => set({ cartOpen }),
      dismissCookie: () => set({ cookieSeen: true }),
      add: (slug, qty = 1) => {
        const product = getProduct(slug);
        if (!product?.inStock) return;
        const cart = [...get().cart];
        const i = cart.findIndex((l) => l.slug === slug);
        if (i >= 0) cart[i] = { slug, qty: cart[i].qty + qty };
        else cart.push({ slug, qty });
        set({ cart, cartOpen: true });
      },
      setQty: (slug, qty) => {
        if (qty <= 0) {
          set({ cart: get().cart.filter((l) => l.slug !== slug) });
          return;
        }
        set({
          cart: get().cart.map((l) => (l.slug === slug ? { ...l, qty } : l)),
        });
      },
      remove: (slug) => set({ cart: get().cart.filter((l) => l.slug !== slug) }),
      clear: () => set({ cart: [] }),
    }),
    {
      name: "pust-shop-v1",
      partialize: (s) => ({
        cart: s.cart,
        cookieSeen: s.cookieSeen,
      }),
    },
  ),
);

export function cartCount(cart: CartLine[]) {
  return cart.reduce((n, l) => n + l.qty, 0);
}

export function cartSubtotal(cart: CartLine[]) {
  return cart.reduce((n, l) => {
    const p = getProduct(l.slug);
    return n + (p ? p.price * l.qty : 0);
  }, 0);
}
