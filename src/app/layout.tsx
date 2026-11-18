import type { Metadata, Viewport } from "next";
import { Newsreader, Figtree } from "next/font/google";
import "./globals.css";
import { Cabecalho } from "@/components/Cabecalho";
import { Rodape } from "@/components/Rodape";
import { Analytics } from "@/components/Analytics";
import { WhatsAppFlutuante } from "@/components/WhatsAppFlutuante";
import { RastreioCliques } from "@/components/RastreioCliques";
import { artigos, condominios } from "@/lib/content";
import type { MapaContextos } from "@/lib/contexto-whatsapp";
import { JsonLd } from "@/components/JsonLd";
import { ldOrganizacao, ldWebsite } from "@/lib/seo";
import { site } from "@/lib/site";
import { ICONES, IMAGEM_SOCIAL } from "@/lib/marca";

// Títulos: Newsreader, serifa editorial desenhada para leitura em tela. Texto: Figtree, sans de x-altura alta e boa leitura longa.
const display = Newsreader({ subsets: ["latin"], weight: ["400", "500"], style: ["normal", "italic"], variable: "--fonte-display", display: "swap" });
const texto = Figtree({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--fonte-texto", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.nome}: morar, comprar e alugar em Alphaville`, template: `%s | ${site.nome}` },
  description: site.descricao,
  applicationName: site.nome,
  openGraph: { siteName: site.nome, locale: "pt_BR", type: "website", images: [IMAGEM_SOCIAL] },
  twitter: { card: "summary_large_image", images: [IMAGEM_SOCIAL] },
  icons: ICONES,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#0E100F", width: "device-width", initialScale: 1 };

/** Título de cada artigo e nome de cada residencial, para a barra do WhatsApp falar da página certa. */
function mapaContextos(): MapaContextos {
  const mapa: MapaContextos = {};
  for (const a of artigos()) mapa[`/${a.pilar}/${a.slug}`] = { tipo: "artigo", titulo: a.titulo, pilar: a.pilar };
  for (const c of condominios()) mapa[`/condominios/${c.slug}`] = { tipo: "residencial", nome: c.nome };
  return mapa;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${texto.variable}`}>
      <body>
        <a className="pular" href="#conteudo">
          Pular para o conteúdo
        </a>
        <div className="pagina">
          <Cabecalho />
          <main id="conteudo">{children}</main>
        </div>
        <Rodape />
        <JsonLd dados={[ldOrganizacao(), ldWebsite()]} />
        <WhatsAppFlutuante numero={site.whatsapp} mapa={mapaContextos()} />
        <RastreioCliques />
        <Analytics gaId={site.gaId} />
      </body>
    </html>
  );
}
