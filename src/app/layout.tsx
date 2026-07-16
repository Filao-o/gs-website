import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GS Transport — Chauffeur Privé à La Réunion",
  description:
    "Service de chauffeur privé VTC sur l'île de La Réunion. Transferts aéroport, événements, déplacements professionnels de Saint-Marie à Saint-Leu. Réservez avec Sébastien.",
  keywords: [
    "VTC Réunion",
    "chauffeur privé Réunion",
    "transfert aéroport Réunion",
    "chauffeur événement Réunion",
    "GS Transport",
  ],
  openGraph: {
    title: "GS Transport — Chauffeur Privé à La Réunion",
    description: "Votre chauffeur privé de confiance sur l'île de La Réunion.",
    url: "https://gstransport.re",
    siteName: "GS Transport",
    locale: "fr_FR",
    type: "website",
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
