import { z } from "zod";

export const FAIXAS = [
  "Até R$ 3 milhões",
  "De R$ 3 a 6 milhões",
  "De R$ 6 a 12 milhões",
  "De R$ 12 a 20 milhões",
  "Acima de R$ 20 milhões",
  "Locação até R$ 20 mil/mês",
  "Locação de R$ 20 a 40 mil/mês",
  "Locação acima de R$ 40 mil/mês",
] as const;

export const PRAZOS = ["Até 3 meses", "De 3 a 6 meses", "De 6 a 12 meses", "Mais de 12 meses", "Só pesquisando"] as const;

export const leadSchema = z
  .object({
    objetivo: z.enum(["comprar", "alugar", "investir"]),
    faixa: z.enum(FAIXAS),
    prazo: z.enum(PRAZOS),
    interesse: z.string().max(300).optional().default(""),
    quartos: z.string().max(20).optional().default(""),
    observacoes: z.string().max(1500).optional().default(""),
    nome: z.string().trim().min(2, "Informe seu nome").max(120),
    email: z.string().trim().email("E-mail inválido").max(200).optional().or(z.literal("")),
    whatsapp: z
      .string()
      .trim()
      .regex(/^[\d\s()+-]{10,20}$/, "WhatsApp inválido")
      .optional()
      .or(z.literal("")),
    consentimento: z.literal(true, { message: "É preciso autorizar o contato" }),
    origem: z.string().max(200).optional().default(""),
    utm: z.record(z.string(), z.string().max(200)).optional().default({}),
    site: z.string().max(0).optional().default(""), // honeypot: precisa ficar vazio
  })
  .refine((d) => d.email || d.whatsapp, { message: "Informe e-mail ou WhatsApp", path: ["email"] });

export type Lead = z.infer<typeof leadSchema>;

/** Regra inicial de qualificação (MQL). Ajustar com o time comercial da Alpha DL. */
export function qualificar(l: Lead): "mql" | "lead" {
  const faixaAlta = !l.faixa.startsWith("Até R$ 3") && l.faixa !== "Locação até R$ 20 mil/mês";
  const prazoCurto = l.prazo !== "Mais de 12 meses" && l.prazo !== "Só pesquisando";
  return faixaAlta && prazoCurto ? "mql" : "lead";
}
