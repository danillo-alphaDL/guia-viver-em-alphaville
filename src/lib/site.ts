export const site = {
  nome: "Guia Viver em Alphaville",
  nomeCurto: "Viver em Alphaville",
  dominio: "guiaviveremalphaville.com.br",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.guiaviveremalphaville.com.br").replace(/\/$/, ""),
  slogan: "O guia para descobrir, escolher e viver o melhor de Alphaville.",
  descricao:
    "Guia editorial sobre morar, comprar e alugar casas de alto padrão em Alphaville e Tamboré: residenciais comparados com critérios públicos, custos reais e informação verificada.",
  mantenedor: {
    nome: "Alpha DL",
    url: "https://alphadl.com.br",
  },
  regiao: "Alphaville e Tamboré, em Barueri e Santana de Parnaíba (SP)",
  // Mesmo número do atendimento em alphadl.com.br
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_ALPHADL || "5511913312662",
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
} as const;

/** Rascunhos só aparecem quando explicitamente pedido (preview), nunca por padrão. */
export const mostrarRascunhos = process.env.GUIA_MOSTRAR_RASCUNHOS === "1";

export const pilares = {
  comprar: {
    titulo: "Comprar em Alphaville",
    menu: "Comprar",
    descricao: "Faixas de investimento, custos de aquisição e como avaliar uma casa de alto padrão em Alphaville e Tamboré.",
    cena: "j2",
  },
  alugar: {
    titulo: "Alugar em Alphaville",
    menu: "Alugar",
    descricao: "Locação de casas de alto padrão: custo mensal completo, garantias, contratos e casas mobiliadas.",
    cena: "i3",
  },
  condominios: {
    titulo: "Residenciais de Alphaville e Tamboré",
    menu: "Condomínios",
    descricao: "Guias de cada residencial com ficha verificada, vantagens, limitações e comparativos com critérios públicos.",
    cena: "c1",
  },
  viver: {
    titulo: "Viver em Alphaville",
    menu: "Viver",
    descricao: "Escolas, mobilidade, clubes, serviços e a rotina de quem mora na região.",
    cena: "estilo",
  },
  mercado: {
    titulo: "Mercado imobiliário de alto padrão",
    menu: "Mercado",
    descricao: "Análises e relatórios sobre compra e locação de casas de alto padrão na região, com metodologia declarada.",
    cena: "g3",
  },
} as const;

export type Pilar = keyof typeof pilares;
export const listaPilares = Object.keys(pilares) as Pilar[];
