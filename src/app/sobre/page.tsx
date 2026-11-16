import Link from "next/link";
import { PaginaSimples } from "@/components/PaginaSimples";
import { linkAlphaDL } from "@/lib/alphadl";
import { meta } from "@/lib/seo";

export const metadata = meta({ titulo: "Sobre o guia e nossa relação com a Alpha DL", descricao: "Quem faz o Guia Viver em Alphaville, como ele se sustenta e qual é a relação com a Alpha DL, imobiliária de alto padrão da região.", caminho: "/sobre" });

export default function Sobre() {
  return (
    <PaginaSimples rotulo="Sobre" titulo="Quem faz o Guia Viver em Alphaville" lead="Um guia editorial para quem está decidindo morar, comprar ou alugar em Alphaville e Tamboré." caminho="/sobre">
      <div className="prosa">
        <h2>O que é o guia</h2>
        <p>
          O Guia Viver em Alphaville reúne informação para quem está escolhendo onde morar na região de Alphaville e Tamboré, entre Barueri e Santana de Parnaíba,
          em São Paulo. O foco são as casas e os residenciais de alto padrão: como comparar condomínios, quanto custa morar e o que avaliar antes de comprar ou
          alugar.
        </p>
        <h2>Quem mantém</h2>
        <p>
          O guia é um projeto editorial mantido pela{" "}
          <a href={linkAlphaDL("/", { campanha: "institucional", conteudo: "sobre" })} target="_blank" rel="noopener">
            Alpha DL
          </a>
          , imobiliária de alto padrão que atua na região. Dizemos isso com clareza porque você tem o direito de saber quem está por trás da informação que lê.
        </p>
        <h2>Como o guia se sustenta</h2>
        <p>
          Quando um leitor pede para ver imóveis ou falar com um especialista, o atendimento é feito pela Alpha DL. Essa é a única relação comercial do guia. Não
          vendemos espaço publicitário, não publicamos conteúdo patrocinado e não recebemos de condomínios, associações ou incorporadoras para falar deles.
        </p>
        <h2>O que você pode esperar</h2>
        <ul>
          <li>Dados com fonte e data. O que é estimativa aparece marcado como estimativa.</li>
          <li>Vantagens e limitações de cada residencial, e não só elogios.</li>
          <li>Nenhuma pressão: sem contagem regressiva, sem falsa escassez, sem pop-ups.</li>
          <li>Correção pública quando erramos.</li>
        </ul>
        <p>
          Os detalhes estão na <Link href="/metodologia">metodologia</Link> e na <Link href="/politica-editorial">política editorial</Link>.
        </p>
        <h2>Independência de marca</h2>
        <p>
          Este site não é afiliado à Alphaville Urbanismo S.A. nem às associações dos residenciais. "Alphaville" é usado aqui para designar a região onde ficam os
          residenciais.
        </p>
      </div>
    </PaginaSimples>
  );
}
