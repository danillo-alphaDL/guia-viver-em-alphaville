import { notFound } from "next/navigation";
import Link from "next/link";
import { Cena } from "@/components/Cena";
import { Migalha } from "@/components/Migalha";
import { Mdx } from "@/components/Mdx";
import { Cta } from "@/components/Cta";
import { JsonLd } from "@/components/JsonLd";
import { Selo, ValorDado } from "@/components/Selo";
import { AvisoRascunho } from "@/components/Rascunho";
import { CardArtigo, dataBR } from "@/components/Cards";
import { LinkRastreado } from "@/components/LinkRastreado";
import { LeituraEngajada } from "@/components/LeituraEngajada";
import { artigo, artigoPorSlug, artigos, autor as buscaAutor, condominio, condominios, type Artigo, type CondominioComp } from "@/lib/content";
import { CAMPOS_CONDOMINIO, type CampoCondominio } from "@/lib/schema";
import { ldArtigo, ldCondominio, ldFaq, meta } from "@/lib/seo";
import { linkAlphaDL } from "@/lib/alphadl";
import { pilares, type Pilar } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  const lista = [
    ...artigos().map((a) => ({ pilar: a.pilar as string, slug: a.slug })),
    ...condominios().map((c) => ({ pilar: "condominios", slug: c.slug })),
  ];
  // Com dynamicParams = false, uma lista vazia quebraria o build: mantém um marcador que responde 404.
  return lista.length ? lista : [{ pilar: "viver", slug: "_" }];
}

type Props = { params: Promise<{ pilar: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { pilar, slug } = await params;
  const c = pilar === "condominios" ? condominio(slug) : undefined;
  if (c) return meta({ titulo: `${c.nome}: guia do residencial`, descricao: c.resumo.slice(0, 160), caminho: c.url, rascunho: c.rascunho });
  const a = artigo(pilar as Pilar, slug);
  if (!a) return {};
  return meta({ titulo: a.tituloSeo ?? a.titulo, descricao: a.descricao, caminho: a.url, rascunho: a.rascunho, tipo: "article", publicado: a.publicadoEm, atualizado: a.atualizadoEm });
}

export default async function Pagina({ params }: Props) {
  const { pilar, slug } = await params;
  const c = pilar === "condominios" ? condominio(slug) : undefined;
  if (c) return <GuiaCondominio c={c} />;
  const a = artigo(pilar as Pilar, slug);
  if (!a) notFound();
  return <PaginaArtigo a={a} />;
}

function PaginaArtigo({ a }: { a: Artigo }) {
  const au = buscaAutor(a.autor);
  const rev = a.revisor ? buscaAutor(a.revisor) : undefined;
  const relacionados = a.relacionados.map(artigoPorSlug).filter(Boolean) as Artigo[];
  const titulos = [...a.corpo.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
  return (
    <article>
      {a.rascunho && <AvisoRascunho status={a.status} />}
      <header className="pg-hero">
        <Cena nome={a.cena} />
        <div className="wrap">
          <Migalha itens={[{ nome: pilares[a.pilar].menu, caminho: `/${a.pilar}` }, { nome: a.titulo, caminho: a.url }]} />
          <h1>{a.titulo}</h1>
          <p className="lead">{a.descricao}</p>
        </div>
      </header>
      <div className="claro">
        <div className="wrap">
          <div className="autoria">
            {au && (
              <div className="autor">
                <div className="avatar" aria-hidden="true">{au.nome[0]}</div>
                <div>
                  <small>Texto</small>
                  <Link href={`/autores/${au.slug}`}>{au.nome}</Link>
                  {au.creci && ` · CRECI ${au.creci}`}
                </div>
              </div>
            )}
            <div>
              <small>Revisão factual</small>
              {rev ? rev.nome : "Pendente"}
            </div>
            {(a.atualizadoEm || a.publicadoEm) && (
              <div>
                <small>{a.atualizadoEm ? "Atualizado" : "Publicado"}</small>
                <time dateTime={(a.atualizadoEm || a.publicadoEm)!}>{dataBR(a.atualizadoEm || a.publicadoEm)}</time>
              </div>
            )}
            <div>
              <small>Leitura</small>
              {a.minutos} min
            </div>
          </div>
          <div className="art">
            <nav className="indice" aria-label="Neste guia">
              <span className="rot bronze">Neste guia</span>
              <ol>
                {titulos.map((t) => (
                  <li key={t}>
                    <span>{t}</span>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="texto">
              <div className="resposta">
                <span className="rot">Resposta curta</span>
                <p>{a.resumo}</p>
              </div>
              <Mdx fonte={a.corpo} />
              <Cta tipo={a.cta.tipo} origem={a.slug} contexto={a.cta.contexto} />
              {a.faq.length > 0 && (
                <section style={{ padding: 0 }} aria-labelledby="h-faq">
                  <h2 id="h-faq">Perguntas frequentes</h2>
                  <div style={{ marginTop: 20 }}>
                    {a.faq.map((f) => (
                      <details key={f.pergunta}>
                        <summary>{f.pergunta}</summary>
                        <p>{f.resposta}</p>
                      </details>
                    ))}
                  </div>
                </section>
              )}
              <div className="fontes">
                <span className="rot bronze">Fontes</span>
                {a.fontes.length ? (
                  <ol>
                    {a.fontes.map((f) => (
                      <li key={f.titulo}>
                        {f.url ? (
                          <a href={f.url} target="_blank" rel="noopener noreferrer">{f.titulo}</a>
                        ) : (
                          f.titulo
                        )}
                        , acesso em {f.acessadoEm.split("-").reverse().join("/")}.
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p style={{ marginTop: 10 }}>Fontes em levantamento.</p>
                )}
                <p style={{ marginTop: 12 }}>
                  Encontrou um erro? Veja como pedir uma correção na <Link href="/politica-editorial">política editorial</Link>.
                </p>
              </div>
            </div>
            <aside className="lateral" aria-label="Leia também">
              {a.leiturasAlphaDL.length > 0 && (
                <div className="box-alphadl">
                  <span className="rot bronze">No blog da Alpha DL</span>
                  <ul>
                    {a.leiturasAlphaDL.map((l, i) => (
                      <li key={l.caminho}>
                        <LinkRastreado href={linkAlphaDL(l.caminho, { campanha: "artigo", conteudo: a.slug })} ctaId={`leitura-${a.slug}-${i}`} evento="outbound_alphadl">
                          {l.titulo}
                        </LinkRastreado>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {relacionados.length > 0 && <span className="rot bronze">Leia também</span>}
              {relacionados.map((r) => (
                <CardArtigo key={r.slug} a={r} />
              ))}
            </aside>
          </div>
        </div>
      </div>
      <LeituraEngajada slug={a.slug} pilar={a.pilar} />
      <JsonLd dados={[ldArtigo(a, au), ldFaq(a.faq)]} />
    </article>
  );
}

function GuiaCondominio({ c }: { c: CondominioComp }) {
  const esp = c.especialista ? buscaAutor(c.especialista) : undefined;
  const campos = Object.keys(CAMPOS_CONDOMINIO) as CampoCondominio[];
  return (
    <>
      {c.rascunho && <AvisoRascunho status={c.status} />}
      <section className="pg-hero">
        <Cena nome={c.cena} style={{ height: "clamp(480px,74vh,720px)" }} />
        <div className="wrap" style={{ paddingBottom: 110 }}>
          <Migalha itens={[{ nome: "Residenciais", caminho: "/condominios" }, { nome: c.nome, caminho: c.url }]} />
          <h1>{c.nome}</h1>
          <p className="lead">{c.paraQuem ?? c.resumo}</p>
        </div>
      </section>
      <div className="claro">
        <div className="wrap" style={{ display: "grid", gap: "clamp(56px,8vw,104px)", paddingBottom: 104 }}>
          <div className="ficha">
            <div className="ficha-cab">
              <h2>Ficha do residencial</h2>
              {c.atualizadoEm && <span className="sec-txt" style={{ fontSize: ".85rem" }}>Atualizada em {dataBR(c.atualizadoEm)}</span>}
            </div>
            <dl>
              {campos.map((k) => {
                const d = c.campos[k];
                return (
                  <div className="campo" key={k}>
                    <dt>{CAMPOS_CONDOMINIO[k]}</dt>
                    <dd className="num">
                      <ValorDado dado={d} />
                    </dd>
                    <span style={{ alignSelf: "flex-start" }}>{d ? <Selo dado={d} /> : <span className="selo pend">Em apuração</span>}</span>
                  </div>
                );
              })}
            </dl>
            <div className="ficha-rodape">
              <span>
                Como verificamos: <Link href="/metodologia">metodologia</Link>
              </span>
              {c.revisarAte && <span>Próxima revisão: {dataBR(c.revisarAte)}</span>}
              <span>
                Dado errado? <Link href="/politica-editorial">Peça uma correção</Link>
              </span>
            </div>
          </div>
          <p className="prosa" style={{ fontSize: "1.15rem" }}>{c.resumo}</p>
          {(c.pros.length > 0 || c.contras.length > 0) && (
            <div className="dois">
              <div className="lista-pc pro">
                <h2 style={{ fontSize: "2rem", marginBottom: 18 }}>Por que as famílias escolhem</h2>
                <ul>{c.pros.map((p) => <li key={p}>{p}</li>)}</ul>
              </div>
              <div className="lista-pc contra">
                <h2 style={{ fontSize: "2rem", marginBottom: 18 }}>O que pesar antes</h2>
                <ul>{c.contras.map((p) => <li key={p}>{p}</li>)}</ul>
              </div>
            </div>
          )}
          <div className="especialista">
            <div className="avatar" aria-hidden="true">DL</div>
            <div>
              <span className="rot dourado">Atendimento Alpha DL</span>
              <h2 style={{ fontSize: "1.9rem", marginBlock: 8 }}>{esp ? `${esp.nome}, Alpha DL` : `Casas no ${c.nome}`}</h2>
              <p>Um especialista apresenta as casas à venda e para alugar neste residencial.</p>
            </div>
            <LinkRastreado className="btn cheio" href={linkAlphaDL("/", { campanha: "condominios", conteudo: c.slug })} ctaId={`cond-${c.slug}`} evento="outbound_alphadl">
              Ver casas neste residencial
            </LinkRastreado>
          </div>
        </div>
      </div>
      <JsonLd dados={ldCondominio(c)} />
    </>
  );
}
