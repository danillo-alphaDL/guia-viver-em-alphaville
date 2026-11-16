import Link from "next/link";
import { listaPilares, pilares } from "@/lib/site";

export function Marca({ className }: { className?: string }) {
  return (
    <Link className={`marca ${className ?? ""}`} href="/" aria-label="Guia Viver em Alphaville, página inicial">
      <small>GUIA</small>
      <span>
        Viver em <i>Alphaville</i>
      </span>
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
