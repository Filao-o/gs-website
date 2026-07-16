import { ArrowUpRight } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="bg-[#1FA3BA] py-5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between gap-4">
        <p className="font-heading text-white text-lg lg:text-2xl font-light italic">
          Prêt à voyager autrement ?
        </p>
        <a
          href="#reservation"
          className="flex items-center gap-2 bg-white text-[#1FA3BA] font-medium text-sm pl-5 pr-3 py-2.5 rounded-full hover:bg-[#F5F4F0] transition-all shrink-0 group"
        >
          Réserver une course
          <span className="w-6 h-6 bg-[#1FA3BA]/15 rounded-full flex items-center justify-center group-hover:bg-[#1FA3BA]/25 transition-colors">
            <ArrowUpRight size={13} className="text-[#1FA3BA]" />
          </span>
        </a>
      </div>
    </section>
  );
}
