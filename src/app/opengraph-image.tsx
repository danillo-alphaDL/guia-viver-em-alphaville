import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = site.nome;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(180deg,#0b1220 0%,#1f2e44 55%,#7a634f 90%,#d9a56a 100%)", color: "#ECEAE4" }}>
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 10, color: "#C2A878" }}>GUIA</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 92, lineHeight: 1.05 }}>Viver em Alphaville</div>
          <div style={{ display: "flex", fontSize: 30, marginTop: 24, color: "#ECEAE4", opacity: 0.85 }}>Morar, comprar e alugar casas de alto padrão</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 4 }}>
          <span>{site.dominio}</span>
          <span style={{ color: "#C2A878" }}>CURADORIA ALPHA DL</span>
        </div>
      </div>
    ),
    size,
  );
}
