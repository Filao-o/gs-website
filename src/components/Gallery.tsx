import Image from "next/image";

const images: { src: string; alt: string }[] = [
  { src: "/gallery/1.jpg", alt: "SUV GS Transport sous les cocotiers" },
  { src: "/gallery/2.jpg", alt: "Sébastien devant le SUV" },
  { src: "/gallery/3.jpg", alt: "Sébastien souriant près du véhicule" },
  { src: "/gallery/4.jpg", alt: "SUV GS Transport devant un hôtel" },
  { src: "/gallery/5.jpg", alt: "Sébastien chauffeur privé à La Réunion" },
  { src: "/gallery/6.jpg", alt: "SUV GS Transport en déplacement" },
  { src: "/gallery/7.jpg", alt: "Sébastien devant l'aéroport" },
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
            grid-template-columns: repeat(12, 1fr);
            grid-auto-rows: 280px;
          }
          .gallery-mosaic > * {
            aspect-ratio: auto;
          }
          .gallery-mosaic > *:nth-child(1) { grid-area: 1/1/3/5; }
          .gallery-mosaic > *:nth-child(2) { grid-area: 1/5/2/9; }
          .gallery-mosaic > *:nth-child(3) { grid-area: 1/9/3/13; }
          .gallery-mosaic > *:nth-child(4) { grid-area: 2/5/3/9; }
          .gallery-mosaic > *:nth-child(5) { grid-area: 3/1/5/5; }
          .gallery-mosaic > *:nth-child(6) { grid-area: 3/5/4/9; }
          .gallery-mosaic > *:nth-child(7) { grid-area: 3/9/5/13; }
          .gallery-mosaic > *:nth-child(8) { grid-area: 4/5/5/9; }
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
