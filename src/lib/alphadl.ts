import fs from "node:fs";
import path from "node:path";
import { site, type Pilar } from "./site";

type Origem = { campanha: string; conteudo: string };

/** Link para alphadl.com.br com UTMs, para atribuir visitas e leads à página de origem. */
export function linkAlphaDL(caminho = "/", origem: Origem) {
  const u = new URL(caminho, "https://www.alphadl.com.br");
  u.searchParams.set("utm_source", "guiaviveremalphaville");
  u.searchParams.set("utm_medium", "referral");
  u.searchParams.set("utm_campaign", origem.campanha);
  u.searchParams.set("utm_content", origem.conteudo);
  return u.toString();
}

/** Link de WhatsApp com mensagem que cita a página de origem. */
export function linkWhatsApp(mensagem: string) {
  if (!site.whatsapp) return "";
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

/* ---------- Leituras: artigos do blog da Alpha DL, por seção ---------- */

export type Leitura = { titulo: string; caminho: string };

/**
 * Os artigos informativos ficam no blog da Alpha DL. O guia não repete esses temas:
 * aponta para eles. Lista curada em content/leituras.json.
 */
export function leituras(pilar: Pilar): Leitura[] {
  const arq = path.join(process.cwd(), "content", "leituras.json");
  if (!fs.existsSync(arq)) return [];
  const dados = JSON.parse(fs.readFileSync(arq, "utf8")) as Record<string, Leitura[]>;
  return dados[pilar] ?? [];
}

/* ---------- Vitrine: imóveis do portfólio da Alpha DL ---------- */

/** Formato do arquivo de portfólio publicado em alphadl.com.br. */
export type ImovelPortfolio = {
  tipo: string;
  fin: string;
  q: number;
  ban: number;
  vg: number;
  area: number;
  bairro: string;
  cidade: string;
  preco: number;
  condominio?: string;
};

export type ImovelVitrine = { titulo: string; local: string; caminho: string; preco: string; finalidade: "venda" | "locacao"; specs: string[] };

const FEED_PADRAO = "https://www.alphadl.com.br/portfolio-alphadl-60-imoveis.json";
const PRECO_MINIMO = 3_000_000;

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Mesma regra de endereço usada pelo site da Alpha DL (scripts/gerar-paginas-imoveis.mjs). */
export function caminhoImovel(p: ImovelPortfolio, idx: number) {
  const local = p.condominio || p.bairro;
  return `/imovel/${slugify(`${p.tipo}-${local}-${p.cidade}`)}-adl-${String(idx + 1).padStart(4, "0")}`;
}

/** Escolhe as casas de alto padrão da região para a vitrine, da mais cara para a mais barata. */
export function selecionarVitrine(portfolio: ImovelPortfolio[], quantos = 3): ImovelVitrine[] {
  return portfolio
    .map((p, idx) => ({ p, idx }))
    .filter(({ p }) => p.tipo === "casa" && p.preco >= PRECO_MINIMO && ["Barueri", "Santana de Parnaíba"].includes(p.cidade))
    .sort((a, b) => b.p.preco - a.p.preco)
    .slice(0, quantos)
    .map(({ p, idx }) => ({
      titulo: `Casa com ${p.q} quartos`,
      local: `${p.condominio || p.bairro} · ${p.cidade}`,
      caminho: caminhoImovel(p, idx),
      preco: p.fin === "venda" ? `R$ ${p.preco.toLocaleString("pt-BR")}` : `R$ ${p.preco.toLocaleString("pt-BR")}/mês`,
      finalidade: p.fin === "venda" ? "venda" : "locacao",
      specs: [`${p.q} quartos`, `${p.area.toLocaleString("pt-BR")} m²`, ...(p.vg ? [`${p.vg} vagas`] : [])],
    }));
}

/**
 * Lê o portfólio da Alpha DL e revalida a cada hora.
 * Se a leitura falhar, devolve lista vazia e a home mostra só o link para alphadl.com.br (nunca inventa imóveis).
 */
export async function vitrineAlphaDL(): Promise<ImovelVitrine[]> {
  const url = process.env.ALPHADL_FEED_URL || FEED_PADRAO;
  try {
    const r = await fetch(url, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) });
    if (!r.ok) return [];
    const dados = (await r.json()) as ImovelPortfolio[];
    return Array.isArray(dados) ? selecionarVitrine(dados) : [];
  } catch {
    return [];
  }
}
