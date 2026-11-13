/**
 * Checagem editorial. Roda antes do build (npm run build) e falha se houver problema.
 * - valida o frontmatter de artigos e as fichas de condomínios
 * - impede duas páginas com a mesma palavra-chave principal (canibalização)
 * - impede publicar texto com marcação <Apurar> pendente
 * - avisa sobre conteúdos com revisão vencida
 * Gera content/inventario.csv com o registro editorial.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { artigoSchema, condominioSchema, autorSchema, statusVisivel } from "../src/lib/schema.ts";

const raiz = path.join(import.meta.dirname, "..", "content");
const erros: string[] = [];
const avisos: string[] = [];
const hoje = new Date().toISOString().slice(0, 10);
const linhas = [["tipo", "slug", "url", "pilar", "palavra_chave", "status", "autor", "revisor", "publicado_em", "atualizado_em", "revisar_ate", "fontes", "pendencias_apurar", "cta"]];
const chaves = new Map<string, string>();
const ler = (dir: string, ext: string) => (fs.existsSync(path.join(raiz, dir)) ? fs.readdirSync(path.join(raiz, dir)).filter((f) => f.endsWith(ext)) : []);

const autores = new Set<string>();
for (const f of ler("autores", ".json")) {
  const r = autorSchema.safeParse(JSON.parse(fs.readFileSync(path.join(raiz, "autores", f), "utf8")));
  if (!r.success) erros.push(`autores/${f}: ${r.error.issues.map((i) => i.path.join(".") + " " + i.message).join("; ")}`);
  else autores.add(r.data.slug);
}

for (const f of ler("artigos", ".mdx")) {
  const { data, content } = matter(fs.readFileSync(path.join(raiz, "artigos", f), "utf8"));
  const r = artigoSchema.safeParse(data);
  if (!r.success) {
    erros.push(`artigos/${f}: ${r.error.issues.map((i) => i.path.join(".") + " " + i.message).join("; ")}`);
    continue;
  }
  const a = r.data;
  const slug = f.replace(/\.mdx$/, "");
  const pend = (content.match(/<Apurar>/g) || []).length;
  const chave = a.palavraChavePrincipal.toLowerCase().trim();
  if (chaves.has(chave)) erros.push(`artigos/${f}: palavra-chave principal "${chave}" já usada em ${chaves.get(chave)}`);
  chaves.set(chave, f);
  if (!autores.has(a.autor)) erros.push(`artigos/${f}: autor "${a.autor}" não existe em content/autores`);
  if (a.revisor && !autores.has(a.revisor)) erros.push(`artigos/${f}: revisor "${a.revisor}" não existe em content/autores`);
  if (statusVisivel(a.status) && pend) erros.push(`artigos/${f}: ${pend} trecho(s) <Apurar> pendente(s) em conteúdo publicado`);
  if (statusVisivel(a.status) && a.revisarAte && a.revisarAte < hoje) avisos.push(`artigos/${f}: revisão vencida em ${a.revisarAte}`);
  linhas.push(["artigo", slug, `/${a.pilar}/${slug}`, a.pilar, a.palavraChavePrincipal, a.status, a.autor, a.revisor ?? "", a.publicadoEm ?? "", a.atualizadoEm ?? "", a.revisarAte ?? "", String(a.fontes.length), String(pend), a.cta.tipo]);
}

for (const f of ler("condominios", ".json")) {
  const r = condominioSchema.safeParse(JSON.parse(fs.readFileSync(path.join(raiz, "condominios", f), "utf8")));
  if (!r.success) {
    erros.push(`condominios/${f}: ${r.error.issues.map((i) => i.path.join(".") + " " + i.message).join("; ")}`);
    continue;
  }
  const c = r.data;
  if (c.slug !== f.replace(/\.json$/, "")) erros.push(`condominios/${f}: slug diferente do nome do arquivo`);
  if (statusVisivel(c.status) && c.revisarAte && c.revisarAte < hoje) avisos.push(`condominios/${f}: revisão vencida em ${c.revisarAte}`);
  const pend = Object.values(c.campos).filter((d) => d.estado === "a-verificar").length;
  linhas.push(["condominio", c.slug, `/condominios/${c.slug}`, "condominios", c.nome.toLowerCase(), c.status, "", c.especialista ?? "", "", c.atualizadoEm ?? "", c.revisarAte ?? "", "", String(pend), "imoveis-alphadl"]);
}

fs.writeFileSync(path.join(raiz, "inventario.csv"), linhas.map((l) => l.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n") + "\n");
for (const a of avisos) console.warn("aviso:", a);
if (erros.length) {
  for (const e of erros) console.error("erro:", e);
  process.exit(1);
}
const pub = linhas.slice(1).filter((l) => l[5] === "publicado" || l[5] === "em-atualizacao").length;
console.log(`Conteúdo OK: ${linhas.length - 1} itens, ${pub} publicados, ${linhas.length - 1 - pub} em produção.`);
