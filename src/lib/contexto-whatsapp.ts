/**
 * O que o botão flutuante e a barra de rodapé dizem em cada página, e a mensagem que o
 * WhatsApp abre já escrita. Fonte única, pura (sem React), testada por `npm run testar-whatsapp`.
 *
 * Regras:
 * - A mensagem é escrita em nome de quem clica: diz de onde a pessoa veio e o que ela
 *   estava lendo, para ela não precisar explicar e para a Alpha DL saber a origem.
 * - O texto da barra responde à pergunta que a pessoa tem NAQUELA página. Nada de urgência
 *   falsa ("últimas unidades", contagem regressiva): o guia promete critério, não pressão.
 * - Página sem contexto próprio cai na mensagem geral, nunca num texto que não condiz.
 */
import type { Pilar } from "./site";

export type ContextoPagina =
  | { tipo: "artigo"; titulo: string; pilar: Pilar }
  | { tipo: "residencial"; nome: string };

/** Contextos conhecidos por caminho ("/condominios/genesis-ii" → residencial). Montado no servidor. */
export type MapaContextos = Record<string, ContextoPagina>;

export type Chamada = {
  /** Identifica a página nos eventos do GA4 (page_type). */
  tipo: string;
  /** Frase da barra: a pergunta da pessoa naquela página. */
  titulo: string;
  /** Linha de apoio, curta. */
  apoio: string;
  /** Texto do botão. */
  botao: string;
  /** Mensagem que abre no WhatsApp, em nome de quem clica. */
  mensagem: string;
  /** Página onde a barra não aparece (o botão flutuante continua). */
  semBarra?: boolean;
};

const ORIGEM = "no Guia Viver em Alphaville";

const PILARES: Record<Pilar, Omit<Chamada, "tipo">> = {
  comprar: {
    titulo: "Vai comprar casa em Alphaville?",
    apoio: "Diga o que procura e receba as casas que fazem sentido, inclusive as que não estão anunciadas.",
    botao: "Ver opções no WhatsApp",
    mensagem: `Olá! Estou pensando em comprar casa em Alphaville e vim pela seção Comprar ${ORIGEM}. Posso contar o que procuro?`,
  },
  alugar: {
    titulo: "Procurando casa para alugar?",
    apoio: "Receba opções com o custo mensal completo: aluguel, condomínio e IPTU.",
    botao: "Ver casas para alugar",
    mensagem: `Olá! Procuro casa para alugar em Alphaville e vim pela seção Alugar ${ORIGEM}. Posso contar o que preciso?`,
  },
  condominios: {
    titulo: "Em dúvida entre residenciais?",
    apoio: "Compare com quem conhece cada alameda: rotina, custos e casas à venda em cada um.",
    botao: "Comparar no WhatsApp",
    mensagem: `Olá! Estou comparando residenciais de Alphaville ${ORIGEM} e queria ajuda para escolher.`,
  },
  viver: {
    titulo: "Pensando em se mudar para Alphaville?",
    apoio: "Tire as dúvidas sobre escolas, trajeto e rotina com quem vive a região.",
    botao: "Tirar dúvidas no WhatsApp",
    mensagem: `Olá! Estou pensando em me mudar para Alphaville e vim pela seção Viver ${ORIGEM}. Tenho algumas dúvidas.`,
  },
  mercado: {
    titulo: "Quer saber quanto pedem as casas que te interessam?",
    apoio: "Peça os anúncios comparáveis do residencial e da faixa que você está olhando.",
    botao: "Pedir no WhatsApp",
    mensagem: `Olá! Vim pela seção Mercado ${ORIGEM} e queria ver quanto pedem as casas parecidas com a que me interessa.`,
  },
};

const GERAL: Omit<Chamada, "tipo"> = {
  titulo: "Procurando casa em Alphaville?",
  apoio: "Conte o que você busca e receba uma seleção, inclusive de casas que não estão anunciadas.",
  botao: "Falar no WhatsApp",
  mensagem: `Olá! Vim pelo Guia Viver em Alphaville e quero ajuda para encontrar uma casa.`,
};

/** Tira barra final e query; "/" continua "/". */
function normalizar(caminho: string): string {
  const semQuery = caminho.split(/[?#]/)[0] || "/";
  return semQuery.length > 1 ? semQuery.replace(/\/+$/, "") : "/";
}

export function chamadaPara(caminhoBruto: string, mapa: MapaContextos = {}): Chamada {
  const caminho = normalizar(caminhoBruto);
  const ctx = mapa[caminho];

  if (ctx?.tipo === "residencial") {
    return {
      tipo: "residencial",
      titulo: `Quer ver as casas à venda no ${ctx.nome}?`,
      apoio: "Fotos, detalhes e as casas que ainda não chegaram aos portais, direto com quem atende a região.",
      botao: "Ver casas no WhatsApp",
      mensagem: `Olá! Li o guia do ${ctx.nome} ${ORIGEM} e quero ver as casas disponíveis lá.`,
    };
  }
  if (ctx?.tipo === "artigo") {
    return {
      tipo: "artigo",
      titulo: "Ficou alguma dúvida sobre o seu caso?",
      apoio: "Um especialista responde com base no que você leu, sem compromisso.",
      botao: "Perguntar no WhatsApp",
      mensagem: `Olá! Li o artigo "${ctx.titulo}" ${ORIGEM} e queria tirar uma dúvida.`,
    };
  }

  if (caminho === "/") return { tipo: "home", ...GERAL };

  const [primeiro, segundo] = caminho.slice(1).split("/");
  if (primeiro && primeiro in PILARES && !segundo) return { tipo: `pilar-${primeiro}`, ...PILARES[primeiro as Pilar] };

  if (primeiro === "ferramentas") {
    return {
      tipo: segundo ? `ferramenta-${segundo}` : "ferramentas",
      titulo: "Fez a conta? Transforme o resultado em opções reais.",
      apoio: "Mande o resultado e receba as casas que cabem nele.",
      botao: "Enviar no WhatsApp",
      mensagem: segundo
        ? `Olá! Usei a ferramenta ${segundo === "custo-de-morar" ? "Custo de morar" : segundo === "comparador" ? "Comparador de residenciais" : segundo} ${ORIGEM} e queria conversar sobre o resultado.`
        : `Olá! Vim pelas ferramentas ${ORIGEM} e queria ajuda para decidir.`,
    };
  }

  // O formulário já é o contato: a barra competiria com ele.
  if (primeiro === "selecao-personalizada") return { tipo: "selecao-personalizada", ...GERAL, semBarra: true };

  return { tipo: primeiro || "outra", ...GERAL };
}
