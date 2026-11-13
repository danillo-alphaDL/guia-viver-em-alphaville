import type { Dado } from "@/lib/schema";

const fmtData = (d?: string) => (d ? d.slice(5, 7) + "/" + d.slice(0, 4) : "");

export function Selo({ dado }: { dado: Dado }) {
  if (dado.estado === "verificado")
    return (
      <span className="selo ver" title={`Verificado em ${dado.data}${dado.fonte ? ` · fonte: ${dado.fonte}` : ""}`}>
        {dado.fonte} · {fmtData(dado.data)}
      </span>
    );
  if (dado.estado === "estimativa") return <span className="selo est" title={dado.metodo}>Estimativa · {dado.metodo}</span>;
  return <span className="selo pend">Em apuração</span>;
}

/** Valor com proveniência. Dado "a verificar" nunca mostra valor ao público. */
export function ValorDado({ dado }: { dado?: Dado }) {
  if (!dado || dado.estado === "a-verificar" || !dado.valor) return <span className="valor-vazio">—</span>;
  return dado.url ? (
    <a href={dado.url} target="_blank" rel="noopener noreferrer">
      {dado.valor}
    </a>
  ) : (
    <>{dado.valor}</>
  );
}
