import Image from "next/image";

const images: { src: string; alt: string; span: string }[] = [
  { src: "/gallery/1.jpg", alt: "La Réunion — paysage 1", span: "row-span-2" },
  { src: "/gallery/2.jpg", alt: "La Réunion — paysage 2", span: "" },
  { src: "/gallery/3.jpg", alt: "La Réunion — paysage 3", span: "" },
  { src: "/gallery/4.jpg", alt: "La Réunion — paysage 4", span: "row-span-2" },
  { src: "/gallery/5.jpg", alt: "La Réunion — paysage 5", span: "" },
  { src: "/gallery/6.jpg", alt: "La Réunion — paysage 6", span: "" },
  { src: "/gallery/7.jpg", alt: "La Réunion — paysage 7", span: "" },
  { src: "/gallery/8.jpg", alt: "La Réunion — paysage 8", span: "" },
];

export default function Gallery() {
  return (
    <section className="py-24 bg-[#091424]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#1FA3BA] mb-3">Galerie</p>
          <h2 className="font-heading text-white text-4xl lg:text-5xl font-light leading-tight">
            La Réunion vue de la route
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] lg:auto-rows-[220px] gap-3">
          {images.map((img) => (
            <div key={img.src} className={`relative rounded-2xl overflow-hidden group ${img.span}`}>
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
