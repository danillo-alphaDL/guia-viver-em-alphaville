import Link from "next/link";

export const metadata = { title: "Página não encontrada", robots: { index: false } };

export default function NaoEncontrada() {
  return (
    <section className="pg-simples erro404">
      <div className="wrap">
        <span className="rot dourado">Erro 404</span>
        <h1>Esta página não existe ou mudou de endereço.</h1>
        <p className="lead">Comece pelos guias dos residenciais ou volte para a página inicial.</p>
        <div className="acoes" style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 34 }}>
          <Link className="btn cheio" href="/condominios">
            Ver residenciais
          </Link>
          <Link className="btn" href="/">
            Página inicial
          </Link>
        </div>
      </div>
    </section>
  );
}
