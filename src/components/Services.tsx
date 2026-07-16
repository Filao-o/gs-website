import { Plane, Briefcase, Wine, Hotel, CheckCircle } from "lucide-react";

const services = [
  {
    icon: Plane,
    title: "Transfert Aéroport",
    desc: "Prise en charge à Roland Garros ou à votre adresse. Suivi de vol en temps réel — aucune attente, même en cas de retard.",
  },
  {
    icon: Hotel,
    title: "Navette Hôtel",
    desc: "Arrivée ou départ d'hôtel, résidence ou location. Un accueil soigné, vos bagages pris en charge, zéro stress.",
  },
  {
    icon: Wine,
    title: "Soirées & Événements",
    desc: "Mariage, dîner gastronomique, soirée privée, gala. Rentrez sereinement, Sébastien vous attend.",
  },
  {
    icon: Briefcase,
    title: "Déplacements Pro",
    desc: "Réunions, séminaires, rendez-vous clients. Ponctualité garantie, véhicule premium, discrétion totale.",
  },
];

const advantages = [
  "SUV neuve, climatisée, impeccable",
  "Disponible 24h/24, 7j/7",
  "Tarif au km, sans surprise",
  "Réservation en ligne instantanée",
  "Confirmation SMS & email",
  "Zone : Sainte-Marie → Saint-Leu",
];

export default function Services() {
  return (
    <section id="services" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="text-center mb-10 lg:mb-16">
          <h2 className="font-heading text-[#091424] text-4xl md:text-5xl font-light">
            Un VTC pour chaque besoin
          </h2>
          <p className="text-[#091424]/60 mt-4 max-w-xl mx-auto">
            Que ce soit à 6h du matin pour un vol ou à minuit après une soirée,
            Sébastien est là. Simple, fiable, premium.
          </p>
        </div>

        {/* Cards — fond navy permanent, aucun hover */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 lg:mb-20">
          {services.map((s) => (
            <div
              key={s.title}
              className="bg-[#091424] rounded-2xl p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
                <s.icon size={22} className="text-white" />
              </div>
              <h3 className="font-heading text-white text-xl font-medium mb-3">
                {s.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Value proposition */}
        <div className="bg-[#091424] rounded-3xl p-7 sm:p-10 lg:p-14 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div>
            <h3 className="font-heading text-white text-3xl md:text-4xl font-light leading-tight">
              Pas un taxi.<br />
              <span className="italic text-[#1FA3BA]">Votre chauffeur.</span>
            </h3>
            <p className="text-white/50 mt-4 leading-relaxed">
              Sébastien n'est pas un chauffeur parmi d'autres. C'est votre
              interlocuteur direct, disponible à toute heure, qui connaît votre
              nom et anticipe vos besoins avant même que vous les exprimiez.
            </p>
          </div>

          {/* Avantages — icônes alignées sur même colonne, bloc poussé à droite */}
          <div className="lg:flex lg:justify-end">
            <div className="flex flex-col gap-3">
              {advantages.map((a) => (
                <div key={a} className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-[#1FA3BA] shrink-0" />
                  <span className="text-white/70 text-sm lg:text-base">{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
