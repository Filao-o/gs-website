import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "GS Transport — Chauffeur Privé à La Réunion";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#091424",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Subtle grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(31,163,186,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(31,163,186,0.06) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Teal accent line top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            backgroundColor: "#1FA3BA",
          }}
        />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "24px" }}>
          <span style={{ fontSize: "100px", fontWeight: "700", color: "#1FA3BA", lineHeight: 1 }}>
            GS
          </span>
          <span style={{ fontSize: "36px", fontWeight: "300", color: "#ffffff", letterSpacing: "0.25em", textTransform: "uppercase" }}>
            Transport
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "22px",
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "40px",
          }}
        >
          Chauffeur Privé · La Réunion
        </div>

        {/* Separator */}
        <div style={{ width: "60px", height: "2px", backgroundColor: "#1FA3BA", marginBottom: "40px" }} />

        {/* CTA */}
        <div
          style={{
            fontSize: "18px",
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.05em",
          }}
        >
          gstransport.re
        </div>
      </div>
    ),
    { ...size }
  );
}
