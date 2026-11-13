import Link from "next/link";
import { Cena } from "@/components/Cena";
import { CardArtigo, CardCondominio } from "@/components/Cards";
import { LinkRastreado } from "@/components/LinkRastreado";
import { artigos, condominios } from "@/lib/content";
import { linkAlphaDL, linkWhatsApp, vitrineAlphaDL } from "@/lib/alphadl";
import { FAIXAS } from "@/lib/lead";
import { meta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = {
  ...meta({ titulo: `${site.nome}: morar, comprar e alugar em Alphaville`, descricao: site.descricao, caminho: "/" }),
  title: { absolute: `${site.nome}: morar, comprar e alugar em Alphaville` },
};

export default async function Home() {
  const conds = condominios().slice(0, 3);
  const materias = artigos().slice(0, 3);
  const vitrine = await vitrineAlphaDL();
  const whats = linkWhatsApp("Olá! Vim do Guia Viver em Alphaville e gostaria de falar com um especialista.");

  return (
    <>
      <section className="hero">
        <Cena nome="hero" />
        <div className="hero-txt">
          <div className="wrap">
            <span className="rot dourado">Alphaville · Tamboré · Barueri · Santana de Parnaíba</span>
            <h1>
              O melhor de Alphaville, <em>escolhido com calma.</em>
            </h1>
            <p className="lead">Residenciais de alto padrão apresentados em detalhe, custos reais de morar e a curadoria de quem conhece cada alameda.</p>
            <form className="busca" action="/selecao-personalizada" method="get" aria-label="Comece sua busca">
              <input type="hidden" name="origem" value="home-hero" />
              <div className="seg" role="radiogroup" aria-label="Objetivo">
                <label>
                  <input type="radio" name="objetivo" value="comprar" defaultChecked /> Comprar
                </label>
                <label>
                  <input type="radio" name="objetivo" value="alugar" /> Alugar
                </label>
              </div>
              <label htmlFor="b-regiao">
                Região
                <select id="b-regiao" name="regiao" defaultValue="">
                  <option value="">Todos os residenciais</option>
                  <option>Residenciais Alphaville</option>
                  <option>Tamboré</option>
                </select>
              </label>
              <label htmlFor="b-faixa">
                Investimento
                <select id="b-faixa" name="faixa" defaultValue={FAIXAS[1]}>
                  {FAIXAS.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
              </label>
              <button className="btn cheio" type="submit">
                Explorar
              </button>
            </form>
            <div className="hero-rodape">
              <span>{site.slogan}</span>
              <span>Curadoria Alpha DL</span>
            </div>
          </div>
        </div>
      </section>

      <section className="manifesto claro">
        <div className="wrap">
          <div>
            <span className="filete" />
            <p className="rot bronze" style={{ marginTop: 20 }}>
              O guia
            </p>
          </div>
          <div className="col">
            <h2>
              Antes da casa, <em>o lugar.</em> Antes do anúncio, a decisão.
            </h2>
            <p>
              Quem procura uma casa de alto padrão em Alphaville escolhe primeiro o residencial: o tamanho dos lotes, as regras, a rotina das alamedas, a escola das
              crianças, o caminho até São Paulo. É isso que este guia mostra, com fonte e data em cada informação.
            </p>
            <div className="pilares">
              <Link href="/condominios" style={{ textDecoration: "none" }}>
                <div>
                  <strong>Residenciais</strong>
                  <span>Fichas verificadas e comparativos com critérios públicos</span>
                </div>
              </Link>
              <Link href="/ferramentas/custo-de-morar" style={{ textDecoration: "none" }}>
                <div>
                  <strong>Custos reais</strong>
                  <span>Condomínio, IPTU e manutenção, sem surpresas</span>
                </div>
              </Link>
              <Link href="/viver" style={{ textDecoration: "none" }}>
                <div>
                  <strong>Vida local</strong>
                  <span>Escolas, mobilidade, clubes e serviços</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="escuro" aria-labelledby="h-colecao">
        <div className="wrap">
          <div className="cab-sec">
            <div>
              <span className="rot dourado">Guias de residenciais</span>
              <h2 id="h-colecao">A coleção de condomínios</h2>
            </div>
            <Link className="link-seta" href="/condominios">
              Todos os residenciais
            </Link>
          </div>
          {conds.length ? (
            <div className="colecao">
              {conds.map((c, i) => (
                <CardCondominio key={c.slug} c={c} destaque={i === 0 && conds.length === 3} />
              ))}
            </div>
          ) : (
            <div className="vazio">
              <p>
                Os guias dos residenciais estão em apuração. Só publicamos uma ficha depois de verificar cada dado com fonte e data. Enquanto isso, um especialista
                da Alpha DL pode apresentar os residenciais a você.
              </p>
              <Link className="link-seta" href="/selecao-personalizada?origem=home-colecao">
                Falar com um especialista
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="escuro" style={{ background: "var(--noite-2)" }} aria-labelledby="h-vitrine">
        <div className="wrap">
          <div className="cab-sec">
            <div>
              <span className="rot dourado">Seleção Alpha DL</span>
              <h2 id="h-vitrine">Casas disponíveis agora</h2>
            </div>
            <LinkRastreado className="link-seta" href={linkAlphaDL("/", { campanha: "home", conteudo: "vitrine" })} ctaId="home-vitrine-todas" evento="outbound_alphadl">
              Ver todas na Alpha DL
            </LinkRastreado>
          </div>
          {vitrine.length ? (
            <div className="vitrine">
              {vitrine.slice(0, 3).map((im, i) => (
                <LinkRastreado key={im.url} className="imovel" href={linkAlphaDL(im.url, { campanha: "home", conteudo: "vitrine-card" })} ctaId={`home-vitrine-${i}`} evento="outbound_alphadl">
                  <Cena nome={["i1", "i2", "i3"][i]} foto={im.imagem ? { src: im.imagem, alt: im.titulo } : undefined} credito={false}>
                    <span className="selo-dl">Alpha DL</span>
                  </Cena>
                  <div>
                    <span className="rot dourado">{im.condominio}</span>
                    <h3>{im.titulo}</h3>
                  </div>
                  <div className="specs num">
                    {im.specs.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                  <div className="preco">
                    <b className="num">{im.preco ?? "Sob consulta"}</b>
                    <small>{im.finalidade === "venda" ? "Venda" : "Locação"}</small>
                  </div>
                </LinkRastreado>
              ))}
            </div>
          ) : (
            <div className="vazio">
              <p>
                As casas à venda e para alugar são apresentadas pela Alpha DL, com visitas acompanhadas por um corretor que conhece cada residencial.
              </p>
              <LinkRastreado className="btn cheio" href={linkAlphaDL("/", { campanha: "home", conteudo: "vitrine-vazia" })} ctaId="home-vitrine-cta" evento="outbound_alphadl">
                Ver casas na Alpha DL
              </LinkRastreado>
            </div>
          )}
        </div>
      </section>

      <section className="estilo" aria-labelledby="h-estilo">
        <Cena nome="estilo" />
        <div className="wrap">
          <span className="rot dourado">Viver em Alphaville</span>
          <h2 id="h-estilo">A vida entre as alamedas</h2>
          <p>Escolas, clubes, restaurantes, o caminho até São Paulo e a rotina de quem escolheu a região para morar.</p>
          <div className="temas">
            <Link href="/viver">Viver</Link>
            <Link href="/comprar">Comprar</Link>
            <Link href="/alugar">Alugar</Link>
            <Link href="/mercado">Mercado</Link>
          </div>
        </div>
      </section>

      <section className="custo-teaser claro" aria-labelledby="h-custo">
        <div className="wrap">
          <div>
            <span className="filete" />
            <h2 id="h-custo">Quanto custa, de verdade, morar aqui?</h2>
            <p className="sec-txt" style={{ maxWidth: "30rem" }}>
              Some aluguel ou manutenção do imóvel, condomínio, IPTU e despesas da casa. O resultado aparece na hora, sem cadastro.
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

      {materias.length > 0 && (
        <section className="claro" style={{ paddingTop: 0 }} aria-labelledby="h-jornal">
          <div className="wrap">
            <div className="cab-sec" style={{ borderTop: "1px solid var(--linha-clara)", paddingTop: "clamp(48px,6vw,80px)" }}>
              <div>
                <span className="rot bronze">Jornal</span>
                <h2 id="h-jornal">Para decidir bem</h2>
              </div>
            </div>
            <div className="jornal">
              {materias.map((a) => (
                <CardArtigo key={a.slug} a={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="dl escuro" aria-labelledby="h-dl">
        <div className="wrap">
          <div>
            <span className="rot dourado">Atendimento Alpha DL</span>
            <h2 id="h-dl">Quando quiser ver casas, um especialista acompanha você.</h2>
            <p className="sec-txt" style={{ maxWidth: "32rem" }}>
              O Guia Viver em Alphaville é mantido pela Alpha DL, imobiliária de alto padrão da região. O conteúdo não é patrocinado por condomínios nem
              incorporadoras, e o atendimento só começa quando você pede.
            </p>
            <div className="acoes">
              <Link className="btn cheio" href="/selecao-personalizada?origem=home-final">
                Receber uma seleção para meu perfil
              </Link>
              {whats && (
                <LinkRastreado className="btn" href={whats} ctaId="home-whatsapp" evento="whatsapp_click">
                  Conversar no WhatsApp
                </LinkRastreado>
              )}
            </div>
          </div>
          <div className="passos">
            <div><b>1</b><div><strong>Conte o que procura</strong><p>Objetivo, faixa de investimento, prazo e residenciais de interesse.</p></div></div>
            <div><b>2</b><div><strong>Receba uma seleção</strong><p>Casas que combinam com o seu perfil, escolhidas por um especialista.</p></div></div>
            <div><b>3</b><div><strong>Visite com quem conhece</strong><p>Um corretor da Alpha DL acompanha as visitas e a negociação.</p></div></div>
          </div>
        </div>
      </section>
    </>
  );
}
