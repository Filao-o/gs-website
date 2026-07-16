import { ArrowRight, Clock } from "lucide-react";

const posts = [
  {
    category: "Conseils",
    title: "Pourquoi réserver un VTC plutôt qu'un taxi à La Réunion ?",
    excerpt:
      "Tarif fixe, ponctualité, confort — les différences sont nombreuses. On vous explique pourquoi de plus en plus de voyageurs font le choix d'un chauffeur privé.",
    readTime: "4 min",
    date: "15 juin 2024",
    slug: "#",
  },
  {
    category: "Pratique",
    title: "Transfert aéroport à La Réunion : tout ce qu'il faut savoir",
    excerpt:
      "Horaires, bagages, suivi de vol — comment se préparer pour un transfert sans stress depuis ou vers l'aéroport Roland Garros.",
    readTime: "5 min",
    date: "2 juin 2024",
    slug: "#",
  },
  {
    category: "Business",
    title: "VTC professionnel à La Réunion : le choix de l'efficacité",
    excerpt:
      "Déplacements pro, séminaires, clients à accueillir — pourquoi les entreprises font confiance à GS Transport pour leurs mobilités sur l'île.",
    readTime: "4 min",
    date: "20 mai 2024",
    slug: "#",
  },
];

export default function Blog() {
  return (
    <section id="blog" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <p className="text-[#1FA3BA] text-sm font-medium tracking-[0.3em] uppercase mb-3">
              Blog & Conseils
            </p>
            <h2 className="font-heading text-[#091424] text-4xl md:text-5xl font-light">
              Voyager mieux à La Réunion
            </h2>
          </div>
          <a
            href="/blog"
            className="flex items-center gap-2 text-sm font-medium text-[#1FA3BA] hover:gap-3 transition-all"
          >
            Tous les articles <ArrowRight size={16} />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((p) => (
            <article key={p.title} className="group">
              <div className="aspect-[16/9] rounded-xl bg-[#E8E6DB] mb-5 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-[#091424]/10 to-[#1FA3BA]/10 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold text-[#1FA3BA] tracking-wide uppercase">
                  {p.category}
                </span>
                <span className="text-[#091424]/20">·</span>
                <span className="flex items-center gap-1 text-xs text-[#091424]/40">
                  <Clock size={11} /> {p.readTime}
                </span>
              </div>
              <h3 className="font-heading text-[#091424] text-xl font-medium leading-snug mb-3 group-hover:text-[#1FA3BA] transition-colors">
                <a href={p.slug}>{p.title}</a>
              </h3>
              <p className="text-[#091424]/60 text-sm leading-relaxed mb-4">{p.excerpt}</p>
              <p className="text-xs text-[#091424]/30">{p.date}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
