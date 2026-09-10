import Image from "next/image";

const images: { src: string; alt: string }[] = [
  { src: "/gallery/1.jpg", alt: "SUV GS Transport sous les cocotiers" },
  { src: "/gallery/6.jpg", alt: "Sébastien devant l'aéroport" },
  { src: "/gallery/3.jpg", alt: "Sébastien souriant près du véhicule" },
  { src: "/gallery/8.jpg", alt: "Sébastien au volant" },
];

export default function Gallery() {
  return (
    <section className="py-16 lg:py-24">
      <style>{`
        .gallery-mosaic {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }
        .gallery-mosaic > * {
          position: relative;
          border-radius: 1rem;
          overflow: hidden;
          aspect-ratio: 3/4;
        }
        @media (min-width: 1024px) {
          .gallery-mosaic {
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
          }
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="gallery-mosaic">
          {images.map((img) => (
            <div key={img.src} className="group">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
