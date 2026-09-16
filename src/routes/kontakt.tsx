import { createFileRoute } from "@tanstack/react-router";
import { SHOP_EMAIL, SHOP_PHONE } from "@/lib/catalog";

export const Route = createFileRoute("/kontakt")({
  component: KontaktPage,
  head: () => ({
    meta: [{ title: "Kontakt | Pust — Sheesha RockMe 50K" }],
  }),
});

function KontaktPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Butikken</p>
      <h1 className="font-display mt-2 text-4xl tracking-wide uppercase">Kontakt</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Pust er en dansk webshop. Skriv til{" "}
        <a className="text-foreground underline" href={`mailto:${SHOP_EMAIL}`}>
          {SHOP_EMAIL}
        </a>{" "}
        eller ring på{" "}
        <a className="text-foreground underline" href={`tel:${SHOP_PHONE.replace(/\s/g, "")}`}>
          {SHOP_PHONE}
        </a>
        , hvis du har spørgsmål til en ordre, levering eller en vare.
      </p>
      <div className="mt-8 rounded-2xl bg-card p-5 shadow-[var(--shadow-border)]">
        <p className="text-sm font-medium">E-mail</p>
        <a className="mt-1 block text-sm underline" href={`mailto:${SHOP_EMAIL}`}>
          {SHOP_EMAIL}
        </a>
        <p className="mt-4 text-sm font-medium">Telefon</p>
        <a className="mt-1 block text-sm underline" href={`tel:${SHOP_PHONE.replace(/\s/g, "")}`}>
          {SHOP_PHONE}
        </a>
        <p className="mt-4 text-sm font-medium">Ordrer</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Hav ordrenummeret klar, hvis du skriver om en levering.
        </p>
      </div>
    </article>
  );
}
