import Image from "next/image";
import type { CondominioComp } from "@/lib/content";

/**
 * Capas dos residenciais: imagens do acervo da Alpha DL, ilustrativas.
 * Não são fotos do residencial; a legenda diz isso.
 * `hd: false` marca imagem pequena demais para o topo da página: lá entra a alternativa.
 */
const CAPAS: Record<string, { src: string; alt: string; hd: boolean }> = {
  "aerea-cidade": { src: "/capas/aerea-cidade.webp", alt: "Vista aérea de Alphaville ao entardecer, com lago e prédios ao fundo", hd: true },
  "casa-por-do-sol": { src: "/capas/casa-por-do-sol.webp", alt: "Casa de alto padrão com piscina de borda infinita ao pôr do sol", hd: false },
  "casa-piscina": { src: "/capas/casa-piscina.webp", alt: "Casa moderna de alto padrão com piscina e jardim", hd: true },
  "lounge-piscina": { src: "/capas/lounge-piscina.webp", alt: "Lounge externo com sofás e espelho d'água ao entardecer", hd: true },
  "aerea-lago": { src: "/capas/aerea-lago.webp", alt: "Vista aérea de residencial com lago e áreas verdes ao pôr do sol", hd: true },
};
const ORDEM = Object.keys(CAPAS);

function capaDe(c: CondominioComp) {
  if (c.capa && CAPAS[c.capa]) return CAPAS[c.capa];
  const h = [...c.slug].reduce((a, ch) => a + ch.charCodeAt(0), 0);
  return CAPAS[ORDEM[h % ORDEM.length]];
}

export function CapaResidencial({ c, grande = false, className }: { c: CondominioComp; grande?: boolean; className?: string }) {
  let capa = capaDe(c);
  if (grande && !capa.hd) capa = CAPAS["aerea-cidade"];
  return (
    <div className={`cena capa-res${grande ? " grande" : ""} ${className ?? ""}`}>
      <Image src={capa.src} alt={capa.alt} fill priority={grande} sizes={grande ? "100vw" : "(max-width: 700px) 100vw, 420px"} style={{ objectFit: "cover" }} />
      <span className="credito">Imagem ilustrativa</span>
    </div>
  );
}
