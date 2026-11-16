import Link from "next/link";
import { PaginaSimples } from "@/components/PaginaSimples";
import { CAMPOS_CONDOMINIO } from "@/lib/schema";
import { meta } from "@/lib/seo";

export const metadata = meta({ titulo: "Metodologia: como verificamos e comparamos residenciais", descricao: "Os critérios que usamos para comparar condomínios de Alphaville e Tamboré e o que significa cada selo: verificado, estimativa e em apuração.", caminho: "/metodologia" });

export default function Metodologia() {
  return (
    <PaginaSimples rotulo="Metodologia" titulo="Como verificamos e comparamos" lead="Os mesmos critérios para todos os residenciais, e a origem de cada dado sempre à vista." caminho="/metodologia">
      <div className="prosa">
        <h2>Os três selos</h2>
        <p>Todo dado factual em fichas, tabelas e comparativos leva um selo:</p>
        <ul>
          <li>
            <span className="selo ver">Verificado</span> O dado foi conferido em uma fonte que identificamos, na data indicada. Exemplos de fonte: prefeitura,
            associação do residencial, documento do imóvel, medição feita por nós.
          </li>
          <li>
            <span className="selo est">Estimativa</span> O valor foi calculado por nós a partir de uma amostra ou de um método que descrevemos. Serve como
            referência, não como número oficial.
          </li>
          <li>
            <span className="selo pend">Em apuração</span> Ainda não conseguimos confirmar. Preferimos mostrar o campo vazio a publicar um número sem origem.
          </li>
        </ul>
        <h2>Os critérios de comparação</h2>
        <p>Cada guia de residencial usa a mesma ficha, com estes campos:</p>
        <ul>
          {Object.values(CAMPOS_CONDOMINIO).map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <p>Não publicamos rankings do tipo "o melhor condomínio". O melhor depende do que cada família prioriza, e por isso o comparador deixa você escolher os critérios.</p>
        <h2>Fontes que usamos</h2>
        <ul>
          <li>Fontes primárias em primeiro lugar: prefeituras de Barueri e de Santana de Parnaíba, órgãos estaduais e federais, associações dos residenciais e documentos dos imóveis.</li>
          <li>Dados agregados do atendimento da Alpha DL, sempre sem identificar clientes ou imóveis.</li>
          <li>Medições próprias, como tempos de deslocamento, com data, horário e método informados.</li>
        </ul>
        <p>Anúncios e textos de outros sites servem para entender o que as pessoas procuram, mas não são fonte de dados nem de texto.</p>
        <h2>Prazo de validade</h2>
        <p>Preços, taxas e regras mudam. Cada ficha mostra a data da última atualização e a data prevista para a próxima revisão. A data de atualização só muda quando o conteúdo muda de fato.</p>
        <h2>Temas sensíveis</h2>
        <p>Sobre segurança pública, usamos apenas estatísticas oficiais, com a data e o recorte geográfico. Não classificamos residenciais como "mais seguros" sem um método público que sustente a afirmação.</p>
        <p>
          Quer contestar um dado? Veja como na <Link href="/politica-editorial">política editorial</Link>.
        </p>
      </div>
    </PaginaSimples>
  );
}
