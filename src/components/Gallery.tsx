import Image from "next/image";

const images: { src: string; alt: string; span: string }[] = [
  { src: "/gallery/1.jpg", alt: "Sébastien devant le pont avec le SUV",       span: "col-span-3" },
  { src: "/gallery/2.jpg", alt: "Sébastien devant un hôtel",                  span: "col-span-2" },
  { src: "/gallery/3.jpg", alt: "Sébastien et le SUV sous les cocotiers",     span: "col-span-4" },
  { src: "/gallery/4.jpg", alt: "Sébastien au volant",                        span: "col-span-3" },
  { src: "/gallery/5.jpg", alt: "Sébastien devant l'aéroport Roland Garros",  span: "col-span-2" },
  { src: "/gallery/6.jpg", alt: "GS Transport — La Réunion 6",               span: "col-span-3" },
  { src: "/gallery/7.jpg", alt: "GS Transport — La Réunion 7",               span: "col-span-3" },
  { src: "/gallery/8.jpg", alt: "GS Transport — La Réunion 8",               span: "col-span-4" },
];

export default function Gallery() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-12 auto-rows-[180px] lg:auto-rows-[260px] gap-3">
          {images.map((img) => (
            <div key={img.src} className={`relative rounded-2xl overflow-hidden group ${img.span}`}>
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
