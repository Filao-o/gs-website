import Image from "next/image";
import ReservationTool from "./ReservationTool";

const stats = [
  { value: "+260", label: "clients récurrents" },
  { value: "24h/24", label: "disponible" },
  { value: "5★", label: "note moyenne" },
];

export default function ReservationSection() {
  return (
    <section id="reservation" className="bg-white">

      {/* ── Mobile : layout centré classique ── */}
      <div className="lg:hidden py-14 px-6">
        <div className="text-center mb-10">
          <h2 className="font-heading text-[#091424] text-4xl font-light">
            Planifiez votre trajet
          </h2>
          <p className="text-[#091424]/60 mt-3 text-sm leading-relaxed">
            Estimation instantanée · Confirmation sous 15 minutes
          </p>
        </div>
        <ReservationTool />
      </div>

      {/* ── Desktop : split 50/50 ── */}
      <div className="hidden lg:grid lg:grid-cols-2 min-h-[90vh]">

        {/* Gauche — visuel */}
        <div className="relative overflow-hidden">
          <Image
            src="/Hero/Card Hero/road.jpg"
            alt="Route de La Réunion"
            fill
            className="object-cover object-center"
          />
          {/* Overlay dégradé */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#091424]/80 via-[#091424]/30 to-[#091424]/10" />

          {/* Contenu overlay */}
          <div className="absolute inset-0 flex flex-col justify-between p-12 xl:p-16">
            {/* Top */}
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#1FA3BA] mb-6">Réservation</p>
              <h2 className="font-heading text-white text-5xl xl:text-6xl font-light leading-[1.05]">
                Planifiez<br />votre trajet
              </h2>
              <p className="text-white/60 mt-4 text-sm leading-relaxed max-w-xs">
                Estimation instantanée du tarif.<br />
                Confirmation sous 15 minutes.
              </p>
            </div>

            {/* Stats bas */}
            <div className="flex gap-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-heading text-white text-3xl font-light">{s.value}</p>
                  <p className="text-white/50 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Droite — wizard */}
        <div className="flex items-center justify-center p-10 xl:p-16 bg-white">
          <div className="w-full max-w-lg">
            <ReservationTool />
          </div>
        </div>

      </div>
    </section>
  );
}
