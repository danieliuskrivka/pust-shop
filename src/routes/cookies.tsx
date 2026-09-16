import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/cookies")({
  component: CookiesPage,
  head: () => ({
    meta: [{ title: "Cookiepolitik | Pust" }],
  }),
});

function CookiesPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
        Cookiebekendtgørelsen
      </p>
      <h1 className="font-display mt-2 text-4xl tracking-wide uppercase">Cookiepolitik</h1>
      <div className="mt-6 flex flex-col gap-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          Pust bruger kun cookies og lignende teknikker, der er nødvendige for at shoppen virker.
          Vi sætter ikke statistik-, marketing- eller tracking-cookies.
        </p>
        <section>
          <h2 className="font-medium text-foreground">Nødvendige</h2>
          <p className="mt-2">
            Nødvendige cookies kræver ikke samtykke efter cookiebekendtgørelsen, fordi de er
            nødvendige for den tjeneste, du selv beder om.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <span className="text-foreground">pust-shop-v1</span> — kurv i din browser. Uden den
              kan du ikke handle.
            </li>
            <li>
              <span className="text-foreground">pust-consent-v1</span> — husker, at du har set
              cookieinformationen.
            </li>
          </ul>
        </section>
        <section>
          <h2 className="font-medium text-foreground">Betaling</h2>
          <p className="mt-2">
            Betaling sker med Stripe. Når du betaler, sendes du til Stripe Checkout, som sætter
            egne cookies. Vi sætter ikke betalings-cookies på shoppen.
          </p>
        </section>
        <section>
          <h2 className="font-medium text-foreground">Ingen tracking</h2>
          <p className="mt-2">
            Vi bruger ikke Google Analytics, Meta Pixel, reklamenetværk eller andre
            tredjeparts-scripts til at følge dig rundt på nettet.
          </p>
        </section>
        <p>
          Spørgsmål om cookies stilles via{" "}
          <Link to="/kontakt" className="text-foreground underline">
            kontaktsiden
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
