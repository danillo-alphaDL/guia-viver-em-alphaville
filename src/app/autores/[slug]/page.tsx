import { notFound } from "next/navigation";
import { PaginaSimples } from "@/components/PaginaSimples";
import { CardArtigo } from "@/components/Cards";
import { JsonLd } from "@/components/JsonLd";
import { artigos, autor, autores } from "@/lib/content";
import { meta } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => autores().map((a) => ({ slug: a.slug }));
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const a = autor((await params).slug);
  if (!a) return {};
  return meta({ titulo: `${a.nome}, ${a.cargo}`, descricao: a.bio.slice(0, 160), caminho: `/autores/${a.slug}` });
}

export default async function PaginaAutor({ params }: Props) {
  const a = autor((await params).slug);
  if (!a) notFound();
  const textos = artigos().filter((t) => t.autor === a.slug || t.revisor === a.slug);
  return (
    <PaginaSimples rotulo={a.nome} titulo={a.nome} lead={`${a.cargo}${a.creci ? ` · CRECI ${a.creci}` : ""}`} caminho={`/autores/${a.slug}`}>
      <div style={{ display: "grid", gap: 64 }}>
        <p className="prosa" style={{ fontSize: "1.15rem" }}>{a.bio}</p>
        {textos.length > 0 && (
          <div className="lista-artigos">
            {textos.map((t) => (
              <CardArtigo key={t.slug} a={t} />
            ))}
          </div>
        )}
      </div>
      <JsonLd dados={{ "@context": "https://schema.org", "@type": a.tipo === "pessoa" ? "Person" : "Organization", name: a.nome, description: a.bio, url: `${site.url}/autores/${a.slug}`, sameAs: a.sameAs }} />
    </PaginaSimples>
  );
}
