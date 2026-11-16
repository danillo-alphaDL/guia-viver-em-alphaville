import { PaginaSimples } from "@/components/PaginaSimples";
import { CustoCalculadora } from "@/components/CustoCalculadora";
import { JsonLd } from "@/components/JsonLd";
import { meta } from "@/lib/seo";
import { site } from "@/lib/site";

const descricao = "Simulador gratuito do custo mensal e anual de morar em uma casa em Alphaville: aluguel, condomínio, IPTU, manutenção e despesas. Sem cadastro.";
export const metadata = meta({ titulo: "Quanto custa morar em Alphaville: simulador de custo mensal", descricao, caminho: "/ferramentas/custo-de-morar" });

export default function CustoDeMorar() {
  return (
    <PaginaSimples
      rotulo="Custo de morar"
      titulo="Quanto custa morar em Alphaville"
      lead="Preencha com os valores do imóvel que você está avaliando. Nada é enviado: a conta é feita no seu navegador."
      caminho="/ferramentas/custo-de-morar"
      pai={{ nome: "Ferramentas", caminho: "/ferramentas" }}
    >
      <CustoCalculadora />
      <div className="prosa" style={{ marginTop: 80 }}>
        <h2>Como usar o simulador</h2>
        <p>
          O custo de morar em uma casa de alto padrão vai além do aluguel ou da parcela. Some sempre quatro grupos: a taxa do condomínio (ou da associação do
          residencial), o IPTU, a manutenção da casa (jardim, piscina, reparos) e as despesas de operação (energia, água, funcionários, seguro).
        </p>
        <p>
          Use valores do imóvel real: peça à imobiliária o último boleto do condomínio e o carnê do IPTU. O simulador não sugere valores médios porque eles variam
          muito entre residenciais e entre casas do mesmo residencial.
        </p>
      </div>
      <JsonLd dados={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Simulador de custo de morar em Alphaville", url: `${site.url}/ferramentas/custo-de-morar`, applicationCategory: "FinanceApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: 0, priceCurrency: "BRL" }, description: descricao }} />
    </PaginaSimples>
  );
}
