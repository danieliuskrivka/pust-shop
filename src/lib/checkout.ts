import {
  getProduct,
  shippingCost,
  type ShippingId,
} from "./catalog";

export type CheckoutItem = { slug: string; qty: number };

export type CheckoutCustomer = {
  name: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  unit: string;
  note: string;
};

export type SavedOrder = {
  id: string;
  name: string;
  email: string;
  total: number;
  shippingId: ShippingId;
  items: { slug: string; qty: number; name: string }[];
};

export const PENDING_ORDER_KEY = "pust-pending-order";
export const LAST_ORDER_KEY = "pust-last-order";

export function pricedOrder(
  items: CheckoutItem[],
  shippingId: ShippingId,
): {
  lines: { slug: string; qty: number; name: string; unitAmount: number }[];
  subtotal: number;
  freight: number;
  total: number;
} {
  const lines: { slug: string; qty: number; name: string; unitAmount: number }[] = [];
  for (const item of items) {
    const qty = Math.min(20, Math.max(0, Math.floor(item.qty)));
    if (qty <= 0) continue;
    const product = getProduct(item.slug);
    if (!product?.inStock) {
      throw new Error(`${item.slug} er ikke på lager`);
    }
    lines.push({
      slug: product.slug,
      qty,
      name: product.name,
      unitAmount: product.price,
    });
  }
  if (lines.length === 0) throw new Error("Kurven er tom.");
  const subtotal = lines.reduce((n, l) => n + l.unitAmount * l.qty, 0);
  const freight = shippingCost(shippingId, subtotal);
  return { lines, subtotal, freight, total: subtotal + freight };
}
