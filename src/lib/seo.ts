import type { Metadata } from "next";
import { site } from "./site";
import { IMAGEM_SOCIAL } from "./marca";
import type { Artigo, CondominioComp } from "./content";
import type { Autor } from "./schema";

type Meta = { titulo: string; descricao: string; caminho: string; rascunho?: boolean; tipo?: "website" | "article"; publicado?: string | null; atualizado?: string | null };

export function meta({ titulo, descricao, caminho, rascunho, tipo = "website", publicado, atualizado }: Meta): Metadata {
  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: caminho },
    robots: rascunho ? { index: false, follow: false } : undefined,
    openGraph: {
      type: tipo,
      title: titulo,
      description: descricao,
      url: caminho,
      siteName: site.nome,
      locale: "pt_BR",
      images: [IMAGEM_SOCIAL],
      ...(tipo === "article" ? { publishedTime: publicado ?? undefined, modifiedTime: atualizado ?? undefined } : {}),
    },
    twitter: { card: "summary_large_image", title: titulo, description: descricao, images: [IMAGEM_SOCIAL] },
  };
}

const abs = (p: string) => `${site.url}${p}`;

export const ldOrganizacao = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": abs("/#organizacao"),
  name: site.nome,
  url: site.url,
  description: site.descricao,
  logo: { "@type": "ImageObject", url: abs("/branding/icone-512x512.png"), width: 512, height: 512 },
  parentOrganization: { "@type": "RealEstateAgent", name: site.mantenedor.nome, url: site.mantenedor.url },
});

export const ldWebsite = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": abs("/#site"),
  name: site.nome,
  url: site.url,
  inLanguage: "pt-BR",
  publisher: { "@id": abs("/#organizacao") },
});

export const ldBreadcrumb = (itens: { nome: string; caminho: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: itens.map((i, n) => ({ "@type": "ListItem", position: n + 1, name: i.nome, item: abs(i.caminho) })),
});

export const ldRevisao = (a: Artigo, revisor?: Autor) =>
  revisor
    ? {
        "@context": "https://schema.org",
        "@type": "WebPage",
        url: abs(a.url),
        reviewedBy: { "@type": "Person", name: revisor.nome, url: abs(`/autores/${revisor.slug}`) },
        lastReviewed: a.atualizadoEm ?? a.publicadoEm ?? undefined,
      }
    : null;

export const ldArtigo = (a: Artigo, autor?: Autor) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: a.titulo,
  description: a.descricao,
  inLanguage: "pt-BR",
  mainEntityOfPage: abs(a.url),
  datePublished: a.publicadoEm ?? undefined,
  dateModified: a.atualizadoEm ?? a.publicadoEm ?? undefined,
  author: autor
    ? { "@type": autor.tipo === "pessoa" ? "Person" : "Organization", name: autor.nome, url: abs(`/autores/${autor.slug}`) }
    : { "@id": abs("/#organizacao") },
  publisher: { "@id": abs("/#organizacao") },
  citation: a.fontes.filter((f) => f.url).map((f) => f.url),
});

/** Só emite FAQPage com o conteúdo visível na página. Não prometemos rich result. */
export const ldFaq = (faq: { pergunta: string; resposta: string }[]) =>
  faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({ "@type": "Question", name: f.pergunta, acceptedAnswer: { "@type": "Answer", text: f.resposta } })),
      }
    : null;

export const ldCondominio = (c: CondominioComp) => {
  const valor = c.campos.municipio?.estado === "verificado" ? c.campos.municipio.valor : null;
  // Residencial dividido entre dois municípios (ex.: "Barueri (1ª fase) e Santana de Parnaíba (2ª fase)") não cabe num endereço único.
  const municipio = valor && !/[()]| e /.test(valor) ? valor : null;
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: c.nome,
    description: c.resumo,
    url: abs(c.url),
    ...(municipio
      ? {
          address: { "@type": "PostalAddress", addressLocality: municipio, addressRegion: "SP", addressCountry: "BR" },
          containedInPlace: { "@type": "City", name: `${municipio}, SP` },
        }
      : {}),
  };
};
