import Link from "next/link";
import Image from "next/image";
import { Cena } from "@/components/Cena";
import { BuscaHome } from "@/components/BuscaHome";
import { LinkRastreado } from "@/components/LinkRastreado";
import { JsonLd } from "@/components/JsonLd";
import { artigos, condominios } from "@/lib/content";
import { CardArtigo } from "@/components/Cards";
import { CapaResidencial } from "@/components/CapaResidencial";
import {
  catalogoAlphaDL,
  contarPorResidencial,
  destaquesVariados,
  leituras,
  linkAlphaDL,
  linkWhatsApp,
  mercadoAgora,
  milhoes,
  portfolioAlphaDL,
} from "@/lib/alphadl";
import { ldFaq, meta } from "@/lib/seo";
import { equipe, site } from "@/lib/site";

export const metadata = {
  ...meta({ titulo: `${site.nome}: casas de alto padrão em Alphaville e Tamboré`, descricao: site.descricao, caminho: "/" }),
  title: { absolute: `${site.nome}: casas de alto padrão em Alphaville e Tamboré` },
};

const dataBR = (d: string) => d.split("-").reverse().join("/");

export default async function Home() {
  const portfolio = await portfolioAlphaDL();
  const mercado = mercadoAgora(portfolio);
  const destaques = destaquesVariados(portfolio, 6);
  const residenciais = condominios().filter((c) => !c.rascunho);
  const guias = artigos().filter((a) => !a.rascunho);
  const principais = ["casas-em-alphaville-acima-de-5-milhoes", "melhores-condominios-de-alphaville", "custo-de-manter-casa-de-alto-padrao-em-alphaville"];
  const guiasHome = [...principais.map((s) => guias.find((a) => a.slug === s)).filter(Boolean), ...guias.filter((a) => !principais.includes(a.slug))].slice(0, 6) as typeof guias;
  const contagem = contarPorResidencial(portfolio, residenciais.map((r) => r.nome));
  const whats = linkWhatsApp("Olá! Vim do Guia Viver em Alphaville e gostaria de falar com um especialista sobre casas na região.");
  const todas = catalogoAlphaDL({ fin: "venda", tipo: "casa" }, { campanha: "home", conteudo: "todas" });

  const atalhos = [
    { rotulo: "Casas acima de R$ 5 milhões", href: catalogoAlphaDL({ fin: "venda", tipo: "casa", pmin: 5_000_000, pmax: 1_000_000_000 }, { campanha: "home", conteudo: "atalho-5mi" }) },
    { rotulo: "4 quartos ou mais", href: catalogoAlphaDL({ fin: "venda", tipo: "casa", dorm: 4 }, { campanha: "home", conteudo: "atalho-4q" }) },
    { rotulo: "Casas em Tamboré", href: catalogoAlphaDL({ fin: "venda", tipo: "casa", regiao: "Tamboré" }, { campanha: "home", conteudo: "atalho-tambore" }) },
    { rotulo: "Terrenos para construir", href: catalogoAlphaDL({ fin: "venda", tipo: "terreno" }, { campanha: "home", conteudo: "atalho-terrenos" }) },
  ];

  const caminhos = [
    {
      rot: "Vou comprar",
      titulo: "Do primeiro olhar à escritura",
      texto: "Passo a passo, documentos, ITBI e financiamento para comprar em Alphaville.",
      href: linkAlphaDL(leituras("comprar")[0]?.caminho ?? "/", { campanha: "home", conteudo: "caminho-comprar" }),
      externo: true,
    },
    {
      rot: "Vou alugar",
      titulo: "Locação sem surpresa",
      texto: "Garantias, contrato e o custo mensal completo de uma casa alugada.",
      href: linkAlphaDL(leituras("alugar")[0]?.caminho ?? "/", { campanha: "home", conteudo: "caminho-alugar" }),
      externo: true,
    },
    {
      rot: "Vou escolher o residencial",
      titulo: "Compare lado a lado",
      texto: "Os mesmos critérios para todos os residenciais, com fonte em cada dado.",
      href: "/ferramentas/comparador",
      externo: false,
    },
    {
      rot: "Vou fazer as contas",
      titulo: "Quanto custa por mês",
      texto: "Condomínio, IPTU, manutenção e despesas em um total mensal, sem cadastro.",
      href: "/ferramentas/custo-de-morar",
      externo: false,
    },
  ];

  const faq = [
    ...(mercado
      ? [
          {
            pergunta: "Quanto custa uma casa em Alphaville?",
            resposta: `Entre as ${mercado.casas} casas à venda no portfólio da Alpha DL em Barueri e Santana de Parnaíba, em ${dataBR(mercado.data)}, o preço pedido mediano é de ${milhoes(mercado.mediana)}, e metade delas pede entre ${milhoes(mercado.p25)} e ${milhoes(mercado.p75)}. São preços de anúncio, não de venda fechada.`,
          },
        ]
      : []),
    {
      pergunta: "Alphaville fica em qual cidade?",
      resposta:
        "Alphaville fica na Grande São Paulo e se divide entre os municípios de Barueri e Santana de Parnaíba. O município de cada casa define o IPTU, o ITBI pago na compra e o cartório de registro.",
    },
    {
      pergunta: "Qual é o melhor residencial de Alphaville?",
      resposta:
        "Depende do que a família prioriza: espaço, acesso a São Paulo, lazer interno ou privacidade. O guia mostra os mesmos dados de cada residencial, com fonte e data, e o comparador coloca dois ou três lado a lado.",
    },
    {
      pergunta: "Quem faz o Guia Viver em Alphaville?",
      resposta:
        "O guia é mantido pela Alpha DL, imobiliária de alto padrão da região. O conteúdo não é patrocinado por condomínios nem incorporadoras, e o atendimento só começa quando o leitor pede.",
    },
  ];

  return (
    <>
      <section className="hero">
        <Cena nome="hero" />
        <div className="hero-txt">
          <div className="wrap">
            <span className="rot dourado">Alphaville · Tamboré · Barueri · Santana de Parnaíba</span>
            <h1>
              Sua casa em Alphaville, <em>escolhida com critério.</em>
            </h1>
            <p className="lead">
              Casas de alto padrão à venda agora, guias de cada residencial com dados conferidos e o custo real de morar. Para decidir com calma, com quem conhece
              cada alameda.
            </p>
            <BuscaHome />
            {mercado && (
              <p className="hero-contagem">
                <strong>{mercado.casas} casas à venda agora</strong> no portfólio da Alpha DL em Barueri e Santana de Parnaíba
              </p>
            )}
            <ul className="hero-atalhos" aria-label="Buscas rápidas">
              {atalhos.map((a, i) => (
                <li key={a.rotulo}>
                  <LinkRastreado href={a.href} ctaId={`home-atalho-${i}`} evento="outbound_alphadl">
                    {a.rotulo}
                  </LinkRastreado>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="dores claro" aria-labelledby="h-dores">
        <div className="wrap">
          <div className="dores-cab">
            <span className="rot bronze">Por que este guia existe</span>
            <h2 id="h-dores">Procurar casa em Alphaville cansa. Não precisa ser assim.</h2>
            <p className="sec-txt">
              Quem procura uma casa de alto padrão na região costuma esbarrar nos mesmos cinco problemas. Cada um tem uma resposta prática, e é com ela que a Alpha DL
              trabalha todos os dias.
            </p>
          </div>
          <ol className="dores-lista">
            {[
              {
                dor: "Os mesmos anúncios em todos os portais, sem dizer em qual residencial a casa fica.",
                saida: "Aqui cada casa aparece com o residencial e o código do anúncio, e cada residencial tem um guia com dados conferidos.",
              },
              {
                dor: "Preço sem referência: não dá para saber se o valor pedido faz sentido.",
                saida: "Mostramos quanto pedem as casas parecidas, com fonte e data. Antes da proposta, a Alpha DL compara a casa com as vizinhas.",
              },
              {
                dor: "O custo depois da chave: condomínio, IPTU, jardim, piscina, equipe.",
                saida: "O simulador soma tudo em um total mensal, sem cadastro, para você decidir com a conta inteira na mão.",
              },
              {
                dor: "Documentação de casa grande tem armadilhas: área sem averbação, dívidas, imóvel em inventário.",
                saida: "A Alpha DL confere matrícula, certidões e situação da construção antes de você assinar qualquer coisa.",
              },
              {
                dor: "Muitas casas são vendidas sem anúncio, e quem não está no circuito nem fica sabendo.",
                saida: "Quem conta o que procura recebe uma seleção, inclusive de casas que não estão anunciadas.",
              },
            ].map((d, i) => (
              <li key={i}>
                <span className="dores-num num">{String(i + 1).padStart(2, "0")}</span>
                <p className="dores-dor">{d.dor}</p>
                <p className="dores-saida">{d.saida}</p>
              </li>
            ))}
          </ol>
          <div className="res-acoes">
            <Link className="btn tinta" href="/selecao-personalizada?origem=home-dores">
              Contar o que procuro
            </Link>
            {whats && (
              <LinkRastreado className="btn" href={whats} ctaId="home-dores-whats" evento="whatsapp_click">
                Conversar no WhatsApp
              </LinkRastreado>
            )}
          </div>
        </div>
      </section>

      {mercado && (
        <section className="mercado claro" aria-labelledby="h-mercado">
          <div className="wrap">
            <div className="mercado-cab">
              <span className="rot bronze">O mercado agora</span>
              <h2 id="h-mercado">Quanto pedem as casas de Alphaville e Tamboré</h2>
            </div>
            <dl className="mercado-numeros">
              <div>
                <dt>Casas à venda</dt>
                <dd className="num">{mercado.casas}</dd>
              </div>
              <div>
                <dt>Preço pedido mediano</dt>
                <dd className="num">{milhoes(mercado.mediana)}</dd>
              </div>
              <div>
                <dt>Metade das casas pede entre</dt>
                <dd className="num faixa">
                  <span className="nw">{milhoes(mercado.p25)}</span> <span className="e">a</span> <span className="nw">{milhoes(mercado.p75)}</span>
                </dd>
              </div>
            </dl>
            <p className="mercado-fonte">
              Fonte: portfólio público da Alpha DL, casas à venda em Barueri e Santana de Parnaíba, {dataBR(mercado.data)}. São preços pedidos em anúncio, não de
              venda fechada.
            </p>
          </div>
        </section>
      )}

      {destaques.length > 0 && (
        <section className="escuro" aria-labelledby="h-vitrine">
          <div className="wrap">
            <div className="cab-sec">
              <div>
                <span className="rot dourado">Seleção Alpha DL</span>
                <h2 id="h-vitrine">Casas em destaque</h2>
              </div>
              <LinkRastreado className="link-seta" href={todas} ctaId="home-vitrine-todas" evento="outbound_alphadl">
                {mercado ? `Ver as ${mercado.casas} casas` : "Ver todas as casas"}
              </LinkRastreado>
            </div>
            <div className="vitrine">
              {destaques.map((im, i) => (
                <LinkRastreado
                  key={im.caminho}
                  className="imovel"
                  href={linkAlphaDL(im.caminho, { campanha: "home", conteudo: "vitrine-card" })}
                  ctaId={`home-vitrine-${i}`}
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
                    <span className="rot dourado">{im.cidade}</span>
                    <h3>{im.titulo}</h3>
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
            <p className="nota-vitrine">Preço pedido no anúncio. Fotos do anúncio da Alpha DL; casa sem foto publicada aparece com ilustração.</p>
          </div>
        </section>
      )}

      {residenciais.length > 0 && (
        <section className="residenciais claro" aria-labelledby="h-residenciais">
          <div className="wrap">
            <div className="cab-sec">
              <div>
                <span className="rot bronze">Guias de residenciais</span>
                <h2 id="h-residenciais">Escolha pelo residencial</h2>
              </div>
              <Link className="link-seta" href="/condominios">
                Todos os residenciais
              </Link>
            </div>
            <ul className="lista-res">
              {residenciais.map((r) => {
                const n = contagem[r.nome] ?? 0;
                const mun = r.campos.municipio?.estado === "verificado" ? r.campos.municipio.valor?.replace(/\s*\([^)]*\)/g, "") : "";
                return (
                  <li key={r.slug}>
                    <Link href={r.url}>
                      <CapaResidencial c={r} />
                      <div className="lista-res-txt">
                        <span className="rot bronze">{mun}</span>
                        <h3>{r.nome}</h3>
                        <p>{r.paraQuem ?? r.resumo}</p>
                      </div>
                      <div className="lista-res-casas">
                        {n > 0 ? (
                          <>
                            <b className="num">{n}</b>
                            <span>{n === 1 ? "imóvel à venda" : "imóveis à venda"}</span>
                          </>
                        ) : (
                          <span>Ver o guia</span>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      <section className="caminhos escuro" style={{ background: "var(--noite-2)" }} aria-labelledby="h-caminhos">
        <div className="wrap">
          <div className="cab-sec">
            <div>
              <span className="rot dourado">Por onde começar</span>
              <h2 id="h-caminhos">Em que momento você está?</h2>
            </div>
          </div>
          <div className="caminhos-grade">
            {caminhos.map((c, i) =>
              c.externo ? (
                <LinkRastreado key={c.rot} className="caminho" href={c.href} ctaId={`home-caminho-${i}`} evento="outbound_alphadl">
                  <span className="rot dourado">{c.rot}</span>
                  <h3>{c.titulo}</h3>
                  <p>{c.texto}</p>
                  <span className="caminho-ir">Ler no blog da Alpha DL ↗</span>
                </LinkRastreado>
              ) : (
                <Link key={c.rot} className="caminho" href={c.href}>
                  <span className="rot dourado">{c.rot}</span>
                  <h3>{c.titulo}</h3>
                  <p>{c.texto}</p>
                  <span className="caminho-ir">Abrir a ferramenta →</span>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      {guiasHome.length > 0 && (
        <section className="claro" aria-labelledby="h-guias">
          <div className="wrap">
            <div className="cab-sec">
              <div>
                <span className="rot bronze">Guias para decidir</span>
                <h2 id="h-guias">O que saber antes de escolher a casa</h2>
              </div>
            </div>
            <div className="lista-artigos">
              {guiasHome.map((a) => (
                <CardArtigo key={a.slug} a={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="equipe claro" aria-labelledby="h-equipe">
        <div className="wrap">
          <div className="equipe-txt">
            <span className="rot bronze">Quem atende</span>
            <h2 id="h-equipe">Fale com quem conhece cada alameda</h2>
            <p className="sec-txt">
              O Guia Viver em Alphaville é mantido pela Alpha DL. Quando você quiser ver casas, quem atende são os sócios, corretores registrados no CRECI, que
              acompanham as visitas e a negociação. O conteúdo do guia não é patrocinado por condomínios nem incorporadoras.
            </p>
            <div className="res-acoes">
              <Link className="btn tinta" href="/selecao-personalizada?origem=home-equipe">
                Receber uma seleção de casas
              </Link>
              {whats && (
                <LinkRastreado className="btn" href={whats} ctaId="home-equipe-whats" evento="whatsapp_click">
                  Conversar no WhatsApp
                </LinkRastreado>
              )}
            </div>
          </div>
          <ul className="equipe-lista">
            {equipe.map((p) => (
              <li key={p.nome}>
                <Image src={p.foto} alt={`Foto de ${p.nome}`} width={480} height={600} sizes="(max-width: 700px) 45vw, 260px" />
                <strong>{p.nome}</strong>
                <span>{p.papel}</span>
                <span className="num">{p.creci}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="custo-teaser claro" style={{ paddingTop: 0 }} aria-labelledby="h-custo">
        <div className="wrap" style={{ borderTop: "1px solid var(--linha-clara)", paddingTop: "clamp(64px,9vw,128px)" }}>
          <div>
            <span className="filete" />
            <h2 id="h-custo">Quanto custa, de verdade, morar aqui?</h2>
            <p className="sec-txt" style={{ maxWidth: "30rem" }}>
              Some aluguel ou manutenção, condomínio, IPTU e despesas da casa. O resultado aparece na hora, sem cadastro.
            </p>
            <div style={{ marginTop: 34 }}>
              <Link className="btn tinta" href="/ferramentas/custo-de-morar">
                Fazer minha simulação
              </Link>
            </div>
          </div>
          <div className="recibo" aria-label="Exemplo de simulação com valores ilustrativos">
            <span className="rot bronze">Exemplo · valores ilustrativos</span>
            <div className="l"><span>Aluguel</span><span className="num">R$ 30.000</span></div>
            <div className="l"><span>Condomínio</span><span className="num">R$ 2.400</span></div>
            <div className="l"><span>IPTU (mensal)</span><span className="num">R$ 1.500</span></div>
            <div className="l"><span>Manutenção</span><span className="num">R$ 1.200</span></div>
            <div className="l t"><span className="rot">Total mensal</span><b className="num">R$ 35.100</b></div>
          </div>
        </div>
      </section>

      <section className="res-faq claro" aria-labelledby="h-faq-home" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <span className="rot bronze">Perguntas frequentes</span>
          <h2 id="h-faq-home">Antes de procurar casa em Alphaville</h2>
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

      <section className="res-final escuro" aria-labelledby="h-final-home">
        <div className="wrap">
          <div>
            <span className="rot dourado">Atendimento Alpha DL</span>
            <h2 id="h-final-home">Conte o que procura. A gente mostra as casas certas.</h2>
            <p className="sec-txt">Inclusive as que não estão anunciadas. Sem compromisso e sem insistência.</p>
          </div>
          <div className="res-acoes">
            <LinkRastreado className="btn cheio" href={todas} ctaId="home-final-casas" evento="outbound_alphadl">
              Ver casas à venda
            </LinkRastreado>
            <Link className="btn" href="/selecao-personalizada?origem=home-final">
              Receber uma seleção
            </Link>
          </div>
        </div>
      </section>

      <JsonLd dados={ldFaq(faq)} />
    </>
  );
}
