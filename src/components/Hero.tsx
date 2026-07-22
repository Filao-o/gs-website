"use client";

import Image from "next/image";
import { ArrowUpRight, Star, MapPin } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

const SLIDES = [
  { src: "/Hero/Card Hero/forest.jpg",   label: "Transfert Aéroport",     sub: "Roland Garros · 24h/24",    pos: "object-center" },
  { src: "/Hero/Card Hero/beach.jpg",    label: "Navette Hôtel",          sub: "À domicile · Sur appel",    pos: "object-left" },
  { src: "/Hero/Card Hero/volcano.jpg",  label: "Soirées & Événements",   sub: "Mariages, dîners, galas",   pos: "object-right-bottom" },
  { src: "/Hero/Card Hero/road.jpg",     label: "Business",               sub: "Réunions · Séminaires",     pos: "object-top" },
  { src: "/Hero/Card Hero/mounts.jpg",   label: "Mise à disposition",     sub: "À l'heure · Sur mesure",    pos: "object-bottom" },
];

const N        = SLIDES.length;
const EXTENDED = [...SLIDES, ...SLIDES, ...SLIDES];
const ANIM_MS  = 650;
const INTERVAL = 5000;
const CARD_W   = 210;
const CARD_GAP = 14;
const STEP     = CARD_W + CARD_GAP;

export default function Hero() {
  const indexRef  = useRef(N);
  const [index, _setIndex] = useState(N);
  const [transition, setTransition] = useState(true);
  const autoTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const snapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setIndex = useCallback((val: number) => {
    indexRef.current = val;
    _setIndex(val);
  }, []);

  const advance = useCallback((to: number) => {
    setTransition(true);
    setIndex(to);
    if (snapTimer.current) clearTimeout(snapTimer.current);
    snapTimer.current = setTimeout(() => {
      const cur = indexRef.current;
      if (cur >= N * 2 || cur < N) {
        const snapped = ((cur % N) + N) % N + N;
        setTransition(false);
        setIndex(snapped);
        requestAnimationFrame(() => requestAnimationFrame(() => setTransition(true)));
      }
    }, ANIM_MS + 50);
  }, [setIndex]);

  const startTimer = useCallback(() => {
    if (autoTimer.current) clearInterval(autoTimer.current);
    autoTimer.current = setInterval(() => {
      advance(indexRef.current + 1);
    }, INTERVAL);
  }, [advance]);

  useEffect(() => {
    startTimer();
    return () => {
      if (autoTimer.current) clearInterval(autoTimer.current);
      if (snapTimer.current) clearTimeout(snapTimer.current);
    };
  }, [startTimer]);

  const goTo = useCallback((dot: number) => {
    const cur    = indexRef.current;
    const base   = Math.floor(cur / N) * N;
    let   target = base + dot;
    if (target <= cur) target += N;
    if (target >= EXTENDED.length) target -= N;
    advance(target);
    startTimer();
  }, [advance, startTimer]);

  const activeDot  = ((index % N) + N) % N;
  const translateX = index * STEP;

  return (
    <section className="relative min-h-[100dvh] flex flex-col overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0">
        <Image src="/Hero/hero-bg.webp" alt="Route côtière de La Réunion" fill priority className="object-cover object-center" />
        {/* Overlay global léger */}
        <div className="absolute inset-0 bg-[#091424]/25" />
        {/* Dégradé sombre côté gauche pour lisibilité du texte */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(9,20,36,0.85) 0%, rgba(9,20,36,0.55) 45%, transparent 70%)" }} />
        {/* Dégradé bas pour les cards */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(9,20,36,0.4) 0%, transparent 40%)" }} />
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 flex-1 flex flex-col max-w-7xl mx-auto w-full px-6 lg:px-10 pt-28 lg:pt-32 pb-6 lg:pb-[95px]">
        <div className="flex-1 flex flex-col justify-end">

          {/* Pill localisation */}
          <div className="inline-flex items-center gap-2 self-start bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6 lg:mb-8">
            <MapPin size={12} className="text-[#1FA3BA]" />
            <span className="text-white/90 text-xs font-medium tracking-wide">
              Saint-Marie → Saint-Leu · Île de La Réunion
            </span>
          </div>

          {/* Titre */}
          <h1 className="font-heading text-white text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-light leading-[1.05] mb-5 lg:mb-6">
            Votre chauffeur privé<br />
            à{" "}
            <span className="italic text-[#1FA3BA]">La Réunion</span>
            <br />à votre service
          </h1>

          {/* Sous-titre */}
          <p className="text-white text-sm sm:text-base leading-relaxed max-w-sm mb-6 lg:mb-8">
            Aéroport, hôtels, soirées, déplacements pro —
            disponible 24h/24 de Sainte-Marie à Saint-Leu.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 sm:gap-6 mb-6 lg:mb-10 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white overflow-hidden shrink-0">
                    <Image src={`/Hero/Avatar Hero/${n}.jpg`} alt={`Client ${n}`} width={36} height={36} className="object-cover w-full h-full" />
                  </div>
                ))}
              </div>
              <span className="text-white text-xs sm:text-sm font-medium">+260 clients récurrents</span>
            </div>
            <div className="w-px h-5 bg-white/40" />
            <div className="flex items-center gap-1.5">
              <Star size={15} fill="#ffffff" className="text-white" />
              <span className="text-white font-bold text-sm sm:text-base">5,0</span>
              <span className="text-white text-xs sm:text-sm">/ 5</span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <a
              href="#reservation"
              className="flex items-center gap-2 bg-[#1FA3BA] text-white font-medium pl-5 sm:pl-6 pr-4 py-3 sm:py-3.5 rounded-full hover:bg-[#1FA3BA]/90 transition-all hover:shadow-xl hover:shadow-[#1FA3BA]/30 group text-sm"
            >
              Réserver une course
              <span className="w-6 h-6 sm:w-7 sm:h-7 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <ArrowUpRight size={13} />
              </span>
            </a>
          </div>

          {/* ── Cards mobiles (scroll horizontal) ── */}
          <div className="lg:hidden mt-8 -mx-6 pl-6 overflow-x-auto flex gap-3 pb-2 scrollbar-none snap-x snap-mandatory">
            {SLIDES.map((slide, i) => (
              <div
                key={i}
                className="snap-start shrink-0 relative rounded-2xl overflow-hidden border border-white/10 shadow-xl"
                style={{ width: 165, height: 210 }}
              >
                <Image src={slide.src} alt={slide.label} fill className={`object-cover ${slide.pos}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#091424]/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-heading text-sm font-medium leading-tight">{slide.label}</p>
                  <p className="text-white/55 text-xs mt-0.5">{slide.sub}</p>
                </div>
              </div>
            ))}
            {/* Spacer final pour scroll jusqu'au bout */}
            <div className="shrink-0 w-2" />
          </div>

        </div>
      </div>

      {/* ── Cards desktop (absolue, comme avant) ── */}
      <div
        className="hidden lg:block absolute top-0 bottom-0 overflow-hidden pointer-events-none z-20"
        style={{ left: "60%", width: "200vw" }}
      >
        <div className="absolute bottom-[95px] left-0 pointer-events-auto flex flex-col gap-3">

          {/* Cards */}
          <div
            className="flex"
            style={{
              gap: CARD_GAP,
              willChange: "transform",
              transform: `translateX(-${translateX}px)`,
              transition: transition ? `transform ${ANIM_MS}ms cubic-bezier(0.4,0,0.2,1)` : "none",
            }}
          >
            {EXTENDED.map((slide, i) => {
              const isActive = i === index;
              return (
                <div
                  key={i}
                  onClick={() => goTo(i % N)}
                  className="relative shrink-0 rounded-2xl overflow-hidden cursor-pointer border border-white/10 shadow-2xl"
                  style={{
                    width:  CARD_W,
                    height: isActive ? 320 : 260,
                    opacity: 1,
                    transition: transition ? `height ${ANIM_MS}ms ease, opacity ${ANIM_MS}ms ease` : "none",
                    alignSelf: "center",
                  }}
                >
                  <Image src={slide.src} alt={slide.label} fill className={`object-cover ${slide.pos}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091424]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-heading text-base font-medium">{slide.label}</p>
                    <p className="text-white/55 text-xs mt-0.5">{slide.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Barre de progression */}
          <div className="flex gap-1" style={{ width: "calc(40vw - 3rem)" }}>
            {SLIDES.map((_, i) => (
              <div key={i} className="flex-1 h-0.5 rounded-full bg-white/20 overflow-hidden">
                {i < activeDot ? (
                  <div className="h-full w-full bg-[#1FA3BA] rounded-full" />
                ) : i === activeDot ? (
                  <div
                    key={activeDot}
                    className="h-full bg-[#1FA3BA] rounded-full"
                    style={{ animation: `progressFill ${INTERVAL}ms linear forwards` }}
                  />
                ) : null}
              </div>
            ))}
          </div>

        </div>
      </div>

    </section>
  );
}
