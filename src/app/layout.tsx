import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { Cabecalho } from "@/components/Cabecalho";
import { Rodape } from "@/components/Rodape";
import { Analytics } from "@/components/Analytics";
import { JsonLd } from "@/components/JsonLd";
import { ldOrganizacao, ldWebsite } from "@/lib/seo";
import { site } from "@/lib/site";

const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500"], style: ["normal", "italic"], variable: "--fonte-display", display: "swap" });
const texto = Jost({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--fonte-texto", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.nome}: morar, comprar e alugar em Alphaville`, template: `%s | ${site.nome}` },
  description: site.descricao,
  applicationName: site.nome,
  openGraph: { siteName: site.nome, locale: "pt_BR", type: "website" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#0E100F", width: "device-width", initialScale: 1 };

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
        <Analytics gaId={site.gaId} />
      </body>
    </html>
  );
}
