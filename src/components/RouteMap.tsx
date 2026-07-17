"use client";

import { useEffect, useRef } from "react";

interface Props {
  origin: string;
  destination: string;
}

function loadGoogleMaps(): Promise<void> {
  return new Promise((resolve) => {
    if (window.google?.maps) { resolve(); return; }
    const existing = document.getElementById("google-maps-script");
    if (existing) {
      const interval = setInterval(() => {
        if (window.google?.maps) { clearInterval(interval); resolve(); }
      }, 200);
      return;
    }
    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&language=fr&region=RE`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

export default function RouteMap({ origin, destination }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!origin || !destination) return;

    loadGoogleMaps().then(() => {
      if (!mapRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 11,
        center: { lat: -21.0, lng: 55.55 },
        disableDefaultUI: true,
        zoomControl: true,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#f5f4f0" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#091424" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
          { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
          { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#e8e6db" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9e8f0" }] },
          { featureType: "poi", stylers: [{ visibility: "off" }] },
          { featureType: "transit", stylers: [{ visibility: "off" }] },
          { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#091424", opacity: 0.1 }] },
        ],
      });

      const directionsService  = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: "#1FA3BA",
          strokeWeight: 4,
          strokeOpacity: 0.9,
        },
        markerOptions: {
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: "#1FA3BA",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
        },
      });

      directionsService.route(
        {
          origin:      `${origin}, La Réunion`,
          destination: `${destination}, La Réunion`,
          travelMode:  window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            directionsRenderer.setDirections(result);
          }
        }
      );
    });
  }, [origin, destination]);

  return (
    <div
      ref={mapRef}
      className="w-full h-52 lg:h-64 rounded-2xl overflow-hidden border border-[#091424]/8"
    />
  );
}
