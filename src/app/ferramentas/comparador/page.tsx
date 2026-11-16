import { PaginaSimples } from "@/components/PaginaSimples";
import { Comparador } from "@/components/Comparador";
import { Cta } from "@/components/Cta";
import { condominios } from "@/lib/content";
import { CAMPOS_CONDOMINIO } from "@/lib/schema";
import { meta } from "@/lib/seo";

export const metadata = meta({ titulo: "Comparador de condomínios de Alphaville e Tamboré", descricao: "Compare residenciais de Alphaville e Tamboré lado a lado: lotes, taxa condominial, faixas de preço e acesso, com fonte e data em cada dado.", caminho: "/ferramentas/comparador" });

export default function PaginaComparador() {
  const itens = condominios().map((c) => ({ slug: c.slug, nome: c.nome, url: c.url, campos: c.campos }));
  return (
    <PaginaSimples
      rotulo="Comparador"
      titulo="Compare residenciais lado a lado"
      lead="Os mesmos critérios para todos, com fonte e data em cada dado. Escolha o que importa para você."
      caminho="/ferramentas/comparador"
      pai={{ nome: "Ferramentas", caminho: "/ferramentas" }}
    >
      <div className="pilha">
        <Comparador itens={itens} rotulos={CAMPOS_CONDOMINIO} />
        <Cta tipo="especialista" origem="comparador" />
      </div>
    </PaginaSimples>
  );
}
