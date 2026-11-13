import Link from "next/link";
import { LinkRastreado } from "./LinkRastreado";
import { linkAlphaDL, linkWhatsApp } from "@/lib/alphadl";

type Tipo = "selecao-personalizada" | "especialista" | "imoveis-alphadl" | "ferramenta-custo" | "comparador";

const TEXTOS: Record<Tipo, { titulo: string; texto: string; botao: string }> = {
  "selecao-personalizada": {
    titulo: "Receba uma seleção para o seu perfil",
    texto: "Conte o que procura e um especialista da Alpha DL envia casas que combinam com você, inclusive as que ainda não foram anunciadas.",
    botao: "Receber uma seleção",
  },
  especialista: {
    titulo: "Converse com quem conhece a região",
    texto: "Um especialista da Alpha DL compara oportunidades reais nos residenciais que combinam com você. Sem compromisso.",
    botao: "Conversar com um especialista",
  },
  "imoveis-alphadl": {
    titulo: "Veja casas disponíveis",
    texto: "A Alpha DL apresenta as casas à venda e para alugar, com visitas acompanhadas por um corretor.",
    botao: "Ver casas na Alpha DL",
  },
  "ferramenta-custo": {
    titulo: "Faça a conta do seu custo mensal",
    texto: "Some aluguel ou manutenção, condomínio, IPTU e despesas da casa. Sem cadastro.",
    botao: "Simular custo de morar",
  },
  comparador: {
    titulo: "Compare residenciais lado a lado",
    texto: "Os mesmos critérios para todos, com fonte e data em cada dado.",
    botao: "Abrir o comparador",
  },
};

export function Cta({ tipo, origem, contexto }: { tipo: Tipo; origem: string; contexto?: string }) {
  const t = TEXTOS[tipo];
  const principal =
    tipo === "imoveis-alphadl"
      ? linkAlphaDL("/", { campanha: "cta-artigo", conteudo: origem })
      : tipo === "ferramenta-custo"
        ? "/ferramentas/custo-de-morar"
        : tipo === "comparador"
          ? "/ferramentas/comparador"
          : `/selecao-personalizada?origem=${encodeURIComponent(origem)}`;
  const whats = linkWhatsApp(`Olá! Vim do Guia Viver em Alphaville (${origem})${contexto ? ` e tenho interesse em ${contexto}` : ""}.`);
  return (
    <aside className="cta-art" aria-label="Próximo passo">
      <span className="rot dourado">Próximo passo</span>
      <h2>{t.titulo}</h2>
      <p>{t.texto}</p>
      <div className="acoes">
        <LinkRastreado className="btn cheio" href={principal} ctaId={`${tipo}:${origem}`} evento={tipo === "imoveis-alphadl" ? "outbound_alphadl" : "cta_click"}>
          {t.botao}
        </LinkRastreado>
        {whats ? (
          <LinkRastreado className="btn" href={whats} ctaId={`whatsapp:${origem}`} evento="whatsapp_click">
            WhatsApp
          </LinkRastreado>
        ) : tipo !== "selecao-personalizada" ? (
          <Link className="btn" href={`/selecao-personalizada?origem=${encodeURIComponent(origem)}`}>
            Falar com a Alpha DL
          </Link>
        ) : null}
      </div>
    </aside>
  );
}
