import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const itemSchema = z.object({
  slug: z.string().min(1),
  qty: z.number().int().min(1).max(20),
});

const customerSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.email(),
  phone: z.string().min(6).max(30),
  address: z.string().min(1).max(200),
  postalCode: z.string().min(4).max(8),
  city: z.string().min(1).max(80),
  unit: z.string().max(40),
  note: z.string().max(500),
});

const startSchema = z.object({
  origin: z.string().min(1).max(300),
  shippingId: z.enum(["pakkeshop", "hjem"]),
  items: z.array(itemSchema).min(1).max(20),
  customer: customerSchema,
});

export const startCheckout = createServerFn({ method: "POST" })
  .validator(startSchema)
  .handler(async ({ data }) => {
    const { createCheckoutSession } = await import("./stripe.server.ts");
    return createCheckoutSession(data);
  });

export const getStripeCheckout = createServerFn({ method: "GET" })
  .validator(z.object({ sessionId: z.string().min(1).max(200) }))
  .handler(async ({ data }) => {
    const { readCheckoutSession } = await import("./stripe.server.ts");
    return readCheckoutSession(data.sessionId);
  });

