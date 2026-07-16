// ============================================================
//  GS TRANSPORT — Configuration tarifaire
//  Fichier à éditer pour ajuster tous les prix du tool de réservation.
//  Aucune connaissance technique requise : modifiez uniquement les valeurs.
//
//  LOGIQUE DE CALCUL :
//  1. On cherche si le trajet a un tarif €/km prédéfini (TARIFS_KM_PAR_TRAJET)
//  2. Sinon, on applique le palier kilométrique (PALIERS_KM)
//  3. Prix = distance_km × prix_par_km
//  4. Si prix < TARIF_MINIMUM → on applique le minimum
//  5. Si AR → on multiplie par MULTIPLICATEUR_AR
//  6. On ajoute les suppléments éventuels (nuit, dimanche...)
// ============================================================


// ─────────────────────────────────────────────
//  1. TARIF MINIMUM
//  Prix plancher quelle que soit la distance.
// ─────────────────────────────────────────────
export const TARIF_MINIMUM = 25; // €


// ─────────────────────────────────────────────
//  2. ALLER-RETOUR
//  Multiplicateur appliqué au tarif aller simple.
// ─────────────────────────────────────────────
export const MULTIPLICATEUR_AR = 2;


// ─────────────────────────────────────────────
//  3. TARIFS €/KM PAR TRAJET (trajets connus)
//  Prix au kilomètre selon le départ et la destination.
//  Priorité sur les paliers génériques.
//
//  Format : { de: "...", vers: "...", prix_par_km: X }
//  Les mots-clés sont insensibles à la casse et aux accents.
// ─────────────────────────────────────────────
export const TARIFS_KM_PAR_TRAJET: {
  de: string;
  vers: string;
  prix_par_km: number;
}[] = [

  // ── Depuis Saint-Denis ──────────────────────
  { de: "saint-denis", vers: "le port",                prix_par_km: 2.30 },
  { de: "saint-denis", vers: "saint-paul",             prix_par_km: 2.20 },
  { de: "saint-denis", vers: "la possession",          prix_par_km: 3.30 },
  { de: "saint-denis", vers: "saint-gilles",           prix_par_km: 2.00 },
  { de: "saint-denis", vers: "bois de nefles",         prix_par_km: 2.40 },
  { de: "saint-denis", vers: "trois bassins",          prix_par_km: 2.00 },

  // ── Depuis l'Aéroport Roland Garros ─────────
  { de: "aéroport",    vers: "saint-denis",            prix_par_km: 3.80 },
  { de: "aéroport",    vers: "sainte-clotilde",        prix_par_km: 3.80 },
  { de: "aéroport",    vers: "sainte-marie",           prix_par_km: 3.30 },
  { de: "aéroport",    vers: "la possession",          prix_par_km: 2.50 },
  { de: "aéroport",    vers: "le port",                prix_par_km: 2.30 },
  { de: "aéroport",    vers: "dos d'ane",              prix_par_km: 2.20 },
  { de: "aéroport",    vers: "pichette",               prix_par_km: 2.40 },
  { de: "aéroport",    vers: "bois de nefles",         prix_par_km: 2.08 },
  { de: "aéroport",    vers: "saint-paul",             prix_par_km: 1.95 },
  { de: "aéroport",    vers: "belle pierre",           prix_par_km: 3.50 },
  { de: "aéroport",    vers: "la bretagne",            prix_par_km: 4.50 },
  { de: "aéroport",    vers: "la montagne",            prix_par_km: 2.94 },
  { de: "aéroport",    vers: "saint-gilles",           prix_par_km: 1.77 },
  { de: "aéroport",    vers: "trois bassins",          prix_par_km: 1.70 },
  { de: "aéroport",    vers: "saint-leu",              prix_par_km: 1.55 },

  // ⚠️ À compléter avec les autres trajets de Sébastien
];


// ─────────────────────────────────────────────
//  4. PALIERS KILOMÉTRIQUES (trajets non listés)
//  Appliqués si le trajet n'est pas dans TARIFS_KM_PAR_TRAJET.
//  Le système prend le palier correspondant à la distance totale.
// ─────────────────────────────────────────────
// Moyenne calculée sur 21 trajets réels de Sébastien = 2.60 €/km
// Paliers calibrés : court = cher (coût fixe), long = moins cher (économie d'échelle)
export const PALIERS_KM: { jusqu_a: number; prix_par_km: number }[] = [
  { jusqu_a: 5,   prix_par_km: 3.50 }, //  0 →  5 km  (ex: Aéroport → Ste-Marie ~5km @ 3.30)
  { jusqu_a: 10,  prix_par_km: 3.10 }, //  5 → 10 km
  { jusqu_a: 20,  prix_par_km: 2.80 }, // 10 → 20 km  (ex: Aéroport → Saint-Denis ~12km @ 3.80)
  { jusqu_a: 30,  prix_par_km: 2.50 }, // 20 → 30 km
  { jusqu_a: 40,  prix_par_km: 2.10 }, // 30 → 40 km  (ex: Aéroport → Saint-Paul ~35km @ 1.95)
  { jusqu_a: 50,  prix_par_km: 1.85 }, // 40 → 50 km  (ex: Aéroport → Saint-Gilles ~50km @ 1.77)
  { jusqu_a: 60,  prix_par_km: 1.60 }, // 50 → 60 km  (ex: Aéroport → Saint-Leu ~60km @ 1.55)
  { jusqu_a: 999, prix_par_km: 1.55 }, // 60 km et +  (hors zone, cas rares)
  // Valeurs de test basées sur moyenne réelle — à affiner avec Sébastien
];


// ─────────────────────────────────────────────
//  5. MAJORATIONS PAR ZONE
//  Coefficient appliqué si la destination est dans les hauts.
//  1.0 = pas de majoration. 1.25 = +25%.
// ─────────────────────────────────────────────
export const MAJORATIONS_ZONE: Record<string, number> = {
  "bords":   1.0,
  "hauts":   1.25,
  "default": 1.0,
};

// Zones considérées comme "les hauts" (mots-clés dans l'adresse)
export const MOTS_CLES_HAUTS = [
  "bois de nefles",
  "la montagne",
  "la bretagne",
  "belle pierre",
  "les hauts",
  "dos d'ane",
  "pichette",
  // ⚠️ À compléter selon les zones hauts de la liste de Sébastien
];


// ─────────────────────────────────────────────
//  6. SUPPLÉMENTS
//  Montants fixes ajoutés selon certaines conditions.
// ─────────────────────────────────────────────
export const SUPPLEMENTS = {
  dimanche:          10,   // € fixe ajouté si la course est un dimanche
  nuit_majoration:   0.25, // % ajouté au prix de base (0.25 = +25%)
  nuit_heure_debut:  22,   // heure de début de la majoration nuit (22h00)
  nuit_heure_fin:    5,    // heure de fin de la majoration nuit (5h00)
};


// ─────────────────────────────────────────────
//  7. ZONE DE COUVERTURE (coordonnées GPS)
//  Adresses hors zone → message d'erreur au client.
// ─────────────────────────────────────────────
export const ZONE_COUVERTURE = {
  nord:  -20.85, // Sainte-Marie
  sud:   -21.20, // Saint-Leu
  est:    55.85,
  ouest:  55.20,
};


// ─────────────────────────────────────────────
//  8. CONTACT & NOTIFICATIONS
// ─────────────────────────────────────────────
export const CONTACT = {
  email_sebastien: "contact@gstransport.re",
  tel_sebastien:   "+262693512282",
};
