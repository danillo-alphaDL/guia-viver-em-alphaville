"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FAIXAS, PRAZOS } from "@/lib/lead";
import { track } from "@/lib/track";

type Estado = { tipo: "parado" } | { tipo: "enviando" } | { tipo: "ok" } | { tipo: "erro"; msg: string };

export function FormularioLead({ residenciais, whatsapp }: { residenciais: string[]; whatsapp: string }) {
  const [estado, setEstado] = useState<Estado>({ tipo: "parado" });
  const [origem, setOrigem] = useState("");
  const [utm, setUtm] = useState<Record<string, string>>({});
  const [faixaInicial, setFaixaInicial] = useState<string>("");
  const [objetivoInicial, setObjetivoInicial] = useState("comprar");
  const iniciou = useRef(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setOrigem(q.get("origem") || document.referrer || "");
    const u: Record<string, string> = {};
    q.forEach((v, k) => {
      if (k.startsWith("utm_")) u[k] = v;
    });
    setUtm(u);
    const obj = q.get("objetivo") || q.get("modo");
    if (obj === "alugar" || obj === "comprar" || obj === "investir") setObjetivoInicial(obj);
    const fx = q.get("faixa");
    if (fx && (FAIXAS as readonly string[]).includes(fx)) setFaixaInicial(fx);
    const orc = Number(q.get("orcamento"));
    if (q.get("modo") === "alugar" && orc) setFaixaInicial(orc <= 20000 ? FAIXAS[5] : orc <= 40000 ? FAIXAS[6] : FAIXAS[7]);
  }, []);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const corpo = {
      objetivo: f.get("objetivo"),
      faixa: f.get("faixa"),
      prazo: f.get("prazo"),
      interesse: f.getAll("interesse").join(", "),
      quartos: f.get("quartos") || "",
      observacoes: f.get("observacoes") || "",
      nome: f.get("nome"),
      email: f.get("email") || "",
      whatsapp: f.get("whatsapp") || "",
      consentimento: f.get("consentimento") === "on",
      origem,
      utm,
      site: f.get("site") || "",
    };
    setEstado({ tipo: "enviando" });
    try {
      const r = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corpo) });
      const j = await r.json();
      if (!r.ok || !j.ok) return setEstado({ tipo: "erro", msg: j.erro || "Não foi possível enviar." });
      track("form_submit", { form: "selecao-personalizada", origem });
      setEstado({ tipo: "ok" });
    } catch {
      setEstado({ tipo: "erro", msg: "Sem conexão. Verifique a internet e tente de novo." });
    }
  }

  if (estado.tipo === "ok")
    return (
      <div className="form-ok" role="status">
        <span className="rot bronze">Recebido</span>
        <h2>Obrigado. Um especialista da Alpha DL vai entrar em contato.</h2>
        <p>Enquanto isso, continue explorando os guias dos residenciais.</p>
        <Link className="link-seta" href="/condominios">
          Ver residenciais
        </Link>
      </div>
    );

  return (
    <form
      className="form lead"
      onSubmit={enviar}
      onFocus={() => {
        if (!iniciou.current) {
          iniciou.current = true;
          track("form_start", { form: "selecao-personalizada" });
        }
      }}
    >
      <fieldset>
        <legend>O que você procura</legend>
        <div className="opcoes" key={objetivoInicial}>
          {[
            ["comprar", "Comprar"],
            ["alugar", "Alugar"],
            ["investir", "Investir"],
          ].map(([v, n]) => (
            <label key={v} className="opcao">
              <input type="radio" name="objetivo" value={v} defaultChecked={v === objetivoInicial} required /> {n}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grade-2">
        <label htmlFor="lead-faixa">
          <span>Faixa de investimento</span>
          <select id="lead-faixa" name="faixa" required key={faixaInicial} defaultValue={faixaInicial || FAIXAS[1]}>
            {FAIXAS.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </label>
        <label htmlFor="lead-prazo">
          <span>Prazo para mudar</span>
          <select id="lead-prazo" name="prazo" required defaultValue={PRAZOS[2]}>
            {PRAZOS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
      </div>
      {residenciais.length > 0 && (
        <fieldset>
          <legend>Residenciais de interesse (opcional)</legend>
          <div className="opcoes">
            {residenciais.map((r) => (
              <label key={r} className="opcao">
                <input type="checkbox" name="interesse" value={r} /> {r}
              </label>
            ))}
            <label className="opcao">
              <input type="checkbox" name="interesse" value="Ainda não sei" /> Ainda não sei
            </label>
          </div>
        </fieldset>
      )}
      <div className="grade-2">
        <label htmlFor="lead-quartos">
          <span>Suítes (opcional)</span>
          <select id="lead-quartos" name="quartos" defaultValue="">
            <option value="">Indiferente</option>
            <option>3</option>
            <option>4</option>
            <option>5 ou mais</option>
          </select>
        </label>
        <label htmlFor="lead-nome">
          <span>Seu nome</span>
          <input id="lead-nome" name="nome" autoComplete="name" required minLength={2} />
        </label>
      </div>
      <div className="grade-2">
        <label htmlFor="lead-email">
          <span>E-mail</span>
          <input id="lead-email" name="email" type="email" autoComplete="email" />
        </label>
        <label htmlFor="lead-whats">
          <span>WhatsApp</span>
          <input id="lead-whats" name="whatsapp" type="tel" autoComplete="tel" placeholder="(11) 90000-0000" />
        </label>
      </div>
      <small className="sec-txt">Preencha e-mail ou WhatsApp. Basta um dos dois.</small>
      <label htmlFor="lead-obs">
        <span>Algo mais que devemos saber? (opcional)</span>
        <textarea id="lead-obs" name="observacoes" rows={3} maxLength={1500} />
      </label>
      <div className="hp" aria-hidden="true">
        <label htmlFor="lead-site">Não preencha</label>
        <input id="lead-site" name="site" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="opcao consentimento-lgpd" htmlFor="lead-ok">
        <input id="lead-ok" type="checkbox" name="consentimento" required />
        <span>
          Autorizo a Alpha DL a usar estes dados para me contatar sobre imóveis, conforme a <Link href="/privacidade">política de privacidade</Link>. Posso
          revogar quando quiser.
        </span>
      </label>
      {estado.tipo === "erro" && (
        <p className="form-erro" role="alert">
          {estado.msg}
          {whatsapp && (
            <>
              {" "}
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener">
                Abrir WhatsApp
              </a>
            </>
          )}
        </p>
      )}
      <button className="btn tinta" type="submit" disabled={estado.tipo === "enviando"}>
        {estado.tipo === "enviando" ? "Enviando…" : "Receber minha seleção"}
      </button>
    </form>
  );
}
