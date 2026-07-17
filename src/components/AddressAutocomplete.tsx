"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Locate, Loader2 } from "lucide-react";
import { loadGoogleMaps } from "@/lib/loadGoogleMaps";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onValidated?: (valid: boolean) => void;
  placeholder?: string;
  showGeolocate?: boolean;
}

export default function AddressAutocomplete({
  label, value, onChange, onValidated, placeholder, showGeolocate = false
}: Props) {
  const inputRef      = useRef<HTMLInputElement>(null);
  const acRef         = useRef<google.maps.places.Autocomplete | null>(null);
  const [ready, setReady]         = useState(false);
  const [validated, setValidated] = useState(!!value);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => { loadGoogleMaps().then(() => setReady(true)); }, []);

  const markValid = useCallback((val: boolean) => {
    setValidated(val);
    onValidated?.(val);
  }, [onValidated]);

  useEffect(() => {
    if (!ready || !inputRef.current) return;

    acRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "re" },
      fields: ["formatted_address", "name", "geometry"],
      types: ["address", "establishment"],
    });

    acRef.current.addListener("place_changed", () => {
      const place = acRef.current?.getPlace();
      const adresse = place?.formatted_address ?? place?.name ?? "";
      if (adresse) {
        onChange(adresse);
        markValid(true);
        setError(null);
      }
    });

    return () => {
      if (acRef.current) window.google.maps.event.clearInstanceListeners(acRef.current);
    };
  }, [ready, onChange, markValid]);

  const handleBlur = () => {
    if (!validated && inputRef.current?.value) {
      setError("Veuillez sélectionner une adresse dans la liste");
    }
  };

  const handleChange = () => {
    if (validated) markValid(false);
    setError(null);
  };

  const geolocate = async () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&language=fr`
          );
          const data = await res.json();
          const adresse = data.results?.[0]?.formatted_address ?? "";
          if (adresse && inputRef.current) {
            inputRef.current.value = adresse;
            onChange(adresse);
            markValid(true);
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
      <label className="text-xs font-medium text-[#091424]/60 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1FA3BA] z-10 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          defaultValue={value}
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full bg-[#F5F4F0] border rounded-xl pl-9 py-3 text-sm text-[#091424] placeholder-[#091424]/30 focus:outline-none focus:ring-2 transition-all ${
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
