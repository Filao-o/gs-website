import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité — GS Transport",
  robots: { index: false },
};

export default function Confidentialite() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20">
      <Link href="/" className="text-sm text-[#1FA3BA] hover:underline mb-8 inline-block">← Retour à l'accueil</Link>

      <h1 className="font-heading text-[#091424] text-3xl font-light mb-2">Politique de confidentialité</h1>
      <p className="text-sm text-[#091424]/40 mb-10">Mise à jour : 6 août 2026</p>

      <section className="prose prose-sm max-w-none text-[#091424]/70 space-y-8">

        <div>
          <h2 className="text-[#091424] font-semibold text-base mb-3">1. Responsable du traitement</h2>
          <p>
            Gambier Sébastien, auto-entrepreneur, SIREN 914 900 360.<br />
            37 A Rue de l'Église du Guillaume, 97423 Saint-Paul, La Réunion.<br />
            Contact : <a href="mailto:gstransport974@gmail.com" className="text-[#1FA3BA] hover:underline">gstransport974@gmail.com</a> · +262 693 51 22 82
          </p>
        </div>

        <div>
          <h2 className="text-[#091424] font-semibold text-base mb-3">2. Données collectées</h2>
          <p>Lors d'une demande de réservation, nous collectons :</p>
          <ul className="mt-2 space-y-1">
            <li>Prénom et nom</li>
            <li>Numéro de téléphone</li>
            <li>Adresse email (facultative)</li>
            <li>Adresses de départ et destination</li>
            <li>Date et heure du trajet</li>
          </ul>
          <p className="mt-3">
            Nous n'utilisons <strong>pas de cookies publicitaires</strong>. Google Maps est utilisé pour le calcul
            d'itinéraire (voir la politique de Google : policies.google.com/privacy).
          </p>
        </div>

        <div>
          <h2 className="text-[#091424] font-semibold text-base mb-3">3. Finalités du traitement</h2>
          <ul className="space-y-1">
            <li>Traitement et confirmation de votre demande de réservation</li>
            <li>Envoi d'un email de confirmation (si email fourni)</li>
            <li>Gestion du planning du chauffeur via Google Calendar</li>
            <li>Contact téléphonique pour confirmer la course</li>
          </ul>
        </div>

        <div>
          <h2 className="text-[#091424] font-semibold text-base mb-3">4. Base légale</h2>
          <p>
            Le traitement est fondé sur l'<strong>exécution d'un contrat</strong> (art. 6.1.b RGPD) —
            vos données sont nécessaires pour traiter votre demande de transport.
          </p>
        </div>

        <div>
          <h2 className="text-[#091424] font-semibold text-base mb-3">5. Destinataires</h2>
          <p>Vos données sont transmises à :</p>
          <ul className="mt-2 space-y-1">
            <li><strong>Resend</strong> (envoi d'emails) — resend.com</li>
            <li><strong>Google</strong> (Calendar, Maps) — google.com</li>
            <li><strong>Vercel</strong> (hébergement) — vercel.com</li>
          </ul>
          <p className="mt-3">Vos données ne sont ni vendues, ni cédées à des tiers à des fins commerciales.</p>
        </div>

        <div>
          <h2 className="text-[#091424] font-semibold text-base mb-3">6. Durée de conservation</h2>
          <p>
            Les données de réservation sont conservées dans Google Calendar pour permettre la gestion
            du planning du chauffeur. Elles peuvent être supprimées à tout moment sur simple demande.
          </p>
        </div>

        <div>
          <h2 className="text-[#091424] font-semibold text-base mb-3">7. Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul className="mt-2 space-y-1">
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement (« droit à l'oubli »)</li>
            <li>Droit d'opposition au traitement</li>
            <li>Droit à la portabilité</li>
          </ul>
          <p className="mt-3">
            Pour exercer ces droits : <a href="mailto:gstransport974@gmail.com" className="text-[#1FA3BA] hover:underline">gstransport974@gmail.com</a>
          </p>
          <p className="mt-2">
            Vous pouvez également introduire une réclamation auprès de la <strong>CNIL</strong> (cnil.fr).
          </p>
        </div>

      </section>
    </main>
  );
}
