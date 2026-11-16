import { PaginaSimples } from "@/components/PaginaSimples";
import { meta } from "@/lib/seo";

export const metadata = meta({ titulo: "Política de privacidade (LGPD)", descricao: "Quais dados o Guia Viver em Alphaville coleta, para que servem, com quem são compartilhados e como exercer seus direitos previstos na LGPD.", caminho: "/privacidade" });

export default function Privacidade() {
  return (
    <PaginaSimples rotulo="Privacidade" titulo="Política de privacidade" lead="Coletamos o mínimo necessário, e só quando você decide falar com a gente." caminho="/privacidade">
      <div className="prosa">
        <h2>Quem é o responsável</h2>
        <p>O Guia Viver em Alphaville é mantido pela Alpha DL, que é a controladora dos dados pessoais tratados neste site, nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018).</p>
        <h2>Navegar sem se identificar</h2>
        <p>Você pode ler todo o conteúdo e usar as ferramentas sem informar nenhum dado pessoal. O simulador de custo faz as contas no seu navegador, e os valores que você digita não são enviados para nós.</p>
        <h2>Dados que você nos envia</h2>
        <p>Quando você preenche o formulário de seleção personalizada, recebemos: nome, e-mail ou WhatsApp, objetivo (comprar, alugar ou investir), faixa de investimento, prazo, residenciais de interesse e as observações que você escrever. Também registramos a página de origem do contato.</p>
        <p>Usamos esses dados para uma única finalidade: que um especialista da Alpha DL entre em contato sobre imóveis que correspondam ao seu pedido. A base legal é o seu consentimento, dado ao marcar a autorização no formulário.</p>
        <h2>Medição de audiência</h2>
        <p>Com a sua autorização, usamos o Google Analytics para saber quais páginas são lidas e quais ferramentas são usadas. Sem autorização, nenhum cookie de medição é gravado. Não usamos cookies de publicidade.</p>
        <h2>Compartilhamento</h2>
        <p>Os dados do formulário são encaminhados ao sistema de atendimento da Alpha DL. Não vendemos nem cedemos dados pessoais a terceiros para fins de marketing. Fornecedores de infraestrutura (hospedagem e medição) tratam dados em nosso nome.</p>
        <h2>Por quanto tempo guardamos</h2>
        <p>Os dados de contato ficam guardados enquanto durar o atendimento e pelo prazo necessário para cumprir obrigações legais. Você pode pedir a exclusão a qualquer momento.</p>
        <h2>Seus direitos</h2>
        <p>Você pode confirmar se tratamos seus dados, acessar, corrigir, pedir a exclusão, revogar o consentimento e solicitar a portabilidade. Para exercer esses direitos, use os canais de atendimento da Alpha DL em alphadl.com.br.</p>
        <h2>Atualizações</h2>
        <p>Esta política pode ser atualizada. A versão em vigor é sempre a publicada nesta página.</p>
      </div>
    </PaginaSimples>
  );
}
