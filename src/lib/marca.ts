/**
 * Identidade visual do Guia (kit em public/branding/, instruções em docs/branding/).
 * Fonte única dos ícones e da imagem de compartilhamento, usada pelo layout, por meta() e pelo manifesto.
 */
export const IMAGEM_SOCIAL = {
  url: "/branding/og-image-1200x630.jpg",
  width: 1200,
  height: 630,
  alt: "Guia Viver em Alphaville: moradia, estilo de vida e oportunidades",
  type: "image/jpeg",
} as const;

export const ICONES = {
  icon: [
    { url: "/favicon.ico", sizes: "48x48" },
    { url: "/branding/icone-32x32.png", sizes: "32x32", type: "image/png" },
    { url: "/branding/icone-16x16.png", sizes: "16x16", type: "image/png" },
    { url: "/branding/icone-192x192.png", sizes: "192x192", type: "image/png" },
  ],
  apple: [{ url: "/branding/icone-180x180.png", sizes: "180x180", type: "image/png" }],
};

/** Cor de fundo da arte do kit (preto azulado), usada no manifesto e na barra do navegador. */
export const COR_FUNDO_MARCA = "#01020E";
