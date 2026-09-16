export type FlavorId = "alle" | "ice" | "frugt" | "soda" | "sød";

export type Product = {
  slug: string;
  name: string;
  flavor: Exclude<FlavorId, "alle">;
  flavorName: string;
  image: string;
  blurb: string;
  price: number;
  compareAt: number;
  puffs: number;
  inStock: boolean;
};

export const FLAVOR_LABELS: Record<FlavorId, string> = {
  alle: "Alle smage",
  ice: "Ice",
  frugt: "Frugt",
  soda: "Soda",
  sød: "Sød",
};

export const FLAVOR_ORDER: FlavorId[] = ["alle", "ice", "frugt", "soda", "sød"];

export const PRODUCTS: Product[] = [
  {
    slug: "rockme-50k-lemon-mint",
    name: "Sheesha RockMe 50K — Lemon Mint",
    flavor: "ice",
    flavorName: "Lemon Mint",
    image: "/products/lemon-mint.jpg",
    blurb: "Citron og kold mynte. Skarp, grøn og ren — den skarpeste i serien.",
    price: 229,
    compareAt: 249,
    puffs: 50000,
    inStock: true,
  },
  {
    slug: "rockme-50k-lush-ice",
    name: "Sheesha RockMe 50K — Lush Ice",
    flavor: "frugt",
    flavorName: "Lush Ice",
    image: "/products/lush-ice.jpg",
    blurb: "Vandmelon med is. Saftig rød midte og en kølig hale.",
    price: 229,
    compareAt: 249,
    puffs: 50000,
    inStock: true,
  },
  {
    slug: "rockme-50k-mango-ice",
    name: "Sheesha RockMe 50K — Mango Ice",
    flavor: "ice",
    flavorName: "Mango Ice",
    image: "/products/mango-ice.jpg",
    blurb: "Moden mango og is. Tropisk sødme med en kold finish.",
    price: 229,
    compareAt: 249,
    puffs: 50000,
    inStock: true,
  },
  {
    slug: "rockme-50k-peach-ice",
    name: "Sheesha RockMe 50K — Peach Ice",
    flavor: "ice",
    flavorName: "Peach Ice",
    image: "/products/peach-ice.jpg",
    blurb: "Hvid fersken og et koldt slør. Blød, næsten cremet.",
    price: 229,
    compareAt: 249,
    puffs: 50000,
    inStock: true,
  },
  {
    slug: "rockme-50k-blue-razz-ice",
    name: "Sheesha RockMe 50K — Blue Razz Ice",
    flavor: "frugt",
    flavorName: "Blue Razz Ice",
    image: "/products/blue-razz-ice.jpg",
    blurb: "Blå hindbær og is. Sød bær først, koldt slør til sidst.",
    price: 229,
    compareAt: 249,
    puffs: 50000,
    inStock: true,
  },
  {
    slug: "rockme-50k-melon-ice",
    name: "Sheesha RockMe 50K — Melon Ice",
    flavor: "frugt",
    flavorName: "Melon Ice",
    image: "/products/melon-ice.jpg",
    blurb: "Honningmelon og is. Let, grøn og kold — ikke den samme som Lush.",
    price: 229,
    compareAt: 249,
    puffs: 50000,
    inStock: true,
  },
  {
    slug: "rockme-50k-cola-ice",
    name: "Sheesha RockMe 50K — Cola Ice",
    flavor: "soda",
    flavorName: "Cola Ice",
    image: "/products/cola-ice.jpg",
    blurb: "Mørk cola med is. Brus i starten, kold afslutning.",
    price: 229,
    compareAt: 249,
    puffs: 50000,
    inStock: true,
  },
  {
    slug: "rockme-50k-love-66",
    name: "Sheesha RockMe 50K — Love 66",
    flavor: "sød",
    flavorName: "Love 66",
    image: "/products/love-66.jpg",
    blurb: "Klassisk Love 66: vandmelon, rose og fersken. Sød, blomstret og fyldig.",
    price: 229,
    compareAt: 249,
    puffs: 50000,
    inStock: true,
  },
];

export const SHOP_EMAIL = "pustmore@gmail.com";
export const SHOP_PHONE = "+45 71 87 79 42";

export type ShippingId = "pakkeshop" | "hjem";

export type ShippingMethod = {
  id: ShippingId;
  name: string;
  description: string;
  price: number;
  eta: string;
  freeOver: number;
};

export const SHIPPING: ShippingMethod[] = [
  {
    id: "pakkeshop",
    name: "Pakkeshop",
    description: "GLS eller DAO. Afhentes i nærmeste pakkeshop.",
    price: 39,
    eta: "1–3 hverdage",
    freeOver: 399,
  },
  {
    id: "hjem",
    name: "Hjemmelevering",
    description: "PostNord eller GLS til døren.",
    price: 49,
    eta: "1–3 hverdage",
    freeOver: 0,
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function salePercent(product: Product) {
  if (product.compareAt <= product.price) return 0;
  return Math.round((1 - product.price / product.compareAt) * 100);
}

export function formatKr(amount: number) {
  return `${amount.toLocaleString("da-DK")}\u00a0kr.`;
}

export function shippingCost(id: ShippingId, subtotal: number) {
  const method = SHIPPING.find((m) => m.id === id);
  if (!method) return 0;
  if (method.freeOver > 0 && subtotal >= method.freeOver) return 0;
  return method.price;
}

export function filterCatalog(opts: {
  flavor?: string;
  query?: string;
  inStockOnly?: boolean;
}) {
  const flavor = opts.flavor && opts.flavor !== "alle" ? opts.flavor : undefined;
  const q = opts.query?.trim().toLowerCase() ?? "";
  return PRODUCTS.filter((p) => {
    if (flavor && p.flavor !== flavor) return false;
    if (opts.inStockOnly && !p.inStock) return false;
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.flavorName.toLowerCase().includes(q) ||
      p.blurb.toLowerCase().includes(q)
    );
  });
}
