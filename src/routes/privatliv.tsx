import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privatliv")({
  component: PrivatlivPage,
  head: () => ({
    meta: [{ title: "Privatlivspolitik | Pust" }],
  }),
});

function PrivatlivPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">GDPR</p>
      <h1 className="font-display mt-2 text-4xl tracking-wide uppercase">Privatlivspolitik</h1>
      <div className="mt-6 flex flex-col gap-6 text-sm leading-relaxed text-muted-foreground">
        <p>Pust behandler personoplysninger for at levere shoppen og gennemføre ordrer.</p>
        <section>
          <h2 className="font-medium text-foreground">Dataansvarlig</h2>
          <p className="mt-2">Pust</p>
        </section>
        <section>
          <h2 className="font-medium text-foreground">Hvilke oplysninger</h2>
          <p className="mt-2">
            Når du handler, behandler vi navn, e-mail, telefon, leveringsadresse, ordrelinjer,
            beløb og betalingsstatus. Kortoplysninger behandles af Stripe — vi gemmer ikke
            kortnumre.
          </p>
        </section>
        <section>
          <h2 className="font-medium text-foreground">Formål og hjemmel</h2>
          <p className="mt-2">
            Oplysningerne bruges til at gennemføre køb, levere varer, yde kundeservice og
            overholde bogføringsregler. Hjemlen er aftale (GDPR art. 6, stk. 1, litra b), retlig
            forpligtelse (litra c) og i begrænset omfang legitim interesse i at drive butikken
            (litra f).
          </p>
        </section>
        <section>
          <h2 className="font-medium text-foreground">Modtagere</h2>
          <p className="mt-2">
            Vi deler oplysninger med Stripe (betaling), fragtfirma (GLS, DAO eller PostNord) og
            nødvendige leverandører til hosting. De behandler kun data efter vores instruks, hvor de
            er databehandlere.
          </p>
        </section>
        <section>
          <h2 className="font-medium text-foreground">Opbevaring</h2>
          <p className="mt-2">
            Ordrer opbevares så længe bogføringsloven kræver det, typisk fem år.
          </p>
        </section>
        <section>
          <h2 className="font-medium text-foreground">Dine rettigheder</h2>
          <p className="mt-2">
            Du kan anmode om indsigt, berigtigelse, sletning, begrænsning og dataportabilitet.
            Kontakt os via{" "}
            <Link to="/kontakt" className="text-foreground underline">
              kontaktsiden
            </Link>
            . Du kan klage til Datatilsynet.
          </p>
        </section>
        <p>
          Læs{" "}
          <Link to="/cookies" className="text-foreground underline">
            cookiepolitikken
          </Link>{" "}
          for, hvilke cookies shoppen bruger.
        </p>
      </div>
    </article>
  );
}
