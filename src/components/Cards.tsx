import Link from "next/link";
import { Cena } from "./Cena";
import type { Artigo, CondominioComp } from "@/lib/content";
import { pilares } from "@/lib/site";

const dataBR = (d: string | null) =>
  d ? new Date(d + "T12:00:00").toLocaleDateString("pt-BR", { month: "short", year: "numeric" }).replace(".", "") : "";

export function CardArtigo({ a }: { a: Artigo }) {
  return (
    <Link className="materia" href={a.url}>
      <Cena nome={a.cena} credito={false} />
      <span className="rot bronze">
        {pilares[a.pilar].menu}
        {a.rascunho && " · rascunho"}
      </span>
      <h3>{a.titulo}</h3>
      <p>
        {a.minutos} min de leitura
        {(a.atualizadoEm || a.publicadoEm) && ` · ${a.atualizadoEm ? "atualizado em" : "publicado em"} ${dataBR(a.atualizadoEm || a.publicadoEm)}`}
      </p>
    </Link>
  );
}

export function CardCondominio({ c, destaque }: { c: CondominioComp; destaque?: boolean }) {
  const municipio = c.campos.municipio?.estado === "verificado" ? c.campos.municipio.valor : c.regiao === "tambore" ? "Tamboré" : "Alphaville";
  return (
    <Link className={`cond${destaque ? " destaque" : ""}`} href={c.url}>
      <Cena nome={c.cena} credito={false} />
      <div className="info">
        <div>
          <span className="rot dourado">
            {municipio}
            {c.rascunho && " · rascunho"}
          </span>
          <h3>{c.nome}</h3>
        </div>
        <span className="ver">Ver o guia →</span>
      </div>
    </Link>
  );
}

export { dataBR };
