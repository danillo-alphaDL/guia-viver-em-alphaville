import { notFound } from "next/navigation";
import Link from "next/link";
import { Cena } from "@/components/Cena";
import { Migalha } from "@/components/Migalha";
import { Mdx, ancora } from "@/components/Mdx";
import Image from "next/image";
import { Cta } from "@/components/Cta";
import { JsonLd } from "@/components/JsonLd";
import { Selo, ValorDado } from "@/components/Selo";
import { AvisoRascunho } from "@/components/Rascunho";
import { CardArtigo, dataBR } from "@/components/Cards";
import { LinkRastreado } from "@/components/LinkRastreado";
import { LeituraEngajada } from "@/components/LeituraEngajada";
import { GuiaResidencial } from "@/components/GuiaResidencial";
import { artigo, artigoPorSlug, artigos, autor as buscaAutor, condominio, condominios, type Artigo, type CondominioComp } from "@/lib/content";
import { CAMPOS_CONDOMINIO, type CampoCondominio } from "@/lib/schema";
import { ldArtigo, ldCondominio, ldFaq, meta } from "@/lib/seo";
import { imoveisPorFaixa, linkAlphaDL, linkWhatsApp } from "@/lib/alphadl";
import { equipe, pilares, type Pilar } from "@/lib/site";

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
  if (c) return meta({ titulo: `${c.nome}: como é morar, números e casas à venda`, descricao: (c.paraQuem ?? c.resumo).slice(0, 155), caminho: c.url, rascunho: c.rascunho });
  const a = artigo(pilar as Pilar, slug);
  if (!a) return {};
  return meta({ titulo: a.tituloSeo ?? a.titulo, descricao: a.descricao, caminho: a.url, rascunho: a.rascunho, tipo: "article", publicado: a.publicadoEm, atualizado: a.atualizadoEm });
}

export default async function Pagina({ params }: Props) {
  const { pilar, slug } = await params;
  const c = pilar === "condominios" ? condominio(slug) : undefined;
  if (c) return <GuiaResidencial c={c} />;
  const a = artigo(pilar as Pilar, slug);
  if (!a) notFound();
  return <PaginaArtigo a={a} casas={a.vitrine ? await imoveisPorFaixa(a.vitrine, 3) : []} />;
}

function PaginaArtigo({ a, casas }: { a: Artigo; casas: Awaited<ReturnType<typeof imoveisPorFaixa>> }) {
  const whats = linkWhatsApp(`Olá! Li o artigo "${a.titulo}" no Guia Viver em Alphaville e quero conversar com um especialista.`);
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
            {rev && (
              <div>
                <small>Revisão factual</small>
                {rev.nome}
              </div>
            )}
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
                    <a href={`#${ancora(t)}`}>{t}</a>
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
              {a.vitrine && casas.length > 0 && (
                <aside className="art-vitrine" aria-label={a.vitrine.titulo}>
                  <span className="rot dourado">Seleção Alpha DL</span>
                  <h2>{a.vitrine.titulo}</h2>
                  <ul>
                    {casas.map((im, i) => (
                      <li key={im.caminho}>
                        <LinkRastreado href={linkAlphaDL(im.caminho, { campanha: "artigo", conteudo: `${a.slug}-imovel` })} ctaId={`art-imovel-${a.slug}-${i}`} evento="outbound_alphadl">
                          <span className="art-vitrine-local">{im.local}</span>
                          <strong>{im.titulo}</strong>
                          <span className="art-vitrine-specs">{im.specs.join(" · ")}</span>
                          <b className="num">{im.preco}</b>
                        </LinkRastreado>
                      </li>
                    ))}
                  </ul>
                  <p className="art-vitrine-nota">Preço pedido no anúncio, conforme o portfólio da Alpha DL. Clique para ver o anúncio.</p>
                </aside>
              )}
              <Cta tipo={a.cta.tipo} origem={a.slug} contexto={a.cta.contexto} />
              <aside className="art-equipe" aria-label="Quem atende">
                <div className="art-equipe-fotos">
                  {equipe.map((p) => (
                    <Image key={p.nome} src={p.foto} alt={`Foto de ${p.nome}`} width={96} height={120} sizes="72px" />
                  ))}
                </div>
                <div>
                  <span className="rot bronze">Quem atende</span>
                  <p>
                    {equipe.map((p) => `${p.nome} (${p.creci})`).join(" e ")}, sócios da Alpha DL, atendem quem chega pelo guia e acompanham visitas e
                    negociação.
                  </p>
                </div>
              </aside>
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
      <div className="res-barra">
        <span>Fale com a Alpha DL</span>
        {whats ? (
          <LinkRastreado className="btn cheio" href={whats} ctaId={`art-barra-${a.slug}`} evento="whatsapp_click">
            WhatsApp
          </LinkRastreado>
        ) : (
          <Link className="btn cheio" href={`/selecao-personalizada?origem=${a.slug}`}>
            Contato
          </Link>
        )}
      </div>
      <JsonLd dados={[ldArtigo(a, au), ldFaq(a.faq)]} />
    </article>
  );
}
