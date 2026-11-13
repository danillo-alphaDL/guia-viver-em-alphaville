"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/track";

const fmt = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const num = (v: string) => parseFloat(v.replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, "")) || 0;
const CORES = ["#C2A878", "#8C7A5C", "#ECEAE4", "#6E736E", "#3A3F3B"];

type Modo = "alugar" | "comprar";
const EXEMPLO = { alugar: "30.000", comprar: "9.500.000" };

export function CustoCalculadora() {
  const [modo, setModo] = useState<Modo>("alugar");
  const [v, setV] = useState({ principal: EXEMPLO.alugar, cond: "2.400", iptu: "18.000", manut: "1.200", outros: "4.000" });
  const iniciado = useRef(false);

  const itens = useMemo(() => {
    const l: [string, number][] = [
      ["Condomínio", num(v.cond)],
      ["IPTU", num(v.iptu) / 12],
      ["Manutenção", num(v.manut)],
      ["Outras despesas", num(v.outros)],
    ];
    return modo === "alugar" ? ([["Aluguel", num(v.principal)], ...l] as [string, number][]) : l;
  }, [v, modo]);
  const total = itens.reduce((s, i) => s + i[1], 0);

  function muda(campo: keyof typeof v, valor: string) {
    if (!iniciado.current) {
      iniciado.current = true;
      track("tool_start", { tool: "custo-de-morar" });
    }
    setV((a) => ({ ...a, [campo]: valor }));
  }
  const formata = (campo: keyof typeof v) => setV((a) => ({ ...a, [campo]: num(a[campo]) ? num(a[campo]).toLocaleString("pt-BR") : "" }));

  const Campo = ({ id, rotulo, ajuda }: { id: keyof typeof v; rotulo: string; ajuda: string }) => (
    <label htmlFor={`custo-${id}`}>
      <span>{rotulo}</span>
      <span className="campo-in">
        <span>R$</span>
        <input id={`custo-${id}`} inputMode="numeric" value={v[id]} onChange={(e) => muda(id, e.target.value)} onBlur={() => formata(id)} />
      </span>
      <small>{ajuda}</small>
    </label>
  );

  return (
    <div className="ferr">
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="seg-claro" role="group" aria-label="Modalidade">
          {(["alugar", "comprar"] as Modo[]).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={modo === m}
              onClick={() => {
                setModo(m);
                setV((a) => ({ ...a, principal: EXEMPLO[m] }));
              }}
            >
              {m === "alugar" ? "Alugar" : "Comprar"}
            </button>
          ))}
        </div>
        {Campo({
          id: "principal",
          rotulo: modo === "alugar" ? "Aluguel mensal" : "Valor do imóvel",
          ajuda: modo === "alugar" ? "Valor do contrato, sem condomínio e IPTU." : "Referência para ITBI e financiamento (próxima versão).",
        })}
        {Campo({ id: "cond", rotulo: "Condomínio mensal", ajuda: "Peça o último boleto ao proprietário ou à imobiliária." })}
        {Campo({ id: "iptu", rotulo: "IPTU anual", ajuda: "Consulte o carnê do imóvel na prefeitura." })}
        {Campo({ id: "manut", rotulo: "Manutenção mensal", ajuda: "Jardim, piscina e pequenos reparos. Estimativa sua." })}
        {Campo({ id: "outros", rotulo: "Outras despesas mensais", ajuda: "Energia, água, funcionários, seguro." })}
      </form>
      <div className="resultado" aria-live="polite">
        <span className="rot dourado">Custo mensal estimado</span>
        <p className="grande num">{fmt.format(total)}</p>
        <p className="num sec-txt">{fmt.format(total * 12)} por ano</p>
        <div className="barra" aria-hidden="true">
          {itens.map((it, i) => (
            <i key={it[0]} style={{ width: `${total ? (it[1] / total) * 100 : 0}%`, background: CORES[i + (modo === "comprar" ? 1 : 0)] }} />
          ))}
        </div>
        <div className="legenda">
          {itens.map((it, i) => (
            <div key={it[0]}>
              <b style={{ background: CORES[i + (modo === "comprar" ? 1 : 0)] }} />
              <span>{it[0]}</span>
              <span className="num">{fmt.format(it[1])}</span>
            </div>
          ))}
        </div>
        <p className="nota">
          {modo === "comprar"
            ? "Na compra, o total mostra os custos recorrentes de manter a casa. Financiamento, ITBI e escritura entram na próxima versão, com premissas declaradas. "
            : ""}
          Os valores iniciais são exemplos para você substituir, não dados de mercado. Nada do que você digita sai do seu navegador.
        </p>
        <div className="resultado-cta">
          <Link
            className="btn cheio"
            href={`/selecao-personalizada?origem=custo-de-morar&orcamento=${Math.round(total)}&modo=${modo}`}
            onClick={() => track("tool_complete", { tool: "custo-de-morar", total: Math.round(total) })}
          >
            Receber casas dentro deste orçamento
          </Link>
          <small>Opcional. O resultado continua aqui, sem cadastro.</small>
        </div>
      </div>
    </div>
  );
}
