import { useEffect, useState, type FormEvent, type InputHTMLAttributes } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShippingRadio, StripeOnlyNote } from "@/components/shop-shell";
import { formatKr, getProduct, type ShippingId } from "@/lib/catalog";
import { cartSubtotal, useShop } from "@/lib/cart-store";
import { startCheckout } from "@/lib/checkout-fn";
import { PENDING_ORDER_KEY, pricedOrder, type SavedOrder } from "@/lib/checkout";

type Search = { annulleret?: true };

export const Route = createFileRoute("/kasse/")({
  validateSearch: (s: Record<string, unknown>): Search =>
    s.annulleret === "1" || s.annulleret === true ? { annulleret: true } : {},
  component: KassePage,
  head: () => ({
    meta: [
      { title: "Kasse | Pust" },
      {
        name: "description",
        content: "Gennemfør dit køb af Sheesha RockMe 50K hos Pust. Betal med Stripe.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function KassePage() {
  const { annulleret } = Route.useSearch();
  const navigate = useNavigate();
  const cart = useShop((s) => s.cart);
  const setCartOpen = useShop((s) => s.setCartOpen);
  const [shippingId, setShippingId] = useState<ShippingId>("pakkeshop");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(
    annulleret ? "Betalingen blev annulleret. Du kan prøve igen." : null,
  );
  const subtotal = cartSubtotal(cart);
  const priced = cart.length
    ? (() => {
        try {
          return pricedOrder(cart, shippingId);
        } catch {
          return null;
        }
      })()
    : null;
  const freight = priced?.freight ?? 0;
  const total = priced?.total ?? freight;
  const empty = cart.length === 0;

  useEffect(() => {
    setCartOpen(false);
  }, [setCartOpen]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (empty) {
      setError("Kurven er tom.");
      return;
    }
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    setBusy(true);
    try {
      const customer = {
        name: String(data.get("name") ?? "").trim(),
        email: String(data.get("email") ?? "").trim(),
        phone: String(data.get("phone") ?? "").trim(),
        address: String(data.get("addr") ?? "").trim(),
        postalCode: String(data.get("zip") ?? "").trim(),
        city: String(data.get("city") ?? "").trim(),
        unit: String(data.get("unit") ?? "").trim(),
        note: String(data.get("note") ?? "").trim(),
      };
      const pricedNow = pricedOrder(cart, shippingId);
      const order: SavedOrder = {
        id: `P${Date.now().toString(36).toUpperCase()}`,
        name: customer.name,
        email: customer.email,
        total: pricedNow.total,
        shippingId,
        items: pricedNow.lines.map((l) => ({
          slug: l.slug,
          qty: l.qty,
          name: getProduct(l.slug)?.flavorName ?? l.name,
        })),
      };
      sessionStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(order));
      const result = await startCheckout({
        data: {
          origin: window.location.origin,
          shippingId,
          items: cart.map((l) => ({ slug: l.slug, qty: l.qty })),
          customer,
        },
      });
      if (result.url) {
        window.location.assign(result.url);
        return;
      }
      await navigate({ to: "/kasse/betaling" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke starte betalingen");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-10 md:grid-cols-2 md:px-6">
      <div>
        <h1 className="font-display text-3xl tracking-wide uppercase">Kasse</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Udfyld levering, og betal med Stripe.
        </p>
        <form id="kasse-form" className="mt-8 grid gap-4" onSubmit={onSubmit}>
          <Field id="name" label="Navn" autoComplete="name" required />
          <Field id="email" label="E-mail" type="email" autoComplete="email" required />
          <Field id="phone" label="Telefon" type="tel" autoComplete="tel" required />
          <Field
            id="addr"
            label="Adresse"
            autoComplete="street-address"
            required
            placeholder="Gade og nummer"
          />
          <div className="grid grid-cols-2 gap-3">
            <Field
              id="zip"
              label="Postnummer"
              autoComplete="postal-code"
              required
              inputMode="numeric"
              maxLength={4}
              placeholder="8000"
            />
            <Field
              id="city"
              label="By"
              autoComplete="address-level2"
              required
              placeholder="Aarhus C"
            />
          </div>
          <Field
            id="unit"
            label="Etage / dør (valgfri)"
            autoComplete="address-line2"
            placeholder="2. th"
          />
          <div className="grid gap-1.5">
            <Label htmlFor="note">Besked (valgfri)</Label>
            <textarea
              id="note"
              name="note"
              rows={3}
              placeholder="Fx tidspunkt eller dørkode"
              className="flex min-h-24 w-full rounded-md bg-card px-3 py-2 text-sm text-foreground shadow-[var(--shadow-border)] transition-[box-shadow] duration-(--motion-quick) outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
            />
          </div>
          <ShippingRadio value={shippingId} onChange={setShippingId} subtotal={subtotal} />

          <StripeOnlyNote />

          <Button type="submit" size="lg" className="w-full" disabled={empty || busy}>
            {busy ? "Åbner Stripe…" : `Betal ${formatKr(total)} med Stripe`}
          </Button>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </form>
      </div>

      <aside className="h-fit rounded-2xl bg-card p-5 shadow-[var(--shadow-border)]">
        <h2 className="text-sm font-medium">Din pose</h2>
        {empty ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Kurven er tom.{" "}
            <Link to="/" search={{ smag: "alle" }} hash="katalog" className="underline">
              Gå til kataloget
            </Link>
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {cart.map((line) => {
              const product = getProduct(line.slug);
              if (!product) return null;
              return (
                <li key={line.slug} className="flex justify-between gap-3 text-sm">
                  <span>
                    {product.flavorName} × {line.qty}
                  </span>
                  <span className="tabular">{formatKr(product.price * line.qty)}</span>
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-6 flex justify-between border-t border-border pt-4 text-sm">
          <span>Varer</span>
          <span className="tabular">{formatKr(subtotal)}</span>
        </p>
        <p className="mt-2 flex justify-between text-sm">
          <span>Fragt</span>
          <span className="tabular">{freight === 0 ? "Gratis" : formatKr(freight)}</span>
        </p>
        <p className="mt-3 flex justify-between border-t border-border pt-3 text-sm font-medium">
          <span>I alt</span>
          <span className="tabular">{formatKr(total)}</span>
        </p>
      </aside>
    </div>
  );
}

function Field({
  id,
  label,
  ...props
}: {
  id: string;
  label: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} {...props} />
    </div>
  );
}
