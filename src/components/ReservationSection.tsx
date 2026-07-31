import ReservationTool from "./ReservationTool";

export default function ReservationSection() {
  return (
    <section id="reservation" className="bg-white py-16 lg:py-24">
      <div className="max-w-[820px] mx-auto px-6 flex flex-col gap-6">
        {/* Version A — image background */}
        <div>
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#091424]/30 mb-3 px-1">Version A — image</p>
          <ReservationTool heroVariant="image" />
        </div>
        {/* Version B — bleu profond */}
        <div>
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#091424]/30 mb-3 px-1">Version B — classique</p>
          <ReservationTool heroVariant="dark" />
        </div>
      </div>
    </section>
  );
}
