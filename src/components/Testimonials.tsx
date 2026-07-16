import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Marie-France D.",
    date: "Mars 2024",
    text: "Transfert depuis l'aéroport parfait. Sébastien était là avant même que je sorte des bagages, SUV impeccable, trajet fluide. Un service qu'on ne retrouve pas ailleurs à La Réunion.",
  },
  {
    name: "Jean-Luc P.",
    date: "Février 2024",
    text: "Vol retardé de 2h, Sébastien avait suivi en temps réel et était là sans que j'aie besoin de le rappeler. Ce niveau de service, c'est exactement ce qu'on attend d'un vrai chauffeur.",
  },
  {
    name: "Sophie & Marc",
    date: "Janvier 2024",
    text: "Il nous a conduits pour notre mariage avec une discrétion et une élégance irréprochables. Le véhicule était magnifique, à l'heure, et Sébastien d'une gentillesse rare.",
  },
  {
    name: "Thomas R.",
    date: "Décembre 2023",
    text: "Mon chauffeur attitré pour tous mes déplacements pro à La Réunion. Ponctuel, discret, véhicule premium — exactement ce dont j'ai besoin pour recevoir mes clients.",
  },
  {
    name: "Amandine L.",
    date: "Novembre 2023",
    text: "Retour de soirée à minuit, prise en charge impeccable. On sentait qu'on était entre de bonnes mains. Plus jamais de taxi classique après ça.",
  },
  {
    name: "Frédéric M.",
    date: "Octobre 2023",
    text: "Sébastien a récupéré mes collègues à l'aéroport pendant que j'étais en réunion. Tout s'est passé parfaitement, sans que j'aie à gérer quoi que ce soit. Un vrai professionnel.",
  },
  {
    name: "Nathalie V.",
    date: "Septembre 2023",
    text: "J'utilise GS Transport pour tous mes trajets depuis l'aéroport. La régularité du service est impressionnante — toujours à l'heure, véhicule impeccable, sourire au rendez-vous.",
  },
  {
    name: "Christophe & Julie",
    date: "Août 2023",
    text: "Nous avons privatisé Sébastien pour toute la journée de notre mariage. Une organisation sans faille, une élégance naturelle. Nos invités ont adoré. Merci infiniment.",
  },
  {
    name: "Patrick O.",
    date: "Juillet 2023",
    text: "Déplacement pro de Saint-Denis à Saint-Pierre aller-retour. Sébastien connaît parfaitement l'île, la conduite est fluide et rassurante. Je recommande sans hésiter.",
  },
];

export default function Testimonials() {
  return (
    <section id="avis" className="py-16 lg:py-24 bg-[#091424] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10 lg:mb-16">
          <h2 className="font-heading text-white text-4xl md:text-5xl font-light">
            Ils nous font confiance
          </h2>
          <div className="flex items-center justify-center gap-2 mt-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} fill="#1FA3BA" className="text-[#1FA3BA]" />
            ))}
            <span className="ml-2 text-white/50 text-sm font-medium">5,0 / 5 — 50+ avis</span>
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <Quote size={28} className="text-[#091424]/15 mb-4" />
              <p className="text-[#091424]/70 leading-relaxed text-sm mb-6">{r.text}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#091424] text-sm">{r.name}</p>
                  <p className="text-[#091424]/40 text-xs">{r.date}</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="#091424" className="text-[#091424]" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/#reservation"
            className="inline-block bg-white text-[#091424] font-medium px-8 py-4 rounded-full text-sm hover:bg-[#F5F4F0] transition-all"
          >
            Rejoindre nos clients satisfaits
          </a>
        </div>
      </div>
    </section>
  );
}
