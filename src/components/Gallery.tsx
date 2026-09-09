import Image from "next/image";

const images: { src: string; alt: string }[] = [
  { src: "/gallery/1.jpg", alt: "Sébastien devant le pont avec le SUV" },
  { src: "/gallery/2.jpg", alt: "Sébastien devant un hôtel" },
  { src: "/gallery/3.jpg", alt: "Sébastien et le SUV sous les cocotiers" },
  { src: "/gallery/4.jpg", alt: "Sébastien au volant" },
  { src: "/gallery/5.jpg", alt: "Sébastien devant l'aéroport Roland Garros" },
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
        }
        .gallery-mosaic > *:first-child {
          grid-column: span 2;
          aspect-ratio: 4/3;
        }
        .gallery-mosaic > *:nth-child(n+2) {
          aspect-ratio: 3/4;
        }
        @media (min-width: 1024px) {
          .gallery-mosaic {
            grid-template-columns: repeat(12, 1fr);
            grid-auto-rows: 300px;
          }
          .gallery-mosaic > * {
            aspect-ratio: auto;
          }
          .gallery-mosaic > *:first-child {
            grid-area: 1 / 1 / 3 / 6;
            aspect-ratio: auto;
          }
          .gallery-mosaic > *:nth-child(2) { grid-area: 1 / 6 / 2 / 9; }
          .gallery-mosaic > *:nth-child(3) { grid-area: 1 / 9 / 2 / 13; }
          .gallery-mosaic > *:nth-child(4) { grid-area: 2 / 6 / 3 / 10; }
          .gallery-mosaic > *:nth-child(5) { grid-area: 2 / 10 / 3 / 13; }
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
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
