import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import {
  filterCatalog,
  FLAVOR_LABELS,
  FLAVOR_ORDER,
  formatKr,
  PRODUCTS,
  type FlavorId,
} from "@/lib/catalog";
import { useShop } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

type Search = { smag?: string };

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    smag: typeof s.smag === "string" ? s.smag : undefined,
  }),
  component: Home,
  head: () => ({
    meta: [
      { title: "Pust | Sheesha RockMe 50K — 50.000 bars i Danmark" },
      {
        name: "description",
        content:
          "Køb Sheesha RockMe 50K hos Pust. 50.000 bars, hele serien med hookah-mundstykke og display. Hurtig levering i Danmark. Fra 229 kr.",
      },
    ],
  }),
});

function Home() {
  const { smag } = Route.useSearch();
  const query = useShop((s) => s.query);
  const [inStockOnly, setInStockOnly] = useState(false);
  const flavor = (FLAVOR_ORDER.includes(smag as FlavorId) ? smag : "alle") as FlavorId;
  const list = useMemo(
    () => filterCatalog({ flavor, query, inStockOnly }),
    [flavor, query, inStockOnly],
  );
  const prices = PRODUCTS.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const priceLine = min === max ? `${formatKr(min)} stykket` : `fra ${formatKr(min)}`;

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/80">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:px-6 md:py-16">
          <div className="rise-in">
            <p className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
              Sheesha · RockMe
            </p>
            <h1 className="font-display mt-3 text-5xl font-medium tracking-wide uppercase sm:text-6xl">
              50.000 bars.
              <br />
              Hele serien.
            </h1>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              {PRODUCTS.length} RockMe 50K-smage med hookah-mundstykke og display. {priceLine}, på
              lager nu.
            </p>
          </div>
          <img
            src="/products/hero.jpg"
            alt="Sheesha RockMe 50K"
            className="aspect-3/4 w-full rounded-2xl object-cover shadow-[var(--shadow-border)] rise-in"
          />
        </div>
      </section>

      <section id="katalog" className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        <div className="flex flex-col gap-1">
          <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Katalog</p>
          <h2 className="font-display text-3xl font-medium tracking-wide uppercase">RockMe 50K</h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Viser {list.length} af {list.length} produkter
            {list.length === 0 ? "" : " · side 1 af 1"}.
          </p>
        </div>
        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {FLAVOR_ORDER.map((id) => (
            <Button
              key={id}
              type="button"
              variant={flavor === id ? "default" : "ghost"}
              className={cn("h-10", flavor === id ? "" : "text-muted-foreground")}
              asChild
            >
              <Link to="/" search={{ smag: id }} hash="katalog">
                {FLAVOR_LABELS[id]}
              </Link>
            </Button>
          ))}
          <Button
            type="button"
            size="sm"
            variant={inStockOnly ? "default" : "ghost"}
            className="ml-auto h-10"
            onClick={() => setInStockOnly((v) => !v)}
          >
            Kun på lager
          </Button>
        </div>
        {list.length === 0 ? (
          <p className="py-16 text-sm text-muted-foreground">
            Ingen produkter matcher. Prøv en anden smag.
          </p>
        ) : (
          <div className="stagger-in mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {list.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
