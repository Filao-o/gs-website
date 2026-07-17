import {
  TARIF_MINIMUM,
  MULTIPLICATEUR_AR,
  TARIFS_KM_PAR_TRAJET,
  PALIERS_KM,
  MAJORATIONS_ZONE,
  MOTS_CLES_HAUTS,
  SUPPLEMENTS,
} from "./pricing.config";

function normalise(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[-_]/g, " ")
    .trim();
}

function detecterZone(adresse: string): "hauts" | "bords" {
  const n = normalise(adresse);
  return MOTS_CLES_HAUTS.some((m) => n.includes(normalise(m))) ? "hauts" : "bords";
}

function tarifKmParTrajet(depart: string, destination: string): number | null {
  const d = normalise(depart);
  const v = normalise(destination);
  for (const t of TARIFS_KM_PAR_TRAJET) {
    if (d.includes(normalise(t.de)) && v.includes(normalise(t.vers))) {
      return t.prix_par_km;
    }
  }
  return null;
}

function prixParKmPalier(distanceKm: number): number {
  for (const p of PALIERS_KM) {
    if (distanceKm <= p.jusqu_a) return p.prix_par_km;
  }
  return PALIERS_KM[PALIERS_KM.length - 1].prix_par_km;
}

export interface PrixResult {
  prixBase: number;
  prixFinal: number;
  distanceKm: number;
  dureeMin: number;
  prixParKm: number;
  source: "tarif_fixe" | "palier";
  majoration: string | null;
  supplements: { label: string; montant: number }[];
}

export function calculerPrix(
  depart: string,
  destination: string,
  distanceKm: number,
  dureeMin: number,
  heureDepart: number,
  jourSemaine: number,
  allerRetour: boolean
): PrixResult {
  const prixKm = tarifKmParTrajet(depart, destination) ?? prixParKmPalier(distanceKm);
  const source: PrixResult["source"] = tarifKmParTrajet(depart, destination) ? "tarif_fixe" : "palier";

  const zone = detecterZone(destination);
  const coefZone = MAJORATIONS_ZONE[zone] ?? MAJORATIONS_ZONE["default"];
  const majoration = coefZone > 1 ? `Zone hauts (+${Math.round((coefZone - 1) * 100)}%)` : null;

  let prixBase = distanceKm * prixKm * coefZone;
  if (allerRetour) prixBase *= MULTIPLICATEUR_AR;
  prixBase = Math.max(prixBase, TARIF_MINIMUM);

  const supps: { label: string; montant: number }[] = [];

  // Nuit : 22h → 5h
  const estNuit = heureDepart >= SUPPLEMENTS.nuit_heure_debut || heureDepart < SUPPLEMENTS.nuit_heure_fin;
  if (estNuit && SUPPLEMENTS.nuit_majoration > 0) {
    const montant = Math.round(prixBase * SUPPLEMENTS.nuit_majoration * 100) / 100;
    supps.push({ label: `Majoration nuit +${SUPPLEMENTS.nuit_majoration * 100}%`, montant });
  }

  // Dimanche
  if (jourSemaine === 0 && SUPPLEMENTS.dimanche > 0) {
    supps.push({ label: "Supplément dimanche", montant: SUPPLEMENTS.dimanche });
  }

  const prixFinal = Math.round((prixBase + supps.reduce((a, s) => a + s.montant, 0)) * 100) / 100;

  return {
    prixBase: Math.round(prixBase * 100) / 100,
    prixFinal,
    distanceKm: Math.round(distanceKm * 10) / 10,
    dureeMin,
    prixParKm: Math.round(prixKm * 100) / 100,
    source,
    majoration,
    supplements: supps,
  };
}
