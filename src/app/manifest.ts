import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { COR_FUNDO_MARCA } from "@/lib/marca";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.nome,
    short_name: site.nomeCurto,
    description: site.descricao,
    lang: "pt-BR",
    start_url: "/",
    display: "standalone",
    background_color: COR_FUNDO_MARCA,
    theme_color: COR_FUNDO_MARCA,
    icons: [
      { src: "/branding/icone-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/branding/icone-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
