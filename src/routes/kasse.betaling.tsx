import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatKr } from "@/lib/catalog";
import { LAST_ORDER_KEY, PENDING_ORDER_KEY, type SavedOrder } from "@/lib/checkout";
import { useShop } from "@/lib/cart-store";

export const Route = createFileRoute("/kasse/betaling")({
  component: StripePayPage,
  head: () => ({
    meta: [
      { title: "Betaling | Pust" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function StripePayPage() {
  const navigate = useNavigate();
  const clear = useShop((s) => s.clear);
  const [order, setOrder] = useState<SavedOrder | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [holder, setHolder] = useState("");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(PENDING_ORDER_KEY);
      if (!raw) {
        void navigate({ to: "/kasse" });
        return;
      }
      const parsed = JSON.parse(raw) as SavedOrder;
      setOrder(parsed);
      setHolder(parsed.name);
    } catch {
      void navigate({ to: "/kasse" });
    }
  }, [navigate]);

  function pay() {
    if (!order) return;
    const digits = number.replace(/\s/g, "");
    if (digits === "4000000000000002") {
      setError("Kortet blev afvist. Prøv et andet kort.");
      return;
    }
    if (digits !== "4242424242424242" || digits.length !== 16) {
      setError("Brug testkortet 4242 4242 4242 4242.");
      return;
    }
    if (!/^(0[1-9]|1[0-2])\s\/\s\d{2}$/.test(expiry)) {
      setError("Ugyldig udløbsdato.");
      return;
    }
    if (cvc.length < 3) {
      setError("Ugyldig CVC.");
      return;
    }
    if (!holder.trim()) {
      setError("Skriv navn på kortet.");
      return;
    }
    setBusy(true);
    sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
    sessionStorage.removeItem(PENDING_ORDER_KEY);
    clear();
    void navigate({ to: "/kasse/ok", search: { order: order.id } });
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    pay();
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-sm text-muted-foreground">
        Åbner betaling…
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-10 md:grid-cols-2 md:px-6">
      <aside className="h-fit rounded-2xl bg-card p-5 shadow-[var(--shadow-border)]">
        <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Pust</p>
        <p className="mt-2 font-display text-3xl tracking-wide uppercase">
          {formatKr(order.total)}
        </p>
        <ul className="mt-6 flex flex-col gap-3 text-sm">
          {order.items.map((item) => (
            <li key={item.slug} className="flex justify-between gap-3">
              <span>
                {item.name} × {item.qty}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-6 flex justify-between border-t border-border pt-4 text-sm font-medium">
          <span>I alt</span>
          <span className="tabular">{formatKr(order.total)}</span>
        </p>
      </aside>

      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="size-3.5" />
          Sikker betaling med Stripe
        </div>
        <h1 className="font-display mt-2 text-3xl tracking-wide uppercase">Betaling</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Kun Stripe. Testkort: 4242 4242 4242 4242.
        </p>

        <form className="mt-8 grid gap-4" onSubmit={onSubmit}>
          <div className="grid gap-1.5">
            <Label htmlFor="card">Kortnummer</Label>
            <Input
              id="card"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="4242 4242 4242 4242"
              value={number}
              onChange={(e) => setNumber(formatCard(e.target.value))}
              maxLength={19}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="exp">Udløb</Label>
              <Input
                id="exp"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM / ÅÅ"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                maxLength={7}
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                maxLength={4}
                required
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="holder">Navn på kort</Label>
            <Input
              id="holder"
              autoComplete="cc-name"
              value={holder}
              onChange={(e) => setHolder(e.target.value)}
              required
            />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? "Behandler…" : `Betal ${formatKr(order.total)}`}
          </Button>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Link to="/kasse" className="text-center text-sm text-muted-foreground underline">
            Tilbage til kassen
          </Link>
        </form>
      </div>
    </div>
  );
}

function formatCard(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
}
