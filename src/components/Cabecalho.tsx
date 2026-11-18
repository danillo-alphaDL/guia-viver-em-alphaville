import Image from "next/image";
import Link from "next/link";
import { listaPilares, pilares } from "@/lib/site";
import logoCabecalho from "../../public/branding/logo-cabecalho.png";

/**
 * Letreiro do cabeçalho: "GUIA" e o nome, da versão transparente do kit (public/branding/).
 * O slogan fica de fora aqui porque, na altura do cabeçalho, sairia com cerca de 4 px; ele aparece
 * no logo completo do rodapé. A altura vem do CSS e a largura acompanha, sem distorcer.
 */
export function Marca({ className }: { className?: string }) {
  return (
    <Link className={`marca ${className ?? ""}`} href="/" aria-label="Guia Viver em Alphaville, página inicial">
      <Image src={logoCabecalho} alt="Guia Viver em Alphaville" loading="eager" sizes="(max-width: 600px) 220px, 300px" />
    </Link>
  );
}

export function Cabecalho() {
  const links = [...listaPilares.map((p) => ({ href: `/${p}`, nome: pilares[p].menu })), { href: "/ferramentas", nome: "Ferramentas" }];
  return (
    <header className="topo">
      <div className="wrap">
        <Marca />
        <nav className="menu" aria-label="Principal">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.nome}
            </Link>
          ))}
        </nav>
        <Link className="contato" href="/selecao-personalizada">
          Falar com a Alpha DL
        </Link>
        <details className="menu-movel">
          <summary aria-label="Abrir menu">Menu</summary>
          <nav aria-label="Principal (celular)">
            {links.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.nome}
              </Link>
            ))}
            <Link href="/selecao-personalizada">Falar com a Alpha DL</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
