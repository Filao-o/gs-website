"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";

const links = [
  { label: "Accueil", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "À propos", href: "/#chauffeur" },
  { label: "Avis", href: "/#avis" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-6 lg:px-10 pt-5 transition-all duration-300 ${
        scrolled ? "bg-[#091424]/95 backdrop-blur-md pt-3 pb-3 shadow-xl" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2 z-10">
          <span className="font-heading text-2xl lg:text-3xl font-bold text-[#1FA3BA] leading-none">GS</span>
          <span
            className={`font-heading text-sm lg:text-base font-light tracking-[0.2em] uppercase transition-colors duration-300 ${
              scrolled ? "text-white" : "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
            }`}
          >
            Transport
          </span>
        </a>

        {/* Pill nav — desktop */}
        <nav
          className={`hidden lg:flex items-center gap-1 rounded-full px-2 py-2 transition-all duration-300 ${
            scrolled
              ? "bg-white/10 border border-white/15"
              : "bg-[#091424]/50 backdrop-blur-md border border-white/20"
          }`}
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setActive(l.href)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                active === l.href
                  ? "bg-white text-[#091424] shadow-sm"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right — téléphone + CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="tel:+262693512282"
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${scrolled ? "text-white/80 hover:text-white" : "text-white/90 hover:text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"}`}
          >
            <Phone size={14} />
            0693 51 22 82
          </a>
          <a
            href="/#reservation"
            className="flex items-center gap-2 bg-[#1FA3BA] text-white text-sm font-medium pl-5 pr-3 py-2.5 rounded-full hover:bg-[#1FA3BA]/90 transition-all group"
          >
            Réserver
            <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <ArrowUpRight size={13} />
            </span>
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className={`lg:hidden z-10 w-10 h-10 backdrop-blur-md border rounded-full flex items-center justify-center text-white transition-all ${
            scrolled ? "bg-white/15 border-white/20" : "bg-[#091424]/50 border-white/20"
          }`}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden mt-3 bg-[#091424]/97 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-sm font-medium"
              >
                {l.label}
              </a>
            ))}
            <div className="pt-3 mt-2 border-t border-white/10 flex flex-col gap-3">
              <a
                href="tel:+262693512282"
                className="flex items-center justify-center gap-2 text-white/70 text-sm font-medium py-2"
              >
                <Phone size={14} /> 0693 51 22 82
              </a>
              <a
                href="/#reservation"
                className="flex items-center justify-center gap-2 bg-[#1FA3BA] text-white text-sm font-medium px-5 py-3 rounded-full"
              >
                Réserver <ArrowUpRight size={14} />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
