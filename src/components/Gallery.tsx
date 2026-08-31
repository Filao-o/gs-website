import Image from "next/image";

const images: { src: string; alt: string; area: string }[] = [
  { src: "/gallery/1.jpg", alt: "Sébastien devant le pont avec le SUV",       area: "1 / 1 / 3 / 6" },
  { src: "/gallery/2.jpg", alt: "Sébastien devant un hôtel",                  area: "1 / 6 / 2 / 10" },
  { src: "/gallery/3.jpg", alt: "Sébastien et le SUV sous les cocotiers",     area: "1 / 10 / 2 / 13" },
  { src: "/gallery/4.jpg", alt: "Sébastien au volant",                        area: "2 / 6 / 3 / 8" },
  { src: "/gallery/5.jpg", alt: "Sébastien devant l'aéroport Roland Garros",  area: "2 / 8 / 4 / 13" },
  { src: "/gallery/6.jpg", alt: "GS Transport — La Réunion 6",               area: "3 / 1 / 4 / 4" },
  { src: "/gallery/7.jpg", alt: "GS Transport — La Réunion 7",               area: "3 / 4 / 4 / 6" },
  { src: "/gallery/8.jpg", alt: "GS Transport — La Réunion 8",               area: "3 / 6 / 4 / 8" },
];

export default function Gallery() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-12 auto-rows-[140px] lg:auto-rows-[220px] gap-3">
          {images.map((img) => (
            <div
              key={img.src}
              className="relative rounded-2xl overflow-hidden group"
              style={{ gridArea: img.area }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
