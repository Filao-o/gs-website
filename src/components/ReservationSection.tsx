import ReservationTool from "./ReservationTool";

export default function ReservationSection() {
  return (
    <section id="reservation" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-[#091424] text-4xl md:text-5xl font-light">
            Planifiez votre trajet
          </h2>
          <p className="text-[#091424]/60 mt-4 max-w-xl mx-auto">
            Renseignez vos informations et obtenez une estimation instantanée.
            Confirmation par SMS sous 15 minutes.
          </p>
        </div>

        <ReservationTool />
      </div>
    </section>
  );
}
