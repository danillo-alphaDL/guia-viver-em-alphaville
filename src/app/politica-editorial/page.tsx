import Link from "next/link";
import { PaginaSimples } from "@/components/PaginaSimples";
import { meta } from "@/lib/seo";

export const metadata = meta({ titulo: "Política editorial e correções", descricao: "Como produzimos, revisamos e corrigimos o conteúdo do Guia Viver em Alphaville, e como usamos inteligência artificial.", caminho: "/politica-editorial" });

export default function PoliticaEditorial() {
  return (
    <PaginaSimples rotulo="Política editorial" titulo="Política editorial e correções" lead="As regras que seguimos antes de publicar qualquer página." caminho="/politica-editorial">
      <div className="prosa">
        <h2>Antes de publicar</h2>
        <p>Cada conteúdo passa por seis etapas: pesquisa em fontes confiáveis, definição do que ele acrescenta de original, redação, verificação de similaridade com outros textos, checagem dos fatos e revisão final. Um conteúdo só vai ao ar com autor, revisor e fontes identificados.</p>
        <h2>O que não fazemos</h2>
        <ul>
          <li>Não copiamos nem reescrevemos textos de outros sites.</li>
          <li>Não inventamos visitas, entrevistas, depoimentos ou experiências.</li>
          <li>Não publicamos números sem fonte.</li>
          <li>Não criamos páginas em série trocando só o nome do condomínio.</li>
          <li>Não usamos fotos sem licença ou autorização.</li>
        </ul>
        <h2>Uso de inteligência artificial</h2>
        <p>Usamos ferramentas de IA para apoiar pesquisa, organização e redação. Fatos, números e avaliações são conferidos por pessoas antes da publicação, e a responsabilidade pelo conteúdo é de quem assina e de quem revisa.</p>
        <h2>Autoria</h2>
        <p>Os autores e revisores são pessoas reais, identificadas em páginas próprias. Corretores informam o número do CRECI.</p>
        <h2>Relação comercial</h2>
        <p>
          O guia é mantido pela Alpha DL. Links e chamadas para o atendimento da imobiliária são identificados como tal. Saiba mais em <Link href="/sobre">Sobre</Link>.
        </p>
        <h2>Correções</h2>
        <p>
          Se você encontrou um erro, é morador ou representa a associação de um residencial e quer corrigir um dado, fale com a gente pelo{" "}
          <Link href="/selecao-personalizada?origem=correcao">formulário de contato</Link>, indicando a página e a fonte da informação correta. Corrigimos erros
          confirmados e registramos a data da atualização na própria página.
        </p>
      </div>
    </PaginaSimples>
  );
}
