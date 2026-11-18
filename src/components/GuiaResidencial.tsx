import Link from "next/link";
import { Cena } from "./Cena";
import { CapaResidencial } from "./CapaResidencial";
import { Migalha } from "./Migalha";
import { JsonLd } from "./JsonLd";
import { AvisoRascunho } from "./Rascunho";
import { CardCondominio, dataBR } from "./Cards";
import { LinkRastreado } from "./LinkRastreado";
import { condominios, type CondominioComp } from "@/lib/content";
import { CAMPOS_CONDOMINIO, type CampoCondominio, type Dado } from "@/lib/schema";
import { ldCondominio, ldFaq } from "@/lib/seo";
import { caminhoResidencialAlphaDL, imoveisDoResidencial, linkAlphaDL, linkWhatsApp } from "@/lib/alphadl";

const mesAno = (d?: string) =>
  d ? new Date(d + "T12:00:00").toLocaleDateString("pt-BR", { month: "short", year: "numeric" }).replace(".", "") : "";

const ok = (d?: Dado) => (d && d.estado === "verificado" && d.valor ? d : undefined);

/** Linha de fonte discreta, no lugar do selo colorido. */
function Fonte({ d }: { d: Dado }) {
  if (d.estado === "estimativa")
    return (
      <span className="res-fonte">
        <span aria-hidden="true">≈</span> Estimativa: {d.metodo}
      </span>
    );
  return (
    <span className="res-fonte" title={d.fonte}>
      <span aria-hidden="true">✓</span> {d.fonte} · {mesAno(d.data)}
    </span>
  );
}

/** Destaques curtos para o topo, só com o que foi verificado. */
function destaques(c: CondominioComp) {
  const out: string[] = [];
  const lotes = ok(c.campos.lotes);
  const impl = ok(c.campos.implantacao);
  const mun = ok(c.campos.municipio);
  const clube = ok(c.campos.clube);
  if (lotes) out.push(`${lotes.valor!.match(/^[\d.]+/)?.[0] ?? lotes.valor} lotes`);
  if (impl) out.push(`Desde ${impl.valor!.match(/\d{4}/)?.[0] ?? impl.valor}`);
  if (mun) out.push(mun.valor!.replace(/\s*\([^)]*\)/g, ""));
  if (clube) out.push("Lazer interno");
  return out;
}

const ARTIGO_MUNICIPIO = [
  { titulo: "ITBI em Barueri e Santana de Parnaíba", caminho: "/itbi-barueri-santana-de-parnaiba" },
  { titulo: "IPTU em Barueri e Santana de Parnaíba", caminho: "/iptu-em-barueri-e-santana-de-parnaiba" },
];

function perguntas(c: CondominioComp) {
  const f: { pergunta: string; resposta: string }[] = [];
  const mun = ok(c.campos.municipio);
  const lotes = ok(c.campos.lotes);
  const impl = ok(c.campos.implantacao);
  const assoc = ok(c.campos.associacao);
  const clube = ok(c.campos.clube);
  if (mun)
    f.push({
      pergunta: `Em que cidade fica o ${c.nome}?`,
      resposta: `${mun.valor}. O município define o IPTU, o ITBI pago na compra e o cartório onde o imóvel é registrado. Fonte: ${mun.fonte}.`,
    });
  if (lotes) f.push({ pergunta: `Quantos lotes tem o ${c.nome}?`, resposta: `${lotes.valor}. Fonte: ${lotes.fonte}.` });
  if (impl) f.push({ pergunta: `Quando o ${c.nome} foi implantado?`, resposta: `${impl.valor}. Fonte: ${impl.fonte}.` });
  if (assoc) f.push({ pergunta: `Quem administra o ${c.nome}?`, resposta: `${assoc.valor}. Fonte: ${assoc.fonte}.` });
  if (clube) f.push({ pergunta: `O ${c.nome} tem lazer interno?`, resposta: `Sim: ${clube.valor}. Fonte: ${clube.fonte}.` });
  f.push({
    pergunta: `Como encontrar casas à venda no ${c.nome}?`,
    resposta: `A Alpha DL, imobiliária que mantém este guia, apresenta as casas à venda no ${c.nome}, inclusive as que não estão anunciadas, com visita acompanhada por um corretor.`,
  });
  return f;
}

export async function GuiaResidencial({ c }: { c: CondominioComp }) {
  const casas = await imoveisDoResidencial(c.nome);
  const qtdCasas = casas.filter((i) => i.tipo === "casa").length;
  const caminhoAlpha = caminhoResidencialAlphaDL(c.slug);
  const linkResidencial = linkAlphaDL(caminhoAlpha, { campanha: "condominios", conteudo: c.slug });
  const whats = linkWhatsApp(`Olá! Vi o guia do ${c.nome} no Guia Viver em Alphaville e quero conhecer as casas disponíveis.`);
  const campos = Object.keys(CAMPOS_CONDOMINIO) as CampoCondominio[];
  const temValor = (d?: Dado) => !!d && !!d.valor && (d.estado === "verificado" || d.estado === "estimativa");
  const verificados = campos.filter((k) => temValor(c.campos[k]));
  const faltando = campos.filter((k) => !temValor(c.campos[k])).map((k) => CAMPOS_CONDOMINIO[k].toLowerCase());
  const chips = destaques(c);
  const faq = perguntas(c);
  const outros = condominios().filter((o) => o.slug !== c.slug && !o.rascunho).slice(0, 3);
  const mun = ok(c.campos.municipio)?.valor ?? "";
  const doisMunicipios = /barueri/i.test(mun) && /parna[ií]ba/i.test(mun);

  return (
    <>
      {c.rascunho && <AvisoRascunho status={c.status} />}

      <section className="res-hero">
        <CapaResidencial c={c} grande />
        <div className="wrap">
          <Migalha itens={[{ nome: "Residenciais", caminho: "/condominios" }, { nome: c.nome, caminho: c.url }]} />
          <span className="rot dourado">Guia de residencial{mun ? ` · ${mun.replace(/\s*\([^)]*\)/g, "")}` : ""}</span>
          <h1>{c.nome}</h1>
          <p className="lead">{c.paraQuem ?? c.resumo}</p>
          {chips.length > 0 && (
            <ul className="res-chips" aria-label="Destaques">
              {chips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
          <div className="res-acoes">
            <LinkRastreado className="btn cheio" href={linkResidencial} ctaId={`res-hero-${c.slug}`} evento="outbound_alphadl">
              {qtdCasas > 0 ? `Ver ${qtdCasas === 1 ? "a casa" : `as ${qtdCasas} casas`} à venda` : `Ver casas no ${c.nome}`}
            </LinkRastreado>
            {whats && (
              <LinkRastreado className="btn" href={whats} ctaId={`res-hero-whats-${c.slug}`} evento="whatsapp_click">
                Falar com um especialista
              </LinkRastreado>
            )}
          </div>
        </div>
      </section>

      <section className="res-casas escuro" aria-labelledby="h-casas">
        <div className="wrap">
          <div className="cab-sec">
            <div>
              <span className="rot dourado">Seleção Alpha DL</span>
              <h2 id="h-casas">{casas.length ? `À venda agora no ${c.nome}` : `Casas no ${c.nome}`}</h2>
            </div>
            <LinkRastreado className="link-seta" href={linkResidencial} ctaId={`res-casas-todas-${c.slug}`} evento="outbound_alphadl">
              Ver no site da Alpha DL
            </LinkRastreado>
          </div>
          {casas.length > 0 ? (
            <>
              <div className="vitrine">
                {casas.slice(0, 6).map((im, i) => (
                  <LinkRastreado
                    key={im.caminho}
                    className="imovel"
                    href={linkAlphaDL(im.caminho, { campanha: "condominios", conteudo: `${c.slug}-imovel` })}
                    ctaId={`res-imovel-${c.slug}-${i}`}
                    evento="outbound_alphadl"
                  >
                    <Cena
                    nome={["i1", "i2", "i3", "g1", "g2", "g4"][i % 6]}
                    credito={!im.foto}
                    foto={im.foto ? { src: im.foto, alt: im.alt, sizes: "(max-width: 700px) 100vw, 380px" } : undefined}
                  >
                      <span className="selo-dl">Alpha DL</span>
                    </Cena>
                    <div>
                      <span className="rot dourado">Código {im.codigo}</span>
                      <h3>{im.resumo}</h3>
                    </div>
                    <div className="specs num">
                      {im.specs.map((s) => (
                        <span key={s}>{s}</span>
                      ))}
                    </div>
                    <div className="preco">
                      <b className="num">{im.preco}</b>
                      <small>Ver fotos e detalhes →</small>
                    </div>
                  </LinkRastreado>
                ))}
              </div>
              <p className="nota-vitrine">
                Preço pedido no anúncio, conforme o portfólio da Alpha DL. Fotos do próprio anúncio; casa sem foto publicada aparece com ilustração.
              </p>
            </>
          ) : (
            <div className="res-sem-casas">
              <p>
                Nenhuma casa do {c.nome} está no portfólio público da Alpha DL neste momento. Boa parte das vendas de alto padrão acontece sem anúncio: um especialista
                pode avisar quando surgir uma casa com o perfil que você procura.
              </p>
              <div className="res-acoes">
                <Link className="btn cheio" href={`/selecao-personalizada?origem=${c.slug}`}>
                  Quero ser avisado
                </Link>
                {whats && (
                  <LinkRastreado className="btn" href={whats} ctaId={`res-vazio-whats-${c.slug}`} evento="whatsapp_click">
                    Conversar no WhatsApp
                  </LinkRastreado>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="claro">
        <section className="res-numeros" aria-labelledby="h-numeros">
          <div className="wrap">
            <div className="cab-sec">
              <div>
                <span className="rot bronze">Ficha do residencial</span>
                <h2 id="h-numeros">O {c.nome} em números</h2>
              </div>
              {c.atualizadoEm && <span className="sec-txt res-atualizado">Atualizado em {dataBR(c.atualizadoEm)}</span>}
            </div>
            <dl className="res-grade">
              {verificados.map((k) => {
                const d = c.campos[k]!;
                const longo = (d.valor ?? "").length > 32;
                return (
                  <div key={k} className={`res-dado${longo ? " longo" : ""}`}>
                    <dt>{CAMPOS_CONDOMINIO[k]}</dt>
                    <dd>{d.valor}</dd>
                    <Fonte d={d} />
                  </div>
                );
              })}
            </dl>
            {faltando.length > 0 && (
              <p className="res-faltando">
                <strong>Ainda em apuração:</strong> {faltando.join(", ")}. Só publicamos um dado depois de conferi-lo em uma fonte identificada.{" "}
                <Link href="/metodologia">Como verificamos</Link>
              </p>
            )}
          </div>
        </section>

        <section className="res-viver" aria-labelledby="h-viver">
          <div className="wrap">
            <div className="res-viver-texto">
              <span className="rot bronze">Como é morar aqui</span>
              <h2 id="h-viver">O que saber antes de escolher o {c.nome}</h2>
              <p>{c.resumo}</p>
              {(c.pros.length > 0 || c.contras.length > 0) && (
                <div className="dois">
                  <div className="lista-pc pro">
                    <h3>Por que as famílias escolhem</h3>
                    <ul>{c.pros.map((p) => <li key={p}>{p}</li>)}</ul>
                  </div>
                  <div className="lista-pc contra">
                    <h3>O que pesar antes</h3>
                    <ul>{c.contras.map((p) => <li key={p}>{p}</li>)}</ul>
                  </div>
                </div>
              )}
            </div>
            {mun && (
              <aside className="res-municipio" aria-label="O que o município muda">
                <span className="rot bronze">O município muda a conta</span>
                <p>
                  {doisMunicipios
                    ? `No ${c.nome}, a casa pode ficar em Barueri ou em Santana de Parnaíba, conforme a parte do residencial. Confira na matrícula antes da proposta: o município define o IPTU, o ITBI e o cartório.`
                    : `Estar em ${mun} define o IPTU, o ITBI pago na compra e o cartório de registro. Vale considerar na conta antes da proposta.`}
                </p>
                <ul>
                  {ARTIGO_MUNICIPIO.map((a, i) => (
                    <li key={a.caminho}>
                      <LinkRastreado href={linkAlphaDL(a.caminho, { campanha: "condominios", conteudo: `${c.slug}-municipio` })} ctaId={`res-mun-${c.slug}-${i}`} evento="outbound_alphadl">
                        {a.titulo}
                      </LinkRastreado>
                    </li>
                  ))}
                  <li>
                    <Link href="/ferramentas/custo-de-morar">Simule o custo mensal de morar</Link>
                  </li>
                </ul>
              </aside>
            )}
          </div>
        </section>

        <section className="res-faq" aria-labelledby="h-faq">
          <div className="wrap">
            <span className="rot bronze">Perguntas frequentes</span>
            <h2 id="h-faq">Dúvidas sobre o {c.nome}</h2>
            <div className="res-faq-lista">
              {faq.map((f) => (
                <details key={f.pergunta}>
                  <summary>{f.pergunta}</summary>
                  <p>{f.resposta}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {outros.length > 0 && (
          <section className="res-outros" aria-labelledby="h-outros">
            <div className="wrap">
              <div className="cab-sec">
                <div>
                  <span className="rot bronze">Compare antes de decidir</span>
                  <h2 id="h-outros">Outros residenciais</h2>
                </div>
                <Link className="link-seta" href="/ferramentas/comparador">
                  Comparar lado a lado
                </Link>
              </div>
              <div className="grade-cond escuro-cards">
                {outros.map((o) => (
                  <CardCondominio key={o.slug} c={o} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      <section className="res-final escuro" aria-labelledby="h-final">
        <div className="wrap">
          <div>
            <span className="rot dourado">Atendimento Alpha DL</span>
            <h2 id="h-final">Procurando casa no {c.nome}?</h2>
            <p className="sec-txt">
              Um corretor da Alpha DL que atua na região mostra as casas disponíveis, inclusive as que não estão anunciadas, e acompanha as visitas. Sem compromisso.
            </p>
          </div>
          <div className="res-acoes">
            <LinkRastreado className="btn cheio" href={linkResidencial} ctaId={`res-final-${c.slug}`} evento="outbound_alphadl">
              Ver casas no {c.nome}
            </LinkRastreado>
            <Link className="btn" href={`/selecao-personalizada?origem=${c.slug}`}>
              Receber uma seleção
            </Link>
          </div>
        </div>
      </section>


      <JsonLd dados={[ldCondominio(c), ldFaq(faq)]} />
    </>
  );
}
