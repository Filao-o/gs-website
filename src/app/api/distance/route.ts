import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const origine     = searchParams.get("origine");
  const destination = searchParams.get("destination");

  if (!origine || !destination) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Clé API manquante" }, { status: 500 });
  }

  const url = new URL("https://maps.googleapis.com/maps/api/distancematrix/json");
  url.searchParams.set("origins", `${origine}, La Réunion`);
  url.searchParams.set("destinations", `${destination}, La Réunion`);
  url.searchParams.set("mode", "driving");
  url.searchParams.set("language", "fr");
  url.searchParams.set("region", "re");
  url.searchParams.set("key", apiKey);

  const res  = await fetch(url.toString());
  const data = await res.json();

  const element = data?.rows?.[0]?.elements?.[0];
  if (!element || element.status !== "OK") {
    return NextResponse.json({ error: "Trajet introuvable" }, { status: 404 });
  }

  return NextResponse.json({
    distanceKm: element.distance.value / 1000,
    dureeMin:   Math.ceil(element.duration.value / 60),
    texteDistance: element.distance.text,
    texteDuree:    element.duration.text,
  });
}
