import Image from "next/image";

const details = [
  {
    title: "Ponctualité garantie",
    desc: "Toujours à l'heure, sans exception.",
    sub: "Suivi des vols en temps réel, anticipation du trafic — vous n'attendrez jamais.",
  },
  {
    title: "SUV premium",
    desc: "Confort et élégance à bord.",
    sub: "Véhicule neuf, climatisé, parfaitement entretenu. Vous voyagez, il s'occupe du reste.",
  },
  {
    title: "Disponible 24h/24",
    desc: "Vol à 5h du matin, soirée à minuit.",
    sub: "Réservez en ligne à toute heure — Sébastien confirme et s'adapte à votre planning.",
  },
  {
    title: "Chauffeur attitré",
    desc: "Pas un inconnu, votre chauffeur.",
    sub: "Un interlocuteur direct, discret, qui connaît vos habitudes et anticipe vos besoins.",
  },
];

export default function DriverPresentation() {
  return (
    <section id="chauffeur" className="py-16 lg:py-24 bg-[#091424]">
      <div className="max-w-[1400px] mx-auto px-10 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-end">

          {/* Photo */}
          <div className="relative pb-0 lg:pb-0">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden relative max-w-md mx-auto lg:max-w-none">
              <Image
                src="/About Us/Chauffeur.png"
                alt="Sébastien — Chauffeur privé GS Transport"
                fill
                className="object-cover"
              />
            </div>
            {/* Badge */}
            <div className="absolute bottom-4 right-4 lg:-bottom-6 lg:-right-6 bg-[#1FA3BA] rounded-2xl p-4 lg:p-6 shadow-xl">
              <p className="font-heading text-3xl lg:text-4xl font-bold text-white">5★</p>
              <p className="text-sm text-white mt-1">Note moyenne</p>
              <p className="text-sm text-white">+50 avis vérifiés</p>
            </div>
          </div>

          {/* Content */}
          <div className="lg:pb-6">
            <h2 className="font-heading text-white text-3xl sm:text-4xl md:text-5xl font-light leading-tight mb-5 lg:mb-6">
              Sébastien,
              <span className="block italic text-[#1FA3BA]">votre chauffeur VTC</span>
            </h2>
            <p className="text-white/60 leading-relaxed mb-4 text-sm sm:text-base">
              Sébastien a créé GS Transport avec une conviction simple : un trajet en VTC
              doit être aussi agréable qu'efficace. Pas de surprise, pas d'attente —
              juste un service irréprochable, à chaque course.
            </p>
            <p className="text-white/60 leading-relaxed mb-6 text-sm sm:text-base">
              De Sainte-Marie à Saint-Leu, il couvre toute la zone nord-ouest de l'île,
              24h/24, dans une SUV neuve. Aéroport, hôtel, soirée ou rendez-vous pro —
              il s'adapte à votre agenda, pas l'inverse.
            </p>

            <div className="flex flex-col gap-3">
              {details.map((d) => (
                <div key={d.title} className="bg-white/10 border border-white/15 rounded-2xl px-5 py-4">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <p className="font-semibold text-white text-base">{d.title}</p>
                    <span className="text-white/40 hidden sm:inline">–––</span>
                    <p className="text-white/70 text-base hidden sm:inline">{d.desc}</p>
                  </div>
                  <p className="text-white/55 text-sm mt-1.5 leading-relaxed">{d.sub}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
