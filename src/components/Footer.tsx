import { Phone, Mail, MapPin, Share2 } from "lucide-react";

const navLinks = [
  { label: "Réserver", href: "/#reservation" },
  { label: "Services", href: "/#services" },
  { label: "À propos", href: "/#chauffeur" },
  { label: "Avis clients", href: "/#avis" },
  { label: "Blog", href: "/blog" },
];

const legalLinks = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Politique de confidentialité", href: "/confidentialite" },
  { label: "CGU", href: "/cgu" },
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#091424] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <span className="font-heading text-3xl font-bold text-[#1FA3BA]">GS</span>
              <span className="font-heading text-xl font-light tracking-widest uppercase">Transport</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-6">
              Votre chauffeur privé de confiance sur l'île de La Réunion.
              VTC premium disponible 24h/24 de Sainte-Marie à Saint-Leu. Aéroport, hôtels, soirées, déplacements pro.
            </p>
            <a
              href="#reservation"
              className="inline-block bg-[#1FA3BA] text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-[#1FA3BA]/90 transition-colors"
            >
              Réserver maintenant
            </a>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-5">Navigation</p>
            <ul className="flex flex-col gap-3">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-white/60 hover:text-[#1FA3BA] transition-colors text-sm"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-5">Contact</p>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href="tel:+262693512282"
                  className="flex items-center gap-3 text-white/60 hover:text-[#1FA3BA] transition-colors text-sm"
                >
                  <Phone size={14} className="shrink-0 text-[#1FA3BA]" />
                  0693 51 22 82
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@gstransport.re"
                  className="flex items-center gap-3 text-white/60 hover:text-[#1FA3BA] transition-colors text-sm"
                >
                  <Mail size={14} className="shrink-0 text-[#1FA3BA]" />
                  contact@gstransport.re
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <MapPin size={14} className="shrink-0 text-[#1FA3BA] mt-0.5" />
                <span>Saint-Marie à Saint-Leu<br />Île de La Réunion (974)</span>
              </li>
            </ul>

            {/* Social */}
            <div className="flex gap-3 mt-6">
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-[#1FA3BA] hover:border-[#1FA3BA]/30 transition-colors"
                aria-label="Instagram"
              >
                <Share2 size={15} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-[#1FA3BA] hover:border-[#1FA3BA]/30 transition-colors"
                aria-label="Facebook"
              >
                <Share2 size={15} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <p>© {new Date().getFullYear()} GS Transport — Tous droits réservés</p>
          <div className="flex gap-6">
            {legalLinks.map((l) => (
              <a key={l.label} href={l.href} className="hover:text-white/60 transition-colors">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
