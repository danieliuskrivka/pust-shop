import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { formatKr } from "@/lib/catalog";
import { getStripeCheckout } from "@/lib/checkout-fn";
import { LAST_ORDER_KEY, PENDING_ORDER_KEY, type SavedOrder } from "@/lib/checkout";
import { useShop } from "@/lib/cart-store";

type Search = { order?: string; session_id?: string };

export const Route = createFileRoute("/kasse/ok")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    order: typeof s.order === "string" ? s.order : undefined,
    session_id: typeof s.session_id === "string" ? s.session_id : undefined,
  }),
  component: OrderOk,
  head: () => ({
    meta: [
      { title: "Ordre bekræftet | Pust" },
      {
        name: "description",
        content:
          "Tak for din ordre hos Pust. Du modtager en bekræftelse, når betalingen er gennemført.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function OrderOk() {
  const { order: orderId, session_id: sessionId } = Route.useSearch();
  const clear = useShop((s) => s.clear);
  const [order, setOrder] = useState<SavedOrder | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const raw =
          sessionStorage.getItem(LAST_ORDER_KEY) ??
          sessionStorage.getItem(PENDING_ORDER_KEY);
        const parsed = raw ? (JSON.parse(raw) as SavedOrder) : null;
        if (sessionId) {
          const status = await getStripeCheckout({ data: { sessionId } });
          if (!status.paid) {
            if (!cancelled) setFailed(true);
            return;
          }
          clear();
          sessionStorage.removeItem(PENDING_ORDER_KEY);
          if (parsed) {
            sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(parsed));
          }
          if (!cancelled) {
            setOrder(
              parsed ?? {
                id: status.id,
                name: "",
                email: status.email,
                total: status.total,
                shippingId: "pakkeshop",
                items: [],
              },
            );
          }
          return;
        }
        if (parsed && (!orderId || parsed.id === orderId)) {
          if (!cancelled) setOrder(parsed);
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [orderId, sessionId, clear]);

  if (failed) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <h1 className="font-display text-4xl tracking-wide uppercase">Betaling ikke gennemført</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Vi kunne ikke bekræfte betalingen. Prøv igen fra kassen.
        </p>
        <Button className="mt-8" asChild>
          <Link to="/kasse">Tilbage til kassen</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Kasse</p>
      <h1 className="font-display mt-2 text-4xl tracking-wide uppercase">Tak for ordren</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Betalingen er registreret via Stripe. Du får en bekræftelse på e-mail.
      </p>
      {order ? (
        <div className="mt-8 rounded-2xl bg-card p-5 text-sm shadow-[var(--shadow-border)]">
          <p className="font-medium">Ordre {order.id}</p>
          {order.items.length > 0 ? (
            <ul className="mt-4 flex flex-col gap-2 text-muted-foreground">
              {order.items.map((item) => (
                <li key={item.slug} className="flex justify-between">
                  <span>
                    {item.name} × {item.qty}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
          <p className="mt-4 flex justify-between border-t border-border pt-3 font-medium text-foreground">
            <span>I alt</span>
            <span className="tabular">{formatKr(order.total)}</span>
          </p>
        </div>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">
          Vi har taget imod din betaling. Tjek din e-mail for kvittering.
        </p>
      )}
      <Button className="mt-8" asChild>
        <Link to="/" hash="katalog">
          Tilbage til kataloget
        </Link>
      </Button>
    </div>
  );
}
