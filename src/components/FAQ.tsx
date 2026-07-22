"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Comment réserver une course ?",
    a: "Utilisez le formulaire de réservation en ligne sur cette page — il prend moins de 2 minutes. Vous pouvez aussi contacter directement le chauffeur par téléphone au 0693 51 22 82.",
  },
  {
    q: "Puis-je réserver la veille ou le jour même ?",
    a: "Oui, les réservations de dernière minute sont acceptées selon les disponibilités. Pour garantir votre créneau, nous recommandons de réserver au moins quelques heures à l'avance.",
  },
  {
    q: "Le service est-il disponible la nuit et le week-end ?",
    a: "GS Transport est disponible 24h/24, 7j/7, y compris les jours fériés. Des suppléments s'appliquent pour les trajets de nuit (22h–5h) et le dimanche.",
  },
  {
    q: "Comment s'effectue le paiement ?",
    a: "Le paiement s'effectue à bord à l'issue de la course, en espèces ou par carte bancaire. Aucun prépaiement en ligne n'est requis.",
  },
  {
    q: "Combien de bagages puis-je emporter ?",
    a: "Le SUV premium peut accueillir jusqu'à 4 passagers avec leurs bagages standards. Le van 8 places offre davantage de capacité pour les groupes ou les bagages volumineux.",
  },
  {
    q: "Proposez-vous des transferts aéroport ?",
    a: "Oui, les transferts vers et depuis l'aéroport Roland Garros font partie de nos prestations les plus demandées. Le chauffeur vous accueille à l'arrivée avec un panneau nominatif.",
  },
  {
    q: "Mon trajet est en dehors de la zone habituelle — acceptez-vous quand même ?",
    a: "Chaque demande est étudiée individuellement. N'hésitez pas à nous contacter via le formulaire \"Trajet personnalisé\" ou par téléphone pour que nous puissions vous proposer un tarif adapté.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="mb-14">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#1FA3BA] mb-3">Questions fréquentes</p>
          <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-[#091424] leading-tight">
            Tout ce que vous<br />devez savoir
          </h2>
        </div>

        <div className="flex flex-col divide-y divide-[#091424]/8">
          {faqs.map((faq, i) => (
            <div key={i} className="py-5">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 text-left group"
              >
                <span className="text-[#091424] font-medium text-base group-hover:text-[#1FA3BA] transition-colors">
                  {faq.q}
                </span>
                <span className="shrink-0 w-7 h-7 rounded-full border border-[#091424]/12 flex items-center justify-center text-[#091424]/50 group-hover:border-[#1FA3BA]/30 group-hover:text-[#1FA3BA] transition-colors">
                  {open === i ? <Minus size={14} /> : <Plus size={14} />}
                </span>
              </button>
              {open === i && (
                <p className="mt-4 text-[#091424]/60 text-sm leading-relaxed pr-10">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-[#091424] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-medium text-sm">Vous ne trouvez pas votre réponse ?</p>
            <p className="text-white/50 text-xs mt-0.5">Contactez directement le chauffeur.</p>
          </div>
          <a
            href="tel:+262693512282"
            className="shrink-0 flex items-center gap-2 bg-[#1FA3BA] text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#1FA3BA]/90 transition-colors"
          >
            0693 51 22 82
          </a>
        </div>
      </div>
    </section>
  );
}
