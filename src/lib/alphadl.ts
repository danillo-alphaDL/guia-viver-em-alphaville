import { site } from "./site";

type Origem = { campanha: string; conteudo: string };

/** Link para alphadl.com.br com UTMs, para atribuir leads ao conteúdo de origem. */
export function linkAlphaDL(caminho = "/", origem: Origem) {
  const u = new URL(caminho, site.mantenedor.url);
  u.searchParams.set("utm_source", "guiaviveremalphaville");
  u.searchParams.set("utm_medium", "referral");
  u.searchParams.set("utm_campaign", origem.campanha);
  u.searchParams.set("utm_content", origem.conteudo);
  return u.toString();
}

/** Link de WhatsApp com mensagem que cita a página de origem. Vazio se o número não estiver configurado. */
export function linkWhatsApp(mensagem: string) {
  if (!site.whatsapp) return "";
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

export type ImovelVitrine = {
  titulo: string;
  condominio: string;
  url: string;
  imagem?: string;
  finalidade: "venda" | "locacao";
  preco?: string;
  specs: string[];
};

/** Vitrine alimentada pelo estoque da Alpha DL. Sem feed configurado, não exibe nada (nunca inventa imóveis). */
export async function vitrineAlphaDL(): Promise<ImovelVitrine[]> {
  const url = process.env.ALPHADL_FEED_URL;
  if (!url) return [];
  try {
    const r = await fetch(url, { next: { revalidate: 3600 } });
    if (!r.ok) return [];
    const dados = (await r.json()) as ImovelVitrine[];
    return Array.isArray(dados) ? dados.slice(0, 6) : [];
  } catch {
    return [];
  }
}
