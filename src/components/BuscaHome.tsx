"use client";

import { useState } from "react";
import { track } from "@/lib/track";

type Faixa = { rotulo: string; pmin?: number; pmax?: number };

const VENDA: Faixa[] = [
  { rotulo: "Qualquer valor" },
  { rotulo: "Até R$ 3 milhões", pmax: 3_000_000 },
  { rotulo: "De R$ 3 a 5 milhões", pmin: 3_000_000, pmax: 5_000_000 },
  { rotulo: "De R$ 5 a 8 milhões", pmin: 5_000_000, pmax: 8_000_000 },
  { rotulo: "De R$ 8 a 12 milhões", pmin: 8_000_000, pmax: 12_000_000 },
  { rotulo: "Acima de R$ 12 milhões", pmin: 12_000_000, pmax: 1_000_000_000 },
];
const LOCACAO: Faixa[] = [
  { rotulo: "Qualquer valor" },
  { rotulo: "Até R$ 20 mil/mês", pmax: 20_000 },
  { rotulo: "De R$ 20 a 40 mil/mês", pmin: 20_000, pmax: 40_000 },
  { rotulo: "Acima de R$ 40 mil/mês", pmin: 40_000, pmax: 10_000_000 },
];

/** Busca que abre o catálogo da Alpha DL já filtrado. */
export function BuscaHome() {
  const [fin, setFin] = useState<"venda" | "locacao">("venda");
  const faixas = fin === "venda" ? VENDA : LOCACAO;

  function buscar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const faixa = faixas[Number(f.get("faixa")) || 0];
    const q = new URLSearchParams({ fin, tipo: "casa" });
    const regiao = String(f.get("regiao") || "");
    const dorm = String(f.get("dorm") || "");
    if (regiao) q.set("regiao", regiao);
    if (dorm) q.set("dorm", dorm);
    if (faixa.pmin) q.set("pmin", String(faixa.pmin));
    if (faixa.pmax) q.set("pmax", String(faixa.pmax));
    q.set("utm_source", "guiaviveremalphaville");
    q.set("utm_medium", "referral");
    q.set("utm_campaign", "home");
    q.set("utm_content", "busca");
    const url = `https://www.alphadl.com.br/imoveis?${q.toString()}`;
    track("outbound_alphadl", { cta_id: "home-busca", destination: "https://www.alphadl.com.br/imoveis" });
    window.open(url, "_blank", "noopener");
  }

  return (
    <form className="busca" onSubmit={buscar} aria-label="Buscar casas">
      <div className="seg" role="group" aria-label="Objetivo">
        <button type="button" aria-pressed={fin === "venda"} onClick={() => setFin("venda")}>
          Comprar
        </button>
        <button type="button" aria-pressed={fin === "locacao"} onClick={() => setFin("locacao")}>
          Alugar
        </button>
      </div>
      <label htmlFor="b-regiao">
        Região
        <select id="b-regiao" name="regiao" defaultValue="">
          <option value="">Alphaville e Tamboré</option>
          <option value="Alphaville">Alphaville</option>
          <option value="Tamboré">Tamboré</option>
          <option value="Aldeia da Serra">Aldeia da Serra</option>
        </select>
      </label>
      <label htmlFor="b-faixa">
        {fin === "venda" ? "Investimento" : "Aluguel"}
        <select id="b-faixa" name="faixa" defaultValue="0" key={fin}>
          {faixas.map((x, i) => (
            <option key={x.rotulo} value={i}>
              {x.rotulo}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor="b-dorm">
        Quartos
        <select id="b-dorm" name="dorm" defaultValue="">
          <option value="">Qualquer</option>
          <option value="3">3 ou mais</option>
          <option value="4">4 ou mais</option>
          <option value="5">5 ou mais</option>
        </select>
      </label>
      <button className="btn cheio" type="submit">
        Ver casas
      </button>
    </form>
  );
}
