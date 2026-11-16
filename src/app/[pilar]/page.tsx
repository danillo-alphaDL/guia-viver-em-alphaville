import { notFound } from "next/navigation";
import Link from "next/link";
import { Cena } from "@/components/Cena";
import { Migalha } from "@/components/Migalha";
import { CardArtigo, CardCondominio } from "@/components/Cards";
import { Cta } from "@/components/Cta";
import { artigosDoPilar, condominios } from "@/lib/content";
import { LinkRastreado } from "@/components/LinkRastreado";
import { leituras, linkAlphaDL } from "@/lib/alphadl";
import { meta } from "@/lib/seo";
import { listaPilares, pilares, type Pilar } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => listaPilares.map((pilar) => ({ pilar }));

type Props = { params: Promise<{ pilar: string }> };
const ehPilar = (p: string): p is Pilar => p in pilares;

export async function generateMetadata({ params }: Props) {
  const { pilar } = await params;
  if (!ehPilar(pilar)) return {};
  return meta({ titulo: pilares[pilar].titulo, descricao: pilares[pilar].descricao, caminho: `/${pilar}` });
}

export default async function PaginaPilar({ params }: Props) {
  const { pilar } = await params;
  if (!ehPilar(pilar)) notFound();
  const p = pilares[pilar];
  const lista = artigosDoPilar(pilar);
  const conds = pilar === "condominios" ? condominios() : [];
  const lidas = leituras(pilar);
  const vazio = pilar === "condominios" && conds.length === 0;

  return (
    <>
      <section className="pg-hero">
        <Cena nome={p.cena} />
        <div className="wrap">
          <Migalha itens={[{ nome: p.menu, caminho: `/${pilar}` }]} />
          <h1>{p.titulo}</h1>
          <p className="lead">{p.descricao}</p>
        </div>
      </section>
      <div className="claro">
        <div className="wrap" style={{ paddingBlock: "72px 104px", display: "grid", gap: 72 }}>
          {conds.length > 0 && (
            <section className="sem-hero" style={{ padding: 0 }} aria-labelledby="h-guias">
              <div className="cab-sec">
                <div>
                  <span className="rot bronze">Guias</span>
                  <h2 id="h-guias">Residenciais</h2>
                </div>
                <Link className="link-seta" href="/ferramentas/comparador">
                  Comparar lado a lado
                </Link>
              </div>
              <div className="grade-cond">
                {conds.map((c) => (
                  <CardCondominio key={c.slug} c={c} />
                ))}
              </div>
            </section>
          )}
          {lista.length > 0 && (
            <section style={{ padding: 0 }} aria-labelledby="h-artigos">
              <div className="cab-sec">
                <div>
                  <span className="rot bronze">Jornal</span>
                  <h2 id="h-artigos">Guias e análises</h2>
                </div>
              </div>
              <div className="lista-artigos">
                {lista.map((a) => (
                  <CardArtigo key={a.slug} a={a} />
                ))}
              </div>
            </section>
          )}
          {vazio && (
            <div className="vazio">
              <span className="rot bronze">Fichas em apuração</span>
              <p>As fichas dos residenciais estão em apuração. Só publicamos uma ficha depois de verificar cada dado com fonte e data.</p>
            </div>
          )}
          {lidas.length > 0 && (
            <section style={{ padding: 0 }} aria-labelledby="h-leituras">
              <div className="cab-sec">
                <div>
                  <span className="rot bronze">No blog da Alpha DL</span>
                  <h2 id="h-leituras">Leituras recomendadas</h2>
                </div>
              </div>
              <ul className="leituras">
                {lidas.map((l, i) => (
                  <li key={l.caminho}>
                    <LinkRastreado href={linkAlphaDL(l.caminho, { campanha: `pilar-${pilar}`, conteudo: "leituras" })} ctaId={`leitura-${pilar}-${i}`} evento="outbound_alphadl">
                      <span>{l.titulo}</span>
                      <small>alphadl.com.br</small>
                    </LinkRastreado>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <Cta tipo={pilar === "condominios" ? "comparador" : "selecao-personalizada"} origem={`pilar-${pilar}`} />
        </div>
      </div>
    </>
  );
}
