import Image from "next/image";

const services = [
  {
    num: "01",
    title: "Transfert Aéroport",
    desc: "Prise en charge à Roland Garros ou à votre adresse. Suivi de vol en temps réel — aucune attente, même en cas de retard.",
  },
  {
    num: "02",
    title: "Navette Hôtel",
    desc: "Arrivée ou départ d'hôtel, résidence ou location. Un accueil soigné, vos bagages pris en charge, zéro stress.",
  },
  {
    num: "03",
    title: "Soirées & Événements",
    desc: "Mariage, dîner gastronomique, soirée privée, gala. Rentrez sereinement, Sébastien vous attend.",
  },
  {
    num: "04",
    title: "Déplacements Pro",
    desc: "Réunions, séminaires, rendez-vous clients. Ponctualité garantie, véhicule premium, discrétion totale.",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Layout principal : titre gauche + étapes droite */}
        <div className="flex flex-col lg:flex-row lg:gap-0">

          {/* Colonne titre — gauche */}
          <div className="lg:w-[28%] lg:pr-12 mb-12 lg:mb-0 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#1FA3BA] mb-4">Nos services</p>
              <h2 className="font-heading text-[#091424] text-4xl lg:text-5xl font-light leading-tight mb-6">
                Un chauffeur privé pour chaque besoin
              </h2>
              <p className="text-[#091424]/50 text-sm leading-relaxed">
                Que ce soit à 6h du matin pour un vol ou à minuit après une soirée,
                Sébastien est là. Simple, fiable, premium.
              </p>
            </div>
            <p className="hidden lg:block text-xs text-[#091424]/30 mt-10">
              Disponible 24h/24 · Sainte-Marie → Saint-Leu
            </p>
          </div>

          {/* Divider vertical gauche/droite */}
          <div className="hidden lg:block w-px bg-[#091424]/10 mx-0 self-stretch" />

          {/* Colonnes étapes — droite */}
          <div className="lg:flex-1 grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#091424]/10">
            {services.map((s) => (
              <div key={s.num} className="px-6 lg:px-8 py-2 lg:py-0 first:pl-0 lg:first:pl-8">
                {/* Numéro + ligne verticale */}
                <p className="font-heading text-[#1FA3BA] text-3xl lg:text-4xl font-light mb-3">{s.num}</p>
                <div className="w-px h-6 bg-[#1FA3BA]/40 mb-4" />
                <h3 className="font-heading text-[#091424] text-base lg:text-lg font-medium mb-3 leading-snug">
                  {s.title}
                </h3>
                <p className="text-[#091424]/50 text-xs lg:text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Image */}
        <div className="mt-12 lg:mt-16 rounded-2xl overflow-hidden aspect-[16/6] relative">
          <Image
            src="/Services/Grande Ravine Bridge.jpg"
            alt="Viaduc de la Grande Ravine — Route des Tamarins, La Réunion"
            fill
            className="object-cover"
          />
        </div>

      </div>
    </section>
  );
}
