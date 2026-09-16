import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { formatKr, getProduct, PRODUCTS, salePercent } from "@/lib/catalog";
import { useShop } from "@/lib/cart-store";

export const Route = createFileRoute("/p/$slug")({
  component: ProductPage,
  head: ({ params }) => {
    const product = getProduct(params.slug);
    return {
      meta: [
        { title: product ? `${product.flavorName} | Sheesha RockMe 50K — Pust` : "Pust" },
        { name: "description", content: product?.blurb ?? "" },
      ],
    };
  },
});

function ProductPage() {
  const { slug } = Route.useParams();
  const product = getProduct(slug);
  const add = useShop((s) => s.add);
  if (!product) throw notFound();
  const sale = salePercent(product);
  const idx = PRODUCTS.findIndex((p) => p.slug === product.slug);
  const others = [...PRODUCTS.slice(idx + 1), ...PRODUCTS.slice(0, Math.max(idx, 0))].slice(
    0,
    4,
  );

  return (
    <>
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 md:grid-cols-2 md:px-6 md:py-12">
        <div className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-border)]">
          <img
            src={product.image}
            alt={product.name}
            className="aspect-3/4 w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">RockMe 50K</p>
            <h1 className="font-display mt-2 text-4xl font-medium tracking-wide uppercase">
              {product.flavorName}
            </h1>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">{product.blurb}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            {product.puffs.toLocaleString("da-DK")} bars · hookah-mundstykke · display
          </p>
          <p className="flex items-baseline gap-3">
            <span className="font-display tabular text-4xl">{formatKr(product.price)}</span>
            {product.compareAt > product.price ? (
              <span className="tabular text-muted-foreground line-through">
                {formatKr(product.compareAt)}
              </span>
            ) : null}
            {sale > 0 ? <span className="text-sm">-{sale}%</span> : null}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              size="lg"
              className="sm:flex-1"
              onClick={() => add(product.slug)}
            >
              Læg i kurv
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/" hash="katalog">
                Tilbage til kataloget
              </Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Kun Stripe. Kort, Apple Pay og Google Pay.</p>
        </div>
      </div>
      <section className="mx-auto w-full max-w-6xl px-4 pb-12 md:px-6">
        <h2 className="font-display text-2xl tracking-wide uppercase">Også i serien</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {others.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
