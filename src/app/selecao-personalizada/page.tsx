import { PaginaSimples } from "@/components/PaginaSimples";
import { FormularioLead } from "@/components/FormularioLead";
import { condominios } from "@/lib/content";
import { meta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = meta({ titulo: "Receba uma seleção de casas em Alphaville para o seu perfil", descricao: "Conte o que procura e um especialista da Alpha DL envia casas de alto padrão em Alphaville e Tamboré que combinam com você. Sem compromisso.", caminho: "/selecao-personalizada" });

export default function Selecao() {
  const residenciais = condominios().filter((c) => !c.rascunho).map((c) => c.nome);
  return (
    <PaginaSimples
      rotulo="Seleção personalizada"
      titulo="Uma seleção de casas para o seu perfil"
      lead="Conte o que procura. Um especialista da Alpha DL responde com casas que combinam com você. Sem compromisso e sem insistência."
      caminho="/selecao-personalizada"
    >
      <FormularioLead residenciais={residenciais} whatsapp={site.whatsapp} />
    </PaginaSimples>
  );
}
