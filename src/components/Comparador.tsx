"use client";

import { useState } from "react";
import Link from "next/link";
import { Selo, ValorDado } from "./Selo";
import type { Dado } from "@/lib/schema";
import { track } from "@/lib/track";

type Item = { slug: string; nome: string; url: string; campos: Partial<Record<string, Dado>> };
type Criterio = { id: string; nome: string; campos: string[] };

const CRITERIOS: Criterio[] = [
  { id: "espaco", nome: "Espaço", campos: ["loteTipico", "lotes"] },
  { id: "custo", nome: "Custo mensal", campos: ["taxaCondominial"] },
  { id: "preco", nome: "Preço", campos: ["faixaPreco", "faixaAluguel"] },
  { id: "mobilidade", nome: "Mobilidade", campos: ["acessoSaoPaulo"] },
  { id: "lazer", nome: "Lazer", campos: ["clube"] },
];

export function Comparador({ itens, rotulos }: { itens: Item[]; rotulos: Record<string, string> }) {
  const [sel, setSel] = useState<string[]>(itens.slice(0, 3).map((i) => i.slug));
  const [foco, setFoco] = useState<string[]>(["espaco", "custo"]);
  const escolhidos = sel.map((s) => itens.find((i) => i.slug === s)).filter(Boolean) as Item[];
  const camposFoco = new Set(CRITERIOS.filter((c) => foco.includes(c.id)).flatMap((c) => c.campos));

  if (itens.length < 2)
    return (
      <div className="vazio">
        <p>O comparador abre quando houver pelo menos dois residenciais com ficha verificada publicada. Estamos apurando os dados.</p>
        <Link className="link-seta" href="/selecao-personalizada?origem=comparador">
          Peça uma comparação a um especialista
        </Link>
      </div>
    );

  return (
    <div className="comparador">
      <div className="criterios" role="group" aria-label="O que importa para você">
        {CRITERIOS.map((c) => (
          <button
            key={c.id}
            type="button"
            className="chip"
            aria-pressed={foco.includes(c.id)}
            onClick={() => setFoco((f) => (f.includes(c.id) ? f.filter((x) => x !== c.id) : [...f, c.id]))}
          >
            {c.nome}
          </button>
        ))}
      </div>
      <div className="seletores">
        {[0, 1, 2].map((n) => (
          <label key={n} htmlFor={`comp-${n}`}>
            <span className="rot">Residencial {n + 1}</span>
            <select
              id={`comp-${n}`}
              value={sel[n] ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setSel((s) => {
                  const novo = [...s];
                  novo[n] = v;
                  return novo.filter(Boolean);
                });
                track("tool_start", { tool: "comparador" });
              }}
            >
              <option value="">{n < 2 ? "Escolha" : "Nenhum"}</option>
              {itens.map((i) => (
                <option key={i.slug} value={i.slug}>
                  {i.nome}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className="tabela-box">
        <table className="comp">
          <thead>
            <tr>
              <th scope="col">Critério</th>
              {escolhidos.map((i) => (
                <th key={i.slug} scope="col">
                  <Link href={i.url}>{i.nome}</Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(rotulos).map(([campo, nome]) => (
              <tr key={campo} className={camposFoco.has(campo) ? "foco" : undefined}>
                <td>{nome}</td>
                {escolhidos.map((i) => {
                  const d = i.campos[campo];
                  return (
                    <td key={i.slug}>
                      <ValorDado dado={d} />
                      {d && (
                        <>
                          <br />
                          <Selo dado={d} />
                        </>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
