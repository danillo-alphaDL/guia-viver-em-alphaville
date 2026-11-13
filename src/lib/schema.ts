import { z } from "zod";

const data = z.preprocess(
  (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "use AAAA-MM-DD"),
);

export const STATUS = [
  "ideia",
  "em-pesquisa",
  "em-producao",
  "em-revisao-factual",
  "em-originalidade",
  "em-revisao-seo",
  "aguardando-aprovacao",
  "publicado",
  "em-atualizacao",
] as const;
export type Status = (typeof STATUS)[number];

/** Um conteúdo em atualização continua no ar com a versão aprovada. */
export const statusVisivel = (s: Status) => s === "publicado" || s === "em-atualizacao";

export const fonteSchema = z.object({
  titulo: z.string().min(3),
  url: z.string().url().optional(),
  acessadoEm: data,
});

const ctaSchema = z.object({
  tipo: z.enum(["selecao-personalizada", "especialista", "imoveis-alphadl", "ferramenta-custo", "comparador"]),
  contexto: z.string().optional(),
});

export const artigoSchema = z
  .object({
    titulo: z.string().min(10).max(110),
    tituloSeo: z.string().max(65).optional(),
    descricao: z.string().min(70).max(165),
    pilar: z.enum(["comprar", "alugar", "condominios", "viver", "mercado"]),
    palavraChavePrincipal: z.string().min(3),
    palavrasSecundarias: z.array(z.string()).default([]),
    intencao: z.enum(["informacional", "comercial", "transacional", "comparativa", "navegacional"]),
    estagio: z.enum(["descoberta", "consideracao", "decisao"]),
    status: z.enum(STATUS),
    autor: z.string(),
    revisor: z.string().nullable().default(null),
    aprovadoPor: z.string().nullable().default(null),
    resumo: z.string().min(40).describe("Resposta curta exibida no topo"),
    fontes: z.array(fonteSchema).default([]),
    originalidade: z
      .object({ ferramenta: z.string().nullable(), resultado: z.string().nullable(), verificadoEm: data.nullable() })
      .default({ ferramenta: null, resultado: null, verificadoEm: null }),
    publicadoEm: data.nullable().default(null),
    atualizadoEm: data.nullable().default(null),
    revisarAte: data.nullable().default(null),
    cta: ctaSchema,
    cena: z.string().default("j1"),
    faq: z.array(z.object({ pergunta: z.string(), resposta: z.string() })).default([]),
    relacionados: z.array(z.string()).default([]),
    notasInternas: z.string().optional(),
  })
  .superRefine((a, ctx) => {
    if (a.status === "publicado") {
      for (const campo of ["revisor", "aprovadoPor", "publicadoEm"] as const) {
        if (!a[campo]) ctx.addIssue({ code: "custom", path: [campo], message: `obrigatório para publicar` });
      }
      if (a.fontes.length === 0) ctx.addIssue({ code: "custom", path: ["fontes"], message: "publique com ao menos uma fonte" });
      if (!a.originalidade.verificadoEm)
        ctx.addIssue({ code: "custom", path: ["originalidade"], message: "registre a verificação de originalidade" });
    }
  });
export type ArtigoMeta = z.infer<typeof artigoSchema>;

export const dadoSchema = z
  .object({
    valor: z.string().nullable(),
    estado: z.enum(["verificado", "estimativa", "a-verificar"]),
    fonte: z.string().optional(),
    url: z.string().url().optional(),
    data: data.optional(),
    metodo: z.string().optional(),
  })
  .superRefine((d, ctx) => {
    if (d.estado === "verificado" && (!d.fonte || !d.data || !d.valor))
      ctx.addIssue({ code: "custom", message: "dado verificado precisa de valor, fonte e data" });
    if (d.estado === "estimativa" && (!d.metodo || !d.valor))
      ctx.addIssue({ code: "custom", message: "estimativa precisa de valor e método" });
  });
export type Dado = z.infer<typeof dadoSchema>;

export const CAMPOS_CONDOMINIO = {
  municipio: "Município",
  lotes: "Lotes residenciais",
  loteTipico: "Lote típico",
  taxaCondominial: "Taxa condominial",
  faixaPreco: "Casas à venda",
  faixaAluguel: "Casas para alugar",
  clube: "Clube interno",
  acessoSaoPaulo: "Até a Marginal (pico)",
} as const;
export type CampoCondominio = keyof typeof CAMPOS_CONDOMINIO;

export const condominioSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    nome: z.string(),
    regiao: z.enum(["alphaville", "tambore", "outro"]),
    status: z.enum(STATUS),
    resumo: z.string().min(20),
    paraQuem: z.string().optional(),
    campos: z.record(z.enum(Object.keys(CAMPOS_CONDOMINIO) as [CampoCondominio, ...CampoCondominio[]]), dadoSchema),
    pros: z.array(z.string()).default([]),
    contras: z.array(z.string()).default([]),
    especialista: z.string().nullable().default(null),
    atualizadoEm: data.nullable().default(null),
    revisarAte: data.nullable().default(null),
    cena: z.string().default("c1"),
    notasInternas: z.string().optional(),
  })
  .superRefine((c, ctx) => {
    if (c.status === "publicado") {
      if (c.campos.municipio?.estado !== "verificado")
        ctx.addIssue({ code: "custom", path: ["campos", "municipio"], message: "município verificado é obrigatório" });
      const verificados = Object.values(c.campos).filter((d) => d.estado === "verificado").length;
      if (verificados < 4) ctx.addIssue({ code: "custom", path: ["campos"], message: "publique com ao menos 4 campos verificados" });
      if (!c.atualizadoEm) ctx.addIssue({ code: "custom", path: ["atualizadoEm"], message: "obrigatório para publicar" });
    }
  });
export type Condominio = z.infer<typeof condominioSchema>;

export const autorSchema = z.object({
  slug: z.string(),
  nome: z.string(),
  tipo: z.enum(["pessoa", "equipe"]),
  cargo: z.string(),
  creci: z.string().nullable().default(null),
  bio: z.string(),
  foto: z.string().nullable().default(null),
  sameAs: z.array(z.string().url()).default([]),
});
export type Autor = z.infer<typeof autorSchema>;
