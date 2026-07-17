let promise: Promise<void> | null = null;

export function loadGoogleMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps?.places) return Promise.resolve();

  if (!promise) {
    promise = new Promise((resolve) => {
      if (document.getElementById("google-maps-script")) {
        const interval = setInterval(() => {
          if (window.google?.maps?.places) { clearInterval(interval); resolve(); }
        }, 100);
        return;
      }
      const script = document.createElement("script");
      script.id  = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&language=fr&region=RE`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  return promise;
}
