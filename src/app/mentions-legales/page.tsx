import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales — GS Transport",
  robots: { index: false },
};

export default function MentionsLegales() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20">
      <Link href="/" className="text-sm text-[#1FA3BA] hover:underline mb-8 inline-block">← Retour à l'accueil</Link>

      <h1 className="font-heading text-[#091424] text-3xl font-light mb-10">Mentions légales</h1>

      <section className="prose prose-sm max-w-none text-[#091424]/70 space-y-8">

        <div>
          <h2 className="text-[#091424] font-semibold text-base mb-3">1. Éditeur du site</h2>
          <p>Le site <strong>gstransport.re</strong> est édité par :</p>
          <ul className="mt-2 space-y-1">
            <li><strong>Nom :</strong> Gambier Sébastien</li>
            <li><strong>Forme juridique :</strong> Auto-entrepreneur</li>
            <li><strong>SIREN :</strong> 914 900 360</li>
            <li><strong>Adresse :</strong> 37 A Rue de l'Église du Guillaume, 97423 Saint-Paul, La Réunion</li>
            <li><strong>Téléphone :</strong> +262 693 51 22 82</li>
            <li><strong>Email :</strong> gstransport974@gmail.com</li>
          </ul>
        </div>

        <div>
          <h2 className="text-[#091424] font-semibold text-base mb-3">2. Activité réglementée</h2>
          <p>
            GS Transport exerce une activité de Voiture de Tourisme avec Chauffeur (VTC)
            soumise à réglementation. L'autorisation d'exercer est directement liée au SIREN 914 900 360.
          </p>
        </div>

        <div>
          <h2 className="text-[#091424] font-semibold text-base mb-3">3. Hébergement</h2>
          <ul className="space-y-1">
            <li><strong>Hébergeur :</strong> Vercel Inc.</li>
            <li><strong>Adresse :</strong> 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</li>
            <li><strong>Site :</strong> vercel.com</li>
          </ul>
        </div>

        <div>
          <h2 className="text-[#091424] font-semibold text-base mb-3">4. Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu de ce site (textes, images, logo) est la propriété exclusive de GS Transport.
            Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.
          </p>
        </div>

        <div>
          <h2 className="text-[#091424] font-semibold text-base mb-3">5. Responsabilité</h2>
          <p>
            Les tarifs affichés sur ce site sont des estimations indicatives et non contractuelles.
            GS Transport ne saurait être tenu responsable d'une différence entre l'estimation en ligne
            et le tarif final, qui peut varier selon les conditions réelles du trajet.
          </p>
        </div>

        <div>
          <h2 className="text-[#091424] font-semibold text-base mb-3">6. Données personnelles</h2>
          <p>
            Le traitement de vos données personnelles est décrit dans notre{" "}
            <Link href="/confidentialite" className="text-[#1FA3BA] hover:underline">Politique de confidentialité</Link>.
          </p>
        </div>

      </section>
    </main>
  );
}
