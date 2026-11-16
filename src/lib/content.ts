import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import {
  artigoSchema,
  autorSchema,
  condominioSchema,
  statusVisivel,
  type ArtigoMeta,
  type Autor,
  type Condominio,
} from "./schema";
import { mostrarRascunhos, type Pilar } from "./site";

const RAIZ = path.join(process.cwd(), "content");

export type Artigo = ArtigoMeta & {
  slug: string;
  corpo: string;
  minutos: number;
  url: string;
  rascunho: boolean;
};

function erro(arquivo: string, e: unknown): never {
  const detalhe = e && typeof e === "object" && "issues" in e ? JSON.stringify((e as { issues: unknown }).issues, null, 2) : String(e);
  throw new Error(`Conteúdo inválido em ${arquivo}:\n${detalhe}`);
}

export function urlArtigo(pilar: Pilar, slug: string) {
  return `/${pilar}/${slug}`;
}

/** Todos os artigos, inclusive rascunhos. Use as funções filtradas nas páginas. */
export const todosArtigos = cache((): Artigo[] => {
  const dir = path.join(RAIZ, "artigos");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((arquivo) => {
      const bruto = fs.readFileSync(path.join(dir, arquivo), "utf8");
      const { data, content } = matter(bruto);
      const r = artigoSchema.safeParse(data);
      if (!r.success) erro(arquivo, r.error);
      const slug = arquivo.replace(/\.mdx$/, "");
      const palavras = content.split(/\s+/).filter(Boolean).length;
      return {
        ...r.data,
        slug,
        corpo: content,
        minutos: Math.max(1, Math.round(palavras / 220)),
        url: urlArtigo(r.data.pilar, slug),
        rascunho: !statusVisivel(r.data.status),
      };
    });
});

const visivel = (rascunho: boolean) => !rascunho || mostrarRascunhos;

const ordenar = (a: Artigo, b: Artigo) =>
  (b.atualizadoEm || b.publicadoEm || "").localeCompare(a.atualizadoEm || a.publicadoEm || "");

export function artigos(): Artigo[] {
  return todosArtigos().filter((a) => visivel(a.rascunho)).sort(ordenar);
}

export function artigosDoPilar(p: Pilar): Artigo[] {
  return artigos().filter((a) => a.pilar === p);
}

export function artigo(pilar: Pilar, slug: string): Artigo | undefined {
  return artigos().find((a) => a.pilar === pilar && a.slug === slug);
}

export function artigoPorSlug(slug: string): Artigo | undefined {
  return artigos().find((a) => a.slug === slug);
}

export type CondominioComp = Condominio & { rascunho: boolean; url: string };

export const todosCondominios = cache((): CondominioComp[] => {
  const dir = path.join(RAIZ, "condominios");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((arquivo) => {
      const r = condominioSchema.safeParse(JSON.parse(fs.readFileSync(path.join(dir, arquivo), "utf8")));
      if (!r.success) erro(arquivo, r.error);
      return { ...r.data, rascunho: !statusVisivel(r.data.status), url: `/condominios/${r.data.slug}` };
    })
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR", { numeric: true }));
});

export function condominios(): CondominioComp[] {
  return todosCondominios().filter((c) => visivel(c.rascunho));
}

export function condominio(slug: string) {
  return condominios().find((c) => c.slug === slug);
}

export const autores = cache((): Autor[] => {
  const dir = path.join(RAIZ, "autores");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((arquivo) => {
      const r = autorSchema.safeParse(JSON.parse(fs.readFileSync(path.join(dir, arquivo), "utf8")));
      if (!r.success) erro(arquivo, r.error);
      return r.data;
    });
});

export function autor(slug: string): Autor | undefined {
  return autores().find((a) => a.slug === slug);
}
