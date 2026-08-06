import type { Metadata } from "next";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
