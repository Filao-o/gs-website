import Image from "next/image";

const images: { src: string; alt: string }[] = [
  { src: "/gallery/1.jpg", alt: "SUV GS Transport sous les cocotiers" },
  { src: "/gallery/2.jpg", alt: "Sébastien devant le SUV" },
  { src: "/gallery/3.jpg", alt: "Sébastien souriant près du véhicule" },
  { src: "/gallery/4.jpg", alt: "SUV GS Transport garé devant un hôtel" },
  { src: "/gallery/5.jpg", alt: "Sébastien chauffeur privé à La Réunion" },
  { src: "/gallery/6.jpg", alt: "SUV GS Transport en déplacement" },
  { src: "/gallery/7.jpg", alt: "Intérieur premium du véhicule" },
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
        .gallery-mosaic > *:first-child,
        .gallery-mosaic > *:nth-child(8) {
          grid-column: span 2;
          aspect-ratio: 4/3;
        }
        @media (min-width: 1024px) {
          .gallery-mosaic {
            grid-template-columns: repeat(12, 1fr);
            grid-auto-rows: 260px;
          }
          .gallery-mosaic > * {
            aspect-ratio: auto;
            grid-column: auto;
          }
          .gallery-mosaic > *:nth-child(1) { grid-area: 1 / 1 / 3 / 6; }
          .gallery-mosaic > *:nth-child(2) { grid-area: 1 / 6 / 2 / 10; }
          .gallery-mosaic > *:nth-child(3) { grid-area: 1 / 10 / 2 / 13; }
          .gallery-mosaic > *:nth-child(4) { grid-area: 2 / 6 / 3 / 8; }
          .gallery-mosaic > *:nth-child(5) { grid-area: 2 / 8 / 4 / 13; }
          .gallery-mosaic > *:nth-child(6) { grid-area: 3 / 1 / 4 / 4; }
          .gallery-mosaic > *:nth-child(7) { grid-area: 3 / 4 / 4 / 6; }
          .gallery-mosaic > *:nth-child(8) { grid-area: 3 / 6 / 4 / 8; }
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
