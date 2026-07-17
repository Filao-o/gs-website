"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

declare global {
  interface Window {
    google: typeof google;
    initGoogleMaps?: () => void;
  }
}

export default function AddressAutocomplete({ label, value, onChange, placeholder }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.google?.maps?.places) {
      setReady(true);
      return;
    }

    if (document.getElementById("google-maps-script")) {
      const interval = setInterval(() => {
        if (window.google?.maps?.places) {
          setReady(true);
          clearInterval(interval);
        }
      }, 200);
      return () => clearInterval(interval);
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&language=fr&region=RE`;
    script.async = true;
    script.defer = true;
    script.onload = () => setReady(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!ready || !inputRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "re" },
      fields: ["formatted_address", "name"],
      types: ["geocode", "establishment"],
    });

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      const adresse = place?.formatted_address ?? place?.name ?? "";
      onChange(adresse);
    });

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [ready, onChange]);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-[#091424]/60 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1FA3BA] z-10 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          defaultValue={value}
          onBlur={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#F5F4F0] border border-[#091424]/10 rounded-xl pl-9 pr-4 py-3 text-sm text-[#091424] placeholder-[#091424]/30 focus:outline-none focus:border-[#1FA3BA] focus:ring-2 focus:ring-[#1FA3BA]/15 transition-all"
        />
      </div>
    </div>
  );
}
