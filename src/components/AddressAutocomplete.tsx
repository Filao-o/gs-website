"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Locate, Loader2 } from "lucide-react";
import { loadGoogleMaps } from "@/lib/loadGoogleMaps";

interface Coords {
  lat: number;
  lng: number;
}

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onValidated?: (valid: boolean) => void;
  onCoords?: (coords: Coords | null) => void;
  placeholder?: string;
  showGeolocate?: boolean;
}

interface Prediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    main_text_matched_substrings: Array<{ offset: number; length: number }>;
    secondary_text: string;
  };
}

function highlightMain(
  text: string,
  matches: Array<{ offset: number; length: number }>
): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  for (const m of matches) {
    if (m.offset > cursor) parts.push(<span key={`p-${cursor}`} className="text-[#091424]/60">{text.slice(cursor, m.offset)}</span>);
    parts.push(<span key={`m-${m.offset}`} className="text-[#1FA3BA] font-medium">{text.slice(m.offset, m.offset + m.length)}</span>);
    cursor = m.offset + m.length;
  }
  if (cursor < text.length) parts.push(<span key="tail" className="text-[#091424]/60">{text.slice(cursor)}</span>);
  return parts;
}

function parseSecondary(secondary: string): { commune: string; rest: string } {
  const parts = secondary.split(",").map(s => s.trim()).filter(Boolean);
  // Drop trailing "Réunion" / "France" as it's implicit
  const filtered = parts.filter(p => p !== "Réunion" && p !== "France");
  const commune = filtered[0] ?? parts[0] ?? "";
  const rest = filtered.slice(1).join(", ");
  return { commune, rest };
}

export default function AddressAutocomplete({
  label, value, onChange, onValidated, onCoords, placeholder, showGeolocate = false,
}: Props) {
  const inputRef        = useRef<HTMLInputElement>(null);
  const serviceRef      = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesRef       = useRef<google.maps.places.PlacesService | null>(null);
  const dummyRef        = useRef<HTMLDivElement>(null);
  const containerRef    = useRef<HTMLDivElement>(null);
  const validatedRef    = useRef(!!value);

  const [ready,       setReady]       = useState(false);
  const [validated,   setValidated]   = useState(!!value);
  const [geoLoading,  setGeoLoading]  = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [open,        setOpen]        = useState(false);
  const debounceRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadGoogleMaps().then(() => {
      serviceRef.current = new window.google.maps.places.AutocompleteService();
      placesRef.current  = new window.google.maps.places.PlacesService(dummyRef.current!);
      setReady(true);
    });
  }, []);

  const markValid = useCallback((val: boolean) => {
    validatedRef.current = val;
    setValidated(val);
    onValidated?.(val);
  }, [onValidated]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchPredictions = useCallback((input: string) => {
    if (!ready || !serviceRef.current || input.length < 2) {
      setPredictions([]);
      setOpen(false);
      return;
    }
    serviceRef.current.getPlacePredictions(
      { input, componentRestrictions: { country: "re" } },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          setPredictions(results as unknown as Prediction[]);
          setOpen(true);
        } else {
          setPredictions([]);
          setOpen(false);
        }
      }
    );
  }, [ready]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (validated) markValid(false);
    onCoords?.(null);
    setError(null);
    onChange(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPredictions(val), 220);
  };

  const selectPrediction = (pred: Prediction) => {
    if (!placesRef.current) return;
    placesRef.current.getDetails(
      { placeId: pred.place_id, fields: ["formatted_address", "types", "geometry"] },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          const types = place.types ?? [];
          const tooVague = types.some(t =>
            ["locality", "administrative_area_level_1", "administrative_area_level_2", "sublocality", "sublocality_level_1"].includes(t)
          ) && !types.some(t =>
            ["street_address", "route", "establishment", "point_of_interest", "premise", "subpremise", "airport", "lodging", "transit_station", "bus_station", "train_station"].includes(t)
          );

          const addr = place.formatted_address ?? pred.description;
          if (inputRef.current) inputRef.current.value = addr;
          onChange(addr);

          const loc = place.geometry?.location;
          if (loc) {
            onCoords?.({ lat: loc.lat(), lng: loc.lng() });
          }

          if (tooVague) {
            markValid(false);
            setError("Merci de préciser une adresse (rue, hôtel, lieu-dit…) pour une estimation fiable");
          } else {
            markValid(true);
            setError(null);
          }
        } else {
          if (inputRef.current) inputRef.current.value = pred.description;
          onChange(pred.description);
          onCoords?.(null);
          markValid(true);
          setError(null);
        }
        setPredictions([]);
        setOpen(false);
      }
    );
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!validatedRef.current && inputRef.current?.value) {
        setError("Veuillez sélectionner une adresse dans la liste");
      }
    }, 300);
  };

  const geolocate = async () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res  = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&language=fr`
          );
          const data = await res.json();
          const adresse = data.results?.[0]?.formatted_address ?? "";
          if (adresse && inputRef.current) {
            inputRef.current.value = adresse;
            onChange(adresse);
            onCoords?.({ lat: latitude, lng: longitude });
            markValid(true);
            setOpen(false);
          }
        } catch {
          setError("Impossible de récupérer votre position");
        } finally {
          setGeoLoading(false);
        }
      },
      () => {
        setError("Accès à la localisation refusé");
        setGeoLoading(false);
      }
    );
  };

  return (
    <div className="flex flex-col gap-1.5">
      {/* Hidden div for PlacesService */}
      <div ref={dummyRef} className="hidden" />

      {label && <label className="text-xs font-medium text-[#091424]/60 uppercase tracking-wide">{label}</label>}

      <div ref={containerRef} className="relative">
        <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1FA3BA] z-10 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          defaultValue={value}
          onBlur={handleBlur}
          onChange={handleInput}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full bg-[#091424]/4 border rounded-xl pl-9 py-3 text-sm text-[#091424] placeholder-[#091424]/30 focus:outline-none focus:ring-2 transition-all ${
            showGeolocate ? "pr-10" : "pr-4"
          } ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : validated
              ? "border-[#1FA3BA]/50 focus:border-[#1FA3BA] focus:ring-[#1FA3BA]/15"
              : "border-[#091424]/10 focus:border-[#1FA3BA] focus:ring-[#1FA3BA]/15"
          }`}
        />
        {validated && !error && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#1FA3BA]" />
        )}
        {showGeolocate && !validated && (
          <button
            type="button"
            onClick={geolocate}
            disabled={geoLoading}
            title="Utiliser ma position"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#091424]/30 hover:text-[#1FA3BA] transition-colors"
          >
            {geoLoading ? <Loader2 size={15} className="animate-spin" /> : <Locate size={15} />}
          </button>
        )}

        {/* Custom predictions dropdown */}
        {open && predictions.length > 0 && (
          <div className="absolute z-50 top-full mt-1.5 left-0 right-0 bg-white border border-[#091424]/10 rounded-2xl shadow-xl overflow-hidden">
            {predictions.map((pred, idx) => {
              const { commune, rest } = parseSecondary(pred.structured_formatting.secondary_text);
              return (
                <button
                  key={pred.place_id}
                  type="button"
                  onMouseDown={() => selectPrediction(pred)}
                  className={`w-full text-left px-4 py-3 flex gap-3 items-start hover:bg-[#091424]/4 transition-colors ${idx > 0 ? "border-t border-[#091424]/6" : ""}`}
                >
                  <MapPin size={14} className="text-[#1FA3BA] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    {/* Commune — big and visible */}
                    <p className="text-sm font-semibold text-[#091424] leading-snug">{commune}</p>
                    {/* Street — highlighted match */}
                    <p className="text-xs mt-0.5 leading-snug">
                      {highlightMain(
                        pred.structured_formatting.main_text,
                        pred.structured_formatting.main_text_matched_substrings ?? []
                      )}
                      {rest ? <span className="text-[#091424]/30"> · {rest}</span> : null}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
      {showGeolocate && !validated && !error && (
        <button
          type="button"
          onClick={geolocate}
          disabled={geoLoading}
          className="flex items-center gap-1.5 text-xs text-[#1FA3BA] hover:text-[#1FA3BA]/80 transition-colors self-start"
        >
          {geoLoading ? <Loader2 size={12} className="animate-spin" /> : <Locate size={12} />}
          Utiliser ma position actuelle
        </button>
      )}
    </div>
  );
}
