import Link from "next/link";
import { PaginaSimples } from "@/components/PaginaSimples";
import { meta } from "@/lib/seo";

export const metadata = meta({ titulo: "Ferramentas para decidir onde morar em Alphaville", descricao: "Simule o custo de morar, compare residenciais lado a lado e peça uma seleção de casas para o seu perfil. Gratuito e sem cadastro obrigatório.", caminho: "/ferramentas" });

export default function Ferramentas() {
  return (
    <PaginaSimples titulo="Ferramentas" lead="Para fazer as contas e comparar com calma. O resultado sempre aparece sem cadastro." caminho="/ferramentas">
      <div className="ferramentas">
        <Link className="ferramenta-card" href="/ferramentas/custo-de-morar">
          <span className="rot bronze">Simulador</span>
          <h2>Custo de morar</h2>
          <p>Aluguel ou manutenção, condomínio, IPTU e despesas da casa em um total mensal e anual.</p>
        </Link>
        <Link className="ferramenta-card" href="/ferramentas/comparador">
          <span className="rot bronze">Comparador</span>
          <h2>Residenciais lado a lado</h2>
          <p>Os mesmos critérios para todos os condomínios, com fonte e data em cada dado.</p>
        </Link>
        <Link className="ferramenta-card" href="/selecao-personalizada">
          <span className="rot bronze">Atendimento</span>
          <h2>Seleção personalizada</h2>
          <p>Conte o que procura e receba casas escolhidas por um especialista da Alpha DL.</p>
        </Link>
      </div>
    </PaginaSimples>
  );
}
