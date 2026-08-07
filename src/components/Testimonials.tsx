"use client";

import { Quote } from "lucide-react";

const reviews = [
  {
    name: "Isabelle Provost",
    date: "Septembre 2025",
    text: "Sébastien est beaucoup plus qu'un chauffeur. Il ne prend pas en charge que la course, il prend en charge la sécurité de chacun, le bien-être de chaque passager.",
  },
  {
    name: "Céline Martigny",
    date: "Septembre 2025",
    text: "Sébastien, très agréable et ouvert à la conversation. Il sait vous mettre à l'aise dès la 1ère minute ! Ce qui fait que le voyage se fait avec le sourire.",
  },
  {
    name: "malika hoarau",
    date: "Octobre 2024",
    text: "Sébastien est quelqu'un de très agréable, gentil et discret, il est ouvert à la discussion — les trajets passent en un clin d'œil, on ne voit pas le temps passer.",
  },
  {
    name: "Iain Stark",
    date: "Avril 2025",
    text: "J'ai fait un aller retour de l'aéroport à Saint-Pierre avec Sébastien. Je ne peux que le recommander pour son professionnalisme et sa grande gentillesse. Sonia",
  },
  {
    name: "Karl COUVIGNOU",
    date: "Mai 2024",
    text: "Contact découvert par hasard mais je recommande fortement pour vos déplacements sur l'île de La Réunion. Sébastien est très professionnel et très serviable.",
  },
  {
    name: "Ornella A.V",
    date: "Mars 2025",
    text: "Un service de grande qualité ! Sébastien est un chauffeur de confiance, offrant un excellent accueil et un service irréprochable.",
  },
  {
    name: "malik ibrahim",
    date: "Février 2024",
    text: "Sebastien a vraiment été génial pour le transfert de l'aéroport à mon domicile ! Son véhicule était super confortable et franchement on se sentait super bien.",
  },
  {
    name: "Tahina Najaraly",
    date: "Décembre 2023",
    text: "GS Transport a sauvé notre escapade en amoureux à la dernière minute ! Grand professionnel et très sympathique, on s'est tout de suite senti entre de bonnes mains.",
  },
  {
    name: "marie christine saen",
    date: "Mars 2025",
    text: "C'était une première expérience avec Sebastien, mais nous renouvellerons car c'est un chauffeur hors-pair, discret, super gentil conduisant avec beaucoup de douceur et de maîtrise.",
  },
  {
    name: "GREG M",
    date: "Décembre 2023",
    text: "Tout simplement parfait. Sébastien est un excellent chauffeur, ponctuel et d'une très grande gentillesse. Merci à toi. Bonne continuation.",
  },
  {
    name: "ella fatol",
    date: "Mars 2023",
    text: "Sébastien est ponctuel et sérieux. Nous l'avons contacté à l'occasion d'un anniversaire, aller/retour entre l'hôtel et le restaurant sans problème. Je recommande pour vos événements.",
  },
  {
    name: "Jean Yves RENĖ",
    date: "Octobre 2024",
    text: "Bravo et merci encore à Sébastien pour la qualité de son service ! Chauffeur au petit soin de ses clients et à l'heure — ce qui est TRES IMPORTANT lorsqu'on exerce cette activité !",
  },
  {
    name: "Ambre Lightwood",
    date: "Décembre 2023",
    text: "Merci à Sébastien pour sa ponctualité et sa gentillesse. J'ai fait un transfert L'Hermitage – aéroport Roland Garros à un tarif plus que correct.",
  },
  {
    name: "Candace Nagle",
    date: "Janvier 2023",
    text: "Quelle belle journée avec Sébastien pour aller voir le Piton de la Fournaise ! Le trajet y était d'une beauté époustouflante. Une journée parfaite.",
  },
  {
    name: "Herm Malala",
    date: "Octobre 2024",
    text: "Excellent service. Relationnel de qualité. M. Sébastien a été très pro et consciencieux. Merci.",
  },
  {
    name: "Edith Nativel",
    date: "Septembre 2023",
    text: "Nous avons fait appel à GS Transport pour un départ de la rivière Saint-Louis à Saint-Denis. Très satisfaites du service : ponctualité, professionnalisme, gentillesse.",
  },
  {
    name: "Helene Diaz",
    date: "Janvier 2024",
    text: "Nous avons eu une très bonne expérience. Sébastien est ponctuel et très accueillant. Merci !",
  },
  {
    name: "Julien DELAVEGAS",
    date: "Mai 2024",
    text: "J'ai fait appel à ses services plusieurs fois : chauffeur ponctuel, bonne conduite et voiture très propre ! Je recommande sans hésitation.",
  },
  {
    name: "Cloé Lafosse",
    date: "Juillet 2023",
    text: "Un taximan qui a fait de notre trajet un moment agréable. La qualité du service nous a conquis — c'était notre première fois mais pas la dernière ! Merci Sébastien.",
  },
  {
    name: "Hawell Guerengomba",
    date: "Novembre 2023",
    text: "Très belle expérience avec Sébastien, une belle personne, il a été d'une grande aide durant le séjour. Je recommande fortement sans hésitation !",
  },
  {
    name: "Willy Suter",
    date: "Novembre 2023",
    text: "Nous avons passé une excellente journée à La Réunion. L'excursion au Cirque de Salazie était magnifique. Nous recommandons cette excursion vivement.",
  },
  {
    name: "Chantal COLIN",
    date: "Octobre 2023",
    text: "Appel pris en compte rapidement et le délai annoncé a été respecté. Bonne ambiance dans la voiture et discussion intéressante.",
  },
  {
    name: "Patricia Bodo-Schwartz",
    date: "Avril 2025",
    text: "Sebastien offre un service très professionnel, très sympathique, que je ne peux que recommander.",
  },
  {
    name: "alexandre souchon",
    date: "Juillet 2024",
    text: "Notre chauffeur était à l'heure, agréable et discret. Tous nos remerciements.",
  },
  {
    name: "Joshua De Freitas",
    date: "Octobre 2023",
    text: "Service au top ! Ponctuel, conduite agréable et conducteur sympathique qui plus est. Rien à changer !",
  },
  {
    name: "Anissa nour",
    date: "Mai 2025",
    text: "Super expérience. Disponible, à l'écoute. Je recommande fortement.",
  },
  {
    name: "sophie couval",
    date: "Janvier 2024",
    text: "Sébastien est bienveillant et ponctuel. Je vous le recommande vivement.",
  },
  {
    name: "Florence Escuret",
    date: "Septembre 2023",
    text: "Ponctuel, fiable, gentil. Très bonne conduite. Je recommande à 100%.",
  },
  {
    name: "Denis Fabre",
    date: "Novembre 2023",
    text: "Super chauffeur, très ponctuel et sympathique. Je recommande grandement !",
  },
  {
    name: "Josiane Levasseur",
    date: "Janvier 2024",
    text: "Chauffeur très sympa et patient dans les embouteillages. Je le recommande.",
  },
  {
    name: "Damien Montalbano",
    date: "Décembre 2024",
    text: "Compagnie très sérieuse. Je recommande vivement.",
  },
  {
    name: "Iris CASERUS",
    date: "Octobre 2024",
    text: "Très bon trajet. Chauffeur très sympathique. Merci.",
  },
  {
    name: "Emmanuelle L.",
    date: "Janvier 2023",
    text: "Sébastien est très ponctuel et sympathique.",
  },
  {
    name: "jean-marc pascal",
    date: "Septembre 2023",
    text: "Sébastien est très à l'écoute et très disponible. Nous sommes ravis de sa prestation.",
  },
  {
    name: "Mathilde Frémont",
    date: "Septembre 2023",
    text: "Super chauffeur, ponctuel avec une conduite douce ! Merci Seb !",
  },
  {
    name: "Big Gamers",
    date: "Mars 2026",
    text: "Bonne expérience, je recommande.",
  },
  {
    name: "Marie Annick MRADAMY",
    date: "Octobre 2023",
    text: "Très agréable, très bon accueil. On va faire appel à votre service de transport. Je vous conseille GS Transport, c'est sérieux.",
  },
];

const DOUBLED = [...reviews, ...reviews];

function ReviewCard({ r }: { r: typeof reviews[0] }) {
  return (
    <div className="shrink-0 w-[240px] lg:w-[380px] bg-white rounded-2xl p-5 lg:p-7 shadow-md border border-[#091424]/8 flex flex-col gap-3 lg:gap-4">
      <Quote size={18} className="text-[#091424]/15 lg:w-6 lg:h-6" />
      <p className="text-[#091424]/70 leading-relaxed text-xs lg:text-sm flex-1 line-clamp-4 lg:line-clamp-none">{r.text}</p>
      <div className="flex items-center justify-between pt-2 border-t border-[#091424]/8">
        <div>
          <p className="font-medium text-[#091424] text-xs lg:text-sm">{r.name}</p>
          <p className="text-[#091424]/40 text-[10px] lg:text-xs">{r.date}</p>
        </div>
        <span className="text-[10px] lg:text-xs text-[#1FA3BA] font-medium tracking-wide uppercase">Vérifié</span>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="avis" className="py-16 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10 lg:mb-16">
          <h2 className="font-heading text-[#091424] text-4xl md:text-5xl font-light">
            Ils nous font confiance
          </h2>
          <p className="text-[#091424]/40 text-sm font-medium mt-4">+200 clients · 80% reviennent</p>
        </div>

      </div>

      {/* Ticker — full width, hors du container */}
      <div className="relative">
        {/* Fade left */}
        <div className="absolute left-0 top-0 bottom-0 w-24 lg:w-40 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #ffffff, transparent)" }} />
        {/* Fade right */}
        <div className="absolute right-0 top-0 bottom-0 w-24 lg:w-40 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #ffffff, transparent)" }} />

        <div className="flex gap-5 ticker-track">
          {DOUBLED.map((r, i) => (
            <ReviewCard key={i} r={r} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <a
          href="/#reservation"
          className="inline-block bg-[#091424] text-white font-medium px-8 py-4 rounded-full text-sm hover:bg-[#091424]/85 transition-all"
        >
          Rejoindre nos clients satisfaits
        </a>
      </div>
    </section>
  );
}
