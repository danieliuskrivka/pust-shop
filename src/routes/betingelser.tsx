import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/betingelser")({
  component: BetingelserPage,
  head: () => ({
    meta: [{ title: "Handelsbetingelser | Pust" }],
  }),
});

function BetingelserPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Salg</p>
      <h1 className="font-display mt-2 text-4xl tracking-wide uppercase">Handelsbetingelser</h1>
      <div className="mt-6 flex flex-col gap-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          Disse betingelser gælder for køb på pustmore.com. Sælger er Pust.
        </p>
        <section>
          <h2 className="font-medium text-foreground">Priser og betaling</h2>
          <p className="mt-2">
            Priser er i danske kroner og inkluderer moms. Du betaler kun med Stripe (kort, Apple Pay
            og Google Pay), før varen sendes.
          </p>
        </section>
        <section>
          <h2 className="font-medium text-foreground">Levering</h2>
          <p className="mt-2">
            Vi sender i Danmark. Pakkeshop koster 39 kr og er gratis fra 399 kr. Hjemmelevering
            koster 49 kr. Leveringstiden er typisk 1–3 hverdage efter betaling, medmindre varen er
            udsolgt.
          </p>
        </section>
        <section>
          <h2 className="font-medium text-foreground">Fortrydelse og retur</h2>
          <p className="mt-2">
            Du har som udgangspunkt 14 dages fortrydelsesret. Forseglede varer, der af sundheds-
            eller hygiejnehensyn ikke kan returneres, når forseglingen er brudt, er undtaget.
            Uåbnede varer i original emballage kan returneres efter aftale. Kontakt os via{" "}
            <Link to="/kontakt" className="text-foreground underline">
              kontaktsiden
            </Link>{" "}
            inden for 14 dage.
          </p>
        </section>
        <section>
          <h2 className="font-medium text-foreground">Reklamation</h2>
          <p className="mt-2">
            Købelovens regler om mangler gælder. Kontakt os via kontaktsiden, hvis varen er
            defekt. Du kan klage til Forbrugerklagenævnet via Nævnenes Hus, www.naevneneshus.dk.
          </p>
        </section>
      </div>
    </article>
  );
}
