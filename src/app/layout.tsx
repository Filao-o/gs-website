import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gstransport.re"),
  title: {
    default: "GS Transport — Chauffeur Privé à La Réunion",
    template: "%s — GS Transport",
  },
  description:
    "Service de chauffeur privé VTC sur l'île de La Réunion. Transferts aéroport, événements, déplacements professionnels de Saint-Marie à Saint-Leu. Disponible 24h/24.",
  keywords: [
    "VTC Réunion", "chauffeur privé Réunion", "transfert aéroport Réunion",
    "chauffeur événement Réunion", "GS Transport", "taxi Réunion",
    "VTC 974", "chauffeur Sébastien Réunion",
  ],
  authors: [{ name: "GS Transport" }],
  creator: "GS Transport",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gstransport.re" },
  openGraph: {
    title: "GS Transport — Chauffeur Privé à La Réunion",
    description: "Votre chauffeur privé de confiance à La Réunion. Transferts aéroport, événements, déplacements pro. Disponible 24h/24.",
    url: "https://gstransport.re",
    siteName: "GS Transport",
    locale: "fr_FR",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "GS Transport — Chauffeur Privé à La Réunion" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GS Transport — Chauffeur Privé à La Réunion",
    description: "Votre chauffeur privé de confiance à La Réunion. Disponible 24h/24.",
    images: ["/og-image.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://gstransport.re",
  name: "GS Transport",
  description: "Service de chauffeur privé VTC sur l'île de La Réunion. Transferts aéroport, événements, déplacements professionnels. Disponible 24h/24.",
  url: "https://gstransport.re",
  telephone: "+262693512282",
  priceRange: "€€",
  image: "https://gstransport.re/og-image.jpg",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sainte-Marie",
    addressRegion: "La Réunion",
    postalCode: "97438",
    addressCountry: "RE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -20.9022,
    longitude: 55.5348,
  },
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: -21.1,
      longitude: 55.5,
    },
    geoRadius: "80000",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: "52",
    bestRating: "5",
  },
  sameAs: [
    "https://www.google.com/maps/place/GS+TRANSPORT+-+Chauffeur+Priv%C3%A9",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`h-full antialiased ${cormorant.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
