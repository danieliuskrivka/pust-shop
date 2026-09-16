import { Link } from "@tanstack/react-router";
import { salePercent, type Product, formatKr } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  const sale = salePercent(product);
  return (
    <article className="group flex flex-col">
      <div className="relative overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)] transition-shadow duration-(--motion-fast) ease-(--ease-out) group-hover:shadow-[var(--shadow-border-hover)]">
        <Link
          to="/p/$slug"
          params={{ slug: product.slug }}
          className="block aspect-3/4"
        >
          <img
            src={product.image}
            alt={product.name}
            className="size-full object-cover transition-transform duration-(--motion-fast) ease-(--ease-out) group-hover:scale-[1.04]"
          />
        </Link>
        {sale > 0 ? (
          <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-xs font-medium tracking-wide text-primary-foreground">
            -{sale}%
          </span>
        ) : null}
        <Link
          to="/p/$slug"
          params={{ slug: product.slug }}
          className="absolute right-3 bottom-3 inline-flex h-8 items-center rounded-sm bg-secondary px-3 text-xs font-medium text-secondary-foreground opacity-100 hover:bg-accent sm:opacity-0 sm:transition-opacity sm:duration-(--motion-fast) sm:ease-(--ease-out) sm:group-hover:opacity-100"
        >
          Se smag
        </Link>
      </div>
      <div className="flex flex-1 flex-col gap-1 px-1 pt-3">
        <Link
          to="/p/$slug"
          params={{ slug: product.slug }}
          className="text-sm leading-snug font-medium hover:underline"
        >
          {product.name}
        </Link>
        <p className="text-xs text-muted-foreground">
          {product.puffs.toLocaleString("da-DK")} bars
        </p>
        <p className="tabular mt-auto flex items-baseline gap-2 pt-1 text-sm">
          <span className="font-medium">{formatKr(product.price)}</span>
          {product.compareAt > product.price ? (
            <span className="text-muted-foreground line-through">
              {formatKr(product.compareAt)}
            </span>
          ) : null}
        </p>
      </div>
    </article>
  );
}
