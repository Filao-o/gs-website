import Image from "next/image";

const images: { src: string; alt: string }[] = [
  { src: "/gallery/1.jpg", alt: "La Réunion — paysage 1" },
  { src: "/gallery/2.jpg", alt: "La Réunion — paysage 2" },
  { src: "/gallery/3.jpg", alt: "La Réunion — paysage 3" },
  { src: "/gallery/4.jpg", alt: "La Réunion — paysage 4" },
  { src: "/gallery/5.jpg", alt: "La Réunion — paysage 5" },
  { src: "/gallery/6.jpg", alt: "La Réunion — paysage 6" },
  { src: "/gallery/7.jpg", alt: "La Réunion — paysage 7" },
  { src: "/gallery/8.jpg", alt: "La Réunion — paysage 8" },
];

export default function Gallery() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-4 grid-rows-2 gap-3 aspect-[2/1]">
          {images.map((img) => (
            <div key={img.src} className="relative rounded-2xl overflow-hidden group">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
