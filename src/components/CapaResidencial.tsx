import { useId } from "react";
import { svgPlanta, VIEWBOX_PLANTA, type ParametrosPlanta } from "@/lib/planta";
import type { CondominioComp } from "@/lib/content";

const valor = (c: CondominioComp, k: keyof CondominioComp["campos"]) => {
  const d = c.campos[k];
  return d && d.valor && (d.estado === "verificado" || d.estado === "estimativa") ? d.valor : "";
};

/** Parâmetros da planta a partir dos dados conferidos da ficha. */
export function parametrosDe(c: CondominioComp): ParametrosPlanta {
  const lotes = Number(valor(c, "lotes").match(/^[\d.]+/)?.[0]?.replace(/\./g, "")) || undefined;
  const verdePct = Number(`${valor(c, "lotes")} ${valor(c, "clube")} ${c.resumo}`.match(/(\d+)% da área|(\d+)% de vegeta/)?.slice(1).find(Boolean));
  const mun = valor(c, "municipio");
  const ano = Number(valor(c, "implantacao").match(/\d{4}/)?.[0]);
  const partes = mun.replace(/\s*\([^)]*\)/g, "").split(/\s+e\s+/);
  return {
    semente: c.slug,
    lotes,
    verde: verdePct ? verdePct / 100 : undefined,
    lago: /\blago\b/i.test(`${c.resumo} ${valor(c, "clube")}`),
    clube: !!valor(c, "clube"),
    divisa: partes.length === 2 ? [partes[0], partes[1]] : undefined,
    antigo: !!ano && ano < 1985,
  };
}

/** Número ou sigla do residencial, usado como marca na capa. */
export function siglaDe(nome: string) {
  const m = nome.match(/(?:Residencial|Tamboré|Valville)\s+(\d+|Zero|[IVX]+)$/i) || nome.match(/\s([IVX]+)$/);
  if (m) return m[1].toLowerCase() === "zero" ? "0" : m[1];
  return nome
    .split(/\s+/)
    .filter((p) => /^[A-ZÁÉÍÓÚÂÊÔ]/.test(p))
    .map((p) => p[0])
    .join("")
    .slice(0, 2);
}

export function CapaResidencial({ c, grande = false, className }: { c: CondominioComp; grande?: boolean; className?: string }) {
  const id = "p" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const p = parametrosDe(c);
  return (
    <div className={`cena capa-res${grande ? " grande" : ""} ${className ?? ""}`}>
      <svg viewBox={VIEWBOX_PLANTA} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: svgPlanta(p, id) }} />
      <span className="capa-sigla" aria-hidden="true">
        {siglaDe(c.nome)}
      </span>
      {p.divisa && (
        <span className="capa-divisa" aria-hidden="true">
          <span>{p.divisa[0]}</span>
          <span>{p.divisa[1]}</span>
        </span>
      )}
      <span className="credito">Planta ilustrativa, fora de escala</span>
    </div>
  );
}
