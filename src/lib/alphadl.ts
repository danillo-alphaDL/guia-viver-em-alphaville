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

/** Formato de cada imóvel da vitrine pública de alphadl.com.br (/api/vitrine). */
export type ImovelPortfolio = {
  /** Código do anúncio (ADL-0000) e endereço da página, vindos do banco da Alpha DL. */
  codigo?: string;
  slug?: string;
  capaUrl?: string | null;
  suites?: number;
  /** Área do terreno, quando o anúncio informa. */
  areaTotal?: number;
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

export type ImovelVitrine = { titulo: string; local: string; caminho: string; preco: string; finalidade: "venda" | "locacao"; specs: string[]; /** Foto de capa do anúncio na Alpha DL, quando existe. */ foto: string | null; /** Título sem o lugar, para páginas que já são do residencial. */ resumo: string; /** Texto alternativo da foto. */ alt: string; cidade: string };

const FEED_PADRAO = "https://www.alphadl.com.br/api/vitrine";
const PRECO_MINIMO = 3_000_000;

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Endereço da página do imóvel: o slug real do banco; sem ele, a regra antiga do arquivo da fase 1. */
export function caminhoImovel(p: ImovelPortfolio, idx: number) {
  if (p.slug) return `/imovel/${p.slug}`;
  const local = p.condominio || p.bairro;
  return `/imovel/${slugify(`${p.tipo}-${local}-${p.cidade}`)}-adl-${String(idx + 1).padStart(4, "0")}`;
}


/* ---------- Texto dos cartões de imóvel ---------- */
// O que as pessoas digitam no Google (autocompletar, 18/11/2026): "casa alphaville residencial 1",
// "casa alphaville 4 quartos", "casa alphaville 4 barueri". Por isso o título leva o tipo, a venda,
// os quartos e o residencial, e a cidade fica no rótulo de cima: há dezenas de Alphavilles no país.
// Nada é inventado: cada parte sai de um campo do anúncio, e o que falta não entra.

const num = (n: number) => n.toLocaleString("pt-BR");

/** Nome do residencial como as pessoas buscam ("Alphaville Residencial 1"), a partir do cadastro. */
export function nomeLocal(p: Pick<ImovelPortfolio, "condominio" | "bairro">): string {
  const bruto = (p.condominio || "").trim();
  if (bruto) {
    const m = bruto.match(/^(?:alphaville\s+)?residencial\s+(?:alpha(?:ville)?\s+)?(\d+|zero)$/i);
    if (m) return `Alphaville Residencial ${m[1].toLowerCase() === "zero" ? "0" : m[1]}`;
    return bruto;
  }
  return (p.bairro || "").replace(/\s*\(.*\)$/, "").trim();
}

function quartosTexto(p: ImovelPortfolio): string {
  const s = p.suites ?? 0;
  if (s > 0 && s >= p.q) return `${p.q} suítes`;
  if (s > 0) return `${p.q} quartos (${s} ${s === 1 ? "suíte" : "suítes"})`;
  return `${p.q} quartos`;
}

export function textoCartao(p: ImovelPortfolio) {
  const local = nomeLocal(p);
  const venda = p.fin === "venda" ? "à venda" : "para alugar";
  if (p.tipo === "terreno") {
    const resumo = `Terreno ${venda} de ${num(p.area)} m²`;
    return {
      titulo: local ? `${resumo} no ${local}` : resumo,
      resumo,
      rotulo: [local, p.cidade].filter(Boolean).join(" · "),
      specs: [`${num(p.area)} m² de terreno`],
      alt: `${resumo}${local ? ` no ${local}` : ""}, ${p.cidade}`,
    };
  }
  const tipo = p.tipo === "apartamento" ? "Apartamento" : "Casa";
  const resumo = p.q > 0 ? `${tipo} ${venda} com ${quartosTexto(p)}` : `${tipo} ${venda}`;
  const specs = [
    `${num(p.area)} m² construídos`,
    ...(p.areaTotal && p.areaTotal > p.area ? [`terreno de ${num(p.areaTotal)} m²`] : []),
    ...(p.vg ? [`${p.vg} vagas`] : []),
  ];
  return {
    titulo: local ? `${resumo} no ${local}` : resumo,
    resumo: `${resumo} e ${num(p.area)} m²`,
    rotulo: [local, p.cidade].filter(Boolean).join(" · "),
    specs,
    alt: `${tipo} ${venda} ${local ? `no ${local}, ` : "em "}${p.cidade}: ${quartosTexto(p)}, ${num(p.area)} m² construídos`,
  };
}

/** Escolhe as casas de alto padrão da região para a vitrine, da mais cara para a mais barata. */
export function selecionarVitrine(portfolio: ImovelPortfolio[], quantos = 3): ImovelVitrine[] {
  return portfolio
    .map((p, idx) => ({ p, idx }))
    .filter(({ p }) => p.fin === "venda" && p.tipo === "casa" && p.preco >= PRECO_MINIMO && ["Barueri", "Santana de Parnaíba"].includes(p.cidade))
    .sort((a, b) => Number(Boolean(b.p.capaUrl)) - Number(Boolean(a.p.capaUrl)) || b.p.preco - a.p.preco)
    .slice(0, quantos)
    .map(({ p, idx }) => ({ p, idx, t: textoCartao(p) }))
    .map(({ p, idx, t }) => ({
      titulo: t.titulo,
      resumo: t.resumo,
      alt: t.alt,
      cidade: p.cidade,
      local: t.rotulo,
      caminho: caminhoImovel(p, idx),
      foto: p.capaUrl ?? null,
      preco: p.fin === "venda" ? `R$ ${p.preco.toLocaleString("pt-BR")}` : `R$ ${p.preco.toLocaleString("pt-BR")}/mês`,
      finalidade: p.fin === "venda" ? "venda" : "locacao",
      specs: t.specs,
    }));
}

/** Lê o portfólio público da Alpha DL e revalida a cada hora. Falha devolve lista vazia (nunca inventa imóveis). */
export async function portfolioAlphaDL(): Promise<ImovelPortfolio[]> {
  const url = process.env.ALPHADL_FEED_URL || FEED_PADRAO;
  try {
    const r = await fetch(url, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) });
    if (!r.ok) return [];
    // /api/vitrine responde { imoveis: [...] }; o arquivo antigo era a lista pura.
    const dados = (await r.json()) as ImovelPortfolio[] | { imoveis?: ImovelPortfolio[] };
    const lista = Array.isArray(dados) ? dados : dados.imoveis;
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

export async function vitrineAlphaDL(): Promise<ImovelVitrine[]> {
  return selecionarVitrine(await portfolioAlphaDL());
}

/* ---------- Casas de um residencial ---------- */

export type ImovelResidencial = ImovelVitrine & { tipo: string; precoNumero: number; codigo: string };

const normaliza = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\bum\b/g, "1")
    .replace(/\bdois\b/g, "2")
    .replace(/\bnove\b/g, "9")
    .replace(/\bzero\b/g, "0")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/**
 * Imóveis do portfólio cujo residencial (campo condomínio, ou bairro quando ele já nomeia o residencial)
 * é este. A descrição do anúncio não conta: só o residencial cadastrado.
 */
export async function imoveisDoResidencial(nome: string): Promise<ImovelResidencial[]> {
  const alvo = normaliza(nome);
  const lista = await portfolioAlphaDL();
  return lista
    .map((p, idx) => ({ p, idx }))
    .filter(({ p }) => p.fin === "venda" && (p.tipo === "casa" || p.tipo === "terreno"))
    .filter(({ p }) => normaliza(p.condominio || "") === alvo || normaliza(p.bairro || "") === alvo)
    .sort((a, b) => Number(Boolean(b.p.capaUrl)) - Number(Boolean(a.p.capaUrl)) || b.p.preco - a.p.preco)
    .map(({ p, idx }) => ({ p, idx, t: textoCartao(p) }))
    .map(({ p, idx, t }) => ({
      tipo: p.tipo,
      precoNumero: p.preco,
      codigo: p.codigo ?? `ADL-${String(idx + 1).padStart(4, "0")}`,
      titulo: t.titulo,
      resumo: t.resumo,
      alt: t.alt,
      cidade: p.cidade,
      local: t.rotulo,
      caminho: caminhoImovel(p, idx),
      foto: p.capaUrl ?? null,
      preco: `R$ ${p.preco.toLocaleString("pt-BR")}`,
      finalidade: "venda" as const,
      specs: t.specs,
    }));
}

/** Página do residencial no site da Alpha DL (mesmo endereço, salvo exceções). */
const RESIDENCIAL_NA_ALPHADL: Record<string, string | null> = {
  "alphaville-burle-marx": "residencial-burle-marx",
  "valville-1": "valville",
  "alphaville-residencial-6": null,
  "tambore-1": null,
  "tambore-2": null,
  "tambore-3": null,
  "tambore-10": null,
  "tambore-11": null,
};

export function caminhoResidencialAlphaDL(slug: string) {
  const s = slug in RESIDENCIAL_NA_ALPHADL ? RESIDENCIAL_NA_ALPHADL[slug] : slug;
  return s ? `/condominios/${s}` : "/imoveis";
}

/* ---------- Números do mercado (portfólio da Alpha DL) ---------- */

export type Mercado = {
  casas: number;
  mediana: number;
  p25: number;
  p75: number;
  data: string;
};

const quantil = (v: number[], p: number) => {
  const s = [...v].sort((a, b) => a - b);
  const k = (s.length - 1) * p;
  const f = Math.floor(k);
  return s[f] + (s[Math.min(f + 1, s.length - 1)] - s[f]) * (k - f);
};

/** Casas à venda em Barueri e Santana de Parnaíba. Abaixo de 5 casas não há faixa (mesma regra do Radar da Alpha DL). */
export function mercadoAgora(portfolio: ImovelPortfolio[]): Mercado | null {
  const precos = portfolio
    .filter((p) => p.tipo === "casa" && p.fin === "venda" && ["Barueri", "Santana de Parnaíba"].includes(p.cidade) && p.preco > 0)
    .map((p) => p.preco);
  if (precos.length < 5) return null;
  return {
    casas: precos.length,
    mediana: quantil(precos, 0.5),
    p25: quantil(precos, 0.25),
    p75: quantil(precos, 0.75),
    data: new Date().toISOString().slice(0, 10),
  };
}

/** Destaques variados: as mais caras primeiro, uma por residencial antes de repetir. */
export function destaquesVariados(portfolio: ImovelPortfolio[], quantos = 6): ImovelVitrine[] {
  const todas = selecionarVitrine(portfolio, 40);
  const vistos = new Set<string>();
  const primeiro: ImovelVitrine[] = [];
  const resto: ImovelVitrine[] = [];
  for (const i of todas) (vistos.has(i.local) ? resto : (vistos.add(i.local), primeiro)).push(i);
  return [...primeiro, ...resto].slice(0, quantos);
}

/** Quantas casas e terrenos à venda o portfólio tem em cada residencial (pelo nome cadastrado). */
export function contarPorResidencial(portfolio: ImovelPortfolio[], nomes: string[]) {
  const out: Record<string, number> = {};
  for (const n of nomes) {
    const alvo = normaliza(n);
    out[n] = portfolio.filter(
      (p) => p.fin === "venda" && (p.tipo === "casa" || p.tipo === "terreno") && (normaliza(p.condominio || "") === alvo || normaliza(p.bairro || "") === alvo),
    ).length;
  }
  return out;
}

/** Endereço do catálogo da Alpha DL com filtros (parâmetros que o catálogo lê: fin, tipo, regiao, dorm, pmin, pmax). */
export function catalogoAlphaDL(f: { fin?: "venda" | "locacao"; tipo?: string; regiao?: string; dorm?: number; pmin?: number; pmax?: number }, origem: Origem) {
  const q = new URLSearchParams();
  if (f.fin) q.set("fin", f.fin);
  if (f.tipo) q.set("tipo", f.tipo);
  if (f.regiao) q.set("regiao", f.regiao);
  if (f.dorm) q.set("dorm", String(f.dorm));
  if (f.pmin) q.set("pmin", String(f.pmin));
  if (f.pmax) q.set("pmax", String(f.pmax));
  const s = q.toString();
  return linkAlphaDL(`/imoveis${s ? `?${s}` : ""}`, origem);
}

export const milhoes = (v: number) => `R$ ${(v / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mi`;


/** Casas do portfólio numa faixa de preço, da mais cara para a mais barata. */
export async function imoveisPorFaixa(f: { precoMin?: number; precoMax?: number; quartosMin?: number; residenciais?: string[]; tipo?: "casa" | "terreno" }, quantos = 3): Promise<ImovelResidencial[]> {
  const lista = await portfolioAlphaDL();
  return lista
    .map((p, idx) => ({ p, idx }))
    .filter(({ p }) => p.fin === "venda" && p.tipo === (f.tipo ?? "casa") && ["Barueri", "Santana de Parnaíba"].includes(p.cidade))
    .filter(({ p }) => (!f.precoMin || p.preco >= f.precoMin) && (!f.precoMax || p.preco <= f.precoMax))
    .filter(({ p }) => !f.quartosMin || p.q >= f.quartosMin)
    .filter(({ p }) => !f.residenciais?.length || f.residenciais.map(normaliza).some((r) => r === normaliza(p.condominio || "") || r === normaliza(p.bairro || "")))
    .sort((a, b) => Number(Boolean(b.p.capaUrl)) - Number(Boolean(a.p.capaUrl)) || b.p.preco - a.p.preco)
    .slice(0, quantos)
    .map(({ p, idx }) => ({ p, idx, t: textoCartao(p) }))
    .map(({ p, idx, t }) => ({
      tipo: p.tipo,
      precoNumero: p.preco,
      codigo: p.codigo ?? `ADL-${String(idx + 1).padStart(4, "0")}`,
      titulo: t.titulo,
      resumo: t.resumo,
      alt: t.alt,
      cidade: p.cidade,
      local: t.rotulo,
      caminho: caminhoImovel(p, idx),
      foto: p.capaUrl ?? null,
      preco: `R$ ${p.preco.toLocaleString("pt-BR")}`,
      finalidade: "venda" as const,
      specs: t.specs,
    }));
}
