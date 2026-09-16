import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cartCount, useShop } from "@/lib/cart-store";
import { formatKr, getProduct, SHIPPING, shippingCost, SHOP_EMAIL, type ShippingId } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function ShopShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const cartOpen = useShop((s) => s.cartOpen);
  const setCartOpen = useShop((s) => s.setCartOpen);
  const query = useShop((s) => s.query);
  const setQuery = useShop((s) => s.setQuery);
  const cart = useShop((s) => s.cart);
  const cookieSeen = useShop((s) => s.cookieSeen);
  const dismissCookie = useShop((s) => s.dismissCookie);
  const navigate = useNavigate();
  const count = cartCount(cart);

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Åbn menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="size-4" />
          </Button>
          <Link
            to="/"
            aria-label="Pust — forsiden"
            className="flex shrink-0 items-center gap-2"
          >
            <img
              src="/apple-touch-icon.png"
              alt=""
              width={36}
              height={36}
              className="size-9 rounded-md"
            />
            <span className="font-display text-2xl font-medium tracking-[0.14em] uppercase">
              Pust
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              to="/"
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors duration-(--motion-quick)"
            >
              Shop
            </Link>
          </nav>
          <div className="ml-auto min-w-0 max-w-xs flex-1">
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                void navigate({ to: "/", search: { smag: "alle" }, hash: "katalog" });
              }}
              placeholder="Søg smag…"
              aria-label="Søg"
              className="bg-secondary"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Kurv"
            className="relative"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag className="size-4" />
            {count > 0 ? (
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {count}
              </span>
            ) : null}
          </Button>
          <Link
            to="/kontakt"
            aria-label="Konto"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-card shadow-[var(--shadow-border)] hover:bg-accent"
          >
            <User className="size-4" />
          </Link>
        </div>
      </header>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" title="Pust">
          <nav className="flex flex-col gap-1">
            <Link
              to="/"
              hash="katalog"
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-3 py-3 text-sm font-medium hover:bg-accent"
            >
              Katalog
            </Link>
            <Link
              to="/kasse"
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-3 py-3 text-sm font-medium hover:bg-accent"
            >
              Kasse
            </Link>
            <Link
              to="/kontakt"
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-3 py-3 text-sm font-medium hover:bg-accent"
            >
              Kontakt
            </Link>
          </nav>
        </SheetContent>
      </Sheet>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/80 px-4 py-10 md:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
          <div>
            <p className="flex items-center gap-2 font-display text-lg tracking-[0.14em] text-foreground uppercase">
              <img
                src="/apple-touch-icon.png"
                alt=""
                width={28}
                height={28}
                className="size-7 rounded-md"
              />
              Pust
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Sheesha RockMe 50K.
            </p>
          </div>
          <div>
            <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Shop</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              <li>
                <Link to="/" hash="katalog" className="hover:underline">
                  Katalog
                </Link>
              </li>
              <li>
                <Link to="/kasse" className="hover:underline">
                  Kasse
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Juridisk</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              <li>
                <Link to="/betingelser" className="hover:underline">
                  Handelsbetingelser
                </Link>
              </li>
              <li>
                <Link to="/privatliv" className="hover:underline">
                  Privatlivspolitik
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:underline">
                  Cookies
                </Link>
              </li>
              <li>
                <button type="button" className="text-left hover:underline" onClick={() => useShop.setState({ cookieSeen: false })}>
                  Cookieindstillinger
                </button>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Kontakt</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <Link to="/kontakt" className="text-foreground hover:underline">
                  Skriv til butikken
                </Link>
              </li>
              <li>
                <a className="text-foreground hover:underline" href={`mailto:${SHOP_EMAIL}`}>
                  {SHOP_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-6xl text-xs text-muted-foreground">
          © 2026 Pust. 18+. Produkterne indeholder nikotin, som er vanedannende.
        </p>
      </footer>

      {!cookieSeen ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-4 py-3 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Vi bruger kun nødvendige cookies, så kurven virker.{" "}
              <Link to="/cookies" className="text-foreground underline">
                Læs cookiepolitikken
              </Link>
              .
            </p>
            <Button type="button" size="sm" onClick={dismissCookie}>
              Forstået
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CartSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const cart = useShop((s) => s.cart);
  const setQty = useShop((s) => s.setQty);
  const remove = useShop((s) => s.remove);
  const subtotal = cart.reduce((n, l) => {
    const p = getProduct(l.slug);
    return n + (p ? p.price * l.qty : 0);
  }, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" title="Din pose">
        {cart.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Kurven er tom.{" "}
            <Link
              to="/"
              hash="katalog"
              className="underline"
              onClick={() => onOpenChange(false)}
            >
              Gå til kataloget
            </Link>
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {cart.map((line) => {
              const product = getProduct(line.slug);
              if (!product) return null;
              return (
                <li key={line.slug} className="flex gap-3">
                  <img
                    src={product.image}
                    alt=""
                    className="size-16 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{product.flavorName}</p>
                    <p className="tabular text-xs text-muted-foreground">
                      {formatKr(product.price)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        className="flex size-8 items-center justify-center rounded-md bg-secondary"
                        onClick={() => setQty(line.slug, line.qty - 1)}
                        aria-label="Færre"
                      >
                        −
                      </button>
                      <span className="tabular w-6 text-center text-sm">{line.qty}</span>
                      <button
                        type="button"
                        className="flex size-8 items-center justify-center rounded-md bg-secondary"
                        onClick={() => setQty(line.slug, line.qty + 1)}
                        aria-label="Flere"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="ml-auto text-xs text-muted-foreground underline"
                        onClick={() => remove(line.slug)}
                      >
                        Fjern
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {cart.length > 0 ? (
          <div className="mt-6 border-t border-border pt-4">
            <p className="flex justify-between text-sm">
              <span>Varer</span>
              <span className="tabular">{formatKr(subtotal)}</span>
            </p>
            <Button className="mt-4 w-full" size="lg" asChild>
              <Link to="/kasse" onClick={() => onOpenChange(false)}>
                Gå til kassen
              </Link>
            </Button>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

export function ShippingRadio({
  value,
  onChange,
  subtotal,
}: {
  value: ShippingId;
  onChange: (id: ShippingId) => void;
  subtotal: number;
}) {
  return (
    <fieldset className="grid gap-2">
      <legend className="text-sm font-medium">Fragt</legend>
      {SHIPPING.map((method) => {
        const cost = shippingCost(method.id, subtotal);
        return (
          <label
            key={method.id}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-xl bg-card px-4 py-3 text-sm shadow-[var(--shadow-border)]",
            )}
          >
            <input
              type="radio"
              name="shipping"
              className="mt-1"
              checked={value === method.id}
              onChange={() => onChange(method.id)}
            />
            <span className="min-w-0 flex-1">
              <span className="flex justify-between gap-3 font-medium">
                {method.name}
                <span className="tabular">{cost === 0 ? "Gratis" : formatKr(cost)}</span>
              </span>
              <span className="mt-1 block text-muted-foreground">
                {method.description} {method.eta}.
                {method.freeOver > 0 ? ` Gratis fra ${formatKr(method.freeOver)}` : ""}
              </span>
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}

const STRIPE_METHODS = ["Visa", "Mastercard", "Apple Pay", "Google Pay"] as const;

export function StripeOnlyNote() {
  return (
    <div className="rounded-xl bg-card px-4 py-3 text-sm shadow-[var(--shadow-border)]">
      <p className="font-medium">Betaling</p>
      <p className="mt-1 text-muted-foreground">Kun Stripe.</p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {STRIPE_METHODS.map((method) => (
          <li
            key={method}
            className="rounded-md bg-secondary px-2 py-1 text-[11px] tracking-wide text-muted-foreground uppercase"
          >
            {method}
          </li>
        ))}
      </ul>
    </div>
  );
}
