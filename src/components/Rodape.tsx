import Link from "next/link";
import Image from "next/image";
import logoPrincipal from "../../public/branding/logo-principal.png";
import { site } from "@/lib/site";
import { linkAlphaDL } from "@/lib/alphadl";

export function Rodape() {
  return (
    <footer className="rodape">
      <div className="wrap">
        <div className="grade">
          <div>
            <Link className="marca-rodape" href="/" aria-label="Guia Viver em Alphaville, página inicial">
              <Image src={logoPrincipal} alt="Guia Viver em Alphaville" sizes="(max-width: 600px) 92vw, 440px" />
            </Link>
            <p className="sobre">
              {site.dominio} é um projeto editorial mantido pela Alpha DL, imobiliária de alto padrão da região. Não é afiliado à Alphaville Urbanismo S.A. nem às
              associações dos residenciais.
            </p>
          </div>
          <div>
            <h2>Explorar</h2>
            <Link href="/comprar">Comprar</Link>
            <Link href="/alugar">Alugar</Link>
            <Link href="/condominios">Residenciais</Link>
            <Link href="/viver">Viver</Link>
            <Link href="/mercado">Mercado</Link>
          </div>
          <div>
            <h2>Ferramentas</h2>
            <Link href="/ferramentas/custo-de-morar">Custo de morar</Link>
            <Link href="/ferramentas/comparador">Comparador de residenciais</Link>
            <Link href="/selecao-personalizada">Seleção personalizada</Link>
          </div>
          <div>
            <h2>O guia</h2>
            <Link href="/sobre">Sobre e transparência</Link>
            <Link href="/metodologia">Metodologia</Link>
            <Link href="/politica-editorial">Política editorial</Link>
            <Link href="/privacidade">Privacidade (LGPD)</Link>
            <a href={linkAlphaDL("/", { campanha: "rodape", conteudo: "institucional" })} target="_blank" rel="noopener">
              alphadl.com.br
            </a>
          </div>
        </div>
        <div className="legal">
          <span>© {new Date().getFullYear()} {site.nome}. Conteúdo original. Reprodução só com autorização.</span>
          <span>Atendimento imobiliário: Alpha DL</span>
        </div>
      </div>
    </footer>
  );
}
