import type { MetadataRoute } from "next";
import { artigos, autores, condominios } from "@/lib/content";
import { listaPilares, site } from "@/lib/site";

/** Só páginas publicadas. lastModified usa a data real de atualização do conteúdo, nunca a data do build. */
export default function sitemap(): MetadataRoute.Sitemap {
  const publicados = artigos().filter((a) => !a.rascunho);
  const conds = condominios().filter((c) => !c.rascunho);
  const fixas = ["", ...listaPilares.map((p) => `/${p}`), "/ferramentas", "/ferramentas/custo-de-morar", "/ferramentas/comparador", "/selecao-personalizada", "/sobre", "/metodologia", "/politica-editorial", "/privacidade"];
  return [
    ...fixas.map((c) => ({ url: `${site.url}${c}` })),
    ...publicados.map((a) => ({ url: `${site.url}${a.url}`, lastModified: a.atualizadoEm ?? a.publicadoEm ?? undefined })),
    ...conds.map((c) => ({ url: `${site.url}${c.url}`, lastModified: c.atualizadoEm ?? undefined })),
    ...autores().map((a) => ({ url: `${site.url}/autores/${a.slug}` })),
  ];
}
