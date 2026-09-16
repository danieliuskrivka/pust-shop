import Stripe from "stripe";
import { getRequestHeader } from "@tanstack/react-start/server";
import { env } from "@/lib/env.server";
import {
  pricedOrder,
  type CheckoutCustomer,
  type CheckoutItem,
} from "@/lib/checkout";
import { type ShippingId } from "@/lib/catalog";

function stripeClient() {
  const key = env("STRIPE_SECRET_KEY");
  if (!key) return null;
  return new Stripe(key);
}

function requestOrigin(fallback: string) {
  try {
    const given = new URL(fallback);
    if (given.protocol === "http:" || given.protocol === "https:") return given.origin;
  } catch {
    /* ignore */
  }
  const host =
    getRequestHeader("x-forwarded-host") ?? getRequestHeader("host") ?? "";
  const proto = getRequestHeader("x-forwarded-proto") ?? "https";
  if (!host) return fallback;
  return `${proto}://${host}`;
}

export function stripeConfigured() {
  return Boolean(env("STRIPE_SECRET_KEY"));
}

export async function createCheckoutSession(input: {
  origin: string;
  shippingId: ShippingId;
  items: CheckoutItem[];
  customer: CheckoutCustomer;
}) {
  const priced = pricedOrder(input.items, input.shippingId);
  const stripe = stripeClient();
  if (!stripe) {
    return { demo: true as const, url: null as string | null };
  }

  const origin = requestOrigin(input.origin);
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = priced.lines.map(
    (line) => ({
      quantity: line.qty,
      price_data: {
        currency: "dkk",
        unit_amount: line.unitAmount * 100,
        product_data: { name: line.name },
      },
    }),
  );
  if (priced.freight > 0) {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "dkk",
        unit_amount: priced.freight * 100,
        product_data: { name: "Fragt" },
      },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    locale: "da",
    payment_method_types: ["card"],
    customer_email: input.customer.email,
    success_url: `${origin}/kasse/ok?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/kasse?annulleret=1`,
    line_items,
    metadata: {
      name: input.customer.name,
      phone: input.customer.phone,
      address: input.customer.address,
      postalCode: input.customer.postalCode,
      city: input.customer.city,
      unit: input.customer.unit,
      note: input.customer.note.slice(0, 400),
      shippingId: input.shippingId,
    },
  });

  if (!session.url) throw new Error("Stripe returnerede ingen betalingsadresse");
  return { demo: false as const, url: session.url };
}

export async function readCheckoutSession(sessionId: string) {
  const stripe = stripeClient();
  if (!stripe) return { paid: false, id: sessionId, total: 0, email: "" };
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return {
    paid: session.payment_status === "paid",
    id: session.id,
    total: Math.round((session.amount_total ?? 0) / 100),
    email: session.customer_email ?? session.customer_details?.email ?? "",
  };
}