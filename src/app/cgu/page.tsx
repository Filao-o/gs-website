import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation — GS Transport",
  robots: { index: false },
};

export default function CGU() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20">
      <Link href="/" className="text-sm text-[#1FA3BA] hover:underline mb-8 inline-block">← Retour à l'accueil</Link>

      <h1 className="font-heading text-[#091424] text-3xl font-light mb-2">Conditions générales d'utilisation</h1>
      <p className="text-sm text-[#091424]/40 mb-10">Mise à jour : 6 août 2026</p>

      <section className="prose prose-sm max-w-none text-[#091424]/70 space-y-8">

        <div>
          <h2 className="text-[#091424] font-semibold text-base mb-3">1. Objet</h2>
          <p>
            Les présentes CGU régissent l'utilisation du site <strong>gstransport.re</strong> et du formulaire
            de demande de réservation en ligne. Toute utilisation du site implique l'acceptation pleine et entière des présentes conditions.
          </p>
        </div>

        <div>
          <h2 className="text-[#091424] font-semibold text-base mb-3">2. Services proposés</h2>
          <p>
            GS Transport propose un service de transport privé avec chauffeur (VTC) sur l'île de La Réunion.
            Le site permet d'obtenir une estimation tarifaire et d'envoyer une demande de réservation.
            La réservation n'est effective qu'après confirmation téléphonique du chauffeur.
          </p>
        </div>

        <div>
          <h2 className="text-[#091424] font-semibold text-base mb-3">3. Estimation tarifaire</h2>
          <p>
            Les tarifs affichés par le simulateur en ligne sont <strong>indicatifs</strong> et non contractuels.
            Ils sont calculés à partir de la distance et de la durée estimées par Google Maps, auxquelles s'appliquent
            les majorations en vigueur (nuit, dimanche). Le tarif définitif est communiqué par le chauffeur lors
            de la confirmation.
          </p>
        </div>

        <div>
          <h2 className="text-[#091424] font-semibold text-base mb-3">4. Demande de réservation</h2>
          <p>
            Le formulaire de réservation constitue une demande, non un contrat. GS Transport se réserve le droit
            de refuser ou de modifier une demande en cas d'indisponibilité ou de zone non couverte.
            Le client sera contacté par téléphone pour confirmation.
          </p>
        </div>

        <div>
          <h2 className="text-[#091424] font-semibold text-base mb-3">5. Paiement</h2>
          <p>
            Le paiement s'effectue <strong>directement auprès du chauffeur à bord</strong>, à l'issue de la course.
          </p>
        </div>

        <div>
          <h2 className="text-[#091424] font-semibold text-base mb-3">6. Annulation</h2>
          <p>
            Toute annulation doit être signalée au chauffeur directement par téléphone au{" "}
            <a href="tel:+262693512282" className="text-[#1FA3BA] hover:underline">+262 693 51 22 82</a>.
          </p>
        </div>

        <div>
          <h2 className="text-[#091424] font-semibold text-base mb-3">7. Responsabilité</h2>
          <p>
            GS Transport est assuré pour le transport de personnes à titre onéreux conformément à la réglementation VTC en vigueur.
          </p>
        </div>

        <div>
          <h2 className="text-[#091424] font-semibold text-base mb-3">8. Droit applicable</h2>
          <p>
            Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux compétents
            sont ceux de Saint-Denis de La Réunion.
          </p>
        </div>

      </section>
    </main>
  );
}
