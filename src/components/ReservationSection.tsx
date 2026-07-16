import { CalendarClock } from "lucide-react";

export default function ReservationSection() {
  return (
    <section id="reservation" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[#1FA3BA] text-sm font-medium tracking-[0.3em] uppercase mb-3">
            Réservation
          </p>
          <h2 className="font-heading text-[#091424] text-4xl md:text-5xl font-light">
            Planifiez votre trajet
          </h2>
          <p className="text-[#091424]/60 mt-4 max-w-xl mx-auto">
            Renseignez vos informations et obtenez une estimation instantanée.
            Confirmation par email et SMS sous 15 minutes.
          </p>
        </div>

        {/* Outil de réservation — à intégrer */}
        <div className="max-w-3xl mx-auto">
          <div className="border-2 border-dashed border-[#1FA3BA]/30 rounded-2xl bg-[#E8E6DB]/30 p-16 text-center">
            <div className="w-16 h-16 rounded-full bg-[#1FA3BA]/10 flex items-center justify-center mx-auto mb-6">
              <CalendarClock size={28} className="text-[#1FA3BA]" />
            </div>
            <p className="font-heading text-2xl text-[#091424] font-light mb-2">
              Outil de réservation
            </p>
            <p className="text-[#091424]/50 text-sm">
              Intégration en cours — étape 2 du projet
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
